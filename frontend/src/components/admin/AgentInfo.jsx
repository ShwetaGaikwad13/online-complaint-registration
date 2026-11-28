import React from 'react';

function AgentInfo({ agents = [] }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      }}
    >
      <h3 style={{ marginBottom: '12px' }}>Support Agents ({agents.length})</h3>
      {agents.length === 0 ? (
        <p>No agents found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {agents.map((ag) => (
            <div
              key={ag._id}
              style={{
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
            >
              <strong>{ag.userId?.name || ag.name || 'Agent'}</strong> —{' '}
              {ag.userId?.email || ag.email} |{' '}
              <span>Department: {ag.department || 'General'}</span> |{' '}
              <span>Assigned: {ag.assignedComplaints?.length || 0}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentInfo;
