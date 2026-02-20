import apiClient from "../utils/apiClient";

export const userService = {
  // Get all users (protected - requires auth)
  async getAllUsers() {
    try {
      const response = await apiClient.get("/user");
      // API returns { users: [...], total: number }
      return {
        users: response.data.users || [],
        total: response.data.total || 0,
      };
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  // Get all users (public - no auth required)
  async getAllUsersPublic() {
    try {
      const response = await apiClient.get("/user/public/all");
      // API returns { users: [...], total: number }
      return {
        users: response.data.users || [],
        total: response.data.total || 0,
      };
    } catch (error) {
      console.error("Error fetching public users:", error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const response = await apiClient.get(`/user/${userId}`);
      // API returns { user: {...} }
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData) {
    try {
      const response = await apiClient.post("/user/register", userData);
      // API returns { user, token, session }
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId, userData) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      // Remove password field for updates (backend doesn't support password updates via this endpoint)
      const { password, ...updateData } = userData;
      const response = await apiClient.put(`/user/${userId}`, updateData);
      // API returns { message, user }
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const response = await apiClient.delete(`/user/${userId}`);
      // API returns { message }
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Update own profile
  async updateProfile(userData) {
    try {
      const response = await apiClient.put("/user/profile", userData);
      // API returns { message, user }
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Delete own profile
  async deleteProfile() {
    try {
      const response = await apiClient.delete("/user/profile");
      // API returns { message }
      return response.data;
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw error;
    }
  },
};
