import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { aboutPagesAPI } from "../services/api"

const AboutPageForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')
  const isEditMode = !!editId

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [formData, setFormData] = useState({
    title: "", slug: "", tags: "",
    banner: { title: "", description: "", imageUrl: "" },
    aboutSection: { title: "", description: "" },
    connectingManpower: { title: "", description: "" },
    map: { title: "", description: "", imageUrl: "" },
    certificates: { title: "", images: [] },
    trustedCompanies: { title: "", images: [] },
    socialResponsibility: { title: "", description: "" },
  })

  useEffect(() => { if (editId) fetchData() }, [editId])

  const fetchData = async () => {
    setIsFetching(true)
    try {
      const response = await aboutPagesAPI.getById(editId)
      if (response.success && response.data) {
        const d = response.data
        setFormData({
          title: d.title || "", slug: d.slug || "",
          tags: Array.isArray(d.tags) ? d.tags.join(", ") : "",
          banner: d.banner || { title: "", description: "", imageUrl: "" },
          aboutSection: d.aboutSection || { title: "", description: "" },
          connectingManpower: d.connectingManpower || { title: "", description: "" },
          map: d.map || { title: "", description: "", imageUrl: "" },
          certificates: d.certificates || { title: "", images: [] },
          trustedCompanies: d.trustedCompanies || { title: "", images: [] },
          socialResponsibility: d.socialResponsibility || { title: "", description: "" },
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
    setMessage({ type: "", text: "" })

    try {
      const payload = { ...formData, tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean) }
      const response = isEditMode ? await aboutPagesAPI.update(editId, payload) : await aboutPagesAPI.create(payload)
      if (response.success) {
        setMessage({ type: "success", text: `About page ${isEditMode ? 'updated' : 'created'}!` })
        setTimeout(() => navigate('/about-page-table'), 1500)
      } else setMessage({ type: "error", text: response.error?.message || "Failed to save" })
    } catch (error) { setMessage({ type: "error", text: error.message }) }
    finally { setIsLoading(false) }
  }

  if (isFetching) return <div className="card"><div className="card-body d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div></div>

  return (
    <div className="card">
      <div className="card-header"><h5 className="card-title mb-0">{isEditMode ? 'Edit' : 'Create'} About Page</h5></div>
      <div className="card-body">
        {message.text && <div className={`alert alert-${message.type === "success" ? "success" : "danger"} mb-4`}>{message.text}</div>}
        <form onSubmit={handleSubmit} className="row gy-4">
          {/* Basic Info */}
          <div className="col-12"><h6 className="text-primary mb-3">Basic Information</h6></div>
          <div className="col-md-6"><label className="form-label">Title *</label><input type="text" className="form-control" value={formData.title} onChange={(e) => handleChange("root", "title", e.target.value)} required /></div>
          <div className="col-md-6"><label className="form-label">Slug *</label><input type="text" className="form-control" value={formData.slug} onChange={(e) => handleChange("root", "slug", e.target.value)} required /></div>
          <div className="col-12"><label className="form-label">Tags (comma separated)</label><input type="text" className="form-control" value={formData.tags} onChange={(e) => handleChange("root", "tags", e.target.value)} /></div>

          {/* Banner */}
          <div className="col-12"><h6 className="text-primary mb-3">Banner Section</h6></div>
          <div className="col-md-4"><label className="form-label">Banner Title</label><input type="text" className="form-control" value={formData.banner.title} onChange={(e) => handleChange("banner", "title", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Description</label><input type="text" className="form-control" value={formData.banner.description} onChange={(e) => handleChange("banner", "description", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Image URL</label><input type="text" className="form-control" value={formData.banner.imageUrl} onChange={(e) => handleChange("banner", "imageUrl", e.target.value)} /></div>

          {/* About Section */}
          <div className="col-12"><h6 className="text-primary mb-3">About Section</h6></div>
          <div className="col-md-6"><label className="form-label">Title</label><input type="text" className="form-control" value={formData.aboutSection.title} onChange={(e) => handleChange("aboutSection", "title", e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Description</label><textarea className="form-control" rows="2" value={formData.aboutSection.description} onChange={(e) => handleChange("aboutSection", "description", e.target.value)} /></div>

          {/* Connecting Manpower */}
          <div className="col-12"><h6 className="text-primary mb-3">Connecting Manpower</h6></div>
          <div className="col-md-6"><label className="form-label">Title</label><input type="text" className="form-control" value={formData.connectingManpower.title} onChange={(e) => handleChange("connectingManpower", "title", e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Description</label><textarea className="form-control" rows="2" value={formData.connectingManpower.description} onChange={(e) => handleChange("connectingManpower", "description", e.target.value)} /></div>

          {/* Map Section */}
          <div className="col-12"><h6 className="text-primary mb-3">Map Section</h6></div>
          <div className="col-md-4"><label className="form-label">Title</label><input type="text" className="form-control" value={formData.map.title} onChange={(e) => handleChange("map", "title", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Description</label><input type="text" className="form-control" value={formData.map.description} onChange={(e) => handleChange("map", "description", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Image URL</label><input type="text" className="form-control" value={formData.map.imageUrl} onChange={(e) => handleChange("map", "imageUrl", e.target.value)} /></div>

          {/* Certificates */}
          <div className="col-12"><h6 className="text-primary mb-3">Certificates</h6></div>
          <div className="col-12"><label className="form-label">Title</label><input type="text" className="form-control" value={formData.certificates.title} onChange={(e) => handleChange("certificates", "title", e.target.value)} /></div>

          {/* Social Responsibility */}
          <div className="col-12"><h6 className="text-primary mb-3">Social Responsibility</h6></div>
          <div className="col-md-6"><label className="form-label">Title</label><input type="text" className="form-control" value={formData.socialResponsibility.title} onChange={(e) => handleChange("socialResponsibility", "title", e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Description</label><textarea className="form-control" rows="2" value={formData.socialResponsibility.description} onChange={(e) => handleChange("socialResponsibility", "description", e.target.value)} /></div>

          {/* Buttons */}
          <div className="col-12 d-flex justify-content-end gap-3">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/about-page-table')} disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : (isEditMode ? "Update" : "Create")}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AboutPageForm
