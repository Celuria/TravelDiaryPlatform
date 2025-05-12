import { BrowserRouter as Router, Routes, Route, Navigate } from'react-router-dom';
import Login from './page/Login';
import AuditList from './page/AuditList';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 登录页路由 */}
        <Route path="/" element={<Login />} />
        {/* 审核列表页路由，添加权限控制示例 */}
        <Route 
          path="/audit" 
          element={localStorage.getItem('token')? <AuditList /> : <Navigate to="/" />} 
        />
        {/* 处理未匹配的路径，返回404页面，这里简单重定向到登录页 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
