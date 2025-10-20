/**
 * ProjectsList Component
 * Full list view of all projects with filtering
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types';
import { fetchProjects } from '../../api/notionApi';
import './ProjectsList.css';

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchProjects();
      if (response.success && response.data) {
        setProjects(response.data);
      } else {
        setError(response.error || 'Failed to load projects');
      }
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = filterStatus === 'all' 
    ? projects 
    : projects.filter(p => p.status.toLowerCase().includes(filterStatus.toLowerCase()));

  if (loading) {
    return (
      <div className="projects-list-page">
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-list-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="projects-list-page">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
        <h1>📁 All Projects</h1>
        <p className="subtitle">{projects.length} total projects</p>
      </header>

      <div className="filters-bar">
        <button 
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All ({projects.length})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
          onClick={() => setFilterStatus('active')}
        >
          🟢 Active ({projects.filter(p => p.status.toLowerCase().includes('active')).length})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'complete' ? 'active' : ''}`}
          onClick={() => setFilterStatus('complete')}
        >
          ✅ Complete ({projects.filter(p => p.status.toLowerCase().includes('complete')).length})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'paused' ? 'active' : ''}`}
          onClick={() => setFilterStatus('paused')}
        >
          ⏸️ Paused ({projects.filter(p => p.status.toLowerCase().includes('paused')).length})
        </button>
      </div>

      <div className="projects-table">
        {filteredProjects.map((project) => (
          <div 
            key={project.id} 
            className="project-row"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <div className="project-main-info">
              <h3>{project.name}</h3>
              <p className="project-desc">{project.description}</p>
            </div>
            <div className="project-meta-info">
              <span className={`status-pill ${project.status.toLowerCase().replace(/[^a-z]/g, '')}`}>
                {project.status}
              </span>
              <span className={`priority-pill ${project.priority.toLowerCase().replace(/[^a-z]/g, '')}`}>
                {project.priority}
              </span>
              <span className="date-info">
                Updated: {project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;



