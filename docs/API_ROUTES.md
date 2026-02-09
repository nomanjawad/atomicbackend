# API Routes

Here is the complete list of API routes defined in the project:

## Authentication & User Management

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **User** | | | |
| `POST` | `/api/user/register` | Register a new user | No |
| `POST` | `/api/user/login` | Login user | No |
| `POST` | `/api/user/logout` | Logout user | **Yes** |
| `GET` | `/api/user/profile` | Get current user's profile | **Yes** |
| `PUT` | `/api/user/profile` | Update current user's profile | **Yes** |
| `GET` | `/api/user/session` | Check current session | **Yes** |
| `GET` | `/api/user` | Get all users | **Yes** |
| `GET` | `/api/user/email/:email` | Get user by email | **Yes** |
| `PUT` | `/api/user/:id` | Update any user by ID | **Yes** |
| `DELETE` | `/api/user/:id` | Delete user by ID | **Yes** |
| **Auth (Legacy)** | | | |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user | No |
| `POST` | `/api/auth/logout` | Logout user | No |
| `GET` | `/api/auth/profile` | Get current user's profile | **Yes** |
| `GET` | `/api/auth/verify` | Verify token | **Yes** |
| `GET` | `/api/auth/me` | Alias for profile | **Yes** |

## Content Management

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **Common Content** | | | |
| `GET` | `/api/content/common` | List all common content | No |
| `GET` | `/api/content/common/:key` | Get common content by key | No |
| `PUT` | `/api/content/common/:key` | Create/Update common content | **Yes** |
| `DELETE` | `/api/content/common/:key` | Delete common content | **Yes** |
| **Page Content** | | | |
| `GET` | `/api/content/pages` | List all pages | Optional |
| `GET` | `/api/content/pages/:slug` | Get page content by slug | Optional |
| `PUT` | `/api/content/pages/:slug` | Create/Update page content | **Yes** |
| `DELETE` | `/api/content/pages/:slug` | Delete page content | **Yes** |

## Pages Management (Dashboard)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/pages` | Get all pages (metadata) | **Yes** |
| `POST` | `/api/pages` | Create a new page | **Yes** |
| `GET` | `/api/pages/:slug` | Get page details by slug | **Yes** |
| `PUT` | `/api/pages/:slug` | Update page details | **Yes** |
| `DELETE` | `/api/pages/:slug` | Delete page | **Yes** |
| `GET` | `/api/pages/:slug/history` | Get page version history | **Yes** |
| `POST` | `/api/pages/:slug/restore/:version` | Restore page version | **Yes** |

## Blog Management

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blog` | List blog posts | Optional |
| `POST` | `/api/blog` | Create blog post | **Yes** |
| `GET` | `/api/blog/:slug` | Get blog post by slug | Optional |
| `PUT` | `/api/blog/:slug` | Update blog post | **Yes** |
| `DELETE` | `/api/blog/:slug` | Delete blog post | **Yes** |

## File Uploads

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload/image` | Upload single image | **Yes** |
| `DELETE` | `/api/upload/image` | Delete image | **Yes** |
| `POST` | `/api/upload/images` | Upload multiple images | **Yes** |
| `GET` | `/api/upload/list` | List images | **Yes** |
| `GET` | `/api/upload/list/:folder` | List images in specific folder | **Yes** |

## Administration

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/status` | Get system status | No |
| `GET` | `/api/health` | Health check | No |
