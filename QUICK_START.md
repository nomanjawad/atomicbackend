# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Backend API running on `http://localhost:3001`

## Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The app will open at `http://localhost:3000`

## First Time Setup

1. **Start your backend API**
   ```bash
   cd path/to/automictemplate-api
   npm run dev
   ```
   Should be running on `http://localhost:3001`

2. **Start the frontend**
   ```bash
   cd path/to/admin-dashboard
   pnpm run dev
   ```

3. **Login**
   - Visit `http://localhost:3000`
   - You'll be redirected to `/login`
   - Enter your credentials (from backend database)
   - Default: `admin@example.com` / `your_password`

## Features Available

### ✅ Login & Authentication
- Login page at `/login`
- Automatic token management
- Protected routes
- Auto-redirect on token expiration

### ✅ Dashboard Home
- Visit `/` after login
- View stats and quick actions
- Dark/Light mode toggle

### ✅ User Management
- Visit `/users`
- View all users
- Create new user
- Edit existing user
- Delete user
- Assign roles (Admin, Moderator, User)

### ✅ Theme Toggle
- Click sun/moon icon in header
- Theme persists across sessions
- Available on login page too

### ✅ User Menu
- Click your avatar in header
- View profile (placeholder)
- Settings (placeholder)
- Logout

## Testing User Management

1. **Create a User**
   - Click "Add User" button
   - Fill in: Email, Password, Name, Role
   - Click "Create"

2. **Edit a User**
   - Click edit icon (pencil) on any user row
   - Update Name or Role
   - Click "Update"

3. **Delete a User**
   - Click delete icon (trash) on any user row
   - Confirm deletion
   - User removed

## API Configuration

If your API runs on a different port, update:

**File:** `src/utils/constants.js`
```javascript
export const API_BASE_URL = 'http://localhost:YOUR_PORT/api';
```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm run dev
```

### API connection errors
1. Check backend is running: `http://localhost:3001/api/health`
2. Check API URL in `src/utils/constants.js`
3. Check CORS settings in backend

### Login not working
1. Verify backend `/api/user/login` endpoint works
2. Check browser console for errors
3. Verify credentials exist in database

### Dark mode not working
- Clear localStorage and refresh
- Check browser console for errors

## Next Steps

After testing Phase 1 (Login + User Management):
1. Test all CRUD operations
2. Test role-based features
3. Test dark mode
4. Test responsive design (mobile/tablet)
5. Report any issues

Then we can proceed with:
- Phase 2: Pages Management
- Phase 3: Blog Management
- Phase 4: Media Library
- Editor.js integration

## Scripts

```bash
# Development
pnpm run dev         # Start dev server

# Production
pnpm run build       # Build for production
pnpm run start       # Serve production build

# Testing
pnpm test            # Run tests
```

## Environment Variables (Future)

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:3001/api
```

Then update `constants.js`:
```javascript
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

## Support

For issues or questions about the next phase, contact the development team.
