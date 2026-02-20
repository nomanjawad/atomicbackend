# Contact Page Editor - Implementation Guide

## Overview

The Contact Page Editor is a structured, type-specific page editor that replaces generic JSON editing with form-based, validated inputs. It integrates with the Media API for image uploads and uses Zod schemas from `@atomictemplate/validations` for validation.

## Features

✅ **Structured Sections**: Hero, Contact Info, Form Fields, and Map  
✅ **Image Upload**: Integrated with Media API (Supabase Storage)  
✅ **Schema Validation**: Real-time validation using ContactPageSchema  
✅ **SEO Fields**: Meta title, SEO title, meta description, featured image  
✅ **Dynamic Form Builder**: Add/remove form fields with various types  
✅ **Optional Map**: Toggle-able location map with lat/lng/zoom  
✅ **Version History**: Track changes and restore previous versions  

---

## Architecture

### File Structure

```
src/
├── components/
│   ├── media/
│   │   └── ImageUpload.jsx          # Reusable image upload component
│   └── pages/
│       ├── ContactPageEditor.jsx    # Main contact page editor
│       └── sections/
│           ├── HeroSection.jsx      # Hero banner section
│           ├── ContactInfoSection.jsx # Contact details array
│           ├── FormSection.jsx      # Dynamic form fields
│           └── MapSection.jsx       # Optional location map
├── services/
│   ├── mediaService.js              # Media API integration
│   └── pageService.js               # Pages API integration
└── utils/
    └── pageConstants.js             # Status enums and metadata
```

### Data Flow

1. **User creates/edits contact page** → ContactPageEditor
2. **Form data structured into sections** → Hero, ContactInfo, Form, Map
3. **Schema validation** → ContactPageSchema from @atomictemplate/validations
4. **Image uploads** → Media API → Supabase Storage
5. **Save to database** → Pages API → PostgreSQL (JSONB content)

---

## Components

### 1. ContactPageEditor

**Location:** `src/components/pages/ContactPageEditor.jsx`

Main editor component that orchestrates all sections.

**Key Features:**
- Auto-generates slug from title
- Validates against ContactPageSchema
- Handles create/update operations
- Displays validation errors

**State Management:**
```javascript
const [basicInfo, setBasicInfo] = useState({
  title: '',
  slug: '',
  status: PAGE_STATUS.DRAFT,
});

const [metadata, setMetadata] = useState({
  meta_title: '',
  seo_title: '',
  meta_description: '',
  featured_image: '',
});

const [content, setContent] = useState({
  hero: { title: '', subtitle: '', backgroundImage: '' },
  contactInfo: [],
  form: [],
  map: null,
});
```

### 2. HeroSection

**Location:** `src/components/pages/sections/HeroSection.jsx`

Hero banner with title, subtitle, and background image.

**Schema:**
```javascript
{
  title: string (required),
  subtitle?: string,
  backgroundImage: string (required, URL)
}
```

**Features:**
- Title input (required)
- Subtitle textarea (optional)
- Background image upload via ImageUpload component
- Field-level validation error display

### 3. ContactInfoSection

**Location:** `src/components/pages/sections/ContactInfoSection.jsx`

Array of contact information items (email, phone, address, etc.).

**Schema:**
```javascript
contactInfo: [
  {
    icon: string (required),
    label: string (required),
    value: string (required)
  }
]
```

**Features:**
- Add/remove items dynamically
- Icon, label, and value inputs for each item
- Reorderable items (future enhancement)

### 4. FormSection

**Location:** `src/components/pages/sections/FormSection.jsx`

Dynamic form field builder for contact forms.

**Schema:**
```javascript
form: [
  {
    name: string (required),
    label: string (required),
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio',
    required: boolean,
    placeholder?: string,
    options?: string[] // for select/radio/checkbox
  }
]
```

**Features:**
- Add/remove fields
- 7 field types supported
- Options for select/radio/checkbox
- Required field toggle

### 5. MapSection

**Location:** `src/components/pages/sections/MapSection.jsx`

Optional location map with latitude, longitude, and zoom level.

**Schema:**
```javascript
map?: {
  lat: number (required if enabled),
  lng: number (required if enabled),
  zoom: number (1-20, default: 13)
}
```

**Features:**
- Toggle to enable/disable
- Latitude/longitude inputs
- Zoom level control (1-20)

### 6. ImageUpload

**Location:** `src/components/media/ImageUpload.jsx`

Reusable image upload and browser component.

**Props:**
```javascript
{
  value: string,            // Current image URL
  onChange: (url) => void,  // Callback with new URL
  label?: string,           // Field label
  folder?: string,          // Target folder (default: 'pages')
  showBrowser?: boolean,    // Show media library (default: true)
  required?: boolean,       // Validation flag
  className?: string        // Additional CSS classes
}
```

**Features:**
- Upload new images to Media API
- Browse existing images in folder
- Preview selected image
- Remove image button
- Create new folders inline
- 2MB file size limit
- Supports: JPEG, PNG, GIF, WebP, SVG

---

## Routes

### Pages List
```
/pages
```
Shows all pages with dropdown to create Generic or Contact pages.

### Create Contact Page
```
/pages/new/contact
```
Opens ContactPageEditor in create mode.

### Edit Contact Page
```
/pages/edit/contact/:slug
```
Opens ContactPageEditor in edit mode.

**Auto-detection:** The system detects contact pages by checking if content has `hero`, `contactInfo`, and `form` fields, then routes to ContactPageEditor automatically.

### Generic Page (Fallback)
```
/pages/new
/pages/edit/:slug
```
Generic Editor.js-based editor for other page types.

---

## Media API Integration

### Service: `mediaService.js`

**Base URL:** `http://localhost:3001/api/media`

**Key Functions:**

#### Upload Image
```javascript
uploadMedia(formData)
```
- **Endpoint:** `POST /api/media/upload`
- **Auth:** Required
- **Form Data:**
  - `file`: Image file (max 2MB)
  - `title`: Image title (required)
  - `type`: Folder name (required)
  - `description`: Optional description
  - `alt_text`: Alt text for accessibility
- **Returns:** `{ media: { id, url, path, ... } }`

#### Get Media
```javascript
getAllMedia({ type, author, date_from, date_to })
```
- **Endpoint:** `GET /api/media?type=folder`
- **Auth:** Public
- **Returns:** `{ media: [...], total: number }`

#### Create Folder
```javascript
createFolder(name)
```
- **Endpoint:** `POST /api/media/folders`
- **Auth:** Required
- **Rules:** Lowercase, alphanumeric, dash, underscore only

---

## Validation

### Schema: ContactPageSchema

From `@atomictemplate/validations/pages`:

```javascript
import { ContactPageSchema } from '@atomictemplate/validations/pages';

// Validate
try {
  ContactPageSchema.parse(data);
  // Valid
} catch (error) {
  // error.errors contains validation messages
}
```

### Validation Timing

**Current:** On submit (user clicks Save)  
**Future:** Can add real-time validation on blur or as user types

### Error Display

Errors are displayed:
1. Inline below each field (red text)
2. Summary box at bottom of form (all errors)

---

## SEO Fields

### meta_title
Page title for browser tab and search results. Falls back to page title if empty.

### seo_title
**NEW:** Optimized title specifically for SEO. Different from meta_title. Can be longer and keyword-rich.

### meta_description
Brief description for search engines and social media previews.

### featured_image
Main image for social media sharing (Open Graph, Twitter Cards).

---

## Usage Examples

### 1. Create Contact Page

1. Navigate to `/pages`
2. Click "Create Page" dropdown
3. Select "Contact Page"
4. Fill in basic info:
   - Title: "Contact Us"
   - Status: Draft/Published
5. Add SEO metadata
6. Upload featured image
7. Configure Hero section:
   - Title: "Get in Touch"
   - Subtitle: "We'd love to hear from you"
   - Upload background image
8. Add contact info:
   - Icon: 📧, Label: "Email", Value: "hello@example.com"
   - Icon: 📞, Label: "Phone", Value: "+1 234 567 8900"
9. Build form:
   - Name (text, required)
   - Email (email, required)
   - Message (textarea, required)
10. Optionally enable map with coordinates
11. Click "Create Page"

### 2. Edit Contact Page

1. Navigate to `/pages`
2. Click edit icon on any contact page
3. System auto-detects it's a contact page
4. Routes to `/pages/edit/contact/:slug`
5. Modify sections as needed
6. Click "Update Page"

### 3. Upload Image

**Within any section:**
1. Click "Select Image" button
2. Modal opens with two tabs:
   - **Upload New:** Upload from computer
   - **Media Library:** Choose from existing
3. Upload tab:
   - Select file (max 2MB)
   - Title auto-fills from filename
   - Add description and alt text
   - Click "Upload Image"
4. Image URL automatically set in form

---

## API Interaction

