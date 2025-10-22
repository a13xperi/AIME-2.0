import React, { useState, useEffect } from 'react';
import { Project, ProjectDependency } from '../../types';
import './ProjectDependencies.css';

interface ProjectDependenciesProps {
  project: Project;
  allProjects: Project[];
  onDependencyAdd: (dependency: Omit<ProjectDependency, 'id' | 'createdAt'>) => void;
  onDependencyRemove: (dependencyId: string) => void;
  onClose: () => void;
}

const ProjectDependencies: React.FC<ProjectDependenciesProps> = ({
  project,
  allProjects,
  onDependencyAdd,
  onDependencyRemove,
  onClose
}) => {
  const [dependencies, setDependencies] = useState<ProjectDependency[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDependency, setNewDependency] = useState({
    dependsOnProjectId: '',
    dependencyType: 'blocks' as const,
    description: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockDependencies: ProjectDependency[] = [
      {
        id: 'dep-1',
        projectId: project.id,
        dependsOnProjectId: 'proj-1',
        dependencyType: 'blocks',
        description: 'API backend must be completed before frontend integration',
        createdAt: new Date().toISOString()
      },
      {
        id: 'dep-2',
        projectId: project.id,
        dependsOnProjectId: 'proj-2',
        dependencyType: 'enables',
        description: 'Design system enables consistent UI development',
        createdAt: new Date().toISOString()
      }
    ];
    setDependencies(mockDependencies);
  }, [project.id]);

  const availableProjects = allProjects.filter(p => p.id !== project.id);

  const handleAddDependency = () => {
    if (newDependency.dependsOnProjectId) {
      const dependency: Omit<ProjectDependency, 'id' | 'createdAt'> = {
        projectId: project.id,
        dependsOnProjectId: newDependency.dependsOnProjectId,
        dependencyType: newDependency.dependencyType,
        description: newDependency.description
      };
      onDependencyAdd(dependency);
      setNewDependency({
        dependsOnProjectId: '',
        dependencyType: 'blocks',
        description: ''
      });
      setShowAddForm(false);
    }
  };

  const getDependencyTypeIcon = (type: string) => {
    switch (type) {
      case 'blocks': return '🚫';
      case 'enables': return '✅';
      case 'relates': return '🔗';
      default: return '📋';
    }
  };

  const getDependencyTypeColor = (type: string) => {
    switch (type) {
      case 'blocks': return '#dc2626';
      case 'enables': return '#16a34a';
      case 'relates': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getProjectName = (projectId: string) => {
    const proj = allProjects.find(p => p.id === projectId);
    return proj ? proj.name : 'Unknown Project';
  };

  return (
    <div className="project-dependencies-overlay">
      <div className="project-dependencies-modal">
        <div className="dependencies-header">
          <h2>🔗 Project Dependencies</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="dependencies-content">
          <div className="project-info">
            <h3>{project.name}</h3>
            <p className="project-description">{project.description}</p>
          </div>

          <div className="dependencies-section">
            <div className="section-header">
              <h4>Current Dependencies</h4>
              <button 
                className="btn btn-primary btn-small"
                onClick={() => setShowAddForm(true)}
              >
                + Add Dependency
              </button>
            </div>

            {dependencies.length === 0 ? (
              <div className="no-dependencies">
                <p>No dependencies defined for this project.</p>
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowAddForm(true)}
                >
                  Add First Dependency
                </button>
              </div>
            ) : (
              <div className="dependencies-list">
                {dependencies.map(dependency => (
                  <div key={dependency.id} className="dependency-item">
                    <div className="dependency-header">
                      <div className="dependency-type">
                        <span 
                          className="type-icon"
                          style={{ color: getDependencyTypeColor(dependency.dependencyType) }}
                        >
                          {getDependencyTypeIcon(dependency.dependencyType)}
                        </span>
                        <span className="type-label">
                          {dependency.dependencyType.charAt(0).toUpperCase() + dependency.dependencyType.slice(1)}
                        </span>
                      </div>
                      <button 
                        className="btn btn-danger btn-small"
                        onClick={() => onDependencyRemove(dependency.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="dependency-content">
                      <h5>{getProjectName(dependency.dependsOnProjectId)}</h5>
                      {dependency.description && (
                        <p className="dependency-description">{dependency.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showAddForm && (
            <div className="add-dependency-form">
              <h4>Add New Dependency</h4>
              <div className="form-group">
                <label>Depends On Project</label>
                <select
                  value={newDependency.dependsOnProjectId}
                  onChange={(e) => setNewDependency(prev => ({ ...prev, dependsOnProjectId: e.target.value }))}
                  className="form-select"
                >
                  <option value="">Select a project...</option>
                  {availableProjects.map(proj => (
                    <option key={proj.id} value={proj.id}>{proj.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Dependency Type</label>
                <select
                  value={newDependency.dependencyType}
                  onChange={(e) => setNewDependency(prev => ({ ...prev, dependencyType: e.target.value as any }))}
                  className="form-select"
                >
                  <option value="blocks">Blocks - This project blocks the other</option>
                  <option value="enables">Enables - This project enables the other</option>
                  <option value="relates">Relates - This project relates to the other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={newDependency.description}
                  onChange={(e) => setNewDependency(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the relationship..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleAddDependency}
                  disabled={!newDependency.dependsOnProjectId}
                >
                  Add Dependency
                </button>
              </div>
            </div>
          )}

          <div className="dependency-visualization">
            <h4>Dependency Map</h4>
            <div className="dependency-map">
              <div className="map-node current-project">
                <span className="node-label">{project.name}</span>
                <span className="node-type">Current Project</span>
              </div>
              
              {dependencies.map(dependency => (
                <div key={dependency.id} className="map-connection">
                  <div className="connection-line"></div>
                  <div className="map-node dependent-project">
                    <span className="node-label">{getProjectName(dependency.dependsOnProjectId)}</span>
                    <span className="node-type">{dependency.dependencyType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDependencies;


