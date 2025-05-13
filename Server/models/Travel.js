//游记模型
const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  coverImage: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'deleted'],
    default: 'pending'
  },
  rejectReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Travel', travelSchema);