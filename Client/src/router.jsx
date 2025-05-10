import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AuditList from "./pages/AuditList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:"/AuditList",
    element:<AuditList/>
  }

]);

export default router;
