'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Pricing</h1>
          <button
            onClick={() => router.push('/dashboard')}
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
            Back to Dashboard
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '48px' }}>
          <div style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Launch</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>Perfect for getting started</p>
            
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827' }}>$199</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>/month</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Up to 500 leads/month</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ $25 per confirmed booking</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ AI email generation</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Basic analytics</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Email support</li>
            </ul>

            <button style={{
              background: '#4f46e5',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: 'auto'
            }}>
              Choose Plan
            </button>
          </div>

          <div style={{ background: 'white', border: '2px solid #4f46e5', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '16px', background: '#4f46e5', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
              POPULAR
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Scale</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>Best for growing businesses</p>
            
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827' }}>$899</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>/month</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Unlimited leads</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Unlimited bookings</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ AI email generation</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Advanced analytics</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Priority support</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Custom workflows</li>
            </ul>

            <button style={{
              background: '#4f46e5',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: 'auto'
            }}>
              Choose Plan
            </button>
          </div>

          <div style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Done-For-You</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>White-glove service</p>
            
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827' }}>Custom</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Everything in Scale</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Dedicated account manager</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Done-for-you campaigns</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ Lead list building</li>
              <li style={{ padding: '8px 0', color: '#4b5563', fontSize: '14px' }}>✓ CRM integration</li>
            </ul>

            <button style={{
              background: '#4f46e5',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: 'auto'
            }}>
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}