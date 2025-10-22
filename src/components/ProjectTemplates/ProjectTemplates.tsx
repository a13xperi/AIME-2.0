import React, { useState, useEffect } from 'react';
import { ProjectTemplate, Project } from '../../types';
import './ProjectTemplates.css';

interface ProjectTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: ProjectTemplate) => void;
  onApplyTemplate: (template: ProjectTemplate, projectData: Partial<Project>) => void;
}

const ProjectTemplates: React.FC<ProjectTemplatesProps> = ({
  isOpen,
  onClose,
  onTemplateSelect,
  onApplyTemplate
}) => {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);

  const categories = [
    'All',
    'Development',
    'Design',
    'Research',
    'Marketing',
    'Business',
    'Personal',
    'Learning'
  ];

  // Default templates
  const defaultTemplates: ProjectTemplate[] = [
    {
      id: 'web-app-template',
      name: 'Web Application',
      description: 'Complete web application development template with frontend, backend, and deployment phases.',
      category: 'Development',
      tags: ['web', 'fullstack', 'react', 'node'],
      isDefault: true,
      isPublic: true,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      templateData: {
        projectName: 'Web Application Project',
        description: 'A full-stack web application with modern technologies',
        category: 'Web Application',
        priority: 'High',
        status: 'Planning',
        estimatedDuration: 120,
        phases: [
          {
            id: 'planning',
            name: 'Planning & Setup',
            description: 'Project planning, architecture design, and development environment setup',
            order: 1,
            estimatedDuration: 20,
            dependencies: [],
            deliverables: ['Project requirements', 'Architecture diagram', 'Development environment'],
            checklist: [
              { id: 'req-gathering', title: 'Gather requirements', isRequired: true, order: 1, category: 'Planning' },
              { id: 'architecture', title: 'Design system architecture', isRequired: true, order: 2, category: 'Planning' },
              { id: 'tech-stack', title: 'Choose technology stack', isRequired: true, order: 3, category: 'Planning' }
            ]
          },
          {
            id: 'frontend',
            name: 'Frontend Development',
            description: 'User interface development with modern frameworks',
            order: 2,
            estimatedDuration: 40,
            dependencies: ['planning'],
            deliverables: ['UI components', 'User interactions', 'Responsive design'],
            checklist: [
              { id: 'ui-design', title: 'Create UI mockups', isRequired: true, order: 1, category: 'Frontend' },
              { id: 'components', title: 'Build React components', isRequired: true, order: 2, category: 'Frontend' },
              { id: 'responsive', title: 'Implement responsive design', isRequired: true, order: 3, category: 'Frontend' }
            ]
          },
          {
            id: 'backend',
            name: 'Backend Development',
            description: 'API development, database design, and server logic',
            order: 3,
            estimatedDuration: 40,
            dependencies: ['planning'],
            deliverables: ['REST API', 'Database schema', 'Authentication'],
            checklist: [
              { id: 'api-design', title: 'Design API endpoints', isRequired: true, order: 1, category: 'Backend' },
              { id: 'database', title: 'Set up database', isRequired: true, order: 2, category: 'Backend' },
              { id: 'auth', title: 'Implement authentication', isRequired: true, order: 3, category: 'Backend' }
            ]
          },
          {
            id: 'testing',
            name: 'Testing & QA',
            description: 'Comprehensive testing and quality assurance',
            order: 4,
            estimatedDuration: 20,
            dependencies: ['frontend', 'backend'],
            deliverables: ['Test suite', 'Bug reports', 'Performance metrics'],
            checklist: [
              { id: 'unit-tests', title: 'Write unit tests', isRequired: true, order: 1, category: 'Testing' },
              { id: 'integration', title: 'Integration testing', isRequired: true, order: 2, category: 'Testing' },
              { id: 'e2e', title: 'End-to-end testing', isRequired: true, order: 3, category: 'Testing' }
            ]
          }
        ],
        defaultSessions: [
          {
            id: 'planning-session',
            name: 'Project Planning',
            description: 'Initial project planning and requirements gathering',
            type: 'Planning',
            estimatedDuration: 4,
            objectives: ['Define project scope', 'Gather requirements', 'Create project timeline'],
            deliverables: ['Project requirements document', 'Timeline', 'Resource allocation'],
            checklist: [
              { id: 'scope', title: 'Define project scope', isRequired: true, order: 1, category: 'Planning' },
              { id: 'requirements', title: 'Document requirements', isRequired: true, order: 2, category: 'Planning' }
            ]
          },
          {
            id: 'development-session',
            name: 'Feature Development',
            description: 'Core feature development session',
            type: 'Feature Development',
            estimatedDuration: 6,
            objectives: ['Implement features', 'Write clean code', 'Test functionality'],
            deliverables: ['Working features', 'Code commits', 'Test results'],
            checklist: [
              { id: 'implement', title: 'Implement features', isRequired: true, order: 1, category: 'Development' },
              { id: 'test', title: 'Test functionality', isRequired: true, order: 2, category: 'Development' }
            ]
          }
        ],
        checklist: [
          { id: 'setup', title: 'Set up development environment', isRequired: true, order: 1, category: 'Setup' },
          { id: 'repo', title: 'Create Git repository', isRequired: true, order: 2, category: 'Setup' },
          { id: 'deploy', title: 'Deploy to production', isRequired: true, order: 3, category: 'Deployment' }
        ],
        resources: [
          {
            id: 'react-docs',
            name: 'React Documentation',
            type: 'Link',
            url: 'https://reactjs.org/docs',
            description: 'Official React documentation',
            category: 'Documentation'
          },
          {
            id: 'node-docs',
            name: 'Node.js Documentation',
            type: 'Link',
            url: 'https://nodejs.org/docs',
            description: 'Official Node.js documentation',
            category: 'Documentation'
          }
        ]
      }
    },
    {
      id: 'mobile-app-template',
      name: 'Mobile App',
      description: 'Cross-platform mobile application development template.',
      category: 'Development',
      tags: ['mobile', 'react-native', 'ios', 'android'],
      isDefault: true,
      isPublic: true,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      templateData: {
        projectName: 'Mobile App Project',
        description: 'A cross-platform mobile application',
        category: 'Mobile App',
        priority: 'High',
        status: 'Planning',
        estimatedDuration: 100,
        phases: [
          {
            id: 'design',
            name: 'UI/UX Design',
            description: 'Mobile app design and user experience planning',
            order: 1,
            estimatedDuration: 20,
            dependencies: [],
            deliverables: ['Wireframes', 'UI mockups', 'User flow'],
            checklist: [
              { id: 'wireframes', title: 'Create wireframes', isRequired: true, order: 1, category: 'Design' },
              { id: 'mockups', title: 'Design UI mockups', isRequired: true, order: 2, category: 'Design' }
            ]
          },
          {
            id: 'development',
            name: 'App Development',
            description: 'Core mobile app development',
            order: 2,
            estimatedDuration: 60,
            dependencies: ['design'],
            deliverables: ['Mobile app', 'Core features', 'Navigation'],
            checklist: [
              { id: 'setup', title: 'Set up development environment', isRequired: true, order: 1, category: 'Development' },
              { id: 'features', title: 'Implement core features', isRequired: true, order: 2, category: 'Development' }
            ]
          },
          {
            id: 'testing',
            name: 'Testing & Deployment',
            description: 'App testing and store deployment',
            order: 3,
            estimatedDuration: 20,
            dependencies: ['development'],
            deliverables: ['Tested app', 'Store listings', 'Published app'],
            checklist: [
              { id: 'test', title: 'Test on devices', isRequired: true, order: 1, category: 'Testing' },
              { id: 'store', title: 'Submit to app stores', isRequired: true, order: 2, category: 'Deployment' }
            ]
          }
        ],
        defaultSessions: [
          {
            id: 'design-session',
            name: 'UI Design Session',
            description: 'Design mobile app interface',
            type: 'Planning',
            estimatedDuration: 4,
            objectives: ['Design app screens', 'Create user flows', 'Plan navigation'],
            deliverables: ['UI mockups', 'User flow diagrams', 'Design system'],
            checklist: [
              { id: 'screens', title: 'Design app screens', isRequired: true, order: 1, category: 'Design' },
              { id: 'flow', title: 'Create user flow', isRequired: true, order: 2, category: 'Design' }
            ]
          }
        ],
        checklist: [
          { id: 'setup', title: 'Set up React Native environment', isRequired: true, order: 1, category: 'Setup' },
          { id: 'features', title: 'Implement core features', isRequired: true, order: 2, category: 'Development' },
          { id: 'test', title: 'Test on devices', isRequired: true, order: 3, category: 'Testing' }
        ],
        resources: [
          {
            id: 'react-native-docs',
            name: 'React Native Documentation',
            type: 'Link',
            url: 'https://reactnative.dev/docs',
            description: 'Official React Native documentation',
            category: 'Documentation'
          }
        ]
      }
    },
    {
      id: 'research-template',
      name: 'Research Project',
      description: 'Academic or professional research project template.',
      category: 'Research',
      tags: ['research', 'academic', 'analysis', 'documentation'],
      isDefault: true,
      isPublic: true,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      templateData: {
        projectName: 'Research Project',
        description: 'A comprehensive research project',
        category: 'Research',
        priority: 'Medium',
        status: 'Planning',
        estimatedDuration: 80,
        phases: [
          {
            id: 'literature',
            name: 'Literature Review',
            description: 'Research existing literature and sources',
            order: 1,
            estimatedDuration: 20,
            dependencies: [],
            deliverables: ['Literature review', 'Source citations', 'Research gaps'],
            checklist: [
              { id: 'sources', title: 'Find relevant sources', isRequired: true, order: 1, category: 'Research' },
              { id: 'review', title: 'Write literature review', isRequired: true, order: 2, category: 'Research' }
            ]
          },
          {
            id: 'methodology',
            name: 'Methodology',
            description: 'Develop research methodology and approach',
            order: 2,
            estimatedDuration: 20,
            dependencies: ['literature'],
            deliverables: ['Research methodology', 'Data collection plan', 'Analysis framework'],
            checklist: [
              { id: 'method', title: 'Define research method', isRequired: true, order: 1, category: 'Methodology' },
              { id: 'data', title: 'Plan data collection', isRequired: true, order: 2, category: 'Methodology' }
            ]
          },
          {
            id: 'analysis',
            name: 'Data Analysis',
            description: 'Collect and analyze research data',
            order: 3,
            estimatedDuration: 30,
            dependencies: ['methodology'],
            deliverables: ['Collected data', 'Analysis results', 'Findings'],
            checklist: [
              { id: 'collect', title: 'Collect data', isRequired: true, order: 1, category: 'Analysis' },
              { id: 'analyze', title: 'Analyze data', isRequired: true, order: 2, category: 'Analysis' }
            ]
          },
          {
            id: 'reporting',
            name: 'Report Writing',
            description: 'Write and present research findings',
            order: 4,
            estimatedDuration: 10,
            dependencies: ['analysis'],
            deliverables: ['Research report', 'Presentation', 'Recommendations'],
            checklist: [
              { id: 'report', title: 'Write research report', isRequired: true, order: 1, category: 'Writing' },
              { id: 'present', title: 'Create presentation', isRequired: true, order: 2, category: 'Presentation' }
            ]
          }
        ],
        defaultSessions: [
          {
            id: 'research-session',
            name: 'Research Session',
            description: 'Conduct research and gather information',
            type: 'Planning',
            estimatedDuration: 4,
            objectives: ['Gather information', 'Analyze sources', 'Take notes'],
            deliverables: ['Research notes', 'Source citations', 'Key findings'],
            checklist: [
              { id: 'gather', title: 'Gather information', isRequired: true, order: 1, category: 'Research' },
              { id: 'notes', title: 'Take detailed notes', isRequired: true, order: 2, category: 'Research' }
            ]
          }
        ],
        checklist: [
          { id: 'topic', title: 'Define research topic', isRequired: true, order: 1, category: 'Planning' },
          { id: 'sources', title: 'Find relevant sources', isRequired: true, order: 2, category: 'Research' },
          { id: 'report', title: 'Write final report', isRequired: true, order: 3, category: 'Writing' }
        ],
        resources: [
          {
            id: 'research-methods',
            name: 'Research Methods Guide',
            type: 'Document',
            description: 'Guide to research methodologies',
            category: 'Reference'
          }
        ]
      }
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setTemplates(defaultTemplates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateDetails(true);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      const projectData = {
        name: selectedTemplate.templateData.projectName,
        description: selectedTemplate.templateData.description,
        category: selectedTemplate.templateData.category,
        priority: selectedTemplate.templateData.priority === 'Urgent' ? 'Critical' : selectedTemplate.templateData.priority as any,
        status: 'Active' as const,
        estimatedDuration: selectedTemplate.templateData.estimatedDuration
      };
      onApplyTemplate(selectedTemplate, projectData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="project-templates-overlay">
      <div className="project-templates-modal">
        <div className="templates-header">
          <h2>📋 Project Templates</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="templates-content">
          <div className="templates-sidebar">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="categories-section">
              <h3>Categories</h3>
              <div className="category-list">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="templates-main">
            {showTemplateDetails && selectedTemplate ? (
              <div className="template-details">
                <div className="template-details-header">
                  <button 
                    className="back-button"
                    onClick={() => setShowTemplateDetails(false)}
                  >
                    ← Back to Templates
                  </button>
                  <h3>{selectedTemplate.name}</h3>
                </div>

                <div className="template-info">
                  <p className="template-description">{selectedTemplate.description}</p>
                  <div className="template-meta">
                    <span className="template-category">{selectedTemplate.category}</span>
                    <span className="template-duration">{selectedTemplate.templateData.estimatedDuration}h estimated</span>
                  </div>
                </div>

                <div className="template-phases">
                  <h4>📋 Project Phases</h4>
                  {selectedTemplate.templateData.phases.map((phase, index) => (
                    <div key={phase.id} className="phase-item">
                      <div className="phase-header">
                        <span className="phase-number">{index + 1}</span>
                        <span className="phase-name">{phase.name}</span>
                        <span className="phase-duration">{phase.estimatedDuration}h</span>
                      </div>
                      <p className="phase-description">{phase.description}</p>
                      <div className="phase-deliverables">
                        <strong>Deliverables:</strong> {phase.deliverables.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="template-sessions">
                  <h4>⏱️ Default Sessions</h4>
                  {selectedTemplate.templateData.defaultSessions.map(session => (
                    <div key={session.id} className="session-item">
                      <div className="session-header">
                        <span className="session-name">{session.name}</span>
                        <span className="session-type">{session.type}</span>
                        <span className="session-duration">{session.estimatedDuration}h</span>
                      </div>
                      <p className="session-description">{session.description}</p>
                    </div>
                  ))}
                </div>

                <div className="template-resources">
                  <h4>📚 Resources</h4>
                  {selectedTemplate.templateData.resources.map(resource => (
                    <div key={resource.id} className="resource-item">
                      <div className="resource-header">
                        <span className="resource-name">{resource.name}</span>
                        <span className="resource-type">{resource.type}</span>
                      </div>
                      <p className="resource-description">{resource.description}</p>
                      {resource.url && (
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                          View Resource
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                <div className="template-actions">
                  <button className="btn btn-primary" onClick={handleApplyTemplate}>
                    ✅ Apply Template
                  </button>
                  <button className="btn btn-outline" onClick={() => setShowTemplateDetails(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="templates-grid">
                {filteredTemplates.map(template => (
                  <div key={template.id} className="template-card">
                    <div className="template-card-header">
                      <h3>{template.name}</h3>
                      <span className="template-category">{template.category}</span>
                    </div>
                    <p className="template-description">{template.description}</p>
                    <div className="template-meta">
                      <span className="template-duration">{template.templateData.estimatedDuration}h</span>
                      <span className="template-phases">{template.templateData.phases.length} phases</span>
                    </div>
                    <div className="template-tags">
                      {template.tags.map(tag => (
                        <span key={tag} className="template-tag">{tag}</span>
                      ))}
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTemplates;
