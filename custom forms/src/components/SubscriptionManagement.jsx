// src/components/SubscriptionManagement.jsx

import React, { useState } from "react";

function SubscriptionManagement({ locations, onAddLocation, onDeleteLocation }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [manager, setManager] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("active");
  const [subscriptionExpiry, setSubscriptionExpiry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      alert("Please fill in required fields");
      return;
    }

    onAddLocation({
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      manager: manager.trim(),
      subscriptionStatus,
      subscriptionExpiry: subscriptionExpiry || null,
      createdAt: new Date().toISOString()
    });

    setName("");
    setAddress("");
    setPhone("");
    setManager("");
    setSubscriptionStatus("active");
    setSubscriptionExpiry("");
  };

  const handleToggleSubscription = (locationId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "expired" : "active";
    // Update location subscription status
    // This would need to be implemented in the parent component
    console.log(`Toggle subscription for location ${locationId} to ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "var(--clr-success)";
      case "expired": return "var(--clr-danger)";
      case "pending": return "#f39c12";
      default: return "var(--clr-text-secondary)";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return "✅";
      case "expired": return "❌";
      case "pending": return "⏳";
      default: return "❓";
    }
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "#e74c3c", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>💳 Subscription Management</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Manage branch subscriptions and renewals</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Add Location Form */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-success)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>➕ Add New Branch</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Branch Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Branch name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Branch address"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
            
            <div className="form-group">
              <label>Manager</label>
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="Branch manager name"
              />
            </div>
            
            <div className="form-group">
              <label>Subscription Status</label>
              <select
                value={subscriptionStatus}
                onChange={(e) => setSubscriptionStatus(e.target.value)}
              >
                <option value="active">✅ Active</option>
                <option value="expired">❌ Expired</option>
                <option value="pending">⏳ Pending</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Subscription Expiry</label>
              <input
                type="date"
                value={subscriptionExpiry}
                onChange={(e) => setSubscriptionExpiry(e.target.value)}
              />
            </div>
            
            <button type="submit" className="primary-btn" style={{ width: "100%" }}>
              ➕ Add Branch
            </button>
          </form>
        </div>

        {/* Locations List */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            🏢 All Branches 
            <span style={{
              backgroundColor: "var(--clr-primary-brand)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.8em",
              fontWeight: "600"
            }}>({locations.length})</span>
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px"
          }}>
            {locations.map((location) => (
              <div key={location.id} style={{
                backgroundColor: "var(--clr-bg-primary)",
                border: `2px solid ${getStatusColor(location.subscriptionStatus || "active")}`,
                borderRadius: "12px",
                padding: "20px",
                position: "relative"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "15px"
                }}>
                  <h4 style={{ margin: "0", color: "var(--clr-text-primary)" }}>
                    {location.name}
                  </h4>
                  
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete branch "${location.name}"?`)) {
                        onDeleteLocation(location.id);
                      }
                    }}
                    style={{
                      backgroundColor: "var(--clr-danger)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      fontSize: "0.8em"
                    }}
                  >
                    🗑️
                  </button>
                </div>
                
                <div style={{
                  backgroundColor: getStatusColor(location.subscriptionStatus || "active"),
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "0.85em",
                  fontWeight: "600",
                  display: "inline-block",
                  marginBottom: "15px"
                }}>
                  {getStatusIcon(location.subscriptionStatus || "active")} 
                  {(location.subscriptionStatus || "active").toUpperCase()}
                </div>
                
                {isExpiringSoon(location.subscriptionExpiry) && (
                  <div style={{
                    backgroundColor: "#f39c12",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.75em",
                    fontWeight: "600",
                    display: "inline-block",
                    marginLeft: "10px",
                    marginBottom: "15px"
                  }}>
                    ⚠️ EXPIRING SOON
                  </div>
                )}
                
                <div style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                  <p style={{ margin: "5px 0" }}>
                    📍 {location.address}
                  </p>
                  
                  {location.phone && (
                    <p style={{ margin: "5px 0" }}>
                      📞 {location.phone}
                    </p>
                  )}
                  
                  {location.manager && (
                    <p style={{ margin: "5px 0" }}>
                      👔 Manager: {location.manager}
                    </p>
                  )}
                  
                  {location.subscriptionExpiry && (
                    <p style={{ margin: "5px 0", fontWeight: "600" }}>
                      📅 Expires: {new Date(location.subscriptionExpiry).toLocaleDateString()}
                    </p>
                  )}
                  
                  <p style={{ margin: "5px 0", fontSize: "0.8em" }}>
                    Added: {new Date(location.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionManagement;