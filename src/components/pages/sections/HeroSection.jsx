import React from 'react';
import ImageUpload from '../../media/ImageUpload';

const HeroSection = ({ data, onChange, errors }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Hero Section
        </h3>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Main banner displayed at the top
        </span>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
          Title <span className="text-danger-600">*</span>
        </label>
        <input
          type="text"
          value={data?.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className={`form-control ${errors?.title ? 'border-danger-600' : ''}`}
          placeholder="Get in Touch With Us"
        />
        {errors?.title && (
          <p className="text-danger-600 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
          Subtitle
        </label>
        <textarea
          value={data?.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          className="form-control"
          rows="3"
          placeholder="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
        />
      </div>

      {/* Background Image */}
      <ImageUpload
        label="Background Image"
        value={data?.backgroundImage || ''}
        onChange={(url) => handleChange('backgroundImage', url)}
        folder="pages"
        required={true}
        className="mt-4"
      />
      {errors?.backgroundImage && (
        <p className="text-danger-600 text-xs mt-1">{errors.backgroundImage}</p>
      )}
    </div>
  );
};

export default HeroSection;
