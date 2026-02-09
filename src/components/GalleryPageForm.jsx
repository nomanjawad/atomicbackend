import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { galleryPagesAPI } from "../services/api"

const GalleryPageForm = () => {
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
    gallery: { title: "", description: "", images: [] },
  })

  useEffect(() => { if (editId) fetchData() }, [editId])

  const fetchData = async () => {
    setIsFetching(true)
    try {
      const response = await galleryPagesAPI.getById(editId)
      if (response.success && response.data) {
        const d = response.data
        setFormData({
          title: d.title || "", slug: d.slug || "",
          tags: Array.isArray(d.tags) ? d.tags.join(", ") : "",
          banner: d.banner || { title: "", description: "", imageUrl: "" },
          gallery: d.gallery || { title: "", description: "", images: [] },
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
      const response = isEditMode ? await galleryPagesAPI.update(editId, payload) : await galleryPagesAPI.create(payload)
      if (response.success) {
        setMessage({ type: "success", text: `Gallery page ${isEditMode ? 'updated' : 'created'}!` })
        setTimeout(() => navigate('/gallery-page-table'), 1500)
      } else setMessage({ type: "error", text: "Failed to save" })
    } catch (error) { setMessage({ type: "error", text: error.message }) }
    finally { setIsLoading(false) }
  }

  if (isFetching) return <div className="card"><div className="card-body d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div></div>

  return (
    <div className="card">
      <div className="card-header"><h5 className="card-title mb-0">{isEditMode ? 'Edit' : 'Create'} Gallery Page</h5></div>
      <div className="card-body">
        {message.text && <div className={`alert alert-${message.type === "success" ? "success" : "danger"} mb-4`}>{message.text}</div>}
        <form onSubmit={handleSubmit} className="row gy-4">
          <div className="col-md-6"><label className="form-label">Title *</label><input type="text" className="form-control" value={formData.title} onChange={(e) => handleChange("root", "title", e.target.value)} required /></div>
          <div className="col-md-6"><label className="form-label">Slug *</label><input type="text" className="form-control" value={formData.slug} onChange={(e) => handleChange("root", "slug", e.target.value)} required /></div>
          <div className="col-12"><label className="form-label">Tags</label><input type="text" className="form-control" value={formData.tags} onChange={(e) => handleChange("root", "tags", e.target.value)} /></div>

          <div className="col-12"><h6 className="text-primary mb-3">Banner</h6></div>
          <div className="col-md-4"><label className="form-label">Title</label><input type="text" className="form-control" value={formData.banner.title} onChange={(e) => handleChange("banner", "title", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Description</label><input type="text" className="form-control" value={formData.banner.description} onChange={(e) => handleChange("banner", "description", e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label">Image URL</label><input type="text" className="form-control" value={formData.banner.imageUrl} onChange={(e) => handleChange("banner", "imageUrl", e.target.value)} /></div>

          <div className="col-12"><h6 className="text-primary mb-3">Gallery Section</h6></div>
          <div className="col-md-6"><label className="form-label">Title</label><input type="text" className="form-control" value={formData.gallery.title} onChange={(e) => handleChange("gallery", "title", e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label">Description</label><textarea className="form-control" rows="2" value={formData.gallery.description} onChange={(e) => handleChange("gallery", "description", e.target.value)} /></div>

          <div className="col-12 d-flex justify-content-end gap-3">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/gallery-page-table')} disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? "Saving..." : (isEditMode ? "Update" : "Create")}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GalleryPageForm
