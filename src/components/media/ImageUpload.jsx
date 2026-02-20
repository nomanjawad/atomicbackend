import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadMedia, createFolder, getAllMedia } from '../../services/mediaService';

const ImageUpload = ({ 
  value, 
  onChange, 
  label = 'Image', 
  folder = 'pages',
  showBrowser = true,
  required = false,
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'library'
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    alt_text: '',
  });
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch media library
  const { data: mediaData, isLoading: isLoadingMedia } = useQuery({
    queryKey: ['media', folder],
    queryFn: () => getAllMedia({ type: folder }),
    enabled: showModal && activeTab === 'library',
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: uploadMedia,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      onChange(data.media.url);
      setShowModal(false);
      setUploadForm({ title: '', description: '', alt_text: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-folders'] });
    },
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set default title from filename
      if (!uploadForm.title) {
        const filename = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
        setUploadForm(prev => ({ ...prev, title: filename }));
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    const file = fileInputRef.current?.files[0];
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', uploadForm.title);
    formData.append('type', folder);
    if (uploadForm.description) formData.append('description', uploadForm.description);
    if (uploadForm.alt_text) formData.append('alt_text', uploadForm.alt_text);

    uploadMutation.mutate(formData);
  };

  const handleSelectFromLibrary = (mediaItem) => {
    onChange(mediaItem.url);
    setShowModal(false);
  };

  const handleRemoveImage = () => {
    onChange('');
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
        {label}
        {required && <span className="text-danger-600 ml-1">*</span>}
      </label>

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt={label}
            className="h-32 w-auto rounded-lg border-2 border-neutral-200 dark:border-neutral-600 object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-danger-600 text-white rounded-full p-1 hover:bg-danger-700 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">No image selected</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="mt-3 btn btn-outline-primary-600"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {value ? 'Change Image' : 'Select Image'}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-neutral-900 bg-opacity-50"
              onClick={() => setShowModal(false)}
            ></div>

            {/* Modal Content */}
            <div className="inline-block align-bottom bg-white dark:bg-neutral-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              {/* Header */}
              <div className="bg-white dark:bg-neutral-800 px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Select Image
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      activeTab === 'upload'
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    Upload New
                  </button>
                  {showBrowser && (
                    <button
                      onClick={() => setActiveTab('library')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        activeTab === 'library'
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      Media Library
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="bg-white dark:bg-neutral-800 px-6 py-4 max-h-96 overflow-y-auto">
                {activeTab === 'upload' ? (
                  <form onSubmit={handleUpload} className="space-y-4">
                    {/* Folder Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Upload to Folder
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={folder}
                          disabled
                          className="form-control flex-1 bg-neutral-100 dark:bg-neutral-700"
                        >
                          <option value={folder}>{folder}</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const name = prompt('Enter new folder name (lowercase, alphanumeric, dash, underscore):');
                            if (name) createFolderMutation.mutate(name.trim().toLowerCase());
                          }}
                          className="btn btn-outline-primary-600 whitespace-nowrap"
                        >
                          New Folder
                        </button>
                      </div>
                    </div>

                    {/* File Input */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Choose File *
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                        onChange={handleFileSelect}
                        className="form-control"
                        required
                      />
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Max 2MB. Supported: JPEG, PNG, GIF, WebP, SVG
                      </p>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        className="form-control"
                        placeholder="Enter image title"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        className="form-control"
                        rows="2"
                        placeholder="Optional description"
                      />
                    </div>

                    {/* Alt Text */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={uploadForm.alt_text}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, alt_text: e.target.value }))}
                        className="form-control"
                        placeholder="Alt text for accessibility"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={uploadMutation.isPending}
                      className="btn btn-primary-600 w-full"
                    >
                      {uploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </form>
                ) : (
                  <div>
                    {isLoadingMedia ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-2 text-neutral-600 dark:text-neutral-400">Loading media...</p>
                      </div>
                    ) : mediaData?.media?.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4">
                        {mediaData.media.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleSelectFromLibrary(item)}
                            className="cursor-pointer group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-600 transition-all"
                          >
                            <img
                              src={item.url}
                              alt={item.alt_text || item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                              <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center">
                                {item.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-neutral-600 dark:text-neutral-400">No images in this folder</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
