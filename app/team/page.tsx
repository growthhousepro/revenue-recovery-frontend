'use client';
import ProtectedLayout from '@/src/components/ProtectedLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeamSettings() {
  const router = useRouter();
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [inviting, setInviting] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [removingMember, setRemovingMember] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    if (!token || !userId) {
      router.push('/login');
      return;
    }
    setCurrentUserId(userId);
    fetchTeamData(token, userId);
  }, []);

  const fetchTeamData = async (token: string, userId: string) => {
    try {
      setLoading(true);
      setError('');

      // Get team info
      const teamRes = await fetch('http://localhost:8000/api/teams/team', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (teamRes.ok) {
        const teamData = await teamRes.json();
        setTeam(teamData);
      } else {
        setError('Failed to load team');
      }

      // Get team members
      const membersRes = await fetch('http://localhost:8000/api/teams/team/members', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(Array.isArray(membersData) ? membersData : []);

        // Find current user's role
        const currentMember = membersData.find((m: any) => m.user_id === userId);
        if (currentMember) {
          setCurrentUserRole(currentMember.team_role);
        }
      } else {
        setError('Failed to load team members');
      }
    } catch (error: any) {
      setError(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) {
      setError('Please enter an email');
      return;
    }

    setInviting(true);
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch('http://localhost:8000/api/teams/team/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: inviteEmail,
          team_role: inviteRole,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setInviteEmail('');
        setInviteRole('editor');
        setError('');
        alert('Invite sent successfully!');
        fetchTeamData(token, currentUserId!);
      } else {
        setError(data.detail || 'Failed to invite member');
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch(`http://localhost:8000/api/teams/team/member/${memberId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ new_role: newRole }),
      });

      if (res.ok) {
        alert('Role updated successfully');
        fetchTeamData(token, currentUserId!);
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to update role');
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    setRemovingMember(memberId);
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch(`http://localhost:8000/api/teams/team/member/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Member removed successfully');
        fetchTeamData(token, currentUserId!);
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to remove member');
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setRemovingMember(null);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <p>Loading team settings...</p>
        </div>
      </ProtectedLayout>
    );
  }

  const isOwner = currentUserRole === 'owner';
  const isManager = currentUserRole === 'manager' || currentUserRole === 'owner';

  return (
    <ProtectedLayout>
      <div style={{ maxWidth: '1000px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: '0 0 32px 0' }}>Team Settings</h1>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>{error}</div>}

        {/* Team Info */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Team Information</h2>
          {team && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#4b5563', fontWeight: '600', margin: '0 0 4px 0' }}>Team Name</p>
                <p style={{ fontSize: '16px', color: '#111827', margin: 0 }}>{team.name}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#4b5563', fontWeight: '600', margin: '0 0 4px 0' }}>Your Role</p>
                <p style={{ fontSize: '16px', color: '#111827', margin: 0, textTransform: 'capitalize' }}>{currentUserRole}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#4b5563', fontWeight: '600', margin: '0 0 4px 0' }}>Created</p>
                <p style={{ fontSize: '16px', color: '#111827', margin: 0 }}>{new Date(team.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#4b5563', fontWeight: '600', margin: '0 0 4px 0' }}>Members</p>
                <p style={{ fontSize: '16px', color: '#111827', margin: 0 }}>{members.length} member{members.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          )}
        </div>

        {/* Invite Member */}
        {isManager && (
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Invite Team Member</h2>
            <form onSubmit={handleInviteMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="member@example.com"
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
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#111827',
                    background: 'white',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="analyst">Analyst (View-only)</option>
                  <option value="editor">Editor (Can edit campaigns)</option>
                  <option value="manager">Manager (Full access)</option>
                  {isOwner && <option value="owner">Owner (Full control)</option>}
                </select>
                <p style={{ fontSize: '11px', color: '#4b5563', margin: '4px 0 0 0' }}>
                  {inviteRole === 'analyst' && 'Can view reports and analytics only'}
                  {inviteRole === 'editor' && 'Can create and edit campaigns, view reports'}
                  {inviteRole === 'manager' && 'Can manage campaigns, invite members, view all data'}
                  {inviteRole === 'owner' && 'Full access, can manage team'}
                </p>
              </div>

              <button
                type="submit"
                disabled={inviting || !inviteEmail}
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: inviting || !inviteEmail ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  opacity: inviting || !inviteEmail ? 0.6 : 1,
                }}
              >
                {inviting ? 'Sending...' : 'Send Invite'}
              </button>
            </form>

            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', padding: '12px', borderRadius: '6px', marginTop: '16px' }}>
              <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                💡 <strong>Note:</strong> Team members must already have a GrowthHouse account. Share this link with them to sign up: <code style={{ background: '#fff7ed', padding: '2px 4px', borderRadius: '2px' }}>growthhouse.com/register</code>
              </p>
            </div>
          </div>
        )}

        {/* Team Members */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Team Members ({members.length})</h2>

          {members.length === 0 ? (
            <p style={{ color: '#4b5563', fontSize: '14px' }}>No team members yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {members.map((member: any) => (
                <div
                  key={member.id}
                  style={{
                    background: '#f9fafb',
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{member.email}</p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                      <p style={{ fontSize: '12px', color: '#4b5563', margin: 0 }}>
                        Role: <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{member.team_role}</span>
                      </p>
                      <p style={{ fontSize: '12px', color: '#4b5563', margin: 0 }}>
                        Joined: {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {isOwner && member.user_id !== currentUserId && member.team_role !== 'owner' && (
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                      <select
                        value={member.team_role}
                        onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#111827',
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="analyst">Analyst</option>
                        <option value="editor">Editor</option>
                        <option value="manager">Manager</option>
                      </select>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={removingMember === member.id}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: removingMember === member.id ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          opacity: removingMember === member.id ? 0.6 : 1,
                        }}
                      >
                        {removingMember === member.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  )}

                  {member.team_role === 'owner' && (
                    <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                      Owner
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role Permissions */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Role Permissions</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
            {[
              { name: 'Analyst', perms: ['View Reports', 'View Analytics', 'View Campaigns'] },
              { name: 'Editor', perms: ['Create Campaigns', 'Edit Campaigns', 'View Reports', 'View Analytics'] },
              { name: 'Manager', perms: ['Manage Campaigns', 'Manage Templates', 'Invite Members', 'View All Data'] },
              { name: 'Owner', perms: ['Full Access', 'Manage Team', 'Change Billing', 'Delete Team'] },
            ].map((role) => (
              <div key={role.name} style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>{role.name}</p>
                {role.perms.map((perm) => (
                  <p key={perm} style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0' }}>✓ {perm}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}