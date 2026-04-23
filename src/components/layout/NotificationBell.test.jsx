import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import NotificationBell from './NotificationBell';
import notificationService from '../../services/notification.service';

jest.mock('../../services/notification.service', () => ({
  __esModule: true,
  default: {
    getNotifications: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
  },
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe('NotificationBell', () => {
  let container;
  let root;

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  test('reads unread item and navigates to contract detail', async () => {
    const onNavigate = jest.fn();
    notificationService.getNotifications.mockResolvedValue({
      unreadCount: 1,
      items: [
        {
          id: 9,
          title: 'Yeni onay',
          message: 'Onay bekleyen sozlesme var',
          read: false,
          contractId: 77,
          createdAt: '2026-04-18T12:00:00Z',
        },
      ],
    });
    notificationService.markAsRead.mockResolvedValue({});

    await act(async () => {
      root.render(<NotificationBell onNavigate={onNavigate} />);
    });
    await flush();

    const bellButton = container.querySelector('button[aria-label="Bildirimler"]');
    expect(bellButton).not.toBeNull();

    await act(async () => {
      bellButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const itemButton = Array.from(container.querySelectorAll('button')).find(
      (el) => el.textContent && el.textContent.includes('Yeni onay')
    );
    expect(itemButton).not.toBeNull();

    await act(async () => {
      itemButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(notificationService.markAsRead).toHaveBeenCalledWith(9);
    expect(onNavigate).toHaveBeenCalledWith('contract-detail', { contractId: 77 });
  });

  test('marks all notifications as read', async () => {
    notificationService.getNotifications.mockResolvedValue({
      unreadCount: 2,
      items: [
        {
          id: 1,
          title: 'Bildirim 1',
          message: 'Mesaj 1',
          read: false,
          contractId: null,
          createdAt: '2026-04-18T12:00:00Z',
        },
      ],
    });
    notificationService.markAllAsRead.mockResolvedValue({});

    await act(async () => {
      root.render(<NotificationBell />);
    });
    await flush();

    const bellButton = container.querySelector('button[aria-label="Bildirimler"]');
    await act(async () => {
      bellButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const markAllButton = Array.from(container.querySelectorAll('button')).find(
      (el) => el.textContent && el.textContent.includes('Tümünü okundu yap')
    );
    expect(markAllButton).not.toBeNull();

    await act(async () => {
      markAllButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(notificationService.markAllAsRead).toHaveBeenCalledTimes(1);
  });
});
