import React, { useState } from 'react';

const RejectModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert('请输入拒绝原因');
      return;
    }
    onConfirm(reason);
    setReason('');
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div
        className={`bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-neutral-800">输入拒绝原因</h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div className="mb-4">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="4"
              placeholder="请输入拒绝原因..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-custom"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-custom">
              取消
            </button>
            <button onClick={handleConfirm} className="px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning/90 transition-custom">
              确认拒绝
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;    