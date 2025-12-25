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
import NotificationSystem from '../NotificationSystem/NotificationSystem';
import BreakReminder from '../BreakReminder/BreakReminder';
import DailySummary from '../DailySummary/DailySummary';
import SessionTimer from '../SessionTimer/SessionTimer';
import ProjectTemplates from '../ProjectTemplates/ProjectTemplates';
import TemplateBuilder from '../TemplateBuilder/TemplateBuilder';
// import CustomerCRM from '../CustomerCRM/CustomerCRM';
// import MarketingAutomation from '../MarketingAutomation/MarketingAutomation';
import OfflineMode from '../OfflineMode/OfflineMode';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [resumeProject, setResumeProject] = useState<Project | null>(null);
  const [resumeSession, setResumeSession] = useState<Session | null>(null);
  const [showSessionLogger, setShowSessionLogger] = useState(false);
  const [showProjectCreator, setShowProjectCreator] = useState(false);
  const [currentSessions, setCurrentSessions] = useState<Session[]>([]);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [showDailySummary, setShowDailySummary] = useState(false);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [sessionToTrack, setSessionToTrack] = useState<Session | null>(null);
  const [showProjectTemplates, setShowProjectTemplates] = useState(false);
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  // const [showCustomerCRM, setShowCustomerCRM] = useState(false);
  // const [showMarketingAutomation, setShowMarketingAutomation] = useState(false);

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
      // Add timeout and error handling for Notion API calls
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const [projectsResponse, statsResponse, sessionsResponse] = await Promise.allSettled([
        Promise.race([fetchProjects(), timeoutPromise]),
        Promise.race([fetchDashboardStats(), timeoutPromise]),
        Promise.race([fetch(`${API_URL}/api/sessions`).then(res => res.json()), timeoutPromise]),
      ]);

      // Handle projects response
      if (
        projectsResponse.status === 'fulfilled' &&
        (projectsResponse.value as any)?.success &&
        (projectsResponse.value as any)?.data
      ) {
        setProjects((projectsResponse.value as any).data);
      } else {
        console.warn('Failed to load projects, using fallback data');
        setProjects([]); // Use empty array as fallback
        setError('Notion API temporarily unavailable - using offline mode');
        setIsOffline(true);
      }

      // Handle stats response
      if (
        statsResponse.status === 'fulfilled' &&
        (statsResponse.value as any)?.success &&
        (statsResponse.value as any)?.data
      ) {
        setStats((statsResponse.value as any).data);
      } else {
        console.warn('Failed to load stats, using fallback data');
        setStats({
          totalProjects: 0,
          totalSessions: 0,
          totalHours: 0,
          activeProjects: 0,
        });
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

      // Handle sessions response
      if (
        sessionsResponse.status === 'fulfilled' &&
        (sessionsResponse.value as any)?.success &&
        (sessionsResponse.value as any)?.sessions
      ) {
        setAllSessions((sessionsResponse.value as any).sessions);

        // Filter for today's sessions
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = (sessionsResponse.value as any).sessions.filter(
          (session: Session) => session.date === today
        );
        setCurrentSessions(todaySessions);
      } else {
        console.warn('Failed to load sessions, using fallback data');
        setAllSessions([]);
        setCurrentSessions([]);
      }
    } catch (err) {
      setError('Failed to load dashboard');
      setIsOffline(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setIsOffline(false);
    setError(null);
    loadDashboard();
  };

  const handleResumeProject = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation

    // Fetch last session for this project
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    try {
      const response = await fetch(
        `${API_URL}/api/sessions?projectId=${encodeURIComponent(project.name)}`
      );
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

  const handleSessionTimeUpdate = (sessionId: string, updates: Partial<Session>) => {
    // Update session with time tracking data
    setCurrentSessions(prev => prev.map(s => (s.id === sessionId ? { ...s, ...updates } : s)));
    setAllSessions(prev => prev.map(s => (s.id === sessionId ? { ...s, ...updates } : s)));
  };

  const handleTemplateSelect = (template: any) => {
    // Handle template selection
    console.log('Template selected:', template);
  };

  const handleApplyTemplate = (template: any, projectData: any) => {
    // Apply template to create new project
    console.log('Applying template:', template, projectData);
    // This would integrate with the existing project creation flow
    setShowProjectTemplates(false);
  };

  const handleSaveTemplate = (template: any) => {
    // Save new template
    console.log('Saving template:', template);
    setShowTemplateBuilder(false);
  };

  if (isOffline) {
    return (
      <div className="dashboard-container">
        <OfflineMode onRetry={handleRetry} error={error || undefined} />
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
            <div className="stat-sublabel">
              {Math.round((stats.totalHours / stats.totalSessions) * 10) / 10}h avg per session
            </div>
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

      {/* Current Sessions Section */}
      {currentSessions.length > 0 && (
        <div className="current-sessions-section">
          <h2>
            🎯 Working On Today ({currentSessions.length} thread
            {currentSessions.length !== 1 ? 's' : ''})
          </h2>
          <div className="current-sessions-grid">
            {currentSessions.map(session => (
              <div key={session.id} className="current-session-card">
                <div className="session-header">
                  <h3>{session.title}</h3>
                  <div className="session-meta">
                    {session.aiAgent && <span className="session-agent">🤖 {session.aiAgent}</span>}
                    {session.workspace && (
                      <span className="session-workspace">📍 {session.workspace}</span>
                    )}
                    {session.type && <span className="session-type">🎯 {session.type}</span>}
                  </div>
                </div>
                {session.summary && (
                  <div className="session-summary">
                    <p>
                      {session.summary.length > 150
                        ? `${session.summary.substring(0, 150)}...`
                        : session.summary}
                    </p>
                  </div>
                )}
                <div className="session-actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => navigate(`/session/${session.id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => setShowSessionLogger(true)}
                  >
                    Add Update
                  </button>
                  <button
                    className="btn btn-success btn-small"
                    onClick={() => setSessionToTrack(session)}
                  >
                    ⏱️ Timer
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="sessions-overview-actions">
            <button className="btn btn-primary" onClick={() => navigate('/sessions')}>
              View All Sessions
            </button>
            <button className="btn btn-secondary" onClick={() => setShowSessionLogger(true)}>
              Log New Session
            </button>
          </div>
        </div>
      )}

      <div className="dashboard-actions">
        <button className="btn btn-primary" onClick={() => setShowProjectCreator(true)}>
          + New Project
        </button>
        <button className="btn btn-secondary" onClick={() => setShowSessionLogger(true)}>
          📝 Log Session
        </button>
        <button className="btn btn-outline" onClick={() => setShowProjectTemplates(true)}>
          📋 Templates
        </button>
        <button className="btn btn-outline" onClick={() => setShowTemplateBuilder(true)}>
          🔧 Build Template
        </button>
        {/* <button className="btn btn-outline" onClick={() => setShowCustomerCRM(true)}>👥 Customer CRM</button>
            <button className="btn btn-outline" onClick={() => setShowMarketingAutomation(true)}>📢 Marketing</button> */}
        <button className="btn btn-outline" onClick={() => navigate('/analytics')}>
          📊 Analytics
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/team')}>
          👥 Team
        </button>
        <button className="btn btn-outline" onClick={() => setShowDailySummary(true)}>
          📋 Daily Summary
        </button>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="categories-section">
          <h2>📊 Project Categories & Work Distribution</h2>
          <p className="section-subtitle">
            See how your work is distributed across different project types
          </p>
          <div className="categories-grid">
            {categories.map(category => (
              <div key={category.name} className="category-card">
                <div className="category-header">
                  <h3>{category.name}</h3>
                  <span className="category-badge">
                    {category.projectCount} project{category.projectCount !== 1 ? 's' : ''}
                  </span>
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
                      width: `${Math.min(100, (category.sessionCount / (stats?.totalSessions || 1)) * 100)}%`,
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
            {projects.map(project => (
              <div key={project.id} className="project-card">
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
                  <button className="btn-link" onClick={() => navigate(`/project/${project.id}`)}>
                    View Details
                  </button>
                  <button className="btn-resume" onClick={e => handleResumeProject(project, e)}>
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

      {/* Notification System */}
      <NotificationSystem
        sessions={allSessions}
        onSessionUpdate={(sessionId, updates) => {
          // Update session in local state
          setAllSessions(prev => prev.map(s => (s.id === sessionId ? { ...s, ...updates } : s)));
          setCurrentSessions(prev =>
            prev.map(s => (s.id === sessionId ? { ...s, ...updates } : s))
          );
        }}
      />

      {/* Break Reminder Modal */}
      {showBreakReminder && (
        <BreakReminder
          isVisible={showBreakReminder}
          onClose={() => setShowBreakReminder(false)}
          onTakeBreak={() => {
            setShowBreakReminder(false);
            // Logic to pause current session
          }}
          workDuration={30} // This would be calculated from current session
        />
      )}

      {/* Daily Summary Modal */}
      {showDailySummary && (
        <DailySummary
          sessions={allSessions}
          isVisible={showDailySummary}
          onClose={() => setShowDailySummary(false)}
        />
      )}

      {/* Session Timer Modal */}
      {sessionToTrack && (
        <SessionTimer
          session={sessionToTrack}
          onSessionUpdate={handleSessionTimeUpdate}
          onClose={() => setSessionToTrack(null)}
        />
      )}

      {/* Project Templates Modal */}
      <ProjectTemplates
        isOpen={showProjectTemplates}
        onClose={() => setShowProjectTemplates(false)}
        onTemplateSelect={handleTemplateSelect}
        onApplyTemplate={handleApplyTemplate}
      />

      {/* Template Builder Modal */}
      <TemplateBuilder
        isOpen={showTemplateBuilder}
        onClose={() => setShowTemplateBuilder(false)}
        onSave={handleSaveTemplate}
      />

      {/* Customer CRM Modal */}
      {/* {showCustomerCRM && (
        <div className="modal-overlay">
          <div className="modal-content customer-crm-modal">
            <div className="modal-header">
              <h2>👥 Customer CRM</h2>
              <button
                className="close-button"
                onClick={() => setShowCustomerCRM(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <CustomerCRM />
            </div>
          </div>
        </div>
      )} */}

      {/* Marketing Automation Modal */}
      {/* {showMarketingAutomation && (
        <div className="modal-overlay">
          <div className="modal-content marketing-automation-modal">
            <div className="modal-header">
              <h2>📢 Marketing Automation</h2>
              <button
                className="close-button"
                onClick={() => setShowMarketingAutomation(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <MarketingAutomation />
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Dashboard;
