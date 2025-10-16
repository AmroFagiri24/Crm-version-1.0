// src/components/SystemAnalytics.jsx

import React from "react";

function SystemAnalytics({ userAccounts }) {
  // Get unique tenants
  const tenants = userAccounts.reduce((acc, user) => {
    if (user.tenantId && !acc.find(t => t.tenantId === user.tenantId)) {
      acc.push({
        tenantId: user.tenantId,
        restaurantName: user.restaurantName || "Unknown Restaurant",
        createdAt: user.createdAt || new Date().toISOString()
      });
    }
    return acc;
  }, []);

  // Analytics calculations
  const totalRestaurants = tenants.length;
  const totalUsers = userAccounts.length;
  const activeSubscriptions = tenants.filter(t => t.subscriptionStatus !== "expired").length;
  const adminUsers = userAccounts.filter(u => u.role === "admin").length;
  const managerUsers = userAccounts.filter(u => u.role === "super_manager" || u.role === "manager").length;
  const staffUsers = userAccounts.filter(u => ["cashier", "waiter", "chef"].includes(u.role)).length;

  // Recent registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentRegistrations = tenants.filter(t => new Date(t.createdAt) > thirtyDaysAgo).length;

  // Monthly revenue estimate (assuming $50/month per restaurant)
  const monthlyRevenue = totalRestaurants * 50;
  const annualRevenue = monthlyRevenue * 12;

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "#e74c3c", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>System Analytics</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Platform performance and business metrics</p>
      </div>

      {/* Overview Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px", fontWeight: "bold" }}>LOCATIONS</div>
          <h3 style={{ color: "var(--clr-primary-brand)", margin: "0 0 5px 0" }}>{totalRestaurants}</h3>
          <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>Total Restaurants</p>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px", fontWeight: "bold" }}>USERS</div>
          <h3 style={{ color: "var(--clr-success)", margin: "0 0 5px 0" }}>{totalUsers}</h3>
          <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>Total Users</p>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px", fontWeight: "bold" }}>ACTIVE</div>
          <h3 style={{ color: "#27ae60", margin: "0 0 5px 0" }}>{activeSubscriptions}</h3>
          <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>Active Subscriptions</p>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px", fontWeight: "bold" }}>NEW</div>
          <h3 style={{ color: "#f39c12", margin: "0 0 5px 0" }}>{recentRegistrations}</h3>
          <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>New This Month</p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
        marginBottom: "30px"
      }}>
        {/* User Distribution */}
        <div className="card">
          <h3 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px" }}>
            User Distribution
          </h3>
          <div style={{ padding: "10px 0", borderBottom: "1px solid var(--clr-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Admins</span>
              <span style={{ fontWeight: "600", color: "#e74c3c" }}>{adminUsers}</span>
            </div>
          </div>
          <div style={{ padding: "10px 0", borderBottom: "1px solid var(--clr-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Managers</span>
              <span style={{ fontWeight: "600", color: "var(--clr-primary-brand)" }}>{managerUsers}</span>
            </div>
          </div>
          <div style={{ padding: "10px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Staff</span>
              <span style={{ fontWeight: "600", color: "var(--clr-success)" }}>{staffUsers}</span>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="card">
          <h3 style={{ color: "var(--clr-success)", marginBottom: "20px" }}>
            Revenue Analytics
          </h3>
          <div style={{ padding: "15px", backgroundColor: "var(--clr-bg-primary)", borderRadius: "8px", marginBottom: "15px" }}>
            <h4 style={{ margin: "0 0 5px 0", color: "var(--clr-success)" }}>
              ${monthlyRevenue.toLocaleString()}/month
            </h4>
            <p style={{ margin: "0", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
              Estimated Monthly Revenue
            </p>
          </div>
          <div style={{ padding: "15px", backgroundColor: "var(--clr-bg-primary)", borderRadius: "8px" }}>
            <h4 style={{ margin: "0 0 5px 0", color: "var(--clr-primary-brand)" }}>
              ${annualRevenue.toLocaleString()}/year
            </h4>
            <p style={{ margin: "0", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
              Projected Annual Revenue
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px" }}>
          Recent Restaurant Registrations
        </h3>
        {tenants.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--clr-text-secondary)" }}>
            No restaurants registered yet
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "15px"
          }}>
            {tenants.slice(-6).reverse().map((tenant) => (
              <div key={tenant.tenantId} style={{
                backgroundColor: "var(--clr-bg-primary)",
                border: "1px solid var(--clr-border)",
                borderRadius: "8px",
                padding: "15px"
              }}>
                <h4 style={{ margin: "0 0 5px 0", color: "var(--clr-text-primary)" }}>
                  {tenant.restaurantName}
                </h4>
                <p style={{ margin: "0", fontSize: "0.8em", color: "var(--clr-text-secondary)" }}>
                  {new Date(tenant.createdAt).toLocaleDateString()}
                </p>
                <p style={{ margin: "5px 0 0 0", fontSize: "0.7em", fontFamily: "monospace", color: "var(--clr-text-secondary)" }}>
                  ID: {tenant.tenantId}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemAnalytics;