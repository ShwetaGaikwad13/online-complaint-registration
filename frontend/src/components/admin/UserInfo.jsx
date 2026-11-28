import React from 'react';

function UserInfo({ users = [] }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      }}
    >
      <h3 style={{ marginBottom: '12px' }}>Registered Users ({users.length})</h3>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {users.map((u) => (
            <div
              key={u._id}
              style={{
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
            >
              <strong>{u.name}</strong> — {u.email} ({u.role})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserInfo;
