import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const AddUserLayer = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'editor'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.email || !formData.password) {
            setMessage({ type: 'error', text: 'Please fill in all required fields' });
            return;
        }

        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authAPI.signup(formData.email, formData.password, formData.fullName, formData.role);

            setMessage({ type: 'success', text: 'User created successfully!' });
            // Redirect after short delay
            setTimeout(() => {
                navigate('/users-list');
            }, 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to create user' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/users-list');
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-body p-24">
                <div className="row justify-content-center">
                    <div className="col-xxl-6 col-xl-8 col-lg-10">
                        <div className="card border">
                            <div className="card-body">
                                <h5 className="mb-24">Add New User</h5>

                                {message.text && (
                                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-20`}>
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-20">
                                        <label
                                            htmlFor="fullName"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
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
                                            required
                                        />
                                    </div>

                                    <div className="mb-20">
                                        <label
                                            htmlFor="email"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Email <span className="text-danger-600">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control radius-8"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter email address"
                                            required
                                        />
                                    </div>

                                    <div className="mb-20">
                                        <label
                                            htmlFor="password"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Password <span className="text-danger-600">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={passwordVisible ? "text" : "password"}
                                                className="form-control radius-8"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Enter password (min 6 characters)"
                                                required
                                                minLength={6}
                                            />
                                            <span
                                                className={`toggle-password ${passwordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                                onClick={() => setPasswordVisible(!passwordVisible)}
                                            ></span>
                                        </div>
                                    </div>

                                    <div className="mb-20">
                                        <label
                                            htmlFor="role"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Role <span className="text-danger-600">*</span>
                                        </label>
                                        <select
                                            className="form-control radius-8 form-select"
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="editor">Editor</option>
                                            <option value="viewer">Viewer</option>
                                        </select>
                                        <small className="text-secondary-light">
                                            Admin: Full access | Editor: Can edit, no delete | Viewer: Read-only
                                        </small>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="btn btn-primary border border-primary-600 text-md px-40 py-12 radius-8"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-8" role="status" aria-hidden="true"></span>
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create User'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUserLayer;