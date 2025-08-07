const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 注册接口
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: '用户已存在' });

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: '注册成功' });
  } catch (err) {
    res.status(500).json({ message: '注册失败' });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: '用户不存在' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: '密码错误' });

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: '登录失败' });
  }
});

module.exports = router;
