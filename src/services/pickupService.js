import api from "./api";

export const pickupService = {
  create: (formData) => api.post("/collections", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  myRequests: () => api.get("/collections/my-requests"),
  getById: (id) => api.get(`/collections/${id}`),
  cancel: (id) => api.put(`/collections/${id}/cancel`),
  pending: () => api.get("/collections/pending/all"),
  all: () => api.get("/collections/all")
};
