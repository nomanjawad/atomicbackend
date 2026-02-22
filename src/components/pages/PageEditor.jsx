import { useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { pageService } from '../../services/pageService';
import { PAGE_STATUS } from '../../utils/pageConstants';
import ImageUpload from '../media/ImageUpload';
import RichTextEditor from '../common/RichTextEditor';
import EditorHelpText from '../common/EditorHelpText';

export default function PageEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editorRef = useRef(null);
  const isEdit = !!slug && slug !== 'new';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      status: PAGE_STATUS.DRAFT,
      meta_data: {
        meta_title: '',
        seo_title: '',
        meta_description: '',
        featured_image: '',
      },
    },
  });

  const title = watch('title');

  // Fetch page data if editing
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => pageService.getPageBySlug(slug),
    enabled: isEdit,
    retry: 1,
  });

  // Populate form when editing
  useEffect(() => {
    if (pageData) {
      reset({
        title: pageData.title || '',
        slug: pageData.slug || '',
        status: pageData.status || PAGE_STATUS.DRAFT,
        meta_data: {
          meta_title: pageData.meta_data?.meta_title || '',
          seo_title: pageData.meta_data?.seo_title || '',
          meta_description: pageData.meta_data?.meta_description || '',
          featured_image: pageData.meta_data?.featured_image || '',
        },
      });
    }
  }, [pageData, reset]);

  // Auto-generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (!isEdit && title) {
      const currentForm = watch();
      if (!currentForm.slug) {
        setValue('slug', generateSlug(title));
      }
    }
  }, [title, isEdit, setValue, watch]);

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const editorData = await editorRef.current.save();

      const pageData = {
        title: data.title,
        slug: data.slug,
        status: data.status,
        content: editorData,
        meta_data: {
          meta_title: data.meta_data.meta_title || data.title,
          seo_title: data.meta_data.seo_title || data.title,
          meta_description: data.meta_data.meta_description,
          featured_image: data.meta_data.featured_image,
        },
      };

      if (isEdit) {
        return pageService.updatePage(slug, pageData);
      } else {
        return pageService.createPage(pageData);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', data.slug] });
      toast.success(isEdit ? 'Page updated successfully!' : 'Page created successfully!');
      navigate('/pages');
    },
    onError: (error) => {
      toast.error(error.message || `Failed to ${isEdit ? 'update' : 'create'} page`);
    },
  });

  const onSubmit = async (data) => {
    if (!editorRef.current || !editorRef.current.isReady()) {
      toast.error('Editor is still loading...');
      return;
    }
    saveMutation.mutate(data);
  };

  const handleCancel = () => {
    navigate('/pages');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading page...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Page' : 'Create New Page'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEdit ? `Editing: ${pageData?.title}` : 'Create a new page for your website'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Page Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter page title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              {...register('slug', {
                required: 'Slug is required',
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: 'Slug must be lowercase with hyphens only',
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="page-url-slug"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              URL-friendly identifier (e.g., "about-us", "contact")
            </p>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value={PAGE_STATUS.DRAFT}>Draft</option>
              <option value={PAGE_STATUS.PUBLISHED}>Published</option>
            </select>
          </div>
        </div>

        {/* SEO Metadata Card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SEO & Metadata</h2>

          {/* Meta Title */}
          <div>
            <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              id="meta_title"
              {...register('meta_data.meta_title')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Page Title | Your Site Name"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Browser tab title. If empty, page title will be used.
            </p>
          </div>

          {/* SEO Title */}
          <div>
            <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SEO Title
            </label>
            <input
              type="text"
              id="seo_title"
              {...register('meta_data.seo_title')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Keyword Rich Title for Search Engines"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Optimized title for SEO. Recommended: under 60 characters.
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta Description
            </label>
            <textarea
              id="meta_description"
              {...register('meta_data.meta_description')}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Brief description for search engines and social media"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Recommended: 150-160 characters
            </p>
          </div>

          {/* Featured Image */}
          <ImageUpload
            label="Featured Image"
            value={watch('meta_data.featured_image')}
            onChange={(url) => setValue('meta_data.featured_image', url)}
            folder="pages"
            className="mt-4"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Main image for social media sharing (Open Graph, Twitter Cards)
          </p>
        </div>

        {/* Content Editor Card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Page Content</h2>
          <EditorHelpText />
          <div className="mt-4">
            {!isLoading && (
              <RichTextEditor
                ref={editorRef}
                holderId="page-editor"
                initialData={pageData?.content || { blocks: [] }}
                uploadFolder="pages"
                placeholder="Start writing your page content or press Tab for commands..."
                minHeight={400}
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saveMutation.isPending ? 'Saving...' : isEdit ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </form>
    </div>
  );
}
