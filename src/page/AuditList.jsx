import React, { useState } from 'react';
import TravelCard from '../components/Audit/TravelCard';
import StatusFilter from '../components/Audit/StatusFilter';
import RejectModal from '../components/Audit/RejectModal';
import DeleteModal from '../components/Audit/DeleteModal';
import Notification from '../components/Common/Notification';

const sampleTravels = [
  {
    id: 1,
    title: '春日京都赏樱之旅',
    content: '京都的春天是樱花的海洋，从哲学之道到岚山，从金阁寺到伏见稻荷大社，每一处都被粉色和白色的樱花点缀得如诗如画...',
    author: '旅行者小明',
    date: '2025-04-15',
    views: 128,
    coverImage: 'https://picsum.photos/seed/travel1/400/400',
    status: 'pending'
  },
  {
    id: 2,
    title: '撒哈拉沙漠探险记',
    content: '穿越撒哈拉沙漠是我人生中最难忘的经历之一。在三天两夜的行程中，我们骑骆驼深入沙漠腹地，夜晚在星空下露营...',
    author: '沙漠旅行者',
    date: '2025-03-22',
    views: 568,
    coverImage: 'https://picsum.photos/seed/travel2/400/400',
    status: 'approved'
  },
  {
    id: 3,
    title: '马尔代夫水上屋体验',
    content: '在马尔代夫的一周，我住在水上屋，每天清晨被海浪声唤醒，推开房门就能跳入清澈的海水中与热带鱼共舞...',
    author: '海岛爱好者',
    date: '2025-04-05',
    views: 89,
    coverImage: 'https://picsum.photos/seed/travel3/400/400',
    status: 'rejected',
    rejectReason: '内容包含商业推广信息，请删除相关内容后重新提交审核。'
  },
  {
    id: 4,
    title: '北欧极光之旅',
    content: '在芬兰的罗瓦涅米，我终于见到了传说中的北极光。那绿色的光幕在夜空中舞动，仿佛是大自然谱写的壮丽诗篇...',
    author: '极光猎人',
    date: '2025-02-18',
    views: 215,
    coverImage: 'https://picsum.photos/seed/travel4/400/400',
    status: 'pending'
  }
];

const AuditList = () => {
  const [travels, setTravels] = useState(sampleTravels);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTravelId, setSelectedTravelId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const filteredTravels = travels.filter(travel => 
    filterStatus === 'all' || travel.status === filterStatus
  );

  const handleApprove = (id) => {
    setTravels(prev => 
      prev.map(travel => 
        travel.id === id ? { ...travel, status: 'approved' } : travel
      )
    );
    showNotificationMessage('游记已成功通过审核！', 'success');
  };

  const handleReject = (id) => {
    setSelectedTravelId(id);
    setShowRejectModal(true);
  };

  const handleConfirmReject = (reason) => {
    setTravels(prev => 
      prev.map(travel => 
        travel.id === selectedTravelId ? 
        { ...travel, status: 'rejected', rejectReason: reason } : travel
      )
    );
    setShowRejectModal(false);
    showNotificationMessage('游记已成功拒绝！', 'warning');
  };

  const handleDelete = (id) => {
    setSelectedTravelId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setTravels(prev => 
      prev.map(travel => 
        travel.id === selectedTravelId ? 
        { ...travel, status: 'deleted' } : travel
      )
    );
    setShowDeleteModal(false);
    showNotificationMessage('游记已成功删除！', 'danger');
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const showNotificationMessage = (message, type) => {
    setNotification({ message, type });
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      showNotificationMessage('已成功退出登录！', 'success');
      setTimeout(() => {
        window.location.href = '#login'; // 跳转到登录页面
      }, 1500);
    }
  };

  return (
    <div className="bg-neutral-100 font-inter min-h-screen">
      <Header onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-6">
        {/* 搜索和筛选区域 */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6 transition-custom hover:shadow-card-hover">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* 搜索框 */}
            <div className="relative flex-grow max-w-xl">
              <input 
                type="text" 
                placeholder="搜索游记标题、作者或内容..." 
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-custom"
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-lg hover:bg-primary/90 transition-custom">
                搜索
              </button>
            </div>
            
            {/* 状态筛选 */}
            <StatusFilter status={filterStatus} onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* 游记列表 */}
        <div className="space-y-4">
          {filteredTravels.map(travel => (
            <TravelCard 
              key={travel.id}
              travel={travel}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
            />
          ))}
        </div>
        
        {/* 分页 */}
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-1">
            <button className="px-3 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-custom">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-white">1</button>
            <button className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-custom">2</button>
            <button className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-custom">3</button>
            <span className="px-2 text-neutral-400">...</span>
            <button className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-custom">12</button>
            <button className="px-3 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-custom">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-neutral-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-neutral-500">
          <p>© 2025 游记审核管理系统 - 版权所有</p>
        </div>
      </footer>

      {/* 模态框 */}
      <RejectModal 
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
      />
      
      <DeleteModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
      
      {/* 通知 */}
      {showNotification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default AuditList;    