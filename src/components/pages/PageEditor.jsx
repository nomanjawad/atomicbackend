import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import { pageService } from '../../services/pageService';
import { PAGE_STATUS } from '../../utils/pageConstants';
import { SectionPlaceholder } from './SectionHelper';

export default function PageEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const isEdit = !!slug && slug !== 'new';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      status: PAGE_STATUS.DRAFT,
      meta_data: {
        description: '',
        keywords: '',
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

  // Initialize Editor.js
  useEffect(() => {
    if (!editorRef.current && !isLoading) {
      const editor = new EditorJS({
        holder: 'editorjs',
        placeholder: 'Start building your page content...',
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [1, 2, 3, 4],
              defaultLevel: 2,
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          quote: Quote,
          section: {
            class: SectionPlaceholder,
            config: {},
          },
        },
        data: pageData?.data || { blocks: [] },
        onReady: () => {
          setIsEditorReady(true);
        },
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isLoading, pageData]);

  // Populate form when editing
  useEffect(() => {
    if (pageData) {
      reset({
        title: pageData.title || '',
        slug: pageData.slug || '',
        status: pageData.status || PAGE_STATUS.DRAFT,
        meta_data: {
          description: pageData.meta_data?.description || '',
          keywords: Array.isArray(pageData.meta_data?.keywords)
            ? pageData.meta_data.keywords.join(', ')
            : '',
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
      const currentSlug = watch('slug');
      if (!currentSlug) {
        reset((formValues) => ({
          ...formValues,
          slug: generateSlug(title),
        }));
      }
    }
  }, [title, isEdit, watch, reset]);

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const editorData = await editorRef.current.save();

      const pageData = {
        title: data.title,
        slug: data.slug,
        status: data.status,
        data: editorData,
        meta_data: {
          description: data.meta_data.description,
          keywords: data.meta_data.keywords
            ? data.meta_data.keywords.split(',').map(k => k.trim())
            : [],
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

  const onSubmit = (data) => {
    if (!isEditorReady) {
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Metadata</h2>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meta Description
            </label>
            <textarea
              id="description"
              {...register('meta_data.description')}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Brief description for search engines"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Recommended: 150-160 characters
            </p>
          </div>

          {/* Keywords */}
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Keywords
            </label>
            <input
              type="text"
              id="keywords"
              {...register('meta_data.keywords')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Comma-separated keywords
            </p>
          </div>
        </div>

        {/* Content Editor Card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Page Content</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Use the editor below to build your page. Add sections by typing "/" and selecting "Section" to add schema-validated content blocks.
          </p>
          <div
            id="editorjs"
            className="prose dark:prose-invert max-w-none min-h-[400px] border border-gray-300 dark:border-gray-600 rounded-lg p-4"
          />
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
            disabled={saveMutation.isPending || !isEditorReady}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saveMutation.isPending ? 'Saving...' : isEdit ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </form>
    </div>
  );
}
