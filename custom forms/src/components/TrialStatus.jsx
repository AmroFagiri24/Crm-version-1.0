// src/components/TrialStatus.jsx
import React from 'react';

const TrialStatus = ({ user }) => {
  if (!user || user.role === 'admin' || user.licenseType !== 'trial' || !user.trialEndDate) {
    return null;
  }

  const trialEnd = new Date(user.trialEndDate);
  const now = new Date();
  const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
  
  if (daysLeft <= 0) {
    return (
      <div style={{
        backgroundColor: '#e74c3c',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        ⚠️ Trial Expired
      </div>
    );
  }

  const getStatusColor = () => {
    if (daysLeft <= 1) return '#e74c3c';
    if (daysLeft <= 3) return '#f39c12';
    return '#27ae60';
  };

  return (
    <div style={{
      backgroundColor: getStatusColor(),
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      opacity: '0.1'
    }}>
      🆓 Trial: {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
    </div>
  );
};

export default TrialStatus;