// src/components/Dashboard.jsx

import React from "react";
import { formatCurrency, exportOrdersToCSV, exportInventoryToCSV } from "../utils/dataHelpers";
import DailySummary from "./DailySummary";
import Chart from "./Chart";

function Dashboard({ inventory, orders, menuItems }) {
  // Safety check for array existence
  const menuItemsCount = menuItems ? menuItems.length : 0;
  const ordersCount = orders ? orders.length : 0;
  const inventoryCount = inventory ? inventory.length : 0;
  
  // Calculate additional metrics
  const openOrders = orders ? orders.filter(order => order.status === 'Open').length : 0;
  const closedOrders = orders ? orders.filter(order => order.status === 'Completed').length : 0;
  const totalRevenue = orders ? orders
    .filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + (order.revenue || 0), 0) : 0;

  // Low stock alerts
  const menuItemStock = {};
  inventory.forEach(batch => {
    if (batch.itemType === 'menu_item' && batch.menuItemId) {
      menuItemStock[batch.menuItemId] = (menuItemStock[batch.menuItemId] || 0) + batch.quantity;
    }
  });
  
  const lowStockItems = menuItems.filter(item => {
    const stock = menuItemStock[item.id] || 0;
    return stock < 10; // Alert when stock is below 10
  });

  return (
    <div className="main-content">
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "10px",
          fontSize: "2.5em",
          fontWeight: "700"
        }}>Dashboard Overview</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Welcome to your POS management system</p>
      </div>
      
      {/* Enhanced Summary Cards */}
      <div className="dashboard-summary">
        <div className="summary-box" style={{ borderTopColor: "var(--clr-primary-brand)" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px" }}>📋</div>
          <h3>Menu Items</h3>
          <div className="value">{menuItemsCount}</div>
        </div>
        
        <div className="summary-box" style={{ borderTopColor: "var(--clr-success)" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px" }}>📦</div>
          <h3>Open Orders</h3>
          <div className="value">{openOrders}</div>
        </div>
        
        <div className="summary-box" style={{ borderTopColor: "#f39c12" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px" }}>✅</div>
          <h3>Completed Orders</h3>
          <div className="value">{closedOrders}</div>
        </div>
        
        <div className="summary-box" style={{ borderTopColor: "var(--clr-danger)" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px" }}>📊</div>
          <h3>Inventory Items</h3>
          <div className="value">{inventoryCount}</div>
        </div>
      </div>
      
      {/* Revenue Card */}
      <div className="card" style={{ 
        background: "linear-gradient(135deg, var(--clr-primary-brand), var(--clr-secondary-brand))",
        color: "white",
        textAlign: "center",
        marginTop: "30px"
      }}>
        <h3 style={{ marginBottom: "15px", fontSize: "1.3em" }}>💰 Total Revenue</h3>
        <div style={{ 
          fontSize: "3em", 
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>{formatCurrency(totalRevenue)}</div>
      </div>
      
      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="card" style={{
          backgroundColor: "#fff3cd",
          border: "2px solid #ffc107",
          marginBottom: "20px"
        }}>
          <h3 style={{ 
            color: "#856404", 
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>⚠️ Low Stock Alert</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {lowStockItems.map(item => {
              const stock = menuItemStock[item.id] || 0;
              return (
                <div key={item.id} style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "0.9em",
                  fontWeight: "600"
                }}>
                  {item.name}: {stock} left
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "20px",
          fontSize: "1.4em"
        }}>🚀 Quick Actions</h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "15px" 
        }}>
          <div style={{
            padding: "15px",
            backgroundColor: "var(--clr-bg-primary)",
            borderRadius: "8px",
            textAlign: "center",
            border: "2px solid var(--clr-border)",
            transition: "all 0.3s ease"
          }}>
            <div style={{ fontSize: "1.5em", marginBottom: "8px" }}>🛒</div>
            <strong>Create New Order</strong>
            <p style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)", marginTop: "5px" }}>Start a new customer order</p>
          </div>
          
          <div style={{
            padding: "15px",
            backgroundColor: "var(--clr-bg-primary)",
            borderRadius: "8px",
            textAlign: "center",
            border: "2px solid var(--clr-border)",
            transition: "all 0.3s ease"
          }}>
            <div style={{ fontSize: "1.5em", marginBottom: "8px" }}>📋</div>
            <strong>Manage Inventory</strong>
            <p style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)", marginTop: "5px" }}>Update stock levels</p>
          </div>
          
          <div style={{
            padding: "15px",
            backgroundColor: "var(--clr-bg-primary)",
            borderRadius: "8px",
            textAlign: "center",
            border: "2px solid var(--clr-border)",
            transition: "all 0.3s ease"
          }}>
            <div style={{ fontSize: "1.5em", marginBottom: "8px" }}>🍽️</div>
            <strong>Menu Management</strong>
            <p style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)", marginTop: "5px" }}>Add or edit menu items</p>
          </div>
        </div>
      </div>
      
      {/* Export Data */}
      <div className="card">
        <h3 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>📤 Export Data</h3>
        
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <button
            onClick={() => exportOrdersToCSV(orders)}
            className="secondary-btn"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            📊 Export Orders
          </button>
          
          <button
            onClick={() => exportInventoryToCSV(inventory, menuItems)}
            className="secondary-btn"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            📦 Export Inventory
          </button>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="card">
        <h3 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>Sales Trend (Last 7 Days)</h3>
        
        <Chart 
          data={(() => {
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
              const date = new Date();
              date.setDate(date.getDate() - i);
              const dayOrders = orders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate.toDateString() === date.toDateString() && order.status === 'Completed';
              });
              const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.revenue || 0), 0);
              last7Days.push({
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                value: dayRevenue
              });
            }
            return last7Days;
          })()} 
          type="line" 
          width={600} 
          height={200} 
        />
      </div>
      
      {/* Top Items Chart */}
      <div className="card">
        <h3 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>Top Selling Items</h3>
        
        <Chart 
          data={(() => {
            const itemSales = {};
            orders.filter(order => order.status === 'Completed').forEach(order => {
              order.items?.forEach(item => {
                itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity;
              });
            });
            return Object.entries(itemSales)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([name, quantity]) => ({ label: name, value: quantity }));
          })()} 
          type="bar" 
          width={600} 
          height={200} 
        />
      </div>

      {/* Daily Summary */}
      <DailySummary orders={orders} />
    </div>
  );
}

export default Dashboard;
