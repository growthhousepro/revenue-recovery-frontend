'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'launch' | 'scale'>('launch');

  const handleSelectPlan = (plan: 'launch' | 'scale') => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    router.push(`/checkout?plan=${plan}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '80px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ fontSize: '18px', color: '#4b5563', marginTop: '16px' }}>
            Start free, upgrade when you're ready. No credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          {/* Launch Plan */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: selectedPlan === 'launch' ? '2px solid #4f46e5' : '2px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            if (selectedPlan !== 'launch') {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedPlan !== 'launch') {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }
          }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
                GrowthHouse Launch
              </h2>
              <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
                Perfect for growing agencies
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827' }}>
                $199<span style={{ fontSize: '24px', color: '#4b5563' }}>/month</span>
              </div>
              <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '8px' }}>
                Plus $25 per qualified appointment
              </p>
            </div>

            <button
              onClick={() => handleSelectPlan('launch')}
              style={{
                width: '100%',
                background: selectedPlan === 'launch' ? '#4f46e5' : '#e5e7eb',
                color: selectedPlan === 'launch' ? 'white' : '#111827',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '32px',
                fontSize: '14px'
              }}
            >
              {selectedPlan === 'launch' ? 'Selected' : 'Choose Plan'}
            </button>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                What's included:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Unlimited email campaigns',
                  'AI email template generation',
                  'Booking detection via AI',
                  'Up to 5 team members',
                  '3-tier email follow-ups',
                  '$0.02 per AI usage',
                  'Email analytics',
                  'CSV lead import'
                ].map((feature, i) => (
                  <li key={i} style={{ fontSize: '14px', color: '#4b5563', paddingBottom: '12px', paddingLeft: '24px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0 }}>✅</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Scale Plan */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: selectedPlan === 'scale' ? '2px solid #4f46e5' : '2px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.3s',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (selectedPlan !== 'scale') {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedPlan !== 'scale') {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              right: '24px',
              background: '#4f46e5',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              MOST POPULAR
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
                GrowthHouse Scale
              </h2>
              <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
                For high-volume agencies
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827' }}>
                $899<span style={{ fontSize: '24px', color: '#4b5563' }}>/month</span>
              </div>
              <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '8px' }}>
                Unlimited qualified appointments
              </p>
            </div>

            <button
              onClick={() => handleSelectPlan('scale')}
              style={{
                width: '100%',
                background: selectedPlan === 'scale' ? '#4f46e5' : '#e5e7eb',
                color: selectedPlan === 'scale' ? 'white' : '#111827',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '32px',
                fontSize: '14px'
              }}
            >
              {selectedPlan === 'scale' ? 'Selected' : 'Choose Plan'}
            </button>

            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Everything in Launch, plus:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Unlimited team members',
                  'Priority support',
                  'API access',
                  'Custom integrations',
                  'Advanced analytics',
                  'Dedicated account manager',
                  'White-label option'
                ].map((feature, i) => (
                  <li key={i} style={{ fontSize: '14px', color: '#4b5563', paddingBottom: '12px', paddingLeft: '24px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0 }}>⭐</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '32px' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'grid', gap: '24px' }}>
            {[
              {
                q: 'What counts as a qualified appointment?',
                a: 'Any booking detection made by our AI that recognizes a confirmed appointment in customer emails.'
              },
              {
                q: 'Can I change plans anytime?',
                a: 'Yes! Upgrade or downgrade your plan whenever you want. Changes take effect immediately.'
              },
              {
                q: 'Is there a free trial?',
                a: 'We\'re offering free access during beta. Sign up to get started with no credit card required.'
              },
              {
                q: 'What if I need more help?',
                a: 'Scale plan customers get a dedicated account manager. Launch customers can email support anytime.'
              }
            ].map((item, i) => (
              <div key={i}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  {item.q}
                </h3>
                <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}