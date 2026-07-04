'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Templates() {
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [savingCustom, setSavingCustom] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchTemplates(token);
  }, []);

  const fetchTemplates = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('http://localhost:8000/api/templates/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTemplates(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to load templates');
      }
    } catch (error: any) {
      setError(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`http://localhost:8000/api/templates/${templateId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        alert('Template deleted successfully');
        fetchTemplates(token);
      } else {
        setError('Failed to delete template');
      }
    } catch (error) {
      setError('Error deleting template');
    }
  };

  const handleSaveCustomTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customSubject || !customBody) {
      setError('Please fill in all fields');
      return;
    }

    setSavingCustom(true);
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch('http://localhost:8000/api/templates/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: customName,
          subject: customSubject,
          body: customBody,
        }),
      });

      if (res.ok) {
        alert('Template created successfully!');
        setCustomName('');
        setCustomSubject('');
        setCustomBody('');
        setShowCreateForm(false);
        fetchTemplates(token);
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to create template');
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setSavingCustom(false);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <p>Loading templates...</p>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1280px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Email Templates</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => router.push('/templates/generate')}
              style={{ background: '#4f46e5', color: 'white', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              ✨ Generate with AI
            </button>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{ background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              + Create Custom
            </button>
          </div>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{error}</div>}

        {/* Create Custom Template Form */}
        {showCreateForm && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Create Custom Template</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{ background: '#e5e7eb', color: '#111827', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveCustomTemplate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Template Name</label>
                <input
                  type="text"
                  placeholder="e.g., Pest Control Outreach"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#111827',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Subject Line</label>
                <input
                  type="text"
                  placeholder="e.g., Quick question about your pest control needs"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#111827',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>Email Body</label>
                <textarea
                  placeholder="Type your email template here..."
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#111827',
                    boxSizing: 'border-box',
                    minHeight: '200px',
                    fontFamily: 'monospace',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingCustom}
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: savingCustom ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  opacity: savingCustom ? 0.6 : 1,
                }}
              >
                {savingCustom ? 'Creating...' : '💾 Create Template'}
              </button>
            </form>
          </div>
        )}

        {/* Templates List */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {templates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '16px' }}>No templates yet. Create one with AI or add a custom template.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => router.push('/templates/generate')}
                  style={{ background: '#4f46e5', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                  ✨ Generate with AI
                </button>
                <button 
                  onClick={() => setShowCreateForm(true)}
                  style={{ background: '#10b981', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                  + Create Custom
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {templates.map((template: any) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(selectedTemplate === template.id ? null : template.id)}
                  style={{
                    background: selectedTemplate === template.id ? '#f3f4f6' : '#f9fafb',
                    padding: '16px',
                    borderRadius: '6px',
                    border: selectedTemplate === template.id ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: selectedTemplate === template.id ? '12px' : 0 }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{template.name}</p>
                      <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0 0 0' }}>Subject: {template.subject}</p>
                    </div>
                    {selectedTemplate === template.id && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.id);
                        }}
                        style={{ background: '#ef4444', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                        Delete
                      </button>
                    )}
                  </div>

                  {selectedTemplate === template.id && (
                    <div style={{ background: 'white', padding: '12px', borderRadius: '4px', fontSize: '13px', color: '#111827', maxHeight: '200px', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {template.body}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}