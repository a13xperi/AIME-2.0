import React from 'react';
import './SessionTemplates.css';

export interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  defaultFields: {
    aiAgent?: string;
    workspace?: string;
    tags?: string[];
    summary?: string;
    nextSteps?: string;
  };
}

const SESSION_TEMPLATES: SessionTemplate[] = [
  {
    id: 'development',
    name: 'Development',
    description: 'Coding, debugging, and technical implementation',
    icon: '💻',
    type: 'Development',
    defaultFields: {
      aiAgent: 'Claude',
      workspace: 'Cursor',
      tags: ['coding', 'development'],
      summary: 'Working on feature implementation and code development',
      nextSteps: 'Continue development, test functionality, review code',
    },
  },
  {
    id: 'planning',
    name: 'Planning',
    description: 'Project planning, architecture design, and strategy',
    icon: '📋',
    type: 'Planning',
    defaultFields: {
      aiAgent: 'Claude',
      workspace: 'Notion',
      tags: ['planning', 'strategy'],
      summary: 'Planning project structure and implementation approach',
      nextSteps: 'Create detailed implementation plan, define milestones',
    },
  },
  {
    id: 'debugging',
    name: 'Debugging',
    description: 'Troubleshooting, fixing bugs, and resolving issues',
    icon: '🐛',
    type: 'Debugging',
    defaultFields: {
      aiAgent: 'Claude',
      workspace: 'Cursor',
      tags: ['debugging', 'troubleshooting'],
      summary: 'Investigating and fixing bugs or issues',
      nextSteps: 'Identify root cause, implement fix, test solution',
    },
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Learning, exploring new technologies, and gathering information',
    icon: '🔍',
    type: 'Research',
    defaultFields: {
      aiAgent: 'Claude',
      workspace: 'Browser',
      tags: ['research', 'learning'],
      summary: 'Researching solutions and gathering information',
      nextSteps: 'Document findings, evaluate options, make recommendations',
    },
  },
  {
    id: 'documentation',
    name: 'Documentation',
    description: 'Writing docs, creating guides, and documenting processes',
    icon: '📝',
    type: 'Documentation',
    defaultFields: {
      aiAgent: 'Claude',
      workspace: 'Notion',
      tags: ['documentation', 'writing'],
      summary: 'Creating and updating project documentation',
      nextSteps: 'Review existing docs, update content, organize structure',
    },
  },
  {
    id: 'testing',
    name: 'Testing',
    description: 'Writing tests, quality assurance, and validation',
    icon: '🧪',
    type: 'Testing',
    defaultFields: {
      aiAgent: 'Claude',
      workspace: 'Cursor',
      tags: ['testing', 'qa'],
      summary: 'Writing and running tests to ensure quality',
      nextSteps: 'Write test cases, run tests, fix any failures',
    },
  },
  {
    id: 'deployment',
    name: 'Deployment',
    description: 'Deploying applications, managing infrastructure, and releases',
    icon: '🚀',
    type: 'Deployment',
    defaultFields: {
      aiAgent: 'Claude',
      workspace: 'Terminal',
      tags: ['deployment', 'infrastructure'],
      summary: 'Deploying application and managing infrastructure',
      nextSteps: 'Deploy to staging, run tests, deploy to production',
    },
  },
  {
    id: 'meeting',
    name: 'Meeting',
    description: 'Team meetings, client calls, and collaborative sessions',
    icon: '👥',
    type: 'Meeting',
    defaultFields: {
      aiAgent: 'Claude',
      workspace: 'Zoom/Teams',
      tags: ['meeting', 'collaboration'],
      summary: 'Team meeting or client discussion',
      nextSteps: 'Follow up on action items, schedule next meeting',
    },
  },
];

interface SessionTemplatesProps {
  onSelectTemplate: (template: SessionTemplate) => void;
  onClose: () => void;
}

const SessionTemplates: React.FC<SessionTemplatesProps> = ({ onSelectTemplate, onClose }) => {
  return (
    <div className="session-templates-overlay">
      <div className="session-templates-modal">
        <div className="session-templates-header">
          <h2>Choose Session Template</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="session-templates-grid">
          {SESSION_TEMPLATES.map(template => (
            <div
              key={template.id}
              className="session-template-card"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="template-icon">{template.icon}</div>
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <div className="template-type">{template.type}</div>
            </div>
          ))}
        </div>

        <div className="session-templates-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTemplates;
