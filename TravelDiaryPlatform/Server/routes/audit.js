const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const TravelNote = require('../models/TravelNote');
const AuditRecord = require('../models/AuditRecord');
const User = require('../models/User');

// 权限验证中间件（审核员和管理员都可访问）
const authAudit = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '请提供有效的认证令牌' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    // 验证用户是否存在
    const user = await User.findById(req.userId);
    if (!user || !['auditor', 'admin'].includes(user.role)) {
      return res.status(403).json({ message: '无审核权限' });
    }

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '令牌无效或已过期' });
    }
    next(err);
  }
};

// 管理员权限验证中间件
const authAdmin = async (req, res, next) => {
  try {
    // 先执行通用审核权限验证
    await new Promise((resolve, reject) => {
      authAudit(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // 再验证是否为管理员
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: '仅管理员可执行此操作' });
    }

    next();
  } catch (err) {
    next(err);
  }
};

// 验证ObjectId格式
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// 1. 获取审核列表（待审核/已通过/未通过）
router.get('/list', authAudit, async (req, res, next) => {
  try {
    const {
      status = 'pending',
      showDeleted = 'false',
      page = 1,
      pageSize = 10,
      keyword = ''
    } = req.query;

    // 验证分页参数
    const pageNum = parseInt(page, 10);
    const size = parseInt(pageSize, 10);
    if (isNaN(pageNum) || isNaN(size) || pageNum < 1 || size < 1) {
      return res.status(400).json({ message: '无效的分页参数' });
    }

    // 构建查询条件
    const query = { status };

    // 处理已删除记录的显示
    if (showDeleted === 'true') {
      query.deleted = { $in: [true, false] };
    }

    // 处理搜索关键词
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } }
      ];
    }

    // 执行查询
    const skip = (pageNum - 1) * size;
    const total = await TravelNote.countDocuments(query);
    const notes = await TravelNote.find(query)
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size)
      .lean(); // 转换为普通JS对象，提高性能

    res.status(200).json({
      list: notes,
      pagination: {
        total,
        page: pageNum,
        pageSize: size,
        totalPages: Math.ceil(total / size)
      }
    });
  } catch (err) {
    next(err);
  }
});

// 2. 审核操作（通过/拒绝）
router.post('/operate', authAudit, async (req, res, next) => {
  try {
    const { noteId, action, reason = '' } = req.body;

    // 参数验证
    if (!noteId || !action) {
      return res.status(400).json({ message: '游记ID和操作类型为必填项' });
    }

    if (!isValidObjectId(noteId)) {
      return res.status(400).json({ message: '无效的游记ID' });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: '无效的操作类型' });
    }

    // 拒绝操作必须提供原因
    if (action === 'reject' && !reason.trim()) {
      return res.status(400).json({ message: '拒绝审核必须填写原因' });
    }

    // 查询游记
    const note = await TravelNote.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: '游记不存在或已被删除' });
    }

    // 如果已经审核过，提示用户
    if (note.status !== 'pending') {
      return res.status(400).json({ message: '该游记已完成审核，不可重复操作' });
    }

    // 更新游记状态
    note.status = action === 'approve' ? 'approved' : 'rejected';
    if (action === 'reject') {
      note.rejectReason = reason.trim();
    }
    await note.save();

    // 记录审核操作
    const auditRecord = new AuditRecord({
      noteId,
      auditorId: req.userId,
      action,
      reason: action === 'reject' ? reason.trim() : ''
    });
    await auditRecord.save();

    res.status(200).json({
      message: `审核${action === 'approve' ? '通过' : '拒绝'}成功`,
      status: note.status
    });
  } catch (err) {
    next(err);
  }
});

// 3. 获取单篇游记详情（用于审核查看）
router.get('/detail/:noteId', authAudit, async (req, res, next) => {
  try {
    const { noteId } = req.params;

    if (!isValidObjectId(noteId)) {
      return res.status(400).json({ message: '无效的游记ID' });
    }

    // 查询时包含已删除的记录
    const note = await TravelNote.findOne({
      _id: noteId,
      deleted: { $in: [true, false] }
    }).populate('userId', 'username');

    if (!note) {
      return res.status(404).json({ message: '游记不存在' });
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
});

// 4. 管理员逻辑删除游记
router.delete('/delete/:noteId', authAdmin, async (req, res, next) => {
  try {
    const { noteId } = req.params;

    if (!isValidObjectId(noteId)) {
      return res.status(400).json({ message: '无效的游记ID' });
    }

    const note = await TravelNote.findOne({
      _id: noteId,
      deleted: false
    });

    if (!note) {
      return res.status(404).json({ message: '游记不存在或已被删除' });
    }

    // 执行逻辑删除
    note.deleted = true;
    note.deletedAt = new Date();
    await note.save();

    res.status(200).json({ message: '游记已标记为删除' });
  } catch (err) {
    next(err);
  }
});

// 5. 管理员批量逻辑删除游记
router.delete('/batch-delete', authAdmin, async (req, res, next) => {
  try {
    const { noteIds } = req.body;

    if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({ message: '请提供有效的游记ID列表' });
    }

    // 验证所有ID是否有效
    const invalidIds = noteIds.filter(id => !isValidObjectId(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ message: `无效的游记ID: ${invalidIds.join(', ')}` });
    }

    // 批量更新
    const result = await TravelNote.updateMany(
      {
        _id: { $in: noteIds },
        deleted: false
      },
      {
        deleted: true,
        deletedAt: new Date()
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: '未找到可删除的游记' });
    }

    res.status(200).json({
      message: `成功标记${result.modifiedCount}篇游记为删除状态`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    next(err);
  }
});

// 6. 管理员恢复已删除的游记
router.post('/restore/:noteId', authAdmin, async (req, res, next) => {
  try {
    const { noteId } = req.params;

    if (!isValidObjectId(noteId)) {
      return res.status(400).json({ message: '无效的游记ID' });
    }

    const note = await TravelNote.findOne({
      _id: noteId,
      deleted: true
    });

    if (!note) {
      return res.status(404).json({ message: '未找到已删除的游记' });
    }

    // 恢复游记
    note.deleted = false;
    note.deletedAt = null;
    await note.save();

    res.status(200).json({ message: '游记已恢复' });
  } catch (err) {
    next(err);
  }
});

// 7. 获取审核记录
router.get('/records/:noteId', authAudit, async (req, res, next) => {
  try {
    const { noteId } = req.params;

    if (!isValidObjectId(noteId)) {
      return res.status(400).json({ message: '无效的游记ID' });
    }

    const records = await AuditRecord.find({ noteId }).sort({ operateTime: -1 });

    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
