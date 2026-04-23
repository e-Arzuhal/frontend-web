import notificationService from './notification.service';
import api from './api.service';

jest.mock('./api.service', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getNotifications maps payload and unread count', async () => {
    api.get
      .mockResolvedValueOnce([
        {
          id: 7,
          title: 'Yeni onay',
          message: 'Onay bekleyen sozlesme var',
          createdAt: '2026-04-18T12:00:00Z',
          contractId: 44,
          type: 'CONTRACT_PENDING_APPROVAL',
          read: 0,
        },
      ])
      .mockResolvedValueOnce({ unreadCount: '1' });

    const result = await notificationService.getNotifications();

    expect(api.get).toHaveBeenNthCalledWith(1, '/api/notifications');
    expect(api.get).toHaveBeenNthCalledWith(2, '/api/notifications/unread-count');
    expect(result.unreadCount).toBe(1);
    expect(result.items).toEqual([
      {
        id: 7,
        title: 'Yeni onay',
        message: 'Onay bekleyen sozlesme var',
        createdAt: '2026-04-18T12:00:00Z',
        contractId: 44,
        type: 'CONTRACT_PENDING_APPROVAL',
        read: false,
      },
    ]);
  });

  test('markAsRead sends patch request', async () => {
    api.patch.mockResolvedValueOnce({});

    await notificationService.markAsRead(9);

    expect(api.patch).toHaveBeenCalledWith('/api/notifications/9/read');
  });

  test('markAllAsRead sends patch request', async () => {
    api.patch.mockResolvedValueOnce({});

    await notificationService.markAllAsRead();

    expect(api.patch).toHaveBeenCalledWith('/api/notifications/read-all');
  });
});
