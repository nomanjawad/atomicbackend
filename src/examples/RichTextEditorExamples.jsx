/**
 * RichTextEditor Usage Examples
 * 
 * This file demonstrates how to use the RichTextEditor component
 * throughout your admin dashboard
 */

import { useRef, useState } from 'react';
import RichTextEditor from '../components/common/RichTextEditor';
import EditorHelpText from '../components/common/EditorHelpText';

// ============================================
// Example 1: Basic Usage
// ============================================
export function BasicEditorExample() {
  const editorRef = useRef(null);

  const handleSave = async () => {
    const data = await editorRef.current.save();
    console.log('Saved data:', data);
  };

  return (
    <div>
      <h2>Basic Editor</h2>
      <RichTextEditor
        ref={editorRef}
        holderId="basic-editor"
        placeholder="Start typing..."
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

// ============================================
// Example 2: Blog Post Editor
// ============================================
export function BlogPostEditor() {
  const editorRef = useRef(null);
  const [content, setContent] = useState({ blocks: [] });

  const handleContentChange = (data) => {
    setContent(data);
    console.log('Content updated:', data);
  };

  const handlePublish = async () => {
    const editorData = await editorRef.current.save();
    // Send to API
    console.log('Publishing:', editorData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Blog Post</h1>
      
      <EditorHelpText />
      
      <div className="mt-6">
        <RichTextEditor
          ref={editorRef}
          holderId="blog-editor"
          initialData={content}
          onChange={handleContentChange}
          uploadFolder="blog"
          placeholder="Write your blog post..."
          minHeight={500}
          autofocus={true}
        />
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={handlePublish}>Publish</button>
        <button>Save Draft</button>
      </div>
    </div>
  );
}

// ============================================
// Example 3: FAQ Editor
// ============================================
export function FAQEditor() {
  const editorRef = useRef(null);

  // Custom tools - only show simple formatting
  const customTools = {
    paragraph: true,
    list: true,
    bold: true,
    italic: true,
  };

  return (
    <div>
      <h2>FAQ Answer Editor</h2>
      <p className="text-sm text-gray-600 mb-4">
        Simplified editor for FAQ answers
      </p>
      
      <RichTextEditor
        ref={editorRef}
        holderId="faq-editor"
        placeholder="Enter FAQ answer..."
        minHeight={200}
        uploadFolder="faq"
      />
    </div>
  );
}

// ============================================
// Example 4: Email Template Editor
// ============================================
export function EmailTemplateEditor() {
  const editorRef = useRef(null);
  const [template, setTemplate] = useState(null);

  const loadTemplate = async (templateId) => {
    // Fetch template from API
    const data = { blocks: [] }; // Replace with actual fetch
    await editorRef.current.render(data);
  };

  const saveTemplate = async () => {
    const data = await editorRef.current.save();
    // Save to API
    console.log('Saving template:', data);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2>Email Template Editor</h2>
        <button onClick={saveTemplate}>Save Template</button>
      </div>

      <EditorHelpText
        features={[
          { text: 'Use simple formatting only', kbd: [] },
          { text: 'Images will be embedded inline' },
          { text: 'Avoid complex layouts for email compatibility' },
        ]}
      />

      <RichTextEditor
        ref={editorRef}
        holderId="email-editor"
        placeholder="Design your email template..."
        uploadFolder="email-templates"
        minHeight={400}
      />
    </div>
  );
}

// ============================================
// Example 5: Product Description Editor
// ============================================
export function ProductDescriptionEditor({ productId, initialDescription }) {
  const editorRef = useRef(null);

  const handleSave = async () => {
    if (!editorRef.current.isReady()) {
      alert('Editor is not ready yet');
      return;
    }

    const description = await editorRef.current.save();
    
    // Update product
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ description }),
      });
      console.log('Product description updated');
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  return (
    <div>
      <h3>Product Description</h3>
      
      <RichTextEditor
        ref={editorRef}
        holderId={`product-editor-${productId}`}
        initialData={initialDescription || { blocks: [] }}
        uploadFolder="products"
        placeholder="Describe your product..."
        minHeight={300}
        autofocus={false}
      />

      <button onClick={handleSave} className="mt-4">
        Save Description
      </button>
    </div>
  );
}

