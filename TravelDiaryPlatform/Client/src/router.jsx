
import {Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login.jsx"
import WorkbenchHomepage from "./pages/WorkbenchHomepage.jsx"

function Approuter() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/WorkbenchHomepage" element={<WorkbenchHomepage />} />
        </Routes>

    );  
}

export default Approuter;
