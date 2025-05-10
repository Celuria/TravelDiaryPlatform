import { Outlet, Link } from "react-router-dom";

import AuditList from './pages/AuditList.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="./Audit" element={<AuditList />} />
        {/* 其他路由可以在这里添加 */}
      </Routes>
    </Router>
  );
}

export default App;
