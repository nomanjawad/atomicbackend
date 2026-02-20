import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { pageService } from '../services/pageService';
import PageStatusBadge from '../components/pages/PageStatusBadge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useState } from 'react';

export default function PageHistory() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [restoreVersion, setRestoreVersion] = useState(null);

  // Fetch page history
  const { data, isLoading, error } = useQuery({
    queryKey: ['page-history', slug],
    queryFn: () => pageService.getPageHistory(slug),
    enabled: !!slug,
  });

  // Restore version mutation
  const restoreMutation = useMutation({
    mutationFn: ({ slug, version }) => pageService.restorePageVersion(slug, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-history', slug] });
      queryClient.invalidateQueries({ queryKey: ['page', slug] });
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast.success('Page restored successfully!');
      setRestoreVersion(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to restore page version');
    },
  });

  const handleBack = () => {
    navigate('/pages');
  };

  const handleRestore = (version) => {
    setRestoreVersion(version);
  };

  const confirmRestore = () => {
    if (restoreVersion) {
      restoreMutation.mutate({ slug, version: restoreVersion });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Error loading history: {error.message}</p>
        <button
          onClick={handleBack}
          className="mt-4 text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          ← Back to Pages
        </button>
      </div>
    );
  }

  const currentVersion = data?.page?.version || 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBack}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Version History</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {data?.page?.title} - Current version: v{currentVersion}
          </p>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {!data?.history || data.history.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No version history available
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.history.map((version, index) => {
              const isCurrentVersion = version.version === currentVersion;
              const isLatest = index === 0;

              return (
                <div
                  key={version.version}
                  className={`p-6 ${isCurrentVersion ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Version {version.version}
                          {isCurrentVersion && (
                            <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-1 rounded">
                              Current
                            </span>
                          )}
                          {isLatest && !isCurrentVersion && (
                            <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                              Latest
                            </span>
                          )}
                        </h3>
                        <PageStatusBadge status={version.status} />
                      </div>

                      <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                        {version.title}
                      </p>

                      {version.change_summary && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {version.change_summary}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                        </span>
                        <span>•</span>
                        <span>
                          by {version.changed_by_name || 'Unknown'}
                        </span>
                        {version.changed_by_email && (
                          <>
                            <span>•</span>
                            <span>{version.changed_by_email}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {!isCurrentVersion && (
                      <button
                        onClick={() => handleRestore(version.version)}
                        disabled={restoreMutation.isPending}
                        className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Restore this version"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Restore Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!restoreVersion}
        onClose={() => setRestoreVersion(null)}
        onConfirm={confirmRestore}
        title="Restore Page Version"
        message={`Are you sure you want to restore to version ${restoreVersion}? This will create a new version with the restored content. The current version will be preserved in history.`}
        confirmText="Restore"
        type="warning"
        isLoading={restoreMutation.isPending}
      />
    </div>
  );
}
