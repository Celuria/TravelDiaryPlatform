
import { Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

import AuditList from './pages/AuditList';
import './App.css';
import { Component } from 'react';

function App(){
  return(
    <div>
      <p>App</p>
      <AuditList/>
    </div>
  )
}

export default App
