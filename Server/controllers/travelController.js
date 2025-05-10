const Travel = require('../models/Travel');

exports.getTravels = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { status: { $ne: 'deleted' } };
    
    if (status && status !== 'all') query.status = status;

    const travels = await Travel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Travel.countDocuments(query);
    
    res.json({
      travels,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectReason } = req.body;
    const userRole = req.user.role;

    // 权限验证
    if (status === 'deleted' && userRole !== 'admin') {
      return res.status(403).json({ message: '权限不足' });
    }

    const updateData = { 
      status,
      updatedAt: Date.now() 
    };
    
    if (status === 'rejected') updateData.rejectReason = rejectReason;
    
    const travel = await Travel.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!travel) return res.status(404).json({ message: '游记不存在' });
    
    res.json(travel);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};