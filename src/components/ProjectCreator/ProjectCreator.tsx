/**
 * ProjectCreator Component
 * Modal form for creating new projects in Notion
 */

import React, { useState } from 'react';
import './ProjectCreator.css';

interface ProjectCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectCreator: React.FC<ProjectCreatorProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
    priority: 'Medium',
    type: 'Web Application',
    workspace: '',
    repository: '',
    currentContext: '',
    nextSteps: '',
    techStack: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: '',
          description: '',
          status: 'Active',
          priority: 'Medium',
          type: 'Web Application',
          workspace: '',
          repository: '',
          currentContext: '',
          nextSteps: '',
          techStack: '',
        });
      } else {
        setError(data.error || 'Failed to create project');
      }
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="project-creator-overlay" onClick={onClose}>
      <div className="project-creator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="project-creator-header">
          <h2>🚀 Create New Project</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="project-creator-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-section">
            <h3>📋 Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Project Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., My Awesome App"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of what this project does..."
                rows={3}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Complete">Complete</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="type">Project Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Web Application">Web Application</option>
                <option value="Mobile App">Mobile App</option>
                <option value="API/Backend">API/Backend</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Documentation">Documentation</option>
                <option value="Library/Package">Library/Package</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>💻 Technical Details</h3>
            
            <div className="form-group">
              <label htmlFor="workspace">Local Workspace Path</label>
              <input
                type="text"
                id="workspace"
                name="workspace"
                value={formData.workspace}
                onChange={handleChange}
                placeholder="e.g., /Users/alex/Projects/my-app"
              />
            </div>

            <div className="form-group">
              <label htmlFor="repository">Repository URL</label>
              <input
                type="url"
                id="repository"
                name="repository"
                value={formData.repository}
                onChange={handleChange}
                placeholder="e.g., https://github.com/username/repo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="techStack">Tech Stack</label>
              <input
                type="text"
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="e.g., React, TypeScript, Node.js (comma-separated)"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>📝 Project Context</h3>
            
            <div className="form-group">
              <label htmlFor="currentContext">Current Context</label>
              <textarea
                id="currentContext"
                name="currentContext"
                value={formData.currentContext}
                onChange={handleChange}
                placeholder="What's the current state of this project?"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nextSteps">Next Steps</label>
              <textarea
                id="nextSteps"
                name="nextSteps"
                value={formData.nextSteps}
                onChange={handleChange}
                placeholder="What needs to be done next?"
                rows={3}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Project...' : '✅ Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreator;





