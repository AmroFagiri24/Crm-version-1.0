// src/components/UserManagement.jsx

import React, { useState } from "react";

function UserManagement({ userAccounts, onCreateUserAccount, onDeleteUserAccount, onEditUserAccount }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("cashier");
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !name.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if username already exists
    const existingUser = userAccounts.find(user => user.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    // Check user limits based on subscription plan for selected restaurant
    if (!selectedTenant) {
      alert("Please select a restaurant first");
      return;
    }
    
    const currentTenantUsers = userAccounts.filter(user => user.tenantId === selectedTenant);
    const superManager = userAccounts.find(user => user.tenantId === selectedTenant && user.role === 'super_manager');
    const licenseType = superManager?.licenseType || 'trial';
    
    const userLimits = {
      trial: 3,
      professional: 10,
      enterprise: 50
    };
    
    if (currentTenantUsers.length >= userLimits[licenseType]) {
      alert(`User limit reached for ${licenseType} plan (${userLimits[licenseType]} users max). Please upgrade your subscription.`);
      return;
    }

    onCreateUserAccount({
      username: username.trim(),
      password: password.trim(),
      name: name.trim(),
      role,
      tenantId: selectedTenant,
      id: Date.now()
    });

    setUsername("");
    setPassword("");
    setName("");
    setRole("cashier");
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editUsername.trim() || !editPassword.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // Check if new username already exists (excluding current user)
    const existingUser = userAccounts.find(user => 
      user.username.toLowerCase() === editUsername.toLowerCase() && 
      user.username !== editingUser.username
    );
    if (existingUser) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    onEditUserAccount(editingUser.username, {
      name: editName.trim(),
      username: editUsername.trim(),
      password: editPassword.trim()
    });

    setEditingUser(null);
    setEditName("");
    setEditUsername("");
    setEditPassword("");
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditPassword(user.password);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return "ADMIN";
      case "super_manager": return "SUPER";
      case "manager": return "MGR";
      case "cashier": return "CASH";
      case "chef": return "CHEF";
      case "waiter": return "WAIT";
      default: return "USER";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "#e74c3c";
      case "super_manager": return "#8e44ad";
      case "manager": return "var(--clr-primary-brand)";
      case "cashier": return "var(--clr-success)";
      case "chef": return "#e67e22";
      case "waiter": return "#9b59b6";
      default: return "var(--clr-text-secondary)";
    }
  };

  // Get restaurants (tenants) for selection
  const restaurants = userAccounts.reduce((acc, user) => {
    if (user.tenantId && !acc.find(r => r.tenantId === user.tenantId)) {
      acc.push({
        tenantId: user.tenantId,
        restaurantName: user.restaurantName || `Restaurant ${user.tenantId.split('_')[1]}`,
        licenseType: user.licenseType || 'trial'
      });
    }
    return acc;
  }, []);
  
  // Get current tenant info for user limits
  const currentTenantUsers = selectedTenant ? userAccounts.filter(user => user.tenantId === selectedTenant) : [];
  const superManager = userAccounts.find(user => user.tenantId === selectedTenant && user.role === 'super_manager');
  const licenseType = superManager?.licenseType || 'trial';
  
  const userLimits = {
    trial: 3,
    professional: 10,
    enterprise: 50
  };
  
  const currentUserCount = currentTenantUsers.length;
  const maxUsers = userLimits[licenseType];
  
  // Filter users to show only selected restaurant users
  const displayUsers = selectedTenant ? userAccounts.filter(user => user.tenantId === selectedTenant) : [];

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "#e74c3c", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>User Account Management</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Select a restaurant to manage its user accounts</p>
        
        {/* Restaurant Selector */}
        <div className="form-group" style={{ marginTop: '20px', maxWidth: '400px' }}>
          <label>Select Restaurant *</label>
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            style={{ fontSize: '1em', padding: '12px' }}
          >
            <option value="">-- Select Restaurant --</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.tenantId} value={restaurant.tenantId}>
                {restaurant.restaurantName} ({restaurant.licenseType.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
        
        {selectedTenant && (
          <div style={{
            backgroundColor: licenseType === 'trial' ? '#fff3cd' : licenseType === 'professional' ? '#d1ecf1' : '#d4edda',
            border: `1px solid ${licenseType === 'trial' ? '#ffeaa7' : licenseType === 'professional' ? '#bee5eb' : '#c3e6cb'}`,
            borderRadius: '8px',
            padding: '12px 16px',
            marginTop: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: '600' }}>
              Current Plan: {licenseType.toUpperCase()}
            </span>
            <span style={{ 
              color: currentUserCount >= maxUsers ? '#dc3545' : '#28a745',
              fontWeight: '600'
            }}>
              Users: {currentUserCount}/{maxUsers}
            </span>
          </div>
        )}
      </div>

      {selectedTenant && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "400px 1fr",
          gap: "30px",
          alignItems: "start"
        }}>
        {/* Create User Form */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-success)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>Create New User</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="User full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Login username"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Login password"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="cashier">Cashier</option>
                <option value="waiter">Waiter</option>
                <option value="chef">Chef</option>
                <option value="manager">Manager</option>
                <option value="super_manager">Super Manager</option>
              </select>
            </div>
            
            <button type="submit" className="primary-btn" style={{ width: "100%" }}>
              Create User
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            Restaurant Users 
            <span style={{
              backgroundColor: "var(--clr-primary-brand)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.8em",
              fontWeight: "600"
            }}>({displayUsers.length})</span>
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px"
          }}>
            {displayUsers.map((user) => (
              <div key={user.username} style={{
                backgroundColor: "var(--clr-bg-primary)",
                border: "2px solid var(--clr-border)",
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
                    {user.name}
                  </h4>
                  
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => startEdit(user)}
                      style={{
                        backgroundColor: "var(--clr-primary-brand)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontSize: "0.8em"
                      }}
                    >
                      Edit
                    </button>
                    {user.role !== "admin" && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete user account "${user.username}"?`)) {
                            onDeleteUserAccount(user.username);
                          }
                        }}
                        style={{
                          backgroundColor: "var(--clr-danger)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          cursor: "pointer",
                          fontSize: "0.8em"
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: getRoleColor(user.role),
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "0.85em",
                  fontWeight: "600",
                  display: "inline-block",
                  marginBottom: "10px"
                }}>
                  {getRoleIcon(user.role)} {user.role.toUpperCase().replace("_", " ")}
                </div>
                
                <div style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                  <p style={{ margin: "5px 0" }}>
                    Username: <strong>{user.username}</strong>
                  </p>
                  
                  {user.employeeId && (
                    <p style={{ margin: "5px 0", fontSize: "0.8em", color: "var(--clr-success)" }}>
                      Linked to Employee ID: {user.employeeId}
                    </p>
                  )}
                  
                  {user.role === "admin" && (
                    <p style={{ margin: "5px 0", fontSize: "0.8em", color: "#e74c3c", fontWeight: "600" }}>
                      Protected Account
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}
      
      {!selectedTenant && restaurants.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          backgroundColor: "var(--clr-bg-primary)",
          borderRadius: "8px",
          border: "2px dashed var(--clr-border)"
        }}>
          <div style={{ fontSize: "3em", marginBottom: "15px" }}>👥</div>
          <p style={{ color: "var(--clr-text-secondary)", fontSize: "1.1em" }}>
            No restaurants found.<br/>
            Create restaurants first in Restaurant Management.
          </p>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1000"
        }}>
          <div className="card" style={{ width: "400px", maxWidth: "90vw" }}>
            <h3 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px" }}>
              Edit User: {editingUser.username}
            </h3>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  required
                />
              </div>
              
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button type="submit" className="primary-btn" style={{ flex: "1" }}>
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  style={{
                    flex: "1",
                    backgroundColor: "var(--clr-text-secondary)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;