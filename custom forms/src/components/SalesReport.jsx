// src/components/SalesReport.jsx (CLEANED AND FIXED)

import React, { useState } from "react";
import { formatCurrency, printReport } from "../utils/dataHelpers";

function SalesReport({ orders }) {
  const [periodFilter, setPeriodFilter] = useState("all");
  
  // Filter orders by period
  const getFilteredOrders = () => {
    if (!orders || orders.length === 0) return [];
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (periodFilter) {
      case "today":
        return orders.filter(order => {
          const orderDate = new Date(order.date);
          return orderDate >= today;
        });
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orders.filter(order => {
          const orderDate = new Date(order.date);
          return orderDate >= weekAgo;
        });
      case "month":
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return orders.filter(order => {
          const orderDate = new Date(order.date);
          return orderDate >= monthAgo;
        });
      default:
        return orders;
    }
  };
  
  const filteredOrders = getFilteredOrders();
  
  const calculateTotalRevenue = () => {
    if (!filteredOrders || filteredOrders.length === 0) return 0;

    return filteredOrders
      .filter(
        (order) =>
          order.status !== "Cancelled" &&
          typeof order.revenue === "number" &&
          !isNaN(order.revenue)
      )
      .reduce((sum, order) => sum + order.revenue, 0);
  };

  const nonCancelledOrders = filteredOrders
    ? filteredOrders.filter((order) => order.status !== "Cancelled")
    : [];

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>📊 Sales Report & Summary</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Complete overview of all sales and revenue</p>
      </div>

      <div className="card" style={{
        background: "linear-gradient(135deg, var(--clr-primary-brand), var(--clr-secondary-brand))",
        color: "white",
        textAlign: "center",
        marginBottom: "20px"
      }}>
        <h3 style={{ marginBottom: "15px", fontSize: "1.3em" }}>💰 Total Revenue Generated</h3>
        <div style={{ 
          fontSize: "3em", 
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          marginBottom: "10px"
        }}>{formatCurrency(calculateTotalRevenue())}</div>
        <p style={{ fontSize: "1.1em", opacity: "0.9" }}>Total Completed/Open Orders: {nonCancelledOrders.length}</p>
      </div>

      {/* Period Filter */}
      <div className="card">
        <h3 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "20px"
        }}>📅 Filter by Period</h3>
        
        <div style={{ 
          display: "flex", 
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "10px"
        }}>
          {[
            { value: "all", label: "All Time" },
            { value: "today", label: "Today" },
            { value: "week", label: "Last 7 Days" },
            { value: "month", label: "Last 30 Days" }
          ].map(period => (
            <button
              key={period.value}
              onClick={() => setPeriodFilter(period.value)}
              className={periodFilter === period.value ? "primary-btn" : "secondary-btn"}
              style={{ 
                padding: "8px 16px",
                fontSize: "0.9em"
              }}
            >
              {period.label}
            </button>
          ))}
        </div>
        
        <p style={{ 
          fontSize: "0.9em", 
          color: "var(--clr-text-secondary)",
          margin: 0
        }}>Showing {filteredOrders.length} orders</p>
      </div>

      <div className="card">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            margin: "0",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            📋 All Orders 
            <span style={{
              backgroundColor: "var(--clr-primary-brand)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.8em",
              fontWeight: "600"
            }}>({filteredOrders.length})</span>
          </h3>
          <button
            onClick={() => printReport(filteredOrders)}
            className="primary-btn"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            🖨️ Print Report
          </button>
        </div>

        {filteredOrders && filteredOrders.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Table/ID</th>
                  <th>Customer</th>
                  <th>Total Revenue</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
            <tbody>
              {filteredOrders
                .slice()
                .sort((a, b) => b.id - a.id)
                .slice(0, 50)
                .map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: "600" }}>{order.table || order.id}</td>
                    <td>{order.customerName || "N/A"}</td>
                    <td style={{ fontWeight: "600", color: "var(--clr-success)" }}>
                      {formatCurrency(order.revenue)}
                    </td>
                    <td style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                      {new Date(order.date).toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-badge ${
                        order.status === "Closed" ? "status-closed" : 
                        order.status === "Cancelled" ? "status-cancelled" : "status-open"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "60px 20px",
            backgroundColor: "var(--clr-bg-primary)",
            borderRadius: "8px",
            border: "2px dashed var(--clr-border)"
          }}>
            <div style={{ fontSize: "3em", marginBottom: "15px" }}>📊</div>
            <p style={{ color: "var(--clr-text-secondary)", fontSize: "1.1em" }}>
              No orders processed yet.<br/>
              Start creating orders to see sales data!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



export default SalesReport;
