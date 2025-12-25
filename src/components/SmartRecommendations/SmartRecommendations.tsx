import React, { useState, useEffect } from 'react';
import { Project, Session, AIRecommendation, SmartSuggestion } from '../../types';
import './SmartRecommendations.css';

interface SmartRecommendationsProps {
  projects: Project[];
  sessions: Session[];
  onClose: () => void;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  projects,
  sessions,
  onClose,
}) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockRecommendations: AIRecommendation[] = [
      {
        id: 'rec-1',
        type: 'optimization',
        priority: 'high',
        title: 'Implement Time Blocking Strategy',
        description:
          'Based on your productivity patterns, scheduling focused work blocks during peak hours could increase output by 25%.',
        expectedImpact: {
          productivity: 25,
          efficiency: 20,
          timeSaved: 120,
        },
        steps: [
          {
            id: 'step-1',
            title: 'Analyze peak productivity hours',
            description: "Review your session data to identify when you're most productive",
            order: 1,
            estimatedTime: 15,
            completed: false,
            resources: {
              links: ['/analytics'],
              tools: ['Productivity Tracker'],
              documentation: ['Time Blocking Guide'],
            },
          },
          {
            id: 'step-2',
            title: 'Create time block schedule',
            description: 'Schedule 2-3 hour focused work blocks during your peak hours',
            order: 2,
            estimatedTime: 30,
            completed: false,
            resources: {
              links: ['/calendar'],
              tools: ['Calendar App'],
              documentation: ['Scheduling Best Practices'],
            },
          },
          {
            id: 'step-3',
            title: 'Set up protection mechanisms',
            description: 'Configure notifications and boundaries to protect your focused time',
            order: 3,
            estimatedTime: 20,
            completed: false,
            resources: {
              links: ['/settings'],
              tools: ['Focus Mode', 'Do Not Disturb'],
              documentation: ['Distraction Management'],
            },
          },
        ],
        prerequisites: ['Calendar access', 'Task prioritization system'],
        estimatedEffort: 65,
        successMetrics: [
          'Increased focus time',
          'Higher task completion rate',
          'Reduced context switching',
        ],
        createdAt: new Date().toISOString(),
        applied: false,
      },
      {
        id: 'rec-2',
        type: 'prevention',
        priority: 'medium',
        title: 'Implement Break Reminder System',
        description:
          'Regular breaks every 90 minutes can prevent burnout and maintain sustainable productivity levels.',
        expectedImpact: {
          productivity: 15,
          efficiency: 18,
          timeSaved: 45,
        },
        steps: [
          {
            id: 'step-1',
            title: 'Set up break reminders',
            description: 'Configure automatic break reminders every 90 minutes',
            order: 1,
            estimatedTime: 10,
            completed: false,
            resources: {
              links: ['/settings/notifications'],
              tools: ['Break Reminder App'],
              documentation: ['Break Schedule Templates'],
            },
          },
          {
            id: 'step-2',
            title: 'Plan break activities',
            description: 'Prepare relaxing activities for break times to maximize recovery',
            order: 2,
            estimatedTime: 15,
            completed: false,
            resources: {
              links: ['/wellness'],
              tools: ['Meditation App', 'Stretch Guide'],
              documentation: ['Break Activity Ideas'],
            },
          },
        ],
        prerequisites: ['Break reminder system', 'Wellness resources'],
        estimatedEffort: 25,
        successMetrics: ['Consistent break taking', 'Sustained energy levels', 'Reduced fatigue'],
        createdAt: new Date().toISOString(),
        applied: false,
      },
      {
        id: 'rec-3',
        type: 'enhancement',
        priority: 'low',
        title: 'Optimize Session Lengths',
        description:
          'Your data shows optimal session lengths of 45-60 minutes. Consider adjusting your work sessions accordingly.',
        expectedImpact: {
          productivity: 12,
          efficiency: 15,
          timeSaved: 30,
        },
        steps: [
          {
            id: 'step-1',
            title: 'Review current session patterns',
            description: 'Analyze your existing session lengths and completion rates',
            order: 1,
            estimatedTime: 20,
            completed: false,
            resources: {
              links: ['/analytics/sessions'],
              tools: ['Session Tracker'],
              documentation: ['Session Length Analysis'],
            },
          },
          {
            id: 'step-2',
            title: 'Adjust session planning',
            description: 'Modify your session planning to target 45-60 minute blocks',
            order: 2,
            estimatedTime: 30,
            completed: false,
            resources: {
              links: ['/planning'],
              tools: ['Session Planner'],
              documentation: ['Optimal Session Planning'],
            },
          },
        ],
        prerequisites: ['Session tracking system', 'Planning tools'],
        estimatedEffort: 50,
        successMetrics: [
          'Improved session completion',
          'Better focus maintenance',
          'Reduced fatigue',
        ],
        createdAt: new Date().toISOString(),
        applied: false,
      },
    ];

    const mockSuggestions: SmartSuggestion[] = [
      {
        id: 'suggestion-1',
        type: 'break',
        title: 'Time for a Break',
        description:
          "You've been working for 90 minutes. Consider taking a 10-minute break to maintain focus.",
        reasoning:
          'Research shows that regular breaks every 90 minutes improve productivity and prevent burnout.',
        urgency: 'medium',
        timeSensitive: true,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        data: {
          context: { sessionDuration: 90, lastBreak: 120 },
          triggers: ['long_session', 'focus_fatigue'],
          conditions: ['active_session', 'no_recent_break'],
        },
        actions: {
          primary: 'Take 10-minute break',
          secondary: 'Continue for 15 more minutes',
          dismiss: 'Dismiss suggestion',
        },
        createdAt: new Date().toISOString(),
        acknowledged: false,
        applied: false,
      },
      {
        id: 'suggestion-2',
        type: 'focus',
        title: 'Focus Mode Recommended',
        description:
          'You have 3 hours of focused work time available. Consider enabling focus mode for deep work.',
        reasoning:
          'Your productivity data shows peak performance during uninterrupted work sessions.',
        urgency: 'low',
        timeSensitive: false,
        data: {
          context: { availableTime: 180, upcomingMeetings: 0 },
          triggers: ['free_time', 'high_productivity_window'],
          conditions: ['no_urgent_tasks', 'good_energy_level'],
        },
        actions: {
          primary: 'Enable Focus Mode',
          secondary: 'Schedule focused session',
          dismiss: 'Not now',
        },
        createdAt: new Date().toISOString(),
        acknowledged: false,
        applied: false,
      },
    ];

    setRecommendations(mockRecommendations);
    setSuggestions(mockSuggestions);
  }, []);

  const handleApplyRecommendation = (recommendationId: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === recommendationId
          ? { ...rec, applied: true, appliedAt: new Date().toISOString() }
          : rec
      )
    );
  };

  const handleApplySuggestion = (suggestionId: string) => {
    setSuggestions(prev =>
      prev.map(suggestion =>
        suggestion.id === suggestionId
          ? { ...suggestion, applied: true, acknowledged: true }
          : suggestion
      )
    );
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev =>
      prev.map(suggestion =>
        suggestion.id === suggestionId ? { ...suggestion, acknowledged: true } : suggestion
      )
    );
  };

  const handleStepComplete = (recommendationId: string, stepId: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === recommendationId
          ? {
              ...rec,
              steps: rec.steps.map(step =>
                step.id === stepId ? { ...step, completed: true } : step
              ),
            }
          : rec
      )
    );
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (activeFilter === 'all') return true;
    return rec.priority === activeFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'medium':
        return '#d97706';
      case 'low':
        return '#16a34a';
      default:
        return '#6b7280';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'medium':
        return '#d97706';
      case 'low':
        return '#16a34a';
      default:
        return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return '⚡';
      case 'prevention':
        return '🛡️';
      case 'enhancement':
        return '🚀';
      case 'action':
        return '🎯';
      default:
        return '💡';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'break':
        return '☕';
      case 'focus':
        return '🎯';
      case 'collaboration':
        return '👥';
      case 'learning':
        return '📚';
      default:
        return '💡';
    }
  };

  return (
    <div className="smart-recommendations-overlay">
      <div className="smart-recommendations-modal">
        <div className="recommendations-header">
          <h2>🧠 Smart Recommendations</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="recommendations-content">
          <div className="recommendations-tabs">
            <button className="tab-button active">
              💡 Recommendations ({recommendations.length})
            </button>
            <button className="tab-button">⚡ Smart Suggestions ({suggestions.length})</button>
          </div>

          <div className="recommendations-body">
            <div className="recommendations-filters">
              <div className="filter-group">
                <label>Filter by Priority:</label>
                <select
                  value={activeFilter}
                  onChange={e => setActiveFilter(e.target.value as any)}
                  className="filter-select"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="recommendations-list">
              {filteredRecommendations.map(rec => (
                <div key={rec.id} className="recommendation-card">
                  <div className="rec-header">
                    <div className="rec-title">
                      <h3>
                        {getTypeIcon(rec.type)} {rec.title}
                      </h3>
                      <span
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(rec.priority) }}
                      >
                        {rec.priority} priority
                      </span>
                    </div>
                    <div className="rec-impact">
                      <div className="impact-item">
                        <span className="impact-label">Productivity:</span>
                        <span className="impact-value">+{rec.expectedImpact.productivity}%</span>
                      </div>
                      <div className="impact-item">
                        <span className="impact-label">Time Saved:</span>
                        <span className="impact-value">{rec.expectedImpact.timeSaved} min</span>
                      </div>
                    </div>
                  </div>

                  <p className="rec-description">{rec.description}</p>

                  <div className="rec-steps">
                    <h4>Implementation Steps:</h4>
                    <div className="steps-list">
                      {rec.steps.map(step => (
                        <div
                          key={step.id}
                          className={`step-item ${step.completed ? 'completed' : ''}`}
                        >
                          <div className="step-header">
                            <div className="step-info">
                              <span className="step-number">{step.order}</span>
                              <span className="step-title">{step.title}</span>
                              <span className="step-time">{step.estimatedTime} min</span>
                            </div>
                            <button
                              className={`step-complete ${step.completed ? 'completed' : ''}`}
                              onClick={() => handleStepComplete(rec.id, step.id)}
                              disabled={step.completed}
                            >
                              {step.completed ? '✓' : '○'}
                            </button>
                          </div>
                          <p className="step-description">{step.description}</p>
                          {step.resources && (
                            <div className="step-resources">
                              <h5>Resources:</h5>
                              <div className="resources-list">
                                {step.resources.links.map((link, index) => (
                                  <a key={index} href={link} className="resource-link">
                                    🔗 {link}
                                  </a>
                                ))}
                                {step.resources.tools.map((tool, index) => (
                                  <span key={index} className="resource-tool">
                                    🛠️ {tool}
                                  </span>
                                ))}
                                {step.resources.documentation.map((doc, index) => (
                                  <span key={index} className="resource-doc">
                                    📚 {doc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rec-meta">
                    <div className="meta-item">
                      <span className="meta-label">Estimated Effort:</span>
                      <span className="meta-value">{rec.estimatedEffort} minutes</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Prerequisites:</span>
                      <span className="meta-value">{rec.prerequisites.join(', ')}</span>
                    </div>
                  </div>

                  <div className="rec-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleApplyRecommendation(rec.id)}
                      disabled={rec.applied}
                    >
                      {rec.applied ? '✓ Applied' : 'Apply Recommendation'}
                    </button>
                    <button className="btn btn-outline">View Details</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="suggestions-section">
              <h3>⚡ Smart Suggestions</h3>
              <div className="suggestions-list">
                {suggestions.map(suggestion => (
                  <div key={suggestion.id} className="suggestion-card">
                    <div className="suggestion-header">
                      <h4>
                        {getSuggestionIcon(suggestion.type)} {suggestion.title}
                      </h4>
                      <span
                        className="urgency-badge"
                        style={{ backgroundColor: getUrgencyColor(suggestion.urgency) }}
                      >
                        {suggestion.urgency}
                      </span>
                    </div>

                    <p className="suggestion-description">{suggestion.description}</p>
                    <p className="suggestion-reasoning">{suggestion.reasoning}</p>

                    {suggestion.timeSensitive && (
                      <div className="time-sensitive">
                        <span className="time-label">⏰ Time Sensitive</span>
                        <span className="expires-at">
                          Expires: {new Date(suggestion.expiresAt!).toLocaleTimeString()}
                        </span>
                      </div>
                    )}

                    <div className="suggestion-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleApplySuggestion(suggestion.id)}
                        disabled={suggestion.applied}
                      >
                        {suggestion.actions.primary}
                      </button>
                      {suggestion.actions.secondary && (
                        <button className="btn btn-outline">{suggestion.actions.secondary}</button>
                      )}
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleDismissSuggestion(suggestion.id)}
                      >
                        {suggestion.actions.dismiss}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendations;
