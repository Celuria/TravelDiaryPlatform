
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
