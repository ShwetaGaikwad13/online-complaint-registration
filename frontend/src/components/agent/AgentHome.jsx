import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ChatWindow from '../common/ChatWindow';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AgentHome({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const navigate = useNavigate();

  const fetchAssigned = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/complaints/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = data.complaints || data || [];
      setComplaints(list);

      const initialStatus = {};
      list.forEach((c) => {
        initialStatus[c._id] = c.status;
      });
      setStatusMap(initialStatus);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load assigned complaints');
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  const handleStatusUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/complaints/${id}/status`,
        { status: statusMap[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated');
      fetchAssigned();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

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
        <h2>Agent Dashboard — {user?.name || 'Agent'}</h2>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {complaints.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <p>No complaints assigned yet.</p>
          </div>
        ) : (
          complaints.map((item) => (
            <div
              key={item._id}
              style={{
                backgroundColor: '#ffffff',
                padding: '18px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <h3>{item.title}</h3>
              <p style={{ marginTop: '6px' }}>{item.description}</p>
              <p style={{ marginTop: '8px', fontSize: '14px' }}>
                <strong>Category:</strong> {item.category} |{' '}
                <strong>Current Status:</strong> {item.status}
              </p>

              <div
                style={{
                  marginTop: '12px',
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <select
                  value={statusMap[item._id] || item.status}
                  onChange={(e) =>
                    setStatusMap((prev) => ({ ...prev, [item._id]: e.target.value }))
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
                <button type="button" onClick={() => handleStatusUpdate(item._id)}>
                  Update Status
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedId(selectedId === item._id ? null : item._id)
                  }
                >
                  {selectedId === item._id ? 'Hide Chat' : 'Open Chat'}
                </button>
              </div>

              {selectedId === item._id && (
                <ChatWindow
                  complaintId={item._id}
                  messages={item.messages || []}
                  onMessageSent={fetchAssigned}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AgentHome;
