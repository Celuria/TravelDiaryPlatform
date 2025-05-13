//游记路由
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 加载数据
let data = require('../models/data.json');
const { travelNotes } = data;

// 保存数据到文件
function saveDataToFile() {
  fs.writeFileSync(path.join(__dirname, '../models/data.json'), JSON.stringify(data, null, 2));
}

// 发布游记
router.post('/notes', (req, res) => {
  const { title, content, userId } = req.body;

  if (!Object.values(data.users).some(user => user.id === userId)) {
    return res.status(400).json({ msg: '无效用户' });
  }

  const id = Date.now(); // 使用时间戳作为游记 ID
  const note = {
    id,
    title,
    content,
    userId,
    created_at: new Date().toISOString()
  };

  travelNotes[id] = note;

  // 保存数据到文件
  saveDataToFile();

  res.json({ msg: '发布成功', note });
});

//权限验证
router.use(authenticate);

// 获取所有游记
router.get('/notes', (req, res) => {
  res.json(Object.values(travelNotes));
});

// 获取用户的游记
router.get('/notes/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const notes = Object.values(travelNotes).filter(note => note.userId === userId);
  res.json(notes);
});

// 获取单篇游记
router.get('/notes/:id', (req, res) => {
  const note = travelNotes[req.params.id];
  if (!note) return res.status(404).json({ msg: '游记不存在' });
  res.json(note);
});

// 删除游记
router.delete('/notes/:id', (req, res) => {
  const id = req.params.id;
  if (!travelNotes[id]) return res.status(404).json({ msg: '游记不存在' });

  delete travelNotes[id];

  // 保存数据到文件
  saveDataToFile();

  res.json({ msg: '删除成功' });
});

// 编辑游记
router.put('/notes/:id', (req, res) => {
  const id = req.params.id;
  const note = travelNotes[id];
  if (!note) return res.status(404).json({ msg: '游记不存在' });

  const { title, content } = req.body;
  if (title) note.title = title;
  if (content) note.content = content;

  // 保存数据到文件
  saveDataToFile();

  res.json({ msg: '修改成功', note });
});

// 审核游记
router.patch('/notes/:id/status', (req, res) => {
  const id = req.params.id;
  const { status, rejectReason } = req.body;

  const note = travelNotes[id];
  if (!note) return res.status(404).json({ msg: '游记不存在' });

  if (status === 'rejected' && !rejectReason) {
    return res.status(400).json({ msg: '拒绝原因不能为空' });
  }

  note.status = status;
  if (status === 'rejected') note.rejectReason = rejectReason;

  // 保存数据到文件
  saveDataToFile();

  res.json({ msg: '审核成功', note });
});

//查询游记
router.get('/notes/search', (req, res) => {
  const { query } = req.query;
  const filteredNotes = Object.values(travelNotes).filter(note =>
    note.title.toLowerCase().includes(query.toLowerCase()) ||
    Object.values(users).find(user => user.id === note.userId).nickname.toLowerCase().includes(query.toLowerCase())
  );
  res.json(filteredNotes);
});

module.exports = router;