'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '256px', background: '#1f2937', color: 'white', padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>Revenue Recovery</h1>
        
        <a href="/dashboard" style={{ padding: '12px 16px', marginBottom: '8px', color: '#9ca3af', textDecoration: 'none', borderRadius: '6px' }}>📊 Dashboard</a>
        <a href="/campaigns" style={{ padding: '12px 16px', marginBottom: '8px', color: '#9ca3af', textDecoration: 'none', borderRadius: '6px' }}>📧 Campaigns</a>
        <a href="/appointments" style={{ padding: '12px 16px', marginBottom: '8px', color: '#9ca3af', textDecoration: 'none', borderRadius: '6px' }}>📅 Appointments</a>
        <a href="/reports" style={{ padding: '12px 16px', marginBottom: '8px', color: '#9ca3af', textDecoration: 'none', borderRadius: '6px' }}>📈 Reports</a>
        <a href="/settings" style={{ padding: '12px 16px', marginBottom: '24px', color: '#9ca3af', textDecoration: 'none', borderRadius: '6px' }}>⚙️ Settings</a>
        
        <button onClick={() => { localStorage.removeItem('access_token'); router.push('/login'); }} style={{ background: '#dc2626', color: 'white', padding: '10px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginTop: 'auto' }}>Logout</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: '#f3f4f6', padding: '32px' }}>
        {children}
      </div>
    </div>
  );
}