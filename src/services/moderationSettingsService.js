import api from './api';

export const moderationSettingsService = {
  get: () => api.get('/moderation/settings'),
  update: (payload) => api.put('/moderation/settings', payload)
};
