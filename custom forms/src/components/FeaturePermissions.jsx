// src/components/FeaturePermissions.jsx

import React, { useState } from "react";

const AVAILABLE_FEATURES = {
  dashboard: { name: "Dashboard", icon: "📊", description: "View sales analytics and reports" },
  orders: { name: "Order Management", icon: "📋", description: "Create and manage orders" },
  kitchen: { name: "Kitchen Queue", icon: "👨‍🍳", description: "View and manage kitchen orders" },
  menu: { name: "Menu Management", icon: "📖", description: "Add, edit, and delete menu items" },
  inventory: { name: "Inventory", icon: "📦", description: "Track stock and purchases" },
  employees: { name: "Employee Management", icon: "👥", description: "Manage staff members" },
  suppliers: { name: "Supplier Management", icon: "🚚", description: "Manage suppliers and vendors" },
  locations: { name: "Location Management", icon: "🏢", description: "Manage multiple store locations" },
  users: { name: "User Management", icon: "👤", description: "Create and manage user accounts" },
  reports: { name: "Reports & Analytics", icon: "📈", description: "Generate detailed reports" },
  settings: { name: "System Settings", icon: "⚙️", description: "Configure system preferences" },
  payments: { name: "Payment Processing", icon: "💳", description: "Handle payments and transactions" }
};

function FeaturePermissions({ userPermissions = {}, onPermissionsChange, readOnly = false }) {
  const [permissions, setPermissions] = useState(userPermissions);

  const handleFeatureToggle = (featureKey) => {
    if (readOnly) return;
    
    const newPermissions = {
      ...permissions,
      [featureKey]: !permissions[featureKey]
    };
    setPermissions(newPermissions);
    onPermissionsChange(newPermissions);
  };

  const handleSelectAll = () => {
    if (readOnly) return;
    
    const allEnabled = Object.keys(AVAILABLE_FEATURES).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setPermissions(allEnabled);
    onPermissionsChange(allEnabled);
  };

  const handleSelectNone = () => {
    if (readOnly) return;
    
    const allDisabled = Object.keys(AVAILABLE_FEATURES).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setPermissions(allDisabled);
    onPermissionsChange(allDisabled);
  };

  const enabledCount = Object.values(permissions).filter(Boolean).length;
  const totalCount = Object.keys(AVAILABLE_FEATURES).length;

  return (
    <div className="feature-permissions">
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "var(--clr-bg-primary)",
        borderRadius: "8px",
        border: "1px solid var(--clr-border)"
      }}>
        <div>
          <h4 style={{ margin: "0", color: "var(--clr-text-primary)" }}>
            Feature Permissions
          </h4>
          <p style={{ margin: "5px 0 0 0", color: "var(--clr-text-secondary)", fontSize: "0.9em" }}>
            {enabledCount} of {totalCount} features enabled
          </p>
        </div>
        
        {!readOnly && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleSelectAll}
              style={{
                backgroundColor: "var(--clr-success)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "0.85em"
              }}
            >
              Select All
            </button>
            <button
              onClick={handleSelectNone}
              style={{
                backgroundColor: "var(--clr-text-secondary)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "0.85em"
              }}
            >
              Select None
            </button>
          </div>
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "15px"
      }}>
        {Object.entries(AVAILABLE_FEATURES).map(([key, feature]) => (
          <div
            key={key}
            onClick={() => handleFeatureToggle(key)}
            style={{
              backgroundColor: permissions[key] ? "var(--clr-success-light)" : "var(--clr-bg-primary)",
              border: `2px solid ${permissions[key] ? "var(--clr-success)" : "var(--clr-border)"}`,
              borderRadius: "12px",
              padding: "15px",
              cursor: readOnly ? "default" : "pointer",
              transition: "all 0.2s ease",
              opacity: readOnly ? 0.7 : 1
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "1.5em" }}>{feature.icon}</span>
              <div style={{ flex: 1 }}>
                <h5 style={{ 
                  margin: "0", 
                  color: permissions[key] ? "var(--clr-success)" : "var(--clr-text-primary)",
                  fontWeight: "600"
                }}>
                  {feature.name}
                </h5>
              </div>
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: permissions[key] ? "var(--clr-success)" : "var(--clr-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "0.8em",
                fontWeight: "bold"
              }}>
                {permissions[key] ? "✓" : ""}
              </div>
            </div>
            <p style={{ 
              margin: "0", 
              color: "var(--clr-text-secondary)", 
              fontSize: "0.85em",
              lineHeight: "1.3"
            }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturePermissions;