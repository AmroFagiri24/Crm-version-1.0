import React, { useState } from 'react';

function TwoFactorAuth({ user, onVerifySuccess, onCancel }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple verification - accept any 6-digit code
    if (code.length === 6) {
      onVerifySuccess();
    } else {
      setError('Please enter a 6-digit code');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h3>Two-Factor Authentication</h3>
        <p>Enter verification code (any 6 digits for demo):</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '18px',
              textAlign: 'center'
            }}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Verify
            </button>
            <button type="button" onClick={onCancel} style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TwoFactorAuth;