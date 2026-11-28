import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Complaint() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technical');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/complaints`,
        { title, category, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Complaint registered successfully');
      navigate('/user/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '560px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/user/home">&larr; Back to User Home</Link>
      </div>
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ marginBottom: '16px' }}>Register a New Complaint</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <input
            type="text"
            placeholder="Complaint Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Service">Service</option>
            <option value="Delivery">Delivery</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            rows="4"
            placeholder="Describe your issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Complaint;
