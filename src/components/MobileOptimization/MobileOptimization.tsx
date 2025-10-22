import React, { useState, useEffect, useCallback } from 'react';
import { 
  MobileOptimization, 
  TouchTargetConfig, 
  GestureConfig, 
  OrientationConfig, 
  PerformanceConfig, 
  AccessibilityConfig, 
  ResponsiveConfig,
  DeviceInfo,
  MobileAnalytics,
  PWAManifest,
  ServiceWorkerConfig
} from '../../types';
import './MobileOptimization.css';

interface MobileOptimizationProps {
  onOptimizationChange?: (config: MobileOptimization) => void;
  onAnalyticsUpdate?: (analytics: MobileAnalytics) => void;
}

const MobileOptimizationComponent: React.FC<MobileOptimizationProps> = ({
  onOptimizationChange,
  onAnalyticsUpdate
}) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [analytics, setAnalytics] = useState<MobileAnalytics | null>(null);
  const [optimization, setOptimization] = useState<MobileOptimization>({
    touchTargets: {
      minSize: 44,
      spacing: 8,
      feedback: 'both',
      longPressDelay: 500,
      swipeThreshold: 50
    },
    gestures: {
      swipe: {
        enabled: true,
        directions: ['left', 'right', 'up', 'down'],
        threshold: 50,
        velocity: 0.3,
        preventDefault: false
      },
      pinch: {
        enabled: true,
        minScale: 0.5,
        maxScale: 3.0,
        threshold: 0.1
      },
      rotate: {
        enabled: true,
        threshold: 15,
        preventDefault: false
      },
      pan: {
        enabled: true,
        threshold: 10,
        preventDefault: false,
        direction: 'both'
      }
    },
    orientation: {
      supported: ['portrait', 'landscape'],
      lock: false,
      autoRotate: true,
      transition: 'smooth'
    },
    performance: {
      lazyLoading: true,
      imageOptimization: true,
      codeSplitting: true,
      preloading: true,
      compression: true,
      caching: true
    },
    accessibility: {
      screenReader: true,
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      keyboardNavigation: true,
      focusManagement: true
    },
    responsive: {
      breakpoints: [
        { name: 'mobile', minWidth: 0, maxWidth: 767, columns: 1, gutter: 16 },
        { name: 'tablet', minWidth: 768, maxWidth: 1023, columns: 2, gutter: 24 },
        { name: 'desktop', minWidth: 1024, columns: 3, gutter: 32 }
      ],
      fluid: true,
      container: {
        maxWidth: 1200,
        padding: 20,
        center: true
      },
      grid: {
        columns: 12,
        gutter: 24,
        margin: 16
      }
    }
  });

  const [pwaManifest, setPwaManifest] = useState<PWAManifest>({
    name: 'Agent Alex - AI Project Management',
    short_name: 'Agent Alex',
    description: 'AI-powered project management and session tracking platform',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    theme_color: '#3b82f6',
    background_color: '#ffffff',
    scope: '/',
    id: 'agent-alex-pwa',
    lang: 'en',
    dir: 'ltr',
    categories: ['productivity', 'business', 'utilities'],
    icons: [],
    shortcuts: [],
    screenshots: []
  });

  const [serviceWorkerConfig, setServiceWorkerConfig] = useState<ServiceWorkerConfig>({
    version: '1.0.0',
    cacheName: 'agent-alex-v1.0.0',
    strategies: [
      {
        pattern: /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/,
        strategy: 'cacheFirst',
        cacheName: 'static-cache'
      },
      {
        pattern: /\/api\//,
        strategy: 'networkFirst',
        cacheName: 'api-cache'
      }
    ],
    offlinePages: ['/', '/dashboard', '/projects', '/sessions', '/analytics'],
    backgroundSync: {
      enabled: true,
      queueName: 'agent-alex-sync-queue',
      maxRetries: 3,
      retryDelay: 1000,
      events: ['session-create', 'project-update', 'data-sync']
    },
    pushNotifications: {
      enabled: true,
      vapidPublicKey: '',
      supportedActions: [
        { action: 'view', title: 'View', icon: '/icons/view.png' },
        { action: 'dismiss', title: 'Dismiss', icon: '/icons/dismiss.png' }
      ],
      defaultOptions: {
        body: 'You have new updates in Agent Alex',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        requireInteraction: false,
        silent: false
      }
    },
    updateStrategy: 'prompt'
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Detect device information
  const detectDeviceInfo = useCallback(() => {
    const info: DeviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      vendor: navigator.vendor || 'Unknown',
      model: 'Unknown',
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio,
        orientation: window.screen.width > window.screen.height ? 'landscape' : 'portrait',
        colorDepth: window.screen.colorDepth,
        touchSupport: 'ontouchstart' in window
      },
      connection: {
        type: (navigator as any).connection?.type || 'unknown',
        effectiveType: (navigator as any).connection?.effectiveType || 'unknown',
        downlink: (navigator as any).connection?.downlink || 0,
        rtt: (navigator as any).connection?.rtt || 0,
        saveData: (navigator as any).connection?.saveData || false
      },
      battery: {
        level: 1,
        charging: true,
        chargingTime: 0,
        dischargingTime: 0
      },
      memory: {
        used: 0,
        total: 0,
        limit: 0
      },
      storage: {
        used: 0,
        quota: 0,
        available: 0
      }
    };

    // Get battery info if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        info.battery = {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
        setDeviceInfo({ ...info });
      });
    }

    // Get memory info if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      info.memory = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }

    setDeviceInfo(info);
  }, []);

  // Initialize PWA
  useEffect(() => {
    detectDeviceInfo();

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, [detectDeviceInfo]);

  // Handle install prompt
  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log('Install prompt outcome:', outcome);
      setInstallPrompt(null);
    }
  };

  // Update optimization settings
  const updateOptimization = (updates: Partial<MobileOptimization>) => {
    const newOptimization = { ...optimization, ...updates };
    setOptimization(newOptimization);
    onOptimizationChange?.(newOptimization);
  };

  // Update PWA manifest
  const updatePWAManifest = (updates: Partial<PWAManifest>) => {
    const newManifest = { ...pwaManifest, ...updates };
    setPwaManifest(newManifest);
  };

  // Update service worker config
  const updateServiceWorkerConfig = (updates: Partial<ServiceWorkerConfig>) => {
    const newConfig = { ...serviceWorkerConfig, ...updates };
    setServiceWorkerConfig(newConfig);
  };

  // Render overview tab
  const renderOverview = () => (
    <div className="mobile-overview">
      <div className="device-info">
        <h3>📱 Device Information</h3>
        {deviceInfo ? (
          <div className="device-details">
            <div className="device-item">
              <span className="label">Platform:</span>
              <span className="value">{deviceInfo.platform}</span>
            </div>
            <div className="device-item">
              <span className="label">Screen:</span>
              <span className="value">{deviceInfo.screen.width}x{deviceInfo.screen.height}</span>
            </div>
            <div className="device-item">
              <span className="label">Pixel Ratio:</span>
              <span className="value">{deviceInfo.screen.pixelRatio}</span>
            </div>
            <div className="device-item">
              <span className="label">Touch Support:</span>
              <span className="value">{deviceInfo.screen.touchSupport ? 'Yes' : 'No'}</span>
            </div>
            <div className="device-item">
              <span className="label">Connection:</span>
              <span className="value">{deviceInfo.connection.effectiveType}</span>
            </div>
            <div className="device-item">
              <span className="label">Battery:</span>
              <span className="value">{Math.round(deviceInfo.battery.level * 100)}%</span>
            </div>
          </div>
        ) : (
          <p>Detecting device information...</p>
        )}
      </div>

      <div className="pwa-status">
        <h3>🚀 PWA Status</h3>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">Installed:</span>
            <span className={`status-value ${isInstalled ? 'installed' : 'not-installed'}`}>
              {isInstalled ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Service Worker:</span>
            <span className="status-value active">Active</span>
          </div>
          <div className="status-item">
            <span className="status-label">Offline Support:</span>
            <span className="status-value active">Enabled</span>
          </div>
          <div className="status-item">
            <span className="status-label">Push Notifications:</span>
            <span className="status-value active">Enabled</span>
          </div>
        </div>

        {!isInstalled && installPrompt && (
          <button className="btn btn-primary install-btn" onClick={handleInstall}>
            📱 Install Agent Alex
          </button>
        )}
      </div>
    </div>
  );

  // Render touch targets tab
  const renderTouchTargets = () => (
    <div className="touch-targets-config">
      <h3>👆 Touch Targets Configuration</h3>
      
      <div className="config-section">
        <label className="config-label">
          <span>Minimum Touch Target Size (px)</span>
          <input
            type="number"
            value={optimization.touchTargets.minSize}
            onChange={(e) => updateOptimization({
              touchTargets: { ...optimization.touchTargets, minSize: parseInt(e.target.value) }
            })}
            min="32"
            max="80"
          />
        </label>
      </div>

      <div className="config-section">
        <label className="config-label">
          <span>Spacing Between Targets (px)</span>
          <input
            type="number"
            value={optimization.touchTargets.spacing}
            onChange={(e) => updateOptimization({
              touchTargets: { ...optimization.touchTargets, spacing: parseInt(e.target.value) }
            })}
            min="4"
            max="24"
          />
        </label>
      </div>

      <div className="config-section">
        <label className="config-label">
          <span>Feedback Type</span>
          <select
            value={optimization.touchTargets.feedback}
            onChange={(e) => updateOptimization({
              touchTargets: { ...optimization.touchTargets, feedback: e.target.value as 'haptic' | 'visual' | 'both' }
            })}
          >
            <option value="haptic">Haptic Only</option>
            <option value="visual">Visual Only</option>
            <option value="both">Both</option>
          </select>
        </label>
      </div>

      <div className="config-section">
        <label className="config-label">
          <span>Long Press Delay (ms)</span>
          <input
            type="number"
            value={optimization.touchTargets.longPressDelay}
            onChange={(e) => updateOptimization({
              touchTargets: { ...optimization.touchTargets, longPressDelay: parseInt(e.target.value) }
            })}
            min="300"
            max="1000"
          />
        </label>
      </div>

      <div className="config-section">
        <label className="config-label">
          <span>Swipe Threshold (px)</span>
          <input
            type="number"
            value={optimization.touchTargets.swipeThreshold}
            onChange={(e) => updateOptimization({
              touchTargets: { ...optimization.touchTargets, swipeThreshold: parseInt(e.target.value) }
            })}
            min="20"
            max="100"
          />
        </label>
      </div>
    </div>
  );

  // Render gestures tab
  const renderGestures = () => (
    <div className="gestures-config">
      <h3>🤏 Gesture Configuration</h3>
      
      <div className="gesture-section">
        <h4>Swipe Gestures</h4>
        <div className="config-grid">
          <label className="config-label">
            <input
              type="checkbox"
              checked={optimization.gestures.swipe.enabled}
              onChange={(e) => updateOptimization({
                gestures: {
                  ...optimization.gestures,
                  swipe: { ...optimization.gestures.swipe, enabled: e.target.checked }
                }
              })}
            />
            <span>Enable Swipe Gestures</span>
          </label>
          
          <label className="config-label">
            <span>Threshold (px)</span>
            <input
              type="number"
              value={optimization.gestures.swipe.threshold}
              onChange={(e) => updateOptimization({
                gestures: {
                  ...optimization.gestures,
                  swipe: { ...optimization.gestures.swipe, threshold: parseInt(e.target.value) }
                }
              })}
              min="20"
              max="100"
            />
          </label>
        </div>
      </div>

      <div className="gesture-section">
        <h4>Pinch Gestures</h4>
        <div className="config-grid">
          <label className="config-label">
            <input
              type="checkbox"
              checked={optimization.gestures.pinch.enabled}
              onChange={(e) => updateOptimization({
                gestures: {
                  ...optimization.gestures,
                  pinch: { ...optimization.gestures.pinch, enabled: e.target.checked }
                }
              })}
            />
            <span>Enable Pinch Gestures</span>
          </label>
          
          <div className="range-inputs">
            <label className="config-label">
              <span>Min Scale</span>
              <input
                type="number"
                value={optimization.gestures.pinch.minScale}
                onChange={(e) => updateOptimization({
                  gestures: {
                    ...optimization.gestures,
                    pinch: { ...optimization.gestures.pinch, minScale: parseFloat(e.target.value) }
                  }
                })}
                min="0.1"
                max="1.0"
                step="0.1"
              />
            </label>
            
            <label className="config-label">
              <span>Max Scale</span>
              <input
                type="number"
                value={optimization.gestures.pinch.maxScale}
                onChange={(e) => updateOptimization({
                  gestures: {
                    ...optimization.gestures,
                    pinch: { ...optimization.gestures.pinch, maxScale: parseFloat(e.target.value) }
                  }
                })}
                min="1.0"
                max="5.0"
                step="0.1"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Render performance tab
  const renderPerformance = () => (
    <div className="performance-config">
      <h3>⚡ Performance Optimization</h3>
      
      <div className="config-grid">
        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.performance.lazyLoading}
            onChange={(e) => updateOptimization({
              performance: { ...optimization.performance, lazyLoading: e.target.checked }
            })}
          />
          <span>Lazy Loading</span>
        </label>

        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.performance.imageOptimization}
            onChange={(e) => updateOptimization({
              performance: { ...optimization.performance, imageOptimization: e.target.checked }
            })}
          />
          <span>Image Optimization</span>
        </label>

        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.performance.codeSplitting}
            onChange={(e) => updateOptimization({
              performance: { ...optimization.performance, codeSplitting: e.target.checked }
            })}
          />
          <span>Code Splitting</span>
        </label>

        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.performance.preloading}
            onChange={(e) => updateOptimization({
              performance: { ...optimization.performance, preloading: e.target.checked }
            })}
          />
          <span>Preloading</span>
        </label>

        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.performance.compression}
            onChange={(e) => updateOptimization({
              performance: { ...optimization.performance, compression: e.target.checked }
            })}
          />
          <span>Compression</span>
        </label>

        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.performance.caching}
            onChange={(e) => updateOptimization({
              performance: { ...optimization.performance, caching: e.target.checked }
            })}
          />
          <span>Caching</span>
        </label>
      </div>
    </div>
  );

  // Render accessibility tab
  const renderAccessibility = () => (
    <div className="accessibility-config">
      <h3>♿ Accessibility Features</h3>
      
      <div className="config-grid">
        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.accessibility.screenReader}
            onChange={(e) => updateOptimization({
              accessibility: { ...optimization.accessibility, screenReader: e.target.checked }
            })}
          />
          <span>Screen Reader Support</span>
        </label>

        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.accessibility.highContrast}
            onChange={(e) => updateOptimization({
              accessibility: { ...optimization.accessibility, highContrast: e.target.checked }
            })}
          />
          <span>High Contrast Mode</span>
        </label>

        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.accessibility.largeText}
            onChange={(e) => updateOptimization({
              accessibility: { ...optimization.accessibility, largeText: e.target.checked }
            })}
          />
          <span>Large Text Support</span>
        </label>

        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.accessibility.reducedMotion}
            onChange={(e) => updateOptimization({
              accessibility: { ...optimization.accessibility, reducedMotion: e.target.checked }
            })}
          />
          <span>Reduced Motion</span>
        </label>

        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.accessibility.keyboardNavigation}
            onChange={(e) => updateOptimization({
              accessibility: { ...optimization.accessibility, keyboardNavigation: e.target.checked }
            })}
          />
          <span>Keyboard Navigation</span>
        </label>

        <label className="config-label">
          <input
            type="checkbox"
            checked={optimization.accessibility.focusManagement}
            onChange={(e) => updateOptimization({
              accessibility: { ...optimization.accessibility, focusManagement: e.target.checked }
            })}
          />
          <span>Focus Management</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="mobile-optimization-container">
      <div className="mobile-header">
        <h2>📱 Mobile Optimization & PWA</h2>
        <p>Configure mobile experience, PWA features, and performance optimizations</p>
      </div>

      <div className="mobile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'touch' ? 'active' : ''}`}
          onClick={() => setActiveTab('touch')}
        >
          👆 Touch Targets
        </button>
        <button 
          className={`tab-btn ${activeTab === 'gestures' ? 'active' : ''}`}
          onClick={() => setActiveTab('gestures')}
        >
          🤏 Gestures
        </button>
        <button 
          className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          ⚡ Performance
        </button>
        <button 
          className={`tab-btn ${activeTab === 'accessibility' ? 'active' : ''}`}
          onClick={() => setActiveTab('accessibility')}
        >
          ♿ Accessibility
        </button>
      </div>

      <div className="mobile-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'touch' && renderTouchTargets()}
        {activeTab === 'gestures' && renderGestures()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'accessibility' && renderAccessibility()}
      </div>
    </div>
  );
};

export default MobileOptimizationComponent;
