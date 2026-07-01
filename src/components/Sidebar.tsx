'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Campaigns', href: '/campaigns', icon: '📧' },
    { label: 'Appointments', href: '/appointments', icon: '📅' },
    { label: 'Reports', href: '/reports', icon: '📈' },
    { label: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    router.push('/login');
  };

  return (
    <div style={{display: 'flex', height: '100vh'}}>
      {/* Sidebar */}
      <div style={{width: open ? '256px' : '80px', background: '#1f2937', color: 'white', transition: 'width 0.3s', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}>
        
        {/* Header */}
        <div style={{padding: '16px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          {open && <h1 style={{fontSize: '18px', fontWeight: 'bold'}}>Revenue</h1>}
          <button onClick={() => setOpen(!open)} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px'}}>☰</button>
        </div>

        {/* Nav Items */}
        <nav style={{flex: 1, padding: '16px', space: '8px'}}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '6px',
                color: pathname === item.href ? 'white' : '#9ca3af',
                background: pathname === item.href ? '#4f46e5' : 'transparent',
                textDecoration: 'none',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span style={{fontSize: '20px'}}>{item.icon}</span>
              {open && <span style={{fontSize: '14px'}}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div style={{padding: '16px', borderTop: '1px solid #374151'}}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            {open ? 'Logout' : '←'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{flex: 1, overflow: 'auto', background: '#f3f4f6'}}>
        {/* Will be filled by page content */}
      </div>
    </div>
  );
}