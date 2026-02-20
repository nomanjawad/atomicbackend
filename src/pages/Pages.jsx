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
  const [showCreateMenu, setShowCreateMenu] = useState(false);

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
    // Detect if it's a contact page by checking content structure
    const isContactPage = page.content && 
      page.content.hero && 
      Array.isArray(page.content.contactInfo) && 
      Array.isArray(page.content.form);
    
    if (isContactPage) {
      navigate(`/pages/edit/contact/${page.slug}`);
    } else {
      navigate(`/pages/edit/${page.slug}`);
    }
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
        <div className="relative">
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Page
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showCreateMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowCreateMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1" role="menu">
                  <button
                    onClick={() => {
                      navigate('/pages/new/contact');
                      setShowCreateMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    role="menuitem"
                  >
                    <svg className="mr-3 h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="font-medium">Contact Page</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Structured contact form page</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      handleCreate();
                      setShowCreateMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    role="menuitem"
                  >
                    <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <div className="font-medium">Generic Page</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Flexible content editor</div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
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
