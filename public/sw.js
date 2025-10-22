/**
 * Agent Alex Service Worker
 * Advanced PWA capabilities with offline support, caching, and background sync
 */

const CACHE_NAME = 'agent-alex-v1.0.0';
const STATIC_CACHE = 'agent-alex-static-v1.0.0';
const DYNAMIC_CACHE = 'agent-alex-dynamic-v1.0.0';
const API_CACHE = 'agent-alex-api-v1.0.0';

// Cache strategies configuration
const CACHE_STRATEGIES = {
  // Static assets - cache first
  static: {
    pattern: /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/,
    strategy: 'cacheFirst',
    cacheName: STATIC_CACHE
  },
  // API calls - network first with fallback
  api: {
    pattern: /\/api\//,
    strategy: 'networkFirst',
    cacheName: API_CACHE,
    timeout: 5000
  },
  // HTML pages - stale while revalidate
  pages: {
    pattern: /\.html$|\/$/,
    strategy: 'staleWhileRevalidate',
    cacheName: DYNAMIC_CACHE
  },
  // Images - cache first with fallback
  images: {
    pattern: /\.(png|jpg|jpeg|gif|svg|webp)$/,
    strategy: 'cacheFirst',
    cacheName: STATIC_CACHE
  }
};

// Offline fallback pages
const OFFLINE_PAGES = {
  '/': '/offline.html',
  '/dashboard': '/offline.html',
  '/projects': '/offline.html',
  '/sessions': '/offline.html',
  '/analytics': '/offline.html'
};

// Background sync queue
const SYNC_QUEUE = 'agent-alex-sync-queue';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll([
          '/',
          '/static/js/bundle.js',
          '/static/css/main.css',
          '/manifest.json',
          '/offline.html',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png'
        ]);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Determine cache strategy based on request type
  const strategy = getCacheStrategy(request);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// Get cache strategy for a request
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // API requests
  if (CACHE_STRATEGIES.api.pattern.test(url.pathname)) {
    return CACHE_STRATEGIES.api;
  }
  
  // Static assets
  if (CACHE_STRATEGIES.static.pattern.test(url.pathname)) {
    return CACHE_STRATEGIES.static;
  }
  
  // Images
  if (CACHE_STRATEGIES.images.pattern.test(url.pathname)) {
    return CACHE_STRATEGIES.images;
  }
  
  // Pages
  if (CACHE_STRATEGIES.pages.pattern.test(url.pathname)) {
    return CACHE_STRATEGIES.pages;
  }
  
  // Default to network first
  return {
    strategy: 'networkFirst',
    cacheName: DYNAMIC_CACHE
  };
}

// Handle request based on strategy
async function handleRequest(request, strategy) {
  const cacheName = strategy.cacheName || DYNAMIC_CACHE;
  
  try {
    switch (strategy.strategy) {
      case 'cacheFirst':
        return await cacheFirst(request, cacheName);
      case 'networkFirst':
        return await networkFirst(request, cacheName, strategy.timeout);
      case 'staleWhileRevalidate':
        return await staleWhileRevalidate(request, cacheName);
      case 'networkOnly':
        return await networkOnly(request);
      case 'cacheOnly':
        return await cacheOnly(request, cacheName);
      default:
        return await networkFirst(request, cacheName);
    }
  } catch (error) {
    console.error('[SW] Request handling failed:', error);
    return await getOfflineFallback(request);
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network request failed:', error);
    throw error;
  }
}

// Network First Strategy
async function networkFirst(request, cacheName, timeout = 5000) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), timeout)
      )
    ]);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error.message);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch((error) => {
      console.log('[SW] Background fetch failed:', error);
    });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  return await networkResponsePromise;
}

// Network Only Strategy
async function networkOnly(request) {
  return await fetch(request);
}

// Cache Only Strategy
async function cacheOnly(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (!cachedResponse) {
    throw new Error('No cached response available');
  }
  
  return cachedResponse;
}

// Get offline fallback
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Check for specific offline page
  if (OFFLINE_PAGES[pathname]) {
    const cache = await caches.open(STATIC_CACHE);
    const offlinePage = await cache.match(OFFLINE_PAGES[pathname]);
    if (offlinePage) {
      return offlinePage;
    }
  }
  
  // Default offline page
  const cache = await caches.open(STATIC_CACHE);
  const defaultOffline = await cache.match('/offline.html');
  
  if (defaultOffline) {
    return defaultOffline;
  }
  
  // Last resort - return a basic offline response
  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Offline - Agent Alex</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center; 
            padding: 50px; 
            background: #f8fafc;
            color: #374151;
          }
          .offline-container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .offline-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          h1 { color: #1f2937; margin-bottom: 16px; }
          p { color: #6b7280; margin-bottom: 24px; }
          .retry-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
          }
          .retry-btn:hover { background: #2563eb; }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">📱</div>
          <h1>You're Offline</h1>
          <p>Agent Alex is not available right now. Please check your internet connection and try again.</p>
          <button class="retry-btn" onclick="window.location.reload()">
            Try Again
          </button>
        </div>
      </body>
    </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

// Background Sync
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === SYNC_QUEUE) {
    event.waitUntil(syncPendingRequests());
  }
});

// Sync pending requests
async function syncPendingRequests() {
  try {
    const cache = await caches.open('agent-alex-sync-queue');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('[SW] Synced request:', request.url);
        }
      } catch (error) {
        console.error('[SW] Failed to sync request:', request.url, error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'You have new updates in Agent Alex',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Updates',
        icon: '/icons/action-view.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data = { ...options.data, ...data };
  }
  
  event.waitUntil(
    self.registration.showNotification('Agent Alex', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync triggered:', event.tag);
  
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

// Sync content in background
async function syncContent() {
  try {
    // Sync projects and sessions
    const response = await fetch('/api/sync');
    if (response.ok) {
      console.log('[SW] Content synced successfully');
    }
  } catch (error) {
    console.error('[SW] Content sync failed:', error);
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service Worker loaded successfully');
