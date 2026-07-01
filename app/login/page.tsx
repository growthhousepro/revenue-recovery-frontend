'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed - check backend is running on http://localhost:8000');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff)'}}>
      <div style={{background: 'white', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '48px 32px', width: '100%', maxWidth: '448px'}}>
        <h1 style={{fontSize: '36px', fontWeight: 'bold', color: '#111827', textAlign: 'center', margin: 0}}>Revenue Recovery</h1>
        <p style={{color: '#4b5563', textAlign: 'center', marginBottom: '24px', margin: '8px 0 24px 0'}}>Campaign Management Platform</p>

        {error && (
          <div style={{background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@test.com"
              style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px'}}
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px'}}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{width: '100%', background: '#4f46e5', color: 'white', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', opacity: loading ? 0.5 : 1, marginTop: '8px'}}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{textAlign: 'center', color: '#4b5563', fontSize: '14px', marginTop: '16px', margin: '16px 0 0 0'}}>Test credentials pre-filled</p>
      </div>
    </div>
  );
}