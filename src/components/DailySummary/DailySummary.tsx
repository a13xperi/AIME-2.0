import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '../../types';
import './DailySummary.css';

interface DailySummaryProps {
  sessions: Session[];
  isVisible: boolean;
  onClose: () => void;
}

interface SummaryData {
  totalSessions: number;
  totalHours: number;
  completedSessions: number;
  productivityScore: number;
  topProject: string;
  averageSessionLength: number;
  workPattern: string;
  achievements: string[];
  recommendations: string[];
}

const DailySummary: React.FC<DailySummaryProps> = ({
  sessions,
  isVisible,
  onClose
}) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateSummary = useCallback(() => {
    setLoading(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const todaysSessions = sessions.filter(session => session.date === today);
      
      if (todaysSessions.length === 0) {
        setSummaryData(null);
        setLoading(false);
        return;
      }

      const totalSessions = todaysSessions.length;
      const totalHours = todaysSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
      const completedSessions = todaysSessions.filter(s => s.status === 'Completed').length;
      const productivityScore = Math.round((completedSessions / totalSessions) * 100);
      const averageSessionLength = totalHours / totalSessions;

      // Find top project
      const projectCounts = new Map<string, number>();
      todaysSessions.forEach(session => {
        const projectName = session.projectName || 'Unknown Project';
        projectCounts.set(projectName, (projectCounts.get(projectName) || 0) + 1);
      });
      const topProject = Array.from(projectCounts.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];

      // Determine work pattern
      const sessionHours = todaysSessions.map(s => new Date(s.date).getHours());
      const morningSessions = sessionHours.filter(h => h >= 6 && h < 12).length;
      const afternoonSessions = sessionHours.filter(h => h >= 12 && h < 18).length;
      const eveningSessions = sessionHours.filter(h => h >= 18 || h < 6).length;
      
      let workPattern = 'Balanced';
      if (morningSessions > afternoonSessions && morningSessions > eveningSessions) {
        workPattern = 'Early Bird';
      } else if (afternoonSessions > morningSessions && afternoonSessions > eveningSessions) {
        workPattern = 'Afternoon Focus';
      } else if (eveningSessions > morningSessions && eveningSessions > afternoonSessions) {
        workPattern = 'Night Owl';
      }

      // Generate achievements
      const achievements: string[] = [];
      if (productivityScore >= 100) {
        achievements.push('🎯 Perfect completion rate!');
      }
      if (totalHours >= 8) {
        achievements.push('⏰ Full work day completed!');
      }
      if (totalSessions >= 5) {
        achievements.push('📝 High session frequency!');
      }
      if (averageSessionLength >= 1) {
        achievements.push('⚡ Excellent focus sessions!');
      }
      if (achievements.length === 0) {
        achievements.push('💪 Every step counts!');
      }

      // Generate recommendations
      const recommendations: string[] = [];
      if (productivityScore < 70) {
        recommendations.push('Focus on completing more sessions tomorrow');
      }
      if (averageSessionLength < 0.5) {
        recommendations.push('Try longer focused work sessions');
      }
      if (totalHours < 4) {
        recommendations.push('Consider increasing your work time');
      }
      if (recommendations.length === 0) {
        recommendations.push('Keep up the excellent work!');
      }

      setSummaryData({
        totalSessions,
        totalHours,
        completedSessions,
        productivityScore,
        topProject: topProject[0],
        averageSessionLength,
        workPattern,
        achievements,
        recommendations
      });
    } catch (error) {
      console.error('Error calculating summary:', error);
    } finally {
      setLoading(false);
    }
  }, [sessions]);

  useEffect(() => {
    if (isVisible) {
      calculateSummary();
    }
  }, [isVisible, calculateSummary]);

  if (!isVisible) return null;

  if (loading) {
    return (
      <div className="daily-summary-overlay">
        <div className="daily-summary-modal">
          <div className="daily-summary-loading">
            <h2>📊 Generating Daily Summary...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="daily-summary-overlay">
        <div className="daily-summary-modal">
          <div className="daily-summary-empty">
            <h2>📊 Daily Summary</h2>
            <p>No sessions recorded today. Start working to see your daily summary!</p>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-summary-overlay">
      <div className="daily-summary-modal">
        <div className="daily-summary-header">
          <h2>📊 Daily Summary</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="daily-summary-content">
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-value">{summaryData.totalSessions}</div>
              <div className="stat-label">Sessions</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-value">{summaryData.totalHours.toFixed(1)}h</div>
              <div className="stat-label">Total Time</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{summaryData.productivityScore}%</div>
              <div className="stat-label">Productivity</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-value">{summaryData.averageSessionLength.toFixed(1)}h</div>
              <div className="stat-label">Avg Session</div>
            </div>
          </div>

          <div className="summary-insights">
            <div className="insight-section">
              <h3>🏆 Top Project</h3>
              <p>{summaryData.topProject}</p>
            </div>
            
            <div className="insight-section">
              <h3>🕐 Work Pattern</h3>
              <p>{summaryData.workPattern}</p>
            </div>
          </div>

          {summaryData.achievements.length > 0 && (
            <div className="achievements-section">
              <h3>🏆 Achievements</h3>
              <div className="achievements-list">
                {summaryData.achievements.map((achievement, index) => (
                  <div key={index} className="achievement-item">
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="recommendations-section">
            <h3>💡 Tomorrow's Focus</h3>
            <div className="recommendations-list">
              {summaryData.recommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-item">
                  {recommendation}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="daily-summary-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Great Work Today! 🎉
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;


