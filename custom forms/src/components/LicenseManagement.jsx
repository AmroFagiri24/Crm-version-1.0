// src/components/LicenseManagement.jsx

import React, { useState } from "react";

function LicenseManagement({ userAccounts }) {
  const [licenseType, setLicenseType] = useState("basic");
  const [duration, setDuration] = useState("12");
  const [restaurantName, setRestaurantName] = useState("");

  const generateLicenseKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) result += "-";
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleGenerateLicense = (e) => {
    e.preventDefault();
    if (!restaurantName.trim()) {
      alert("Please enter restaurant name");
      return;
    }

    const licenseKey = generateLicenseKey();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(duration));

    const licenseInfo = {
      key: licenseKey,
      type: licenseType,
      restaurant: restaurantName.trim(),
      duration: `${duration} months`,
      expiry: expiryDate.toLocaleDateString(),
      generated: new Date().toLocaleDateString(),
      features: getLicenseFeatures(licenseType)
    };

    // Copy to clipboard
    const licenseText = `
POS License Key
===============
Restaurant: ${licenseInfo.restaurant}
License Key: ${licenseInfo.key}
Type: ${licenseInfo.type.toUpperCase()}
Duration: ${licenseInfo.duration}
Expires: ${licenseInfo.expiry}
Generated: ${licenseInfo.generated}

Features Included:
${licenseInfo.features.map(f => `• ${f}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(licenseText).then(() => {
      alert(`License generated and copied to clipboard!\n\nKey: ${licenseKey}`);
    }).catch(() => {
      alert(`License generated!\n\nKey: ${licenseKey}\n\nPlease copy manually.`);
    });

    setRestaurantName("");
  };

  const getLicenseFeatures = (type) => {
    switch (type) {
      case "trial":
        return [
          "7-day free trial with full features",
          "All POS features",
          "Unlimited menu items",
          "Unlimited orders",
          "Multi-location support",
          "Advanced analytics & insights",
          "Employee management",
          "Supplier management",
          "Branch insights",
          "Custom integrations",
          "Auto-disable after trial"
        ];
      case "professional":
        return [
          "Up to 10 users",
          "Full POS features",
          "Up to 100 menu items",
          "Up to 500 orders",
          "Multi-location support",
          "Employee management",
          "Supplier management",
          "Sales reporting",
          "Priority support"
        ];
      case "enterprise":
        return [
          "Up to 50 users",
          "All POS features",
          "Unlimited menu items",
          "Unlimited orders",
          "Multi-location support",
          "Advanced analytics & insights",
          "Employee management",
          "Supplier management",
          "Branch insights",
          "Custom integrations",
          "24/7 phone support",
          "Dedicated account manager"
        ];
      default:
        return [];
    }
  };

  const getLicensePrice = (type, months) => {
    const prices = {
      trial: 0,
      professional: 79,
      enterprise: 199
    };
    return prices[type] * parseInt(months);
  };

  // Get tenants for license tracking
  const tenants = userAccounts.reduce((acc, user) => {
    if (user.tenantId && !acc.find(t => t.tenantId === user.tenantId)) {
      acc.push({
        tenantId: user.tenantId,
        restaurantName: user.restaurantName || "Unknown Restaurant",
        createdAt: user.createdAt || new Date().toISOString(),
        licenseType: user.licenseType || "trial"
      });
    }
    return acc;
  }, []);

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "#e74c3c", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>License Management</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Generate and manage software licenses</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* License Generator */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-success)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>Generate License</h3>
          
          <form onSubmit={handleGenerateLicense}>
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
              <label>License Type *</label>
              <select
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                required
              >
                <option value="trial">7-Day Free Trial</option>
                <option value="professional">Professional - $79/month</option>
                <option value="enterprise">Enterprise - $199/month</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Duration *</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              >
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
              </select>
            </div>
            
            <div style={{
              backgroundColor: "var(--clr-bg-primary)",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "var(--clr-primary-brand)" }}>
                Total: ${getLicensePrice(licenseType, duration).toLocaleString()}
              </h4>
              <p style={{ margin: "0", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                {licenseType.charAt(0).toUpperCase() + licenseType.slice(1)} license for {duration} months
              </p>
            </div>
            
            <button type="submit" className="primary-btn" style={{ width: "100%" }}>
              Generate License Key
            </button>
          </form>
        </div>

        {/* License Plans */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            marginBottom: "20px"
          }}>License Plans</h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}>
            {["trial", "professional", "enterprise"].map((plan) => (
              <div key={plan} style={{
                backgroundColor: "var(--clr-bg-primary)",
                border: "2px solid var(--clr-border)",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center"
              }}>
                <h4 style={{ 
                  margin: "0 0 10px 0", 
                  color: "var(--clr-text-primary)",
                  textTransform: "capitalize"
                }}>
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </h4>
                <div style={{ 
                  fontSize: "1.5em", 
                  fontWeight: "600", 
                  color: "var(--clr-success)",
                  marginBottom: "15px"
                }}>
                  {plan === 'trial' ? 'FREE' : `$${getLicensePrice(plan, "1")}/month`}
                </div>
                <div style={{ fontSize: "0.85em", color: "var(--clr-text-secondary)" }}>
                  {getLicenseFeatures(plan).map((feature, index) => (
                    <p key={index} style={{ margin: "5px 0" }}>• {feature}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Active Licenses */}
          <h4 style={{ color: "var(--clr-primary-brand)", marginBottom: "15px" }}>
            Active Licenses ({tenants.length})
          </h4>
          
          {tenants.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "40px",
              backgroundColor: "var(--clr-bg-primary)",
              borderRadius: "8px",
              border: "2px dashed var(--clr-border)"
            }}>
              <div style={{ fontSize: "2em", marginBottom: "15px", fontWeight: "bold" }}>LICENSE</div>
              <p style={{ color: "var(--clr-text-secondary)", fontSize: "1.1em" }}>
                No licenses issued yet
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "15px"
            }}>
              {tenants.map((tenant) => (
                <div key={tenant.tenantId} style={{
                  backgroundColor: "var(--clr-bg-primary)",
                  border: "1px solid var(--clr-border)",
                  borderRadius: "8px",
                  padding: "15px"
                }}>
                  <h5 style={{ margin: "0 0 5px 0", color: "var(--clr-text-primary)" }}>
                    {tenant.restaurantName}
                  </h5>
                  <div style={{
                    backgroundColor: "var(--clr-success)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.75em",
                    fontWeight: "600",
                    display: "inline-block",
                    marginBottom: "8px",
                    textTransform: "uppercase"
                  }}>
                    {tenant.licenseType}
                  </div>
                  <p style={{ margin: "0", fontSize: "0.8em", color: "var(--clr-text-secondary)" }}>
                    Created: {new Date(tenant.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LicenseManagement;