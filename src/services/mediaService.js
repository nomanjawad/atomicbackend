import apiClient from "../utils/apiClient";

/**
 * Get all media folders
 */
export const getAllFolders = async () => {
  const response = await apiClient.get("/media/folders");
  return response.data;
};

/**
 * Create a new media folder
 */
export const createFolder = async (name) => {
  const response = await apiClient.post("/media/folders", { name });
  return response.data;
};

/**
 * Delete a folder and all its contents
 */
export const deleteFolder = async (name) => {
  const response = await apiClient.delete(`/media/folders/${name}`);
  return response.data;
};

/**
 * Get all media items by folder
 */
export const getMediaByFolder = async (folderName) => {
  const response = await apiClient.get(`/media/folders/${folderName}/images`);
  return response.data;
};

/**
 * Upload media file
 */
export const uploadMedia = async (formData) => {
  const response = await apiClient.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Get all media with optional filters
 */
export const getAllMedia = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.type) params.append("type", filters.type);
  if (filters.author) params.append("author", filters.author);
  if (filters.date_from) params.append("date_from", filters.date_from);
  if (filters.date_to) params.append("date_to", filters.date_to);
  if (filters.mode) params.append("mode", filters.mode);

  const response = await apiClient.get(`/media?${params.toString()}`);
  return response.data;
};

/**
 * Get media by ID
 */
export const getMediaById = async (id) => {
  const response = await apiClient.get(`/media/${id}`);
  return response.data;
};

/**
 * Update media metadata
 */
export const updateMediaMetadata = async (id, updates) => {
  const response = await apiClient.put(`/media/${id}`, updates);
  return response.data;
};

/**
 * Move media to different folder
 */
export const moveMedia = async (id, newFolder) => {
  const response = await apiClient.patch(`/media/${id}/move`, {
    type: newFolder,
  });
  return response.data;
};

/**
 * Delete single media item
 */
export const deleteMedia = async (id) => {
  const response = await apiClient.delete(`/media/${id}`);
  return response.data;
};

/**
 * Bulk delete media items
 */
export const bulkDeleteMedia = async (ids) => {
  const response = await apiClient.delete("/media", { data: { ids } });
  return response.data;
};
