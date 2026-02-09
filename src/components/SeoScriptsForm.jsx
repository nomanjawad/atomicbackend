import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { seoScriptsAPI } from "../services/api"

const SCRIPT_TYPES = [
    { value: 'head', label: 'Head (inside <head>)' },
    { value: 'body_start', label: 'Body Start (after <body>)' },
    { value: 'body_end', label: 'Body End (before </body>)' }
]

const LOCALES = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' },
    { value: 'ru', label: 'Russian' }
]

const AVAILABLE_ROUTES = [
    { value: '/', label: 'Home' },
    { value: '/about-us', label: 'About Us' },
    { value: '/blog', label: 'Blog' },
    { value: '/contact-us', label: 'Contact Us' },
    { value: '/csr', label: 'CSR' },
    { value: '/gallery', label: 'Gallery' },
    { value: '/industry', label: 'Industry' },
    { value: '/privacy-policy', label: 'Privacy Policy' },
    { value: '/services', label: 'Services' },
    { value: '/success-stories', label: 'Success Stories' },
    { value: '/terms-condition', label: 'Terms & Condition' },
    { value: '/training-programs', label: 'Training Programs' }
]

const SeoScriptsForm = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const editId = searchParams.get('id')
    const isEditMode = !!editId

    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [toast, setToast] = useState({ show: false, type: "", message: "" })

    const [formData, setFormData] = useState({
        name: "",
        scriptType: "head",
        content: "",
        isEnabled: true,
        priority: 0,
        targetType: "global",
        routes: [],
        locales: []
    })

    const showToast = (type, message) => {
        setToast({ show: true, type, message })
        setTimeout(() => setToast({ show: false, type: "", message: "" }), 4000)
    }

    useEffect(() => {
        if (editId) fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editId])

    const fetchData = async () => {
        setIsFetching(true)
        try {
            const response = await seoScriptsAPI.getById(editId)
            if (response.success && response.data) {
                const d = response.data
                setFormData({
                    name: d.name || "",
                    scriptType: d.scriptType || "head",
                    content: d.content || "",
                    isEnabled: d.isEnabled !== undefined ? d.isEnabled : true,
                    priority: d.priority || 0,
                    targetType: d.targetType || "global",
                    routes: Array.isArray(d.routes) ? d.routes : [],
                    locales: d.locales || []
                })
            }
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setIsFetching(false)
        }
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleLocaleToggle = (locale) => {
        setFormData(prev => ({
            ...prev,
            locales: prev.locales.includes(locale)
                ? prev.locales.filter(l => l !== locale)
                : [...prev.locales, locale]
        }))
    }

    const handleRouteToggle = (route) => {
        setFormData(prev => ({
            ...prev,
            routes: prev.routes.includes(route)
                ? prev.routes.filter(r => r !== route)
                : [...prev.routes, route]
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const payload = {
                ...formData
            }

            const response = isEditMode
                ? await seoScriptsAPI.update(editId, payload)
                : await seoScriptsAPI.create(payload)

            if (response.success) {
                showToast("success", `SEO Script ${isEditMode ? 'updated' : 'created'} successfully!`)
                setTimeout(() => navigate('/seo-scripts-table'), 2000)
            } else {
                showToast("error", response.error?.message || "Failed to save SEO script")
            }
        } catch (error) {
            showToast("error", error.message || "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="card">
                <div className="card-body d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">{isEditMode ? 'Edit' : 'Create'} SEO Script</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="row gy-4">
                    {/* Basic Info */}
                    <div className="col-12">
                        <h6 className="text-primary mb-3">Basic Information</h6>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Script Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="e.g., Google Analytics"
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Script Type *</label>
                        <select
                            className="form-select"
                            value={formData.scriptType}
                            onChange={(e) => handleChange("scriptType", e.target.value)}
                        >
                            {SCRIPT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Priority</label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.priority}
                            onChange={(e) => handleChange("priority", parseInt(e.target.value) || 0)}
                            min="0"
                        />
                        <small className="text-muted">Higher priority scripts load first</small>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <div className="d-flex align-items-center gap-3 mt-2">
                            <div
                                className={`custom-toggle ${formData.isEnabled ? 'active' : ''}`}
                                onClick={() => handleChange("isEnabled", !formData.isEnabled)}
                                style={{
                                    width: '50px',
                                    height: '26px',
                                    borderRadius: '13px',
                                    backgroundColor: formData.isEnabled ? '#1a237e' : '#6c757d',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                <div
                                    style={{
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '50%',
                                        backgroundColor: '#fff',
                                        position: 'absolute',
                                        top: '2px',
                                        left: formData.isEnabled ? '26px' : '2px',
                                        transition: 'left 0.3s ease',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}
                                />
                            </div>
                            <span className={formData.isEnabled ? 'text-primary fw-medium' : 'text-muted'}>
                                {formData.isEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>

                    <div className="col-12">
                        <label className="form-label">Script Content *</label>
                        <textarea
                            className="form-control font-monospace"
                            rows="8"
                            value={formData.content}
                            onChange={(e) => handleChange("content", e.target.value)}
                            placeholder="<script>...</script>"
                            required
                            style={{ fontSize: '13px' }}
                        />
                    </div>

                    {/* Route Targeting */}
                    <div className="col-12 mt-4">
                        <h6 className="text-primary mb-3">Route Targeting</h6>
                    </div>

                    <div className="col-12">
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="targetGlobal"
                                checked={formData.targetType === "global"}
                                onChange={() => handleChange("targetType", "global")}
                            />
                            <label className="form-check-label" htmlFor="targetGlobal">
                                All Pages (Global)
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="targetSpecific"
                                checked={formData.targetType === "specific"}
                                onChange={() => handleChange("targetType", "specific")}
                            />
                            <label className="form-check-label" htmlFor="targetSpecific">
                                Specific Routes
                            </label>
                        </div>
                    </div>

                    {formData.targetType === "specific" && (
                        <div className="col-12">
                            <label className="form-label">Select Routes</label>
                            <select
                                className="form-select"
                                value=""
                                onChange={(e) => {
                                    if (e.target.value && !formData.routes.includes(e.target.value)) {
                                        handleChange("routes", [...formData.routes, e.target.value])
                                    }
                                }}
                            >
                                <option value="">-- Select a route to add --</option>
                                {AVAILABLE_ROUTES.filter(r => !formData.routes.includes(r.value)).map(route => (
                                    <option key={route.value} value={route.value}>
                                        {route.label} ({route.value})
                                    </option>
                                ))}
                            </select>

                            {formData.routes.length > 0 && (
                                <div className="mt-2 d-flex flex-wrap gap-2">
                                    {formData.routes.map(route => {
                                        const routeInfo = AVAILABLE_ROUTES.find(r => r.value === route)
                                        return (
                                            <span
                                                key={route}
                                                className="badge d-flex align-items-center gap-1"
                                                style={{ backgroundColor: '#1a237e', color: '#fff', fontSize: '13px', padding: '8px 12px' }}
                                            >
                                                {routeInfo?.label || route}
                                                <button
                                                    type="button"
                                                    className="btn-close btn-close-white ms-1"
                                                    style={{ fontSize: '8px' }}
                                                    onClick={() => handleChange("routes", formData.routes.filter(r => r !== route))}
                                                ></button>
                                            </span>
                                        )
                                    })}
                                </div>
                            )}

                            <small className="text-muted mt-1 d-block">
                                Selected: {formData.routes.length} route(s)
                            </small>
                        </div>
                    )}

                    {/* Locale Targeting */}
                    <div className="col-12 mt-4">
                        <h6 className="text-primary mb-3">Locale Targeting</h6>
                        <small className="text-muted d-block mb-3">
                            Leave all unchecked to apply to all locales
                        </small>
                    </div>

                    <div className="col-12">
                        {LOCALES.map(locale => (
                            <div className="form-check form-check-inline" key={locale.value}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`locale-${locale.value}`}
                                    checked={formData.locales.includes(locale.value)}
                                    onChange={() => handleLocaleToggle(locale.value)}
                                />
                                <label className="form-check-label" htmlFor={`locale-${locale.value}`}>
                                    {locale.label}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="col-12 d-flex justify-content-end gap-3 mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/seo-scripts-table')}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? "Saving..." : (isEditMode ? "Update" : "Create")}
                        </button>
                    </div>
                </form>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast-notification toast-${toast.type}`}>
                    <span className="toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
                    <span className="toast-message">{toast.message}</span>
                    <button
                        className="toast-close"
                        onClick={() => setToast({ show: false, type: "", message: "" })}
                    >
                        ×
                    </button>
                </div>
            )}

            <style>{`
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          min-width: 300px;
          padding: 16px 20px;
          border-radius: 10px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 9999;
          animation: slideInRight 0.3s ease-out;
        }
        .toast-success { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; }
        .toast-error { background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%); color: white; }
        .toast-icon { font-size: 24px; }
        .toast-message { flex: 1; font-weight: 500; }
        .toast-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </div>
    )
}

export default SeoScriptsForm
