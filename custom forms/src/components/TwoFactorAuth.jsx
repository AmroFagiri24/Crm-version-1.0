// src/components/TwoFactorAuth.jsx

import React, { useState, useEffect } from "react";

const TwoFactorAuth = ({ user, onVerifySuccess, onCancel }) => {
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    // Generate 6-digit code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    
    // Send email with 2FA code
    sendEmailCode(user.email, newCode, user.name);
    
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user.username]);

  const sendEmailCode = async (email, code, name) => {
    try {
      // Using EmailJS with proper configuration
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_2fa_emporos',
          template_id: 'template_2fa_code',
          user_id: 'user_2fa_emporos',
          template_params: {
            to_email: email,
            to_name: name,
            verification_code: code,
            company_name: 'Emporos Nexus POS System',
            message: `Your verification code is: ${code}. This code will expire in 5 minutes.`
          }
        })
      });
      
      if (response.ok) {
        console.log('✅ 2FA code sent successfully to:', email);
      } else {
        throw new Error('Email service failed');
      }
    } catch (error) {
      console.error('Email service error:', error);
      // Show code in alert as backup
      alert(`📧 Email service temporarily unavailable.\n\nYour verification code is: ${code}\n\nPlease enter this code to continue.`);
      console.log(`🔐 2FA Code for ${name} (${email}): ${code}`);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (code === generatedCode) {
      onVerifySuccess();
    } else {
      alert("Invalid code. Please try again.");
      setCode("");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "var(--clr-bg-secondary)",
        padding: "30px",
        borderRadius: "12px",
        width: "400px",
        textAlign: "center",
        border: "2px solid var(--clr-primary-brand)"
      }}>
        <h2 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px" }}>
          🔐 Two-Factor Authentication
        </h2>
        
        <p style={{ color: "var(--clr-text-secondary)", marginBottom: "20px" }}>
          A 6-digit verification code has been sent to: <strong>{user.email || 'your registered email'}</strong>
        </p>
        
        <div style={{
          backgroundColor: "var(--clr-bg-primary)",
          padding: "10px",
          borderRadius: "6px",
          marginBottom: "15px",
          fontSize: "0.9em",
          color: "var(--clr-text-secondary)",
          textAlign: "center"
        }}>
          💡 If you don't receive the email, check your spam folder or use the resend button.
        </div>

        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "1.2em",
                textAlign: "center",
                letterSpacing: "0.2em",
                border: "2px solid var(--clr-border)",
                borderRadius: "8px"
              }}
              maxLength="6"
              required
            />
          </div>
          
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <span style={{ 
              color: timeLeft < 60 ? "var(--clr-danger)" : "var(--clr-text-secondary)",
              fontSize: "0.9em"
            }}>
              Time remaining: {formatTime(timeLeft)}
            </span>
            <button
              type="button"
              onClick={() => {
                const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                setGeneratedCode(newCode);
                sendEmailCode(user.email, newCode, user.name);
                setTimeLeft(300);
              }}
              style={{
                backgroundColor: "transparent",
                color: "var(--clr-primary-brand)",
                border: "1px solid var(--clr-primary-brand)",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "0.8em",
                cursor: "pointer"
              }}
            >
              Resend Code
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: "1",
                padding: "12px",
                backgroundColor: "var(--clr-border)",
                color: "var(--clr-text-primary)",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={code.length !== 6 || timeLeft === 0}
              style={{
                flex: "1",
                padding: "12px",
                backgroundColor: code.length === 6 && timeLeft > 0 ? "var(--clr-primary-brand)" : "var(--clr-border)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: code.length === 6 && timeLeft > 0 ? "pointer" : "not-allowed"
              }}
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuth;