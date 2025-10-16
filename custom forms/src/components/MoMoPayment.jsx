// src/components/MoMoPayment.jsx

import React, { useState } from "react";

function MoMoPayment({ plan, duration, amount, onPaymentSuccess, onCancel }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("input"); // input, processing, success, failed

  const formatPhoneNumber = (phone) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, "");
    
    // Format as Rwanda phone number
    if (digits.startsWith("250")) {
      return digits;
    } else if (digits.startsWith("07") || digits.startsWith("78") || digits.startsWith("79")) {
      return "250" + digits;
    } else if (digits.length === 9) {
      return "250" + digits;
    }
    return digits;
  };

  const validatePhoneNumber = (phone) => {
    const formatted = formatPhoneNumber(phone);
    // Rwanda MTN numbers: 250788xxxxxx, 250789xxxxxx, 250790xxxxxx, etc.
    return /^250(78[0-9]|79[0-9]|72[0-9]|73[0-9])[0-9]{6}$/.test(formatted);
  };

  const handlePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      alert("Please enter a valid MTN Rwanda phone number (e.g., 0788123456)");
      return;
    }

    setIsProcessing(true);
    setPaymentStep("processing");

    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Simulate MoMo API call
    try {
      // In real implementation, this would call MTN MoMo API
      const paymentData = {
        phoneNumber: formattedPhone,
        amount: amount,
        currency: "RWF",
        plan: plan,
        duration: duration,
        reference: `POS_${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate success (90% success rate)
      if (Math.random() > 0.1) {
        setPaymentStep("success");
        setTimeout(() => {
          onPaymentSuccess({
            ...paymentData,
            transactionId: `TXN_${Date.now()}`,
            status: "completed"
          });
        }, 2000);
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      setPaymentStep("failed");
      setIsProcessing(false);
    }
  };

  const convertToRWF = (usdAmount) => {
    // Approximate USD to RWF conversion (1 USD ≈ 1300 RWF)
    return Math.round(usdAmount * 1300);
  };

  const rwfAmount = convertToRWF(amount);

  if (paymentStep === "processing") {
    return (
      <div className="card" style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <h3 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px" }}>
          📱 Processing Payment
        </h3>
        
        <div style={{ fontSize: "4em", marginBottom: "20px" }}>⏳</div>
        
        <p style={{ color: "var(--clr-text-primary)", marginBottom: "10px" }}>
          Please check your phone for the MoMo payment prompt
        </p>
        
        <p style={{ color: "var(--clr-text-secondary)", fontSize: "0.9em", marginBottom: "20px" }}>
          Enter your MTN MoMo PIN when prompted
        </p>
        
        <div style={{
          backgroundColor: "var(--clr-bg-primary)",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px"
        }}>
          <p style={{ margin: "0", fontSize: "0.8em", color: "var(--clr-text-secondary)" }}>
            Phone: {phoneNumber}<br/>
            Amount: {rwfAmount.toLocaleString()} RWF<br/>
            Plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </p>
        </div>
        
        <button 
          onClick={onCancel}
          style={{
            backgroundColor: "var(--clr-text-secondary)",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (paymentStep === "success") {
    return (
      <div className="card" style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <h3 style={{ color: "var(--clr-success)", marginBottom: "20px" }}>
          ✅ Payment Successful
        </h3>
        
        <div style={{ fontSize: "4em", marginBottom: "20px" }}>🎉</div>
        
        <p style={{ color: "var(--clr-text-primary)", marginBottom: "20px" }}>
          Your subscription has been activated successfully!
        </p>
        
        <div style={{
          backgroundColor: "var(--clr-bg-primary)",
          padding: "15px",
          borderRadius: "8px"
        }}>
          <p style={{ margin: "0", fontSize: "0.9em", color: "var(--clr-success)" }}>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (paymentStep === "failed") {
    return (
      <div className="card" style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <h3 style={{ color: "var(--clr-danger)", marginBottom: "20px" }}>
          ❌ Payment Failed
        </h3>
        
        <div style={{ fontSize: "4em", marginBottom: "20px" }}>😞</div>
        
        <p style={{ color: "var(--clr-text-primary)", marginBottom: "20px" }}>
          Payment could not be processed. Please try again.
        </p>
        
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button 
            onClick={() => {
              setPaymentStep("input");
              setIsProcessing(false);
            }}
            className="primary-btn"
          >
            Try Again
          </button>
          <button 
            onClick={onCancel}
            style={{
              backgroundColor: "var(--clr-text-secondary)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h3 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px", textAlign: "center" }}>
        📱 MTN MoMo Payment
      </h3>
      
      {/* Payment Summary */}
      <div style={{
        backgroundColor: "var(--clr-bg-primary)",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        textAlign: "center"
      }}>
        <h4 style={{ margin: "0 0 10px 0", color: "var(--clr-text-primary)" }}>
          {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
        </h4>
        <p style={{ margin: "0 0 5px 0", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
          {duration} month{duration > 1 ? "s" : ""}
        </p>
        <div style={{ fontSize: "1.5em", fontWeight: "600", color: "var(--clr-success)" }}>
          {rwfAmount.toLocaleString()} RWF
        </div>
        <p style={{ margin: "5px 0 0 0", fontSize: "0.8em", color: "var(--clr-text-secondary)" }}>
          (≈ ${amount} USD)
        </p>
      </div>

      {/* Phone Number Input */}
      <div className="form-group">
        <label>MTN MoMo Phone Number *</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="0788123456"
          style={{
            fontSize: "1.1em",
            padding: "12px",
            textAlign: "center"
          }}
        />
        <small style={{ color: "var(--clr-text-secondary)", fontSize: "0.8em" }}>
          Enter your MTN Rwanda phone number
        </small>
      </div>

      {/* Payment Instructions */}
      <div style={{
        backgroundColor: "#e8f5e8",
        border: "1px solid #c8e6c9",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "20px"
      }}>
        <h4 style={{ margin: "0 0 10px 0", color: "var(--clr-success)" }}>
          📋 Payment Instructions
        </h4>
        <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "0.9em", color: "var(--clr-text-primary)" }}>
          <li>Ensure you have sufficient MoMo balance</li>
          <li>You'll receive a payment prompt on your phone</li>
          <li>Enter your MoMo PIN to complete payment</li>
          <li>Payment confirmation will be sent via SMS</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button 
          onClick={handlePayment}
          disabled={!phoneNumber.trim() || isProcessing}
          className="primary-btn"
          style={{ 
            flex: 1,
            padding: "12px",
            fontSize: "1.1em",
            opacity: (!phoneNumber.trim() || isProcessing) ? 0.6 : 1
          }}
        >
          {isProcessing ? "Processing..." : "💳 Pay with MoMo"}
        </button>
        
        <button 
          onClick={onCancel}
          disabled={isProcessing}
          style={{
            backgroundColor: "var(--clr-text-secondary)",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            opacity: isProcessing ? 0.6 : 1
          }}
        >
          Cancel
        </button>
      </div>

      {/* MTN MoMo Logo/Info */}
      <div style={{
        textAlign: "center",
        marginTop: "20px",
        padding: "10px",
        backgroundColor: "#fff3cd",
        border: "1px solid #ffeaa7",
        borderRadius: "6px"
      }}>
        <p style={{ margin: "0", fontSize: "0.8em", color: "#856404" }}>
          🔒 Secured by MTN Mobile Money
        </p>
      </div>
    </div>
  );
}

export default MoMoPayment;