### Create Page
```javascript
POST /api/pages
{
  "title": "Contact Us",
  "slug": "contact-us",
  "status": "draft",
  "meta_data": {
    "meta_title": "Contact Us | Company Name",
    "seo_title": "Get in Touch - Contact Our Team Today",
    "meta_description": "Reach out to our team...",
    "featured_image": "https://..."
  },
  "content": {
    "hero": {
      "title": "Get in Touch",
      "subtitle": "We're here to help",
      "backgroundImage": "https://..."
    },
    "contactInfo": [
      { "icon": "📧", "label": "Email", "value": "hello@example.com" }
    ],
    "form": [
      { "name": "name", "label": "Name", "type": "text", "required": true }
    ],
    "map": {
      "lat": 40.7128,
      "lng": -74.0060,
      "zoom": 13
    }
  }
}
```

### Update Page
```javascript
PUT /api/pages/:slug
{
  // Same structure as create
}
```

---

## Database Schema

### `pages` Table

```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  meta_data JSONB,
  content JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  author_id UUID,
  author_name TEXT,
  author_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Example Row

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Contact Us",
  "slug": "contact-us",
  "status": "published",
  "meta_data": {
    "meta_title": "Contact Us | Company",
    "seo_title": "Get in Touch - Contact Our Team",
    "meta_description": "...",
    "featured_image": "https://..."
  },
  "content": {
    "hero": { ... },
    "contactInfo": [ ... ],
    "form": [ ... ],
    "map": { ... }
  },
  "version": 3,
  "author_name": "John Doe",
  "created_at": "2026-02-20T10:00:00Z",
  "updated_at": "2026-02-20T15:30:00Z"
}
```

---

## Future Enhancements

### Phase 2
- [ ] Rich text editor for hero subtitle (TinyMCE/Quill)
- [ ] Drag & drop reordering for contact info and form fields
- [ ] Image editor (crop, resize, filters)
- [ ] Cloudinary/S3 integration for better image management
- [ ] Inline validation (on blur or as typing)

### Phase 3
- [ ] Other page type editors (Home, About, Gallery, etc.)
- [ ] Page templates/presets
- [ ] Content blocks library
- [ ] Preview mode
- [ ] Scheduled publishing

---

## Troubleshooting

### Build Errors

**Module not found: @atomictemplate/validations**
```bash
pnpm install @atomictemplate/validations zod
```

**Import path errors**
- Use `pageService.methodName()` not `import { methodName }`
- Use `../utils/apiClient` not `../helper/apiClient`

### Validation Errors

**Hero background image required**
- Ensure image is uploaded before saving
- Check that URL is properly set in state

**Contact info validation fails**
- All fields (icon, label, value) must be filled
- Remove empty items before saving

**Map coordinates invalid**
- Latitude: -90 to 90
- Longitude: -180 to 180
- Zoom: 1 to 20

### Media Upload Fails

**401 Unauthorized**
- Check authentication token
- Ensure user is logged in

**413 Payload Too Large**
- Image exceeds 2MB
- Compress image before uploading

**400 Invalid type**
- Folder doesn't exist
- Create folder first via Media API

---

## Best Practices

### Images
- Compress before upload (TinyPNG, ImageOptim)
- Use WebP format for modern browsers
- Hero backgrounds: 1920x1080px or larger
- Featured images: 1200x630px (Open Graph standard)

### SEO
- Keep meta_title under 60 characters
- Keep meta_description between 150-160 characters
- Use seo_title for keyword optimization
- Always provide alt text for images

### Forms
- Mark truly required fields only
- Use appropriate input types (email, tel)
- Provide helpful placeholders
- Order fields logically (name → email → message)

### Content
- Write clear hero titles (3-7 words)
- Use descriptive contact labels
- Test map coordinates before publishing
- Proofread all content before publishing

---

## Related Documentation

- [Pages API](./PAGES_API.md) - Backend API endpoints
- [Media API](https://github.com/nomanjawad/automictemplate-api/blob/main/docs/MEDIA_API.md) - Image upload API
- [@atomictemplate/validations](https://www.npmjs.com/package/@atomictemplate/validations) - Validation schemas
- [PAGES_IMPLEMENTATION.md](./PAGES_IMPLEMENTATION.md) - Generic page editor (original implementation)

---

## Summary

The Contact Page Editor provides a **structured, validated, and user-friendly** way to create contact pages with:
- ✅ Form-based editing (no JSON)
- ✅ Real-time image uploads
- ✅ Schema validation
- ✅ SEO optimization
- ✅ Type-safe development

It serves as a **template for other page-type editors** (Home, About, Gallery, etc.) following the same pattern.
