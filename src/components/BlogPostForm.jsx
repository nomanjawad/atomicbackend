import React, { useState, useEffect, useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { blogPostsAPI } from "../services/api"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const BlogPostForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')
  const isEditMode = !!editId

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [toast, setToast] = useState({ show: false, type: "", message: "" })

  const [formData, setFormData] = useState({
    title: "", slug: "", tags: "", content: "", status: "draft",
    metadata: { title: "", description: "", keywords: "", ogImage: "" },
    author: { name: "", bio: "", avatar: "" },
  })

  // Show toast notification
  const showToast = (type, message) => {
    setToast({ show: true, type, message })
    // Auto hide after 4 seconds
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 4000)
  }

  // Rich text editor toolbar configuration
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), [])

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ]

  useEffect(() => { if (editId) fetchData() }, [editId])

  const fetchData = async () => {
    setIsFetching(true)
    try {
      const response = await blogPostsAPI.getById(editId)
      if (response.success && response.data) {
        const d = response.data
        setFormData({
          title: d.title || "", slug: d.slug || "", content: d.content || "", status: d.status || "draft",
          tags: Array.isArray(d.tags) ? d.tags.join(", ") : "",
          metadata: d.metadata || { title: "", description: "", keywords: "", ogImage: "" },
          author: d.author || { name: "", bio: "", avatar: "" },
        })
      }
    } catch (error) { showToast("error", error.message) }
    finally { setIsFetching(false) }
  }

  const handleChange = (section, field, value) => {
    if (section === "root") setFormData(prev => ({ ...prev, [field]: value }))
    else setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
  }

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const payload = { ...formData, tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean) }
      const response = isEditMode ? await blogPostsAPI.update(editId, payload) : await blogPostsAPI.create(payload)
      if (response.success) {
        showToast("success", `Blog post ${isEditMode ? 'updated' : 'created'} successfully!`)
        setTimeout(() => navigate('/blog-post-table'), 2000)
      } else {
        showToast("error", response.error?.message || "Failed to save blog post")
      }
    } catch (error) {
      showToast("error", error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) return <div className="card"><div className="card-body d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div></div>

  return (
    <div className="card">
      <div className="card-header"><h5 className="card-title mb-0">{isEditMode ? 'Edit' : 'Create'} Blog Post</h5></div>
      <div className="card-body">

        <form onSubmit={handleSubmit} className="row gy-4">
          <div className="col-12"><h6 className="text-primary mb-3">Basic Information</h6></div>
          <div className="col-md-6"><label className="form-label">Title *</label><input type="text" className="form-control" value={formData.title} onChange={(e) => handleChange("root", "title", e.target.value)} required /></div>
          <div className="col-md-6"><label className="form-label">Slug *</label><input type="text" className="form-control" value={formData.slug} onChange={(e) => handleChange("root", "slug", e.target.value)} required /></div>
          <div className="col-md-6"><label className="form-label">Tags</label><input type="text" className="form-control" value={formData.tags} onChange={(e) => handleChange("root", "tags", e.target.value)} placeholder="tag1, tag2" /></div>
          <div className="col-md-6"><label className="form-label">Status</label>
            <select className="form-select" value={formData.status} onChange={(e) => handleChange("root", "status", e.target.value)}>
              <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
          </div>

          {/* Rich Text Editor for Content */}
          <div className="col-12">
            <label className="form-label">Content</label>
            <div className="rich-text-editor-wrapper" style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write your blog content here..."
                style={{ minHeight: '300px' }}
              />
            </div>
            <small className="text-muted mt-2 d-block">
              Use the toolbar to format text, add headers, images, links, lists, and more.
            </small>
          </div>

          <div className="col-12"><h6 className="text-primary mb-3">Author Information</h6></div>
          <div className="col-md-4"><label className="form-label">Author Name</label><input type="text" className="form-control" value={formData.author.name} onChange={(e) => handleChange("author", "name", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Author Bio</label><input type="text" className="form-control" value={formData.author.bio} onChange={(e) => handleChange("author", "bio", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Avatar URL</label><input type="text" className="form-control" value={formData.author.avatar} onChange={(e) => handleChange("author", "avatar", e.target.value)} /></div>

          <div className="col-12"><h6 className="text-primary mb-3">SEO Metadata</h6></div>
          <div className="col-md-6"><label className="form-label">Meta Title</label><input type="text" className="form-control" value={formData.metadata.title} onChange={(e) => handleChange("metadata", "title", e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">OG Image URL</label><input type="text" className="form-control" value={formData.metadata.ogImage} onChange={(e) => handleChange("metadata", "ogImage", e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Meta Description</label><textarea className="form-control" rows="2" value={formData.metadata.description} onChange={(e) => handleChange("metadata", "description", e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Keywords</label><input type="text" className="form-control" value={formData.metadata.keywords} onChange={(e) => handleChange("metadata", "keywords", e.target.value)} /></div>

          <div className="col-12 d-flex justify-content-end gap-3">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/blog-post-table')} disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : (isEditMode ? "Update" : "Create")}</button>
          </div>
        </form>
      </div>

      {/* Custom styles for the rich text editor */}
      <style>{`
        .rich-text-editor-wrapper .ql-container {
          min-height: 250px;
          font-size: 16px;
        }
        .rich-text-editor-wrapper .ql-editor {
          min-height: 250px;
        }
        .rich-text-editor-wrapper .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background: #f8f9fa;
        }
        .rich-text-editor-wrapper .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          font-style: normal;
          color: #adb5bd;
        }
        
        /* Toast notification styles */
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          min-width: 300px;
          max-width: 450px;
          padding: 16px 20px;
          border-radius: 10px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 9999;
          animation: slideInRight 0.3s ease-out;
        }
        .toast-notification.toast-success {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
        }
        .toast-notification.toast-error {
          background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
          color: white;
        }
        .toast-notification .toast-icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        .toast-notification .toast-message {
          flex: 1;
          font-weight: 500;
        }
        .toast-notification .toast-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .toast-notification .toast-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === "success" ? "✓" : "✕"}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => setToast({ show: false, type: "", message: "" })}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default BlogPostForm

