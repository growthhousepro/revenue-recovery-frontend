'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('user_email', data.email);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('team_id', data.team_id);
        router.push('/dashboard');
      } else {
        setError(data.detail || 'Registration failed');
      }
    } catch (err) {
      setError('Failed to register');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    color: '#111827',
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <div style={{ background: 'white', padding: '48px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0', textAlign: 'center' }}>
          Create Account
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', margin: '0 0 32px 0' }}>
          Join Revenue Recovery
        </p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#4f46e5',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginTop: '8px',
            }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', margin: '24px 0 0 0' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}