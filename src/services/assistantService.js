import api from './api';

export const assistantService = {
  sendMessage: (payload) => api.post('/assistant/message', payload),
  listConversations: () => api.get('/assistant/conversations'),
  getMessages: (convId) => api.get(`/assistant/conversations/${convId}/messages`)
};
