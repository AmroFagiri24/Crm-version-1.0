// src/components/BranchInsights.jsx

import React from "react";
import { formatCurrency } from "../utils/dataHelpers";

function BranchInsights({ locations, employees, suppliers, userAccounts }) {
  const getRoleIcon = (role) => {
    switch (role) {
      case "super_manager": return "👑";
      case "manager": return "👔";
      case "cashier": return "💰";
      case "chef": return "👨🍳";
      case "waiter": return "🍽️";
      default: return "👤";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "super_manager": return "#8e44ad";
      case "manager": return "var(--clr-primary-brand)";
      case "cashier": return "var(--clr-success)";
      case "chef": return "#e67e22";
      case "waiter": return "#9b59b6";
      default: return "var(--clr-text-secondary)";
    }
  };

  const totalEmployees = employees.length;
  const totalLocations = locations.length;
  const totalSuppliers = suppliers.length;


  const employeesByRole = employees.reduce((acc, emp) => {
    acc[emp.role] = (acc[emp.role] || 0) + 1;
    return acc;
  }, {});

  const employeesByLocation = employees.reduce((acc, emp) => {
    const location = locations.find(loc => loc.id === emp.locationId);
    const locationName = location ? location.name : "Unknown";
    acc[locationName] = (acc[locationName] || 0) + 1;
    return acc;
  }, {});

  const suppliersByCategory = suppliers.reduce((acc, sup) => {
    acc[sup.category] = (acc[sup.category] || 0) + 1;
    return acc;
  }, {});

  const totalSalaries = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "#8e44ad", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>👑 Branch Insights Dashboard</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Complete overview of all business operations</p>
      </div>

      {/* Overview Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div style={{ fontSize: "3em", marginBottom: "10px" }}>🏢</div>
          <h3 style={{ color: "var(--clr-primary-brand)", margin: "0 0 5px 0" }}>{totalLocations}</h3>
          <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>Total Locations</p>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div style={{ fontSize: "3em", marginBottom: "10px" }}>👥</div>
          <h3 style={{ color: "var(--clr-success)", margin: "0 0 5px 0" }}>{totalEmployees}</h3>
          <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>Total Employees</p>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div style={{ fontSize: "3em", marginBottom: "10px" }}>🚚</div>
          <h3 style={{ color: "#e67e22", margin: "0 0 5px 0" }}>{totalSuppliers}</h3>
          <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>Total Suppliers</p>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "25px" }}>
          <div style={{ fontSize: "3em", marginBottom: "10px" }}>💰</div>
          <h3 style={{ color: "var(--clr-danger)", margin: "0 0 5px 0" }}>{formatCurrency(totalSalaries)}</h3>
          <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>Monthly Salaries</p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
        marginBottom: "30px"
      }}>
        {/* Employees by Role */}
        <div className="card">
          <h3 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px" }}>
            👥 Employees by Role
          </h3>
          {Object.entries(employeesByRole).map(([role, count]) => (
            <div key={role} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid var(--clr-border)"
            }}>
              <span style={{
                backgroundColor: getRoleColor(role),
                color: "white",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.85em",
                fontWeight: "600"
              }}>
                {getRoleIcon(role)} {role.toUpperCase()}
              </span>
              <span style={{ fontWeight: "600", color: "var(--clr-text-primary)" }}>
                {count}
              </span>
            </div>
          ))}
        </div>

        {/* Employees by Location */}
        <div className="card">
          <h3 style={{ color: "var(--clr-success)", marginBottom: "20px" }}>
            🏢 Employees by Location
          </h3>
          {Object.entries(employeesByLocation).map(([location, count]) => (
            <div key={location} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid var(--clr-border)"
            }}>
              <span style={{ color: "var(--clr-text-primary)" }}>{location}</span>
              <span style={{ 
                fontWeight: "600", 
                color: "var(--clr-success)",
                backgroundColor: "var(--clr-bg-primary)",
                padding: "4px 8px",
                borderRadius: "12px"
              }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px"
      }}>
        {/* Suppliers by Category */}
        <div className="card">
          <h3 style={{ color: "#e67e22", marginBottom: "20px" }}>
            🚚 Suppliers by Category
          </h3>
          {Object.entries(suppliersByCategory).map(([category, count]) => (
            <div key={category} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid var(--clr-border)"
            }}>
              <span style={{ color: "var(--clr-text-primary)", textTransform: "capitalize" }}>
                {category}
              </span>
              <span style={{ 
                fontWeight: "600", 
                color: "#e67e22",
                backgroundColor: "var(--clr-bg-primary)",
                padding: "4px 8px",
                borderRadius: "12px"
              }}>
                {count}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Overview */}
        <div className="card">
          <h3 style={{ color: "var(--clr-danger)", marginBottom: "20px" }}>
            💰 Financial Overview
          </h3>
          <div style={{
            padding: "20px",
            backgroundColor: "var(--clr-bg-primary)",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2em", marginBottom: "10px" }}>💸</div>
            <h4 style={{ color: "var(--clr-danger)", margin: "0 0 5px 0" }}>
              {formatCurrency(totalSalaries)}
            </h4>
            <p style={{ color: "var(--clr-text-secondary)", margin: "0" }}>
              Total Monthly Salaries
            </p>
          </div>
          
          <div style={{ marginTop: "15px", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
            <p style={{ margin: "5px 0" }}>
              📊 Average per employee: {formatCurrency(totalEmployees > 0 ? totalSalaries / totalEmployees : 0)}
            </p>
            <p style={{ margin: "5px 0" }}>
              🏢 Average per location: {formatCurrency(totalLocations > 0 ? totalSalaries / totalLocations : 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Locations Details */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h3 style={{ color: "var(--clr-primary-brand)", marginBottom: "20px" }}>
          🏢 Location Details
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px"
        }}>
          {locations.map((location) => {
            const locationEmployees = employees.filter(emp => emp.locationId === location.id);
            const locationSalaries = locationEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
            
            return (
              <div key={location.id} style={{
                backgroundColor: "var(--clr-bg-primary)",
                border: "2px solid var(--clr-border)",
                borderRadius: "12px",
                padding: "20px"
              }}>
                <h4 style={{ margin: "0 0 10px 0", color: "var(--clr-text-primary)" }}>
                  {location.name}
                </h4>
                <p style={{ margin: "5px 0", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                  📍 {location.address}
                </p>
                <p style={{ margin: "5px 0", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                  📞 {location.phone}
                </p>
                <p style={{ margin: "5px 0", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                  👔 Manager: {location.manager}
                </p>
                <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "var(--clr-bg-secondary)", borderRadius: "8px" }}>
                  <p style={{ margin: "2px 0", fontSize: "0.85em" }}>
                    👥 Employees: <strong>{locationEmployees.length}</strong>
                  </p>
                  <p style={{ margin: "2px 0", fontSize: "0.85em" }}>
                    💰 Monthly Salaries: <strong>{formatCurrency(locationSalaries)}</strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BranchInsights;