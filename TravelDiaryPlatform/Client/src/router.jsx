
import {Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login.jsx"
import WorkbenchHomepage from "./pages/WorkbenchHomepage.jsx"

function router() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/WorkbenchHomepage" element={<WorkbenchHomepage />} />
            </Routes>
        </Router>
    );
}

export default router;
