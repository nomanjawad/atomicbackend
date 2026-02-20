import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { USER_ROLES } from '../../utils/constants';

export default function UserFormModal({ isOpen, onClose, onSubmit, user = null, isLoading = false }) {
  const isEdit = !!user;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
      role: USER_ROLES.USER,
    },
  });

  // Update form values when user prop changes
  useEffect(() => {
    if (user) {
      reset({
        email: user.email || '',
        full_name: user.full_name || '',
        role: user.role || USER_ROLES.USER,
      });
    } else {
      reset({
        email: '',
        password: '',
        full_name: '',
        role: USER_ROLES.USER,
      });
    }
  }, [user, reset]);

  const onFormSubmit = (data) => {
    // In edit mode, ensure email is included even though field is disabled
    const submitData = isEdit && user?.email ? { ...data, email: user.email } : data;
    onSubmit(submitData);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                {/* Header */}
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                      {isEdit ? 'Edit User' : 'Add New User'}
                    </Dialog.Title>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email {!isEdit && <span className="text-red-500">*</span>}
                          {isEdit && <span className="text-xs text-gray-500 dark:text-gray-400">(cannot be changed)</span>}
                        </label>
                        <input
                          type="email"
                          id="email"
                          {...register('email', { 
                            required: !isEdit ? 'Email is required' : false,
                            pattern: !isEdit ? {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            } : undefined
                          })}
                          disabled={isEdit}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Password - only for new users */}
                      {!isEdit && (
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            id="password"
                            {...register('password', { 
                              required: !isEdit ? 'Password is required' : false,
                              minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                          />
                          {errors.password && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                          )}
                        </div>
                      )}

                      {/* Full Name */}
                      <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          {...register('full_name')}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Role */}
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Role <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="role"
                          {...register('role', { required: 'Role is required' })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value={USER_ROLES.USER}>User</option>
                          <option value={USER_ROLES.MODERATOR}>Moderator</option>
                          <option value={USER_ROLES.ADMIN}>Admin</option>
                        </select>
                        {errors.role && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role.message}</p>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
