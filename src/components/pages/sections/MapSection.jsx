import React from 'react';

const MapSection = ({ data, onChange, errors, enabled, onToggle }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Map Section
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Optional: Display location on an embedded map
          </p>
        </div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="form-check-input"
          />
          <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
            Enable Map
          </span>
        </label>
      </div>

      {enabled && (
        <>
          {/* Latitude */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
              Latitude <span className="text-danger-600">*</span>
            </label>
            <input
              type="number"
              step="0.000001"
              value={data?.lat || ''}
              onChange={(e) => handleChange('lat', parseFloat(e.target.value))}
              className={`form-control ${errors?.lat ? 'border-danger-600' : ''}`}
              placeholder="40.7128"
            />
            {errors?.lat && (
              <p className="text-danger-600 text-xs mt-1">{errors.lat}</p>
            )}
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
              Longitude <span className="text-danger-600">*</span>
            </label>
            <input
              type="number"
              step="0.000001"
              value={data?.lng || ''}
              onChange={(e) => handleChange('lng', parseFloat(e.target.value))}
              className={`form-control ${errors?.lng ? 'border-danger-600' : ''}`}
              placeholder="-74.0060"
            />
            {errors?.lng && (
              <p className="text-danger-600 text-xs mt-1">{errors.lng}</p>
            )}
          </div>

          {/* Zoom Level */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-2">
              Zoom Level <span className="text-danger-600">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={data?.zoom || 13}
              onChange={(e) => handleChange('zoom', parseInt(e.target.value))}
              className={`form-control ${errors?.zoom ? 'border-danger-600' : ''}`}
              placeholder="13"
            />
            {errors?.zoom && (
              <p className="text-danger-600 text-xs mt-1">{errors.zoom}</p>
            )}
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              1 = World view, 20 = Street level
            </p>
          </div>
        </>
      )}

      {!enabled && (
        <div className="text-center py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Map section is disabled. Enable it to show your location.
          </p>
        </div>
      )}
    </div>
  );
};

export default MapSection;
