import React, { useState, useEffect } from 'react';
import { Session, Project } from '../../types';
import './ProductivityInsights.css';

interface ProductivityData {
  focusScore: number;
  consistencyScore: number;
  efficiencyScore: number;
  recommendations: string[];
  patterns: {
    bestTimeOfDay: string;
    mostProductiveDay: string;
    averageSessionLength: number;
    completionRate: number;
  };
  trends: {
    weeklyProgress: number;
    monthlyProgress: number;
    productivityTrend: 'up' | 'down' | 'stable';
  };
}

interface ProductivityInsightsProps {
  sessions: Session[];
  projects: Project[];
  timeRange: '7d' | '30d' | '90d' | '1y';
}

const ProductivityInsights: React.FC<ProductivityInsightsProps> = ({
  sessions,
  projects,
  timeRange
}) => {
  const [insights, setInsights] = useState<ProductivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateInsights();
  }, [sessions, projects, timeRange]);

  const calculateInsights = () => {
    setLoading(true);
    
    try {
      const now = new Date();
      const timeRangeMs = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
        '1y': 365 * 24 * 60 * 60 * 1000
      };

      const cutoffDate = new Date(now.getTime() - timeRangeMs[timeRange]);
      const filteredSessions = sessions.filter(session => 
        new Date(session.date) >= cutoffDate
      );

      if (filteredSessions.length === 0) {
        setInsights(null);
        setLoading(false);
        return;
      }

      // Calculate focus score (based on session completion and duration)
      const completedSessions = filteredSessions.filter(s => s.status === 'Completed').length;
      const focusScore = Math.round((completedSessions / filteredSessions.length) * 100);

      // Calculate consistency score (based on regular work patterns)
      const workDays = new Set(filteredSessions.map(s => s.date)).size;
      const totalDays = Math.ceil((now.getTime() - cutoffDate.getTime()) / (24 * 60 * 60 * 1000));
      const consistencyScore = Math.round((workDays / totalDays) * 100);

      // Calculate efficiency score (based on session duration and productivity)
      const totalHours = filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const averageSessionDuration = totalHours / filteredSessions.length;
      const efficiencyScore = Math.min(100, Math.round((averageSessionDuration / 2) * 100));

      // Find best time of day
      const hourCounts = new Map<number, number>();
      filteredSessions.forEach(session => {
        const hour = new Date(session.date).getHours();
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      });
      const bestHour = Array.from(hourCounts.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      const bestTimeOfDay = formatHour(bestHour);

      // Find most productive day
      const dayCounts = new Map<string, number>();
      filteredSessions.forEach(session => {
        const day = new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' });
        dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
      });
      const mostProductiveDay = Array.from(dayCounts.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];

      // Calculate trends
      const weeklySessions = Math.round(filteredSessions.length / (timeRange === '7d' ? 1 : timeRange === '30d' ? 4 : timeRange === '90d' ? 12 : 52));
      const monthlySessions = Math.round(filteredSessions.length / (timeRange === '7d' ? 0.25 : timeRange === '30d' ? 1 : timeRange === '90d' ? 3 : 12));
      
      const productivityTrend = weeklySessions > 5 ? 'up' : weeklySessions < 3 ? 'down' : 'stable';

      // Generate recommendations
      const recommendations = generateRecommendations({
        focusScore,
        consistencyScore,
        efficiencyScore,
        bestTimeOfDay,
        mostProductiveDay,
        averageSessionDuration,
        productivityTrend
      });

      setInsights({
        focusScore,
        consistencyScore,
        efficiencyScore,
        recommendations,
        patterns: {
          bestTimeOfDay,
          mostProductiveDay: mostProductiveDay[0],
          averageSessionLength: averageSessionDuration,
          completionRate: focusScore
        },
        trends: {
          weeklyProgress: weeklySessions,
          monthlyProgress: monthlySessions,
          productivityTrend
        }
      });
    } catch (error) {
      console.error('Error calculating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatHour = (hour: number): string => {
    if (hour < 6) return 'Early Morning (12am-6am)';
    if (hour < 12) return 'Morning (6am-12pm)';
    if (hour < 18) return 'Afternoon (12pm-6pm)';
    return 'Evening (6pm-12am)';
  };

  const generateRecommendations = (data: any): string[] => {
    const recommendations = [];

    if (data.focusScore < 70) {
      recommendations.push("🎯 Focus on completing more sessions. Try breaking down larger tasks into smaller, manageable chunks.");
    }

    if (data.consistencyScore < 60) {
      recommendations.push("📅 Establish a more consistent work schedule. Try to work on projects at the same time each day.");
    }

    if (data.efficiencyScore < 50) {
      recommendations.push("⚡ Consider longer focused work sessions. The optimal session length is 1-2 hours for deep work.");
    }

    if (data.averageSessionDuration < 0.5) {
      recommendations.push("⏱️ Your sessions are quite short. Try extending them to 30-60 minutes for better productivity.");
    }

    if (data.productivityTrend === 'down') {
      recommendations.push("📈 Your productivity has been declining. Consider taking breaks and reviewing your work priorities.");
    }

    if (data.bestTimeOfDay.includes('Evening')) {
      recommendations.push("🌙 You're most productive in the evening. Consider scheduling important work during this time.");
    }

    if (recommendations.length === 0) {
      recommendations.push("🌟 Great job! Your productivity metrics are looking excellent. Keep up the good work!");
    }

    return recommendations;
  };

  if (loading) {
    return (
      <div className="productivity-insights">
        <div className="insights-loading">
          <h3>🧠 Analyzing Productivity...</h3>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="productivity-insights">
        <div className="insights-empty">
          <h3>📊 No Data Available</h3>
          <p>Not enough data to generate insights for the selected time range.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="productivity-insights">
      <div className="insights-header">
        <h3>🧠 Productivity Insights</h3>
        <p>AI-powered analysis of your work patterns and productivity</p>
      </div>

      <div className="insights-metrics">
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-value">{insights.focusScore}%</div>
          <div className="metric-label">Focus Score</div>
          <div className="metric-description">Session completion rate</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-value">{insights.consistencyScore}%</div>
          <div className="metric-label">Consistency</div>
          <div className="metric-description">Regular work patterns</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-value">{insights.efficiencyScore}%</div>
          <div className="metric-label">Efficiency</div>
          <div className="metric-description">Session productivity</div>
        </div>
      </div>

      <div className="insights-patterns">
        <h4>📈 Work Patterns</h4>
        <div className="pattern-grid">
          <div className="pattern-item">
            <span className="pattern-label">Best Time:</span>
            <span className="pattern-value">{insights.patterns.bestTimeOfDay}</span>
          </div>
          <div className="pattern-item">
            <span className="pattern-label">Most Productive Day:</span>
            <span className="pattern-value">{insights.patterns.mostProductiveDay}</span>
          </div>
          <div className="pattern-item">
            <span className="pattern-label">Avg Session:</span>
            <span className="pattern-value">{insights.patterns.averageSessionLength.toFixed(1)}h</span>
          </div>
          <div className="pattern-item">
            <span className="pattern-label">Completion Rate:</span>
            <span className="pattern-value">{insights.patterns.completionRate}%</span>
          </div>
        </div>
      </div>

      <div className="insights-trends">
        <h4>📊 Trends</h4>
        <div className="trend-grid">
          <div className="trend-item">
            <span className="trend-label">Weekly Sessions:</span>
            <span className="trend-value">{insights.trends.weeklyProgress}</span>
          </div>
          <div className="trend-item">
            <span className="trend-label">Monthly Sessions:</span>
            <span className="trend-value">{insights.trends.monthlyProgress}</span>
          </div>
          <div className="trend-item">
            <span className="trend-label">Productivity Trend:</span>
            <span className={`trend-value trend-${insights.trends.productivityTrend}`}>
              {insights.trends.productivityTrend === 'up' ? '📈 Improving' : 
               insights.trends.productivityTrend === 'down' ? '📉 Declining' : '📊 Stable'}
            </span>
          </div>
        </div>
      </div>

      <div className="insights-recommendations">
        <h4>💡 Recommendations</h4>
        <div className="recommendations-list">
          {insights.recommendations.map((recommendation, index) => (
            <div key={index} className="recommendation-item">
              <p>{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductivityInsights;
