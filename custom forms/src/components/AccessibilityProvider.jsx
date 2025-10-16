// src/components/AccessibilityProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedFontSize = localStorage.getItem('accessibility-fontSize');
    const savedHighContrast = localStorage.getItem('accessibility-highContrast') === 'true';
    const savedReducedMotion = localStorage.getItem('accessibility-reducedMotion') === 'true';

    if (savedFontSize) setFontSize(savedFontSize);
    if (savedHighContrast) setHighContrast(savedHighContrast);
    if (savedReducedMotion) setReducedMotion(savedReducedMotion);

    // Check system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
    }
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setHighContrast(true);
    }
  }, []);

  useEffect(() => {
    // Apply font size
    const fontSizes = { small: '14px', medium: '16px', large: '18px', xlarge: '20px' };
    document.documentElement.style.fontSize = fontSizes[fontSize];
    localStorage.setItem('accessibility-fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    // Apply high contrast
    document.body.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('accessibility-highContrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    // Apply reduced motion
    document.body.classList.toggle('reduced-motion', reducedMotion);
    localStorage.setItem('accessibility-reducedMotion', reducedMotion);
  }, [reducedMotion]);

  const value = {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};