'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchSubscription(token);
  }, []);

  const fetchSubscription = async (token: string) => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/billing/subscription', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      } else {
        setError('Failed to load subscription');
      }
    } catch (err) {
      setError('Error loading subscription');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradePlan = (plan: string) => {
    router.push(`/checkout?plan=${plan}`);
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <p>Loading billing information...</p>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Billing & Subscription
          </h1>
          <p style={{ fontSize: '14px', color: '#4b5563', margin: '8px 0 0 0' }}>
            Manage your subscription, view usage, and payment history
          </p>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{error}</div>}

        {/* Current Plan */}
        {subscription?.has_subscription ? (
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>
              Current Plan
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Plan Name</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>
                  GrowthHouse {subscription.plan === 'launch' ? 'Launch' : 'Scale'}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Monthly Price</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>
                  ${subscription.plan === 'launch' ? '199' : '899'}/month
                </p>
              </div>

              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Status</p>
                <p style={{ fontSize: '14px', color: '#10b981', margin: '8px 0 0 0', fontWeight: '600' }}>
                  ✅ {subscription.status}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Billing Period</p>
                <p style={{ fontSize: '14px', color: '#111827', margin: '8px 0 0 0' }}>
                  {new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
            </div>

            {subscription.plan === 'launch' && (
              <button
                onClick={() => handleUpgradePlan('scale')}
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
                Upgrade to Scale
              </button>
            )}
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 12px 0' }}>
              No Active Subscription
            </h2>
            <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 24px 0' }}>
              Choose a plan to get started with GrowthHouse
            </p>
            <button
              onClick={() => router.push('/pricing')}
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
              View Plans
            </button>
          </div>
        )}

        {/* Usage This Month */}
        {subscription?.has_subscription && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>
              Usage This Month
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>AI Usage Events</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>
                  {subscription.usage_this_month || 0}
                </p>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0 0 0' }}>
                  @ $0.02 per event
                </p>
              </div>

              <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '6px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Usage Cost This Month</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '8px 0 0 0' }}>
                  ${(subscription.usage_cost_this_month || 0).toFixed(2)}
                </p>
                <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0 0 0' }}>
                  Billed with monthly subscription
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>
            Payment Method
          </h2>

          <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
              💳 Visa ending in 4242
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Expires 12/25
            </p>
          </div>

          <button
            style={{
              background: '#e5e7eb',
              color: '#111827',
              padding: '10px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Update Payment Method
          </button>
        </div>

        {/* Billing History */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>
            Billing History
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Description</th>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 0', fontSize: '14px', color: '#111827' }}>Jul 3, 2026</td>
                  <td style={{ padding: '12px 0', fontSize: '14px', color: '#111827' }}>GrowthHouse Launch - Monthly subscription</td>
                  <td style={{ padding: '12px 0', fontSize: '14px', color: '#111827' }}>$199.00</td>
                  <td style={{ padding: '12px 0', fontSize: '14px' }}><span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}