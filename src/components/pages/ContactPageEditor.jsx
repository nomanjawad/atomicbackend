import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactPageSchema } from '@atomictemplate/validations/pages';
import { pageService } from '../../services/pageService';
import { PAGE_STATUS } from '../../utils/pageConstants';
import ImageUpload from '../media/ImageUpload';
import HeroSection from './sections/HeroSection';
import ContactInfoSection from './sections/ContactInfoSection';
import FormSection from './sections/FormSection';
import MapSection from './sections/MapSection';

const ContractPageEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(slug);

  // Form state
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    slug: '',
    status: PAGE_STATUS.DRAFT,
  });

  const [metadata, setMetadata] = useState({
    meta_title: '',
    seo_title: '',
    meta_description: '',
    featured_image: '',
  });

  const [content, setContent] = useState({
    hero: {
      title: '',
      subtitle: '',
      backgroundImage: '',
    },
    contactInfo: [],
    form: [],
    map: null,
  });

  const [mapEnabled, setMapEnabled] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch existing page data
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => pageService.getPageBySlug(slug),
    enabled: isEditMode,
  });

  // Populate form when editing
  useEffect(() => {
    if (pageData) {
      setBasicInfo({
        title: pageData.title || '',
        slug: pageData.slug || '',
        status: pageData.status || PAGE_STATUS.DRAFT,
      });

      setMetadata({
        meta_title: pageData.meta_data?.meta_title || '',
        seo_title: pageData.meta_data?.seo_title || '',
        meta_description: pageData.meta_data?.meta_description || '',
        featured_image: pageData.meta_data?.featured_image || '',
      });

      if (pageData.content) {
        setContent({
          hero: pageData.content.hero || { title: '', subtitle: '', backgroundImage: '' },
          contactInfo: pageData.content.contactInfo || [],
          form: pageData.content.form || [],
          map: pageData.content.map || null,
        });

        setMapEnabled(Boolean(pageData.content.map));
      }
    }
  }, [pageData]);

  // Auto-generate slug from title
  const handleTitleChange = (title) => {
    setBasicInfo((prev) => ({
      ...prev,
      title,
      slug: isEditMode ? prev.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }));
  };

  // Validate form
  const validateForm = () => {
    try {
      // Prepare data for validation
      const dataToValidate = {
        hero: content.hero,
        contactInfo: content.contactInfo,
        form: content.form,
        ...(mapEnabled && content.map ? { map: content.map } : {}),
      };

      // Validate against ContactPageSchema
      ContactPageSchema.parse(dataToValidate);
      
      // Clear errors
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error.errors) {
        const errors = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isEditMode) {
        return pageService.updatePage(slug, data);
      } else {
        return pageService.createPage(data);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', slug] });
      navigate('/pages');
    },
    onError: (error) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm()) {
      alert('Please fix validation errors before saving');
      return;
    }

    // Prepare page data
    const pageData = {
      title: basicInfo.title,
      slug: basicInfo.slug,
      status: basicInfo.status,
      meta_data: {
        meta_title: metadata.meta_title || basicInfo.title,
        seo_title: metadata.seo_title || basicInfo.title,
        meta_description: metadata.meta_description,
        featured_image: metadata.featured_image,
      },
      content: {
        hero: content.hero,
        contactInfo: content.contactInfo,
        form: content.form,
        ...(mapEnabled && content.map ? { map: content.map } : {}),
      },
    };

    saveMutation.mutate(pageData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-main-body">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <h6 className="fw-semibold mb-0">{isEditMode ? 'Edit' : 'Create'} Contact Page</h6>
        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/pages')}
            className="btn btn-outline-neutral-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
            className="btn btn-primary-600"
          >
            {saveMutation.isPending ? 'Saving...' : isEditMode ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Basic Information</h6>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Page Title */}
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
                  Page Title <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  value={basicInfo.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="form-control"
                  placeholder="Contact Us"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
                  Slug <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  value={basicInfo.slug}
                  onChange={(e) => setBasicInfo((prev) => ({ ...prev, slug: e.target.value }))}
                  className="form-control"
                  placeholder="contact-us"
                  disabled={isEditMode}
                  required
                />
                {isEditMode && (
                  <p className="text-xs text-neutral-500 mt-1">(cannot be changed)</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
                Status
              </label>
              <select
                value={basicInfo.status}
                onChange={(e) => setBasicInfo((prev) => ({ ...prev, status: e.target.value }))}
                className="form-control"
              >
                {Object.entries(PAGE_STATUS).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">SEO & Metadata</h6>
          </div>
          <div className="card-body space-y-4">
            {/* Meta Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={metadata.meta_title}
                onChange={(e) => setMetadata((prev) => ({ ...prev, meta_title: e.target.value }))}
                className="form-control"
                placeholder="Contact Us | Your Company Name"
              />
              <p className="text-xs text-neutral-500 mt-1">
                If empty, page title will be used
              </p>
            </div>

            {/* SEO Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={metadata.seo_title}
                onChange={(e) => setMetadata((prev) => ({ ...prev, seo_title: e.target.value }))}
                className="form-control"
                placeholder="Get in Touch - Contact Our Team"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Optimized title for search engines
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
                Meta Description
              </label>
              <textarea
                value={metadata.meta_description}
                onChange={(e) => setMetadata((prev) => ({ ...prev, meta_description: e.target.value }))}
                className="form-control"
                rows="3"
                placeholder="Brief description for search engines and social media"
              />
            </div>

            {/* Featured Image */}
            <ImageUpload
              label="Featured Image"
              value={metadata.featured_image}
              onChange={(url) => setMetadata((prev) => ({ ...prev, featured_image: url }))}
              folder="pages"
            />
          </div>
        </div>

        {/* Page Content Sections */}
        <div className="space-y-6">
          <h5 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Page Content
          </h5>

          {/* Hero Section */}
          <HeroSection
            data={content.hero}
            onChange={(hero) => setContent((prev) => ({ ...prev, hero }))}
            errors={Object.keys(validationErrors)
              .filter((key) => key.startsWith('hero.'))
              .reduce((acc, key) => {
                const field = key.replace('hero.', '');
                acc[field] = validationErrors[key];
                return acc;
              }, {})}
          />

          {/* Contact Info Section */}
          <ContactInfoSection
            data={content.contactInfo}
            onChange={(contactInfo) => setContent((prev) => ({ ...prev, contactInfo }))}
            errors={Object.keys(validationErrors)
              .filter((key) => key.startsWith('contactInfo.'))
              .reduce((acc, key) => {
                const match = key.match(/contactInfo\.(\d+)\.(.+)/);
                if (match) {
                  const index = parseInt(match[1]);
                  const field = match[2];
                  if (!acc[index]) acc[index] = {};
                  acc[index][field] = validationErrors[key];
                }
                return acc;
              }, [])}
          />

          {/* Form Section */}
          <FormSection
            data={content.form}
            onChange={(form) => setContent((prev) => ({ ...prev, form }))}
            errors={Object.keys(validationErrors)
              .filter((key) => key.startsWith('form.'))
              .reduce((acc, key) => {
                const match = key.match(/form\.(\d+)\.(.+)/);
                if (match) {
                  const index = parseInt(match[1]);
                  const field = match[2];
                  if (!acc[index]) acc[index] = {};
                  acc[index][field] = validationErrors[key];
                }
                return acc;
              }, [])}
          />

          {/* Map Section */}
          <MapSection
            data={content.map}
            onChange={(map) => setContent((prev) => ({ ...prev, map }))}
            errors={Object.keys(validationErrors)
              .filter((key) => key.startsWith('map.'))
              .reduce((acc, key) => {
                const field = key.replace('map.', '');
                acc[field] = validationErrors[key];
                return acc;
              }, {})}
            enabled={mapEnabled}
            onToggle={(enabled) => {
              setMapEnabled(enabled);
              if (enabled && !content.map) {
                setContent((prev) => ({
                  ...prev,
                  map: { lat: 0, lng: 0, zoom: 13 },
                }));
              } else if (!enabled) {
                setContent((prev) => ({
                  ...prev,
                  map: null,
                }));
              }
            }}
          />
        </div>

        {/* Validation Errors Summary */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
            <h6 className="text-danger-700 font-semibold mb-2">Validation Errors:</h6>
            <ul className="list-disc list-inside space-y-1 text-sm text-danger-600">
              {Object.entries(validationErrors).map(([key, message]) => (
                <li key={key}>
                  <strong>{key}:</strong> {message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/pages')}
            className="btn btn-outline-neutral-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="btn btn-primary-600"
          >
            {saveMutation.isPending ? 'Saving...' : isEditMode ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractPageEditor;
