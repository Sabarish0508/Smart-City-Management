import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, X, AlertCircle, Info, CheckCircle2, Clock } from 'lucide-react';
import { notificationsAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsAPI.getMy();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (item) => {
    const isAlreadyRead = item.isRead ?? item.read;
    if (!isAlreadyRead) {
      try {
        await notificationsAPI.markAsRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true, read: true } : n))
        );
      } catch (e) {}
    }
    if (item.relatedComplaintNumber) {
      navigate(`/track/${item.relatedComplaintNumber}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '380px',
          height: '100vh',
          maxHeight: '100vh',
          borderRadius: '16px 0 0 16px',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slide-left 0.25s ease-out',
        }}
      >
        <div
          style={{
            padding: '1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
              Notifications
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleMarkAllRead}
              title="Mark all as read"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
            >
              <CheckCheck size={12} /> Mark Read
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              Loading alerts...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <Bell size={36} color="#334155" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: '0.9rem' }}>No notifications found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {notifications.map((n) => {
                const isRead = n.isRead ?? n.read;
                return (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    style={{
                      background: isRead ? 'rgba(15, 23, 42, 0.4)' : 'rgba(30, 41, 59, 0.7)',
                      border: `1px solid ${isRead ? 'rgba(255,255,255,0.05)' : 'rgba(56, 189, 248, 0.3)'}`,
                      borderRadius: '10px',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: isRead ? '#cbd5e1' : '#38bdf8' }}>
                        {n.title}
                      </h4>
                      {!isRead && (
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#38bdf8', marginTop: '4px' }} />
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '6px' }}>
                      {n.message}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#64748b' }}>
                      {n.relatedComplaintNumber ? (
                        <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>
                          {n.relatedComplaintNumber}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
