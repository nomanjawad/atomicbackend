import React from 'react';

const FormSection = ({ data = [], onChange, errors }) => {
  const fieldTypes = ['text', 'email', 'tel', 'textarea', 'select', 'checkbox', 'radio'];

  const addField = () => {
    onChange([
      ...data,
      {
        name: '',
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
        options: [],
      },
    ]);
  };

  const removeField = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateField = (index, field, value) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };
    onChange(newData);
  };

  const updateOptions = (index, optionsString) => {
    const options = optionsString.split(',').map(opt => opt.trim()).filter(Boolean);
    updateField(index, 'options', options);
  };

  return (
    <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Contact Form Fields
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Define fields for the contact form
          </p>
        </div>
        <button
          type="button"
          onClick={addField}
          className="btn btn-sm btn-outline-primary-600"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Field
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            No form fields yet. Click "Add Field" to create your contact form.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((field, index) => (
            <div
              key={index}
              className="border border-neutral-200 dark:border-neutral-600 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Field {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="text-danger-600 hover:text-danger-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-1">
                    Field Name <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={field.name || ''}
                    onChange={(e) => updateField(index, 'name', e.target.value)}
                    className={`form-control ${errors?.[index]?.name ? 'border-danger-600' : ''}`}
                    placeholder="email"
                  />
                  {errors?.[index]?.name && (
                    <p className="text-danger-600 text-xs mt-1">{errors[index].name}</p>
                  )}
                </div>

                {/* Label */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-1">
                    Label <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={field.label || ''}
                    onChange={(e) => updateField(index, 'label', e.target.value)}
                    className={`form-control ${errors?.[index]?.label ? 'border-danger-600' : ''}`}
                    placeholder="Email Address"
                  />
                  {errors?.[index]?.label && (
                    <p className="text-danger-600 text-xs mt-1">{errors[index].label}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-1">
                    Field Type <span className="text-danger-600">*</span>
                  </label>
                  <select
                    value={field.type || 'text'}
                    onChange={(e) => updateField(index, 'type', e.target.value)}
                    className="form-control"
                  >
                    {fieldTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Placeholder */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-1">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                    className="form-control"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Options (for select, radio, checkbox) */}
              {['select', 'radio', 'checkbox'].includes(field.type) && (
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-1">
                    Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={field.options?.join(', ') || ''}
                    onChange={(e) => updateOptions(index, e.target.value)}
                    className="form-control"
                    placeholder="Option 1, Option 2, Option 3"
                  />
                </div>
              )}

              {/* Required Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`required-${index}`}
                  checked={field.required || false}
                  onChange={(e) => updateField(index, 'required', e.target.checked)}
                  className="form-check-input"
                />
                <label htmlFor={`required-${index}`} className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                  Required field
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormSection;
