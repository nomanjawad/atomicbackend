/**
 * Protected Route Component
 * Redirects unauthenticated users to sign-in page
 * Restricts access based on user roles
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '@iconify/react/dist/iconify.js';

/**
 * Role-based route protection
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 *   - 'admin' - Full access
 *   - 'editor' - Can access forms and tables
 *   - 'viewer' - Can only access tables
 */
const ProtectedRoute = ({ children, allowedRoles = ['admin', 'editor', 'viewer'] }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking auth status
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Redirect to sign-in if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    // Check role-based access
    const userRole = user?.role || 'viewer';
    const hasAccess = allowedRoles.includes(userRole);

    if (!hasAccess) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card radius-16 p-40 text-center" style={{ maxWidth: '500px' }}>
                    <div className="text-danger mb-24">
                        <Icon icon="mdi:shield-lock" style={{ fontSize: '80px' }} />
                    </div>
                    <h3 className="mb-16 text-danger">Access Restricted</h3>
                    <p className="text-secondary-light mb-24">
                        You don't have permission to access this page.
                        {userRole === 'viewer' && (
                            <span className="d-block mt-8">
                                <strong>Viewers</strong> can only access view/table pages.
                            </span>
                        )}
                        {userRole === 'editor' && (
                            <span className="d-block mt-8">
                                <strong>Editors</strong> can access forms and tables, but not admin pages.
                            </span>
                        )}
                    </p>
                    <div className="d-flex gap-12 justify-content-center">
                        <button
                            onClick={() => window.history.back()}
                            className="btn btn-outline-secondary px-24 py-10 radius-8"
                        >
                            <Icon icon="mdi:arrow-left" className="me-8" />
                            Go Back
                        </button>
                        <a
                            href="/"
                            className="btn btn-primary px-24 py-10 radius-8"
                        >
                            <Icon icon="mdi:home" className="me-8" />
                            Dashboard
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
