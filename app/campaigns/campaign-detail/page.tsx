'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function CampaignContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const fetch_data = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/campaigns/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCampaign(data);
        }
      } catch (err) {
        console.error('Failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch_data();
  }, [id]);

  if (loading) return <div style={{ padding: '32px' }}>Loading...</div>;
  if (!campaign) return <div style={{ padding: '32px' }}>Not found</div>;

  return <div style={{ maxWidth: '1200px' }}><h1>{campaign.name}</h1></div>;
}

export default function Page() {
  return (
    <ProtectedLayout>
      <Suspense fallback={<div style={{ padding: '32px' }}>Loading...</div>}>
        <CampaignContent />
      </Suspense>
    </ProtectedLayout>
  );
}