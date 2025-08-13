const mongoose = require('mongoose');

const travelNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '标题不能为空'],
    trim: true,
    minlength: [2, '标题至少2个字符']
  }, // 游记标题（必传）
  content: {
    type: String,
    required: [true, '内容不能为空'],
    minlength: [10, '内容至少10个字符']
  }, // 游记内容（必传）
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, // 关联发布者（数据来自用户系统）
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'], // 待审核/已通过/未通过
    default: 'pending'
  },
  rejectReason: {
    type: String,
    trim: true
  }, // 拒绝原因（仅rejected状态有效）
  images: [{ type: String }], // 图片URL数组
  video: { type: String }, // 视频URL（最多1个）
  createdAt: { type: Date, default: Date.now }, // 发布时间
  updatedAt: { type: Date, default: Date.now }, // 最后更新时间
  deleted: {
    type: Boolean,
    default: false,
    select: false // 逻辑删除标记，默认不返回已删除记录  
  }, // 逻辑删除标记
  deletedAt: { type: Date } // 逻辑删除时间
});

// 每次更新时自动更新时间戳
travelNoteSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// 默认查询条件：不包含已删除的记录
travelNoteSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty('deleted')) {
    this.where({ deleted: false });
  }
  next();
});

module.exports = mongoose.model('TravelNote', travelNoteSchema);