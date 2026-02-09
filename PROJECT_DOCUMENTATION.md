# AMCO Admin Panel - Project Documentation

## Overview

This is a React-based admin panel with an Express.js backend connected to Supabase. It provides CRUD operations for managing website pages (Home, About, Contact, Blog, CSR, Gallery, Industries, Services).

---

## Project Structure

```
amco-admin/
├── src/                      # React Frontend
│   ├── components/           # Reusable UI components
│   ├── context/              # React Context (AuthContext)
│   ├── masterLayout/         # Main layout with sidebar/navbar
│   ├── pages/                # Page components
│   └── services/api.js       # API client (Axios)
│
├── backend/                  # Express.js Backend
│   ├── src/
│   │   ├── app.js            # Express app setup
│   │   ├── server.js         # Server entry point
│   │   ├── config/           # Supabase config
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Auth middleware
│   │   ├── routes/           # API routes
│   │   └── validators/       # Joi validation schemas
│   └── .env                  # Backend environment variables
│
└── .env                      # Frontend environment variables
```

---

## Architecture Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│   Express API   │────▶│    Supabase     │
│  (Frontend)     │◀────│   (Backend)     │◀────│   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     Port 3000              Port 5000
```

---

## Authentication System

### How Auth Works

1. **Login Flow:**
   ```
   User submits credentials → Frontend calls /api/auth/login 
   → Backend validates with Supabase → Returns JWT tokens 
   → Frontend stores in localStorage → User is authenticated
   ```

2. **Protected Routes:**
   - Frontend: `ProtectedRoute` component checks `isAuthenticated`
   - Backend: `authenticate` middleware validates JWT token

### Key Files

| File | Purpose |
|------|---------|
| `src/context/AuthContext.js` | Manages auth state, login/logout functions |
| `src/components/ProtectedRoute.jsx` | Redirects unauthenticated users to login |
| `backend/src/controllers/authController.js` | Login/signup/logout logic |
| `backend/src/middleware/authenticate.js` | JWT validation middleware |

### Auth API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh-token` | Refresh JWT token |
| GET | `/api/auth/me` | Get current user |

---

## CRUD System Architecture

### Backend CRUD Factory

The backend uses a **factory pattern** for CRUD operations. One controller handles all page types.

**File:** `backend/src/controllers/crudFactory.js`

```javascript
// Creates standardized CRUD handlers for any table
const createCrudController = (tableName, options) => ({
    getAll: async (req, res) => { /* fetch all records */ },
    getById: async (req, res) => { /* fetch by ID */ },
    create: async (req, res) => { /* create record */ },
    update: async (req, res) => { /* update record */ },
    delete: async (req, res) => { /* delete record */ }
});
```

### Backend Route Factory

**File:** `backend/src/routes/routeFactory.js`

```javascript
// Creates standardized routes for any controller
const createRoutes = (controller, schemas, options) => {
    router.get('/', controller.getAll);
    router.get('/:id', controller.getById);
    router.post('/', authenticate, validate(schemas.create), controller.create);
    router.put('/:id', authenticate, validate(schemas.update), controller.update);
    router.delete('/:id', authenticate, controller.delete);
    return router;
};
```

### Frontend API Factory

**File:** `src/services/api.js`

```javascript
// Creates standardized API calls for any endpoint
const createCrudAPI = (endpoint) => ({
    getAll: async (params) => api.get(endpoint, { params }),
    getById: async (id) => api.get(`${endpoint}/${id}`),
    create: async (data) => api.post(endpoint, data),
    update: async (id, data) => api.put(`${endpoint}/${id}`, data),
    delete: async (id) => api.delete(`${endpoint}/${id}`)
});

// Usage:
export const homePagesAPI = createCrudAPI('/home-pages');
export const aboutPagesAPI = createCrudAPI('/about-pages');
// ... etc
```

---

## Page Controllers (Data Transformation)

Each page type has a controller that transforms data between frontend (camelCase) and database (snake_case).

**Example:** `backend/src/controllers/homePageController.js`

```javascript
const transformInput = (data) => ({
    title: data.title,
    banner: data.banner,           // Frontend sends 'banner'
    services_section: data.servicesSection,  // Maps to snake_case
    clients_section: data.clientsSection
});

const transformOutput = (data) => ({
    id: data.id,
    title: data.title,
    banner: data.banner,
    servicesSection: data.services_section,  // Maps to camelCase
    clientsSection: data.clients_section
});
```

### All Page Controllers

