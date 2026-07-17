import api from "./api";

export const educationService = {
  list: () => api.get("/education"),
  upload: (formData) => api.post("/education", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  remove: (id) => api.delete(`/education/${id}`)
};
