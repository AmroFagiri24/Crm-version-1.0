// src/components/AddMenuItemForm.jsx

import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

function AddMenuItemForm({ onAddMenuItem }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const numericPrice = parseFloat(price);
    const numericCost = parseFloat(cost);

    if (!name.trim()) {
      setError("Please enter a menu item name.");
      setIsSubmitting(false);
      return;
    }

    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError("Please enter a valid price greater than 0.");
      setIsSubmitting(false);
      return;
    }

    if (isNaN(numericCost) || numericCost < 0) {
      setError("Please enter a valid cost (0 or greater).");
      setIsSubmitting(false);
      return;
    }

    const newItem = {
      id: Date.now(),
      name: name.trim(),
      price: numericPrice,
      cost: numericCost,
    };

    try {
      onAddMenuItem(newItem);
      
      // Reset form on success
      setName("");
      setPrice("");
      setCost("");
    } catch (err) {
      setError("Failed to add menu item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const profitMargin = price && cost ? ((parseFloat(price) - parseFloat(cost)) / parseFloat(price) * 100).toFixed(1) : 0;

  return (
    <div className="card">
      <h3 style={{ 
        color: "var(--clr-success)", 
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>➕ Add New Menu Item</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Cheeseburger, Coffee, Pizza"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Selling Price (RWF)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Cost (RWF)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
            disabled={isSubmitting}
            required
          />
        </div>
        
        {/* Profit Margin Display */}
        {price && cost && (
          <div style={{
            backgroundColor: "var(--clr-bg-primary)",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "1px solid var(--clr-border)"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "5px"
            }}>
              <span style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>Profit per item:</span>
              <span style={{ 
                fontWeight: "600", 
                color: parseFloat(price) > parseFloat(cost) ? "var(--clr-success)" : "var(--clr-danger)"
              }}>
                ${(parseFloat(price) - parseFloat(cost)).toFixed(2)}
              </span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center"
            }}>
              <span style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>Profit margin:</span>
              <span style={{ 
                fontWeight: "600", 
                color: profitMargin > 0 ? "var(--clr-success)" : "var(--clr-danger)"
              }}>
                {profitMargin}%
              </span>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: "#ffebee",
            color: "var(--clr-danger)",
            padding: "12px 15px",
            borderRadius: "8px",
            margin: "15px 0",
            border: "1px solid #ffcdd2",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className={`primary-btn ${isSubmitting ? 'btn-loading' : ''}`}
          disabled={isSubmitting || !name.trim() || !price || !cost}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "1.1em",
            fontWeight: "600",
            marginTop: "10px",
            backgroundColor: isSubmitting || !name.trim() || !price || !cost ? "var(--clr-border)" : "var(--clr-primary-brand)",
            cursor: isSubmitting || !name.trim() || !price || !cost ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="small" color="white" />
              Adding...
            </>
          ) : (
            "Add Menu Item"
          )}
        </button>
      </form>
    </div>
  );
}

export default AddMenuItemForm;
