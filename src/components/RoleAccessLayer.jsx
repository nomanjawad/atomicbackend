import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { ROLE_INFO, getRoleBadgeClass, isAdmin, canDelete } from '../utils/permissions';

const RoleAccessLayer = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');

    const currentUserIsAdmin = isAdmin(user?.role);
    const currentUserCanDelete = canDelete(user?.role);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await userAPI.getAll();
            setUsers(response.users || []);
        } catch (err) {
            setError(err.message || 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditRole = (userToEdit) => {
        setEditingUser(userToEdit);
        setSelectedRole(userToEdit.role || 'user');
    };

    const handleSaveRole = async () => {
        if (!editingUser || !currentUserIsAdmin) return;

        try {
            await userAPI.update(editingUser.id, {
                role: selectedRole
            });

            setUsers(users.map(u =>
                u.id === editingUser.id ? { ...u, role: selectedRole } : u
            ));
            setMessage({ type: 'success', text: `Role updated to ${selectedRole} successfully!` });
            setEditingUser(null);

            // Clear message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update role' });
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        if (!currentUserIsAdmin) return;

        const newStatus = !currentStatus;

        try {
            await userAPI.update(userId, {
                is_active: newStatus
            });

            setUsers(users.map(u =>
                u.id === userId ? { ...u, is_active: newStatus } : u
            ));
            setMessage({ type: 'success', text: `User ${newStatus ? 'activated' : 'deactivated'} successfully!` });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update status' });
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!currentUserCanDelete) return;
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await userAPI.delete(userId);
            setUsers(users.filter(u => u.id !== userId));
            setMessage({ type: 'success', text: 'User deleted successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to delete user' });
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="card h-100 p-0 radius-12">
                <div className="card-body p-24 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-16">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card h-100 p-0 radius-12">
                <div className="card-body p-24 text-center">
                    <div className="text-danger mb-16">
                        <Icon icon="mdi:alert-circle" className="text-4xl" />
                    </div>
                    <p className="text-danger">{error}</p>
                    <button className="btn btn-primary mt-16" onClick={fetchUsers}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Role Legend Card */}
            <div className="card mb-24 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="mb-0">
                        <Icon icon="mdi:shield-account" className="me-8" />
                        Role Permissions Overview
                    </h6>
                </div>
                <div className="card-body p-24">
                    <div className="row g-3">
                        {Object.entries(ROLE_INFO).map(([key, info]) => (
                            <div key={key} className="col-md-4">
                                <div className={`p-16 radius-8 border ${key === 'admin' ? 'border-danger-main bg-danger-50' : key === 'moderator' ? 'border-warning-main bg-warning-50' : 'border-info-main bg-info-50'}`}>
                                    <div className="d-flex align-items-center gap-8 mb-8">
                                        <Icon
                                            icon={key === 'admin' ? 'mdi:shield-crown' : key === 'moderator' ? 'mdi:shield-account' : 'mdi:account'}
                                            className={`text-xl ${key === 'admin' ? 'text-danger-600' : key === 'moderator' ? 'text-warning-600' : 'text-info-600'}`}
                                        />
                                        <span className="fw-semibold">{info.name}</span>
                                    </div>
                                    <p className="text-sm text-secondary-light mb-8">{info.description}</p>
                                    <div className="d-flex flex-wrap gap-4">
                                        {info.permissions.map(perm => (
                                            <span key={perm} className="badge bg-neutral-200 text-neutral-600 text-xs">
                                                {perm.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <h6 className="mb-0">
                        <Icon icon="mdi:account-group" className="me-8" />
                        User Role Management
                    </h6>
                    <span className="text-sm text-secondary-light">
                        {users.length} users total
                    </span>
                </div>
                <div className="card-body p-24">
                    {message.text && (
                        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-16`}>
                            {message.text}
                        </div>
                    )}

                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table sm-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">S.L</th>
                                    <th scope="col">User</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Current Role</th>
                                    <th scope="col" className="text-center">Status</th>
                                    <th scope="col">Joined</th>
                                    <th scope="col" className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-16">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u, index) => (
                                        <tr key={u.id}>
                                            <td>{String(index + 1).padStart(2, '0')}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {u.avatar_url ? (
                                                        <img
                                                            src={u.avatar_url}
                                                            alt={u.full_name}
                                                            className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                                        />
                                                    ) : (
                                                        <span className="w-40-px h-40-px bg-primary-100 text-primary-600 rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 me-12 fw-semibold">
                                                            {getInitials(u.full_name)}
                                                        </span>
                                                    )}
                                                    <div className="flex-grow-1">
                                                        <span className="text-md fw-medium">
                                                            {u.full_name || 'No Name'}
                                                        </span>
                                                        {u.id === user?.id && (
                                                            <span className="badge bg-primary-100 text-primary-600 ms-8 text-xs">You</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-secondary-light">{u.email}</td>
                                            <td>
                                                <span className={`px-12 py-4 radius-4 fw-medium text-sm border ${getRoleBadgeClass(u.role)}`}>
                                                    {ROLE_INFO[u.role?.toLowerCase()]?.name || 'User'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                {u.id === user?.id ? (
                                                    <span className="text-secondary-light text-sm">—</span>
                                                ) : (
                                                    <div className="form-switch d-inline-block">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            id={`status-switch-${u.id}`}
                                                            checked={u.is_active !== false}
                                                            onChange={() => handleToggleStatus(u.id, u.is_active !== false)}
                                                            style={{
                                                                width: '40px',
                                                                height: '20px',
                                                                cursor: 'pointer',
                                                                backgroundColor: u.is_active !== false ? '#45b369' : '#dc3545',
                                                                borderColor: u.is_active !== false ? '#45b369' : '#dc3545'
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-secondary-light">{formatDate(u.created_at)}</td>
                                            <td className="text-center">
                                                {u.id === user?.id ? (
                                                    <span className="text-secondary-light text-sm">—</span>
                                                ) : (
                                                    <div className="d-flex align-items-center gap-10 justify-content-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditRole(u)}
                                                            className="bg-primary-focus text-primary-600 bg-hover-primary-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editRoleModal"
                                                            title="Change Role"
                                                        >
                                                            <Icon icon="mdi:account-edit" className="text-xl" />
                                                        </button>
                                                        {currentUserCanDelete && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteUser(u.id)}
                                                                className="bg-danger-focus text-danger-600 bg-hover-danger-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                                title="Delete user"
                                                            >
                                                                <Icon icon="fluent:delete-24-regular" className="text-xl" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Role Modal */}
            <div
                className="modal fade"
                id="editRoleModal"
                tabIndex={-1}
                aria-labelledby="editRoleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="editRoleModalLabel">
                                <Icon icon="mdi:account-edit" className="me-8" />
                                Change User Role
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            {editingUser && (
                                <>
                                    <div className="d-flex align-items-center gap-12 mb-20 p-16 bg-neutral-50 radius-8">
                                        {editingUser.avatar_url ? (
                                            <img
                                                src={editingUser.avatar_url}
                                                alt={editingUser.full_name}
                                                className="w-48-px h-48-px rounded-circle"
                                            />
                                        ) : (
                                            <span className="w-48-px h-48-px bg-primary-100 text-primary-600 rounded-circle d-flex justify-content-center align-items-center fw-semibold">
                                                {getInitials(editingUser.full_name)}
                                            </span>
                                        )}
                                        <div>
                                            <h6 className="mb-0">{editingUser.full_name}</h6>
                                            <span className="text-sm text-secondary-light">{editingUser.email}</span>
                                        </div>
                                    </div>

                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Select New Role
                                        </label>
                                        <div className="d-flex flex-column gap-12">
                                            {Object.entries(ROLE_INFO)
                                                .filter(([key]) => key !== 'admin')  // Admin cannot assign admin role
                                                .map(([key, info]) => (
                                                    <div
                                                        key={key}
                                                        className={`p-16 radius-8 border cursor-pointer ${selectedRole === key ? 'border-primary-600 bg-primary-50' : 'border-neutral-200 bg-base'}`}
                                                        onClick={() => setSelectedRole(key)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="d-flex align-items-center gap-12">
                                                            <input
                                                                type="radio"
                                                                name="role"
                                                                checked={selectedRole === key}
                                                                onChange={() => setSelectedRole(key)}
                                                                className="form-check-input"
                                                            />
                                                            <div className="flex-grow-1">
                                                                <div className="d-flex align-items-center gap-8">
                                                                    <Icon
                                                                        icon={key === 'admin' ? 'mdi:shield-crown' : key === 'moderator' ? 'mdi:shield-account' : 'mdi:account'}
                                                                        className={key === 'admin' ? 'text-danger-600' : key === 'moderator' ? 'text-warning-600' : 'text-info-600'}
                                                                    />
                                                                    <span className="fw-semibold">{info.name}</span>
                                                                </div>
                                                                <p className="text-xs text-secondary-light mb-0 mt-4">{info.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-end gap-3">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary px-20 py-10 radius-8"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary px-20 py-10 radius-8"
                                            data-bs-dismiss="modal"
                                            onClick={handleSaveRole}
                                        >
                                            <Icon icon="mdi:check" className="me-4" />
                                            Save Role
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoleAccessLayer;
