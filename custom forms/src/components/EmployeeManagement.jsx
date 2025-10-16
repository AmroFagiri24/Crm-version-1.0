// src/components/EmployeeManagement.jsx

import React, { useState } from "react";
import { formatCurrency } from "../utils/dataHelpers";

function EmployeeManagement({ employees, onAddEmployee, onDeleteEmployee, locations, currentUser, userAccounts, onCreateUserAccount, onDeleteUserAccount }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("cashier");
  const [locationId, setLocationId] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+250");
  const [createAccount, setCreateAccount] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !locationId) {
      alert("Please fill in required fields");
      return;
    }
    
    if (createAccount && (!username.trim() || !password.trim())) {
      alert("Please fill in username and password for account creation");
      return;
    }

    const newEmployee = {
      name: name.trim(),
      role,
      locationId: parseInt(locationId),
      phone: phone.trim(),
      email: email.trim(),
      salary: salary ? parseFloat(salary) : 0,
      status: "active",
    };

    onAddEmployee(newEmployee);

    // Create user account if requested
    if (createAccount && username.trim() && password.trim()) {
      // Check if username already exists
      const existingUser = userAccounts.find(user => user.username.toLowerCase() === username.toLowerCase());
      if (existingUser) {
        alert("Username already exists. Please choose a different username.");
        return;
      }
      
      const newUserAccount = {
        username: username.trim(),
        password: password.trim(),
        name: name.trim(),
        role: role,
        tenantId: currentUser.tenantId,
        restaurantName: currentUser.restaurantName,
        email: email.trim() || '',
        phone: phone.trim() ? countryCode + phone.trim() : '',
        licenseType: currentUser.licenseType,
        subscriptionStatus: currentUser.subscriptionStatus,
        employeeId: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      onCreateUserAccount(newUserAccount);
    }

    setName("");
    setRole("cashier");
    setLocationId("");
    setPhone("");
    setSalary("");
    setEmail("");
    setCountryCode("+250");
    setCreateAccount(false);
    setUsername("");
    setPassword("");
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return "⚡";
      case "super_manager": return "👑";
      case "manager": return "👔";
      case "cashier": return "💰";
      case "chef": return "👨‍🍳";
      case "waiter": return "🍽️";
      default: return "👤";
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

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>👥 Employee Management</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Manage staff across all locations</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Add Employee Form */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-success)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>➕ Add New Employee</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Employee full name"
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
                <option value="cashier">💰 Cashier</option>
                <option value="waiter">🍽️ Waiter</option>
                <option value="chef">👨‍🍳 Chef</option>
                <option value="manager">👔 Manager</option>
                {(currentUser?.role === "super_manager" || currentUser?.role === "admin") && (
                  <option value="super_manager">👑 Super Manager</option>
                )}
                {currentUser?.role === "admin" && (
                  <option value="admin">⚡ Admin</option>
                )}
              </select>
            </div>
            
            <div className="form-group">
              <label>Location *</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                required
              >
                <option value="">Select Location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address (optional)"
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number (optional)"
                  style={{ flex: "1" }}
                />
              </div>
            </div>
            
            {currentUser?.role === "super_manager" && (
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                  />
                  Create Login Account
                </label>
              </div>
            )}
            
            {createAccount && (
              <>
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Login username"
                    required={createAccount}
                  />
                </div>
                
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Login password"
                    required={createAccount}
                  />
                </div>
              </>
            )}
            
            {(currentUser?.role === "manager" || currentUser?.role === "super_manager" || currentUser?.role === "admin") && (
              <div className="form-group">
                <label>Monthly Salary (RWF)</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
            
            <button type="submit" className="primary-btn" style={{ width: "100%" }}>
              ➕ Add Employee
            </button>
          </form>
        </div>

        {/* Employees List */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            👥 All Employees 
            <span style={{
              backgroundColor: "var(--clr-primary-brand)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.8em",
              fontWeight: "600"
            }}>({employees.length})</span>
          </h3>

          {employees.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px",
              backgroundColor: "var(--clr-bg-primary)",
              borderRadius: "8px",
              border: "2px dashed var(--clr-border)"
            }}>
              <div style={{ fontSize: "3em", marginBottom: "15px" }}>👥</div>
              <p style={{ color: "var(--clr-text-secondary)", fontSize: "1.1em" }}>
                No employees added yet.<br/>
                Add your first team member!
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px"
            }}>
              {employees.map((employee) => {
                const location = locations.find(loc => loc.id === employee.locationId);
                return (
                  <div key={employee.id} style={{
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
                        {employee.name}
                      </h4>
                      
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove employee "${employee.name}"?`)) {
                            onDeleteEmployee(employee.id);
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
                      backgroundColor: getRoleColor(employee.role),
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85em",
                      fontWeight: "600",
                      display: "inline-block",
                      marginBottom: "10px"
                    }}>
                      {getRoleIcon(employee.role)} {employee.role.toUpperCase()}
                    </div>
                    
                    <div style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                      <p style={{ margin: "5px 0" }}>
                        🏢 {location ? location.name : "Unknown Location"}
                      </p>
                      
                      {employee.phone && (
                        <p style={{ margin: "5px 0" }}>
                          📞 {employee.phone}
                        </p>
                      )}
                      
                      {employee.email && (
                        <p style={{ margin: "5px 0" }}>
                          📧 {employee.email}
                        </p>
                      )}
                      
                      {(currentUser?.role === "manager" || currentUser?.role === "super_manager" || currentUser?.role === "admin") && employee.salary > 0 && (
                        <p style={{ margin: "5px 0", fontWeight: "600", color: "var(--clr-success)" }}>
                          💰 {formatCurrency(employee.salary)}/month
                        </p>
                      )}
                      
                      <p style={{ margin: "5px 0", fontSize: "0.8em" }}>
                        Added: {new Date(employee.createdAt).toLocaleDateString()}
                      </p>
                      
                      {(() => {
                        const userAccount = userAccounts.find(user => user.employeeId === employee.id);
                        return userAccount ? (
                          <p style={{ margin: "5px 0", fontSize: "0.8em", color: "var(--clr-success)", fontWeight: "600" }}>
                            🔑 Login: {userAccount.username}
                          </p>
                        ) : (
                          <p style={{ margin: "5px 0", fontSize: "0.8em", color: "var(--clr-text-secondary)" }}>
                            🚫 No login account
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeManagement;