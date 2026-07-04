'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUnreadCount(token);
    const interval = setInterval(() => fetchUnreadCount(token), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/notifications/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const unread = Array.isArray(data) ? data.filter((n: any) => !n.read).length : 0;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    localStorage.removeItem('team_id');
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Campaigns', path: '/campaigns', icon: '📧' },
    { label: 'Templates', path: '/templates', icon: '✏️' },
    { label: 'Analytics', path: '/analytics', icon: '📈' },
    { label: 'Pricing', path: '/pricing', icon: '💰' },
  ];

  const settingsItems = [
    { label: 'Settings', path: '/settings', icon: '⚙️' },
    { label: 'Billing', path: '/settings/billing', icon: '💳' },
    { label: 'Team', path: '/team', icon: '👥' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '250px' : '80px',
        background: '#1f2937',
        color: 'white',
        padding: '24px 16px',
        transition: 'width 0.3s',
        overflowY: 'auto',
        borderRight: '1px solid #374151'
      }}>
        {/* Logo */}
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '32px',
          textAlign: sidebarOpen ? 'left' : 'center',
          cursor: 'pointer'
        }}
        onClick={() => router.push('/dashboard')}>
          {sidebarOpen ? '🏠 GrowthHouse' : '🏠'}
        </div>

        {/* Main Navigation */}
        <div style={{ marginBottom: '32px' }}>
          {sidebarOpen && <p style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', margin: '0 0 12px 0' }}>MAIN</p>}
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#d1d5db',
                textDecoration: 'none',
                marginBottom: '8px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = '#374151'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <span>{item.icon}</span>
                {sidebarOpen && <span style={{ fontSize: '14px' }}>{item.label}</span>}
              </div>
            </Link>
          ))}
        </div>

        {/* Settings Navigation */}
        <div style={{ marginBottom: '32px' }}>
          {sidebarOpen && <p style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', margin: '0 0 12px 0' }}>SETTINGS</p>}
          {settingsItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#d1d5db',
                textDecoration: 'none',
                marginBottom: '8px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = '#374151'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <span>{item.icon}</span>
                {sidebarOpen && <span style={{ fontSize: '14px' }}>{item.label}</span>}
              </div>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          borderRadius: '6px',
          cursor: 'pointer',
          color: '#d1d5db',
          marginTop: '32px',
          borderTop: '1px solid #374151',
          paddingTop: '24px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = '#374151'}
        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        onClick={handleLogout}>
          <span>🚪</span>
          {sidebarOpen && <span style={{ fontSize: '14px' }}>Logout</span>}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{
          background: 'white',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}>
            {sidebarOpen ? '←' : '→'}
          </button>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/notifications">
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '24px'
              }}>
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}