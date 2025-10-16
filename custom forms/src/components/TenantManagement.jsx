// src/components/TenantManagement.jsx

import React, { useState } from "react";
import { deleteUser, deleteRestaurant } from '../utils/firebase';

function TenantManagement({ userAccounts, onCreateUserAccount, onDeleteUserAccount, onEditUserAccount }) {
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+250");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [editingTenant, setEditingTenant] = useState(null);
  const [editOwnerName, setEditOwnerName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRestaurantName, setEditRestaurantName] = useState("");
  const [editOwnerEmail, setEditOwnerEmail] = useState("");
  const [editOwnerPhone, setEditOwnerPhone] = useState("");
  const [editCountryCode, setEditCountryCode] = useState("+250");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!restaurantName.trim() || !ownerName.trim() || !username.trim() || !password.trim() || !ownerEmail.trim() || !ownerPhone.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if username already exists
    const existingUser = userAccounts.find(user => user.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    // Generate unique tenant ID
    const tenantId = `company_${Date.now()}`;

    // Create super manager account for the new company
    const newCompany = {
      username: username.trim(),
      password: password.trim(),
      name: ownerName.trim(),
      role: "super_manager",
      tenantId: tenantId,
      restaurantName: restaurantName.trim(),
      email: ownerEmail.trim(),
      phone: countryCode + ownerPhone.trim(),
      licenseType: "enterprise",
      subscriptionStatus: "active",
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    onCreateUserAccount(newCompany);

    // Clear form
    setRestaurantName("");
    setOwnerName("");
    setOwnerEmail("");
    setOwnerPhone("");
    setCountryCode("+250");
    setUsername("");
    setPassword("");

    alert(`Company "${restaurantName}" created successfully!\nTenant ID: ${tenantId}\nOwner Login: ${username}`);
  };

  const handleDeleteRestaurant = async (tenantId, restaurantName) => {
    if (window.confirm(`Delete restaurant "${restaurantName}" and ALL its data?\n\nThis will:\n• Delete all users for this restaurant\n• Remove all restaurant data\n• This action CANNOT be undone!`)) {
      if (window.prompt(`Type "DELETE ${restaurantName}" to confirm:`) === `DELETE ${restaurantName}`) {
        try {
          // Delete all users for this tenant from Firebase
          const usersToDelete = userAccounts.filter(user => user.tenantId === tenantId);

          // Delete each user from Firebase (skip admin)
          for (const user of usersToDelete) {
            if (user.username !== 'AmroFagiri') {
              try {
                await deleteUser(user.username);
              } catch (error) {
                console.error(`Error deleting user ${user.username} from Firebase:`, error);
              }
            }
            // Delete from local state
            onDeleteUserAccount(user.username);
          }

          // Delete company from Firebase
          try {
            await deleteRestaurant(tenantId);
          } catch (error) {
            console.error(`Error deleting restaurant ${tenantId} from Firebase:`, error);
          }

          // Clear tenant-specific data from localStorage (including backups)
          const keysToDelete = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith(tenantId + "_") || key.includes(`_${tenantId}_`))) {
              keysToDelete.push(key);
            }
          }
          keysToDelete.forEach(key => {
            localStorage.removeItem(key);
            localStorage.removeItem(key + "_backup"); // Also remove backup
          });

          alert(`Restaurant "${restaurantName}" deleted successfully from all systems!`);
        } catch (error) {
          console.error('Error during restaurant deletion:', error);
          alert(`Error deleting restaurant: ${error.message}. Some data may not have been deleted.`);
        }
      }
    }
  };

  const handleUpdatePlan = async (tenantId, newPlan) => {
    try {
      // Update all users in this tenant with new license type
      const usersToUpdate = userAccounts.filter(user => user.tenantId === tenantId);
      
      for (const user of usersToUpdate) {
        await onEditUserAccount(user.username, {
          licenseType: newPlan
        });
      }
      
      alert(`Plan updated to ${newPlan.toUpperCase()} successfully!`);
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan. Please try again.');
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editRestaurantName.trim() || !editOwnerName.trim() || !editUsername.trim() || !editPassword.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // Find the super manager user for this tenant
    const superManager = userAccounts.find(user => 
      user.tenantId === editingTenant.tenantId && user.role === "super_manager"
    );

    if (superManager) {
      // Check if new username already exists (excluding current user)
      const existingUser = userAccounts.find(user => 
        user.username.toLowerCase() === editUsername.toLowerCase() && 
        user.username !== superManager.username
      );
      if (existingUser) {
        alert("Username already exists. Please choose a different username.");
        return;
      }

      onEditUserAccount(superManager.username, {
        name: editOwnerName.trim(),
        username: editUsername.trim(),
        password: editPassword.trim(),
        restaurantName: editRestaurantName.trim()
      });
      
      // Update restaurant name for all users in this tenant
      userAccounts.forEach(user => {
        if (user.tenantId === editingTenant.tenantId && user.username !== superManager.username) {
          onEditUserAccount(user.username, {
            restaurantName: editRestaurantName.trim()
          });
        }
      });

      alert("Restaurant information updated successfully!");
    }

    setEditingTenant(null);
    setEditRestaurantName("");
    setEditOwnerName("");
    setEditUsername("");
    setEditPassword("");
  };

  const startEditTenant = (tenant) => {
    const superManager = userAccounts.find(user => 
      user.tenantId === tenant.tenantId && user.role === "super_manager"
    );
    
    if (superManager) {
      setEditingTenant(tenant);
      setEditRestaurantName(tenant.restaurantName);
      setEditOwnerName(superManager.name);
      setEditUsername(superManager.username);
      setEditPassword(superManager.password);
    }
  };

  // Get unique tenants from user accounts (Firebase users are already loaded in App.jsx)
  const tenants = userAccounts.reduce((acc, user) => {
    if (user.tenantId && !acc.find(t => t.tenantId === user.tenantId)) {
      acc.push({
        tenantId: user.tenantId,
        restaurantName: user.restaurantName || "Unknown Restaurant",
        ownerName: user.name,
        licenseType: user.licenseType || "trial",
        trialEndDate: user.trialEndDate,
        subscriptionStatus: user.subscriptionStatus || "active",
        createdAt: user.createdAt || new Date().toISOString()
      });
    }
    return acc;
  }, []);

  const getPlanColor = (plan) => {
    switch (plan) {
      case "trial": return "#f39c12";
      case "professional": return "var(--clr-primary-brand)";
      case "enterprise": return "#8e44ad";
      default: return "var(--clr-text-secondary)";
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan) {
      case "trial": return "🆓";
      case "professional": return "🥈";
      case "enterprise": return "🥇";
      default: return "📦";
    }
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "#e74c3c", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>🏢 Restaurant Management</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Create and manage restaurant tenants</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Create Restaurant Form */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-success)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>➕ Create New Restaurant</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Restaurant Name *</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Restaurant name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Owner Name *</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Owner full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Owner Email *</label>
              <input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="owner@restaurant.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Owner Phone Number *</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{ width: "140px", padding: "12px", fontSize: "0.9em" }}
                >
                  <option value="+250">🇷🇼 Rwanda (+250)</option>
                  <option value="+249">🇸🇩 Sudan (+249)</option>
                  <option value="+20">🇪🇬 Egypt (+20)</option>
                  <option value="+357">🇨🇾 Cyprus (+357)</option>
                  <option value="+1">🇨🇦 Canada (+1)</option>
                </select>
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="Phone number"
                  style={{ flex: "1" }}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Login Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Owner login username"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Login Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Owner login password"
                required
              />
            </div>
            
            <button type="submit" className="primary-btn" style={{ width: "100%" }}>
              🏢 Create Restaurant
            </button>
          </form>
        </div>

        {/* Restaurants List */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            🏢 All Restaurants 
            <span style={{
              backgroundColor: "var(--clr-primary-brand)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.8em",
              fontWeight: "600"
            }}>({tenants.length})</span>
          </h3>

          {tenants.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px",
              backgroundColor: "var(--clr-bg-primary)",
              borderRadius: "8px",
              border: "2px dashed var(--clr-border)"
            }}>
              <div style={{ fontSize: "3em", marginBottom: "15px" }}>🏢</div>
              <p style={{ color: "var(--clr-text-secondary)", fontSize: "1.1em" }}>
                No restaurants created yet.<br/>
                Create your first restaurant tenant!
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px"
            }}>
              {tenants.map((tenant) => {
                const tenantUsers = userAccounts.filter(user => user.tenantId === tenant.tenantId);
                return (
                  <div key={tenant.tenantId} style={{
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
                      marginBottom: "10px"
                    }}>
                      <h4 style={{ margin: "0", color: "var(--clr-text-primary)" }}>
                        🏢 {tenant.restaurantName}
                      </h4>
                      
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => startEditTenant(tenant)}
                          style={{
                            backgroundColor: "var(--clr-primary-brand)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontSize: "0.8em"
                          }}
                          title="Edit Login Credentials"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRestaurant(tenant.tenantId, tenant.restaurantName)}
                          style={{
                            backgroundColor: "var(--clr-danger)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontSize: "0.8em"
                          }}
                          title="Delete Restaurant"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div style={{
                      backgroundColor: "var(--clr-primary-brand)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85em",
                      fontWeight: "600",
                      display: "inline-block",
                      marginBottom: "10px"
                    }}>
                      👑 {tenant.ownerName}
                    </div>
                    
                    <div style={{
                      backgroundColor: getPlanColor(tenant.licenseType),
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85em",
                      fontWeight: "600",
                      display: "inline-block",
                      marginLeft: "10px",
                      marginBottom: "15px"
                    }}>
                      {getPlanIcon(tenant.licenseType)} {tenant.licenseType.toUpperCase()}
                      {tenant.licenseType === 'trial' && tenant.trialEndDate && (
                        <div style={{ fontSize: '0.7em', marginTop: '2px' }}>
                          Expires: {new Date(tenant.trialEndDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ fontSize: "0.8em", color: "var(--clr-text-secondary)", display: "block", marginBottom: "5px" }}>Change Plan:</label>
                      <select
                        value={tenant.licenseType}
                        onChange={(e) => handleUpdatePlan(tenant.tenantId, e.target.value)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "4px",
                          border: "1px solid var(--clr-border)",
                          fontSize: "0.8em"
                        }}
                      >
                        <option value="trial">🆓 Trial (3 users max)</option>
                        <option value="professional">🥈 Professional (10 users) - $79/month</option>
                        <option value="enterprise">🥇 Enterprise (50 users) - $199/month</option>
                      </select>
                    </div>
                    
                    <div style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                      <p style={{ margin: "5px 0", fontFamily: "monospace", fontSize: "0.8em" }}>
                        🆔 {tenant.tenantId}
                      </p>
                      
                      <p style={{ margin: "5px 0" }}>
                        👥 Users: <strong>{tenantUsers.length}</strong>
                      </p>
                      
                      <p style={{ margin: "5px 0", fontSize: "0.8em" }}>
                        📅 Created: {new Date(tenant.createdAt).toLocaleDateString()}
                      </p>
                      
                      <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "var(--clr-bg-secondary)", borderRadius: "6px" }}>
                        <p style={{ margin: "2px 0", fontSize: "0.75em", fontWeight: "600" }}>User Roles:</p>
                        {tenantUsers.map(user => (
                          <p key={user.username} style={{ margin: "1px 0", fontSize: "0.7em" }}>
                            • {user.name} ({user.role})
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Restaurant Credentials Modal */}
      {editingTenant && (
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
              Edit Restaurant Login: {editingTenant.restaurantName}
            </h3>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Restaurant Name *</label>
                <input
                  type="text"
                  value={editRestaurantName}
                  onChange={(e) => setEditRestaurantName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Owner Name *</label>
                <input
                  type="text"
                  value={editOwnerName}
                  onChange={(e) => setEditOwnerName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Login Username *</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Login Password *</label>
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
                  onClick={() => setEditingTenant(null)}
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

export default TenantManagement;