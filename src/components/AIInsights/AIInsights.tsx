import React, { useState, useEffect } from 'react';
import { Project, Session, AIInsight, AIRecommendation, WorkPattern, PredictiveAnalytics, SmartSuggestion } from '../../types';
import './AIInsights.css';

interface AIInsightsProps {
  projects: Project[];
  sessions: Session[];
  onClose: () => void;
}

const AIInsights: React.FC<AIInsightsProps> = ({
  projects,
  sessions,
  onClose
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [workPatterns, setWorkPatterns] = useState<WorkPattern[]>([]);
  const [predictions, setPredictions] = useState<PredictiveAnalytics[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations' | 'patterns' | 'predictions' | 'suggestions'>('insights');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockInsights: AIInsight[] = [
      {
        id: 'insight-1',
        type: 'productivity',
        category: 'time_management',
        title: 'Peak Productivity Hours Detected',
        description: 'Your most productive work occurs between 9-11 AM and 2-4 PM. Consider scheduling important tasks during these windows.',
        confidence: 87,
        impact: 'high',
        actionable: true,
        data: {
          metrics: {
            productivity: 85,
            efficiency: 78,
            focus: 92
          },
          trends: [
            { period: 'Week 1', value: 75, change: 5, direction: 'up' },
            { period: 'Week 2', value: 82, change: 9, direction: 'up' },
            { period: 'Week 3', value: 85, change: 4, direction: 'up' }
          ],
          comparisons: [
            { metric: 'Productivity', current: 85, average: 72, benchmark: 80, percentile: 78 }
          ]
        },
        recommendations: [],
        createdAt: new Date().toISOString(),
        acknowledged: false,
        applied: false
      },
      {
        id: 'insight-2',
        type: 'pattern',
        category: 'workflow',
        title: 'Session Length Optimization',
        description: 'Sessions between 45-60 minutes show 23% higher completion rates. Consider breaking longer tasks into focused sessions.',
        confidence: 92,
        impact: 'medium',
        actionable: true,
        data: {
          metrics: {
            optimalLength: 52,
            completionRate: 89,
            satisfaction: 84
          },
          trends: [
            { period: 'Short sessions', value: 65, change: -5, direction: 'down' },
            { period: 'Optimal sessions', value: 89, change: 12, direction: 'up' },
            { period: 'Long sessions', value: 71, change: -8, direction: 'down' }
          ],
          comparisons: [
            { metric: 'Completion Rate', current: 89, average: 76, benchmark: 85, percentile: 88 }
          ]
        },
        recommendations: [],
        createdAt: new Date().toISOString(),
        acknowledged: false,
        applied: false
      }
    ];

    const mockRecommendations: AIRecommendation[] = [
      {
        id: 'rec-1',
        type: 'optimization',
        priority: 'high',
        title: 'Implement Time Blocking',
        description: 'Schedule focused work blocks during your peak productivity hours to maximize output.',
        expectedImpact: {
          productivity: 25,
          efficiency: 20,
          timeSaved: 120
        },
        steps: [
          {
            id: 'step-1',
            title: 'Identify peak hours',
            description: 'Review your productivity data to find your most effective work times',
            order: 1,
            estimatedTime: 15,
            completed: false
          },
          {
            id: 'step-2',
            title: 'Create time blocks',
            description: 'Schedule 2-3 hour focused work blocks during peak hours',
            order: 2,
            estimatedTime: 30,
            completed: false
          },
          {
            id: 'step-3',
            title: 'Protect blocks',
            description: 'Set boundaries and minimize interruptions during focused time',
            order: 3,
            estimatedTime: 20,
            completed: false
          }
        ],
        prerequisites: ['Calendar access', 'Task prioritization'],
        estimatedEffort: 65,
        successMetrics: ['Increased focus time', 'Higher task completion', 'Reduced context switching'],
        createdAt: new Date().toISOString(),
        applied: false
      },
      {
        id: 'rec-2',
        type: 'prevention',
        priority: 'medium',
        title: 'Prevent Burnout',
        description: 'Take regular breaks every 90 minutes to maintain sustainable productivity.',
        expectedImpact: {
          productivity: 15,
          efficiency: 18,
          timeSaved: 45
        },
        steps: [
          {
            id: 'step-1',
            title: 'Set break reminders',
            description: 'Configure automatic break reminders every 90 minutes',
            order: 1,
            estimatedTime: 10,
            completed: false
          },
          {
            id: 'step-2',
            title: 'Plan break activities',
            description: 'Prepare relaxing activities for break times',
            order: 2,
            estimatedTime: 15,
            completed: false
          }
        ],
        prerequisites: ['Break reminder system'],
        estimatedEffort: 25,
        successMetrics: ['Consistent break taking', 'Sustained energy levels', 'Reduced fatigue'],
        createdAt: new Date().toISOString(),
        applied: false
      }
    ];

    const mockWorkPatterns: WorkPattern[] = [
      {
        id: 'pattern-1',
        userId: 'user-1',
        patternType: 'daily',
        name: 'Morning Deep Work',
        description: 'Focused work sessions in the morning with high productivity',
        frequency: 5,
        duration: 120,
        productivity: 88,
        efficiency: 85,
        satisfaction: 92,
        data: {
          sessions: 25,
          totalTime: 3000,
          averageSessionLength: 120,
          peakHours: [9, 10, 11],
          preferredDays: [1, 2, 3, 4, 5],
          context: ['development', 'planning', 'analysis']
        },
        insights: [
          'Most productive during morning hours',
          'Prefers uninterrupted work blocks',
          'High satisfaction with development tasks'
        ],
        recommendations: [
          'Schedule complex tasks in the morning',
          'Minimize meetings during peak hours',
          'Use afternoon for collaboration'
        ],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    ];

    const mockPredictions: PredictiveAnalytics[] = [
      {
        id: 'pred-1',
        type: 'project_completion',
        targetId: 'project-1',
        prediction: {
          outcome: 'On-time completion',
          probability: 78,
          timeframe: '2 weeks',
          confidence: 85
        },
        factors: {
          positive: ['Consistent progress', 'Clear requirements', 'Good team communication'],
          negative: ['Scope creep risk', 'Resource constraints'],
          neutral: ['External dependencies', 'Market conditions']
        },
        recommendations: [
          'Maintain current pace',
          'Monitor scope changes',
          'Prepare contingency plans'
        ],
        monitoring: {
          metrics: ['Progress rate', 'Quality score', 'Team satisfaction'],
          thresholds: { 'Progress rate': 80, 'Quality score': 85 },
          alerts: ['Progress below threshold', 'Quality issues detected']
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const mockSuggestions: SmartSuggestion[] = [
      {
        id: 'suggestion-1',
        type: 'break',
        title: 'Time for a Break',
        description: 'You\'ve been working for 90 minutes. Consider taking a 10-minute break to maintain focus.',
        reasoning: 'Research shows that regular breaks improve productivity and prevent burnout.',
        urgency: 'medium',
        timeSensitive: true,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        data: {
          context: { sessionDuration: 90, lastBreak: 120 },
          triggers: ['long_session', 'focus_fatigue'],
          conditions: ['active_session', 'no_recent_break']
        },
        actions: {
          primary: 'Take 10-minute break',
          secondary: 'Continue for 15 more minutes',
          dismiss: 'Dismiss suggestion'
        },
        createdAt: new Date().toISOString(),
        acknowledged: false,
        applied: false
      }
    ];

    setInsights(mockInsights);
    setRecommendations(mockRecommendations);
    setWorkPatterns(mockWorkPatterns);
    setPredictions(mockPredictions);
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

  const handleAcknowledgeInsight = (insightId: string) => {
    setInsights(prev => 
      prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, acknowledged: true }
          : insight
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  return (
    <div className="ai-insights-overlay">
      <div className="ai-insights-modal">
        <div className="insights-header">
          <h2>🤖 AI Insights & Recommendations</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="insights-content">
          <div className="insights-tabs">
            <button 
              className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              📊 Insights ({insights.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              💡 Recommendations ({recommendations.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'patterns' ? 'active' : ''}`}
              onClick={() => setActiveTab('patterns')}
            >
              🔄 Patterns ({workPatterns.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'predictions' ? 'active' : ''}`}
              onClick={() => setActiveTab('predictions')}
            >
              🔮 Predictions ({predictions.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggestions')}
            >
              ⚡ Suggestions ({suggestions.length})
            </button>
          </div>

          <div className="insights-body">
            {activeTab === 'insights' && (
              <div className="insights-list">
                {insights.map(insight => (
                  <div key={insight.id} className="insight-card">
                    <div className="insight-header">
                      <div className="insight-title">
                        <h3>{insight.title}</h3>
                        <span 
                          className="impact-badge"
                          style={{ backgroundColor: getImpactColor(insight.impact) }}
                        >
                          {insight.impact} impact
                        </span>
                      </div>
                      <div className="insight-confidence">
                        <span className="confidence-score">{insight.confidence}%</span>
                        <span className="confidence-label">confidence</span>
                      </div>
                    </div>
                    
                    <p className="insight-description">{insight.description}</p>
                    
                    <div className="insight-metrics">
                      {Object.entries(insight.data.metrics).map(([key, value]) => (
                        <div key={key} className="metric-item">
                          <span className="metric-label">{key}</span>
                          <span className="metric-value">{value}%</span>
                        </div>
                      ))}
                    </div>

                    <div className="insight-actions">
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => handleAcknowledgeInsight(insight.id)}
                        disabled={insight.acknowledged}
                      >
                        {insight.acknowledged ? '✓ Acknowledged' : 'Acknowledge'}
                      </button>
                      <button className="btn btn-outline btn-small">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="recommendations-list">
                {recommendations.map(rec => (
                  <div key={rec.id} className="recommendation-card">
                    <div className="rec-header">
                      <div className="rec-title">
                        <h3>{rec.title}</h3>
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(rec.priority) }}
                        >
                          {rec.priority} priority
                        </span>
                      </div>
                      <div className="rec-impact">
                        <span className="impact-label">Expected Impact:</span>
                        <span className="impact-value">
                          +{rec.expectedImpact.productivity}% productivity
                        </span>
                      </div>
                    </div>

                    <p className="rec-description">{rec.description}</p>

                    <div className="rec-steps">
                      <h4>Implementation Steps:</h4>
                      <ol>
                        {rec.steps.map(step => (
                          <li key={step.id} className={step.completed ? 'completed' : ''}>
                            <span className="step-title">{step.title}</span>
                            <span className="step-time">{step.estimatedTime} min</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="rec-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleApplyRecommendation(rec.id)}
                        disabled={rec.applied}
                      >
                        {rec.applied ? '✓ Applied' : 'Apply Recommendation'}
                      </button>
                      <button className="btn btn-outline">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'patterns' && (
              <div className="patterns-list">
                {workPatterns.map(pattern => (
                  <div key={pattern.id} className="pattern-card">
                    <div className="pattern-header">
                      <h3>{pattern.name}</h3>
                      <span className="pattern-type">{pattern.patternType}</span>
                    </div>
                    
                    <p className="pattern-description">{pattern.description}</p>
                    
                    <div className="pattern-metrics">
                      <div className="metric-row">
                        <span className="metric-label">Productivity:</span>
                        <div className="metric-bar">
                          <div 
                            className="metric-fill" 
                            style={{ width: `${pattern.productivity}%` }}
                          ></div>
                          <span className="metric-value">{pattern.productivity}%</span>
                        </div>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Efficiency:</span>
                        <div className="metric-bar">
                          <div 
                            className="metric-fill" 
                            style={{ width: `${pattern.efficiency}%` }}
                          ></div>
                          <span className="metric-value">{pattern.efficiency}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="pattern-insights">
                      <h4>Key Insights:</h4>
                      <ul>
                        {pattern.insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'predictions' && (
              <div className="predictions-list">
                {predictions.map(pred => (
                  <div key={pred.id} className="prediction-card">
                    <div className="pred-header">
                      <h3>{pred.prediction.outcome}</h3>
                      <div className="pred-confidence">
                        <span className="confidence-score">{pred.prediction.confidence}%</span>
                        <span className="confidence-label">confidence</span>
                      </div>
                    </div>

                    <div className="pred-details">
                      <div className="pred-info">
                        <span className="pred-probability">
                          {pred.prediction.probability}% probability
                        </span>
                        <span className="pred-timeframe">
                          {pred.prediction.timeframe}
                        </span>
                      </div>
                    </div>

                    <div className="pred-factors">
                      <div className="factor-group">
                        <h4>Positive Factors:</h4>
                        <ul>
                          {pred.factors.positive.map((factor, index) => (
                            <li key={index} className="positive">{factor}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="factor-group">
                        <h4>Risks:</h4>
                        <ul>
                          {pred.factors.negative.map((factor, index) => (
                            <li key={index} className="negative">{factor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="suggestions-list">
                {suggestions.map(suggestion => (
                  <div key={suggestion.id} className="suggestion-card">
                    <div className="suggestion-header">
                      <h3>{suggestion.title}</h3>
                      <span 
                        className="urgency-badge"
                        style={{ backgroundColor: getUrgencyColor(suggestion.urgency) }}
                      >
                        {suggestion.urgency}
                      </span>
                    </div>
                    
                    <p className="suggestion-description">{suggestion.description}</p>
                    <p className="suggestion-reasoning">{suggestion.reasoning}</p>
                    
                    <div className="suggestion-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleApplySuggestion(suggestion.id)}
                        disabled={suggestion.applied}
                      >
                        {suggestion.actions.primary}
                      </button>
                      {suggestion.actions.secondary && (
                        <button className="btn btn-outline">
                          {suggestion.actions.secondary}
                        </button>
                      )}
                      <button className="btn btn-secondary">
                        {suggestion.actions.dismiss}
                      </button>
                    </div>
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

export default AIInsights;
