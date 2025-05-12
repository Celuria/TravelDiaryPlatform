import { useNavigate } from 'react-router-dom';

const Header = ({ onLogout, role }) => {
  const navigate = useNavigate();

  // 处理退出登录（解耦导航逻辑，通过props接收角色）
  const handleLogoutClick = () => {
    onLogout?.(); // 安全调用父组件回调，避免undefined错误
    // 建议在父组件中处理导航和通知，此处仅触发事件
    // 若需立即导航，可保留（根据业务需求选择）
    // navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="fa-solid fa-clipboard-check text-primary text-2xl"></i>
          <h1 className="text-xl font-bold text-neutral-800">游记审核管理系统</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <i className="fa-solid fa-user-circle text-neutral-600"></i>
            <span className="text-neutral-600">
              {role === 'admin' ? '管理员' : role === 'reviewer' ? '审核员' : '用户'}
            </span>
          </div>
          <button 
            onClick={handleLogoutClick}
            className="text-neutral-600 hover:text-danger transition-custom"
          >
            <i className="fa-solid fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;