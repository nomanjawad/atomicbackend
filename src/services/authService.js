import apiClient from "../utils/apiClient";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";

export const authService = {
  // Login
  async login(email, password) {
    const response = await apiClient.post("/user/login", { email, password });

    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Register
  async register(userData) {
    const response = await apiClient.post("/user/register", userData);

    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Logout
  async logout() {
    try {
      await apiClient.post("/user/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  // Get current user profile
  async getProfile() {
    const response = await apiClient.get("/user/profile");
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
};
