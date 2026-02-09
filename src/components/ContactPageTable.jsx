import React, { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import { contactPagesAPI } from "../services/api"

const ContactPageTable = () => {
  const [contactPages, setContactPages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchContactPages()
  }, [])

  const fetchContactPages = async () => {
    setIsLoading(true)
    try {
      const response = await contactPagesAPI.getAll()
      if (response.success) {
        setContactPages(response.data || [])
      } else {
        setMessage({ type: "error", text: "Failed to fetch contact pages" })
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to fetch contact pages" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (id) => navigate(`/contact-page-form?id=${id}`)

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact page?")) return

    try {
      const response = await contactPagesAPI.delete(id)
      if (response.success) {
        setMessage({ type: "success", text: "Contact page deleted successfully" })
        setContactPages(prev => prev.filter(page => page.id !== id))
      } else {
        setMessage({ type: "error", text: "Failed to delete contact page" })
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to delete contact page" })
    }
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

  const handleView = (item) => { setSelectedItem(item); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setSelectedItem(null) }
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

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
          <h5 className="card-title mb-0">Contact Pages</h5>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/contact-page-form")}>
            <Icon icon="heroicons:plus" className="me-1" />Add New
          </button>
        </div>
        <div className="card-body">
          {message.text && <div className={`alert alert-${message.type === "success" ? "success" : "danger"} mb-3`}>{message.text}</div>}

          {contactPages.length === 0 ? (
            <div className="text-center py-5">
              <Icon icon="heroicons:document-text" className="text-secondary" style={{ fontSize: "48px" }} />
              <p className="text-secondary mt-3 mb-0">No contact pages found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr><th>Title</th><th>Slug</th><th>Tags</th><th>Created At</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {contactPages.map((page) => (
                    <tr key={page.id}>
                      <td><div className="fw-semibold">{page.title}</div></td>
                      <td><code className="text-primary">{page.slug}</code></td>
                      <td>{page.tags?.length > 0 ? page.tags.slice(0, 2).map((tag, i) => <span key={i} className="badge bg-secondary me-1">{tag}</span>) : <span className="text-muted">No tags</span>}</td>
                      <td><small className="text-muted">{formatDate(page.createdAt)}</small></td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-info" onClick={() => handleView(page)}><Icon icon="heroicons:eye" /></button>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(page.id)}><Icon icon="heroicons:pencil" /></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(page.id)}><Icon icon="heroicons:trash" /></button>
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
              <div className="modal-body"><pre className="bg-light p-3 rounded">{JSON.stringify(selectedItem, null, 2)}</pre></div>
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

export default ContactPageTable
