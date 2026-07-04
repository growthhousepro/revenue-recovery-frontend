'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Analytics() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          <p>Loading analytics...</p>
        </div>
      </ProtectedLayout>
    );
  }

  const totalLeads = campaigns.reduce((sum, c) => sum + (c.total_leads || 0), 0);
  const totalEmailsSent = campaigns.reduce((sum, c) => sum + (c.emails_sent || 0), 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + (c.replies_received || 0), 0);
  const totalBookings = campaigns.reduce((sum, c) => sum + (c.bookings_confirmed || 0), 0);
  const totalFees = campaigns.reduce((sum, c) => sum + (c.charge_booking_fee ? c.bookings_confirmed * 25 : 0), 0);

  const openRate = totalEmailsSent > 0 ? ((totalReplies / totalEmailsSent) * 100).toFixed(2) : '0.00';
  const bookingRate = totalEmailsSent > 0 ? ((totalBookings / totalEmailsSent) * 100).toFixed(2) : '0.00';
  const conversionRate = totalReplies > 0 ? ((totalBookings / totalReplies) * 100).toFixed(2) : '0.00';

  const topCampaigns = [...campaigns]
    .sort((a, b) => (b.bookings_confirmed || 0) - (a.bookings_confirmed || 0))
    .slice(0, 5);

  const topByBookingRate = [...campaigns]
    .map(c => ({
      ...c,
      rate: c.emails_sent > 0 ? ((c.bookings_confirmed / c.emails_sent) * 100) : 0
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1280px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: '0 0 32px 0' }}>Analytics & Reports</h1>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Open Rate</p>
            <p style={{ fontSize: '40px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>{openRate}%</p>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: '8px 0 0 0' }}>{totalReplies} of {totalEmailsSent} opened</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Booking Rate</p>
            <p style={{ fontSize: '40px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>{bookingRate}%</p>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: '8px 0 0 0' }}>{totalBookings} of {totalEmailsSent} converted</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Reply to Booking Rate</p>
            <p style={{ fontSize: '40px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>{conversionRate}%</p>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: '8px 0 0 0' }}>{totalBookings} of {totalReplies} replies booked</p>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>Campaign Funnel</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>Total Leads</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{totalLeads}</p>
              </div>
              <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '24px', overflow: 'hidden' }}>
                <div style={{ background: '#4f46e5', height: '100%', width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>Emails Sent</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{totalEmailsSent} ({totalLeads > 0 ? ((totalEmailsSent / totalLeads) * 100).toFixed(0) : 0}%)</p>
              </div>
              <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '24px', overflow: 'hidden' }}>
                <div style={{ background: '#3b82f6', height: '100%', width: `${totalLeads > 0 ? (totalEmailsSent / totalLeads) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>Replies Received</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{totalReplies} ({totalEmailsSent > 0 ? ((totalReplies / totalEmailsSent) * 100).toFixed(0) : 0}%)</p>
              </div>
              <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '24px', overflow: 'hidden' }}>
                <div style={{ background: '#f59e0b', height: '100%', width: `${totalEmailsSent > 0 ? (totalReplies / totalEmailsSent) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>Bookings Confirmed</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{totalBookings} ({totalReplies > 0 ? ((totalBookings / totalReplies) * 100).toFixed(0) : 0}%)</p>
              </div>
              <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '24px', overflow: 'hidden' }}>
                <div style={{ background: '#10b981', height: '100%', width: `${totalReplies > 0 ? (totalBookings / totalReplies) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Top 5 by Bookings</h2>
            {topCampaigns.length === 0 ? (
              <p style={{ color: '#4b5563', fontSize: '14px' }}>No campaigns yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topCampaigns.map((campaign, index) => (
                  <div key={campaign.id} style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', borderLeft: `4px solid ${['#4f46e5', '#3b82f6', '#f59e0b', '#10b981', '#ef4444'][index]}` }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>{campaign.name}</p>
                    <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>{campaign.bookings_confirmed} bookings · ${campaign.charge_booking_fee ? campaign.bookings_confirmed * 25 : 0} fees</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Top 5 by Booking Rate</h2>
            {topByBookingRate.length === 0 ? (
              <p style={{ color: '#4b5563', fontSize: '14px' }}>No campaigns yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topByBookingRate.map((campaign, index) => (
                  <div key={campaign.id} style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', borderLeft: `4px solid ${['#4f46e5', '#3b82f6', '#f59e0b', '#10b981', '#ef4444'][index]}` }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>{campaign.name}</p>
                    <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>{campaign.rate.toFixed(2)}% rate · {campaign.bookings_confirmed} bookings</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>All Campaigns Performance</h2>
          {campaigns.length === 0 ? (
            <p style={{ color: '#4b5563', fontSize: '14px' }}>No campaigns yet</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#111827' }}>Campaign</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#111827' }}>Leads</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#111827' }}>Sent</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#111827' }}>Replies</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#111827' }}>Open %</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#111827' }}>Bookings</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#111827' }}>Book %</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#111827' }}>Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => {
                    const openPct = campaign.emails_sent > 0 ? ((campaign.replies_received / campaign.emails_sent) * 100).toFixed(1) : '0.0';
                    const bookPct = campaign.emails_sent > 0 ? ((campaign.bookings_confirmed / campaign.emails_sent) * 100).toFixed(1) : '0.0';
                    const fees = campaign.charge_booking_fee ? campaign.bookings_confirmed * 25 : 0;

                    return (
                      <tr key={campaign.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', fontSize: '12px', color: '#111827', fontWeight: '600' }}>{campaign.name}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#111827' }}>{campaign.total_leads}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#111827' }}>{campaign.emails_sent}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#111827' }}>{campaign.replies_received}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#059669', fontWeight: '600' }}>{openPct}%</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#111827', fontWeight: '600' }}>{campaign.bookings_confirmed}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#059669', fontWeight: '600' }}>{bookPct}%</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#059669', fontWeight: '600' }}>${fees}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}