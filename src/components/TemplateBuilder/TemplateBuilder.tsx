import React, { useState } from 'react';
import { ProjectTemplate, ProjectPhase, SessionTemplate, Resource } from '../../types';
import './TemplateBuilder.css';

interface TemplateBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: ProjectTemplate) => void;
  initialTemplate?: ProjectTemplate;
}

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTemplate,
}) => {
  const [template, setTemplate] = useState<Partial<ProjectTemplate>>({
    name: '',
    description: '',
    category: 'Development',
    tags: [],
    isDefault: false,
    isPublic: true,
    createdBy: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    templateData: {
      projectName: '',
      description: '',
      category: 'Web Application',
      priority: 'Medium',
      status: 'Planning',
      estimatedDuration: 40,
      phases: [],
      defaultSessions: [],
      checklist: [],
      resources: [],
    },
  });

  const [newTag, setNewTag] = useState('');
  const [newPhase, setNewPhase] = useState<Partial<ProjectPhase>>({
    name: '',
    description: '',
    estimatedDuration: 8,
    dependencies: [],
    deliverables: [],
    checklist: [],
  });
  const [newSession, setNewSession] = useState<Partial<SessionTemplate>>({
    name: '',
    description: '',
    type: 'Planning',
    estimatedDuration: 4,
    objectives: [],
    deliverables: [],
    checklist: [],
  });
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    name: '',
    type: 'Document',
    description: '',
    category: 'Reference',
  });

  const categories = [
    'Development',
    'Design',
    'Research',
    'Marketing',
    'Business',
    'Personal',
    'Learning',
  ];

  const sessionTypes = [
    'Feature Development',
    'Bug Fix',
    'Refactoring',
    'Documentation',
    'Planning',
    'Testing',
    'Deployment',
  ];

  const resourceTypes = ['Document', 'Link', 'Tool', 'Reference'];

  const handleSave = () => {
    if (!template.name || !template.description) {
      alert('Please fill in all required fields');
      return;
    }

    const fullTemplate: ProjectTemplate = {
      id: initialTemplate?.id || `template-${Date.now()}`,
      name: template.name!,
      description: template.description!,
      category: template.category!,
      tags: template.tags!,
      isDefault: template.isDefault!,
      isPublic: template.isPublic!,
      createdBy: template.createdBy!,
      createdAt: template.createdAt!,
      updatedAt: new Date().toISOString(),
      templateData: template.templateData!,
    };

    onSave(fullTemplate);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !template.tags?.includes(newTag.trim())) {
      setTemplate(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTemplate(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const addPhase = () => {
    if (newPhase.name && newPhase.description) {
      const phase: ProjectPhase = {
        id: `phase-${Date.now()}`,
        name: newPhase.name,
        description: newPhase.description,
        order: (template.templateData?.phases?.length || 0) + 1,
        estimatedDuration: newPhase.estimatedDuration || 8,
        dependencies: newPhase.dependencies || [],
        deliverables: newPhase.deliverables || [],
        checklist: newPhase.checklist || [],
      };

      setTemplate(prev => ({
        ...prev,
        templateData: {
          ...prev.templateData!,
          phases: [...(prev.templateData?.phases || []), phase],
        },
      }));

      setNewPhase({
        name: '',
        description: '',
        estimatedDuration: 8,
        dependencies: [],
        deliverables: [],
        checklist: [],
      });
    }
  };

  const removePhase = (phaseId: string) => {
    setTemplate(prev => ({
      ...prev,
      templateData: {
        ...prev.templateData!,
        phases: prev.templateData?.phases?.filter(phase => phase.id !== phaseId) || [],
      },
    }));
  };

  const addSession = () => {
    if (newSession.name && newSession.description) {
      const session: SessionTemplate = {
        id: `session-${Date.now()}`,
        name: newSession.name,
        description: newSession.description,
        type: newSession.type!,
        estimatedDuration: newSession.estimatedDuration || 4,
        objectives: newSession.objectives || [],
        deliverables: newSession.deliverables || [],
        checklist: newSession.checklist || [],
      };

      setTemplate(prev => ({
        ...prev,
        templateData: {
          ...prev.templateData!,
          defaultSessions: [...(prev.templateData?.defaultSessions || []), session],
        },
      }));

      setNewSession({
        name: '',
        description: '',
        type: 'Planning',
        estimatedDuration: 4,
        objectives: [],
        deliverables: [],
        checklist: [],
      });
    }
  };

  const removeSession = (sessionId: string) => {
    setTemplate(prev => ({
      ...prev,
      templateData: {
        ...prev.templateData!,
        defaultSessions:
          prev.templateData?.defaultSessions?.filter(session => session.id !== sessionId) || [],
      },
    }));
  };

  const addResource = () => {
    if (newResource.name && newResource.description) {
      const resource: Resource = {
        id: `resource-${Date.now()}`,
        name: newResource.name,
        type: newResource.type!,
        description: newResource.description,
        category: newResource.category || 'Reference',
        url: newResource.url,
      };

      setTemplate(prev => ({
        ...prev,
        templateData: {
          ...prev.templateData!,
          resources: [...(prev.templateData?.resources || []), resource],
        },
      }));

      setNewResource({
        name: '',
        type: 'Document',
        description: '',
        category: 'Reference',
      });
    }
  };

  const removeResource = (resourceId: string) => {
    setTemplate(prev => ({
      ...prev,
      templateData: {
        ...prev.templateData!,
        resources:
          prev.templateData?.resources?.filter(resource => resource.id !== resourceId) || [],
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="template-builder-overlay">
      <div className="template-builder-modal">
        <div className="builder-header">
          <h2>🔧 Template Builder</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="builder-content">
          <div className="builder-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Template Name *</label>
              <input
                type="text"
                value={template.name || ''}
                onChange={e => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Web Application Template"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={template.description || ''}
                onChange={e => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this template is for..."
                className="form-textarea"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={template.category || 'Development'}
                  onChange={e => setTemplate(prev => ({ ...prev, category: e.target.value }))}
                  className="form-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Duration (hours)</label>
                <input
                  type="number"
                  value={template.templateData?.estimatedDuration || 40}
                  onChange={e =>
                    setTemplate(prev => ({
                      ...prev,
                      templateData: {
                        ...prev.templateData!,
                        estimatedDuration: parseInt(e.target.value) || 40,
                      },
                    }))
                  }
                  className="form-input"
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tags</label>
              <div className="tags-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="form-input"
                  onKeyPress={e => e.key === 'Enter' && addTag()}
                />
                <button type="button" onClick={addTag} className="btn btn-outline btn-small">
                  Add
                </button>
              </div>
              <div className="tags-list">
                {template.tags?.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="tag-remove">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="builder-section">
            <h3>Project Phases</h3>
            <div className="phase-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Phase Name</label>
                  <input
                    type="text"
                    value={newPhase.name || ''}
                    onChange={e => setNewPhase(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Planning & Setup"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Duration (hours)</label>
                  <input
                    type="number"
                    value={newPhase.estimatedDuration || 8}
                    onChange={e =>
                      setNewPhase(prev => ({
                        ...prev,
                        estimatedDuration: parseInt(e.target.value) || 8,
                      }))
                    }
                    className="form-input"
                    min="1"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPhase.description || ''}
                  onChange={e => setNewPhase(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this phase..."
                  className="form-textarea"
                  rows={2}
                />
              </div>
              <button type="button" onClick={addPhase} className="btn btn-primary">
                Add Phase
              </button>
            </div>

            <div className="phases-list">
              {template.templateData?.phases?.map((phase, index) => (
                <div key={phase.id} className="phase-item">
                  <div className="phase-header">
                    <span className="phase-number">{index + 1}</span>
                    <span className="phase-name">{phase.name}</span>
                    <span className="phase-duration">{phase.estimatedDuration}h</span>
                    <button
                      onClick={() => removePhase(phase.id)}
                      className="btn btn-danger btn-small"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="phase-description">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="builder-section">
            <h3>Default Sessions</h3>
            <div className="session-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Session Name</label>
                  <input
                    type="text"
                    value={newSession.name || ''}
                    onChange={e => setNewSession(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Planning Session"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={newSession.type || 'Planning'}
                    onChange={e =>
                      setNewSession(prev => ({ ...prev, type: e.target.value as any }))
                    }
                    className="form-select"
                  >
                    {sessionTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (hours)</label>
                  <input
                    type="number"
                    value={newSession.estimatedDuration || 4}
                    onChange={e =>
                      setNewSession(prev => ({
                        ...prev,
                        estimatedDuration: parseInt(e.target.value) || 4,
                      }))
                    }
                    className="form-input"
                    min="1"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newSession.description || ''}
                  onChange={e => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this session..."
                  className="form-textarea"
                  rows={2}
                />
              </div>
              <button type="button" onClick={addSession} className="btn btn-primary">
                Add Session
              </button>
            </div>

            <div className="sessions-list">
              {template.templateData?.defaultSessions?.map(session => (
                <div key={session.id} className="session-item">
                  <div className="session-header">
                    <span className="session-name">{session.name}</span>
                    <span className="session-type">{session.type}</span>
                    <span className="session-duration">{session.estimatedDuration}h</span>
                    <button
                      onClick={() => removeSession(session.id)}
                      className="btn btn-danger btn-small"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="session-description">{session.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="builder-section">
            <h3>Resources</h3>
            <div className="resource-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Resource Name</label>
                  <input
                    type="text"
                    value={newResource.name || ''}
                    onChange={e => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., React Documentation"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={newResource.type || 'Document'}
                    onChange={e =>
                      setNewResource(prev => ({ ...prev, type: e.target.value as any }))
                    }
                    className="form-select"
                  >
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newResource.description || ''}
                  onChange={e => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this resource..."
                  className="form-textarea"
                  rows={2}
                />
              </div>
              {newResource.type === 'Link' && (
                <div className="form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    value={newResource.url || ''}
                    onChange={e => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com"
                    className="form-input"
                  />
                </div>
              )}
              <button type="button" onClick={addResource} className="btn btn-primary">
                Add Resource
              </button>
            </div>

            <div className="resources-list">
              {template.templateData?.resources?.map(resource => (
                <div key={resource.id} className="resource-item">
                  <div className="resource-header">
                    <span className="resource-name">{resource.name}</span>
                    <span className="resource-type">{resource.type}</span>
                    <button
                      onClick={() => removeResource(resource.id)}
                      className="btn btn-danger btn-small"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="resource-description">{resource.description}</p>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      View Resource
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="builder-actions">
            <button onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;
