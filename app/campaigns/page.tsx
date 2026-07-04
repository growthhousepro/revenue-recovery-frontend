'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client_name: '',
    subject_line: '',
    email_template: '',
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/campaigns/`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/campaigns/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          name: '',
          client_name: '',
          subject_line: '',
          email_template: '',
        });
        setShowForm(false);
        if (token) {
          fetchCampaigns(token);
        }
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <p>Loading campaigns...</p>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Campaigns
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: '#4f46e5',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showForm ? 'Cancel' : 'New Campaign'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              Create New Campaign
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '8px' }}>
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., Q3 Outreach"
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '8px' }}>
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., Acme Corp"
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '8px' }}>
                  Subject Line
                </label>
                <input
                  type="text"
                  value={formData.subject_line}
                  onChange={(e) => setFormData({ ...formData, subject_line: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., Quick question about your services"
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '8px' }}>
                  Email Template
                </label>
                <textarea
                  value={formData.email_template}
                  onChange={(e) => setFormData({ ...formData, email_template: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                    minHeight: '150px'
                  }}
                  placeholder="<h1>Hello {{first_name}}</h1><p>Your email body here...</p>"
                />
              </div>

              <button
                onClick={handleCreateCampaign}
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Create Campaign
              </button>
            </div>
          </div>
        )}

        {campaigns.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>No campaigns yet. Create one to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => router.push(`/campaign-detail?id=${campaign.id}`)}
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
                  {campaign.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 12px 0' }}>
                  Client: {campaign.client_name}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <div style={{ background: '#f3f4f6', padding: '8px', borderRadius: '4px' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Leads</p>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                      {campaign.total_leads}
                    </p>
                  </div>
                  <div style={{ background: '#f3f4f6', padding: '8px', borderRadius: '4px' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Sent</p>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                      {campaign.emails_sent}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}