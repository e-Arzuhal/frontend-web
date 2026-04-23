import api from './api.service';

const mapNotification = (n) => ({
  id: n.id,
  title: n.title,
  message: n.message,
  createdAt: n.createdAt,
  contractId: n.contractId,
  type: n.type,
  read: Boolean(n.read),
});

const notificationService = {
  async getNotifications() {
    const [itemsRaw, countRaw] = await Promise.all([
      api.get('/api/notifications'),
      api.get('/api/notifications/unread-count'),
    ]);

    const items = (itemsRaw || []).map(mapNotification);

    return {
      items,
      unreadCount: Number(countRaw?.unreadCount || 0),
    };
  },

  async markAsRead(notificationId) {
    await api.patch(`/api/notifications/${notificationId}/read`);
  },

  async markAllAsRead() {
    await api.patch('/api/notifications/read-all');
  },
};

export default notificationService;
