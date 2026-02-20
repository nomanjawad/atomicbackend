import apiClient from "../utils/apiClient";

export const pageService = {
  // Get all pages
  async getAllPages() {
    try {
      const response = await apiClient.get("/pages");
      return {
        pages: response.data.pages || [],
        total: response.data.total || 0,
      };
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw error;
    }
  },

  // Get page by slug
  async getPageBySlug(slug) {
    try {
      if (!slug) {
        throw new Error("Slug is required");
      }
      const response = await apiClient.get(`/pages/${slug}`);
      return response.data.page;
    } catch (error) {
      console.error("Error fetching page:", error);
      throw error;
    }
  },

  // Create new page
  async createPage(pageData) {
    try {
      const response = await apiClient.post("/pages", pageData);
      return response.data.page;
    } catch (error) {
      console.error("Error creating page:", error);
      throw error;
    }
  },

  // Update page by slug
  async updatePage(slug, pageData) {
    try {
      if (!slug) {
        throw new Error("Slug is required");
      }
      const response = await apiClient.put(`/pages/${slug}`, pageData);
      return response.data.page;
    } catch (error) {
      console.error("Error updating page:", error);
      throw error;
    }
  },

  // Delete page by slug
  async deletePage(slug) {
    try {
      if (!slug) {
        throw new Error("Slug is required");
      }
      const response = await apiClient.delete(`/pages/${slug}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting page:", error);
      throw error;
    }
  },

  // Get page history
  async getPageHistory(slug) {
    try {
      if (!slug) {
        throw new Error("Slug is required");
      }
      const response = await apiClient.get(`/pages/${slug}/history`);
      return {
        page: response.data.page,
        history: response.data.history || [],
      };
    } catch (error) {
      console.error("Error fetching page history:", error);
      throw error;
    }
  },

  // Restore page to specific version
  async restorePageVersion(slug, version) {
    try {
      if (!slug || !version) {
        throw new Error("Slug and version are required");
      }
      const response = await apiClient.post(
        `/pages/${slug}/restore/${version}`,
      );
      return response.data.page;
    } catch (error) {
      console.error("Error restoring page version:", error);
      throw error;
    }
  },
};
