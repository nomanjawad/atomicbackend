/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * Roles:
 * - admin: Full access, can delete, manage users, assign roles
 * - editor: Can create and edit content, cannot delete
 * - viewer: Read-only access to dashboard
 */

// Role hierarchy (higher = more permissions)
export const ROLES = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer'
};

// Role descriptions
export const ROLE_INFO = {
    admin: {
        name: 'Admin',
        description: 'Full access to all features including user management and deletion',
        color: 'danger',
        permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'assign_roles']
    },
    editor: {
        name: 'Editor',
        description: 'Can create and edit content, but cannot delete or manage users',
        color: 'warning',
        permissions: ['create', 'read', 'update']
    },
    viewer: {
        name: 'Viewer',
        description: 'Read-only access to view dashboard and content',
        color: 'info',
        permissions: ['read']
    }
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (userRole, permission) => {
    if (!userRole) return false;
    const role = userRole.toLowerCase();
    const roleInfo = ROLE_INFO[role];
    return roleInfo ? roleInfo.permissions.includes(permission) : false;
};

/**
 * Check if user can delete content
 */
export const canDelete = (userRole) => {
    return hasPermission(userRole, 'delete');
};

/**
 * Check if user can create content
 */
export const canCreate = (userRole) => {
    return hasPermission(userRole, 'create');
};

/**
 * Check if user can update content
 */
export const canUpdate = (userRole) => {
    return hasPermission(userRole, 'update');
};

/**
 * Check if user can manage users
 */
export const canManageUsers = (userRole) => {
    return hasPermission(userRole, 'manage_users');
};

/**
 * Check if user can assign roles
 */
export const canAssignRoles = (userRole) => {
    return hasPermission(userRole, 'assign_roles');
};

/**
 * Check if user is admin
 */
export const isAdmin = (userRole) => {
    return userRole?.toLowerCase() === ROLES.ADMIN;
};

/**
 * Check if user is at least editor
 */
export const isEditor = (userRole) => {
    const role = userRole?.toLowerCase();
    return role === ROLES.ADMIN || role === ROLES.EDITOR;
};

/**
 * Get role badge color class
 */
export const getRoleBadgeClass = (role) => {
    const roleInfo = ROLE_INFO[role?.toLowerCase()];
    if (!roleInfo) return 'bg-neutral-200 text-neutral-600';

    switch (roleInfo.color) {
        case 'danger': return 'bg-danger-focus text-danger-600 border-danger-main';
        case 'warning': return 'bg-warning-focus text-warning-600 border-warning-main';
        case 'info': return 'bg-info-focus text-info-600 border-info-main';
        default: return 'bg-neutral-200 text-neutral-600';
    }
};

export default {
    ROLES,
    ROLE_INFO,
    hasPermission,
    canDelete,
    canCreate,
    canUpdate,
    canManageUsers,
    canAssignRoles,
    isAdmin,
    isEditor,
    getRoleBadgeClass
};
