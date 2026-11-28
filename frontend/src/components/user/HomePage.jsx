import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function HomePage({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/complaints/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(data.complaints || data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
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
        <h2>Welcome, {user?.name || 'User'}</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/user/complaint">New Complaint</Link>
          <Link to="/user/status">Track & Feedback</Link>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ marginBottom: '14px' }}>My Registered Complaints</h3>
        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p>No complaints submitted yet. Click "New Complaint" to file one.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {complaints.map((item) => (
              <div
                key={item._id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '14px',
                }}
              >
                <h4>{item.title}</h4>
                <p style={{ marginTop: '6px', color: '#4b5563' }}>{item.description}</p>
                <p style={{ marginTop: '8px', fontSize: '14px' }}>
                  <strong>Category:</strong> {item.category} |{' '}
                  <strong>Status:</strong> {item.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
