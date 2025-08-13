
import { BrowserRouter} from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css';
import Login from "./pages/Login.jsx";
import AppRouter from "./router.jsx"; // 注意这里的命名

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
  
);
