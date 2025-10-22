import React, { useState, useEffect } from 'react';
import { Session, Project, DashboardStats } from '../../types';
import ProductivityInsights from '../ProductivityInsights/ProductivityInsights';
import './AnalyticsDashboard.css';

interface AnalyticsData {
  totalSessions: number;
  totalHours: number;
  averageSessionDuration: number;
  productivityScore: number;
  topProjects: Array<{ name: string; sessions: number; hours: number }>;
  sessionTypes: Array<{ type: string; count: number; percentage: number }>;
  weeklyTrends: Array<{ date: string; sessions: number; hours: number }>;
  monthlyBreakdown: Array<{ month: string; sessions: number; hours: number }>;
  statusDistribution: Array<{ status: string; count: number; percentage: number }>;
  productivityInsights: string[];
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';
      
      // Fetch sessions and projects data
      const [sessionsResponse, projectsResponse] = await Promise.all([
        fetch(`${API_URL}/api/sessions`),
        fetch(`${API_URL}/api/projects`)
      ]);

      const sessionsData = await sessionsResponse.json();
      const projectsData = await projectsResponse.json();

      if (sessionsData.success && projectsData.success) {
        setSessions(sessionsData.sessions);
        setProjects(projectsData.projects);
        const analytics = calculateAnalytics(sessionsData.sessions, projectsData.projects);
        setAnalyticsData(analytics);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (err) {
      setError('Error loading analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (sessions: Session[], projects: Project[]): AnalyticsData => {
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

    // Basic metrics
    const totalSessions = filteredSessions.length;
    const totalHours = filteredSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const averageSessionDuration = totalSessions > 0 ? totalHours / totalSessions : 0;

    // Productivity score (based on completed sessions and session quality)
    const completedSessions = filteredSessions.filter(s => s.status === 'Completed').length;
    const productivityScore = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    // Top projects
    const projectStats = new Map<string, { sessions: number; hours: number }>();
    filteredSessions.forEach(session => {
      const projectName = session.projectName || 'Unknown Project';
      const current = projectStats.get(projectName) || { sessions: 0, hours: 0 };
      projectStats.set(projectName, {
        sessions: current.sessions + 1,
        hours: current.hours + (session.duration || 0)
      });
    });

    const topProjects = Array.from(projectStats.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5);

    // Session types distribution
    const typeStats = new Map<string, number>();
    filteredSessions.forEach(session => {
      const type = session.type || 'Unknown';
      typeStats.set(type, (typeStats.get(type) || 0) + 1);
    });

    const sessionTypes = Array.from(typeStats.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / totalSessions) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // Weekly trends (last 4 weeks)
    const weeklyTrends = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      const weekSessions = filteredSessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate < weekEnd;
      });

      weeklyTrends.push({
        date: weekStart.toISOString().split('T')[0],
        sessions: weekSessions.length,
        hours: weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0)
      });
    }

    // Monthly breakdown (last 6 months)
    const monthlyBreakdown = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthSessions = filteredSessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= monthStart && sessionDate < monthEnd;
      });

      monthlyBreakdown.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        sessions: monthSessions.length,
        hours: monthSessions.reduce((sum, s) => sum + (s.duration || 0), 0)
      });
    }

    // Status distribution
    const statusStats = new Map<string, number>();
    filteredSessions.forEach(session => {
      const status = session.status || 'Unknown';
      statusStats.set(status, (statusStats.get(status) || 0) + 1);
    });

    const statusDistribution = Array.from(statusStats.entries())
      .map(([status, count]) => ({
        status,
        count,
        percentage: Math.round((count / totalSessions) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // Productivity insights
    const insights = generateInsights({
      totalSessions,
      totalHours,
      averageSessionDuration,
      productivityScore,
      topProjects,
      sessionTypes,
      weeklyTrends,
      statusDistribution
    });

    return {
      totalSessions,
      totalHours,
      averageSessionDuration,
      productivityScore,
      topProjects,
      sessionTypes,
      weeklyTrends,
      monthlyBreakdown,
      statusDistribution,
      productivityInsights: insights
    };
  };

  const generateInsights = (data: any): string[] => {
    const insights = [];

    if (data.productivityScore >= 80) {
      insights.push("🎯 Excellent productivity! You're completing most of your sessions successfully.");
    } else if (data.productivityScore >= 60) {
      insights.push("📈 Good productivity! Consider focusing on completing more sessions.");
    } else {
      insights.push("💡 Room for improvement. Try breaking down larger tasks into smaller sessions.");
    }

    if (data.averageSessionDuration > 2) {
      insights.push("⏱️ Long session durations detected. Consider taking more breaks for better focus.");
    } else if (data.averageSessionDuration < 0.5) {
      insights.push("⚡ Short sessions detected. You might benefit from longer focused work periods.");
    }

    if (data.topProjects.length > 0) {
      const topProject = data.topProjects[0];
      insights.push(`🏆 Your most active project is "${topProject.name}" with ${topProject.sessions} sessions.`);
    }

    if (data.weeklyTrends.length >= 2) {
      const recent = data.weeklyTrends[data.weeklyTrends.length - 1];
      const previous = data.weeklyTrends[data.weeklyTrends.length - 2];
      const change = recent.sessions - previous.sessions;
      
      if (change > 0) {
        insights.push(`📊 Great momentum! ${change} more sessions this week compared to last week.`);
      } else if (change < 0) {
        insights.push(`📉 Session count decreased by ${Math.abs(change)} this week. Consider adjusting your schedule.`);
      }
    }

    return insights;
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-loading">
          <h2>📊 Loading Analytics...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-error">
          <h2>Error Loading Analytics</h2>
          <p>{error}</p>
          <button onClick={loadAnalyticsData}>Retry</button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-error">
          <h2>No Analytics Data</h2>
          <p>No data available for the selected time range.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>📊 Analytics Dashboard</h1>
        <div className="time-range-selector">
          <label>Time Range:</label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as any)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📝</div>
          <div className="metric-value">{analyticsData.totalSessions}</div>
          <div className="metric-label">Total Sessions</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⏰</div>
          <div className="metric-value">{analyticsData.totalHours.toFixed(1)}h</div>
          <div className="metric-label">Total Hours</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-value">{analyticsData.averageSessionDuration.toFixed(1)}h</div>
          <div className="metric-label">Avg Session</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-value">{analyticsData.productivityScore}%</div>
          <div className="metric-label">Productivity</div>
        </div>
      </div>

      {/* Productivity Insights */}
      <ProductivityInsights 
        sessions={sessions} 
        projects={projects} 
        timeRange={timeRange} 
      />

      {/* Basic Insights */}
      <div className="insights-section">
        <h2>💡 Quick Insights</h2>
        <div className="insights-grid">
          {analyticsData.productivityInsights.map((insight, index) => (
            <div key={index} className="insight-card">
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Top Projects */}
        <div className="chart-card">
          <h3>🏆 Top Projects</h3>
          <div className="project-stats">
            {analyticsData.topProjects.map((project, index) => (
              <div key={index} className="project-stat">
                <div className="project-name">{project.name}</div>
                <div className="project-metrics">
                  <span>{project.sessions} sessions</span>
                  <span>{project.hours.toFixed(1)}h</span>
                </div>
                <div className="project-bar">
                  <div 
                    className="project-progress" 
                    style={{ 
                      width: `${(project.sessions / analyticsData.topProjects[0].sessions) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Types */}
        <div className="chart-card">
          <h3>📋 Session Types</h3>
          <div className="type-stats">
            {analyticsData.sessionTypes.map((type, index) => (
              <div key={index} className="type-stat">
                <div className="type-info">
                  <span className="type-name">{type.type}</span>
                  <span className="type-count">{type.count} ({type.percentage}%)</span>
                </div>
                <div className="type-bar">
                  <div 
                    className="type-progress" 
                    style={{ width: `${type.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="chart-card">
          <h3>📊 Status Distribution</h3>
          <div className="status-stats">
            {analyticsData.statusDistribution.map((status, index) => (
              <div key={index} className="status-stat">
                <div className="status-info">
                  <span className="status-name">{status.status}</span>
                  <span className="status-count">{status.count} ({status.percentage}%)</span>
                </div>
                <div className="status-bar">
                  <div 
                    className="status-progress" 
                    style={{ width: `${status.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="chart-card">
          <h3>📈 Weekly Trends</h3>
          <div className="trends-chart">
            {analyticsData.weeklyTrends.map((week, index) => (
              <div key={index} className="trend-bar">
                <div className="trend-label">{new Date(week.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                <div className="trend-bars">
                  <div className="trend-sessions" style={{ height: `${(week.sessions / Math.max(...analyticsData.weeklyTrends.map(w => w.sessions))) * 100}%` }}>
                    <span>{week.sessions}</span>
                  </div>
                  <div className="trend-hours" style={{ height: `${(week.hours / Math.max(...analyticsData.weeklyTrends.map(w => w.hours))) * 100}%` }}>
                    <span>{week.hours.toFixed(1)}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
