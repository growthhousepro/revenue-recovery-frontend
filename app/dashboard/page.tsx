'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '@/src/components/ProtectedLayout';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ total_campaigns: 0, total_leads: 0, emails_sent: 0, replies: 0 });
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    } else {
      fetchCampaigns(token);
    }
  }, []);

  const fetchCampaigns = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/campaigns/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setCampaigns(data);

      // Calculate stats
      let totalLeads = 0;
      let totalEmails = 0;
      let totalReplies = 0;

      for (const campaign of data) {
        totalLeads += campaign.total_leads;
        totalEmails += campaign.emails_sent;
        totalReplies += campaign.replies_received;
      }

      setStats({
        total_campaigns: data.length,
        total_leads: totalLeads,
        emails_sent: totalEmails,
        replies: totalReplies,
      });
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1280px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '32px', margin: 0 }}>Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>Total Campaigns</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>{stats.total_campaigns}</p>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>Total Leads</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>{stats.total_leads}</p>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>Emails Sent</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>{stats.emails_sent}</p>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>Replies</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>{stats.replies}</p>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', margin: 0 }}>Recent Campaigns</h2>

        {campaigns.length > 0 ? (
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Client</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Leads</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Sent</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#111827' }}>Replies</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.slice(0, 10).map((c: any) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', color: '#111827' }}>{c.name}</td>
                    <td style={{ padding: '12px 16px', color: '#111827' }}>{c.client_name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          background: c.status === 'active' ? '#d1fae5' : '#f3f4f6',
                          color: c.status === 'active' ? '#065f46' : '#4b5563',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#111827', fontWeight: '600' }}>{c.total_leads}</td>
                    <td style={{ padding: '12px 16px', color: '#111827', fontWeight: '600' }}>{c.emails_sent}</td>
                    <td style={{ padding: '12px 16px', color: '#059669', fontWeight: '600' }}>{c.replies_received}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '8px', padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ color: '#4b5563' }}>No campaigns yet. Create your first one!</p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}