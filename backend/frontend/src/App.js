import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technical');
  const [description, setDescription] = useState('');

  const API_URL = 'http://localhost:5000/api/complaints';

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(API_URL);
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching complaints', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { title, category, description });
      setTitle('');
      setDescription('');
      fetchComplaints();
      alert('Complaint Registered Successfully!');
    } catch (err) {
      alert('Failed to register complaint');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status });
      fetchComplaints();
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">Online Complaint Registration System</h2>

      <div className="card p-4 mb-4 shadow-sm">
        <h4>Register a New Complaint</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Complaint Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
              <option value="Service">Service</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit Complaint</button>
        </form>
      </div>

      <div className="card p-4 shadow-sm">
        <h4>Track Complaints (Admin / Agent View)</h4>
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>
                  <span className={`badge ${item.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => updateStatus(item._id, 'Resolved')}
                  >
                    Mark Resolved
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
