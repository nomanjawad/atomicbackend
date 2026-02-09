import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, userAPI } from '../services/api';

const ViewProfileLayer = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        language: 'English',
        bio: ''
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    // Load user data on mount
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
                department: user.department || '',
                designation: user.designation || '',
                language: user.language || 'English',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        if (!user?.id) return;

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authAPI.updateProfile({
                full_name: formData.fullName
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await userAPI.update(user.id, {
                password: passwordData.newPassword
            });

            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to change password' });
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="row gy-4">
            <div className="col-lg-4">
                <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                    <div className="bg-primary-600" style={{ height: '120px' }}></div>
                    <div className="pb-24 ms-16 mb-24 me-16 mt--100">
                        <div className="text-center border border-top-0 border-start-0 border-end-0">
                            {user?.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt="User Avatar"
                                    className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover"
                                />
                            ) : (
                                <div className="border br-white border-width-2-px w-200-px h-200-px rounded-circle bg-primary-100 d-flex justify-content-center align-items-center mx-auto" style={{ fontSize: '64px' }}>
                                    <span className="text-primary-600 fw-bold">{getInitials(user?.full_name)}</span>
                                </div>
                            )}
                            <h6 className="mb-0 mt-16">{user?.full_name || 'User'}</h6>
                            <span className="text-secondary-light mb-16">{user?.email || ''}</span>
                        </div>
                        <div className="mt-24">
                            <h6 className="text-xl mb-16">Personal Info</h6>
                            <ul>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">Full Name</span>
                                    <span className="w-70 text-secondary-light fw-medium">: {user?.full_name || 'Not set'}</span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">Email</span>
                                    <span className="w-70 text-secondary-light fw-medium">: {user?.email || 'Not set'}</span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">Role</span>
                                    <span className="w-70 text-secondary-light fw-medium">: {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-8">
                <div className="card h-100">
                    <div className="card-body p-24">
                        {message.text && (
                            <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-16`}>
                                {message.text}
                            </div>
                        )}

                        <ul
                            className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24 active"
                                    id="pills-edit-profile-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-edit-profile"
                                    type="button"
                                    role="tab"
                                >
                                    Edit Profile
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24"
                                    id="pills-change-passwork-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-change-passwork"
                                    type="button"
                                    role="tab"
                                >
                                    Change Password
                                </button>
                            </li>
                        </ul>

                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-edit-profile"
                                role="tabpanel"
                            >
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="mb-20">
                                            <label htmlFor="fullName" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                Full Name <span className="text-danger-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control radius-8"
                                                id="fullName"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="Enter Full Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="mb-20">
                                            <label htmlFor="email" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                Email <span className="text-danger-600">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control radius-8"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                disabled
                                                placeholder="Email (cannot be changed)"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-center gap-3 mt-16">
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                        className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="pills-change-passwork" role="tabpanel">
                                <div className="mb-20">
                                    <label htmlFor="newPassword" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                        New Password <span className="text-danger-600">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            className="form-control radius-8"
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter New Password"
                                        />
                                        <span
                                            className={`toggle-password ${passwordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                        ></span>
                                    </div>
                                </div>
                                <div className="mb-20">
                                    <label htmlFor="confirmPassword" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                        Confirm Password <span className="text-danger-600">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={confirmPasswordVisible ? "text" : "password"}
                                            className="form-control radius-8"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirm Password"
                                        />
                                        <span
                                            className={`toggle-password ${confirmPasswordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                        ></span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-center gap-3 mt-16">
                                    <button
                                        type="button"
                                        onClick={handleChangePassword}
                                        disabled={isLoading}
                                        className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                    >
                                        {isLoading ? 'Updating...' : 'Change Password'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfileLayer;