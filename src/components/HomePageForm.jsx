import React, { useState, useEffect } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useNavigate, useSearchParams } from "react-router-dom"
import { homePagesAPI } from "../services/api"

const HomePageForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')
  const isEditMode = !!editId

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    tags: "",
    banner: {
      title: "",
      description: "",
      backgroundImage: "",
      heroImage: "",
      buttonText: "",
      buttonUrl: "",
    },
    journeyWithAmco: {
      items: [{ textHeading: "", title: "", content: "", buttonText: "", buttonUrl: "", linkUrl: "" }]
    },
    deliverySkills: {
      title: "",
      description: "",
      imageUrl: "",
      floatingBoxTitle: "",
    },
    trustedCompanies: {
      title: "",
      images: [],
    },
    globalCertificates: {
      title: "",
      description: "",
      imageUrl: "",
      certificateImages: [],
      buttonText: "",
      buttonUrl: "",
    },
    whatWeServe: {
      title: "",
      items: [""],
    },
    grabSkilledEmployees: {
      title: "",
      buttonText: "",
      buttonUrl: "",
    },
  })

  // Fetch existing data if editing
  useEffect(() => {
    if (editId) {
      fetchHomePage()
    }
  }, [editId])

  const fetchHomePage = async () => {
    setIsFetching(true)
    try {
      const response = await homePagesAPI.getById(editId)
      if (response.success && response.data) {
        const data = response.data
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          banner: data.banner || { title: "", description: "", backgroundImage: "", heroImage: "", buttonText: "", buttonUrl: "" },
          journeyWithAmco: data.journeyWithAmco || { items: [{ textHeading: "", title: "", content: "", buttonText: "", buttonUrl: "", linkUrl: "" }] },
          deliverySkills: data.deliverySkills || { title: "", description: "", imageUrl: "", floatingBoxTitle: "" },
          trustedCompanies: data.trustedCompanies || { title: "", images: [] },
          globalCertificates: data.globalCertificates || { title: "", description: "", imageUrl: "", certificateImages: [], buttonText: "", buttonUrl: "" },
          whatWeServe: data.whatWeServe || { title: "", items: [""] },
          grabSkilledEmployees: data.grabSkilledEmployees || { title: "", buttonText: "", buttonUrl: "" },
        })
      } else {
        setMessage({ type: "error", text: "Failed to fetch home page data" })
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to fetch home page data" })
    } finally {
      setIsFetching(false)
    }
  }

  const handleInputChange = (section, field, value) => {
    if (section === "root") {
      setFormData(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }))
    }
  }

  const handleJourneyItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.journeyWithAmco.items]
      newItems[index] = { ...newItems[index], [field]: value }
      return { ...prev, journeyWithAmco: { ...prev.journeyWithAmco, items: newItems } }
    })
  }

  const addJourneyItem = () => {
    setFormData(prev => ({
      ...prev,
      journeyWithAmco: {
        ...prev.journeyWithAmco,
        items: [...prev.journeyWithAmco.items, { textHeading: "", title: "", content: "", buttonText: "", buttonUrl: "", linkUrl: "" }]
      }
    }))
  }

  const removeJourneyItem = (index) => {
    setFormData(prev => ({
      ...prev,
      journeyWithAmco: {
        ...prev.journeyWithAmco,
        items: prev.journeyWithAmco.items.filter((_, i) => i !== index)
      }
    }))
  }

  const handleWhatWeServeChange = (index, value) => {
    setFormData(prev => {
      const newItems = [...prev.whatWeServe.items]
      newItems[index] = value
      return { ...prev, whatWeServe: { ...prev.whatWeServe, items: newItems } }
    })
  }

  const addWhatWeServeItem = () => {
    setFormData(prev => ({
      ...prev,
      whatWeServe: { ...prev.whatWeServe, items: [...prev.whatWeServe.items, ""] }
    }))
  }

  const removeWhatWeServeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      whatWeServe: { ...prev.whatWeServe, items: prev.whatWeServe.items.filter((_, i) => i !== index) }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      // Prepare data for API
      const payload = {
        title: formData.title,
        slug: formData.slug,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        banner: formData.banner,
        journeyWithAmco: formData.journeyWithAmco,
        deliverySkills: formData.deliverySkills,
        trustedCompanies: formData.trustedCompanies,
        globalCertificates: formData.globalCertificates,
        whatWeServe: formData.whatWeServe,
        grabSkilledEmployees: formData.grabSkilledEmployees,
      }

      let response
      if (isEditMode) {
        response = await homePagesAPI.update(editId, payload)
      } else {
        response = await homePagesAPI.create(payload)
      }

      if (response.success) {
        setMessage({ type: "success", text: `Home page ${isEditMode ? 'updated' : 'created'} successfully!` })
        setTimeout(() => navigate('/home-page-table'), 1500)
      } else {
        setMessage({ type: "error", text: response.error?.message || "Failed to save home page" })
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to save home page" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="card">
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">{isEditMode ? 'Edit' : 'Create'} Home Page</h5>
      </div>
      <div className="card-body">
        {message.text && (
          <div className={`alert alert-${message.type === "success" ? "success" : "danger"} mb-4`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="row gy-4">
          {/* Basic Information */}
          <div className="col-12">
            <h6 className="text-lg font-semibold text-primary-600 mb-3">Basic Information</h6>
            <div className="row gy-3">
              <div className="col-md-6">
                <label className="form-label">Page Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter page title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("root", "title", e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Slug *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter URL slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("root", "slug", e.target.value)}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="tag1, tag2, tag3"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("root", "tags", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Banner Section */}
          <div className="col-12">
            <h6 className="text-lg font-semibold text-primary-600 mb-3">Banner Section</h6>
            <div className="border border-neutral-200 rounded-8 p-4">
              <div className="row gy-3">
                <div className="col-md-6">
                  <label className="form-label">Banner Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter banner title"
                    value={formData.banner.title}
                    onChange={(e) => handleInputChange("banner", "title", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Banner Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Enter banner description"
                    value={formData.banner.description}
                    onChange={(e) => handleInputChange("banner", "description", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Background Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter image URL"
                    value={formData.banner.backgroundImage}
                    onChange={(e) => handleInputChange("banner", "backgroundImage", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Hero Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter image URL"
                    value={formData.banner.heroImage}
                    onChange={(e) => handleInputChange("banner", "heroImage", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Button Text</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter button text"
                    value={formData.banner.buttonText}
                    onChange={(e) => handleInputChange("banner", "buttonText", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Button URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Enter button URL"
                    value={formData.banner.buttonUrl}
                    onChange={(e) => handleInputChange("banner", "buttonUrl", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Journey With Amco Section */}
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-lg font-semibold text-primary-600 mb-0">Journey With Amco</h6>
              <button type="button" className="btn btn-sm btn-primary-600" onClick={addJourneyItem}>
                <Icon icon="solar:add-circle-outline" className="me-1" />Add Item
              </button>
            </div>
            <div className="border border-neutral-200 rounded-8 p-4">
              {formData.journeyWithAmco.items.map((item, index) => (
                <div key={index} className="border border-neutral-100 rounded-8 p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-md mb-0">Item {index + 1}</h6>
                    {formData.journeyWithAmco.items.length > 1 && (
                      <button type="button" className="btn btn-sm btn-danger-600" onClick={() => removeJourneyItem(index)}>
                        <Icon icon="solar:trash-bin-minimalistic-outline" />
                      </button>
                    )}
                  </div>
                  <div className="row gy-3">
                    <div className="col-md-6">
                      <label className="form-label">Text Heading</label>
                      <input type="text" className="form-control" placeholder="Enter text heading" value={item.textHeading} onChange={(e) => handleJourneyItemChange(index, "textHeading", e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Title</label>
                      <input type="text" className="form-control" placeholder="Enter title" value={item.title} onChange={(e) => handleJourneyItemChange(index, "title", e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Content</label>
                      <textarea className="form-control" rows="2" placeholder="Enter content" value={item.content} onChange={(e) => handleJourneyItemChange(index, "content", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Button Text</label>
                      <input type="text" className="form-control" placeholder="Button text" value={item.buttonText} onChange={(e) => handleJourneyItemChange(index, "buttonText", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Button URL</label>
                      <input type="url" className="form-control" placeholder="Button URL" value={item.buttonUrl} onChange={(e) => handleJourneyItemChange(index, "buttonUrl", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Link URL</label>
                      <input type="url" className="form-control" placeholder="Link URL" value={item.linkUrl} onChange={(e) => handleJourneyItemChange(index, "linkUrl", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Skills Section */}
          <div className="col-12">
            <h6 className="text-lg font-semibold text-primary-600 mb-3">Delivery Skills</h6>
            <div className="border border-neutral-200 rounded-8 p-4">
              <div className="row gy-3">
                <div className="col-md-6">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" placeholder="Enter title" value={formData.deliverySkills.title} onChange={(e) => handleInputChange("deliverySkills", "title", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Floating Box Title</label>
                  <input type="text" className="form-control" placeholder="Enter floating box title" value={formData.deliverySkills.floatingBoxTitle} onChange={(e) => handleInputChange("deliverySkills", "floatingBoxTitle", e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="2" placeholder="Enter description" value={formData.deliverySkills.description} onChange={(e) => handleInputChange("deliverySkills", "description", e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Image URL</label>
                  <input type="text" className="form-control" placeholder="Enter image URL" value={formData.deliverySkills.imageUrl} onChange={(e) => handleInputChange("deliverySkills", "imageUrl", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Trusted Companies Section */}
          <div className="col-12">
            <h6 className="text-lg font-semibold text-primary-600 mb-3">Trusted Companies</h6>
            <div className="border border-neutral-200 rounded-8 p-4">
              <div className="row gy-3">
                <div className="col-12">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" placeholder="Enter title" value={formData.trustedCompanies.title} onChange={(e) => handleInputChange("trustedCompanies", "title", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Global Certificates Section */}
          <div className="col-12">
            <h6 className="text-lg font-semibold text-primary-600 mb-3">Global Certificates</h6>
            <div className="border border-neutral-200 rounded-8 p-4">
              <div className="row gy-3">
                <div className="col-md-6">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" placeholder="Enter title" value={formData.globalCertificates.title} onChange={(e) => handleInputChange("globalCertificates", "title", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Image URL</label>
                  <input type="text" className="form-control" placeholder="Enter image URL" value={formData.globalCertificates.imageUrl} onChange={(e) => handleInputChange("globalCertificates", "imageUrl", e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="2" placeholder="Enter description" value={formData.globalCertificates.description} onChange={(e) => handleInputChange("globalCertificates", "description", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Button Text</label>
                  <input type="text" className="form-control" placeholder="Enter button text" value={formData.globalCertificates.buttonText} onChange={(e) => handleInputChange("globalCertificates", "buttonText", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Button URL</label>
                  <input type="url" className="form-control" placeholder="Enter button URL" value={formData.globalCertificates.buttonUrl} onChange={(e) => handleInputChange("globalCertificates", "buttonUrl", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* What We Serve Section */}
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-lg font-semibold text-primary-600 mb-0">What We Serve</h6>
              <button type="button" className="btn btn-sm btn-primary-600" onClick={addWhatWeServeItem}>
                <Icon icon="solar:add-circle-outline" className="me-1" />Add Item
              </button>
            </div>
            <div className="border border-neutral-200 rounded-8 p-4">
              <div className="row gy-3">
                <div className="col-12">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" placeholder="Enter title" value={formData.whatWeServe.title} onChange={(e) => handleInputChange("whatWeServe", "title", e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label">Service Items</label>
                  {formData.whatWeServe.items.map((item, index) => (
                    <div key={index} className="d-flex align-items-center gap-2 mb-2">
                      <input type="text" className="form-control" placeholder={`Service item ${index + 1}`} value={item} onChange={(e) => handleWhatWeServeChange(index, e.target.value)} />
                      {formData.whatWeServe.items.length > 1 && (
                        <button type="button" className="btn btn-sm btn-danger-600" onClick={() => removeWhatWeServeItem(index)}>
                          <Icon icon="solar:trash-bin-minimalistic-outline" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grab Skilled Employees Section */}
          <div className="col-12">
            <h6 className="text-lg font-semibold text-primary-600 mb-3">Grab Skilled Employees</h6>
            <div className="border border-neutral-200 rounded-8 p-4">
              <div className="row gy-3">
                <div className="col-md-4">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" placeholder="Enter title" value={formData.grabSkilledEmployees.title} onChange={(e) => handleInputChange("grabSkilledEmployees", "title", e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Button Text</label>
                  <input type="text" className="form-control" placeholder="Enter button text" value={formData.grabSkilledEmployees.buttonText} onChange={(e) => handleInputChange("grabSkilledEmployees", "buttonText", e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Button URL</label>
                  <input type="url" className="form-control" placeholder="Enter button URL" value={formData.grabSkilledEmployees.buttonUrl} onChange={(e) => handleInputChange("grabSkilledEmployees", "buttonUrl", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="col-12">
            <div className="d-flex justify-content-end gap-3">
              <button type="button" className="btn btn-neutral-600" onClick={() => navigate('/home-page-table')} disabled={isLoading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary-600" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                  </>
                ) : (
                  `${isEditMode ? 'Update' : 'Create'} Home Page`
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HomePageForm
