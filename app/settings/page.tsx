'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    company_name: 'Your Company',
    email: 'admin@company.com',
    billing_email: 'billing@company.com',
    plan: 'Professional',
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const company = localStorage.getItem('company');
    if (!token) {
      router.push('/login');
    } else if (company) {
      const companyData = JSON.parse(company);
      setSettings({...settings, company_name: companyData.name});
    }
  }, []);

  return (
    <ProtectedLayout>
      <div style={{maxWidth: '1280px'}}>
        <h1 style={{fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '32px', margin: 0}}>Settings</h1>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px'}}>
          <div style={{background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <div style={{borderBottom: '1px solid #e5e7eb', padding: '16px'}}>
              <h2 style={{fontWeight: '600', color: '#111827', margin: 0}}>Settings</h2>
            </div>
            <nav style={{display: 'flex', flexDirection: 'column'}}>
              {['general', 'email', 'billing', 'team', 'security'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: activeTab === tab ? '#f3f4f6' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: activeTab === tab ? '#4f46e5' : '#4b5563',
                    fontSize: '14px',
                    borderBottom: '1px solid #f3f4f6',
                    fontWeight: activeTab === tab ? '600' : '400',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div style={{background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            {activeTab === 'general' && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px', margin: 0}}>General Settings</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>Company Name</label>
                    <input type="text" value={settings.company_name} onChange={(e) => setSettings({...settings, company_name: e.target.value})} style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box'}} />
                  </div>

                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>Email</label>
                    <input type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box'}} />
                  </div>

                  <button style={{background: '#4f46e5', color: 'white', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', alignSelf: 'flex-start'}}>Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px', margin: 0}}>Email Settings</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>Billing Email</label>
                    <input type="email" value={settings.billing_email} onChange={(e) => setSettings({...settings, billing_email: e.target.value})} style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box'}} />
                  </div>

                  <div style={{background: '#f0fdf4', border: '1px solid #dcfce7', padding: '12px', borderRadius: '6px'}}>
                    <p style={{color: '#166534', fontSize: '14px', margin: 0}}>✓ Email verified: admin@company.com</p>
                  </div>

                  <button style={{background: '#4f46e5', color: 'white', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', alignSelf: 'flex-start'}}>Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px', margin: 0}}>Billing & Subscription</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div style={{background: '#f3f4f6', padding: '16px', borderRadius: '6px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <p style={{fontWeight: '600', color: '#111827', margin: 0}}>{settings.plan} Plan</p>
                        <p style={{color: '#4b5563', fontSize: '14px', margin: '4px 0 0 0'}}>$299/month</p>
                      </div>
                      <button style={{background: '#dc2626', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600'}}>Cancel</button>
                    </div>
                  </div>

                  <div style={{background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '6px'}}>
                    <p style={{color: '#991b1b', fontSize: '14px', margin: 0}}>Your subscription renews on July 15, 2026</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px', margin: 0}}>Team Members</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div style={{background: '#f9fafb', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #4f46e5'}}>
                    <p style={{fontWeight: '600', color: '#111827', margin: 0}}>You (Admin)</p>
                    <p style={{color: '#4b5563', fontSize: '14px', margin: '4px 0 0 0'}}>admin@company.com</p>
                  </div>

                  <button style={{background: '#4f46e5', color: 'white', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', alignSelf: 'flex-start'}}>Invite Team Member</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px', margin: 0}}>Security Settings</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Change Password</label>
                    <input type="password" placeholder="Current Password" style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', marginBottom: '8px', boxSizing: 'border-box'}} />
                    <input type="password" placeholder="New Password" style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', marginBottom: '8px', boxSizing: 'border-box'}} />
                    <input type="password" placeholder="Confirm Password" style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box'}} />
                  </div>

                  <button style={{background: '#4f46e5', color: 'white', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', alignSelf: 'flex-start'}}>Update Password</button>

                  <div style={{borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '16px'}}>
                    <p style={{color: '#4b5563', fontSize: '14px', marginBottom: '8px', margin: 0}}>Two-Factor Authentication</p>
                    <button style={{background: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600'}}>Enable 2FA</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}