const Header = ({ onLogout }) => {
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
            <span className="text-neutral-600">管理员</span>
          </div>
          <button onClick={onLogout} className="text-neutral-600 hover:text-danger transition-custom">
            <i className="fa-solid fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;    