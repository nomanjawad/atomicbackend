import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import UserTable from '../components/users/UserTable';
import UserFormModal from '../components/users/UserFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Users() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userService.getAllUsers();
      return response.users || [];
    },
    retry: 2,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ userId, data }) => userService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully!');
      setIsFormOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update user');
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully!');
      setIsDeleteOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (selectedUser) {
      updateMutation.mutate({ userId: selectedUser.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage user accounts and permissions
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Users</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {data?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Admins</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {data?.filter(u => u.role === 'admin').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Regular Users</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {data?.filter(u => u.role === 'user').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <UserTable
          users={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.full_name || selectedUser?.email}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
