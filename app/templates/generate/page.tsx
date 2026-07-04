'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const INDUSTRIES = [
  'Pest Control',
  'Plumbing',
  'HVAC',
  'Electrical',
  'Roofing',
  'Landscaping',
  'Cleaning Services',
  'Home Inspection',
  'Locksmith',
  'Painting',
  'Flooring',
  'General Contractor',
];

const COMPANY_TYPES = [
  'Local Service Business',
  'Multi-location Franchise',
  'Startup',
  'Established Company',
  'Family Business',
];

const CAMPAIGN_TYPES = [
  { value: 'winback', label: 'Winback', description: 'Previous customer - win them back' },
  { value: 'lost_lead', label: 'Lost Lead', description: 'Cold lead that never converted' },
  { value: 'old_estimate', label: 'Old Estimate', description: 'Got a quote but never purchased' },
  { value: 'upsell', label: 'Upsell', description: 'Existing customer - sell them more' },
  { value: 'seasonal', label: 'Seasonal', description: 'Re-engage during relevant seasons' },
];

const CALL_TO_ACTIONS = [
  'Schedule a free consultation',
  'Get a free quote',
  'Book an appointment',
  'Request a free inspection',
  'Call for immediate service',
  'Learn more about our services',
];

export default function GenerateTemplate() {
  const router = useRouter();
  const [industry, setIndustry] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [campaignType, setCampaignType] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [templateName, setTemplateName] = useState('');
  
  const [generating, setGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !companyType || !campaignType || !callToAction) {
      setError('Please fill in all fields');
      return;
    }

    setGenerating(true);
    setError('');
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch('http://localhost:8000/api/templates/generate/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          industry,
          company_type: companyType,
          campaign_type: campaignType,
          call_to_action: callToAction,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setGeneratedTemplate(data);
        const campaignLabel = CAMPAIGN_TYPES.find(ct => ct.value === campaignType)?.label || campaignType;
        setTemplateName(`${industry} - ${campaignLabel}`);
      } else {
        setError(data.detail || 'Failed to generate template');
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !generatedTemplate) {
      setError('Please enter a template name');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch('http://localhost:8000/api/templates/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: templateName,
          subject: generatedTemplate.subject,
          body: generatedTemplate.body,
        }),
      });

      if (res.ok) {
        setSuccess('Template saved successfully!');
        setTimeout(() => {
          router.push('/templates');
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to save template');
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const selectedCampaignType = CAMPAIGN_TYPES.find(ct => ct.value === campaignType);

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Generate Template with AI</h1>
          <button onClick={() => router.back()} style={{ background: '#e5e7eb', color: '#111827', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Back</button>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{error}</div>}
        {success && <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{success}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Form */}
          <div>
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Template Details</h2>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
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
                    <option value="">Select an industry...</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Company Type</label>
                  <select
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
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
                    <option value="">Select company type...</option>
                    {COMPANY_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Campaign Type</label>
                  <select
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value)}
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
                    <option value="">Select campaign type...</option>
                    {CAMPAIGN_TYPES.map((ct) => (
                      <option key={ct.value} value={ct.value}>{ct.label}</option>
                    ))}
                  </select>
                  {selectedCampaignType && (
                    <p style={{ fontSize: '11px', color: '#4b5563', margin: '4px 0 0 0' }}>
                      {selectedCampaignType.description}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Call to Action</label>
                  <select
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
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
                    <option value="">Select a CTA...</option>
                    {CALL_TO_ACTIONS.map((cta) => (
                      <option key={cta} value={cta}>{cta}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={generating}
                  style={{
                    width: '100%',
                    background: '#4f46e5',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: generating ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    opacity: generating ? 0.6 : 1,
                  }}
                >
                  {generating ? 'Generating...' : '✨ Generate Template'}
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          {generatedTemplate ? (
            <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Template Preview</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#111827',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#111827', margin: '0 0 6px 0' }}>Subject Line</p>
                <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', fontSize: '14px', color: '#111827', borderLeft: '4px solid #4f46e5' }}>
                  {generatedTemplate.subject}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#111827', margin: '0 0 6px 0' }}>Email Body</p>
                <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', fontSize: '13px', color: '#111827', minHeight: '200px', maxHeight: '300px', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {generatedTemplate.body}
                </div>
              </div>

              <button
                onClick={handleSaveTemplate}
                disabled={saving}
                style={{
                  width: '100%',
                  background: '#10b981',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? 'Saving...' : '💾 Save Template'}
              </button>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#4b5563', fontSize: '14px', textAlign: 'center' }}>Fill out the form and click "Generate Template" to see the AI-generated email template here</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}