const express = require('express');
const app = express();
const PORT = 3001;

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Node.js backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
