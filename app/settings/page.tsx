'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [senderEmail, setSenderEmail] = useState('');
  const [notifyOnReply, setNotifyOnReply] = useState(true);
  const [notifyOnBooking, setNotifyOnBooking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchSettings(token);
  }, []);

  const fetchSettings = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      // Get user info
      const userRes = await fetch('http://localhost:8000/api/auth/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        // setSenderEmail is handled after fetching notifications
      }

      // Get notification preferences
      const notifRes = await fetch('http://localhost:8000/api/notifications/preferences', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifyOnReply(notifData.notify_on_reply);
        setNotifyOnBooking(notifData.notify_on_booking);
      }
    } catch (error: any) {
      setError(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmail(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch('http://localhost:8000/api/auth/update-sender-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sender_email: senderEmail }),
      });

      if (res.ok) {
        setSuccess('Sender email updated successfully!');
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to update email');
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch('http://localhost:8000/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          notify_on_reply: notifyOnReply,
          notify_on_booking: notifyOnBooking,
        }),
      });

      if (res.ok) {
        setSuccess('Notification preferences updated successfully!');
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to update preferences');
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setSavingNotifications(false);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <p>Loading settings...</p>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: '0 0 32px 0' }}>Settings</h1>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{error}</div>}
        {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{success}</div>}

        {/* Sender Email */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Email Settings</h2>
          
          <form onSubmit={handleSaveEmail} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
                Sender Email Address
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="your-email@company.com"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#111827',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '11px', color: '#4b5563', margin: '4px 0 0 0' }}>
                This email will be used as the "From" address when sending campaigns
              </p>
            </div>

            <button
              type="submit"
              disabled={savingEmail}
              style={{
                background: '#4f46e5',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: savingEmail ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                opacity: savingEmail ? 0.6 : 1,
              }}
            >
              {savingEmail ? 'Saving...' : 'Save Email'}
            </button>
          </form>
        </div>

        {/* Notification Preferences */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Notification Preferences</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>Email Replies</p>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0 0 0' }}>Get notified when someone replies to your campaign</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifyOnReply}
                  onChange={(e) => setNotifyOnReply(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>Booking Confirmations</p>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0 0 0' }}>Get notified when a booking is confirmed and charged</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifyOnBooking}
                  onChange={(e) => setNotifyOnBooking(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>

          <button
            onClick={handleSaveNotifications}
            disabled={savingNotifications}
            style={{
              background: '#4f46e5',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: savingNotifications ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              opacity: savingNotifications ? 0.6 : 1,
            }}
          >
            {savingNotifications ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </ProtectedLayout>
  );
}