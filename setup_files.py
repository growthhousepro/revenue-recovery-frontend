import os
import json

# Create directories
os.makedirs('src/lib', exist_ok=True)
os.makedirs('src/components', exist_ok=True)
os.makedirs('app/login', exist_ok=True)
os.makedirs('app/register', exist_ok=True)
os.makedirs('app/dashboard', exist_ok=True)
os.makedirs('app/campaigns', exist_ok=True)
os.makedirs('app/appointments', exist_ok=True)
os.makedirs('app/reports', exist_ok=True)
os.makedirs('app/settings', exist_ok=True)

# Create .env.local
with open('.env.local', 'w') as f:
    f.write('NEXT_PUBLIC_API_URL=http://localhost:8000/api\n')

# Create src/lib/api.ts
api_code = """import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
"""

with open('src/lib/api.ts', 'w') as f:
    f.write(api_code)

# Create src/components/Layout.tsx
layout_code = """import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { label: 'Campaigns', icon: '📧', href: '/campaigns' },
    { label: 'Appointments', icon: '📅', href: '/appointments' },
    { label: 'Reports', icon: '📈', href: '/reports' },
    { label: 'Settings', icon: '⚙️', href: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          {sidebarOpen && <h1 className="text-xl font-bold">Revenue Recovery</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-800 p-2 rounded">
            ☰
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <span>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            {sidebarOpen ? 'Logout' : '←'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
"""

with open('src/components/Layout.tsx', 'w') as f:
    f.write(layout_code)

# Create login page
login_code = """'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('company', JSON.stringify(response.data.company));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Revenue Recovery</h1>
          <p className="text-gray-600 mt-2">Campaign Management Platform</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="you@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
"""

with open('app/login/page.tsx', 'w') as f:
    f.write(login_code)

# Create register page
register_code = """'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', formData);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('company', JSON.stringify(response.data.company));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Revenue Recovery</h1>
          <p className="text-gray-600 mt-2">Create Your Account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Company Name"
            required
          />

          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="First Name"
            required
          />

          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Last Name"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
"""

with open('app/register/page.tsx', 'w') as f:
    f.write(register_code)

# Create dashboard page
dashboard_code = """'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <Layout><div className="text-center py-8">Loading...</div></Layout>;

  const stats = [
    { title: 'Total Leads', value: 245, color: 'bg-blue-500' },
    { title: 'Emails Sent', value: 1203, color: 'bg-green-500' },
    { title: 'Replies Received', value: 156, color: 'bg-purple-500' },
    { title: 'Conversion Rate', value: '12.9%', color: 'bg-orange-500' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className={`${stat.color} w-12 h-12 rounded-lg mb-4`}></div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Performance</h2>
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center text-gray-500">
              Chart placeholder
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Lead Status</h2>
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center text-gray-500">
              Chart placeholder
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">John Smith</p>
                  <p className="text-sm text-gray-600">john@company.com</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Replied
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
"""

with open('app/dashboard/page.tsx', 'w') as f:
    f.write(dashboard_code)

# Create campaigns page
campaigns_code = """'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Layout from '@/components/Layout';

export default function Campaigns() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [formData, setFormData] = useState({ name: '', client_name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/campaigns/');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/campaigns/', formData);
      setFormData({ name: '', client_name: '', description: '' });
      setShowNewCampaign(false);
      fetchCampaigns();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <button
            onClick={() => setShowNewCampaign(!showNewCampaign)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + New Campaign
          </button>
        </div>

        {showNewCampaign && (
          <form onSubmit={handleCreateCampaign} className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Campaign Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="Client Name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Create Campaign
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCampaign(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign: any) => (
            <div key={campaign.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <p className="text-gray-600 text-sm">{campaign.client_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${campaign.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {campaign.is_active ? 'Active' : 'Paused'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{campaign.total_leads}</p>
                  <p className="text-gray-600 text-xs">Leads</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{campaign.emails_sent}</p>
                  <p className="text-gray-600 text-xs">Sent</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{campaign.replies_received || 0}</p>
                  <p className="text-gray-600 text-xs">Replies</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">
                  Manage
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-300">
                  Reports
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
"""

with open('app/campaigns/page.tsx', 'w') as f:
    f.write(campaigns_code)

# Create appointments page
appointments_code = """'use client';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Appointments() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) router.push('/login');
  }, []);

  const appointments = [
    { id: 1, lead: 'John Smith', date: '2026-07-02 10:00 AM', status: 'Scheduled' },
    { id: 2, lead: 'Jane Doe', date: '2026-07-02 2:00 PM', status: 'Completed' },
    { id: 3, lead: 'Bob Johnson', date: '2026-07-03 11:00 AM', status: 'Scheduled' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Lead Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Date & Time</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{apt.lead}</td>
                  <td className="px-6 py-3">{apt.date}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${apt.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
"""

with open('app/appointments/page.tsx', 'w') as f:
    f.write(appointments_code)

# Create reports page
reports_code = """'use client';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Reports() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) router.push('/login');
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Campaigns:</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Leads:</span>
                <span className="font-semibold">245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Emails Sent:</span>
                <span className="font-semibold">1,203</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Replies:</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600 font-semibold">Response Rate:</span>
                <span className="font-semibold text-green-600">12.9%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Usage This Month</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Emails Sent</span>
                  <span className="text-sm font-semibold">450 / 500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Leads Imported</span>
                  <span className="text-sm font-semibold">245 / 500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{width: '49%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
"""

with open('app/reports/page.tsx', 'w') as f:
    f.write(reports_code)

# Create settings page
settings_code = """'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    company_name: '',
    email: '',
    from_email: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const company = localStorage.getItem('company');
    if (!token) {
      router.push('/login');
    } else if (company) {
      const companyData = JSON.parse(company);
      setSettings({
        company_name: companyData.name,
        email: '',
        from_email: '',
      });
    }
  }, []);

  const handleSave = async () => {
    alert('Settings saved!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">Settings</h2>
            </div>
            <nav className="space-y-1 p-4">
              {['General', 'Email', 'Billing', 'Team', 'Security'].map((item) => (
                <button
                  key={item}
                  className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={settings.company_name}
                    onChange={(e) => setSettings({...settings, company_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Subscription</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Professional Plan</p>
                    <p className="text-gray-600 text-sm">$299/month</p>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
"""

with open('app/settings/page.tsx', 'w') as f:
    f.write(settings_code)

print("✅ All files created successfully!")
print("Files created:")
print("  ✓ .env.local")
print("  ✓ src/lib/api.ts")
print("  ✓ src/components/Layout.tsx")
print("  ✓ app/login/page.tsx")
print("  ✓ app/register/page.tsx")
print("  ✓ app/dashboard/page.tsx")
print("  ✓ app/campaigns/page.tsx")
print("  ✓ app/appointments/page.tsx")
print("  ✓ app/reports/page.tsx")
print("  ✓ app/settings/page.tsx")
print("")
print("🚀 Your frontend is ready! Visit http://localhost:3000")