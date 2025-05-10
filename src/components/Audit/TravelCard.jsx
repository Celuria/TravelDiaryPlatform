const TravelCard = ({ travel, onApprove, onReject, onDelete }) => {
  const getStatusBadge = () => {
    switch (travel.status) {
      case 'pending':
        return (
          <span className="bg-neutral-200 text-neutral-600 text-xs px-2 py-1 rounded-full">
            待审核
          </span>
        );
      case 'approved':
        return (
          <span className="bg-success/10 text-success text-xs px-2 py-1 rounded-full">
            已通过
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-warning/10 text-warning text-xs px-2 py-1 rounded-full">
            未通过
          </span>
        );
      case 'deleted':
        return (
          <span className="bg-danger/10 text-danger text-xs px-2 py-1 rounded-full">
            已删除
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`travel-card bg-white rounded-xl shadow-card overflow-hidden transition-custom hover:shadow-card-hover ${
        travel.status === 'deleted' ? 'opacity-50' : ''
      }`}
      data-status={travel.status}
    >
      <div className="p-4 flex flex-col md:flex-row gap-4">
        {/* 封面图 */}
        <div className="w-full md:w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={travel.coverImage}
            alt={travel.title}
            className="w-full h-full object-cover transition-custom hover:scale-105"
          />
        </div>

        {/* 内容信息 */}
        <div className="flex-grow flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <h2 className="text-lg font-bold text-neutral-800">{travel.title}</h2>
            {getStatusBadge()}
          </div>
          <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
            {travel.content}
          </p>

          <div className="flex items-center text-xs text-neutral-500 mb-3">
            <span className="flex items-center mr-4">
              <i className="fa-solid fa-user-circle mr-1"></i>
              {travel.author}
            </span>
            <span className="flex items-center mr-4">
              <i className="fa-solid fa-calendar mr-1"></i>
              {travel.date}
            </span>
            <span className="flex items-center">
              <i className="fa-solid fa-eye mr-1"></i>
              {travel.views} 浏览
            </span>
          </div>

          {/* 拒绝原因 */}
          {travel.status === 'rejected' && (
            <div className="bg-warning/5 border border-warning/20 rounded-lg p-3 mb-3">
              <div className="flex items-start">
                <i className="fa-solid fa-exclamation-circle text-warning mt-0.5 mr-2"></i>
                <p className="text-sm text-warning">拒绝原因：{travel.rejectReason}</p>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-2 mt-auto">
            <button
              className={`action-btn bg-success text-white px-4 py-2 rounded-lg text-sm font-medium transition-custom hover:bg-success/90 ${
                travel.status === 'deleted' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => travel.status !== 'deleted' && onApprove(travel.id)}
              disabled={travel.status === 'deleted'}
            >
              <i className="fa-solid fa-check mr-1"></i>通过
            </button>
            <button
              className={`action-btn bg-warning text-white px-4 py-2 rounded-lg text-sm font-medium transition-custom hover:bg-warning/90 ${
                travel.status === 'deleted' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => travel.status !== 'deleted' && onReject(travel.id)}
              disabled={travel.status === 'deleted'}
            >
              <i className="fa-solid fa-times mr-1"></i>拒绝
            </button>
            <button
              className={`action-btn bg-danger text-white px-4 py-2 rounded-lg text-sm font-medium transition-custom hover:bg-danger/90 ${
                travel.status === 'deleted' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => travel.status !== 'deleted' && onDelete(travel.id)}
              disabled={travel.status === 'deleted'}
            >
              <i className="fa-solid fa-trash mr-1"></i>删除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelCard;    