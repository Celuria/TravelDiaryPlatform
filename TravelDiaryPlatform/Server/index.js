const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3001;  // 你想用哪个端口，就用这个

app.use(cors());
app.use(express.json());

// 挂载认证相关路由
app.use('/api/auth', authRoutes);

// 基础测试路由
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Node.js backend!' });
});

// 连接 MongoDB
mongoose.connect('mongodb://localhost:27017/travel-diary')
  .then(() => {
    console.log('MongoDB connected');

    // 只有在 MongoDB 连接成功后再启动服务器
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
