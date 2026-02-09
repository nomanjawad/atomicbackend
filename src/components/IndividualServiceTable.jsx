import React, { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import { individualServicesAPI } from "../services/api"

const IndividualServiceTable = () => {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const response = await individualServicesAPI.getAll()
      if (response.success) setServices(response.data || [])
      else setMessage({ type: "error", text: "Failed to fetch individual services" })
    } catch (error) { setMessage({ type: "error", text: error.message }) }
    finally { setIsLoading(false) }
  }

  const handleEdit = (id) => navigate(`/individual-service-form?id=${id}`)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this individual service?")) return
    try {
      const response = await individualServicesAPI.delete(id)
      if (response.success) { setMessage({ type: "success", text: "Deleted successfully" }); setServices(prev => prev.filter(s => s.id !== id)) }
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
          <h5 className="card-title mb-0">Individual Services</h5>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/individual-service-form")}><Icon icon="heroicons:plus" className="me-1" />Add New</button>
        </div>
        <div className="card-body">
          {message.text && <div className={`alert alert-${message.type === "success" ? "success" : "danger"} mb-3`}>{message.text}</div>}
          {services.length === 0 ? (
            <div className="text-center py-5"><Icon icon="heroicons:briefcase" className="text-secondary" style={{ fontSize: "48px" }} /><p className="text-secondary mt-3">No individual services found.</p></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark"><tr><th>Title</th><th>Slug</th><th>Description</th><th>Tags</th><th>Created At</th><th>Actions</th></tr></thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td><div className="fw-semibold">{service.title}</div></td>
                      <td><code className="text-primary">{service.slug}</code></td>
                      <td><small className="text-muted">{service.description?.substring(0, 50)}...</small></td>
                      <td>{service.tags?.slice(0, 2).map((t, i) => <span key={i} className="badge bg-secondary me-1">{t}</span>) || <span className="text-muted">-</span>}</td>
                      <td><small className="text-muted">{formatDate(service.createdAt)}</small></td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-info" onClick={() => handleView(service)}><Icon icon="heroicons:eye" /></button>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(service.id)}><Icon icon="heroicons:pencil" /></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(service.id)}><Icon icon="heroicons:trash" /></button>
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

export default IndividualServiceTable
