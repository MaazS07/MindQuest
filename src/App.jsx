// src/App.js
import React from 'react';
import * as regeneratorRuntime from 'regenerator-runtime/runtime';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Hero from './components/Hero';
import AIMockInterview from './components/AiMockInterview';
import HRDashboard from './components/HRDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Hero />} />
        <Route path="/dashboard" element={<HRDashboard />} />


        <Route path="/interview" element={<AIMockInterview/>}/>
      </Routes>
    </Router>
  );
}

export default App;
