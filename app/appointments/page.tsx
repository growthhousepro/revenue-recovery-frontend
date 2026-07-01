'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Appointments() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) router.push('/login');
  }, []);

  const appointments = [
    { id: 1, lead: 'John Smith', date: '2026-07-02 10:00 AM', status: 'Scheduled' },
    { id: 2, lead: 'Jane Doe', date: '2026-07-02 2:00 PM', status: 'Completed' },
    { id: 3, lead: 'Bob Johnson', date: '2026-07-03 11:00 AM', status: 'Scheduled' },
  ];

  return (
    <ProtectedLayout>
      <div>
        <h1 style={{fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '32px'}}>Appointments</h1>

        <div style={{background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead style={{background: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
              <tr>
                <th style={{padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#111827'}}>Lead Name</th>
                <th style={{padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#111827'}}>Date & Time</th>
                <th style={{padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#111827'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td style={{padding: '12px 16px', color: '#111827'}}>{apt.lead}</td>
                  <td style={{padding: '12px 16px', color: '#111827'}}>{apt.date}</td>
                  <td style={{padding: '12px 16px'}}>
                    <span style={{background: apt.status === 'Completed' ? '#d1fae5' : '#bfdbfe', color: apt.status === 'Completed' ? '#065f46' : '#1e40af', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600'}}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedLayout>
  );
}