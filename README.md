# Admin Dashboard Template

A comprehensive, feature-rich React admin dashboard template built with React 18, Bootstrap 5, and modern technologies. This template provides an extensive collection of pre-built UI components, pages, and examples to accelerate your admin panel development.

## 📋 Project Overview

**amco-admin** is a production-ready admin dashboard template that includes:

- **Multiple Dashboard Layouts** - 11 different dashboard variations for various use cases
- **100+ Pre-built Pages** - Complete page examples covering common admin scenarios
- **50+ UI Components** - Reusable components for building custom interfaces
- **Authentication Pages** - Sign in, sign up, forgot password, and access control
- **Data Management** - Tables, invoices, galleries, and kanban boards
- **Content Management** - Blog, marketplace, portfolio, and media management
- **AI Integration** - Code, image, text, and voice generator pages
- **Advanced Widgets** - Charts, calendars, notifications, and interactive elements
- **Responsive Design** - Mobile-friendly layouts built with Bootstrap 5
- **Modern Stack** - React Router v6, ApexCharts, FullCalendar, and more

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/niloygazi/amco-admin.git
cd amco-admin
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
amco-admin/
├── public/               # Static files
│   ├── assets/
│   │   ├── css/         # Stylesheets
│   │   ├── fonts/       # Custom fonts
│   │   ├── images/      # Image assets
│   │   └── webfonts/    # Web font files
│   ├── index.html       # Main HTML file
│   └── _redirects       # Netlify redirects
├── src/
│   ├── components/      # Reusable React components (50+ components)
│   │   └── child/       # Child components
│   ├── pages/           # Page components (100+ pages)
│   ├── masterLayout/    # Main layout wrapper
│   ├── helper/          # Utility functions and helpers
│   ├── hook/            # Custom React hooks
│   ├── App.js           # Main app component with routing
│   ├── index.js         # React entry point
│   └── setupTests.js    # Test configuration
├── docs/
│   └── CUSTOMIZATION_GUIDE.md  # Detailed customization instructions
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 📦 Available Scripts

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder. The build is optimized and minified, ready for deployment.

### `npm run eject`

**Note: this is a one-way operation.** Ejects the Create React App configuration, giving you full control over webpack, Babel, and other build tools.

## 🛠 Technologies & Dependencies

### Core Framework

- **React** 18.2.0 - UI library
- **React DOM** 18.2.0 - DOM rendering
- **React Router DOM** 6.22.1 - Client-side routing

### UI & Styling

- **Bootstrap** 5.3.3 - CSS framework
- **React Bootstrap** 2.10.5 - Bootstrap components
- **Sass** 1.71.1 - CSS preprocessing

### Charts & Visualization

- **ApexCharts** 4.3.0 - Modern charting library
- **React ApexCharts** 1.7.0 - React wrapper for ApexCharts
- **Isotope Layout** 3.0.6 - Masonry grid layout

### Calendar & Date

- **FullCalendar** 6.1.10 - Event calendar with React support
- **React DatePicker** 7.4.0 - Date selection component
- **FlatPickr** 4.6.13 - Lightweight date picker

### Data & Tables

- **DataTables.net** 2.1.8 - Advanced table plugin with sorting/filtering
- **@dnd-kit** - Drag and drop utilities
- **@hello-pangea/dnd** - Drag and drop library

### Rich Text & Code

- **React Quill** 2.0.0 & 3.3.3 - Rich text editor
- **Highlight.js** 11.10.0 - Code syntax highlighting

### Notifications & UI Effects

- **React Toastify** 10.0.5 - Toast notifications
- **React Modal Video** 2.0.2 - Modal video player
- **React Scroll to Top** 3.0.0 - Smooth scroll functionality
- **Animate.css** 4.1.1 - CSS animations
- **WOW.js** 1.1.3 - Scroll animation library

### Carousel & Sliders

- **React Slick** 0.30.2 - Carousel component
- **Slick Carousel** 1.8.1 - Carousel library
- **React Slider** 2.0.6 - Range slider
- **React Fast Marquee** 1.6.5 - Scrolling text

### Icons & Utilities

- **Phosphor Icons** 2.1.7 - Icon library
- **Iconify** 5.0.2 - Icon framework
- **jQuery** 3.7.1 - Utility library
- **JSVectorMap** 1.3.1 - Interactive vector maps
- **UUID** 10.0.0 - Unique ID generation
- **Popper.js** 2.11.8 - Tooltip positioning

### Testing

- **@testing-library/react** 13.4.0
- **@testing-library/jest-dom** 5.17.0
- **@testing-library/user-event** 13.5.0

## 🎨 Component Categories

The template includes components organized as follows:

**Layout Components**: MasterLayout, Breadcrumb
**Form Components**: FormLayout, FormValidation, FormPage
**Table Components**: TableBasic, TableData
**Chart Components**: LineChart, ColumnChart, PieChart
**Gallery Components**: GalleryGrid, GalleryHover, GalleryMasonry
**Notification Components**: Alert, Notification, Toast
**Modal & Overlay**: Modal components, popup dialogs
**Data Visualization**: Calendar, Kanban board, Invoice management
**Authentication**: SignIn, SignUp, ForgotPassword, AccessDenied
**AI Features**: Code Generator, Image Generator, Text Generator, Voice Generator, Video Generator

## 📄 Dashboard Layouts

The template includes **11 different dashboard layouts**:

- DashBoardLayerOne through DashBoardLayerEleven
- **7 complete home page variations**: HomePageOne through HomePageSeven

Each layout and home page provides different design patterns and component combinations to suit various business needs.

## 🔧 Customization

For detailed customization instructions including branding, routes, layout, assets, CSS, and deployment, see the **[Customization Guide](docs/CUSTOMIZATION_GUIDE.md)** for step-by-step guidance.

Key customization areas:

- **Routing**: Add/remove/rename routes in `src/App.js`
- **Navigation**: Update menu items in `src/masterLayout/MasterLayout.jsx`
- **Styling**: Modify CSS in `public/assets/css/style.css`
- **Components**: Create custom components in `src/components/`
- **Pages**: Add new pages in `src/pages/`
- **Assets**: Update logos and images in `public/assets/`

## 🚀 Deployment

The project is configured for easy deployment:

- Build: `npm run build`
- Output: `build/` folder (ready for static hosting)
- Redirect rules included for Netlify (`public/_redirects`)

### Deployment Platforms

- Netlify
- Vercel
- GitHub Pages
- Traditional web servers (Apache, Nginx)
- Cloud platforms (AWS, Azure, Google Cloud)

## 📚 Learn More

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/)
- [React Router Documentation](https://reactrouter.com/)
- [Bootstrap Documentation](https://getbootstrap.com/)
- [ApexCharts Documentation](https://apexcharts.com/)

## 📝 Notes

- The template uses Create React App for build tooling
- All pages are responsive and mobile-friendly
- Components use Bootstrap utility classes for styling
- The project supports customization while maintaining the core structure
- Code splitting and lazy loading ready for optimization

## 📄 License

This project is part of the amco-admin React Admin Template collection.

---
