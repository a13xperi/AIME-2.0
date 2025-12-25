/**
 * ProjectDetail Component
 * Detailed view of a single project with full context
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, Session } from '../../types';
import QuickResume from '../QuickResume/QuickResume';
import ProjectBacklog from '../ProjectBacklog/ProjectBacklog';
import SessionCard from '../SessionCard/SessionCard';
import './ProjectDetail.css';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResume, setShowResume] = useState(false);

  const loadProject = useCallback(async () => {
    setLoading(true);
    setError(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    try {
      // Fetch project details
      const projectResponse = await fetch(`${API_URL}/api/projects/${id}`);
      const projectData = await projectResponse.json();

      if (projectData.success && projectData.project) {
        setProject(projectData.project);

        // Fetch related sessions
        const sessionsResponse = await fetch(
          `${API_URL}/api/sessions?projectId=${encodeURIComponent(projectData.project.name)}`
        );
        const sessionsData = await sessionsResponse.json();

        if (sessionsData.success && sessionsData.sessions) {
          setSessions(sessionsData.sessions);
        }
      } else {
        setError(projectData.error || 'Project not found');
      }
    } catch (err) {
      setError('Failed to load project details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  if (loading) {
    return (
      <div className="project-detail">
        <div className="loading">
          <h2>Loading project details...</h2>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail">
        <div className="error-state">
          <h2>Error Loading Project</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <header className="detail-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
        <div className="project-title-section">
          <h1>{project.name}</h1>
          <div className="project-badges">
            <span
              className={`status-badge status-${project.status.toLowerCase().replace(/[^a-z]/g, '')}`}
            >
              {project.status}
            </span>
            <span
              className={`priority-badge priority-${project.priority.toLowerCase().replace(/[^a-z]/g, '')}`}
            >
              {project.priority}
            </span>
          </div>
        </div>
      </header>

      <div className="detail-grid">
        <div className="detail-main">
          <section className="detail-card">
            <h2>📋 Description</h2>
            <p>{project.description || 'No description available'}</p>
          </section>

          <section className="detail-card context-card">
            <h2>💡 Current Context - Where You Left Off</h2>
            <div className="context-content">
              {project.currentContext || 'No context available'}
            </div>
            <button className="resume-button" onClick={() => setShowResume(true)}>
              🚀 Resume Working on This
            </button>
          </section>

          {/* Backlog & Plans Section */}
          <ProjectBacklog project={project} />

          <section className="detail-card">
            <h2>🛠️ Tech Stack</h2>
            <div className="tech-stack-list">
              {project.techStack && project.techStack.length > 0 ? (
                project.techStack.map((tech, index) => (
                  <span key={index} className="tech-badge">
                    {tech}
                  </span>
                ))
              ) : (
                <p>No tech stack specified</p>
              )}
            </div>
          </section>

          <section className="detail-card sessions-section-wrapper">
            <h2>📝 Recent Work Sessions</h2>
            {sessions.length > 0 ? (
              <div className="sessions-list-rich">
                {sessions.slice(0, 10).map(session => (
                  <SessionCard key={session.id} session={session} detailed={false} />
                ))}
              </div>
            ) : (
              <p className="no-sessions">No sessions recorded yet for this project.</p>
            )}
            {sessions.length > 10 && (
              <div className="view-all-sessions">
                <button onClick={() => navigate('/sessions')} className="view-all-button">
                  View All {sessions.length} Sessions →
                </button>
              </div>
            )}
          </section>

          <section className="detail-card">
            <h2>📊 Activity Timeline</h2>
            <div className="activity-timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-date">
                    {project.lastUpdated
                      ? new Date(project.lastUpdated).toLocaleDateString()
                      : 'N/A'}
                  </span>
                  <span className="timeline-label">Last Updated</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-date">
                    {project.startedDate
                      ? new Date(project.startedDate).toLocaleDateString()
                      : 'N/A'}
                  </span>
                  <span className="timeline-label">Project Started</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="detail-sidebar">
          <section className="detail-card">
            <h3>🔗 Quick Links</h3>
            <div className="quick-links">
              {project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-item"
                >
                  <span className="link-icon">📦</span>
                  <span className="link-text">Repository</span>
                </a>
              )}
              {project.workspace && (
                <div className="link-item">
                  <span className="link-icon">📁</span>
                  <span className="link-text">{project.workspace}</span>
                </div>
              )}
            </div>
          </section>

          <section className="detail-card">
            <h3>📊 Project Info</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Type</span>
                <span className="info-value">{project.type || 'General'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">{project.status}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Priority</span>
                <span className="info-value">{project.priority}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Started</span>
                <span className="info-value">
                  {project.startedDate ? new Date(project.startedDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </section>

          <section className="detail-card stats-card">
            <h3>⏱️ Work Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{sessions.length}</div>
                <div className="stat-description">Sessions Logged</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {sessions.reduce((total, s) => total + (s.duration || 0), 0)} min
                </div>
                <div className="stat-description">Total Time</div>
              </div>
            </div>
          </section>

          <section className="detail-card actions-card">
            <h3>⚡ Quick Actions</h3>
            <button className="action-button primary">📝 Log Session</button>
            <button className="action-button">✏️ Edit Project</button>
            <button className="action-button">🔗 Open in Notion</button>
          </section>
        </div>
      </div>

      {/* Quick Resume Modal */}
      {showResume && project && (
        <QuickResume
          project={project}
          lastSession={sessions.length > 0 ? sessions[0] : undefined}
          onClose={() => setShowResume(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
