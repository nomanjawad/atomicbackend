import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { individualServicesAPI } from "../services/api"

const IndividualServiceForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')
  const isEditMode = !!editId

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [formData, setFormData] = useState({
    title: "", slug: "", description: "", tags: "",
    content: { overview: "", features: "", benefits: "" },
    cta: { title: "", buttonText: "", buttonUrl: "" },
  })

  useEffect(() => { if (editId) fetchData() }, [editId])

  const fetchData = async () => {
    setIsFetching(true)
    try {
      const response = await individualServicesAPI.getById(editId)
      if (response.success && response.data) {
        const d = response.data
        setFormData({
          title: d.title || "", slug: d.slug || "", description: d.description || "",
          tags: Array.isArray(d.tags) ? d.tags.join(", ") : "",
          content: d.content || { overview: "", features: "", benefits: "" },
          cta: d.cta || { title: "", buttonText: "", buttonUrl: "" },
        })
      }
    } catch (error) { setMessage({ type: "error", text: error.message }) }
    finally { setIsFetching(false) }
  }

  const handleChange = (section, field, value) => {
    if (section === "root") setFormData(prev => ({ ...prev, [field]: value }))
    else setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const payload = { ...formData, tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean) }
      const response = isEditMode ? await individualServicesAPI.update(editId, payload) : await individualServicesAPI.create(payload)
      if (response.success) {
        setMessage({ type: "success", text: `Service ${isEditMode ? 'updated' : 'created'}!` })
        setTimeout(() => navigate('/individual-service-table'), 1500)
      } else setMessage({ type: "error", text: "Failed to save" })
    } catch (error) { setMessage({ type: "error", text: error.message }) }
    finally { setIsLoading(false) }
  }

  if (isFetching) return <div className="card"><div className="card-body d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div></div>

  return (
    <div className="card">
      <div className="card-header"><h5 className="card-title mb-0">{isEditMode ? 'Edit' : 'Create'} Individual Service</h5></div>
      <div className="card-body">
        {message.text && <div className={`alert alert-${message.type === "success" ? "success" : "danger"} mb-4`}>{message.text}</div>}
        <form onSubmit={handleSubmit} className="row gy-4">
          <div className="col-md-6"><label className="form-label">Title *</label><input type="text" className="form-control" value={formData.title} onChange={(e) => handleChange("root", "title", e.target.value)} required /></div>
          <div className="col-md-6"><label className="form-label">Slug *</label><input type="text" className="form-control" value={formData.slug} onChange={(e) => handleChange("root", "slug", e.target.value)} required /></div>
          <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows="3" value={formData.description} onChange={(e) => handleChange("root", "description", e.target.value)} /></div>
          <div className="col-12"><label className="form-label">Tags</label><input type="text" className="form-control" value={formData.tags} onChange={(e) => handleChange("root", "tags", e.target.value)} /></div>

          <div className="col-12"><h6 className="text-primary mb-3">Content</h6></div>
          <div className="col-12"><label className="form-label">Overview</label><textarea className="form-control" rows="3" value={formData.content.overview} onChange={(e) => handleChange("content", "overview", e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Features</label><textarea className="form-control" rows="3" value={formData.content.features} onChange={(e) => handleChange("content", "features", e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Benefits</label><textarea className="form-control" rows="3" value={formData.content.benefits} onChange={(e) => handleChange("content", "benefits", e.target.value)} /></div>

          <div className="col-12"><h6 className="text-primary mb-3">Call to Action</h6></div>
          <div className="col-md-4"><label className="form-label">Title</label><input type="text" className="form-control" value={formData.cta.title} onChange={(e) => handleChange("cta", "title", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Button Text</label><input type="text" className="form-control" value={formData.cta.buttonText} onChange={(e) => handleChange("cta", "buttonText", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Button URL</label><input type="url" className="form-control" value={formData.cta.buttonUrl} onChange={(e) => handleChange("cta", "buttonUrl", e.target.value)} /></div>

          <div className="col-12 d-flex justify-content-end gap-3">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/individual-service-table')} disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : (isEditMode ? "Update" : "Create")}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IndividualServiceForm
