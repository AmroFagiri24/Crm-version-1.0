// src/components/UserProfile.jsx

import React, { useState } from "react";

const UserProfile = ({ currentUser, onEditUserAccount, showToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    password: ""
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      password: ""
    });
  };

  const handleSave = () => {
    if (!editData.name.trim()) {
      alert("Name is required");
      return;
    }

    const updateData = {
      name: editData.name.trim(),
      email: editData.email.trim(),
      phone: editData.phone.trim()
    };

    if (editData.password.trim()) {
      updateData.password = editData.password.trim();
    }

    onEditUserAccount(currentUser.username, updateData);
    setIsEditing(false);
    if (showToast) showToast("Profile updated successfully!", "success");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      password: ""
    });
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case "admin": return "👑";
      case "super_manager": return "🏆";
      case "manager": return "👨‍💼";
      case "cashier": return "💰";
      case "waiter": return "🍽️";
      case "chef": return "👨‍🍳";
      default: return "👤";
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case "admin": return "#e74c3c";
      case "super_manager": return "#8e44ad";
      case "manager": return "var(--clr-primary-brand)";
      case "cashier": return "#f39c12";
      case "waiter": return "#2ecc71";
      case "chef": return "#e67e22";
      default: return "var(--clr-text-secondary)";
    }
  };

  const getLicenseIcon = (license) => {
    switch(license) {
      case "trial": return "🆓";
      case "professional": return "🥈";
      case "enterprise": return "🥇";
      default: return "📦";
    }
  };

  if (!currentUser) {
    return (
      <div className="main-content">
        <div className="card">
          <p>No user information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>👤 User Profile</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>View and manage your account information</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Profile Information */}
        <div className="card">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px"
          }}>
            <h3 style={{ 
              color: "var(--clr-text-primary)", 
              margin: "0",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              {getRoleIcon(currentUser.role)} Personal Information
            </h3>
            {!isEditing && (
              <button
                onClick={handleEdit}
                style={{
                  backgroundColor: "var(--clr-primary-brand)",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "0.9em",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <div>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={editData.password}
                  onChange={(e) => setEditData({...editData, password: e.target.value})}
                  placeholder="Enter new password"
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  onClick={handleSave}
                  style={{
                    flex: "1",
                    backgroundColor: "var(--clr-success)",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "6px",
                    fontSize: "1em",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  💾 Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: "1",
                    backgroundColor: "var(--clr-text-secondary)",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "6px",
                    fontSize: "1em",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "1.1em", lineHeight: "1.8" }}>
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "var(--clr-text-primary)" }}>Full Name:</strong>
                <div style={{ color: "var(--clr-text-secondary)", marginTop: "5px" }}>
                  {currentUser.name}
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "var(--clr-text-primary)" }}>Username:</strong>
                <div style={{ color: "var(--clr-text-secondary)", marginTop: "5px" }}>
                  {currentUser.username}
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "var(--clr-text-primary)" }}>Email:</strong>
                <div style={{ color: "var(--clr-text-secondary)", marginTop: "5px" }}>
                  {currentUser.email || "Not provided"}
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "var(--clr-text-primary)" }}>Phone:</strong>
                <div style={{ color: "var(--clr-text-secondary)", marginTop: "5px" }}>
                  {currentUser.phone || "Not provided"}
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "var(--clr-text-primary)" }}>Account Created:</strong>
                <div style={{ color: "var(--clr-text-secondary)", marginTop: "5px" }}>
                  {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : "Unknown"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Details */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-text-primary)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>🏢 Account Details</h3>

          <div style={{ marginBottom: "20px" }}>
            <div style={{
              backgroundColor: getRoleColor(currentUser.role),
              color: "white",
              padding: "10px 15px",
              borderRadius: "8px",
              textAlign: "center",
              marginBottom: "15px"
            }}>
              <div style={{ fontSize: "1.2em", fontWeight: "700" }}>
                {getRoleIcon(currentUser.role)} {currentUser.role.toUpperCase().replace('_', ' ')}
              </div>
            </div>

            {currentUser.restaurantName && (
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "var(--clr-text-primary)" }}>Restaurant:</strong>
                <div style={{ color: "var(--clr-text-secondary)", marginTop: "5px" }}>
                  {currentUser.restaurantName}
                </div>
              </div>
            )}

            {currentUser.tenantId && (
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "var(--clr-text-primary)" }}>Tenant ID:</strong>
                <div style={{ 
                  color: "var(--clr-text-secondary)", 
                  marginTop: "5px",
                  fontFamily: "monospace",
                  fontSize: "0.9em",
                  backgroundColor: "var(--clr-bg-primary)",
                  padding: "5px 8px",
                  borderRadius: "4px"
                }}>
                  {currentUser.tenantId}
                </div>
              </div>
            )}

            {currentUser.licenseType && (
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "var(--clr-text-primary)" }}>License:</strong>
                <div style={{
                  marginTop: "8px",
                  padding: "8px 12px",
                  backgroundColor: "var(--clr-bg-primary)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span style={{ fontSize: "1.2em" }}>{getLicenseIcon(currentUser.licenseType)}</span>
                  <span style={{ fontWeight: "600", textTransform: "capitalize" }}>
                    {currentUser.licenseType}
                  </span>
                </div>
              </div>
            )}

            {currentUser.subscriptionStatus && (
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "var(--clr-text-primary)" }}>Subscription:</strong>
                <div style={{
                  marginTop: "5px",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "0.85em",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  backgroundColor: currentUser.subscriptionStatus === 'active' ? "var(--clr-success)" : "var(--clr-danger)",
                  color: "white",
                  display: "inline-block"
                }}>
                  {currentUser.subscriptionStatus}
                </div>
              </div>
            )}

            {currentUser.trialEndDate && (
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ color: "var(--clr-text-primary)" }}>Trial Expires:</strong>
                <div style={{ color: "var(--clr-text-secondary)", marginTop: "5px" }}>
                  {new Date(currentUser.trialEndDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h3 style={{ color: "var(--clr-text-primary)", marginBottom: "15px" }}>🔐 Role Permissions</h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "15px",
          fontSize: "0.9em"
        }}>
          {currentUser.role === "admin" && (
            <div style={{ padding: "10px", backgroundColor: "var(--clr-bg-primary)", borderRadius: "6px" }}>
              <strong>👑 Admin Access:</strong>
              <ul style={{ margin: "5px 0 0 0", paddingLeft: "20px" }}>
                <li>Full system access</li>
                <li>Manage all restaurants</li>
                <li>User management</li>
                <li>System settings</li>
              </ul>
            </div>
          )}
          {(currentUser.role === "super_manager" || currentUser.role === "manager") && (
            <div style={{ padding: "10px", backgroundColor: "var(--clr-bg-primary)", borderRadius: "6px" }}>
              <strong>👨‍💼 Management Access:</strong>
              <ul style={{ margin: "5px 0 0 0", paddingLeft: "20px" }}>
                <li>Sales reports</li>
                <li>Employee management</li>
                <li>Inventory control</li>
                <li>Order management</li>
              </ul>
            </div>
          )}
          {["cashier", "waiter", "chef"].includes(currentUser.role) && (
            <div style={{ padding: "10px", backgroundColor: "var(--clr-bg-primary)", borderRadius: "6px" }}>
              <strong>👤 Staff Access:</strong>
              <ul style={{ margin: "5px 0 0 0", paddingLeft: "20px" }}>
                <li>Order processing</li>
                <li>Menu access</li>
                <li>Basic operations</li>
                <li>Profile management</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;