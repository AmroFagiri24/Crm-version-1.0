// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = '#3498db' }) => {
  const sizes = {
    small: '16px',
    medium: '24px',
    large: '32px'
  };

  return (
    <div style={{
      width: sizes[size],
      height: sizes[size],
      border: `2px solid #f3f3f3`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      display: 'inline-block'
    }} />
  );
};

export default LoadingSpinner;