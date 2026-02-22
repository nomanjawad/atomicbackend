import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import NestedList from '@editorjs/nested-list';
import Checklist from '@editorjs/checklist';
import Table from '@editorjs/table';
import Image from '@editorjs/image';
import Attaches from '@editorjs/attaches';
import Embed from '@editorjs/embed';
import Delimiter from '@editorjs/delimiter';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Underline from '@editorjs/underline';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import toast from 'react-hot-toast';
import { uploadMedia } from '../../services/mediaService';
import '../../styles/editorjs-custom.css';

/**
 * RichTextEditor - Reusable Editor.js component
 * 
 * @param {string} holderId - Unique ID for the editor container (required)
 * @param {object} initialData - Initial editor content in Editor.js format
 * @param {function} onChange - Callback when content changes
 * @param {function} onReady - Callback when editor is ready
 * @param {string} placeholder - Placeholder text for empty editor
 * @param {boolean} readOnly - Make editor read-only
 * @param {number} minHeight - Minimum height in pixels (default: 400)
 * @param {object} tools - Custom tools configuration (optional - uses all by default)
 * @param {string} uploadFolder - Folder for media uploads (default: 'general')
 * @param {boolean} autofocus - Auto-focus editor on mount
 * @param {object} config - Additional Editor.js configuration
 */
const RichTextEditor = forwardRef(({
  holderId = 'editorjs',
  initialData = { blocks: [] },
  onChange,
  onReady,
  placeholder = 'Start writing or press Tab for commands...',
  readOnly = false,
  minHeight = 400,
  tools: customTools,
  uploadFolder = 'general',
  autofocus = true,
  config = {},
}, ref) => {
  const editorRef = useRef(null);
  const isInitialized = useRef(false);

  // Image/file uploader using Media API
  const uploadByFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      formData.append('type', uploadFolder);
      formData.append('description', `Uploaded from editor - ${uploadFolder}`);

      const response = await uploadMedia(formData);
      
      return {
        success: 1,
        file: {
          url: response.media.url,
          size: response.media.size,
          name: response.media.title,
        },
      };
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('Failed to upload file');
      return {
        success: 0,
        file: null,
      };
    }
  };

  // Default tools configuration
  const defaultTools = {
    // Typography
    header: {
      class: Header,
      inlineToolbar: ['marker', 'link'],
      config: {
        placeholder: 'Enter a header (Click settings icon → to choose H1-H6)',
        levels: [1, 2, 3, 4, 5, 6],
        defaultLevel: 2,
      },
      shortcut: 'CMD+SHIFT+H',
    },
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: "Quote's author",
      },
      shortcut: 'CMD+SHIFT+O',
    },
    warning: {
      class: Warning,
      inlineToolbar: true,
      config: {
        titlePlaceholder: 'Title',
        messagePlaceholder: 'Message',
      },
    },
    delimiter: Delimiter,

    // Lists
    list: {
      class: NestedList,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered',
      },
      shortcut: 'CMD+SHIFT+L',
    },
    checklist: {
      class: Checklist,
      inlineToolbar: true,
    },

    // Media
    image: {
      class: Image,
      config: {
        uploader: {
          uploadByFile: uploadByFile,
        },
        captionPlaceholder: 'Enter image caption',
        buttonContent: 'Select image',
        types: 'image/*',
      },
    },
    attaches: {
      class: Attaches,
      config: {
        uploader: {
          uploadByFile: uploadByFile,
        },
        buttonText: 'Select file',
        errorMessage: 'File upload failed',
      },
    },
    embed: {
      class: Embed,
      config: {
        services: {
          youtube: true,
          vimeo: true,
          twitter: true,
          instagram: true,
          codepen: true,
          github: true,
        },
      },
    },

    // Structure
    table: {
      class: Table,
      inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
      },
    },

    // Inline Tools
    marker: {
      class: Marker,
      shortcut: 'CMD+SHIFT+M',
    },
    inlineCode: {
      class: InlineCode,
      shortcut: 'CMD+SHIFT+C',
    },
    underline: {
      class: Underline,
      shortcut: 'CMD+U',
    },
  };

  // Expose editor instance methods to parent component
  useImperativeHandle(ref, () => ({
    // Get editor data
    save: async () => {
      if (editorRef.current) {
        return await editorRef.current.save();
      }
      return null;
    },
    // Clear editor
    clear: async () => {
      if (editorRef.current) {
        await editorRef.current.clear();
      }
    },
    // Render new data
    render: async (data) => {
      if (editorRef.current) {
        await editorRef.current.render(data);
      }
    },
    // Check if editor is ready
    isReady: () => {
      return editorRef.current !== null;
    },
    // Get editor instance
    getInstance: () => {
      return editorRef.current;
    },
  }));

  // Initialize Editor.js
  useEffect(() => {
    if (isInitialized.current) return;

    const editor = new EditorJS({
      holder: holderId,
      placeholder,
      autofocus,
      readOnly,
      tools: customTools || defaultTools,
      data: initialData,
      onReady: () => {
        // Initialize drag-drop plugin
        new DragDrop(editor);
        
        // Initialize undo plugin
        new Undo({ editor });
        
        isInitialized.current = true;

        if (onReady) {
          onReady(editor);
        }
      },
      onChange: async (api, event) => {
        if (onChange) {
          const data = await api.saver.save();
          onChange(data, event);
        }
      },
      ...config,
    });

    editorRef.current = editor;

    // Cleanup
    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []); // Empty deps - only initialize once

  return (
    <div className="rich-text-editor">
      <div
        id={holderId}
        className="prose dark:prose-invert max-w-none border border-gray-300 dark:border-gray-600 rounded-lg p-4"
        style={{ minHeight: `${minHeight}px` }}
      />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
