'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company_name: 'Test Company',
    email: 'new@test.com',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);
      router.push('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff)'}}>
      <div style={{background: 'white', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '32px', width: '100%', maxWidth: '448px'}}>
        <h1 style={{fontSize: '36px', fontWeight: 'bold', color: '#111827', textAlign: 'center'}}>Revenue Recovery</h1>
        <p style={{color: '#4b5563', textAlign: 'center', marginBottom: '24px'}}>Create Account</p>

        {error && <div style={{background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px'}}>{error}</div>}

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          <input type="text" placeholder="Company Name" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px'}} />
          <input type="text" placeholder="First Name" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px'}} />
          <input type="text" placeholder="Last Name" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px'}} />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px'}} />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', marginBottom: '16px'}} />
          <button type="submit" disabled={loading} style={{width: '100%', background: '#4f46e5', color: 'white', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', opacity: loading ? 0.5 : 1}}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
}