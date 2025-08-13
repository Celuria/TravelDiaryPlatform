const mongoose = require('mongoose');

const auditRecordSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TravelNote',
    required: [true, '游记ID不能为空'],
    index: true
  }, // 关联游记
  auditorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '审核员ID不能为空']
  }, // 关联审核员
  action: {
    type: String,
    enum: ['approve', 'reject'],
    required: [true, '审核操作不能为空']
  }, // 操作类型
  reason: {
    type: String,
    trime: true   // 去除前后空格
  }, // 拒绝原因（仅reject操作需填写）
  operateTime: {
    type: Date,
    default: Date.now
  } // 操作时间
});

// 关联查询优化
auditRecordSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'auditorId',
    select: 'username role'
  });
  next();
});

module.exports = mongoose.model('AuditRecord', auditRecordSchema);