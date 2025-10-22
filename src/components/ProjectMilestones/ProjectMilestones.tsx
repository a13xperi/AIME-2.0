import React, { useState, useEffect } from 'react';
import { Project, ProjectMilestone } from '../../types';
import './ProjectMilestones.css';

interface ProjectMilestonesProps {
  project: Project;
  onMilestoneAdd: (milestone: Omit<ProjectMilestone, 'id'>) => void;
  onMilestoneUpdate: (milestoneId: string, updates: Partial<ProjectMilestone>) => void;
  onMilestoneDelete: (milestoneId: string) => void;
  onClose: () => void;
}

const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({
  project,
  onMilestoneAdd,
  onMilestoneUpdate,
  onMilestoneDelete,
  onClose
}) => {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    description: '',
    targetDate: '',
    priority: 'medium' as const,
    deliverables: '',
    dependencies: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockMilestones: ProjectMilestone[] = [
      {
        id: 'milestone-1',
        projectId: project.id,
        name: 'Project Kickoff',
        description: 'Initial project setup and team alignment',
        targetDate: '2024-01-15',
        completedDate: '2024-01-14',
        status: 'completed',
        priority: 'high',
        deliverables: ['Project charter', 'Team assignments', 'Initial timeline'],
        dependencies: [],
        progress: 100
      },
      {
        id: 'milestone-2',
        projectId: project.id,
        name: 'Design Phase Complete',
        description: 'All UI/UX designs finalized and approved',
        targetDate: '2024-02-28',
        status: 'in-progress',
        priority: 'high',
        deliverables: ['Wireframes', 'Mockups', 'Design system', 'User flows'],
        dependencies: ['milestone-1'],
        progress: 65
      },
      {
        id: 'milestone-3',
        projectId: project.id,
        name: 'Development Phase Complete',
        description: 'Core functionality implemented and tested',
        targetDate: '2024-04-15',
        status: 'pending',
        priority: 'critical',
        deliverables: ['Backend API', 'Frontend components', 'Database schema', 'Unit tests'],
        dependencies: ['milestone-2'],
        progress: 0
      },
      {
        id: 'milestone-4',
        projectId: project.id,
        name: 'Testing & QA Complete',
        description: 'All testing phases completed and bugs resolved',
        targetDate: '2024-05-30',
        status: 'pending',
        priority: 'high',
        deliverables: ['Test reports', 'Bug fixes', 'Performance optimization'],
        dependencies: ['milestone-3'],
        progress: 0
      },
      {
        id: 'milestone-5',
        projectId: project.id,
        name: 'Production Launch',
        description: 'Application deployed to production and live',
        targetDate: '2024-06-15',
        status: 'pending',
        priority: 'critical',
        deliverables: ['Production deployment', 'Monitoring setup', 'Documentation'],
        dependencies: ['milestone-4'],
        progress: 0
      }
    ];
    setMilestones(mockMilestones);
  }, [project.id]);

  const handleAddMilestone = () => {
    if (newMilestone.name && newMilestone.targetDate) {
      const milestone: Omit<ProjectMilestone, 'id'> = {
        projectId: project.id,
        name: newMilestone.name,
        description: newMilestone.description,
        targetDate: newMilestone.targetDate,
        status: 'pending',
        priority: newMilestone.priority,
        deliverables: newMilestone.deliverables.split(',').map(d => d.trim()).filter(d => d),
        dependencies: newMilestone.dependencies.split(',').map(d => d.trim()).filter(d => d),
        progress: 0
      };
      onMilestoneAdd(milestone);
      setNewMilestone({
        name: '',
        description: '',
        targetDate: '',
        priority: 'medium',
        deliverables: '',
        dependencies: ''
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateProgress = (milestoneId: string, progress: number) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    if (milestone) {
      const updates: Partial<ProjectMilestone> = {
        progress: Math.max(0, Math.min(100, progress)),
        status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending'
      };
      if (progress === 100 && !milestone.completedDate) {
        updates.completedDate = new Date().toISOString().split('T')[0];
      }
      onMilestoneUpdate(milestoneId, updates);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'overdue': return '⚠️';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#16a34a';
      case 'in-progress': return '#3b82f6';
      case 'overdue': return '#dc2626';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const isOverdue = (targetDate: string, status: string) => {
    if (status === 'completed') return false;
    return new Date(targetDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="project-milestones-overlay">
      <div className="project-milestones-modal">
        <div className="milestones-header">
          <h2>🎯 Project Milestones</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="milestones-content">
          <div className="project-info">
            <h3>{project.name}</h3>
            <p className="project-description">{project.description}</p>
          </div>

          <div className="milestones-overview">
            <div className="overview-stats">
              <div className="stat-item">
                <span className="stat-number">{milestones.length}</span>
                <span className="stat-label">Total Milestones</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{milestones.filter(m => m.status === 'completed').length}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{milestones.filter(m => m.status === 'in-progress').length}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{milestones.filter(m => isOverdue(m.targetDate, m.status)).length}</span>
                <span className="stat-label">Overdue</span>
              </div>
            </div>
          </div>

          <div className="milestones-section">
            <div className="section-header">
              <h4>Milestone Timeline</h4>
              <button 
                className="btn btn-primary btn-small"
                onClick={() => setShowAddForm(true)}
              >
                + Add Milestone
              </button>
            </div>

            <div className="milestones-timeline">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="milestone-item">
                  <div className="milestone-header">
                    <div className="milestone-status">
                      <span 
                        className="status-icon"
                        style={{ color: getStatusColor(milestone.status) }}
                      >
                        {getStatusIcon(milestone.status)}
                      </span>
                      <span className="milestone-name">{milestone.name}</span>
                    </div>
                    <div className="milestone-meta">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(milestone.priority) }}
                      >
                        {milestone.priority}
                      </span>
                      <span className="target-date">
                        {formatDate(milestone.targetDate)}
                      </span>
                    </div>
                  </div>

                  <div className="milestone-content">
                    <p className="milestone-description">{milestone.description}</p>
                    
                    <div className="milestone-progress">
                      <div className="progress-header">
                        <span className="progress-label">Progress</span>
                        <span className="progress-percentage">{milestone.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${milestone.progress}%`,
                            backgroundColor: getStatusColor(milestone.status)
                          }}
                        ></div>
                      </div>
                      <div className="progress-controls">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={milestone.progress}
                          onChange={(e) => handleUpdateProgress(milestone.id, parseInt(e.target.value))}
                          className="progress-slider"
                        />
                      </div>
                    </div>

                    {milestone.deliverables.length > 0 && (
                      <div className="milestone-deliverables">
                        <h5>Deliverables:</h5>
                        <ul>
                          {milestone.deliverables.map((deliverable, idx) => (
                            <li key={idx}>{deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="milestone-actions">
                      <button 
                        className="btn btn-outline btn-small"
                        onClick={() => setEditingMilestone(editingMilestone === milestone.id ? null : milestone.id)}
                      >
                        {editingMilestone === milestone.id ? 'Cancel' : 'Edit'}
                      </button>
                      <button 
                        className="btn btn-danger btn-small"
                        onClick={() => onMilestoneDelete(milestone.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {index < milestones.length - 1 && (
                    <div className="timeline-connector"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {showAddForm && (
            <div className="add-milestone-form">
              <h4>Add New Milestone</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Milestone Name *</label>
                  <input
                    type="text"
                    value={newMilestone.name}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Design Phase Complete"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Target Date *</label>
                  <input
                    type="date"
                    value={newMilestone.targetDate}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this milestone..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newMilestone.priority}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Deliverables (comma-separated)</label>
                  <input
                    type="text"
                    value={newMilestone.deliverables}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, deliverables: e.target.value }))}
                    placeholder="e.g., Wireframes, Mockups, User flows"
                    className="form-input"
                  />
                </div>
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
                  onClick={handleAddMilestone}
                  disabled={!newMilestone.name || !newMilestone.targetDate}
                >
                  Add Milestone
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectMilestones;


