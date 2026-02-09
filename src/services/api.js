/**
 * API Service - Centralized API communication layer
 * Handles all HTTP requests to the backend with authentication
 * Aligned with ADMIN_INTEGRATION.md API specification
 */

import axios from 'axios';

// API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

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
        const message = error.response?.data?.error || error.message || 'An error occurred';

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
// Authentication API (per ADMIN_INTEGRATION.md)
// ============================================

export const authAPI = {
    /**
     * Login - POST /user/login
     * Returns user object and session with access_token/refresh_token
     */
    login: async (email, password) => {
        const response = await api.post('/user/login', { email, password });
        if (response.session) {
            localStorage.setItem('accessToken', response.session.access_token);
            localStorage.setItem('refreshToken', response.session.refresh_token);
            // Normalize user object - extract full_name from user_metadata
            const rawUser = response.user;
            const normalizedUser = {
                id: rawUser.id,
                email: rawUser.email,
                full_name: rawUser.user_metadata?.full_name || rawUser.full_name || '',
                role: rawUser.role === 'authenticated' ? 'user' : rawUser.role,
            };
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            response._normalizedUser = normalizedUser;
        }
        return response;
    },

    /**
     * Register - POST /user/register
     * Creates a new user account
     */
    signup: async (email, password, fullName, role) => {
        const payload = { email, password, full_name: fullName };
        if (role) payload.role = role;
        const response = await api.post('/user/register', payload);
        if (response.session) {
            localStorage.setItem('accessToken', response.session.access_token);
            localStorage.setItem('refreshToken', response.session.refresh_token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    },

    /**
     * Logout - POST /user/logout and clear local storage
     */
    logout: async () => {
        try {
            await api.post('/user/logout');
        } catch (e) {
            // Continue with local logout even if API call fails
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    /**
     * Get current user's profile - GET /user/profile
     */
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response;
    },

    /**
     * Update current user's profile - PUT /user/profile
     */
    updateProfile: async (data) => {
        const response = await api.put('/user/profile', data);
        return response;
    },

    /**
     * Get current session - GET /user/session
     * Returns active status and user with role
     */
    getSession: async () => {
        const response = await api.get('/user/session');
        return response;
    },
};

// ============================================
// User Management API (per ADMIN_INTEGRATION.md)
// ============================================

export const userAPI = {
    /**
     * List all users - GET /user
     */
    getAll: async () => {
        const response = await api.get('/user');
        return response;
    },

    /**
     * Update user (e.g., change role) - PUT /user/:id
     */
    update: async (id, data) => {
        const response = await api.put(`/user/${id}`, data);
        return response;
    },

    /**
     * Get user by email - GET /user/email/:email
     */
    getByEmail: async (email) => {
        const response = await api.get(`/user/email/${encodeURIComponent(email)}`);
        return response;
    },

    /**
     * Delete user - DELETE /user/:id
     */
    delete: async (id) => {
        const response = await api.delete(`/user/${id}`);
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
// Page APIs (per ADMIN_INTEGRATION.md - Private API)
// ============================================

export const pagesAPI = {
    /**
     * List all pages - GET /pages
     */
    getAll: async () => {
        const response = await api.get('/pages');
        return response;
    },

    /**
     * Get single page by slug - GET /pages/:slug
     */
    getBySlug: async (slug) => {
        const response = await api.get(`/pages/${slug}`);
        return response;
    },

    /**
     * Create page - POST /pages
     */
    create: async (data) => {
        const response = await api.post('/pages', data);
        return response;
    },

    /**
     * Update page content & status - PUT /pages/:slug
     */
    update: async (slug, data) => {
        const response = await api.put(`/pages/${slug}`, data);
        return response;
    },

    /**
     * View page history - GET /pages/:slug/history
     */
    getHistory: async (slug) => {
        const response = await api.get(`/pages/${slug}/history`);
        return response;
    },

    /**
     * Restore page version - POST /pages/:slug/restore/:version
     */
    restoreVersion: async (slug, version) => {
        const response = await api.post(`/pages/${slug}/restore/${version}`);
        return response;
    },
};

// Individual page type CRUD APIs (existing backend endpoints)
export const homePagesAPI = createCrudAPI('/home-pages');
export const aboutPagesAPI = createCrudAPI('/about-pages');
export const contactPagesAPI = createCrudAPI('/contact-pages');
export const csrPagesAPI = createCrudAPI('/csr-pages');
export const galleryPagesAPI = createCrudAPI('/gallery-pages');
export const industriesPagesAPI = createCrudAPI('/industries-pages');
export const servicesPagesAPI = createCrudAPI('/services-pages');
export const individualServicesAPI = createCrudAPI('/individual-services');

// ============================================
// Blog API (per ADMIN_INTEGRATION.md)
// ============================================

export const blogPostsAPI = {
    /**
     * List posts - GET /blog
     */
    getAll: async (params = {}) => {
        const response = await api.get('/blog', { params });
        return response;
    },

    /**
     * Get single post by slug/id - GET /blog/:slug
     */
    getById: async (slug) => {
        const response = await api.get(`/blog/${slug}`);
        return response;
    },

    /**
     * Create post - POST /blog
     */
    create: async (data) => {
        const response = await api.post('/blog', data);
        return response;
    },

    /**
     * Update post - PUT /blog/:slug
     */
    update: async (slug, data) => {
        const response = await api.put(`/blog/${slug}`, data);
        return response;
    },

    /**
     * Delete post - DELETE /blog/:slug
     */
    delete: async (slug) => {
        const response = await api.delete(`/blog/${slug}`);
        return response;
    },
};

// ============================================
// Common Content API (per ADMIN_INTEGRATION.md)
// ============================================

export const commonContentAPI = {
    /**
     * List all common content - GET /content/common
     */
    getAll: async () => {
        const response = await api.get('/content/common');
        return response;
    },

    /**
     * Get common content by key - GET /content/common/:key
     */
    getByKey: async (key) => {
        const response = await api.get(`/content/common/${key}`);
        return response;
    },

    /**
     * Create/Update common content by key - PUT /content/common/:key
     */
    update: async (key, data) => {
        const response = await api.put(`/content/common/${key}`, data);
        return response;
    },

    /**
     * Delete common content - DELETE /content/common/:key
     */
    delete: async (key) => {
        const response = await api.delete(`/content/common/${key}`);
        return response;
    },
};

// ============================================
// Content Pages API (Public - /content/pages)
// ============================================

export const contentPagesAPI = {
    /**
     * List all page content - GET /content/pages
     */
    getAll: async () => {
        const response = await api.get('/content/pages');
        return response;
    },

    /**
     * Get page content by slug - GET /content/pages/:slug
     */
    getBySlug: async (slug) => {
        const response = await api.get(`/content/pages/${slug}`);
        return response;
    },

    /**
     * Create/Update page content - PUT /content/pages/:slug
     */
    update: async (slug, data) => {
        const response = await api.put(`/content/pages/${slug}`, data);
        return response;
    },

    /**
     * Delete page content - DELETE /content/pages/:slug
     */
    delete: async (slug) => {
        const response = await api.delete(`/content/pages/${slug}`);
        return response;
    },
};

// ============================================
// File Upload API (per ADMIN_INTEGRATION.md)
// ============================================

export const uploadAPI = {
    /**
     * Upload single image - POST /upload/image
     */
    upload: async (file, folder = '') => {
        const formData = new FormData();
        formData.append('file', file);
        if (folder) {
            formData.append('folder', folder);
        }
        const response = await api.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response;
    },

    /**
     * Delete image - DELETE /upload/image
     */
    delete: async (path) => {
        const response = await api.delete('/upload/image', { data: { path } });
        return response;
    },

    /**
     * Upload multiple images - POST /upload/images
     */
    uploadMultiple: async (files, folder = '') => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        if (folder) {
            formData.append('folder', folder);
        }
        const response = await api.post('/upload/images', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response;
    },

    /**
     * List images - GET /upload/list
     */
    list: async () => {
        const response = await api.get('/upload/list');
        return response;
    },

    /**
     * List images in folder - GET /upload/list/:folder
     */
    listFolder: async (folder) => {
        const response = await api.get(`/upload/list/${folder}`);
        return response;
    },
};

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

// Backward compatibility - profilesAPI now maps to userAPI
export const profilesAPI = userAPI;

// Export the axios instance for any custom requests
export default api;
