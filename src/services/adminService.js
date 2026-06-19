import api from "./api";

export const adminService = {
  stats: () => api.get("/admin/stats"),
  users: () => api.get("/admin/users"),
  pickups: () => api.get("/admin/pickups"),
  companies: () => api.get("/admin/companies"),
  trucks: () => api.get("/admin/trucks"),
  notifications: () => api.get("/notifications"),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`),
  sendNotification: (data) => api.post(`/notifications/send`, data),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status })
};
