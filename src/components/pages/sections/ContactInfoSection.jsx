import React from 'react';

const ContactInfoSection = ({ data = [], onChange, errors }) => {
  const addItem = () => {
    onChange([
      ...data,
      {
        icon: '',
        label: '',
        value: '',
      },
    ]);
  };

  const removeItem = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };
    onChange(newData);
  };

  return (
    <div className="bg-white dark:bg-neutral-700 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Contact Information
        </h3>
        <button
          type="button"
          onClick={addItem}
          className="btn btn-sm btn-outline-primary-600"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            No contact info items yet. Click "Add Item" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="border border-neutral-200 dark:border-neutral-600 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Item {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-danger-600 hover:text-danger-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-1">
                    Icon <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.icon || ''}
                    onChange={(e) => updateItem(index, 'icon', e.target.value)}
                    className={`form-control ${errors?.[index]?.icon ? 'border-danger-600' : ''}`}
                    placeholder="📧"
                  />
                  {errors?.[index]?.icon && (
                    <p className="text-danger-600 text-xs mt-1">{errors[index].icon}</p>
                  )}
                </div>

                {/* Label */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-1">
                    Label <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.label || ''}
                    onChange={(e) => updateItem(index, 'label', e.target.value)}
                    className={`form-control ${errors?.[index]?.label ? 'border-danger-600' : ''}`}
                    placeholder="Email"
                  />
                  {errors?.[index]?.label && (
                    <p className="text-danger-600 text-xs mt-1">{errors[index].label}</p>
                  )}
                </div>

                {/* Value */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-200 mb-1">
                    Value <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.value || ''}
                    onChange={(e) => updateItem(index, 'value', e.target.value)}
                    className={`form-control ${errors?.[index]?.value ? 'border-danger-600' : ''}`}
                    placeholder="contact@example.com"
                  />
                  {errors?.[index]?.value && (
                    <p className="text-danger-600 text-xs mt-1">{errors[index].value}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactInfoSection;
