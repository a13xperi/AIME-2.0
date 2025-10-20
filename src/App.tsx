/**
 * Agent Alex - Main App Component
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';
import ProjectsList from './components/ProjectsList/ProjectsList';
import SessionsList from './components/SessionsList/SessionsList';
import SessionDetail from './components/SessionDetail/SessionDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/sessions" element={<SessionsList />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/session/:id" element={<SessionDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
