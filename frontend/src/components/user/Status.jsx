import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ChatWindow from '../common/ChatWindow';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Status() {
  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/complaints/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(data.complaints || data || []);
    } catch (error) {
      toast.error('Unable to fetch complaint status');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Complaint deleted');
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleFeedback = async (e, complaintId) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/feedback/${complaintId}`,
        { rating: Number(rating), comments },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Feedback submitted');
      setComments('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Feedback failed');
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '16px' }}>
        <Link to="/user/home">&larr; Back to User Home</Link>
      </div>
      <h2 style={{ marginBottom: '16px' }}>Track Status, Chat & Feedback</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {complaints.map((item) => (
          <div
            key={item._id}
            style={{
              backgroundColor: '#ffffff',
              padding: '18px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <h3>{item.title}</h3>
                <p style={{ marginTop: '4px' }}>{item.description}</p>
                <p style={{ marginTop: '8px', fontSize: '14px' }}>
                  <strong>Status:</strong> {item.status} |{' '}
                  <strong>Category:</strong> {item.category}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedId(selectedId === item._id ? null : item._id)
                  }
                >
                  {selectedId === item._id ? 'Hide Chat' : 'Open Chat'}
                </button>
                {item.status === 'Pending' && (
                  <button type="button" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>

            {selectedId === item._id && (
              <ChatWindow
                complaintId={item._id}
                messages={item.messages || []}
                onMessageSent={fetchComplaints}
              />
            )}

            {(item.status === 'Resolved' || item.status === 'Closed') && (
              <form
                onSubmit={(e) => handleFeedback(e, item._id)}
                style={{
                  marginTop: '14px',
                  paddingTop: '12px',
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
                <input
                  type="text"
                  placeholder="Write feedback comment..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit">Submit Feedback</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Status;
