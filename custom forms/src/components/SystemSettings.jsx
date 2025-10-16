// src/components/SystemSettings.jsx

import React, { useState } from "react";

function SystemSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [defaultPlan, setDefaultPlan] = useState("basic");
  const [supportEmail, setSupportEmail] = useState("support@poscrm.com");
  const [systemName, setSystemName] = useState("POS CRM System");
  const [maxUsers, setMaxUsers] = useState("1000");
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [emailTemplates, setEmailTemplates] = useState({
    welcome: {
      subject: "Welcome to {restaurantName} - POS System",
      body: `Dear {ownerName},\n\nWelcome to our POS System!\n\nYour restaurant "{restaurantName}" has been successfully set up.\n\nLogin Details:\nUsername: {username}\nPassword: {password}\nURL: {loginUrl}\n\nBest regards,\nPOS System Team`
    },
    subscription: {
      subject: "Subscription Reminder - {restaurantName}",
      body: `Dear {ownerName},\n\nYour subscription for "{restaurantName}" will expire in {daysLeft} days.\n\nPlease renew your subscription to continue using our services.\n\nBest regards,\nPOS System Team`
    },
    license: {
      subject: "Your License Key - {restaurantName}",
      body: `Dear {ownerName},\n\nYour license key has been generated:\n\nLicense Key: {licenseKey}\nType: {licenseType}\nExpires: {expiryDate}\n\nBest regards,\nPOS System Team`
    }
  });

  const handleSaveSettings = () => {
    const settings = {
      maintenanceMode,
      defaultPlan,
      supportEmail,
      systemName,
      maxUsers: parseInt(maxUsers),
      backupFrequency,
      emailTemplates,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem("system_settings", JSON.stringify(settings));
    alert("System settings saved successfully!");
  };

  const handleEditTemplate = (templateType) => {
    setEditingTemplate(templateType);
  };

  const handleSaveTemplate = () => {
    setEditingTemplate(null);
    alert("Email template updated successfully!");
  };

  const handleTemplateChange = (field, value) => {
    setEmailTemplates(prev => ({
      ...prev,
      [editingTemplate]: {
        ...prev[editingTemplate],
        [field]: value
      }
    }));
  };

  const handleBackupData = () => {
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      allData[key] = localStorage.getItem(key);
    }
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pos_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert("System backup downloaded successfully!");
  };

  const handleRestoreData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (window.confirm("This will overwrite all current data. Are you sure?")) {
          localStorage.clear();
          Object.keys(data).forEach(key => {
            localStorage.setItem(key, data[key]);
          });
          alert("System restored successfully! Please refresh the page.");
        }
      } catch (error) {
        alert("Invalid backup file format!");
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm("This will permanently delete ALL system data. Are you absolutely sure?")) {
      if (window.confirm("This action cannot be undone. Type 'DELETE' to confirm:") && 
          window.prompt("Type DELETE to confirm:") === "DELETE") {
        localStorage.clear();
        alert("All data cleared! Please refresh the page.");
      }
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
        }}>System Settings</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Configure global system parameters</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
        marginBottom: "30px"
      }}>
        {/* General Settings */}
        <div className="card">
          <h3 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px" }}>
            General Settings
          </h3>
          
          <div className="form-group">
            <label>System Name</label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              placeholder="System name"
            />
          </div>
          
          <div className="form-group">
            <label>Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="support@example.com"
            />
          </div>
          
          <div className="form-group">
            <label>Max Users Per System</label>
            <input
              type="number"
              value={maxUsers}
              onChange={(e) => setMaxUsers(e.target.value)}
              placeholder="1000"
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label>Default Subscription Plan</label>
            <select
              value={defaultPlan}
              onChange={(e) => setDefaultPlan(e.target.value)}
            >
              <option value="basic">Basic</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
              />
              Maintenance Mode
            </label>
            <small style={{ color: "var(--clr-text-secondary)" }}>
              Prevents new user logins (admins can still access)
            </small>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="card">
          <h3 style={{ color: "var(--clr-success)", marginBottom: "20px" }}>
            Backup & Recovery
          </h3>
          
          <div className="form-group">
            <label>Backup Frequency</label>
            <select
              value={backupFrequency}
              onChange={(e) => setBackupFrequency(e.target.value)}
            >
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <button 
              onClick={handleBackupData}
              className="primary-btn"
              style={{ width: "100%", marginBottom: "10px" }}
            >
              Download System Backup
            </button>
            
            <label className="primary-btn" style={{ 
              width: "100%", 
              display: "block", 
              textAlign: "center",
              cursor: "pointer",
              marginBottom: "10px"
            }}>
              Restore from Backup
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreData}
                style={{ display: "none" }}
              />
            </label>
          </div>
          
          <div style={{
            backgroundColor: "#ffebee",
            border: "1px solid #ffcdd2",
            borderRadius: "8px",
            padding: "15px"
          }}>
            <h4 style={{ margin: "0 0 10px 0", color: "var(--clr-danger)" }}>
              Danger Zone
            </h4>
            <button 
              onClick={handleClearAllData}
              style={{
                backgroundColor: "var(--clr-danger)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                width: "100%"
              }}
            >
              Clear All System Data
            </button>
            <small style={{ color: "var(--clr-danger)", display: "block", marginTop: "5px" }}>
              This action cannot be undone!
            </small>
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="card">
        <h3 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px" }}>
          Email Templates
        </h3>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px"
        }}>
          <div style={{
            backgroundColor: "var(--clr-bg-primary)",
            border: "1px solid var(--clr-border)",
            borderRadius: "8px",
            padding: "15px"
          }}>
            <h4 style={{ margin: "0 0 10px 0", color: "var(--clr-text-primary)" }}>
              Welcome Email
            </h4>
            <p style={{ margin: "0", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
              Sent to new restaurant owners when they register
            </p>
            <button 
              onClick={() => handleEditTemplate('welcome')}
              style={{
                marginTop: "10px",
                padding: "5px 15px",
                backgroundColor: "var(--clr-primary-brand)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Edit Template
            </button>
          </div>
          
          <div style={{
            backgroundColor: "var(--clr-bg-primary)",
            border: "1px solid var(--clr-border)",
            borderRadius: "8px",
            padding: "15px"
          }}>
            <h4 style={{ margin: "0 0 10px 0", color: "var(--clr-text-primary)" }}>
              Subscription Reminder
            </h4>
            <p style={{ margin: "0", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
              Sent before subscription expires
            </p>
            <button 
              onClick={() => handleEditTemplate('subscription')}
              style={{
                marginTop: "10px",
                padding: "5px 15px",
                backgroundColor: "var(--clr-primary-brand)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Edit Template
            </button>
          </div>
          
          <div style={{
            backgroundColor: "var(--clr-bg-primary)",
            border: "1px solid var(--clr-border)",
            borderRadius: "8px",
            padding: "15px"
          }}>
            <h4 style={{ margin: "0 0 10px 0", color: "var(--clr-text-primary)" }}>
              License Key Email
            </h4>
            <p style={{ margin: "0", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
              Sent when new license is generated
            </p>
            <button 
              onClick={() => handleEditTemplate('license')}
              style={{
                marginTop: "10px",
                padding: "5px 15px",
                backgroundColor: "var(--clr-primary-brand)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Edit Template
            </button>
          </div>
        </div>
      </div>

      {/* Email Template Editor Modal */}
      {editingTemplate && (
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
          <div className="card" style={{ width: "600px", maxWidth: "90vw", maxHeight: "80vh", overflow: "auto" }}>
            <h3 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px" }}>
              Edit {editingTemplate.charAt(0).toUpperCase() + editingTemplate.slice(1)} Email Template
            </h3>
            
            <div className="form-group">
              <label>Subject Line</label>
              <input
                type="text"
                value={emailTemplates[editingTemplate].subject}
                onChange={(e) => handleTemplateChange('subject', e.target.value)}
                placeholder="Email subject"
              />
            </div>
            
            <div className="form-group">
              <label>Email Body</label>
              <textarea
                value={emailTemplates[editingTemplate].body}
                onChange={(e) => handleTemplateChange('body', e.target.value)}
                rows="10"
                style={{ width: "100%", minHeight: "200px" }}
                placeholder="Email content"
              />
            </div>
            
            <div style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)", marginBottom: "20px" }}>
              <strong>Available Variables:</strong><br/>
              {editingTemplate === 'welcome' && '{restaurantName}, {ownerName}, {username}, {password}, {loginUrl}'}<br/>
              {editingTemplate === 'subscription' && '{restaurantName}, {ownerName}, {daysLeft}'}<br/>
              {editingTemplate === 'license' && '{restaurantName}, {ownerName}, {licenseKey}, {licenseType}, {expiryDate}'}
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={handleSaveTemplate}
                className="primary-btn" 
                style={{ flex: "1" }}
              >
                Save Template
              </button>
              <button 
                onClick={() => setEditingTemplate(null)}
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
          </div>
        </div>
      )}

      {/* Save Button */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button 
          onClick={handleSaveSettings}
          className="primary-btn"
          style={{ padding: "15px 40px", fontSize: "1.1em" }}
        >
          Save All Settings
        </button>
      </div>
    </div>
  );
}

export default SystemSettings;