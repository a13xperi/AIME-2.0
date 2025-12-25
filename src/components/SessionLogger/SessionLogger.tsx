/**
 * SessionLogger Component
 * Modal form for logging new work sessions to Notion
 */

import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import SessionTemplates, { SessionTemplate } from '../SessionTemplates/SessionTemplates';
import './SessionLogger.css';

interface SessionLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projects: Project[];
  preselectedProjectId?: string;
}

const SessionLogger: React.FC<SessionLoggerProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projects,
  preselectedProjectId,
}) => {
  const [formData, setFormData] = useState({
    projectId: preselectedProjectId || '',
    title: '',
    duration: '',
    sessionType: 'Feature Development',
    aiAgent: 'Claude',
    workspace: 'Cursor',
    summary: '',
    filesModified: '',
    nextSteps: '',
    blockers: '',
    keyDecisions: '',
    challenges: '',
    solutions: '',
    codeChanges: '',
    outcomes: '',
    learnings: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (preselectedProjectId) {
      setFormData(prev => ({ ...prev, projectId: preselectedProjectId }));
    }
  }, [preselectedProjectId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (template: SessionTemplate) => {
    setFormData(prev => ({
      ...prev,
      sessionType: template.type,
      aiAgent: template.defaultFields.aiAgent || prev.aiAgent,
      workspace: template.defaultFields.workspace || prev.workspace,
      summary: template.defaultFields.summary || prev.summary,
      nextSteps: template.defaultFields.nextSteps || prev.nextSteps,
    }));
    setShowTemplates(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration) || 0,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          projectId: '',
          title: '',
          duration: '',
          sessionType: 'Feature Development',
          aiAgent: 'Claude',
          workspace: 'Cursor',
          summary: '',
          filesModified: '',
          nextSteps: '',
          blockers: '',
          keyDecisions: '',
          challenges: '',
          solutions: '',
          codeChanges: '',
          outcomes: '',
          learnings: '',
        });
      } else {
        setError(data.error || 'Failed to create session');
      }
    } catch (err) {
      setError('Failed to create session. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="session-logger-overlay" onClick={onClose}>
      <div className="session-logger-modal" onClick={e => e.stopPropagation()}>
        <div className="session-logger-header">
          <h2>📝 Log Work Session</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="session-logger-form">
          {error && <div className="error-message">{error}</div>}

          {/* Core Information */}
          <div className="form-section">
            <h3>📋 Core Information</h3>

            <div className="form-group">
              <label>Session Template</label>
              <button
                type="button"
                className="template-select-button"
                onClick={() => setShowTemplates(true)}
              >
                🎯 Choose Template
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="projectId">Project *</label>
              <select
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                required
              >
                <option value="">Select a project...</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="title">Session Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Implemented user authentication"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration">Duration (minutes) *</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="120"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sessionType">Session Type *</label>
                <select
                  id="sessionType"
                  name="sessionType"
                  value={formData.sessionType}
                  onChange={handleChange}
                  required
                >
                  <option value="Feature Development">Feature Development</option>
                  <option value="Bug Fix">Bug Fix</option>
                  <option value="Refactoring">Refactoring</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Planning">Planning</option>
                  <option value="Testing">Testing</option>
                  <option value="Deployment">Deployment</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="aiAgent">AI Agent Used *</label>
                <select
                  id="aiAgent"
                  name="aiAgent"
                  value={formData.aiAgent}
                  onChange={handleChange}
                  required
                >
                  <option value="Claude">Claude</option>
                  <option value="GPT-4">GPT-4</option>
                  <option value="Gemini">Gemini</option>
                  <option value="Multiple">Multiple</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="workspace">Workspace Used *</label>
                <select
                  id="workspace"
                  name="workspace"
                  value={formData.workspace}
                  onChange={handleChange}
                  required
                >
                  <option value="Cursor">Cursor</option>
                  <option value="VS Code">VS Code</option>
                  <option value="Warp">Warp</option>
                  <option value="Terminal">Terminal</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="form-section">
            <h3>📝 Session Details</h3>

            <div className="form-group">
              <label htmlFor="summary">Summary *</label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Brief summary of what you accomplished..."
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="filesModified">Files Modified</label>
              <textarea
                id="filesModified"
                name="filesModified"
                value={formData.filesModified}
                onChange={handleChange}
                placeholder="List files modified during this session..."
                rows={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="codeChanges">Code Changes</label>
              <textarea
                id="codeChanges"
                name="codeChanges"
                value={formData.codeChanges}
                onChange={handleChange}
                placeholder="Describe the code changes made..."
                rows={3}
              />
            </div>
          </div>

          {/* Next Steps & Blockers */}
          <div className="form-section">
            <h3>🚀 Next Steps & Issues</h3>

            <div className="form-group">
              <label htmlFor="nextSteps">Next Steps</label>
              <textarea
                id="nextSteps"
                name="nextSteps"
                value={formData.nextSteps}
                onChange={handleChange}
                placeholder="What needs to be done next..."
                rows={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="blockers">Blockers</label>
              <textarea
                id="blockers"
                name="blockers"
                value={formData.blockers}
                onChange={handleChange}
                placeholder="Any blockers or challenges..."
                rows={2}
              />
            </div>
          </div>

          {/* Additional Context (Optional) */}
          <details className="form-section collapsible">
            <summary>💡 Additional Context (Optional)</summary>

            <div className="form-group">
              <label htmlFor="keyDecisions">Key Decisions</label>
              <textarea
                id="keyDecisions"
                name="keyDecisions"
                value={formData.keyDecisions}
                onChange={handleChange}
                placeholder="Important decisions made..."
                rows={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="challenges">Challenges</label>
              <textarea
                id="challenges"
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                placeholder="Challenges encountered..."
                rows={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="solutions">Solutions</label>
              <textarea
                id="solutions"
                name="solutions"
                value={formData.solutions}
                onChange={handleChange}
                placeholder="Solutions implemented..."
                rows={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="outcomes">Outcomes</label>
              <textarea
                id="outcomes"
                name="outcomes"
                value={formData.outcomes}
                onChange={handleChange}
                placeholder="What was the result..."
                rows={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="learnings">Learnings</label>
              <textarea
                id="learnings"
                name="learnings"
                value={formData.learnings}
                onChange={handleChange}
                placeholder="What did you learn..."
                rows={2}
              />
            </div>
          </details>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging Session...' : '✅ Log Session'}
            </button>
          </div>
        </form>
      </div>

      {showTemplates && (
        <SessionTemplates
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};

export default SessionLogger;
