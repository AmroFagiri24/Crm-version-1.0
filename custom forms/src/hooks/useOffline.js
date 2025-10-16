// src/hooks/useOffline.js
import { useState, useEffect } from 'react';

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingActions, setPendingActions] = useState([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Process pending actions when back online
      if (pendingActions.length > 0) {
        console.log('Processing pending actions:', pendingActions);
        setPendingActions([]);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingActions]);

  const addPendingAction = (action) => {
    if (isOffline) {
      setPendingActions(prev => [...prev, { ...action, timestamp: Date.now() }]);
      return true; // Action queued
    }
    return false; // Not offline, process immediately
  };

  return {
    isOffline,
    pendingActions,
    addPendingAction
  };
};