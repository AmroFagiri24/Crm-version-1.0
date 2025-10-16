// src/components/PaymentHistory.jsx

import React from "react";

function PaymentHistory() {
  const payments = JSON.parse(localStorage.getItem("momo_payments") || "[]");

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "var(--clr-success)";
      case "pending": return "#f39c12";
      case "failed": return "var(--clr-danger)";
      default: return "var(--clr-text-secondary)";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "✅";
      case "pending": return "⏳";
      case "failed": return "❌";
      default: return "❓";
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount * 1300), 0); // Convert USD to RWF

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "#e74c3c", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>💳 Payment History</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>MTN MoMo payment transactions</p>
      </div>

      {/* Revenue Summary */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div style={{ fontSize: "3em", marginBottom: "10px" }}>💰</div>
          <h3 style={{ color: "var(--clr-success)", margin: "0 0 5px 0" }}>
            {totalRevenue.toLocaleString()} RWF
          </h3>
          <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>Total Revenue</p>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div style={{ fontSize: "3em", marginBottom: "10px" }}>📊</div>
          <h3 style={{ color: "var(--clr-primary-brand)", margin: "0 0 5px 0" }}>
            {payments.length}
          </h3>
          <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>Total Transactions</p>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div style={{ fontSize: "3em", marginBottom: "10px" }}>✅</div>
          <h3 style={{ color: "var(--clr-success)", margin: "0 0 5px 0" }}>
            {payments.filter(p => p.status === "completed").length}
          </h3>
          <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>Successful Payments</p>
        </div>
      </div>

      {/* Payment List */}
      <div className="card">
        <h3 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px" }}>
          📋 Recent Transactions
        </h3>

        {payments.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px 20px",
            backgroundColor: "var(--clr-bg-primary)",
            borderRadius: "8px",
            border: "2px dashed var(--clr-border)"
          }}>
            <div style={{ fontSize: "3em", marginBottom: "15px" }}>💳</div>
            <p style={{ color: "var(--clr-text-secondary)", fontSize: "1.1em" }}>
              No payments recorded yet
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px"
          }}>
            {payments.slice().reverse().map((payment, index) => (
              <div key={payment.transactionId || index} style={{
                backgroundColor: "var(--clr-bg-primary)",
                border: "2px solid var(--clr-border)",
                borderRadius: "12px",
                padding: "20px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "15px"
                }}>
                  <h4 style={{ margin: "0", color: "var(--clr-text-primary)" }}>
                    📱 {payment.phoneNumber}
                  </h4>
                  
                  <div style={{
                    backgroundColor: getStatusColor(payment.status),
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.75em",
                    fontWeight: "600"
                  }}>
                    {getStatusIcon(payment.status)} {payment.status.toUpperCase()}
                  </div>
                </div>
                
                <div style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                  <p style={{ margin: "5px 0", fontWeight: "600", color: "var(--clr-success)" }}>
                    💰 {(payment.amount * 1300).toLocaleString()} RWF
                  </p>
                  
                  <p style={{ margin: "5px 0" }}>
                    📦 Plan: {payment.plan?.charAt(0).toUpperCase() + payment.plan?.slice(1)}
                  </p>
                  
                  <p style={{ margin: "5px 0" }}>
                    ⏱️ Duration: {payment.duration} months
                  </p>
                  
                  <p style={{ margin: "5px 0", fontSize: "0.8em", fontFamily: "monospace" }}>
                    🆔 {payment.transactionId || payment.reference}
                  </p>
                  
                  <p style={{ margin: "5px 0", fontSize: "0.8em" }}>
                    📅 {new Date(payment.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;