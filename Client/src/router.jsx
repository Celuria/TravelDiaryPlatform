import App from "./App";
import AuditList from "./pages/AuditList";
import {Router, Routes, Route } from 'react-router-dom';


function router() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/audit" element={<AuditList />} />
            </Routes>
        </Router>
    );
}

export default router;
