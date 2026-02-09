import React, { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import { servicesPagesAPI } from "../services/api"

const ServicesPageTable = () => {
  const [pages, setPages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchPages() }, [])

  const fetchPages = async () => {
    setIsLoading(true)
    try {
      const response = await servicesPagesAPI.getAll()
      if (response.success) setPages(response.data || [])
      else setMessage({ type: "error", text: "Failed to fetch services pages" })
    } catch (error) { setMessage({ type: "error", text: error.message }) }
    finally { setIsLoading(false) }
  }

  const handleEdit = (id) => navigate(`/service-form?id=${id}`)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this services page?")) return
    try {
      const response = await servicesPagesAPI.delete(id)
      if (response.success) { setMessage({ type: "success", text: "Deleted successfully" }); setPages(prev => prev.filter(p => p.id !== id)) }
      else setMessage({ type: "error", text: "Failed to delete" })
    } catch (error) { setMessage({ type: "error", text: error.message }) }
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

  const handleView = (item) => { setSelectedItem(item); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setSelectedItem(null) }
  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  if (isLoading) return <div className="container-fluid"><div className="card"><div className="card-body d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div></div></div>

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Services Pages</h5>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/service-form")}><Icon icon="heroicons:plus" className="me-1" />Add New</button>
        </div>
        <div className="card-body">
          {message.text && <div className={`alert alert-${message.type === "success" ? "success" : "danger"} mb-3`}>{message.text}</div>}
          {pages.length === 0 ? (
            <div className="text-center py-5"><Icon icon="heroicons:wrench-screwdriver" className="text-secondary" style={{ fontSize: "48px" }} /><p className="text-secondary mt-3">No services pages found.</p></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark"><tr><th>Title</th><th>Slug</th><th>Tags</th><th>Created At</th><th>Actions</th></tr></thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.id}>
                      <td><div className="fw-semibold">{page.title}</div></td>
                      <td><code className="text-primary">{page.slug}</code></td>
                      <td>{page.tags?.slice(0, 2).map((t, i) => <span key={i} className="badge bg-secondary me-1">{t}</span>) || <span className="text-muted">No tags</span>}</td>
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
          <div className="modal-dialog modal-lg"><div className="modal-content">
            <div className="modal-header"><h5 className="modal-title">{selectedItem.title}</h5><button className="btn-close" onClick={closeModal}></button></div>
            <div className="modal-body"><pre className="bg-light p-3 rounded">{JSON.stringify(selectedItem, null, 2)}</pre></div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={closeModal}>Close</button><button className="btn btn-primary" onClick={() => handleEdit(selectedItem.id)}>Edit</button></div>
          </div></div>
        </div>
      )}
    </div>
  )
}

export default ServicesPageTable
