const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
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
            <h3 className="text-lg font-bold text-neutral-800">确认删除</h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div className="mb-4">
            <p className="text-neutral-600">确定要删除这篇游记吗？此操作将把游记标记为已删除状态。</p>
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-custom">
              取消
            </button>
            <button onClick={onConfirm} className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-custom">
              确认删除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;    