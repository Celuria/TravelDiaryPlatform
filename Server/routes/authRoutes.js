//用户路由
const express = require('express');
const router = express.Router();
const { uploadAvatar } = require('../controllers/fileController');
const fs = require('fs');
const path = require('path');

// 加载数据
let data = require('../models/data.json');
const { users } = data;

// 保存数据到文件
function saveDataToFile() {
  fs.writeFileSync(path.join(__dirname, '../models/data.json'), JSON.stringify(data, null, 2));
}

// 注册用户
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // 检查用户名是否已存在
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ msg: '用户名已存在' });
  }

  const id = Date.now(); // 使用时间戳作为用户 ID
  users[id] = { id, username, password };

  // 保存数据到文件
  saveDataToFile();

  res.json({ msg: '注册成功', userId: id });
});

// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = Object.values(users).find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(400).json({ msg: '用户名或密码错误' });
  }

  res.json({ token: `token-${user.id}`, userId: user.id });
});

// 用户头像上传
router.post('/upload-avatar', uploadAvatar, (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ message: '未上传文件' });
  }
  res.json({ message: '头像上传成功', avatarPath: file.path });
});

module.exports = router;