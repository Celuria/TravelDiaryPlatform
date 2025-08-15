const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const TravelNote = require('../models/TravelNote');
const User = require('../models/User');

// 验证用户登录状态（所有已登录用户均可提交游记）
const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '请先登录' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // 验证用户存在
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: '身份验证失败' });
  }
};

// 提交游记接口（供前端页面调用）
router.post('/submit', authUser, async (req, res, next) => {
  try {
    const { title, content, images, video } = req.body;

    // 基础参数校验
    if (!title || !content) {
      return res.status(400).json({ message: '标题和内容为必填项' });
    }
    if (title.length > 200) {
      return res.status(400).json({ message: '标题长度不能超过200字' });
    }

    // 创建游记（自动标记为待审核）
    const newNote = new TravelNote({
      title,
      content,
      images: images || [], // 可选：图片URL数组
      video: video || null, // 可选：视频URL
      userId: req.userId, // 关联提交者
      status: 'pending', // 默认为待审核状态
      deleted: false
    });

    await newNote.save();

    res.status(201).json({
      message: '游记提交成功，等待审核',
      noteId: newNote._id,
      status: newNote.status
    });
  } catch (err) {
    next(err);
  }
});

// 获取当前用户提交的游记列表（供用户查看自己的提交记录）
router.get('/my-notes', authUser, async (req, res, next) => {
  try {
    const notes = await TravelNote.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(notes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;