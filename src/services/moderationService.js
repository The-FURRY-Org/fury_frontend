import api from './api';

export const moderationService = {
  list: (params) => api.get('/moderation', { params }),
  get: (id) => api.get(`/moderation/${id}`)
};
