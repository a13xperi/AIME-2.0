/**
 * Dashboard Component
 * Main dashboard view showing all projects and quick actions
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, DashboardStats, Session, CategoryStats } from '../../types';
import { fetchProjects, fetchDashboardStats } from '../../api/notionApi';
import QuickResume from '../QuickResume/QuickResume';
import SessionLogger from '../SessionLogger/SessionLogger';
import ProjectCreator from '../ProjectCreator/ProjectCreator';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeProject, setResumeProject] = useState<Project | null>(null);
  const [resumeSession, setResumeSession] = useState<Session | null>(null);
  const [showSessionLogger, setShowSessionLogger] = useState(false);
  const [showProjectCreator, setShowProjectCreator] = useState(false);

  useEffect(() => {
    loadDashboard();
    
    // Auto-refresh every 30 seconds to pick up changes from Notion
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data from Notion...');
      loadDashboard();
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    try {
      const [projectsResponse, statsResponse] = await Promise.all([
        fetchProjects(),
        fetchDashboardStats(),
      ]);

      if (projectsResponse.success && projectsResponse.data) {
        setProjects(projectsResponse.data);
      } else {
        setError(projectsResponse.error || 'Failed to load projects');
      }

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      // Fetch categories
      try {
        const categoriesResponse = await fetch(`${API_URL}/api/dashboard/categories`);
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success && categoriesData.categories) {
          setCategories(categoriesData.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeProject = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    
    // Fetch last session for this project
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    try {
      const response = await fetch(`${API_URL}/api/sessions?projectId=${encodeURIComponent(project.name)}`);
      const data = await response.json();
      
      if (data.success && data.sessions && data.sessions.length > 0) {
        setResumeSession(data.sessions[0]); // Most recent session
      } else {
        setResumeSession(null);
      }
    } catch (err) {
      console.error('Error fetching last session:', err);
      setResumeSession(null);
    }
    
    setResumeProject(project);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <h2>Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={loadDashboard}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>🤖 Agent Alex</h1>
            <p>Your AI Work Session & Project Tracker</p>
          </div>
          <button 
            className="refresh-button" 
            onClick={() => loadDashboard()}
            title="Refresh data from Notion"
          >
            🔄 Refresh
          </button>
        </div>
      </header>

      {stats && (
        <div className="dashboard-stats">
          <div className="stat-card clickable" onClick={() => navigate('/projects')}>
            <div className="stat-value">{stats.totalProjects}</div>
            <div className="stat-label">Total Projects</div>
            <div className="stat-sublabel">{stats.activeProjects} active</div>
            <div className="stat-hint">Click to view all →</div>
          </div>
          <div className="stat-card clickable" onClick={() => navigate('/sessions')}>
            <div className="stat-value">{stats.totalSessions}</div>
            <div className="stat-label">Work Sessions</div>
            <div className="stat-sublabel">{stats.completedSessions || 0} with deliverables</div>
            <div className="stat-hint">Click to view timeline →</div>
          </div>
          <div className="stat-card clickable" onClick={() => navigate('/sessions')}>
            <div className="stat-value">{stats.totalHours}h</div>
            <div className="stat-label">Time Logged</div>
            <div className="stat-sublabel">{Math.round((stats.totalHours / stats.totalSessions) * 10) / 10}h avg per session</div>
            <div className="stat-hint">Click to view timeline →</div>
          </div>
          <div className="stat-card clickable" onClick={() => navigate('/sessions')}>
            <div className="stat-value">{stats.technologiesCount || 0}</div>
            <div className="stat-label">Technologies Used</div>
            <div className="stat-sublabel">{stats.sessionsWithFiles || 0} sessions with files</div>
            <div className="stat-hint">Click to view details →</div>
          </div>
        </div>
      )}

      <div className="dashboard-actions">
        <button className="btn btn-primary" onClick={() => setShowProjectCreator(true)}>+ New Project</button>
        <button className="btn btn-secondary" onClick={() => setShowSessionLogger(true)}>📝 Log Session</button>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="categories-section">
          <h2>📊 Project Categories & Work Distribution</h2>
          <p className="section-subtitle">See how your work is distributed across different project types</p>
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.name} className="category-card">
                <div className="category-header">
                  <h3>{category.name}</h3>
                  <span className="category-badge">{category.projectCount} project{category.projectCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="category-stats">
                  <div className="category-stat">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-info">
                      <div className="stat-number">{category.activeProjects}</div>
                      <div className="stat-text">Active</div>
                    </div>
                  </div>
                  <div className="category-stat">
                    <div className="stat-icon">📝</div>
                    <div className="stat-info">
                      <div className="stat-number">{category.sessionCount}</div>
                      <div className="stat-text">Sessions</div>
                    </div>
                  </div>
                  <div className="category-stat">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-info">
                      <div className="stat-number">{category.totalHours}h</div>
                      <div className="stat-text">Logged</div>
                    </div>
                  </div>
                </div>
                <div className="category-progress">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${Math.min(100, (category.sessionCount / (stats?.totalSessions || 1)) * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="category-footer">
                  {category.sessionCount > 0 && (
                    <span className="category-metric">
                      {(category.totalHours / category.sessionCount).toFixed(1)}h avg per session
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="projects-section">
        <h2>Your Projects</h2>
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects yet. Create your first project to get started!</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="project-card"
              >
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <span className={`status-badge status-${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-meta">
                  <span className="project-type">{project.type}</span>
                  <span className="project-workspace">{project.workspace}</span>
                </div>
                <div className="project-actions">
                  <button 
                    className="btn-link" 
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn-resume" 
                    onClick={(e) => handleResumeProject(project, e)}
                  >
                    🚀 Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Resume Modal */}
      {resumeProject && (
        <QuickResume
          project={resumeProject}
          lastSession={resumeSession || undefined}
          onClose={() => {
            setResumeProject(null);
            setResumeSession(null);
          }}
        />
      )}

      {/* Session Logger Modal */}
      <SessionLogger
        isOpen={showSessionLogger}
        onClose={() => setShowSessionLogger(false)}
        onSuccess={() => {
          loadDashboard(); // Refresh data after logging session
        }}
        projects={projects}
      />

      {/* Project Creator Modal */}
      <ProjectCreator
        isOpen={showProjectCreator}
        onClose={() => setShowProjectCreator(false)}
        onSuccess={() => {
          loadDashboard(); // Refresh data after creating project
        }}
      />
    </div>
  );
};

export default Dashboard;

