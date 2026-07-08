import api from './api';

export const collectionAssignmentService = {
  myAssignments: () => api.get('/assignments/my-assignments'),
  updateStatus: (id, status) => api.put(`/assignments/${id}/status`, { status }),
  complete: (id, formData) => api.put(`/assignments/${id}/complete`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
};
