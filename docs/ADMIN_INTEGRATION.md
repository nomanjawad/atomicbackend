# Admin Panel Integration Guide

This guide provides a step-by-step approach to connecting an Admin Panel to the API. It covers authentication, user management, content updates, and blog posts.

## 1. Environment Setup

### Base URL
All API requests should be prefixed with the base API URL.

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-production-url.com/api`

### Environment Variables
Ensure your Admin Panel environment (if it's a separate app) has access to:
- `API_BASE_URL`
- `SUPABASE_URL` & `SUPABASE_ANON_KEY` (if using Supabase client libraries directly, though this API handles most logic).

---

## 2. Authentication Flow

The API uses **JWT (JSON Web Tokens)** provided by Supabase.

### Login
Authenticate an admin user to receive a session token.

- **Endpoint**: `POST /api/user/login`
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "secure_password"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "uuid...",
      "email": "admin@example.com",
      "full_name": "Admin User",
      "role": "admin"
    },
    "session": {
      "access_token": "eyJhbG...",
      "refresh_token": "...",
      "expires_at": 1700000000
    }
  }
  ```

### Authorization Header
Store the `access_token` and include it in **ALL** subsequent requests.

```http
Authorization: Bearer <your_access_token>
```

> **Note**: Tokens expire after 3 days. Prepare your admin panel to handle `401 Unauthorized` responses by redirecting to login.

---

## 3. User Management

The User API allows listing, editing, and deleting users.

> **Warning**: Currently, endpoints do not strictly enforce role checks (user vs admin). Any authenticated user can technically access these if they have the token. Ensure your Admin Panel UI protects these routes, and rely on `verifyToken` for valid sessions.

### List All Users
- **Endpoint**: `GET /api/user`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns an array of all users.
  ```json
  {
    "users": [
      { "id": "...", "email": "...", "role": "user", ... }
    ],
    "total": 150
  }
  ```

### Update User (e.g., Change Role)
- **Endpoint**: `PUT /api/user/:id`
- **Body**:
  ```json
  {
    "role": "admin",
    "full_name": "New Name"
  }
  ```
  - `role` can be: `'user'`, `'admin'`, `'moderator'`.

### Delete User
- **Endpoint**: `DELETE /api/user/:id`
- **Note**: This deletes the user from both Auth and Public tables.

### Check Session / Get Current User Role
- **Endpoint**: `GET /api/user/session`
- **Response**:
  ```json
  {
    "active": true,
    "user": {
      "role": "admin"
    }
  }
  ```
  Use this on app load to verify if the user is still logged in and is an admin.

---

## 4. Content Management (Pages)

For the Admin Panel, use the `/api/pages` endpoints (Private API) rather than `/api/content/pages` (Public API). The Private API allows managing drafts, history, and restoration.

### List Pages
- **Endpoint**: `GET /api/pages`
- **Response**: Lists all pages, including drafts and archived ones.

### Get Single Page (Full Data)
- **Endpoint**: `GET /api/pages/:slug`
- **Response**: Includes full content structure.

### Create Page
- **Endpoint**: `POST /api/pages`
- **Body**:
  ```json
  {
    "title": "New Landing Page",
    "slug": "landing-2025",
    "meta_data": { "description": "SEO stuff" }
  }
  ```
  *Created as `draft` by default.*

### Update Page Content & Status
- **Endpoint**: `PUT /api/pages/:slug`
- **Body**:
  ```json
  {
    "data": { "hero": { ... }, "sections": [ ... ] },
    "status": "published"
  }
  ```
  - **Status options**: `'draft'`, `'review'`, `'scheduled'`, `'published'`, `'archived'`.

### Page History & Restoration
- **View History**: `GET /api/pages/:slug/history`
- **Restore Version**: `POST /api/pages/:slug/restore/:version`

---

## 5. Blog Management

### List Posts
- **Endpoint**: `GET /api/blog`
- **Query Params**: `?page=1&limit=20&category=news` (if supported by backend filters)

### Create Post
- **Endpoint**: `POST /api/blog`
- **Body**:
  ```json
  {
    "title": "My Blog Post",
    "slug": "my-blog-post",
    "content": "Markdown or HTML content...",
    "published": false,
    "categories": ["news"],
    "tags": ["update"]
  }
  ```

### Update Post
- **Endpoint**: `PUT /api/blog/:slug`
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "content": "New content...",
    "published": true
  }
  ```

### Delete Post
- **Endpoint**: `DELETE /api/blog/:slug`

---

## 6. Common Content (Footer, Headers, Settings)

Manage global site settings using the Common Content API.

- **List All**: `GET /api/content/common`
- **Update**: `PUT /api/content/common/:key`
  - **Example Key**: `'site-settings'`, `'footer-links'`
  - **Body**:
    ```json
    {
      "data": {
        "contact_email": "support@example.com",
        "social_links": { ... }
      }
    }
    ```

---

## 7. File Uploads

Use this endpoint for uploading blog images, page banners, etc.

- **Endpoint**: `POST /api/upload`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**:
  - `file`: (Binary)
  - `folder`: (Optional string, e.g., `'blog'`)
- **Response**:
  ```json
  {
    "data": {
      "url": "https://storage.supabase.co/...",
      "path": "blog/image.jpg",
      "filename": "image.jpg",
      "mimeType": "image/jpeg"
    }
  }
  ```

---

## 8. Error Handling & Validation

### Standard Error Response
```json
{
  "error": "Description of what went wrong"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Validation Error (Check `error` message for specific field issues)
- `401`: Unauthorized (Token missing/invalid/expired)
- `403`: Forbidden (If implemented in future RBAC)
- `404`: Not Found
- `500`: Server Error

### Validation
Most endpoints use Zod for validation. If you send invalid data (e.g., missing specific fields in `meta_data`), you will receive a `400` error with details.

---

## Summary Checklist for Integration

1. [ ] **Login Screen**: Implement form posting to `/api/user/login`.
2. **Auth Context**: Store `access_token` securely and check `GET /api/user/session` on app load.
3. **User Dashboard**: Fetch and display users from `/api/user`. Allow role updates.
4. **Content Editor**: Build UI for `/api/pages` to manage page content and drafts.
5. **Image Uploader**: Component utilizing `/api/upload` for assets.
