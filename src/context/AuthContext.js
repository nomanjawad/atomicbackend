/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 * Aligned with ADMIN_INTEGRATION.md API specification
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing session on mount using GET /user/session
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    // Verify token is still valid via GET /user/session
                    const response = await authAPI.getSession();
                    if (response.active && response.user) {
                        // Merge saved user data with session response
                        const parsed = JSON.parse(savedUser);
                        setUser({ ...parsed, role: response.user.role });
                    } else {
                        // Session inactive, clear storage
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                    }
                } catch (err) {
                    // Token invalid, clear storage
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    /**
     * Login via POST /user/login
     * Response format: { message, user, session: { access_token, refresh_token, expires_at } }
     */
    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authAPI.login(email, password);
            // authAPI.login stores tokens and normalized user in localStorage
            if (response.session) {
                // Use normalized user from api.js, then fetch real role from session
                let userData = response._normalizedUser;
                try {
                    const sessionRes = await authAPI.getSession();
                    if (sessionRes.active && sessionRes.user) {
                        userData = { ...userData, role: sessionRes.user.role };
                        localStorage.setItem('user', JSON.stringify(userData));
                    }
                } catch (e) {
                    // Session check failed, continue with login user data
                }
                setUser(userData);
                return { success: true };
            } else {
                setError('Login failed');
                return { success: false, error: 'Login failed' };
            }
        } catch (err) {
            const errorMessage = err.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Signup via POST /user/signup
     */
    const signup = useCallback(async (email, password, fullName) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authAPI.signup(email, password, fullName);
            // authAPI.signup stores tokens if session is returned
            if (response.user) {
                setUser(response.user);
                return { success: true };
            } else {
                return { success: true }; // User created but may need email confirmation
            }
        } catch (err) {
            const errorMessage = err.message || 'Signup failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await authAPI.logout();
        } finally {
            setUser(null);
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
