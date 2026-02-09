import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { canDelete, canManageUsers, ROLE_INFO } from '../utils/permissions';

const UsersListLayer = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editData, setEditData] = useState({
        full_name: '',
        role: 'user',
        is_active: true
    });
    const [isSaving, setIsSaving] = useState(false);

    // Check permissions
    const userCanDelete = canDelete(currentUser?.role);
    const userCanManageUsers = canManageUsers(currentUser?.role);

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

    const handleDeleteUser = async (userId) => {
        if (!userCanDelete) {
            alert('You do not have permission to delete users.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await userAPI.delete(userId);
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            alert(err.message || 'Failed to delete user');
        }
    };

    const handleEditUser = (userToEdit) => {
        if (!userCanManageUsers) {
            alert('You do not have permission to update users.');
            return;
        }
        setEditingUser(userToEdit);
        setEditData({
            full_name: userToEdit.full_name || '',
            role: userToEdit.role || 'user',
            is_active: userToEdit.is_active !== false
        });
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveUser = async () => {
        if (!editingUser || !userCanManageUsers) return;
        setIsSaving(true);
        try {
            await userAPI.update(editingUser.id, {
                full_name: editData.full_name,
                role: editData.role,
                is_active: editData.is_active
            });
            setUsers(users.map(u =>
                u.id === editingUser.id
                    ? { ...u, full_name: editData.full_name, role: editData.role, is_active: editData.is_active }
                    : u
            ));
            setEditingUser(null);
        } catch (err) {
            alert(err.message || 'Failed to update user');
        } finally {
            setIsSaving(false);
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

    const filteredUsers = users.filter(user => {
        const matchesSearch = !searchTerm ||
            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !selectedStatus ||
            (selectedStatus === 'Active' && user.is_active) ||
            (selectedStatus === 'Inactive' && !user.is_active);
        return matchesSearch && matchesStatus;
    });

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
                    <button
                        className="btn btn-primary mt-16"
                        onClick={fetchUsers}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <form className="navbar-search">
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <Link
                    to="/add-user"
                    className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                >
                    <Icon
                        icon="ic:baseline-plus"
                        className="icon text-xl line-height-1"
                    />
                    Add New User
                </Link>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">S.L</th>
                                <th scope="col">Join Date</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Role</th>
                                <th scope="col" className="text-center">Status</th>
                                <th scope="col" className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-16">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{String(index + 1).padStart(2, '0')}</td>
                                        <td>{formatDate(user.created_at)}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {user.avatar_url ? (
                                                    <img
                                                        src={user.avatar_url}
                                                        alt={user.full_name}
                                                        className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                                    />
                                                ) : (
                                                    <span className="w-40-px h-40-px bg-primary-100 text-primary-600 rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 me-12 fw-semibold">
                                                        {getInitials(user.full_name)}
                                                    </span>
                                                )}
                                                <div className="flex-grow-1">
                                                    <span className="text-md mb-0 fw-normal text-secondary-light">
                                                        {user.full_name || 'No Name'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                {user.email}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className={`px-24 py-4 radius-4 fw-medium text-sm ${user.is_active !== false
                                                ? 'bg-success-focus text-success-600 border border-success-main'
                                                : 'bg-neutral-200 text-neutral-600 border border-neutral-400'
                                                }`}>
                                                {user.is_active !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex align-items-center gap-10 justify-content-center">
                                                <Link
                                                    to={`/view-profile?id=${user.id}`}
                                                    className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                >
                                                    <Icon
                                                        icon="majesticons:eye-line"
                                                        className="icon text-xl"
                                                    />
                                                </Link>
                                                {userCanManageUsers && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditUser(user)}
                                                        className="bg-primary-focus bg-hover-primary-200 text-primary-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                        title="Edit user"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editUserModal"
                                                    >
                                                        <Icon
                                                            icon="mdi:pencil"
                                                            className="menu-icon"
                                                        />
                                                    </button>
                                                )}
                                                {userCanDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                        title="Delete user"
                                                    >
                                                        <Icon
                                                            icon="fluent:delete-24-regular"
                                                            className="menu-icon"
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length > 0 && (
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                        <span>Showing {filteredUsers.length} of {users.length} entries</span>
                    </div>
                )}
            </div>
            {/* Edit User Modal */}
            <div
                className="modal fade"
                id="editUserModal"
                tabIndex={-1}
                aria-labelledby="editUserModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="editUserModalLabel">
                                <Icon icon="mdi:pencil" className="me-8" />
                                Edit User
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
                                    <div className="mb-16">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            name="full_name"
                                            value={editData.full_name}
                                            onChange={handleEditChange}
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div className="mb-16">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Role
                                        </label>
                                        <select
                                            className="form-select radius-8"
                                            name="role"
                                            value={editData.role}
                                            onChange={handleEditChange}
                                        >
                                            {Object.keys(ROLE_INFO).map((roleKey) => (
                                                <option key={roleKey} value={roleKey}>
                                                    {ROLE_INFO[roleKey].name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-20 d-flex align-items-center gap-10">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="editUserActive"
                                            name="is_active"
                                            checked={editData.is_active}
                                            onChange={handleEditChange}
                                        />
                                        <label className="form-check-label" htmlFor="editUserActive">
                                            Active
                                        </label>
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
                                            onClick={handleSaveUser}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersListLayer;
