'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalStats, setTotalStats] = useState({
    totalLeads: 0,
    totalEmailsSent: 0,
    totalReplies: 0,
    totalBookings: 0,
    totalFees: 0,
    overallBookingRate: 0,
  });

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
        const campaignsArray = Array.isArray(data) ? data : [];
        setCampaigns(campaignsArray);

        let totalLeads = 0;
        let totalEmailsSent = 0;
        let totalReplies = 0;
        let totalBookings = 0;
        let totalFees = 0;

        campaignsArray.forEach((campaign: any) => {
          totalLeads += campaign.total_leads || 0;
          totalEmailsSent += campaign.emails_sent || 0;
          totalReplies += campaign.replies_received || 0;
          totalBookings += campaign.bookings_confirmed || 0;
          if (campaign.charge_booking_fee) {
            totalFees += (campaign.bookings_confirmed || 0) * 25;
          }
        });

        const overallBookingRate = totalEmailsSent > 0 ? ((totalBookings / totalEmailsSent) * 100).toFixed(2) : '0.00';

        setTotalStats({
          totalLeads,
          totalEmailsSent,
          totalReplies,
          totalBookings,
          totalFees,
          overallBookingRate: parseFloat(overallBookingRate),
        });
      } else {
        setError('Failed to load campaigns');
      }
    } catch (error: any) {
      setError(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    router.push('/campaigns');
  };

  const handleViewCampaign = (campaignId: string) => {
    router.push(`/campaign-detail?id=${campaignId}`);
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <p>Loading dashboard...</p>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1280px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Dashboard</h1>
          <button onClick={handleCreateCampaign} style={{ background: '#4f46e5', color: 'white', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
            + New Campaign
          </button>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Total Leads</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>{totalStats.totalLeads}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Emails Sent</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>{totalStats.totalEmailsSent}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Bookings Confirmed</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>{totalStats.totalBookings}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Booking Rate</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>{totalStats.overallBookingRate}%</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Total Replies</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>{totalStats.totalReplies}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Booking Fees</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>${totalStats.totalFees}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600', margin: 0 }}>Your Campaigns</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>{campaigns.length}</p>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>Your Campaigns</h2>

          {campaigns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', background: '#f9fafb', borderRadius: '6px' }}>
              <p style={{ color: '#4b5563', fontSize: '14px', margin: '0 0 16px 0' }}>No campaigns yet</p>
              <button onClick={handleCreateCampaign} style={{ background: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                Create Your First Campaign
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {campaigns.map((campaign: any) => {
                const campaignBookingRate = campaign.emails_sent > 0 ? ((campaign.bookings_confirmed / campaign.emails_sent) * 100).toFixed(2) : '0.00';
                const campaignFees = campaign.charge_booking_fee ? campaign.bookings_confirmed * 25 : 0;

                return (
                  <div
                    key={campaign.id}
                    onClick={() => handleViewCampaign(campaign.id)}
                    style={{
                      background: '#f9fafb',
                      padding: '16px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.borderColor = '#4f46e5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>{campaign.name}</p>
                        <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0 0 0' }}>Client: {campaign.client_name}</p>
                      </div>
                      <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                        {campaign.status}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Leads</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{campaign.total_leads}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Sent</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{campaign.emails_sent}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Replies</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{campaign.replies_received}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Bookings</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669', margin: '4px 0 0 0' }}>{campaign.bookings_confirmed}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Booking Rate</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669', margin: '4px 0 0 0' }}>{campaignBookingRate}%</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Fees</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669', margin: '4px 0 0 0' }}>${campaignFees}</p>
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