import api from "./api";

export const adminService = {
  stats: () => api.get("/admin/stats"),
  users: () => api.get("/admin/users"),
  pickups: () => api.get("/admin/pickups"),
  reassignPickup: (requestId, collectorId) => api.put(`/admin/pickups/${requestId}/reassign`, { collector_id: collectorId }),
  collectorProfiles: () => api.get("/admin/collectors/profiles"),
  verifyCollector: (collectorId, isVerified) => api.put(`/admin/collectors/${collectorId}/verify`, { is_verified: isVerified }),
  notifications: () => api.get("/notifications"),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`),
  sendNotification: (data) => api.post(`/notifications/send`, data),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  payments: () => api.get("/payments/all")
};
