'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Reports() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCampaigns(token);
  }, []);

  const fetchCampaigns = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('http://localhost:8000/api/campaigns/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCampaigns(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to load campaigns');
      }
    } catch (error: any) {
      setError(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <p>Loading reports...</p>
        </div>
      </ProtectedLayout>
    );
  }

  const totalLeads = campaigns.reduce((sum, c) => sum + (c.total_leads || 0), 0);
  const totalEmailsSent = campaigns.reduce((sum, c) => sum + (c.emails_sent || 0), 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + (c.replies_received || 0), 0);
  const totalBookings = campaigns.reduce((sum, c) => sum + (c.bookings_confirmed || 0), 0);
  const totalFees = campaigns.reduce((sum, c) => sum + (c.charge_booking_fee ? c.bookings_confirmed * 25 : 0), 0);

  const avgLeadsPerCampaign = campaigns.length > 0 ? (totalLeads / campaigns.length).toFixed(0) : 0;
  const avgBookingsPerCampaign = campaigns.length > 0 ? (totalBookings / campaigns.length).toFixed(2) : 0;

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1280px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Reports</h1>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="12">Last 12 Months</option>
          </select>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Total Booking Fees</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>${totalFees}</p>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: '8px 0 0 0' }}>From {totalBookings} bookings</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Avg Booking Fees per Campaign</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>${campaigns.length > 0 ? (totalFees / campaigns.length).toFixed(0) : 0}</p>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: '8px 0 0 0' }}>Across {campaigns.length} campaigns</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Avg Bookings per Campaign</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>{avgBookingsPerCampaign}</p>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: '8px 0 0 0' }}>Goal: Increase this number</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Avg Leads per Campaign</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>{avgLeadsPerCampaign}</p>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: '8px 0 0 0' }}>{totalLeads} total leads</p>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Executive Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>Campaign Overview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px' }}>
                  <p style={{ fontSize: '12px', color: '#4b5563', margin: 0 }}>Total Campaigns:</p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{campaigns.length}</p>
                </div>
                <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px' }}>
                  <p style={{ fontSize: '12px', color: '#4b5563', margin: 0 }}>Active Campaigns:</p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{campaigns.filter(c => c.status === 'active').length}</p>
                </div>
                <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px' }}>
                  <p style={{ fontSize: '12px', color: '#4b5563', margin: 0 }}>Draft Campaigns:</p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{campaigns.filter(c => c.status === 'draft').length}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>Key Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
                  <p style={{ fontSize: '12px', color: '#065f46', margin: 0 }}>
                    📈 You've paid <strong>${totalFees}</strong> in booking fees from <strong>{totalBookings}</strong> confirmed bookings
                  </p>
                </div>
                <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
                  <p style={{ fontSize: '12px', color: '#0c4a6e', margin: 0 }}>
                    📊 Average booking rate: <strong>{campaigns.length > 0 ? ((totalBookings / totalEmailsSent) * 100).toFixed(2) : 0}%</strong> across all campaigns
                  </p>
                </div>
                <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #f59e0b' }}>
                  <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                    💡 Best performing campaign has <strong>{Math.max(...campaigns.map(c => c.bookings_confirmed || 0))}</strong> bookings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Detailed Campaign Reports</h2>
          {campaigns.length === 0 ? (
            <p style={{ color: '#4b5563', fontSize: '14px' }}>No campaigns yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {campaigns.map((campaign) => {
                const openRate = campaign.emails_sent > 0 ? ((campaign.replies_received / campaign.emails_sent) * 100).toFixed(2) : '0.00';
                const bookingRate = campaign.emails_sent > 0 ? ((campaign.bookings_confirmed / campaign.emails_sent) * 100).toFixed(2) : '0.00';
                const fees = campaign.charge_booking_fee ? campaign.bookings_confirmed * 25 : 0;

                return (
                  <div key={campaign.id} style={{ background: '#f9fafb', padding: '16px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{campaign.name}</h3>
                      <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0 0 0' }}>Client: {campaign.client_name}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Status</p>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: '4px 0 0 0' }}>{campaign.status}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Open Rate</p>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#059669', margin: '4px 0 0 0' }}>{openRate}%</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Booking Rate</p>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#059669', margin: '4px 0 0 0' }}>{bookingRate}%</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Bookings</p>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: '4px 0 0 0' }}>{campaign.bookings_confirmed}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Booking Fees</p>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#059669', margin: '4px 0 0 0' }}>${fees}</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                      <div style={{ background: 'white', padding: '8px', borderRadius: '4px' }}>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Leads</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{campaign.total_leads}</p>
                      </div>
                      <div style={{ background: 'white', padding: '8px', borderRadius: '4px' }}>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Sent</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{campaign.emails_sent}</p>
                      </div>
                      <div style={{ background: 'white', padding: '8px', borderRadius: '4px' }}>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Replies</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{campaign.replies_received}</p>
                      </div>
                      <div style={{ background: 'white', padding: '8px', borderRadius: '4px' }}>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Confirmed</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669', margin: '4px 0 0 0' }}>{campaign.bookings_confirmed}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}