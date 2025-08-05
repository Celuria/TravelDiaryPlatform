import { BrowserRouter as Router, Routes, Route, Navigate } from'react-router-dom';
import Login from './pages/Login';
import AuditList from './pages/AuditList';
import './App.css';

function App() {
  return (
    <div>
     
      <Routes>
        <Route path="/" element={<Login />} />
       
      </Routes>

    </div>
  );
}

export default App;
