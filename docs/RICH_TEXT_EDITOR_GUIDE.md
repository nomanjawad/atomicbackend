# RichTextEditor Component - Usage Guide

## Overview

The `RichTextEditor` is a fully-featured, reusable Editor.js component that can be used throughout your admin dashboard. It comes with all essential editing tools, media upload integration, and is highly customizable.

## Location

- **Component**: `src/components/common/RichTextEditor.jsx`
- **Help Text**: `src/components/common/EditorHelpText.jsx`
- **Examples**: `src/examples/RichTextEditorExamples.jsx`
- **Styles**: `src/styles/editorjs-custom.css`

## Quick Start

### Basic Usage

```jsx
import { useRef } from 'react';
import RichTextEditor from '../components/common/RichTextEditor';

function MyComponent() {
  const editorRef = useRef(null);

  const handleSave = async () => {
    const data = await editorRef.current.save();
    console.log('Saved:', data);
  };

  return (
    <div>
      <RichTextEditor
        ref={editorRef}
        holderId="my-editor"
        placeholder="Start writing..."
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `holderId` | `string` | `'editorjs'` | **Required**. Unique ID for the editor container |
| `initialData` | `object` | `{ blocks: [] }` | Initial content in Editor.js format |
| `onChange` | `function` | - | Callback when content changes: `(data, event) => {}` |
| `onReady` | `function` | - | Callback when editor is ready: `(editorInstance) => {}` |
| `placeholder` | `string` | `'Start writing...'` | Placeholder text |
| `readOnly` | `boolean` | `false` | Make editor read-only |
| `minHeight` | `number` | `400` | Minimum height in pixels |
| `tools` | `object` | All tools | Custom tools configuration |
| `uploadFolder` | `string` | `'general'` | Folder name for media uploads |
| `autofocus` | `boolean` | `true` | Auto-focus editor on mount |
| `config` | `object` | `{}` | Additional Editor.js configuration |

## Ref Methods

Access these methods via `editorRef.current`:

### `save()`
Returns a Promise with the editor data in Editor.js format.

```jsx
const data = await editorRef.current.save();
```

### `clear()`
Clears all content from the editor.

```jsx
await editorRef.current.clear();
```

### `render(data)`
Renders new data into the editor.

```jsx
await editorRef.current.render({ blocks: [...] });
```

### `isReady()`
Returns `true` if the editor is ready to use.

```jsx
if (editorRef.current.isReady()) {
  // Editor is ready
}
```

### `getInstance()`
Returns the raw Editor.js instance.

```jsx
const editor = editorRef.current.getInstance();
```

## Available Tools

The editor comes with these tools pre-configured:

### Typography
- **Header** (H1-H6) - Click settings icon to choose level
- **Paragraph** - Default text
- **Quote** - Blockquotes with author
- **Warning** - Attention blocks

### Lists
- **Nested List** - Ordered/unordered with nesting
- **Checklist** - Todo-style checkboxes

### Media
- **Image** - Upload/embed images (auto-uploads to Media API)
- **Attaches** - Upload files
- **Embed** - YouTube, Vimeo, Twitter, Instagram, CodePen, GitHub

### Structure
- **Table** - Data tables
- **Delimiter** - Section divider

### Inline Formatting
- **Marker** - Highlight text
- **InlineCode** - Code snippets
- **Underline** - Underlined text
- **Bold** - Bold text
- **Italic** - Italic text
- **Link** - Hyperlinks

### Utilities
- **Drag & Drop** - Reorder blocks
- **Undo/Redo** - History management

## Common Use Cases

### 1. Blog Post Editor

```jsx
function BlogEditor() {
  const editorRef = useRef(null);
  const [content, setContent] = useState({ blocks: [] });

  return (
    <RichTextEditor
      ref={editorRef}
      holderId="blog-editor"
      initialData={content}
      onChange={(data) => setContent(data)}
      uploadFolder="blog"
      placeholder="Write your blog post..."
      minHeight={500}
    />
  );
}
```

### 2. Page Content Editor (Current Implementation)

```jsx
<RichTextEditor
  ref={editorRef}
  holderId="page-editor"
  initialData={pageData?.content}
  uploadFolder="pages"
  placeholder="Start writing your page content..."
  minHeight={400}
/>
```

### 3. Product Description

```jsx
<RichTextEditor
  ref={editorRef}
  holderId={`product-${productId}`}
  initialData={product.description}
  uploadFolder="products"
  minHeight={300}
  autofocus={false}
/>
```

### 4. Email Template (Simplified)

```jsx
<RichTextEditor
  ref={editorRef}
  holderId="email-template"
  uploadFolder="email-templates"
  placeholder="Design your email..."
  minHeight={400}
/>
```

### 5. FAQ Answer

```jsx
<RichTextEditor
  ref={editorRef}
  holderId="faq-answer"
  uploadFolder="faq"
  placeholder="Enter answer..."
  minHeight={200}
/>
```

### 6. Announcement (Read-only after publish)

```jsx
<RichTextEditor
  ref={editorRef}
  holderId="announcement"
  initialData={announcementData}
  readOnly={isPublished}
  uploadFolder="announcements"
