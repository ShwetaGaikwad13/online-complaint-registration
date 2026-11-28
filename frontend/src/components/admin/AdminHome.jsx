import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AccordionAdmin from './AccordionAdmin';
import UserInfo from './UserInfo';
import AgentInfo from './AgentInfo';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AdminHome({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('complaints');
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [compRes, usersRes, agentsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/complaints`, { headers }),
        axios.get(`${API_URL}/admin/users`, { headers }),
        axios.get(`${API_URL}/admin/agents`, { headers }),
        axios.get(`${API_URL}/admin/analytics`, { headers }).catch(() => ({ data: null })),
      ]);

      setComplaints(compRes.data.complaints || compRes.data || []);
      setUsers(usersRes.data.users || usersRes.data || []);
      setAgents(agentsRes.data.agents || agentsRes.data || []);
      setAnalytics(statsRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load admin data');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2>Admin Dashboard — {user?.name || 'Admin'}</h2>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {analytics && (
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '20px',
          }}
        >
          <div style={{ backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '8px' }}>
            <strong>Total Complaints:</strong> {analytics.totalComplaints ?? complaints.length}
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '8px' }}>
            <strong>Total Users:</strong> {analytics.totalUsers ?? users.length}
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '8px' }}>
            <strong>Total Agents:</strong> {analytics.totalAgents ?? agents.length}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button type="button" onClick={() => setActiveTab('complaints')}>
          Complaints
        </button>
        <button type="button" onClick={() => setActiveTab('users')}>
          Users
        </button>
        <button type="button" onClick={() => setActiveTab('agents')}>
          Agents
        </button>
      </div>

      {activeTab === 'complaints' && (
        <AccordionAdmin
          complaints={complaints}
          agents={agents}
          onAssigned={fetchAdminData}
        />
      )}
      {activeTab === 'users' && <UserInfo users={users} />}
      {activeTab === 'agents' && <AgentInfo agents={agents} />}
    </div>
  );
}

export default AdminHome;
