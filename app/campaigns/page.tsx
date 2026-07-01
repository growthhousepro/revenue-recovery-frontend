'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Campaigns() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    client_name: '',
    description: '',
    subject_line: 'Hello {first_name}!',
    email_template: `<p>Hi {first_name},</p><p>We'd love to connect with you at {company}.</p><p>Best regards</p>`,
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) router.push('/login');
    else fetchCampaigns(token);
  }, []);

  const fetchCampaigns = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/campaigns/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch('http://localhost:8000/api/campaigns/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          name: '',
          client_name: '',
          description: '',
          subject_line: 'Hello {first_name}!',
          email_template: `<p>Hi {first_name},</p><p>We'd love to connect with you at {company}.</p><p>Best regards</p>`,
        });
        setShowForm(false);
        fetchCampaigns(token);
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
    setLoading(false);
  };

  const handleLaunchCampaign = async (campaignId: string) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`http://localhost:8000/api/campaigns/${campaignId}/launch`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) fetchCampaigns(token);
    } catch (error) {
      console.error('Failed to launch campaign:', error);
    }
  };

  const handleSendEmails = async (campaignId: string) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`http://localhost:8000/api/campaigns/${campaignId}/send-emails`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      alert(`Emails sent: ${data.sent}/${data.total}`);
      fetchCampaigns(token);
    } catch (error) {
      console.error('Failed to send emails:', error);
    }
  };

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1280px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Campaigns</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ background: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
          >
            New Campaign
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <form onSubmit={handleCreateCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Campaign Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="Client Name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="Subject Line"
                value={formData.subject_line}
                onChange={(e) => setFormData({ ...formData, subject_line: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
              />
              <textarea
                placeholder="Email Template (use {first_name}, {last_name}, {company})"
                value={formData.email_template}
                onChange={(e) => setFormData({ ...formData, email_template: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '120px', boxSizing: 'border-box', fontFamily: 'monospace' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ background: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', opacity: loading ? 0.5 : 1 }}
                >
                  {loading ? 'Creating...' : 'Create Campaign'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ background: '#e5e7eb', color: '#111827', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
          {campaigns.map((c: any) => (
            <div key={c.id} style={{ background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontWeight: 'bold', color: '#111827', margin: 0 }}>{c.name}</h3>
                  <p style={{ fontSize: '14px', color: '#4b5563', margin: '4px 0 0 0' }}>{c.client_name}</p>
                </div>
                <span
                  style={{
                    background: c.status === 'active' ? '#d1fae5' : c.status === 'draft' ? '#bfdbfe' : '#f3f4f6',
                    color: c.status === 'active' ? '#065f46' : c.status === 'draft' ? '#1e40af' : '#4b5563',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  {c.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', fontSize: '14px', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{c.total_leads}</p>
                  <p style={{ color: '#4b5563', margin: '4px 0 0 0' }}>Leads</p>
                </div>
                <div>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{c.emails_sent}</p>
                  <p style={{ color: '#4b5563', margin: '4px 0 0 0' }}>Sent</p>
                </div>
                <div>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{c.replies_received}</p>
                  <p style={{ color: '#4b5563', margin: '4px 0 0 0' }}>Replies</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {c.status === 'draft' && (
                  <>
                    <button
                      onClick={() => handleLaunchCampaign(c.id)}
                      style={{ flex: 1, background: '#10b981', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', minWidth: '0' }}
                    >
                      Launch
                    </button>
                    <button
                      onClick={() => router.push(`/campaigns/${c.id}/add-leads`)}
                      style={{ flex: 1, background: '#3b82f6', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', minWidth: '0' }}
                    >
                      Add Leads
                    </button>
                  </>
                )}
                {c.status === 'active' && c.total_leads > 0 && c.emails_sent === 0 && (
                  <button
                    onClick={() => handleSendEmails(c.id)}
                    style={{ flex: 1, background: '#f59e0b', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                  >
                    Send Emails
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {campaigns.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: 'white', borderRadius: '8px' }}>
            <p style={{ color: '#4b5563', marginBottom: '16px' }}>No campaigns yet. Create your first campaign!</p>
            <button
              onClick={() => setShowForm(true)}
              style={{ background: '#4f46e5', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
            >
              Create Campaign
            </button>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}