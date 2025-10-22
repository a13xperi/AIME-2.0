import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '../../types';
import './NotificationSystem.css';

interface Notification {
  id: string;
  type: 'break' | 'timeout' | 'summary' | 'alert' | 'achievement';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  sessions: Session[];
  onSessionUpdate?: (sessionId: string, updates: Partial<Session>) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  sessions,
  onSessionUpdate
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [settings, setSettings] = useState({
    breakReminders: true,
    sessionTimeouts: true,
    dailySummaries: true,
    productivityAlerts: true,
    breakInterval: 25, // minutes
    sessionTimeout: 120, // minutes
    quietHours: { start: 22, end: 8 } // 10 PM to 8 AM
  });

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10

    // Auto-remove after duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Check for break reminders
  const checkBreakReminders = useCallback(() => {
    if (!settings.breakReminders) return;

    const now = new Date();
    const currentHour = now.getHours();
    
    // Skip during quiet hours
    if (currentHour >= settings.quietHours.start || currentHour < settings.quietHours.end) {
      return;
    }

    // Check for long sessions without breaks
    const recentSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const timeDiff = now.getTime() - sessionDate.getTime();
      return timeDiff < 2 * 60 * 60 * 1000; // Last 2 hours
    });

    if (recentSessions.length > 0) {
      const lastSession = recentSessions[recentSessions.length - 1];
      const sessionStart = new Date(lastSession.date);
      const timeSinceStart = (now.getTime() - sessionStart.getTime()) / (1000 * 60); // minutes

      if (timeSinceStart >= settings.breakInterval) {
        addNotification({
          type: 'break',
          title: '⏰ Break Reminder',
          message: `You've been working for ${Math.round(timeSinceStart)} minutes. Time for a break!`,
          duration: 10000,
          action: {
            label: 'Take Break',
            onClick: () => {
              // Auto-pause current session
              if (onSessionUpdate && lastSession.id) {
                onSessionUpdate(lastSession.id, { status: 'Paused' });
              }
            }
          }
        });
      }
    }
  }, [sessions, settings, onSessionUpdate, addNotification]);

  // Check for session timeouts
  const checkSessionTimeouts = useCallback(() => {
    if (!settings.sessionTimeouts) return;

    const now = new Date();
    const activeSessions = sessions.filter(session => 
      session.status === 'In Progress'
    );

    activeSessions.forEach(session => {
      const sessionStart = new Date(session.date);
      const timeSinceStart = (now.getTime() - sessionStart.getTime()) / (1000 * 60); // minutes

      if (timeSinceStart >= settings.sessionTimeout) {
        addNotification({
          type: 'timeout',
          title: '⚠️ Session Timeout',
          message: `Your session "${session.title}" has been running for ${Math.round(timeSinceStart)} minutes. Consider taking a break.`,
          duration: 15000,
          action: {
            label: 'Pause Session',
            onClick: () => {
              if (onSessionUpdate) {
                onSessionUpdate(session.id, { status: 'Paused' });
              }
            }
          }
        });
      }
    });
  }, [sessions, settings, onSessionUpdate, addNotification]);

  // Generate daily summary
  const generateDailySummary = useCallback(() => {
    if (!settings.dailySummaries) return;

    const today = new Date().toISOString().split('T')[0];
    const todaysSessions = sessions.filter(session => session.date === today);
    
    if (todaysSessions.length === 0) return;

    const totalHours = todaysSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const completedSessions = todaysSessions.filter(s => s.status === 'Completed').length;
    const productivityScore = Math.round((completedSessions / todaysSessions.length) * 100);

    let message = `Today you completed ${completedSessions} sessions in ${totalHours.toFixed(1)} hours.`;
    
    if (productivityScore >= 80) {
      message += " 🎉 Excellent productivity!";
    } else if (productivityScore >= 60) {
      message += " 📈 Good work! Keep it up!";
    } else {
      message += " 💡 Room for improvement tomorrow.";
    }

    addNotification({
      type: 'summary',
      title: '📊 Daily Summary',
      message,
      duration: 8000
    });
  }, [sessions, settings, addNotification]);

  // Check productivity trends
  const checkProductivityTrends = useCallback(() => {
    if (!settings.productivityAlerts) return;

    const last7Days = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });

    if (last7Days.length < 3) return;

    const completedSessions = last7Days.filter(s => s.status === 'Completed').length;
    const completionRate = completedSessions / last7Days.length;

    if (completionRate < 0.5) {
      addNotification({
        type: 'alert',
        title: '📉 Productivity Alert',
        message: 'Your session completion rate has dropped below 50%. Consider reviewing your work approach.',
        duration: 12000
      });
    } else if (completionRate > 0.8) {
      addNotification({
        type: 'achievement',
        title: '🏆 Achievement Unlocked',
        message: 'Outstanding productivity! You\'ve maintained an 80%+ completion rate this week.',
        duration: 10000
      });
    }
  }, [sessions, settings, addNotification]);

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Check notifications periodically
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      checkBreakReminders();
      checkSessionTimeouts();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isEnabled, checkBreakReminders, checkSessionTimeouts]);

  // Daily summary at end of day
  useEffect(() => {
    if (!isEnabled || !settings.dailySummaries) return;

    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(18, 0, 0, 0); // 6 PM

    const timeUntilEndOfDay = endOfDay.getTime() - now.getTime();
    
    if (timeUntilEndOfDay > 0) {
      const timeout = setTimeout(() => {
        generateDailySummary();
      }, timeUntilEndOfDay);

      return () => clearTimeout(timeout);
    }
  }, [isEnabled, settings.dailySummaries, generateDailySummary]);

  // Weekly productivity check
  useEffect(() => {
    if (!isEnabled || !settings.productivityAlerts) return;

    const interval = setInterval(() => {
      checkProductivityTrends();
    }, 24 * 60 * 60 * 1000); // Daily

    return () => clearInterval(interval);
  }, [isEnabled, settings.productivityAlerts, checkProductivityTrends]);

  if (!isEnabled) {
    return (
      <div className="notification-system">
        <div className="notification-toggle">
          <button 
            className="btn btn-primary"
            onClick={() => setIsEnabled(true)}
          >
            🔔 Enable Notifications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-system">
      <div className="notification-header">
        <h3>🔔 Smart Notifications</h3>
        <div className="notification-controls">
          <button 
            className="btn btn-secondary btn-small"
            onClick={() => setIsEnabled(false)}
          >
            Disable
          </button>
          {notifications.length > 0 && (
            <button 
              className="btn btn-outline btn-small"
              onClick={clearAll}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="notification-settings">
        <h4>Settings</h4>
        <div className="settings-grid">
          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.breakReminders}
              onChange={(e) => setSettings(prev => ({ ...prev, breakReminders: e.target.checked }))}
            />
            <span>Break Reminders ({settings.breakInterval}min)</span>
          </label>
          
          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.sessionTimeouts}
              onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeouts: e.target.checked }))}
            />
            <span>Session Timeouts ({settings.sessionTimeout}min)</span>
          </label>
          
          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.dailySummaries}
              onChange={(e) => setSettings(prev => ({ ...prev, dailySummaries: e.target.checked }))}
            />
            <span>Daily Summaries</span>
          </label>
          
          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.productivityAlerts}
              onChange={(e) => setSettings(prev => ({ ...prev, productivityAlerts: e.target.checked }))}
            />
            <span>Productivity Alerts</span>
          </label>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications yet. Keep working to see smart reminders!</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.type} ${notification.read ? 'read' : ''}`}
            >
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">
                  {notification.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              <div className="notification-actions">
                {notification.action && (
                  <button 
                    className="btn btn-primary btn-small"
                    onClick={notification.action.onClick}
                  >
                    {notification.action.label}
                  </button>
                )}
                <button 
                  className="btn btn-outline btn-small"
                  onClick={() => removeNotification(notification.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationSystem;
