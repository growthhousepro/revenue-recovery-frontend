'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchNotifications(token);
    const interval = setInterval(() => fetchNotifications(token), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('http://localhost:8000/api/notifications/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to load notifications');
      }
    } catch (error: any) {
      setError(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    setMarkingRead(notificationId);
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch(`http://localhost:8000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    } finally {
      setMarkingRead(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch('http://localhost:8000/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch(`http://localhost:8000/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reply':
        return '💬';
      case 'booking_confirmed':
        return '🎉';
      case 'follow_up_scheduled':
        return '📅';
      default:
        return '📬';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return '#f0fdf4';
      case 'reply':
        return '#f0f9ff';
      default:
        return '#f9fafb';
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <p>Loading notifications...</p>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Notifications</h1>
            {unreadCount > 0 && (
              <p style={{ fontSize: '14px', color: '#4b5563', margin: '8px 0 0 0' }}>
                {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
          </div>
          <button 
            onClick={() => router.push('/settings')}
            style={{ background: '#e5e7eb', color: '#111827', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
            ⚙️ Preferences
          </button>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{error}</div>}

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            style={{
              background: '#e5e7eb',
              color: '#111827',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              marginBottom: '16px',
              fontSize: '14px'
            }}
          >
            Mark all as read
          </button>
        )}

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              background: filter === 'all' ? '#4f46e5' : '#e5e7eb',
              color: filter === 'all' ? 'white' : '#111827',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            style={{
              background: filter === 'unread' ? '#4f46e5' : '#e5e7eb',
              color: filter === 'unread' ? 'white' : '#111827',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {filteredNotifications.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '8px', padding: '48px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>All caught up! 🎉</p>
            <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>You have no notifications right now</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotifications.map((notification: any) => (
              <div
                key={notification.id}
                style={{
                  background: notification.read ? '#f9fafb' : getNotificationColor(notification.type),
                  padding: '16px',
                  borderRadius: '8px',
                  border: notification.read ? '1px solid #e5e7eb' : `2px solid ${notification.type === 'booking_confirmed' ? '#10b981' : '#3b82f6'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                }}
              >
                <div style={{ flex: 1, marginRight: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                    <span style={{ fontSize: '24px', marginTop: '2px' }}>
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: notification.read ? '500' : '700',
                        color: '#111827',
                        margin: 0
                      }}>
                        {notification.title}
                      </p>
                      <p style={{ fontSize: '13px', color: '#4b5563', margin: '4px 0 0 0' }}>
                        {notification.message}
                      </p>
                      <p style={{ fontSize: '11px', color: '#9ca3af', margin: '6px 0 0 0' }}>
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markingRead === notification.id}
                      style={{
                        background: '#4f46e5',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: markingRead === notification.id ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        opacity: markingRead === notification.id ? 0.6 : 1,
                      }}
                    >
                      Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}