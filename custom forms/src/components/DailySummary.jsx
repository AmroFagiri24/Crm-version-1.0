// src/components/DailySummary.jsx

import React from "react";
import { formatCurrency } from "../utils/dataHelpers";

function DailySummary({ orders }) {
  const today = new Date().toDateString();
  
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.date).toDateString();
    return orderDate === today;
  });
  
  const todayRevenue = todayOrders
    .filter(order => order.status === 'Closed')
    .reduce((sum, order) => sum + (order.revenue || 0), 0);
    
  const todayOrdersCount = todayOrders.filter(order => order.status === 'Closed').length;
  const pendingOrders = todayOrders.filter(order => order.status === 'Open').length;
  
  // Best selling items today
  const itemSales = {};
  todayOrders
    .filter(order => order.status === 'Closed')
    .forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.name]) {
          itemSales[item.name] = { quantity: 0, revenue: 0 };
        }
        itemSales[item.name].quantity += item.quantity;
        itemSales[item.name].revenue += item.price * item.quantity;
      });
    });
    
  const topItems = Object.entries(itemSales)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 3);

  return (
    <div className="card">
      <h3 style={{ 
        color: "var(--clr-primary-brand)", 
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>📊 Today's Summary - {new Date().toLocaleDateString()}</h3>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "15px",
        marginBottom: "20px"
      }}>
        <div style={{
          textAlign: "center",
          padding: "15px",
          backgroundColor: "var(--clr-bg-primary)",
          borderRadius: "8px",
          border: "2px solid var(--clr-success)"
        }}>
          <div style={{ fontSize: "1.8em", marginBottom: "5px" }}>💰</div>
          <div style={{ fontSize: "1.5em", fontWeight: "700", color: "var(--clr-success)" }}>
            {formatCurrency(todayRevenue)}
          </div>
          <div style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>Revenue</div>
        </div>
        
        <div style={{
          textAlign: "center",
          padding: "15px",
          backgroundColor: "var(--clr-bg-primary)",
          borderRadius: "8px",
          border: "2px solid var(--clr-primary-brand)"
        }}>
          <div style={{ fontSize: "1.8em", marginBottom: "5px" }}>✅</div>
          <div style={{ fontSize: "1.5em", fontWeight: "700", color: "var(--clr-primary-brand)" }}>
            {todayOrdersCount}
          </div>
          <div style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>Completed</div>
        </div>
        
        <div style={{
          textAlign: "center",
          padding: "15px",
          backgroundColor: "var(--clr-bg-primary)",
          borderRadius: "8px",
          border: "2px solid #f39c12"
        }}>
          <div style={{ fontSize: "1.8em", marginBottom: "5px" }}>⏳</div>
          <div style={{ fontSize: "1.5em", fontWeight: "700", color: "#f39c12" }}>
            {pendingOrders}
          </div>
          <div style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>Pending</div>
        </div>
      </div>
      
      {topItems.length > 0 && (
        <div>
          <h4 style={{ 
            color: "var(--clr-text-primary)", 
            marginBottom: "15px" 
          }}>🏆 Top Selling Items Today</h4>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {topItems.map(([itemName, data], index) => (
              <div key={itemName} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "var(--clr-bg-primary)",
                borderRadius: "6px",
                border: "1px solid var(--clr-border)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    backgroundColor: index === 0 ? "#ffd700" : index === 1 ? "#c0c0c0" : "#cd7f32",
                    color: "white",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8em",
                    fontWeight: "600"
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ fontWeight: "600" }}>{itemName}</span>
                </div>
                
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "600", color: "var(--clr-success)" }}>
                    {formatCurrency(data.revenue)}
                  </div>
                  <div style={{ fontSize: "0.85em", color: "var(--clr-text-secondary)" }}>
                    {data.quantity} sold
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DailySummary;