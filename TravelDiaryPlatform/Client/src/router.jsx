import App from "./App";
import {Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login.jsx"

function router() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default router;
