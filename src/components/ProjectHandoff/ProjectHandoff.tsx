import React, { useState } from 'react';
import { Project } from '../../types';
import './ProjectHandoff.css';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
}

interface ProjectHandoffProps {
  project: Project;
  teamMembers: TeamMember[];
  isVisible: boolean;
  onClose: () => void;
  onHandoff: (projectId: string, toUserId: string, handoffData: HandoffData) => void;
}

interface HandoffData {
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  context: string;
  nextSteps: string;
  deadline?: string;
  notes: string;
}

const ProjectHandoff: React.FC<ProjectHandoffProps> = ({
  project,
  teamMembers,
  isVisible,
  onClose,
  onHandoff,
}) => {
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [handoffData, setHandoffData] = useState<HandoffData>({
    reason: '',
    priority: 'medium',
    context: '',
    nextSteps: '',
    deadline: '',
    notes: '',
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMember || !handoffData.reason.trim()) return;

    setLoading(true);
    try {
      await onHandoff(project.id, selectedMember, handoffData);
      onClose();
    } catch (error) {
      console.error('Error handing off project:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return selectedMember !== '';
      case 2:
        return handoffData.reason.trim() !== '' && handoffData.context.trim() !== '';
      case 3:
        return handoffData.nextSteps.trim() !== '';
      default:
        return false;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="project-handoff-overlay">
      <div className="project-handoff-modal">
        <div className="handoff-header">
          <h2>🔄 Project Handoff</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="handoff-content">
          <div className="project-info">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="project-meta">
              <span className="meta-item">Status: {project.status}</span>
              <span className="meta-item">Priority: {project.priority}</span>
            </div>
          </div>

          <div className="handoff-steps">
            <div className="step-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>

            {step === 1 && (
              <div className="handoff-step">
                <h4>👥 Select Team Member</h4>
                <p>Choose who you're handing off this project to:</p>
                <div className="member-selection">
                  {teamMembers.map(member => (
                    <label key={member.id} className="member-option">
                      <input
                        type="radio"
                        name="selectedMember"
                        value={member.id}
                        checked={selectedMember === member.id}
                        onChange={e => setSelectedMember(e.target.value)}
                      />
                      <div className="member-card">
                        <div className="member-avatar">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div
                            className={`status-indicator ${member.isOnline ? 'online' : 'offline'}`}
                          />
                        </div>
                        <div className="member-info">
                          <div className="member-name">{member.name}</div>
                          <div className="member-role">{member.role}</div>
                          <div className="member-status">
                            {member.isOnline ? 'Online' : 'Offline'}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="handoff-step">
                <h4>📝 Handoff Details</h4>
                <div className="form-group">
                  <label>Reason for handoff *</label>
                  <select
                    value={handoffData.reason}
                    onChange={e => setHandoffData(prev => ({ ...prev, reason: e.target.value }))}
                  >
                    <option value="">Select a reason...</option>
                    <option value="vacation">Going on vacation</option>
                    <option value="other-project">Moving to another project</option>
                    <option value="expertise">Need different expertise</option>
                    <option value="workload">Redistributing workload</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority Level</label>
                  <select
                    value={handoffData.priority}
                    onChange={e =>
                      setHandoffData(prev => ({ ...prev, priority: e.target.value as any }))
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Current Context *</label>
                  <textarea
                    value={handoffData.context}
                    onChange={e => setHandoffData(prev => ({ ...prev, context: e.target.value }))}
                    placeholder="Describe the current state of the project, what's been done, and any important context..."
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Deadline (optional)</label>
                  <input
                    type="date"
                    value={handoffData.deadline}
                    onChange={e => setHandoffData(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="handoff-step">
                <h4>🎯 Next Steps & Notes</h4>
                <div className="form-group">
                  <label>Next Steps *</label>
                  <textarea
                    value={handoffData.nextSteps}
                    onChange={e => setHandoffData(prev => ({ ...prev, nextSteps: e.target.value }))}
                    placeholder="What should be done next? Any immediate actions required?"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    value={handoffData.notes}
                    onChange={e => setHandoffData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional information, warnings, or special instructions..."
                    rows={3}
                  />
                </div>

                <div className="handoff-summary">
                  <h5>Handoff Summary</h5>
                  <div className="summary-item">
                    <strong>To:</strong> {teamMembers.find(m => m.id === selectedMember)?.name}
                  </div>
                  <div className="summary-item">
                    <strong>Reason:</strong> {handoffData.reason}
                  </div>
                  <div className="summary-item">
                    <strong>Priority:</strong> {handoffData.priority}
                  </div>
                  {handoffData.deadline && (
                    <div className="summary-item">
                      <strong>Deadline:</strong>{' '}
                      {new Date(handoffData.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="handoff-actions">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={prevStep}>
              ← Previous
            </button>
          )}

          {step < 3 ? (
            <button className="btn btn-primary" onClick={nextStep} disabled={!isStepValid()}>
              Next →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!isStepValid() || loading}
            >
              {loading ? 'Handing Off...' : 'Complete Handoff'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectHandoff;
