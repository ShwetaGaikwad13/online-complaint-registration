import React from 'react';
import { Link } from 'react-router-dom';

function Home({ user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="page-container">
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          marginBottom: '24px',
        }}
      >
        <h2>Complaint Portal</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            <>
              {user.role === 'USER' && <Link to="/user/home">User Home</Link>}
              {user.role === 'AGENT' && <Link to="/agent/home">Agent Home</Link>}
              {user.role === 'ADMIN' && <Link to="/admin/home">Admin Home</Link>}
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '32px',
          borderRadius: '8px',
        }}
      >
        <h1>Online Complaint Registration & Management</h1>
        <p style={{ marginTop: '12px', lineHeight: '1.6' }}>
          Register complaints, track real-time resolution status, chat with assigned
          support agents, and submit feedback once resolved.
        </p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          {!user ? (
            <>
              <Link to="/signup">Get Started</Link>
              <Link to="/login">Sign In</Link>
            </>
          ) : user.role === 'USER' ? (
            <Link to="/user/complaint">File a Complaint</Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Home;
