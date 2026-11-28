import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AccordionAdmin({ complaints = [], agents = [], onAssigned }) {
  const [selectedAgent, setSelectedAgent] = useState({});
  const [openId, setOpenId] = useState(null);

  const handleAssign = async (complaintId) => {
    const agentId = selectedAgent[complaintId];
    if (!agentId) {
      toast.error('Please select an agent first');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/admin/assign/${complaintId}`,
        { agentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Agent assigned successfully');
      if (onAssigned) onAssigned();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3>All Complaints ({complaints.length})</h3>
      {complaints.length === 0 ? (
        <p>No complaints registered yet.</p>
      ) : (
        complaints.map((item) => (
          <div
            key={item._id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '14px',
            }}
          >
            <div
              onClick={() => setOpenId(openId === item._id ? null : item._id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <strong>{item.title}</strong>
              <span>{item.status}</span>
            </div>

            {openId === item._id && (
              <div style={{ marginTop: '12px' }}>
                <p>{item.description}</p>
                <p style={{ marginTop: '6px', fontSize: '14px' }}>
                  <strong>Category:</strong> {item.category} |{' '}
                  <strong>User:</strong> {item.userId?.name || 'User'}
                </p>

                <div
                  style={{
                    marginTop: '10px',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <select
                    value={selectedAgent[item._id] || ''}
                    onChange={(e) =>
                      setSelectedAgent((prev) => ({
                        ...prev,
                        [item._id]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Agent</option>
                    {agents.map((ag) => {
                      const agentUserId = ag.userId?._id || ag._id;
                      const agentName = ag.userId?.name || ag.name || 'Agent';
                      return (
                        <option key={ag._id} value={agentUserId}>
                          {agentName} ({ag.department || 'General'})
                        </option>
                      );
                    })}
                  </select>
                  <button type="button" onClick={() => handleAssign(item._id)}>
                    Assign Agent
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AccordionAdmin;
