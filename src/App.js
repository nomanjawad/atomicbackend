import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Pages from "./pages/Pages";
import PageEditor from "./components/pages/PageEditor";
import ContactPageEditor from "./components/pages/ContactPageEditor";
import PageHistory from "./pages/PageHistory";

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />

            {/* Pages routes */}
            <Route path="pages" element={<Pages />} />
            <Route path="pages/new" element={<PageEditor />} />
            <Route path="pages/new/contact" element={<ContactPageEditor />} />
            <Route path="pages/edit/:slug" element={<PageEditor />} />
            <Route
              path="pages/edit/contact/:slug"
              element={<ContactPageEditor />}
            />
            <Route path="pages/:slug/history" element={<PageHistory />} />

            {/* Placeholder routes - to be implemented */}
            <Route
              path="blog"
              element={
                <div className="p-6 text-gray-600 dark:text-gray-400">
                  Blog coming soon...
                </div>
              }
            />
            <Route
              path="media"
              element={
                <div className="p-6 text-gray-600 dark:text-gray-400">
                  Media coming soon...
                </div>
              }
            />
            <Route
              path="analytics"
              element={
                <div className="p-6 text-gray-600 dark:text-gray-400">
                  Analytics coming soon...
                </div>
              }
            />
            <Route
              path="settings"
              element={
                <div className="p-6 text-gray-600 dark:text-gray-400">
                  Settings coming soon...
                </div>
              }
            />
            <Route
              path="profile"
              element={
                <div className="p-6 text-gray-600 dark:text-gray-400">
                  Profile coming soon...
                </div>
              }
            />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
