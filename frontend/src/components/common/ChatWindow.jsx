import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ChatWindow({ complaintId, messages = [], onMessageSent }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/complaints/${complaintId}/messages`,
        { text: text.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
      toast.success('Message sent');
      if (onMessageSent) onMessageSent();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '16px',
      }}
    >
      <h4 style={{ marginBottom: '12px' }}>Conversation</h4>
      <div
        style={{
          maxHeight: '240px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '12px',
        }}
      >
        {messages.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No messages yet.</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              style={{
                backgroundColor: '#ffffff',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
              }}
            >
              <strong>{msg.senderName || msg.senderRole || 'User'}:</strong>{' '}
              <span>{msg.text || msg.message}</span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
