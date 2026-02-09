import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { seoScriptsAPI } from "../services/api"
import { Icon } from "@iconify/react/dist/iconify.js"

const SCRIPT_TYPE_LABELS = {
    head: 'Head',
    body_start: 'Body Start',
    body_end: 'Body End'
}

const SeoScriptsTable = () => {
    const navigate = useNavigate()
    const [scripts, setScripts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [toast, setToast] = useState({ show: false, type: "", message: "" })
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: "" })
    const [viewModal, setViewModal] = useState({ show: false, script: null })

    const showToast = (type, message) => {
        setToast({ show: true, type, message })
        setTimeout(() => setToast({ show: false, type: "", message: "" }), 4000)
    }

    useEffect(() => {
        fetchScripts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchScripts = async () => {
        setIsLoading(true)
        try {
            const response = await seoScriptsAPI.getAll()
            if (response.success) {
                setScripts(response.data || [])
            }
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleEnabled = async (script) => {
        try {
            const response = await seoScriptsAPI.update(script.id, {
                isEnabled: !script.isEnabled
            })
            if (response.success) {
                setScripts(prev =>
                    prev.map(s => s.id === script.id ? { ...s, isEnabled: !s.isEnabled } : s)
                )
                showToast("success", `Script ${!script.isEnabled ? 'enabled' : 'disabled'}`)
            }
        } catch (error) {
            showToast("error", error.message)
        }
    }

    const handleDelete = async () => {
        if (!deleteModal.id) return
        try {
            const response = await seoScriptsAPI.delete(deleteModal.id)
            if (response.success || response.status === 204) {
                setScripts(prev => prev.filter(s => s.id !== deleteModal.id))
                showToast("success", "Script deleted successfully")
            }
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setDeleteModal({ show: false, id: null, name: "" })
        }
    }

    if (isLoading) {
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
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">SEO Scripts</h5>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/seo-scripts-form')}
                >
                    <Icon icon="ic:baseline-plus" className="me-1" />
                    Add Script
                </button>
            </div>
            <div className="card-body">
                {scripts.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <Icon icon="mdi:script-text-outline" width="48" className="mb-3" />
                        <p>No SEO scripts found. Create your first script to get started.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Target</th>
                                    <th>Locales</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scripts.map(script => (
                                    <tr key={script.id}>
                                        <td>
                                            <strong>{script.name}</strong>
                                        </td>
                                        <td>
                                            <span className="badge" style={{ backgroundColor: '#5c6bc0', color: '#fff' }}>
                                                {SCRIPT_TYPE_LABELS[script.scriptType] || script.scriptType}
                                            </span>
                                        </td>
                                        <td>
                                            {script.targetType === 'global' ? (
                                                <span className="badge" style={{ backgroundColor: '#1a237e', color: '#fff' }}>Global</span>
                                            ) : (
                                                <span className="badge" style={{ backgroundColor: '#0288d1', color: '#fff' }}>
                                                    {script.routes?.length || 0} routes
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {script.locales?.length > 0 ? (
                                                script.locales.map(l => (
                                                    <span key={l} className="badge me-1" style={{ backgroundColor: '#607d8b', color: '#fff' }}>{l.toUpperCase()}</span>
                                                ))
                                            ) : (
                                                <span style={{ color: '#455a64', fontWeight: '500' }}>All</span>
                                            )}
                                        </td>
                                        <td><strong>{script.priority}</strong></td>
                                        <td>
                                            <div
                                                onClick={() => handleToggleEnabled(script)}
                                                style={{
                                                    width: '44px',
                                                    height: '24px',
                                                    borderRadius: '12px',
                                                    backgroundColor: script.isEnabled ? '#1a237e' : '#6c757d',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.3s ease'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#fff',
                                                        position: 'absolute',
                                                        top: '2px',
                                                        left: script.isEnabled ? '22px' : '2px',
                                                        transition: 'left 0.3s ease',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-info"
                                                    onClick={() => setViewModal({ show: true, script })}
                                                    title="View"
                                                >
                                                    <Icon icon="mdi:eye" />
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => navigate(`/seo-scripts-form?id=${script.id}`)}
                                                    title="Edit"
                                                >
                                                    <Icon icon="mdi:pencil" />
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => setDeleteModal({ show: true, id: script.id, name: script.name })}
                                                    title="Delete"
                                                >
                                                    <Icon icon="mdi:trash" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Script Modal */}
            {viewModal.show && viewModal.script && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: '#fff',
                                borderBottom: 'none'
                            }}>
                                <h5 className="modal-title d-flex align-items-center" style={{ color: '#fff', fontWeight: '600' }}>
                                    <Icon icon="mdi:script-text-outline" width="24" height="24" className="me-2" style={{ flexShrink: 0 }} />
                                    <span>{viewModal.script.name}</span>
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setViewModal({ show: false, script: null })}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="text-muted small">Script Type</label>
                                        <p className="mb-2 fw-medium">
                                            <span className="badge" style={{ backgroundColor: '#5c6bc0', color: '#fff' }}>
                                                {SCRIPT_TYPE_LABELS[viewModal.script.scriptType] || viewModal.script.scriptType}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Status</label>
                                        <p className="mb-2">
                                            <span className={`badge ${viewModal.script.isEnabled ? 'bg-success' : 'bg-secondary'}`}>
                                                {viewModal.script.isEnabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Target</label>
                                        <p className="mb-2">
                                            <span className="badge" style={{ backgroundColor: viewModal.script.targetType === 'global' ? '#1a237e' : '#0288d1', color: '#fff' }}>
                                                {viewModal.script.targetType === 'global' ? 'Global' : 'Specific Routes'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Priority</label>
                                        <p className="mb-2 fw-bold">{viewModal.script.priority}</p>
                                    </div>
                                    {viewModal.script.targetType === 'specific' && viewModal.script.routes?.length > 0 && (
                                        <div className="col-12">
                                            <label className="text-muted small">Routes</label>
                                            <div className="bg-light p-2 rounded" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                                                {viewModal.script.routes.map((route, idx) => (
                                                    <div key={idx}>{route}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-12">
                                        <label className="text-muted small">Locales</label>
                                        <p className="mb-2">
                                            {viewModal.script.locales?.length > 0 ? (
                                                viewModal.script.locales.map(l => (
                                                    <span key={l} className="badge me-1" style={{ backgroundColor: '#607d8b', color: '#fff' }}>{l.toUpperCase()}</span>
                                                ))
                                            ) : (
                                                <span className="text-muted">All locales</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="col-12">
                                        <label className="text-muted small">Script Content</label>
                                        <pre
                                            className="bg-dark text-light p-3 rounded"
                                            style={{
                                                fontSize: '12px',
                                                maxHeight: '250px',
                                                overflow: 'auto',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-all'
                                            }}
                                        >
                                            {viewModal.script.content}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setViewModal({ show: false, script: null })}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setViewModal({ show: false, script: null })
                                        navigate(`/seo-scripts-form?id=${viewModal.script.id}`)
                                    }}
                                >
                                    <Icon icon="mdi:pencil" className="me-1" />
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setDeleteModal({ show: false, id: null, name: "" })}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the script <strong>"{deleteModal.name}"</strong>?</p>
                                <p className="text-muted mb-0">This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setDeleteModal({ show: false, id: null, name: "" })}
                                >
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

export default SeoScriptsTable
