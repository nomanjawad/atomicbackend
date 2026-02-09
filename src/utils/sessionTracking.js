/**
 * Session Tracking Utility
 * Generates and persists session IDs for analytics tracking
 */

// Generate a UUID v4
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Get or create session ID
export const getSessionId = () => {
    // Check if sessionStorage is available (not in SSR)
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

// Clear session (useful for testing or when user logs out)
export const clearSession = () => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem('amco_analytics_session');
    }
};

export default {
    getSessionId,
    clearSession
};
