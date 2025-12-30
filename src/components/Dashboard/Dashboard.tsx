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

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
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
      <div className="dashboard" role="status" aria-live="polite" aria-busy="true">
        <div className="dashboard-loading">
          <h2>Loading Dashboard...</h2>
          <span className="sr-only">Please wait while the dashboard loads</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard" role="alert" aria-live="assertive">
        <div className="dashboard-error">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={loadDashboard} aria-label="Retry loading dashboard">
            Retry
          </button>
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
    <div className="dashboard" role="application" aria-label="Agent Alex Dashboard">
      {/* Skip link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="dashboard-header" role="banner">
        <div className="header-content">
          <div>
            <h1>
              <span aria-hidden="true">🤖</span> Agent Alex
            </h1>
            <p>Your AI Work Session & Project Tracker</p>
          </div>
          <button
            className="refresh-button"
            onClick={() => loadDashboard()}
            aria-label="Refresh dashboard data from Notion"
            title="Refresh data from Notion"
          >
            <span aria-hidden="true">🔄</span> Refresh
          </button>
        </div>
      </header>

      {stats && (
        <section className="dashboard-stats" aria-label="Dashboard statistics">
          <h2 className="sr-only">Quick Stats</h2>
          <div
            className="stat-card clickable"
            onClick={() => navigate('/projects')}
            onKeyDown={e => e.key === 'Enter' && navigate('/projects')}
            role="button"
            tabIndex={0}
            aria-label={`${stats.totalProjects} total projects, ${stats.activeProjects} active. Click to view all projects`}
          >
            <div className="stat-value" aria-hidden="true">
              {stats.totalProjects}
            </div>
            <div className="stat-label">Total Projects</div>
            <div className="stat-sublabel">{stats.activeProjects} active</div>
            <div className="stat-hint" aria-hidden="true">
              Click to view all →
            </div>
          </div>
          <div
            className="stat-card clickable"
            onClick={() => navigate('/sessions')}
            onKeyDown={e => e.key === 'Enter' && navigate('/sessions')}
            role="button"
            tabIndex={0}
            aria-label={`${stats.totalSessions} work sessions, ${stats.completedSessions || 0} with deliverables. Click to view timeline`}
          >
            <div className="stat-value" aria-hidden="true">
              {stats.totalSessions}
            </div>
            <div className="stat-label">Work Sessions</div>
            <div className="stat-sublabel">{stats.completedSessions || 0} with deliverables</div>
            <div className="stat-hint" aria-hidden="true">
              Click to view timeline →
            </div>
          </div>
          <div
            className="stat-card clickable"
            onClick={() => navigate('/sessions')}
            onKeyDown={e => e.key === 'Enter' && navigate('/sessions')}
            role="button"
            tabIndex={0}
            aria-label={`${stats.totalHours} hours logged, average ${Math.round((stats.totalHours / stats.totalSessions) * 10) / 10} hours per session. Click to view timeline`}
          >
            <div className="stat-value" aria-hidden="true">
              {stats.totalHours}h
            </div>
            <div className="stat-label">Time Logged</div>
            <div className="stat-sublabel">
              {Math.round((stats.totalHours / stats.totalSessions) * 10) / 10}h avg per session
            </div>
            <div className="stat-hint" aria-hidden="true">
              Click to view timeline →
            </div>
          </div>
          <div
            className="stat-card clickable"
            onClick={() => navigate('/sessions')}
            onKeyDown={e => e.key === 'Enter' && navigate('/sessions')}
            role="button"
            tabIndex={0}
            aria-label={`${stats.technologiesCount || 0} technologies used, ${stats.sessionsWithFiles || 0} sessions with files. Click to view details`}
          >
            <div className="stat-value" aria-hidden="true">
              {stats.technologiesCount || 0}
            </div>
            <div className="stat-label">Technologies Used</div>
            <div className="stat-sublabel">{stats.sessionsWithFiles || 0} sessions with files</div>
            <div className="stat-hint" aria-hidden="true">
              Click to view details →
            </div>
          </div>
        </section>
      )}

      {/* Current Sessions Section */}
      {currentSessions.length > 0 && (
        <section
          className="current-sessions-section"
          aria-label="Today's active sessions"
          id="main-content"
        >
          <h2>
            <span aria-hidden="true">🎯</span> Working On Today ({currentSessions.length} thread
            {currentSessions.length !== 1 ? 's' : ''})
          </h2>
          <div className="current-sessions-grid" role="list" aria-label="Current work sessions">
            {currentSessions.map(session => (
              <article
                key={session.id}
                className="current-session-card"
                role="listitem"
                aria-label={`Session: ${session.title}`}
              >
                <div className="session-header">
                  <h3>{session.title}</h3>
                  <div className="session-meta" aria-label="Session details">
                    {session.aiAgent && (
                      <span className="session-agent">
                        <span aria-hidden="true">🤖</span>
                        <span className="sr-only">AI Agent:</span> {session.aiAgent}
                      </span>
                    )}
                    {session.workspace && (
                      <span className="session-workspace">
                        <span aria-hidden="true">📍</span>
                        <span className="sr-only">Workspace:</span> {session.workspace}
                      </span>
                    )}
                    {session.type && (
                      <span className="session-type">
                        <span aria-hidden="true">🎯</span>
                        <span className="sr-only">Type:</span> {session.type}
                      </span>
                    )}
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
                <div className="session-actions" role="group" aria-label="Session actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => navigate(`/session/${session.id}`)}
                    aria-label={`View details for session: ${session.title}`}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => setShowSessionLogger(true)}
                    aria-label="Add update to session"
                  >
                    Add Update
                  </button>
                  <button
                    className="btn btn-success btn-small"
                    onClick={() => setSessionToTrack(session)}
                    aria-label={`Start timer for session: ${session.title}`}
                  >
                    <span aria-hidden="true">⏱️</span> Timer
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="sessions-overview-actions" role="group" aria-label="Session navigation">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/sessions')}
              aria-label="View all work sessions"
            >
              View All Sessions
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowSessionLogger(true)}
              aria-label="Log a new work session"
            >
              Log New Session
            </button>
          </div>
        </section>
      )}

      <nav className="dashboard-actions" aria-label="Quick actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowProjectCreator(true)}
          aria-label="Create a new project"
        >
          + New Project
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setShowSessionLogger(true)}
          aria-label="Log a new work session"
        >
          <span aria-hidden="true">📝</span> Log Session
        </button>
        <button
          className="btn btn-outline"
          onClick={() => setShowProjectTemplates(true)}
          aria-label="Browse project templates"
        >
          <span aria-hidden="true">📋</span> Templates
        </button>
        <button
          className="btn btn-outline"
          onClick={() => setShowTemplateBuilder(true)}
          aria-label="Build a custom template"
        >
          <span aria-hidden="true">🔧</span> Build Template
        </button>
        <button
          className="btn btn-outline"
          onClick={() => navigate('/analytics')}
          aria-label="View analytics dashboard"
        >
          <span aria-hidden="true">📊</span> Analytics
        </button>
        <button
          className="btn btn-outline"
          onClick={() => navigate('/team')}
          aria-label="View team collaboration"
        >
          <span aria-hidden="true">👥</span> Team
        </button>
        <button
          className="btn btn-outline"
          onClick={() => setShowDailySummary(true)}
          aria-label="View daily summary"
        >
          <span aria-hidden="true">📋</span> Daily Summary
        </button>
      </nav>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="categories-section" aria-labelledby="categories-heading">
          <h2 id="categories-heading">
            <span aria-hidden="true">📊</span> Project Categories & Work Distribution
          </h2>
          <p className="section-subtitle">
            See how your work is distributed across different project types
          </p>
          <div className="categories-grid" role="list" aria-label="Project categories">
            {categories.map(category => (
              <article
                key={category.name}
                className="category-card"
                role="listitem"
                aria-label={`Category: ${category.name}`}
              >
                <div className="category-header">
                  <h3>{category.name}</h3>
                  <span className="category-badge" aria-label={`${category.projectCount} projects`}>
                    {category.projectCount} project{category.projectCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="category-stats" aria-label="Category statistics">
                  <div className="category-stat">
                    <div className="stat-icon" aria-hidden="true">
                      🎯
                    </div>
                    <div className="stat-info">
                      <div className="stat-number">{category.activeProjects}</div>
                      <div className="stat-text">Active</div>
                    </div>
                  </div>
                  <div className="category-stat">
                    <div className="stat-icon" aria-hidden="true">
                      📝
                    </div>
                    <div className="stat-info">
                      <div className="stat-number">{category.sessionCount}</div>
                      <div className="stat-text">Sessions</div>
                    </div>
                  </div>
                  <div className="category-stat">
                    <div className="stat-icon" aria-hidden="true">
                      ⏱️
                    </div>
                    <div className="stat-info">
                      <div className="stat-number">{category.totalHours}h</div>
                      <div className="stat-text">Logged</div>
                    </div>
                  </div>
                </div>
                <div
                  className="category-progress"
                  role="progressbar"
                  aria-valuenow={Math.min(
                    100,
                    Math.round((category.sessionCount / (stats?.totalSessions || 1)) * 100)
                  )}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${Math.round((category.sessionCount / (stats?.totalSessions || 1)) * 100)}% of total sessions`}
                >
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
              </article>
            ))}
          </div>
        </section>
      )}

      <main
        className="projects-section"
        id={currentSessions.length === 0 ? 'main-content' : undefined}
        aria-labelledby="projects-heading"
      >
        <h2 id="projects-heading">Your Projects</h2>
        {projects.length === 0 ? (
          <div className="empty-state" role="status" aria-live="polite">
            <p>No projects yet. Create your first project to get started!</p>
          </div>
        ) : (
          <div className="projects-grid" role="list" aria-label="Project list">
            {projects.map(project => (
              <article
                key={project.id}
                className="project-card"
                role="listitem"
                aria-label={`Project: ${project.name}, Status: ${project.status}`}
              >
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <span
                    className={`status-badge status-${project.status.toLowerCase()}`}
                    role="status"
                    aria-label={`Status: ${project.status}`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-meta" aria-label="Project details">
                  <span className="project-type">
                    <span className="sr-only">Type:</span> {project.type}
                  </span>
                  <span className="project-workspace">
                    <span className="sr-only">Workspace:</span> {project.workspace}
                  </span>
                </div>
                <div className="project-actions" role="group" aria-label="Project actions">
                  <button
                    className="btn-link"
                    onClick={() => navigate(`/project/${project.id}`)}
                    aria-label={`View details for ${project.name}`}
                  >
                    View Details
                  </button>
                  <button
                    className="btn-resume"
                    onClick={e => handleResumeProject(project, e)}
                    aria-label={`Resume working on ${project.name}`}
                  >
                    <span aria-hidden="true">🚀</span> Resume
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

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