// ============================================
// Example 6: Comment/Announcement Editor (Read-only after publish)
// ============================================
export function AnnouncementEditor({ announcementId, isPublished }) {
  const editorRef = useRef(null);
  const [announcement, setAnnouncement] = useState({ blocks: [] });

  return (
    <div>
      <h2>Announcement</h2>
      
      {isPublished && (
        <div className="bg-yellow-50 p-3 rounded mb-4">
          This announcement is published and read-only
        </div>
      )}

      <RichTextEditor
        ref={editorRef}
        holderId={`announcement-${announcementId}`}
        initialData={announcement}
        readOnly={isPublished}
        uploadFolder="announcements"
        placeholder={isPublished ? '' : 'Write your announcement...'}
        minHeight={250}
      />

      {!isPublished && (
        <button onClick={() => {/* publish logic */}}>
          Publish Announcement
        </button>
      )}
    </div>
  );
}

// ============================================
// Example 7: Multi-section Content Editor
// ============================================
export function MultiSectionEditor() {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const handleSaveAll = async () => {
    const section1 = await section1Ref.current.save();
    const section2 = await section2Ref.current.save();
    const section3 = await section3Ref.current.save();

    console.log('All sections:', { section1, section2, section3 });
  };

  return (
    <div className="space-y-8">
      <h1>Multi-Section Page Editor</h1>

      <div>
        <h2>Hero Section</h2>
        <RichTextEditor
          ref={section1Ref}
          holderId="section-1"
          placeholder="Hero section content..."
          uploadFolder="page-sections"
          minHeight={200}
        />
      </div>

      <div>
        <h2>Features Section</h2>
        <RichTextEditor
          ref={section2Ref}
          holderId="section-2"
          placeholder="Features content..."
          uploadFolder="page-sections"
          minHeight={200}
        />
      </div>

      <div>
        <h2>Footer Section</h2>
        <RichTextEditor
          ref={section3Ref}
          holderId="section-3"
          placeholder="Footer content..."
          uploadFolder="page-sections"
          minHeight={200}
        />
      </div>

      <button onClick={handleSaveAll}>Save All Sections</button>
    </div>
  );
}

// ============================================
// Example 8: With External State Management
// ============================================
export function EditorWithRedux() {
  const editorRef = useRef(null);
  // Assuming you're using Redux or Zustand
  // const content = useSelector(state => state.content);
  // const dispatch = useDispatch();

  const handleChange = (data) => {
    // Dispatch to store
    // dispatch(updateContent(data));
    console.log('Content changed:', data);
  };

  const handleClear = async () => {
    await editorRef.current.clear();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2>Editor with State Management</h2>
        <button onClick={handleClear}>Clear Editor</button>
      </div>

      <RichTextEditor
        ref={editorRef}
        holderId="redux-editor"
        // initialData={content}
        onChange={handleChange}
        uploadFolder="content"
      />
    </div>
  );
}

// ============================================
// API Reference for RichTextEditor
// ============================================

/**
 * Props:
 * 
 * @param {string} holderId - Unique ID for the editor container (required)
 * @param {object} initialData - Initial content { blocks: [] }
 * @param {function} onChange - Callback(data, event) when content changes
 * @param {function} onReady - Callback(editorInstance) when ready
 * @param {string} placeholder - Placeholder text
 * @param {boolean} readOnly - Make editor read-only
 * @param {number} minHeight - Minimum height in pixels
 * @param {object} tools - Custom tools config (optional)
 * @param {string} uploadFolder - Media upload folder name
 * @param {boolean} autofocus - Auto-focus on mount
 * @param {object} config - Additional Editor.js config
 * 
 * Ref Methods (via useRef):
 * 
 * @method save() - Returns Promise<EditorData>
 * @method clear() - Clears all content
 * @method render(data) - Renders new data
 * @method isReady() - Returns boolean
 * @method getInstance() - Returns Editor.js instance
 */