| Controller | Table | Frontend Fields |
|------------|-------|-----------------|
| homePageController | home_pages | banner, servicesSection, clientsSection, aboutSection, industriesSection, testimonialsSection, contactSection |
| aboutPageController | about_pages | banner, missionSection, visionSection, teamSection, historySection |
| contactPageController | contact_pages | banner, contactInfo, formSection |
| blogPostController | blog_posts | title, slug, excerpt, content, featuredImage, author, tags |
| csrPageController | csr_pages | banner, initiatives, impact |
| galleryPageController | gallery_pages | banner, gallery |
| industriesPageController | industries_pages | banner, industries |
| servicesPageController | services_pages | banner, services, cta |
| individualServiceController | individual_services | title, slug, description, content, cta |

---

## Validation Schemas

**File:** `backend/src/validators/schemas.js`

Each page type has Joi validation schemas for create/update operations.

```javascript
const homePageSchemas = {
    create: Joi.object({
        title: Joi.string().required(),
        banner: Joi.object().optional(),
        servicesSection: Joi.object().optional()
        // ... other fields
    }),
    update: Joi.object({
        title: Joi.string().optional(),
        // ... allow partial updates
    })
};
```

---

## Adding a New Page Type

### Step 1: Create Database Table (Supabase SQL)

```sql
CREATE TABLE new_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    banner JSONB,
    custom_section JSONB,  -- Use snake_case
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE new_pages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can read" ON new_pages FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert" ON new_pages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update" ON new_pages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete" ON new_pages FOR DELETE USING (auth.role() = 'authenticated');
```

### Step 2: Create Backend Controller

**File:** `backend/src/controllers/newPageController.js`

```javascript
const { createCrudController } = require('./crudFactory');

const transformInput = (data) => ({
    title: data.title,
    banner: data.banner,
    custom_section: data.customSection  // camelCase → snake_case
});

const transformOutput = (data) => ({
    id: data.id,
    title: data.title,
    banner: data.banner,
    customSection: data.custom_section  // snake_case → camelCase
});

module.exports = createCrudController('new_pages', {
    transformInput,
    transformOutput
});
```

### Step 3: Add Validation Schema

**File:** `backend/src/validators/schemas.js`

```javascript
const newPageSchemas = {
    create: Joi.object({
        title: Joi.string().required(),
        banner: Joi.object().optional(),
        customSection: Joi.object().optional()
    }),
    update: Joi.object({
        title: Joi.string().optional(),
        banner: Joi.object().optional(),
        customSection: Joi.object().optional()
    })
};

module.exports = { ..., newPageSchemas };
```

### Step 4: Create Routes

**File:** `backend/src/routes/newPageRoutes.js`

```javascript
const controller = require('../controllers/newPageController');
const { newPageSchemas } = require('../validators/schemas');
const { createRoutes } = require('./routeFactory');

module.exports = createRoutes(controller, newPageSchemas);
```

### Step 5: Register Routes

**File:** `backend/src/app.js`

```javascript
const newPageRoutes = require('./routes/newPageRoutes');
app.use('/api/new-pages', newPageRoutes);
```

### Step 6: Add Frontend API

**File:** `src/services/api.js`

```javascript
export const newPagesAPI = createCrudAPI('/new-pages');
```

### Step 7: Create Frontend Components

Create table and form components similar to existing ones.

---

## Environment Variables

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)

```
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
```

---

## Running the Project

### Development

```bash
# Terminal 1: Frontend
cd amco-admin
npm install
npm start

# Terminal 2: Backend
cd amco-admin/backend
npm install
npm run dev
```

### Production

```bash
# Frontend
npm run build

# Backend
npm start
```

---

## Common Modifications

### Change API Response Format

Edit `backend/src/controllers/crudFactory.js`:

```javascript
// In getAll handler
res.json({
    success: true,
    data: transformedData,
    pagination: { page, limit, total }
});
```

### Add New Field to Existing Page

1. Add column in Supabase
2. Update controller's `transformInput` and `transformOutput`
3. Update validation schema
4. Update frontend form

### Change Authentication Rules

Edit `backend/src/middleware/authenticate.js` for backend protection.
Edit `src/components/ProtectedRoute.jsx` for frontend protection.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| 401 Unauthorized | Check JWT token in localStorage, verify backend JWT_SECRET |
| 500 Server Error | Check backend console, verify Supabase connection |
| CORS Error | Check FRONTEND_URL in backend .env matches actual frontend URL |
| Field not saving | Verify field name mapping in controller (camelCase ↔ snake_case) |
| Validation failed | Check schemas.js for required fields |

---

## Key Concepts Summary

1. **Factory Pattern**: Both backend and frontend use factories to create standardized CRUD operations
2. **Data Transformation**: Controllers convert between frontend camelCase and database snake_case
3. **JWT Authentication**: Tokens stored in localStorage, verified by middleware
4. **Supabase**: PostgreSQL database with Row Level Security (RLS)
5. **Protected Routes**: Frontend checks auth state, redirects to login if needed
