import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUIStore = create(
  persist(
    (set) => ({
      // Theme state
      theme: "light", // 'light' or 'dark'

      // Sidebar state
      sidebarOpen: true,
      sidebarCollapsed: false,

      // Toggle theme
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          // Apply theme to document
          if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { theme: newTheme };
        }),

      // Set theme explicitly
      setTheme: (theme) =>
        set(() => {
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { theme };
        }),

      // Toggle sidebar
      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      // Set sidebar open state
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Toggle sidebar collapsed (for desktop)
      toggleSidebarCollapsed: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      // Set sidebar collapsed state
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: "ui-storage", // localStorage key
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

// Initialize theme on app load
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("ui-storage");
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state.theme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } catch (error) {
      console.error("Error parsing UI storage:", error);
    }
  }
}
