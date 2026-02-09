import React, { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import { blogPostsAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { canDelete, canUpdate } from "../utils/permissions"

const BlogPostTable = () => {
  const { user } = useAuth()
  const [blogPosts, setBlogPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const navigate = useNavigate()

  // Role-based permissions
  const userCanDelete = canDelete(user?.role)
  const userCanUpdate = canUpdate(user?.role)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    setIsLoading(true)
    try {
      const response = await blogPostsAPI.getAll()
      if (response.success) {
        setBlogPosts(response.data || [])
      } else {
        setMessage({ type: "error", text: "Failed to fetch blog posts" })
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to fetch blog posts" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (id) => navigate(`/blog-post-form?id=${id}`)

  const handleDelete = async (id) => {
    if (!userCanDelete) {
      setMessage({ type: "error", text: "You don't have permission to delete posts" })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      return
    }
    if (!window.confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await blogPostsAPI.delete(id)
      if (response.success) {
        setMessage({ type: "success", text: "Blog post deleted successfully" })
        setBlogPosts(prev => prev.filter(post => post.id !== id))
      } else {
        setMessage({ type: "error", text: "Failed to delete blog post" })
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to delete blog post" })
    }
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

  const handleView = (item) => { setSelectedItem(item); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setSelectedItem(null) }
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  const getStatusBadge = (status) => {
    switch (status) {
      case "published": return <span className="badge bg-success">Published</span>
      case "draft": return <span className="badge bg-warning">Draft</span>
      case "archived": return <span className="badge bg-secondary">Archived</span>
      default: return <span className="badge bg-light text-dark">{status}</span>
    }
  }

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="card">
          <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Blog Posts</h5>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/blog-post-form")}>
            <Icon icon="heroicons:plus" className="me-1" />Add New
          </button>
        </div>
        <div className="card-body">
          {message.text && <div className={`alert alert-${message.type === "success" ? "success" : "danger"} mb-3`}>{message.text}</div>}

          {blogPosts.length === 0 ? (
            <div className="text-center py-5">
              <Icon icon="heroicons:document-text" className="text-secondary" style={{ fontSize: "48px" }} />
              <p className="text-secondary mt-3 mb-0">No blog posts found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr><th>Title</th><th>Status</th><th>Tags</th><th>Author</th><th>Created At</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {blogPosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <div className="fw-semibold">{post.title}</div>
                        <small className="text-muted">{post.content?.substring(0, 50)}...</small>
                      </td>
                      <td>{getStatusBadge(post.status)}</td>
                      <td>{post.tags?.length > 0 ? post.tags.slice(0, 2).map((tag, i) => <span key={i} className="badge bg-secondary me-1">{tag}</span>) : <span className="text-muted">No tags</span>}</td>
                      <td>{post.author?.name || <span className="text-muted">No author</span>}</td>
                      <td><small className="text-muted">{formatDate(post.createdAt)}</small></td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-info" onClick={() => handleView(post)} title="View"><Icon icon="heroicons:eye" /></button>
                          {userCanUpdate && (
                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(post.id)} title="Edit"><Icon icon="heroicons:pencil" /></button>
                          )}
                          {userCanDelete && (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(post.id)} title="Delete"><Icon icon="heroicons:trash" /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedItem && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedItem.title}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {/* Featured Image */}
                {selectedItem.featuredImage && (
                  <div className="mb-4 text-center">
                    <img
                      src={selectedItem.featuredImage}
                      alt={selectedItem.title}
                      className="img-fluid rounded"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                  </div>
                )}

                {/* Meta Info Row */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Status</label>
                      <div>{getStatusBadge(selectedItem.status)}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Author</label>
                      <div className="fw-medium">{selectedItem.author?.name || <span className="text-muted">No author</span>}</div>
                    </div>
                  </div>
                </div>

                {/* Date Info Row */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Created At</label>
                      <div className="text-secondary">{formatDate(selectedItem.createdAt)}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-muted small mb-1">Updated At</label>
                      <div className="text-secondary">{selectedItem.updatedAt ? formatDate(selectedItem.updatedAt) : <span className="text-muted">N/A</span>}</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <label className="form-label text-muted small mb-2">Tags</label>
                  <div>
                    {selectedItem.tags?.length > 0 ? (
                      selectedItem.tags.map((tag, idx) => (
                        <span key={idx} className="badge bg-secondary me-2 mb-1">{tag}</span>
                      ))
                    ) : (
                      <span className="text-muted">No tags</span>
                    )}
                  </div>
                </div>

                {/* Excerpt */}
                {selectedItem.excerpt && (
                  <div className="mb-4">
                    <label className="form-label text-muted small mb-2">Excerpt</label>
                    <p className="text-secondary fst-italic">{selectedItem.excerpt}</p>
                  </div>
                )}

                {/* Content */}
                <div className="mb-3">
                  <label className="form-label text-muted small mb-2">Content</label>
                  <div className="bg-light p-3 rounded" style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <div dangerouslySetInnerHTML={{ __html: selectedItem.content || '<span class="text-muted">No content</span>' }} />
                  </div>
                </div>

                {/* Slug */}
                {selectedItem.slug && (
                  <div className="mb-3">
                    <label className="form-label text-muted small mb-1">Slug</label>
                    <div className="font-monospace text-primary">{selectedItem.slug}</div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                <button className="btn btn-primary" onClick={() => handleEdit(selectedItem.id)}>Edit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogPostTable
