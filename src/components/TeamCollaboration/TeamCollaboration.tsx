import React, { useState, useEffect, useCallback } from 'react';
import { Project, Session } from '../../types';
import './TeamCollaboration.css';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  isOnline: boolean;
  lastActive: Date;
}

interface ProjectComment {
  id: string;
  projectId: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  type: 'comment' | 'update' | 'handoff';
}

interface SessionComment {
  id: string;
  sessionId: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  type: 'comment' | 'question' | 'suggestion';
}

interface TeamCollaborationProps {
  projects: Project[];
  sessions: Session[];
  currentUserId: string;
  onProjectUpdate?: (projectId: string, updates: Partial<Project>) => void;
  onSessionUpdate?: (sessionId: string, updates: Partial<Session>) => void;
}

const TeamCollaboration: React.FC<TeamCollaborationProps> = ({
  projects,
  sessions,
  currentUserId,
  onProjectUpdate,
  onSessionUpdate
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projectComments, setProjectComments] = useState<ProjectComment[]>([]);
  const [sessionComments, setSessionComments] = useState<SessionComment[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'comment' | 'update' | 'handoff'>('comment');
  const [showTeamMembers, setShowTeamMembers] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTeamData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock team data - in real implementation, this would come from API
      const mockTeamMembers: TeamMember[] = [
        {
          id: '1',
          name: 'Alex',
          email: 'alex@example.com',
          role: 'owner',
          isOnline: true,
          lastActive: new Date()
        },
        {
          id: '2',
          name: 'Sarah',
          email: 'sarah@example.com',
          role: 'admin',
          isOnline: true,
          lastActive: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        },
        {
          id: '3',
          name: 'Mike',
          email: 'mike@example.com',
          role: 'member',
          isOnline: false,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        }
      ];

      setTeamMembers(mockTeamMembers);
      
      // Load comments for projects and sessions
      await loadComments();
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, sessions]);

  useEffect(() => {
    loadTeamData();
  }, [loadTeamData]);

  const loadComments = async () => {
    try {
      // Mock comments data
      const mockProjectComments: ProjectComment[] = [
        {
          id: '1',
          projectId: projects[0]?.id || '',
          authorId: '2',
          authorName: 'Sarah',
          content: 'Great progress on the frontend! The new components look amazing.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          type: 'comment'
        },
        {
          id: '2',
          projectId: projects[0]?.id || '',
          authorId: '1',
          authorName: 'Alex',
          content: 'Updated the API endpoints. Ready for testing.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          type: 'update'
        }
      ];

      const mockSessionComments: SessionComment[] = [
        {
          id: '1',
          sessionId: sessions[0]?.id || '',
          authorId: '3',
          authorName: 'Mike',
          content: 'Could you add more error handling for the edge cases?',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          type: 'suggestion'
        }
      ];

      setProjectComments(mockProjectComments);
      setSessionComments(mockSessionComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const addProjectComment = async () => {
    if (!selectedProject || !newComment.trim()) return;

    const comment: ProjectComment = {
      id: Date.now().toString(),
      projectId: selectedProject.id,
      authorId: currentUserId,
      authorName: 'You',
      content: newComment,
      timestamp: new Date(),
      type: commentType
    };

    setProjectComments(prev => [comment, ...prev]);
    setNewComment('');
    
    // In real implementation, this would save to backend
    console.log('Added project comment:', comment);
  };

  const addSessionComment = async () => {
    if (!selectedSession || !newComment.trim()) return;

    const comment: SessionComment = {
      id: Date.now().toString(),
      sessionId: selectedSession.id,
      authorId: currentUserId,
      authorName: 'You',
      content: newComment,
      timestamp: new Date(),
      type: 'comment'
    };

    setSessionComments(prev => [comment, ...prev]);
    setNewComment('');
    
    // In real implementation, this would save to backend
    console.log('Added session comment:', comment);
  };


  if (loading) {
    return (
      <div className="team-collaboration">
        <div className="team-loading">
          <h3>👥 Loading Team Data...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="team-collaboration">
      <div className="team-header">
        <h2>👥 Team Collaboration</h2>
        <div className="team-controls">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowTeamMembers(!showTeamMembers)}
          >
            {showTeamMembers ? 'Hide' : 'Show'} Team
          </button>
        </div>
      </div>

      {/* Team Members */}
      {showTeamMembers && (
        <div className="team-members-section">
          <h3>Team Members</h3>
          <div className="team-members-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-member-card">
                <div className="member-avatar">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={`status-indicator ${member.isOnline ? 'online' : 'offline'}`} />
                </div>
                <div className="member-info">
                  <div className="member-name">{member.name}</div>
                  <div className="member-role">{member.role}</div>
                  <div className="member-status">
                    {member.isOnline ? 'Online' : `Last active ${member.lastActive.toLocaleTimeString()}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="collaboration-content">
        {/* Project Collaboration */}
        <div className="collaboration-section">
          <h3>📁 Project Collaboration</h3>
          <div className="project-selector">
            <select 
              value={selectedProject?.id || ''} 
              onChange={(e) => {
                const project = projects.find(p => p.id === e.target.value);
                setSelectedProject(project || null);
              }}
            >
              <option value="">Select a project...</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <div className="project-collaboration">
              <div className="project-info">
                <h4>{selectedProject.name}</h4>
                <p>{selectedProject.description}</p>
              </div>

              <div className="comments-section">
                <h5>Comments & Updates</h5>
                <div className="comments-list">
                  {projectComments
                    .filter(c => c.projectId === selectedProject.id)
                    .map(comment => (
                      <div key={comment.id} className={`comment-item ${comment.type}`}>
                        <div className="comment-header">
                          <span className="comment-author">{comment.authorName}</span>
                          <span className="comment-type">{comment.type}</span>
                          <span className="comment-time">
                            {comment.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="comment-content">{comment.content}</div>
                      </div>
                    ))}
                </div>

                <div className="add-comment">
                  <div className="comment-type-selector">
                    <label>
                      <input
                        type="radio"
                        name="commentType"
                        value="comment"
                        checked={commentType === 'comment'}
                        onChange={(e) => setCommentType(e.target.value as any)}
                      />
                      Comment
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="commentType"
                        value="update"
                        checked={commentType === 'update'}
                        onChange={(e) => setCommentType(e.target.value as any)}
                      />
                      Update
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="commentType"
                        value="handoff"
                        checked={commentType === 'handoff'}
                        onChange={(e) => setCommentType(e.target.value as any)}
                      />
                      Handoff
                    </label>
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment, update, or handoff note..."
                    rows={3}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={addProjectComment}
                    disabled={!newComment.trim()}
                  >
                    Add {commentType}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Session Collaboration */}
        <div className="collaboration-section">
          <h3>💬 Session Collaboration</h3>
          <div className="session-selector">
            <select 
              value={selectedSession?.id || ''} 
              onChange={(e) => {
                const session = sessions.find(s => s.id === e.target.value);
                setSelectedSession(session || null);
              }}
            >
              <option value="">Select a session...</option>
              {sessions.map(session => (
                <option key={session.id} value={session.id}>
                  {session.title} - {session.projectName}
                </option>
              ))}
            </select>
          </div>

          {selectedSession && (
            <div className="session-collaboration">
              <div className="session-info">
                <h4>{selectedSession.title}</h4>
                <p>Project: {selectedSession.projectName}</p>
                <p>Status: {selectedSession.status}</p>
              </div>

              <div className="comments-section">
                <h5>Session Discussion</h5>
                <div className="comments-list">
                  {sessionComments
                    .filter(c => c.sessionId === selectedSession.id)
                    .map(comment => (
                      <div key={comment.id} className={`comment-item ${comment.type}`}>
                        <div className="comment-header">
                          <span className="comment-author">{comment.authorName}</span>
                          <span className="comment-type">{comment.type}</span>
                          <span className="comment-time">
                            {comment.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="comment-content">{comment.content}</div>
                      </div>
                    ))}
                </div>

                <div className="add-comment">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question, make a suggestion, or add a comment..."
                    rows={3}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={addSessionComment}
                    disabled={!newComment.trim()}
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCollaboration;


