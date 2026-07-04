'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CampaignDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('id');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [campaign, setCampaign] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showFollowUpSettings, setShowFollowUpSettings] = useState(false);
  const [followUp1Enabled, setFollowUp1Enabled] = useState(false);
  const [followUp1Days, setFollowUp1Days] = useState(3);
  const [followUp1TemplateId, setFollowUp1TemplateId] = useState('');
  
  const [followUp2Enabled, setFollowUp2Enabled] = useState(false);
  const [followUp2Days, setFollowUp2Days] = useState(7);
  const [followUp2TemplateId, setFollowUp2TemplateId] = useState('');
  
  const [followUp3Enabled, setFollowUp3Enabled] = useState(false);
  const [followUp3Days, setFollowUp3Days] = useState(30);
  const [followUp3TemplateId, setFollowUp3TemplateId] = useState('');
  
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [schedulingFollowUps, setSchedulingFollowUps] = useState(false);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadingCSV, setUploadingCSV] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (campaignId) {
      fetchCampaignData(token);
      fetchTemplates(token);
    }
  }, [campaignId]);

  const fetchCampaignData = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`http://localhost:8000/api/campaigns/${campaignId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCampaign(data);
        setFollowUp1Enabled(data.follow_up_1_enabled || false);
        setFollowUp1Days(data.follow_up_1_days || 3);
        setFollowUp1TemplateId(data.follow_up_1_template_id || '');
        
        setFollowUp2Enabled(data.follow_up_2_enabled || false);
        setFollowUp2Days(data.follow_up_2_days || 7);
        setFollowUp2TemplateId(data.follow_up_2_template_id || '');
        
        setFollowUp3Enabled(data.follow_up_3_enabled || false);
        setFollowUp3Days(data.follow_up_3_days || 30);
        setFollowUp3TemplateId(data.follow_up_3_template_id || '');
      } else if (res.status === 404) {
        setError('Campaign not found');
      } else {
        setError('Failed to load campaign');
      }
    } catch (err: any) {
      setError('Error loading campaign');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/templates/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTemplates(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    }
  };

  const handleSendEmails = async () => {
    if (campaign.total_leads === 0) {
      setError('Please import leads first');
      return;
    }

    setSendingEmails(true);
    setError('');
    setSuccessMessage('');
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch(`http://localhost:8000/api/campaigns/${campaignId}/send-emails`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(`✅ ${data.sent} emails sent!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchCampaignData(token);
      } else {
        setError('Failed to send emails');
      }
    } catch (err: any) {
      setError('Error sending emails');
      console.error(err);
    } finally {
      setSendingEmails(false);
    }
  };

  const handleSaveFollowUpSettings = async () => {
    setSavingFollowUp(true);
    setError('');
    setSuccessMessage('');
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch(`http://localhost:8000/api/followups/${campaignId}/follow-up-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          follow_up_1_enabled: followUp1Enabled,
          follow_up_1_days: followUp1Days,
          follow_up_1_template_id: followUp1TemplateId || null,
          follow_up_2_enabled: followUp2Enabled,
          follow_up_2_days: followUp2Days,
          follow_up_2_template_id: followUp2TemplateId || null,
          follow_up_3_enabled: followUp3Enabled,
          follow_up_3_days: followUp3Days,
          follow_up_3_template_id: followUp3TemplateId || null,
        }),
      });

      if (res.ok) {
        setSuccessMessage('✅ Follow-up settings saved successfully!');
        setTimeout(() => {
          setShowFollowUpSettings(false);
          fetchCampaignData(token);
        }, 1500);
      } else {
        setError('Failed to save settings');
      }
    } catch (err: any) {
      setError('Error saving settings');
      console.error(err);
    } finally {
      setSavingFollowUp(false);
    }
  };

  const handleScheduleFollowUps = async () => {
    setSchedulingFollowUps(true);
    setError('');
    setSuccessMessage('');
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch(`http://localhost:8000/api/followups/${campaignId}/schedule-follow-ups`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(`✅ ${data.scheduled_count} follow-up emails scheduled!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchCampaignData(token);
      } else {
        setError('Failed to schedule follow-ups');
      }
    } catch (err: any) {
      setError('Error scheduling follow-ups');
      console.error(err);
    } finally {
      setSchedulingFollowUps(false);
    }
  };

  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCSV(true);
    setError('');
    setSuccessMessage('');
    const token = localStorage.getItem('access_token');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`http://localhost:8000/api/campaigns/${campaignId}/import-leads-csv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(`✅ Successfully imported ${data.added} leads!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchCampaignData(token);
      } else {
        setError('Failed to import CSV. Make sure it has the correct format.');
      }
    } catch (err: any) {
      setError('Error importing CSV file');
      console.error(err);
    } finally {
      setUploadingCSV(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const FollowUpSection = ({ number, enabled, setEnabled, days, setDays, templateId, setTemplateId }: any) => {
    let maxDays: number;
    let dayOptions: number[];

    if (number === 1) {
      maxDays = 30;
      dayOptions = [1, 2, 3, 4, 5, 7, 10, 14, 21, 30];
    } else if (number === 2) {
      maxDays = 30;
      dayOptions = [1, 2, 3, 4, 5, 7, 10, 14, 21, 30];
    } else {
      maxDays = 90;
      dayOptions = [1, 7, 14, 21, 30, 45, 60, 90];
    }

    return (
      <div style={{ paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '12px' }}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
            Follow-up #{number}
          </span>
        </label>

        {enabled && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginLeft: '32px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
                Days Until Follow-up (1-{maxDays})
              </label>
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#111827',
                  background: 'white',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                {dayOptions.map((day) => (
                  <option key={day} value={day}>
                    {day} day{day > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
                Email Template (Optional)
              </label>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#111827',
                  background: 'white',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Use original email template</option>
                {templates.map((template: any) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <p>Loading campaign...</p>
        </div>
      </ProtectedLayout>
    );
  }

  if (!campaign) {
    return (
      <ProtectedLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'red' }}>{error || 'Campaign not found'}</p>
          <button 
            onClick={() => router.back()}
            style={{ background: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
            Go Back
          </button>
        </div>
      </ProtectedLayout>
    );
  }

  const anyFollowUpEnabled = followUp1Enabled || followUp2Enabled || followUp3Enabled;

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              {campaign.name}
            </h1>
            <p style={{ fontSize: '14px', color: '#4b5563', margin: '8px 0 0 0' }}>
              Status: <span style={{ fontWeight: '600', color: '#4f46e5' }}>{campaign.status}</span>
            </p>
          </div>
          <button 
            onClick={() => router.back()}
            style={{ background: '#e5e7eb', color: '#111827', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
            Back
          </button>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{error}</div>}
        {successMessage && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{successMessage}</div>}

        {/* Campaign Overview */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Campaign Overview</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Client Name</p>
              <p style={{ fontSize: '14px', color: '#111827', margin: '4px 0 0 0' }}>{campaign.client_name}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Subject Line</p>
              <p style={{ fontSize: '14px', color: '#111827', margin: '4px 0 0 0' }}>{campaign.subject_line}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Total Leads</p>
              <p style={{ fontSize: '14px', color: '#111827', margin: '4px 0 0 0' }}>{campaign.total_leads}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Emails Sent</p>
              <p style={{ fontSize: '14px', color: '#111827', margin: '4px 0 0 0' }}>{campaign.emails_sent}</p>
            </div>
          </div>

          <button
            onClick={handleSendEmails}
            disabled={sendingEmails || campaign.total_leads === 0}
            style={{
              background: campaign.emails_sent > 0 ? '#10b981' : '#4f46e5',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: sendingEmails || campaign.total_leads === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              opacity: sendingEmails || campaign.total_leads === 0 ? 0.6 : 1
            }}
          >
            {sendingEmails ? 'Sending...' : campaign.emails_sent > 0 ? 'Resend Emails' : 'Send Emails'}
          </button>
        </div>

        {/* Follow-up Email Settings */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              📧 Follow-up Email Settings
            </h2>
            <button
              onClick={() => setShowFollowUpSettings(!showFollowUpSettings)}
              style={{
                background: '#e5e7eb',
                color: '#111827',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              {showFollowUpSettings ? 'Cancel' : 'Configure'}
            </button>
          </div>

          {!showFollowUpSettings ? (
            <div>
              <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 16px 0' }}>
                {anyFollowUpEnabled 
                  ? `✅ Follow-ups enabled`
                  : '❌ Follow-ups disabled - No automatic follow-up emails will be sent'
                }
              </p>
              
              {anyFollowUpEnabled && (
                <>
                  <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '16px' }}>
                    {followUp1Enabled && <p style={{ margin: '4px 0' }}>✉️ Follow-up #1: After {followUp1Days} day{followUp1Days > 1 ? 's' : ''}</p>}
                    {followUp2Enabled && <p style={{ margin: '4px 0' }}>✉️ Follow-up #2: After {followUp2Days} day{followUp2Days > 1 ? 's' : ''}</p>}
                    {followUp3Enabled && <p style={{ margin: '4px 0' }}>✉️ Follow-up #3: After {followUp3Days} day{followUp3Days > 1 ? 's' : ''}</p>}
                  </div>
                  
                  <button
                    onClick={handleScheduleFollowUps}
                    disabled={schedulingFollowUps || campaign.emails_sent === 0}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: schedulingFollowUps || campaign.emails_sent === 0 ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      opacity: schedulingFollowUps || campaign.emails_sent === 0 ? 0.6 : 1
                    }}
                  >
                    {schedulingFollowUps ? 'Scheduling...' : 'Schedule Follow-ups Now'}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FollowUpSection
                number={1}
                enabled={followUp1Enabled}
                setEnabled={setFollowUp1Enabled}
                days={followUp1Days}
                setDays={setFollowUp1Days}
                templateId={followUp1TemplateId}
                setTemplateId={setFollowUp1TemplateId}
              />

              <FollowUpSection
                number={2}
                enabled={followUp2Enabled}
                setEnabled={setFollowUp2Enabled}
                days={followUp2Days}
                setDays={setFollowUp2Days}
                templateId={followUp2TemplateId}
                setTemplateId={setFollowUp2TemplateId}
              />

              <FollowUpSection
                number={3}
                enabled={followUp3Enabled}
                setEnabled={setFollowUp3Enabled}
                days={followUp3Days}
                setDays={setFollowUp3Days}
                templateId={followUp3TemplateId}
                setTemplateId={setFollowUp3TemplateId}
              />

              <button
                onClick={handleSaveFollowUpSettings}
                disabled={savingFollowUp}
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: savingFollowUp ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  opacity: savingFollowUp ? 0.6 : 1,
                  marginTop: '8px'
                }}
              >
                {savingFollowUp ? 'Saving...' : 'Save Follow-up Settings'}
              </button>
            </div>
          )}
        </div>

        {/* Import CSV */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Import Leads</h2>
              <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0 0 0' }}>Upload a CSV file with leads to add to this campaign</p>
            </div>
            <button
              onClick={handleImportCSV}
              disabled={uploadingCSV}
              style={{
                background: '#4f46e5',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: uploadingCSV ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                opacity: uploadingCSV ? 0.6 : 1
              }}
            >
              {uploadingCSV ? 'Uploading...' : 'Import CSV'}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}