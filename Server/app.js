//！！！！！此文件为接口定义，若要调用接口，参见doc.txt

const express = require('express');
const fs = require('fs');
const cors = require('cors');

// 加载数据
let data = require('./data.json'); // 读取 JSON 文件中的数据
const { users, travelNotes } = data; // 从文件中提取数据

const app = express();
app.use(cors());
app.use(express.json());

// 保存数据到文件
function saveDataToFile() {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

// 注册用户
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  // 检查用户名是否已存在
  for (const id in users) {
    if (users[id].username === username) {
      return res.status(400).json({ msg: '用户名已存在' });
    }
  }

  const id = Date.now(); // 使用时间戳作为用户 ID
  users[id] = { id, username, password };
  
  // 保存数据到文件
  saveDataToFile();

  res.json({ msg: '注册成功', userId: id });
});

// 登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  for (const id in users) {
    const user = users[id];
    if (user.username === username && user.password === password) {
      return res.json({ token: `token-${user.id}`, userId: user.id });
    }
  }

  res.status(400).json({ msg: '用户名或密码错误' });
});

// 发布游记
app.post('/api/notes', (req, res) => {
  const { title, content, userId } = req.body;

  if (!users[userId]) return res.status(400).json({ msg: '无效用户' });

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

// 获取所有游记
app.get('/api/notes', (req, res) => {
  res.json(Object.values(travelNotes));
});

// 获取用户的游记
app.get('/api/notes/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const notes = Object.values(travelNotes).filter(note => note.userId === userId);
  res.json(notes);
});

// 获取单篇游记
app.get('/api/notes/:id', (req, res) => {
  const note = travelNotes[req.params.id];
  if (!note) return res.status(404).json({ msg: '游记不存在' });
  res.json(note);
});

// 删除游记
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  if (!travelNotes[id]) return res.status(404).json({ msg: '游记不存在' });

  delete travelNotes[id];

  // 保存数据到文件
  saveDataToFile();

  res.json({ msg: '删除成功' });
});

// 编辑游记
app.put('/api/notes/:id', (req, res) => {
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
