import api from "./api";

export const assignmentService = {
  availableRequests: () => api.get("/assignments/available"),
  acceptRequest: (collectionRequestId) => api.post("/assignments/accept", { collection_request_id: collectionRequestId }),
  myAssignments: () => api.get("/assignments/my-assignments"),
  collectorJobs: () => api.get("/assignments/my-assignments"), // Alias for backwards compatibility
  updateStatus: (id, status) => api.put(`/assignments/${id}/status`, { status }),
  complete: (id, formData) => api.put(`/assignments/${id}/complete`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  cancel: (id, reason) => api.put(`/assignments/${id}/cancel`, { cancellation_reason: reason })
};
