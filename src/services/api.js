/**
 * API Service - Centralized API communication layer
 * Handles all HTTP requests to the backend with authentication
 */

import axios from 'axios';

// API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.error?.message || error.message || 'An error occurred';

        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            // Only redirect if not already on auth pages
            if (!window.location.pathname.includes('/sign-in') &&
                !window.location.pathname.includes('/sign-up')) {
                window.location.href = '/sign-in';
            }
        }

        return Promise.reject({ message, status: error.response?.status });
    }
);

// ============================================
// Authentication API
// ============================================

export const authAPI = {
    signup: async (email, password, fullName, role) => {
        const response = await api.post('/auth/signup', { email, password, fullName, role });
        return response;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.success && response.data.session) {
            localStorage.setItem('accessToken', response.data.session.accessToken);
            localStorage.setItem('refreshToken', response.data.session.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Continue with local logout even if API call fails
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response;
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        const response = await api.post('/auth/refresh', { refreshToken });
        if (response.success && response.data.session) {
            localStorage.setItem('accessToken', response.data.session.accessToken);
            localStorage.setItem('refreshToken', response.data.session.refreshToken);
        }
        return response;
    },
};

// ============================================
// Generic CRUD Factory
// ============================================

const createCrudAPI = (endpoint) => ({
    getAll: async (params = {}) => {
        const response = await api.get(endpoint, { params });
        return response;
    },

    getById: async (id) => {
        const response = await api.get(`${endpoint}/${id}`);
        return response;
    },

    create: async (data) => {
        const response = await api.post(endpoint, data);
        return response;
    },

    update: async (id, data) => {
        const response = await api.put(`${endpoint}/${id}`, data);
        return response;
    },

    delete: async (id) => {
        const response = await api.delete(`${endpoint}/${id}`);
        return response;
    },
});

// ============================================
// Page APIs
// ============================================

export const homePagesAPI = createCrudAPI('/home-pages');
export const aboutPagesAPI = createCrudAPI('/about-pages');
export const contactPagesAPI = createCrudAPI('/contact-pages');
export const blogPostsAPI = createCrudAPI('/blog-posts');
export const csrPagesAPI = createCrudAPI('/csr-pages');
export const galleryPagesAPI = createCrudAPI('/gallery-pages');
export const industriesPagesAPI = createCrudAPI('/industries-pages');
export const servicesPagesAPI = createCrudAPI('/services-pages');
export const individualServicesAPI = createCrudAPI('/individual-services');
export const profilesAPI = createCrudAPI('/profiles');

// ============================================
// Analytics API
// ============================================

export const analyticsAPI = {
    // Track a visitor (public endpoint)
    track: async (pageUrl, referrer, sessionId = null) => {
        const payload = { pageUrl, referrer };
        if (sessionId) {
            payload.sessionId = sessionId;
        }
        const response = await api.post('/analytics/track', payload);
        return response;
    },

    // Get analytics summary (admin only) - optional date range filter
    getSummary: async (startDate = null, endDate = null) => {
        let url = '/analytics/summary';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        const response = await api.get(url);
        return response;
    },

    // Get visitors list with pagination (admin only)
    getVisitors: async (page = 1, limit = 20, startDate = null, endDate = null) => {
        let url = `/analytics/visitors?page=${page}&limit=${limit}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        const response = await api.get(url);
        return response;
    }
};

// ============================================
// SEO Scripts API
// ============================================

export const seoScriptsAPI = {
    // Get all scripts (admin only)
    getAll: async (page = 1, limit = 50) => {
        const response = await api.get(`/seo-scripts?page=${page}&limit=${limit}`);
        return response;
    },

    // Get single script by ID (admin only)
    getById: async (id) => {
        const response = await api.get(`/seo-scripts/${id}`);
        return response;
    },

    // Create new script (admin only)
    create: async (data) => {
        const response = await api.post('/seo-scripts', data);
        return response;
    },

    // Update script (admin only)
    update: async (id, data) => {
        const response = await api.put(`/seo-scripts/${id}`, data);
        return response;
    },

    // Delete script (admin only)
    delete: async (id) => {
        const response = await api.delete(`/seo-scripts/${id}`);
        return response;
    },

    // Get scripts by route and locale (public endpoint)
    getByRoute: async (route = '/', locale = '') => {
        let url = `/seo-scripts/by-route?route=${encodeURIComponent(route)}`;
        if (locale) url += `&locale=${locale}`;
        const response = await api.get(url);
        return response;
    }
};

// Export the axios instance for any custom requests
export default api;

