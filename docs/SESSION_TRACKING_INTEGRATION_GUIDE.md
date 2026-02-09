# Session Tracking Integration Guide

> **Purpose**: This guide is for integrating session-based analytics tracking into the main frontend website. The backend API is already configured to accept session IDs for bounce rate calculation.

---

## Overview

The Skytech Solution Admin backend tracks visitor analytics at `POST /api/analytics/track`. To enable **bounce rate** and **pages per session** metrics, you must:

1. Generate a unique session ID per browser session
2. Send this session ID with every page view tracking call

---

## API Endpoint

### URL
```
POST http://your-backend-url/api/analytics/track
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "pageUrl": "/about",           // Required: Current page path
  "referrer": "https://google.com", // Optional: Referring URL
  "sessionId": "uuid-string"     // Optional but RECOMMENDED: Session identifier
}
```

### Response
```json
{
  "success": true,
  "data": { "id": 123 },
  "message": "Visit tracked successfully"
}
```

---

## Implementation Task

### Step 1: Create Session Tracking Utility

Create a new file `utils/sessionTracking.js` (or equivalent for your framework):

```javascript
/**
 * Session Tracking Utility
 * Generates and persists session IDs for analytics tracking
 */

// Generate a UUID v4
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Get or create session ID
export const getSessionId = () => {
    // Check if sessionStorage is available
    if (typeof window === 'undefined' || !window.sessionStorage) {
        return null;
    }

    const SESSION_KEY = 'amco_analytics_session';
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    
    if (!sessionId) {
        sessionId = generateUUID();
        sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    
    return sessionId;
};

export default { getSessionId };
```

### Step 2: Create Analytics Tracking Function

Create `utils/analytics.js` or add to existing API utility:

```javascript
import { getSessionId } from './sessionTracking';

const API_BASE_URL = process.env.ANALYTICS_API_URL || 'http://localhost:5000/api';

/**
 * Track a page view with session information
 * @param {string} pageUrl - Current page URL/path
 * @param {string} referrer - Referring URL (optional)
 */
export const trackPageView = async (pageUrl, referrer = null) => {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pageUrl: pageUrl || window.location.pathname,
                referrer: referrer || document.referrer || null,
                sessionId: getSessionId()
            })
        });
        
        if (!response.ok) {
            console.warn('Analytics tracking failed:', response.status);
        }
        
        return response.json();
    } catch (error) {
        // Silently fail - analytics should not break the app
        console.warn('Analytics tracking error:', error.message);
        return null;
    }
};

export default { trackPageView };
```

### Step 3: Integrate with Your Router/Framework

#### For Vue/Nuxt:

```javascript
// plugins/analytics.client.js (Nuxt 3)
import { trackPageView } from '~/utils/analytics';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', () => {
        trackPageView(window.location.pathname, document.referrer);
    });
});
```

Or in `nuxt.config.ts`:
```javascript
// Use router middleware
router: {
    middleware: ['analytics']
}
```

With middleware file:
```javascript
// middleware/analytics.global.js
import { trackPageView } from '~/utils/analytics';

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
        trackPageView(to.fullPath, from?.fullPath);
    }
});
```

#### For React/Next.js:

```javascript
// app/layout.js or _app.js
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/utils/analytics';

export default function RootLayout({ children }) {
    const pathname = usePathname();
    
    useEffect(() => {
        trackPageView(pathname);
    }, [pathname]);
    
    return <html>...</html>;
}
```

#### For Plain JavaScript (Vanilla):

```javascript
// In your main entry file
import { trackPageView } from './utils/analytics.js';

// Track initial page load
document.addEventListener('DOMContentLoaded', () => {
    trackPageView(window.location.pathname, document.referrer);
});

// If using client-side routing, also track navigation
window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname);
});
```

---

## Environment Configuration

Add the analytics API URL to your environment variables:

```env
# .env or .env.local
ANALYTICS_API_URL=http://localhost:5000/api

# For production
ANALYTICS_API_URL=https://your-production-api.com/api
```

---

## Testing

After implementation, verify tracking works:

1. Open browser DevTools → Network tab
2. Navigate to different pages on your website
3. Look for POST requests to `/api/analytics/track`
4. Verify the request body includes `sessionId`

Example successful request:
```json
{
  "pageUrl": "/products",
  "referrer": "/home",
  "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

---

## How Session Tracking Enables Bounce Rate

| Scenario | Session ID | Pages Visited | Result |
|----------|------------|---------------|--------|
| User visits 1 page and leaves | abc-123 | 1 | ❌ Bounced |
| User visits 3 pages | abc-123 | 3 | ✅ Engaged |
| Same user returns later | xyz-789 (new) | 2 | ✅ Engaged |

The backend groups visits by `sessionId` to calculate:
- **Bounce Rate** = Sessions with 1 page / Total sessions × 100
- **Avg Pages/Session** = Total page views / Total sessions

---

## Checklist

- [ ] Create `sessionTracking.js` utility
- [ ] Create `analytics.js` tracking function
- [ ] Integrate with router/navigation
- [ ] Set `ANALYTICS_API_URL` environment variable
- [ ] Test tracking in browser DevTools
- [ ] Verify data appears in admin dashboard

---

## Notes for AI Agent

- Do NOT use `localStorage` - use `sessionStorage` (session ID should reset when browser closes)
- Tracking should NEVER block or break the main app functionality
- Use try/catch and fail silently on errors
- The `sessionId` parameter is optional - old calls without it still work
- UUID format: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
