// src/components/VATCalculator.jsx

import React, { useState } from "react";
import { formatCurrency, getVATBreakdown, calculateAmountExcludingVAT, getVATRate } from "../utils/dataHelpers";

const VATCalculator = () => {
  const [amount, setAmount] = useState("");
  const [calculationType, setCalculationType] = useState("add"); // "add" or "remove"
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (calculationType === "add") {
      // Add VAT to amount
      const breakdown = getVATBreakdown(numAmount);
      setResult({
        type: "add",
        original: numAmount,
        vatAmount: breakdown.vatAmount,
        total: breakdown.total,
        vatRate: breakdown.vatRate
      });
    } else {
      // Remove VAT from amount
      const amountExcludingVAT = calculateAmountExcludingVAT(numAmount);
      const vatAmount = numAmount - amountExcludingVAT;
      setResult({
        type: "remove",
        original: numAmount,
        subtotal: amountExcludingVAT,
        vatAmount: vatAmount,
        vatRate: getVATRate()
      });
    }
  };

  const handleClear = () => {
    setAmount("");
    setResult(null);
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>🧮 VAT Calculator</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Calculate VAT for Rwanda (18% rate)</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Calculator Form */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-success)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>💰 VAT Calculation</h3>
          
          <div className="form-group">
            <label>Amount (RWF)</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Calculation Type</label>
            <select
              value={calculationType}
              onChange={(e) => setCalculationType(e.target.value)}
            >
              <option value="add">➕ Add VAT to amount</option>
              <option value="remove">➖ Remove VAT from amount</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleCalculate}
              disabled={!amount}
              style={{
                flex: "1",
                padding: "12px",
                backgroundColor: !amount ? "var(--clr-border)" : "var(--clr-primary-brand)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1em",
                fontWeight: "600",
                cursor: !amount ? "not-allowed" : "pointer",
                transition: "all 0.3s ease"
              }}
            >
              🧮 Calculate
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: "12px 20px",
                backgroundColor: "var(--clr-text-secondary)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1em",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>📊 Calculation Result</h3>
          
          {result ? (
            <div>
              {result.type === "add" ? (
                <div style={{
                  backgroundColor: "var(--clr-bg-primary)",
                  padding: "20px",
                  borderRadius: "8px"
                }}>
                  <h4 style={{ color: "var(--clr-text-primary)", margin: "0 0 15px 0" }}>
                    Adding VAT to {formatCurrency(result.original)}
                  </h4>
                  <div style={{ fontSize: "1.1em", lineHeight: "1.6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span>Original Amount:</span>
                      <span style={{ fontWeight: "600" }}>{formatCurrency(result.original)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span>VAT ({result.vatRate}%):</span>
                      <span style={{ fontWeight: "600", color: "var(--clr-primary-brand)" }}>
                        {formatCurrency(result.vatAmount)}
                      </span>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderTop: "2px solid var(--clr-border)",
                      fontSize: "1.2em",
                      fontWeight: "700",
                      color: "var(--clr-success)"
                    }}>
                      <span>Total with VAT:</span>
                      <span>{formatCurrency(result.total)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: "var(--clr-bg-primary)",
                  padding: "20px",
                  borderRadius: "8px"
                }}>
                  <h4 style={{ color: "var(--clr-text-primary)", margin: "0 0 15px 0" }}>
                    Removing VAT from {formatCurrency(result.original)}
                  </h4>
                  <div style={{ fontSize: "1.1em", lineHeight: "1.6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span>Amount with VAT:</span>
                      <span style={{ fontWeight: "600" }}>{formatCurrency(result.original)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span>VAT ({result.vatRate}%):</span>
                      <span style={{ fontWeight: "600", color: "var(--clr-danger)" }}>
                        -{formatCurrency(result.vatAmount)}
                      </span>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderTop: "2px solid var(--clr-border)",
                      fontSize: "1.2em",
                      fontWeight: "700",
                      color: "var(--clr-success)"
                    }}>
                      <span>Amount excluding VAT:</span>
                      <span>{formatCurrency(result.subtotal)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "var(--clr-text-secondary)",
              backgroundColor: "var(--clr-bg-primary)",
              borderRadius: "8px",
              border: "2px dashed var(--clr-border)"
            }}>
              <div style={{ fontSize: "3em", marginBottom: "15px" }}>🧮</div>
              <p>Enter an amount and click Calculate to see VAT breakdown</p>
            </div>
          )}
        </div>
      </div>

      {/* VAT Information */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h3 style={{ color: "var(--clr-text-primary)", marginBottom: "15px" }}>ℹ️ VAT Information</h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "20px",
          fontSize: "0.95em",
          color: "var(--clr-text-secondary)"
        }}>
          <div>
            <h4 style={{ color: "var(--clr-primary-brand)", margin: "0 0 10px 0" }}>Rwanda VAT Rate:</h4>
            <ul style={{ paddingLeft: "20px" }}>
              <li>Standard VAT rate: <strong>18%</strong></li>
              <li>Applied to most goods and services</li>
              <li>VAT registration required for businesses with annual turnover > RWF 20,000,000</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "var(--clr-primary-brand)", margin: "0 0 10px 0" }}>How to use:</h4>
            <ul style={{ paddingLeft: "20px" }}>
              <li><strong>Add VAT:</strong> Calculate total price including VAT</li>
              <li><strong>Remove VAT:</strong> Find the original price before VAT</li>
              <li>Useful for pricing, invoicing, and tax calculations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VATCalculator;