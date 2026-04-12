import React, { useEffect, useMemo, useRef, useState } from 'react';
import { colors, radius, fonts } from '../../styles/tokens';
import notificationService from '../../services/notification.service';

const BellIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const formatDate = (dateValue) => {
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export default function NotificationBell({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      setItems(res.items);
      setUnreadCount(res.unreadCount);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const emptyText = useMemo(() => (loading ? 'Yükleniyor...' : 'Bildirim bulunmuyor.'), [loading]);

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Sessizce geç; bir sonraki refresh gerçek durumu çeker.
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label="Bildirimler"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.full,
          border: `1px solid ${colors.border}`,
          background: colors.surface,
          color: colors.text,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -2,
            minWidth: 18,
            height: 18,
            borderRadius: radius.full,
            background: colors.error,
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 5px',
            border: `2px solid ${colors.card}`,
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 48,
          right: 0,
          width: 360,
          maxHeight: 420,
          overflow: 'hidden',
          borderRadius: radius.lg,
          border: `1px solid ${colors.border}`,
          background: colors.card,
          boxShadow: '0 10px 30px rgba(0,0,0,0.16)',
          zIndex: 120,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <strong style={{ fontFamily: fonts.body, fontSize: 14, color: colors.text }}>Bildirimler</strong>
            <button
              type="button"
              onClick={markAllRead}
              style={{
                border: 'none',
                background: 'transparent',
                color: colors.primary,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Tümünü okundu yap
            </button>
          </div>

          <div style={{ overflowY: 'auto' }}>
            {items.length === 0 ? (
              <div style={{ padding: '18px 14px', color: colors.textSecondary, fontSize: 13 }}>{emptyText}</div>
            ) : (
              items.map((n) => (
                <button
                  type="button"
                  key={n.id}
                  onClick={async () => {
                    if (n.read) return;
                    try {
                      await notificationService.markAsRead(n.id);
                      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
                      setUnreadCount((c) => Math.max(0, c - 1));

                      if (onNavigate && n.contractId) {
                        onNavigate('contract-detail', { contractId: n.contractId });
                        setOpen(false);
                      }
                    } catch {
                      // Sessizce geç; periodic refresh ile düzelir.
                    }
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: n.read ? colors.card : colors.surfaceAlt,
                    padding: '12px 14px',
                    borderBottom: `1px solid ${colors.border}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{n.title}</span>
                    <span style={{ fontSize: 11, color: colors.textMuted }}>{formatDate(n.createdAt)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>{n.message}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
