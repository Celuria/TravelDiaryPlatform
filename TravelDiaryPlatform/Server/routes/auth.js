const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 注册接口
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    // 参数验证
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 验证角色
    if (role && !['auditor', 'admin'].includes(role)) {
      return res.status(400).json({ message: '无效的角色类型' });
    }

    // 创建新用户
    const user = new User({
      username,
      password,
      role: role || 'auditor'
    });

    await user.save();
    res.status(201).json({ message: '注册成功' });
  } catch (err) {
    next(err); // 传递给全局错误处理
  }
});

// 登录接口
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 参数验证
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        timestamp: user.timestamp
      }
    });
  } catch (err) {
    next(err);
  }
});

// 获取当前用户信息
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '请先登录' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