/>
```

### 7. Multi-Section Editor

```jsx
function MultiSectionPage() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);

  const handleSaveAll = async () => {
    const data = {
      hero: await heroRef.current.save(),
      content: await contentRef.current.save(),
      footer: await footerRef.current.save(),
    };
    // Save to API
  };

  return (
    <>
      <RichTextEditor ref={heroRef} holderId="hero" minHeight={200} />
      <RichTextEditor ref={contentRef} holderId="content" minHeight={400} />
      <RichTextEditor ref={footerRef} holderId="footer" minHeight={200} />
    </>
  );
}
```

## Custom Tools Configuration

You can customize which tools are available:

```jsx
const customTools = {
  header: true,
  paragraph: true,
  list: true,
  // Exclude other tools
};

<RichTextEditor
  ref={editorRef}
  holderId="simple-editor"
  tools={customTools}
/>
```

## Media Upload

All image and file uploads automatically integrate with your Media API:

- Uploads to Supabase Storage
- Creates media record in database
- Returns URL for embedding
- Configurable folder via `uploadFolder` prop

```jsx
<RichTextEditor
  ref={editorRef}
  holderId="editor"
  uploadFolder="blog" // Uploads go to 'blog' folder
/>
```

## Help Text Component

Show users helpful shortcuts:

```jsx
import EditorHelpText from '../components/common/EditorHelpText';

<EditorHelpText />
// Shows default features

<EditorHelpText
  features={[
    { text: 'Custom tip', kbd: ['Ctrl', 'S'] },
    { text: 'Another tip' },
  ]}
/>
```

## Keyboard Shortcuts

- **Tab** or **/** - Open block menu
- **Cmd/Ctrl + Shift + H** - Add header
- **Cmd/Ctrl + Shift + L** - Add list
- **Cmd/Ctrl + Shift + O** - Add quote
- **Cmd/Ctrl + Shift + M** - Highlight text
- **Cmd/Ctrl + Shift + C** - Inline code
- **Cmd/Ctrl + U** - Underline
- **Cmd/Ctrl + B** - Bold
- **Cmd/Ctrl + I** - Italic
- **Cmd/Ctrl + Z** - Undo
- **Cmd/Ctrl + Y** - Redo

## Styling

The component includes custom styles in `src/styles/editorjs-custom.css`:

- Responsive design
- Dark mode support
- Distinct heading sizes (H1-H6)
- Hover effects for tune menu
- Smooth transitions

## Best Practices

### 1. Unique Hold IDs
Always use unique `holderId` for each editor instance:

```jsx
// ✅ Good
<RichTextEditor holderId="blog-editor" />
<RichTextEditor holderId="comment-editor" />

// ❌ Bad
<RichTextEditor holderId="editor" />
<RichTextEditor holderId="editor" /> // Duplicate!
```

### 2. Check Editor Ready State
Before saving, verify the editor is ready:

```jsx
const handleSave = async () => {
  if (!editorRef.current?.isReady()) {
    toast.error('Editor is loading...');
    return;
  }
  await editorRef.current.save();
};
```

### 3. Conditional Rendering for Loading States
Don't render until data is loaded:

```jsx
{!isLoading && (
  <RichTextEditor
    ref={editorRef}
    initialData={fetchedData}
    holderId="editor"
  />
)}
```

### 4. Organize Upload Folders
Use descriptive folder names:

```jsx
uploadFolder="blog"        // Blog posts
uploadFolder="products"    // Product images
uploadFolder="pages"       // Page content
uploadFolder="email"       // Email templates
```

### 5. Handle Errors
Wrap editor operations in try-catch:

```jsx
const handleSave = async () => {
  try {
    const data = await editorRef.current.save();
    await api.updatePost(data);
    toast.success('Saved!');
  } catch (error) {
    toast.error('Failed to save');
    console.error(error);
  }
};
```

## Migration from Old Editors

If you have existing custom editors, migrate to RichTextEditor:

### Before:
```jsx
// Custom implementation with raw Editor.js
const [editor, setEditor] = useState(null);

useEffect(() => {
  const editorInstance = new EditorJS({
    holder: 'editor',
    // ... complex config
  });
  setEditor(editorInstance);
}, []);
```

### After:
```jsx
// Simple, clean, reusable
const editorRef = useRef(null);

<RichTextEditor
  ref={editorRef}
  holderId="editor"
/>
```

## Troubleshooting

### Editor not rendering
- Ensure `holderId` is unique
- Check for duplicate instances
- Verify component is mounted before rendering

### Images not uploading
- Check Media API configuration
- Verify Supabase credentials
- Check network requests in DevTools

### Styles not applying
- Import CSS: `import '../../styles/editorjs-custom.css'`
- Check for CSS conflicts
- Verify Tailwind is configured

### Content not saving
- Verify `ref` is properly passed
- Check `isReady()` before saving
- Handle async operations correctly

## Examples

See `src/examples/RichTextEditorExamples.jsx` for complete working examples.

## Support

For bugs or feature requests, contact the development team or create an issue.
