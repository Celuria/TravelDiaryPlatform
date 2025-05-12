import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TravelCard from '../components/Audit/TravelCard';
import StatusFilter from '../components/Audit/StatusFilter';
import RejectModal from '../components/Audit/RejectModal';
import DeleteModal from '../components/Audit/DeleteModal';
import Notification from '../components/Common/Notification';
import Header from '../components/Common/Header';
import api from '../utils/api';
//示例游记
/*const sampleTravels = [
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
];*/

const AuditList = () => {
  const navigate=useNavigate();
  const [travels, setTravels] = useState(sampleTravels);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTravelId, setSelectedTravelId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 // 获取游记数据
  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const response = await api.get('/travels', {
          params: {
            status: filterStatus === 'all' ? undefined : filterStatus,
            page: currentPage,
            limit: 10
          }
        });
        setTravels(response.data.travels);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('获取数据失败:', error);
        if (error.response?.status === 401) navigate('/');
      }
    };
    fetchTravels();
  }, [filterStatus, currentPage, navigate]);
 
  //筛选游记
  const filteredTravels = travels.filter(travel => 
    filterStatus === 'all' || travel.status === filterStatus
  );

//处理审核通过
/*const handleApprove = async (id) => {
    setTravels(prev => 
      prev.map(travel => 
        travel.id === id ? { ...travel, status: 'approved' } : travel
      )
    );
    showNotificationMessage('游记已成功通过审核！', 'success');
  };*/
  //以上仅更新前端界面无后端交互
  const handleApprove = async (id) => {
    try {
      await api.patch(`/travels/${id}/status`, { status: 'approved' });
      showNotificationMessage('游记已成功通过审核！', 'success');
      setTravels(prev => prev.map(t => 
        t._id === id ? { ...t, status: 'approved' } : t
      ));
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  //处理审核拒绝
  const handleReject = (id) => {
    setSelectedTravelId(id);
    setShowRejectModal(true);
  };

  //确认拒绝
  /*const handleConfirmReject = (reason) => {
    setTravels(prev => 
      prev.map(travel => 
        travel.id === selectedTravelId ? 
        { ...travel, status: 'rejected', rejectReason: reason } : travel
      )
    );
    setShowRejectModal(false);
    showNotificationMessage('游记已成功拒绝！', 'warning');
  };*/
  const handleConfirmReject = async (reason) => {
    try {
      await api.patch(`/travels/${selectedTravelId}/status`, { 
        status: 'rejected',
        rejectReason: reason 
      });
      setTravels(prev => prev.map(t => 
        t._id === selectedTravelId ? 
        { ...t, status: 'rejected', rejectReason: reason } : t
      ));
      setShowRejectModal(false);
      showNotificationMessage('游记已成功拒绝！', 'warning');
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  //处理删除
  const handleDelete = (id) => {
    setSelectedTravelId(id);
    setShowDeleteModal(true);
  };

  //确认删除
 /* const handleConfirmDelete = () => {
    setTravels(prev => 
      prev.map(travel => 
        travel.id === selectedTravelId ? 
        { ...travel, status: 'deleted' } : travel
      )
    );
    setShowDeleteModal(false);
    showNotificationMessage('游记已成功删除！', 'danger');
  };*/
  const handleConfirmDelete = async () => {
    try {
      await api.patch(`/travels/${selectedTravelId}/status`, { status: 'deleted' });
      setTravels(prev => prev.map(t => 
        t._id === selectedTravelId ? { ...t, status: 'deleted' } : t
      ));
      setShowDeleteModal(false);
      showNotificationMessage('游记已成功删除！', 'danger');
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  //处理状态筛选
  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  //显示通知消息
/*  const showNotificationMessage = (message, type) => {
    setNotification({ message, type });
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };*/
  const showNotificationMessage = (message, type) => {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };//仅作改进

  //处理退出登录
/*  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      showNotificationMessage('已成功退出登录！', 'success');
      setTimeout(() => {
        window.location.href = '#login'; // 跳转到登录页面
      }, 1500);
    }
  };*/
  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      showNotificationMessage('已成功退出登录！', 'success'); // 添加通知
      setTimeout(() => navigate('/'), 1500); // 延迟跳转以显示通知
    }
  };//改进

//已更新
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索游记标题、作者或内容..." 
              className="w-full pl-10 pr-16 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-custom"
            />
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
            <button 
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-lg hover:bg-primary/90 transition-custom"
            >
              搜索
            </button>
          </div>
          
          {/* 状态筛选 */}
          <StatusFilter 
            status={filterStatus} 
            onFilterChange={handleFilterChange} 
          />
        </div>
      </div>

      {/* 游记列表 */}
      <div className="space-y-4">
        {filteredTravels.length > 0 ? (
          filteredTravels.map(travel => (
            <TravelCard 
              key={travel._id || travel.id} // 兼容两种ID字段格式
              travel={travel}
              onApprove={() => handleApprove(travel._id || travel.id)}
              onReject={() => handleReject(travel._id || travel.id)}
              onDelete={() => handleDelete(travel._id || travel.id)}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 text-center text-neutral-500">
            <i className="fa-solid fa-search text-4xl mb-4 text-neutral-300"></i>
            <p>没有找到匹配的游记</p>
          </div>
        )}
      </div>
      
      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p-1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-custom disabled:opacity-50"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            
            {/* 显示当前页附近的页码 */}
            {getPaginationRange().map(page => (
              <React.Fragment key={page}>
                {page === '...' ? (
                  <span className="px-2 text-neutral-400">{page}</span>
                ) : (
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page 
                        ? 'bg-primary text-white' 
                        : 'border border-neutral-300 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
            
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-custom disabled:opacity-50"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      )}
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
        className="fixed top-4 right-4 z-50"
      />
    )}
  </div>
);
};

export default AuditList;    