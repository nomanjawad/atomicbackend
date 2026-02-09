/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
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

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    // Verify token is still valid
                    const response = await authAPI.getCurrentUser();
                    if (response.success) {
                        setUser(response.data);
                    } else {
                        // Token invalid, clear storage
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

    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authAPI.login(email, password);
            if (response.success) {
                setUser(response.data.user);
                return { success: true };
            } else {
                setError(response.error?.message || 'Login failed');
                return { success: false, error: response.error?.message };
            }
        } catch (err) {
            const errorMessage = err.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signup = useCallback(async (email, password, fullName) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authAPI.signup(email, password, fullName);
            if (response.success) {
                // Auto-login after signup if session is returned
                if (response.data.session) {
                    localStorage.setItem('accessToken', response.data.session.accessToken);
                    localStorage.setItem('refreshToken', response.data.session.refreshToken);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    setUser(response.data.user);
                }
                return { success: true };
            } else {
                setError(response.error?.message || 'Signup failed');
                return { success: false, error: response.error?.message };
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
