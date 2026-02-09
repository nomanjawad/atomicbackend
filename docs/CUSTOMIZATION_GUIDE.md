# Customization Guide — WOWDash React Admin Template

This document explains where and how to customize everything in this project so you can quickly adapt it to your brand and production needs. It targets designers and developers who want to change visuals, pages, navigation, assets, deployment settings and more.

---

## Quick overview (what to change and where)

- Project root / config
  - package.json — update project name, scripts, dependencies.
  - .env (create if needed) — environment variables, API base URL, feature flags.
- Public / static files
  - public/index.html — top-level meta tags, title, favicon references.
  - public/assets/\* — CSS, fonts, images, webfonts. Change logos, icons and images here.
- Application entry & routing
  - src/index.js — React entry and bootstrap code.
  - src/App.js — where all routes are declared (React Router v6). Add, remove or rename URL paths here.
- Global layout & navigation
  - src/masterLayout/MasterLayout.jsx — main sidebar/header/footer/navigation. Update menu items, links, and layout logic here.
- Components & pages
  - src/components/\* — re-usable components (cards, forms, widgets, etc.) and their child components.
  - src/pages/\* — page containers that mount the components (use these to add new pages, modify examples).
- Styling
  - public/assets/css/style.css and other CSS files — global theming and utility classes.
  - Component-level inline classes (most UI uses utility classes). To add CSS modules or styled-components, include them at component level.
- Hooks, helpers & store
  - src/hook — shared React hooks.
  - src/helper — utilities, route helpers, scroll-to-top helper, etc.
- API / data
  - src/helper/api or src/services (if present) — update base URLs and endpoint handling.
- Deployment
  - Build with `npm run build` or `yarn build`. Host on static hosting (Netlify, Vercel, S3) or serve with Node.

---

## Step-by-step customization checklist

1. Update project metadata

   - Edit `package.json` "name", "version" and `README.md`.

2. Brand, favicon & meta

   - Replace `public/assets/images/wow-dash-favicon.png` and `public/assets/images/favicon.png` with your own icons. Update references in `public/index.html`.
   - Edit <title> and meta description inside `public/index.html`.

3. Global styles & fonts

   - Modify `public/assets/css/style.css` to change global variables, fonts and base spacing.
   - Fonts: `public/assets/webfonts/` contains font resources. Replace or update with licensed fonts.
   - To add a new CSS file, add it to `public/index.html` or import into `src/index.js`.

4. Colors & theme tokens

   - Search `public/assets/css/style.css` for color variables (primary, secondary, accent). Update them consistently.
   - If you want dynamic theming (dark/light toggle), modify `src/components/SwitchLayer.jsx` and `src/masterLayout` and introduce a theme context/provider.

5. Header / Sidebar / Navigation

   - Update `src/masterLayout/MasterLayout.jsx` to change links, icons and structure.
   - Menu labels and routes can be renamed, reordered and grouped in `MasterLayout.jsx`.
   - For permissions-based visibility, add logic in MasterLayout to show/hide items.

6. Adding/Removing Pages & Routes

   - Add a React component under `src/pages/` (e.g., `MyPage.jsx`).
   - Import the new page into `src/App.js` and create a <Route path='/my-page' element={<MyPage />} /> entry.
   - Update any menus in `src/masterLayout` to link to the new path.

7. Components & Reuse

   - Reusable UI pieces are in `src/components/`. Modify or copy layers to create new variants (e.g., `ButtonLayer.jsx`).
   - Keep design-only changes in component JSX/CSS; keep business logic separate in hooks or helpers.

8. Forms & validation

   - Many components use native form validation or small validation utilities. For advanced validation install and integrate `react-hook-form` or `yup`.

9. Images / icons

   - Replace images in `public/assets/images/` and update references. For SVG icons stored in `public/assets/fonts` or `webfonts`, swap files carefully and keep the same CSS classes where possible.

10. Environment, API & secrets

    - Add a `.env` file for environment-specific values: REACT_APP_API_BASE_URL, REACT_APP_FEATURE_FLAG, etc.
    - Never commit sensitive keys to the repository.

11. Build & deploy

    - Install dependencies: `npm install` or `yarn`.
    - Run development server: `npm start`.
    - Build production bundle: `npm run build`.
    - For single-page-app routing on static hosts, ensure `_redirects` or proper fallback settings exist (see `public/_redirects`).

12. I18n / localization

    - If you need multi-language support, add `i18next` or `react-intl` and move strings out of components into translation files.

13. Accessibility & SEO

    - Use semantic HTML, alt tags for images, proper ARIA attributes, and ensure keyboard navigation works.
    - Add meta tags and structured data in `public/index.html` for SEO.

14. Tests & CI

    - Unit tests: `src/*.test.js` files and `npm test`.
    - Add pipeline with GitHub Actions / GitLab CI to run tests and build output.

15. Extending with new dependencies
    - Install npm packages and update `package.json`.
    - Keep an eye on bundle size; add lazy-loading for heavy libraries.

---

## Example edits — quick recipes

### Replace the logo & favicon

- Files to edit: `public/assets/images/wow-dash-favicon.png`, `public/assets/images/favicon.png`, any logo files under `public/assets/images/`.
- Steps:
  1. Replace the image file(s) with same filename or update references in `src/masterLayout`/`index.html`.
  2. Clear caches and rebuild.

### Add a new route page

- Files to edit: `src/pages/MyNewPage.jsx` (create), `src/App.js` (import and add route), `src/masterLayout/MasterLayout.jsx` (add menu link).

### Change primary color

- Files to edit: `public/assets/css/style.css` — look for variables like `--primary` or classes `.btn-primary` and update values.

### Add a new API base URL

- Create `.env` in project root and add `REACT_APP_API_BASE_URL=https://api.myapp.com`.
- Access it in code: `process.env.REACT_APP_API_BASE_URL`.

---

## Project structure reference (short)

- public/ — static site files and assets
- src/ — React app code
  - src/App.js — router and top-level routes
  - src/index.js — app bootstrapping
  - src/masterLayout/ — layout, header, sidebar
  - src/components/ — visual building blocks
  - src/pages/ — top-level page containers
  - src/hook — custom hooks
  - src/helper — utility helpers

---

## Tips & best practices

- Keep brand assets and custom CSS in a `public/assets/custom/` or `src/styles/` folder for easier upgrades.
- Avoid editing vendor library files inside `public/assets` directly if you plan to upgrade the template later. Prefer adding overriding CSS in a separate file that loads after vendor CSS.
- Maintain small, focused components for easier reuse and testing.
- Use a theme provider (React context) if you need dynamic theme switching.
- Document changes in your `README.md` so future devs know where the customizations are.

---

## Where to get help

- Search the `src/components` and `src/pages` folders to locate UI you want to change.
- If unsure, ask for help and include the file path you're editing and the expected behaviour.

---

If you'd like, I can now:

- produce a shorter `README` section with direct links to the most commonly edited files, or
- walk you through changing a specific part of the UI (logo, color, or add a route).

Happy customizing! 🎨🔧
