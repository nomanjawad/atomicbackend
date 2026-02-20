import { create } from "zustand";
import { authService } from "../services/authService";

export const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  token: authService.getToken(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  // Set user and token
  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
      error: null,
    }),

  // Update user
  setUser: (user) => set({ user }),

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),

  // Login action
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Login failed",
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Logout action
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ isLoading: false });
      // Still clear auth even if logout API fails
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  // Refresh user profile
  refreshProfile: async () => {
    try {
      const data = await authService.getProfile();
      set({ user: data.user });
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error("Failed to refresh profile:", error);
      throw error;
    }
  },
}));
