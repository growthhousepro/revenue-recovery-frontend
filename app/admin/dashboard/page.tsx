'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clientCampaigns, setClientCampaigns] = useState<any[]>([]);
  const [clientAnalytics, setClientAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingFee, setTogglingFee] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchAdminData(token);
  }, []);

  const fetchAdminData = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const analyticsRes = await fetch('http://localhost:8000/api/admin/analytics', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (analyticsRes.status === 403) {
        setError('Admin access required');
        router.push('/dashboard');
        return;
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      const clientsRes = await fetch('http://localhost:8000/api/admin/clients', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(Array.isArray(clientsData) ? clientsData : []);
      }
    } catch (error: any) {
      setError(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClient = async (clientId: string) => {
    const token = localStorage.getItem('access_token');
    setSelectedClient(clientId);
    setClientCampaigns([]);
    setClientAnalytics(null);

    try {
      const campaignsRes = await fetch(`http://localhost:8000/api/admin/client/${clientId}/campaigns`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setClientCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
      }

      const analyticsRes = await fetch(`http://localhost:8000/api/admin/client/${clientId}/analytics`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setClientAnalytics(analyticsData);
      }
    } catch (error: any) {
      setError(`Failed to load client data: ${error.message}`);
    }
  };

  const handleToggleBookingFee = async (campaignId: string, currentValue: boolean) => {
    const token = localStorage.getItem('access_token');
    setTogglingFee(campaignId);

    try {
      const res = await fetch('http://localhost:8000/api/admin/toggle-booking-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaign_id: campaignId,
          charge_fee: !currentValue,
        }),
      });

      if (res.ok) {
        alert(`Booking fee ${!currentValue ? 'enabled' : 'disabled'}`);
        if (selectedClient) {
          handleSelectClient(selectedClient);
        }
      } else {
        setError('Failed to toggle booking fee');
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setTogglingFee(null);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <p>Loading admin dashboard...</p>
        </div>
      </ProtectedLayout>
    );
  }

  if (error === 'Admin access required') {
    return (
      <ProtectedLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'red', fontSize: '16px' }}>Admin access required</p>
          <button onClick={() => router.push('/dashboard')} style={{ background: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', marginTop: '16px' }}>
            Back to Dashboard
          </button>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1400px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: '0 0 32px 0' }}>Admin Dashboard</h1>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>Total Clients</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>{analytics?.total_clients || 0}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>Total Campaigns</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>{analytics?.total_campaigns || 0}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>Total Bookings</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>{analytics?.total_bookings || 0}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>Total Revenue</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' }}>${analytics?.total_revenue || 0}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Overall Metrics</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 4px 0' }}>Total Leads</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{analytics?.total_leads || 0}</p>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 4px 0' }}>Emails Sent</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{analytics?.total_emails_sent || 0}</p>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 4px 0' }}>Booking Rate</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669', margin: 0 }}>{analytics?.booking_rate || 0}%</p>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 4px 0' }}>Avg Revenue per Campaign</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669', margin: 0 }}>${analytics?.average_revenue_per_campaign || 0}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Clients ({clients.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflow: 'auto' }}>
              {clients.length === 0 ? (
                <p style={{ color: '#4b5563', fontSize: '14px' }}>No clients yet</p>
              ) : (
                clients.map((client: any) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectClient(client.id)}
                    style={{
                      background: selectedClient === client.id ? '#4f46e5' : '#f9fafb',
                      color: selectedClient === client.id ? 'white' : '#111827',
                      padding: '12px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {client.email}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {selectedClient && clientAnalytics && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Client: {clientAnalytics.client_email}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 4px 0' }}>Campaigns</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{clientAnalytics.total_campaigns}</p>
              </div>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 4px 0' }}>Bookings</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', margin: 0 }}>{clientAnalytics.total_bookings}</p>
              </div>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 4px 0' }}>Revenue</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', margin: 0 }}>${clientAnalytics.total_revenue}</p>
              </div>
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 4px 0' }}>Booking Rate</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', margin: 0 }}>{clientAnalytics.booking_rate}%</p>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Campaigns</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {clientCampaigns.length === 0 ? (
                <p style={{ color: '#4b5563', fontSize: '14px' }}>No campaigns</p>
              ) : (
                clientCampaigns.map((campaign: any) => (
                  <div key={campaign.id} style={{ background: '#f9fafb', padding: '16px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{campaign.name}</p>
                        <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0 0 0' }}>Client: {campaign.client_name}</p>
                      </div>
                      <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                        {campaign.status}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Leads</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{campaign.total_leads}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Sent</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{campaign.emails_sent}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Bookings</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669', margin: '4px 0 0 0' }}>{campaign.bookings_confirmed}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Revenue</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669', margin: '4px 0 0 0' }}>${campaign.bookings_confirmed * (campaign.charge_booking_fee ? 25 : 0)}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleBookingFee(campaign.id, campaign.charge_booking_fee)}
                      disabled={togglingFee === campaign.id}
                      style={{
                        background: campaign.charge_booking_fee ? '#10b981' : '#ef4444',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: togglingFee === campaign.id ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        opacity: togglingFee === campaign.id ? 0.6 : 1,
                      }}
                    >
                      {togglingFee === campaign.id ? 'Updating...' : (campaign.charge_booking_fee ? 'Disable Booking Fee' : 'Enable Booking Fee')}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}