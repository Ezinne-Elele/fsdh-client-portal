import api from './api';

export const notificationService = {
  async getNotifications(params = {}) {
    const response = await api.get('/api/notifications', { params });
    return response.data;
  },

  async markAsRead(notificationId) {
    const response = await api.post(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.post('/api/notifications/read-all');
    return response.data;
  },

  async getPreferences() {
    const response = await api.get('/api/notifications/preferences');
    return response.data;
  },

  async updatePreferences(preferences) {
    const response = await api.put('/api/notifications/preferences', preferences);
    return response.data;
  },
};

