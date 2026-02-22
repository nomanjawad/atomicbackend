import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { pageService } from '../services/pageService';
import PageTable from '../components/pages/PageTable';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Pages() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  // Fetch pages
  const { data, isLoading, error } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const response = await pageService.getAllPages();
      return response.pages || [];
    },
    retry: 2,
    staleTime: 30000,
  });

  // Delete page mutation
  const deleteMutation = useMutation({
    mutationFn: (slug) => pageService.deletePage(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast.success('Page deleted successfully!');
      setIsDeleteOpen(false);
      setSelectedPage(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete page');
    },
  });

  const handleCreate = () => {
    navigate('/pages/new');
  };

  const handleEdit = (page) => {
    navigate(`/pages/edit/${page.slug}`);
  };

  const handleDelete = (page) => {
    setSelectedPage(page);
    setIsDeleteOpen(true);
  };

  const handleHistory = (page) => {
    navigate(`/pages/${page.slug}/history`);
  };

  const handleConfirmDelete = () => {
    if (selectedPage) {
      deleteMutation.mutate(selectedPage.slug);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Error loading pages: {error.message}</p>
      </div>
    );
  }

  // Calculate stats
  const totalPages = data?.length || 0;
  const publishedPages = data?.filter(p => p.status === 'published').length || 0;
  const draftPages = data?.filter(p => p.status === 'draft').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pages</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage website pages and content
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Page
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Pages</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {totalPages}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Published</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {publishedPages}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Drafts</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {draftPages}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <PageTable
          pages={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onHistory={handleHistory}
          isLoading={isLoading}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedPage(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Page"
        message={`Are you sure you want to delete "${selectedPage?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
