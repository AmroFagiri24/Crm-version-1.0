// src/components/UXEnhancementProvider.jsx
import React from 'react';
import { useOffline } from '../hooks/useOffline';
import { useIsMobile } from '../hooks/useMediaQuery';

const OfflineIndicator = () => {
  const { isOffline, pendingActions } = useOffline();
  
  if (!isOffline) return null;
  
  return (
    <div className="offline-indicator">
      You are offline. {pendingActions.length > 0 && `${pendingActions.length} actions queued.`}
    </div>
  );
};

const KeyboardShortcutsHelp = ({ show, onClose }) => {
  if (!show) return null;
  
  const shortcuts = [
    { key: 'Ctrl + N', action: 'New Order' },
    { key: 'Ctrl + D', action: 'Dashboard' },
    { key: 'Ctrl + O', action: 'Orders' },
    { key: 'Ctrl + I', action: 'Inventory' },
    { key: 'Ctrl + M', action: 'Menu' },
    { key: 'Escape', action: 'Show this help' }
  ];
  
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      zIndex: 10000,
      minWidth: '300px'
    }}>
      <h3 style={{ marginBottom: '16px', color: '#374151' }}>Keyboard Shortcuts</h3>
      {shortcuts.map((shortcut, index) => (
        <div key={index} style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 0',
          borderBottom: index < shortcuts.length - 1 ? '1px solid #e5e7eb' : 'none'
        }}>
          <kbd style={{
            background: '#f3f4f6',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>{shortcut.key}</kbd>
          <span style={{ color: '#6b7280' }}>{shortcut.action}</span>
        </div>
      ))}
      <button
        onClick={onClose}
        style={{
          marginTop: '16px',
          width: '100%',
          padding: '8px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Close
      </button>
    </div>
  );
};

const QuickActionsFAB = ({ onNewOrder, isMobile }) => {
  const [showActions, setShowActions] = React.useState(false);
  
  if (!isMobile) return null;
  
  return (
    <>
      <button
        className="fab"
        onClick={() => setShowActions(!showActions)}
        aria-label="Quick actions"
      >
        +
      </button>
      
      {showActions && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 999
        }}>
          <button
            onClick={() => {
              onNewOrder();
              setShowActions(false);
            }}
            style={{
              padding: '12px 16px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            New Order
          </button>
        </div>
      )}
    </>
  );
};

export const UXEnhancementProvider = ({ children }) => {
  return (
    <>
      <OfflineIndicator />
      {children}
    </>
  );
};