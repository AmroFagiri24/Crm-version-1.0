// src/components/OrderListSection.jsx

import React, { useState } from "react";
import { formatCurrency } from "../utils/dataHelpers"; // Import formatCurrency utility

function OrderListSection({ orders, onCompleteOrder, onCancelOrder, onDeleteOrder, currentUser }) {
  
  const printInvoice = (order) => {
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt #${order.id}</title>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body { 
            font-family: 'Courier New', monospace; 
            font-size: 12px;
            line-height: 1.2;
            margin: 0;
            padding: 5mm;
            width: 70mm;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .header { 
            text-align: center; 
            margin-bottom: 10px;
            border-bottom: 1px dashed #000;
            padding-bottom: 5px;
          }
          .restaurant-name { 
            font-size: 16px; 
            font-weight: bold; 
          }
          .info-line { 
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
          }
          .items { 
            margin: 10px 0;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            padding: 5px 0;
          }
          .item-line { 
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
          }
          .total-line { 
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 14px;
            margin: 5px 0;
            border-top: 1px dashed #000;
            padding-top: 5px;
          }
          .footer { 
            text-align: center;
            margin-top: 10px;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="restaurant-name">${currentUser?.restaurantName || 'RESTAURANT'}</div>
          <div>RECEIPT</div>
        </div>
        
        <div class="info-line">
          <span>Receipt #:</span>
          <span>${order.id}</span>
        </div>
        <div class="info-line">
          <span>Date:</span>
          <span>${new Date(order.date).toLocaleDateString()}</span>
        </div>
        <div class="info-line">
          <span>Table:</span>
          <span>${order.table || 'N/A'}</span>
        </div>
        
        <div class="items">
          ${order.items.map(item => `
            <div class="item-line">
              <span>${item.name}</span>
              <span>${item.quantity}x${(item.price || 0).toLocaleString()}</span>
            </div>
            <div class="item-line">
              <span></span>
              <span class="bold">${((item.quantity || 0) * (item.price || 0)).toLocaleString()} RWF</span>
            </div>
          `).join('')}
        </div>
        
        <div class="total-line">
          <span>TOTAL:</span>
          <span>${(order.total || order.revenue || 0).toLocaleString()} RWF</span>
        </div>
        
        <div class="footer">
          <div>Thank you!</div>
          <div>${new Date().toLocaleString()}</div>
        </div>
        
        <script>
          setTimeout(function() {
            window.print();
          }, 500);
        </script>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=300,height=600');
    printWindow.document.open();
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerPhone && order.customerPhone.includes(searchTerm));
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Separate filtered orders
  const open = filteredOrders
    .filter((o) => o.status === "New" || o.status === "In Preparation" || o.status === "Ready for Pickup")
    .sort((a, b) => a.id - b.id);
  const history = filteredOrders
    .filter((o) => o.status === "Completed" || o.status === "Cancelled")
    .sort((a, b) => b.id - a.id)
    .slice(0, 20);

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>📋 Order Management</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Track and manage all customer orders</p>
      </div>
      
      {/* Search and Filter */}
      <div className="card">
        <h3 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "20px"
        }}>🔍 Search & Filter Orders</h3>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 200px", 
          gap: "15px",
          marginBottom: "10px"
        }}>
          <div className="form-group" style={{ margin: 0 }}>
            <input
              type="text"
              placeholder="Search by table, customer name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="form-group" style={{ margin: 0 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="New">New</option>
              <option value="In Preparation">In Preparation</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <p style={{ 
          fontSize: "0.9em", 
          color: "var(--clr-text-secondary)",
          margin: 0
        }}>Found {filteredOrders.length} orders</p>
      </div>

      {/* OPEN ORDERS */}
      <div className="card">
        <h2 style={{ 
          color: "var(--clr-success)", 
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          🟢 Open Orders 
          <span style={{
            backgroundColor: "var(--clr-success)",
            color: "white",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "0.8em",
            fontWeight: "600"
          }}>({open.length})</span>
        </h2>
        <div className="order-grid">
          {open.length === 0 ? (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "15px 0",
              }}
            >
              No open orders at this time.
            </p>
          ) : (
            open.map((order) => {
              const orderDate = new Date(order.date);
              return (
                <div key={order.id} className="order-card" style={{
                  background: "var(--clr-bg-secondary)",
                  border: "2px solid var(--clr-success)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 4px 15px rgba(46, 204, 113, 0.1)",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginBottom: "15px"
                  }}>
                    <h4 style={{ 
                      color: "var(--clr-primary-brand)",
                      margin: "0",
                      fontSize: "1.2em"
                    }}>🍽️ Table {order.table}</h4>
                    <span className="status-badge status-open">OPEN</span>
                  </div>
                  
                  <div style={{ marginBottom: "15px" }}>
                    <p style={{ 
                      margin: "5px 0", 
                      color: "var(--clr-text-secondary)",
                      fontSize: "0.95em"
                    }}>⏰ {orderDate.toLocaleTimeString()}</p>
                    <p style={{ 
                      margin: "5px 0",
                      fontSize: "1.1em",
                      fontWeight: "600"
                    }}>
                      💰 Total: <span style={{ color: "var(--clr-success)" }}>{formatCurrency(order.revenue)}</span>
                    </p>
                  </div>
                  
                  <div style={{
                    backgroundColor: "var(--clr-bg-primary)",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "15px"
                  }}>
                    <h5 style={{ 
                      margin: "0 0 8px 0", 
                      color: "var(--clr-text-primary)",
                      fontSize: "0.9em"
                    }}>📝 Order Items:</h5>
                    <ul className="simple-list" style={{ margin: "0" }}>
                      {order.items.map((item, index) => (
                        <li key={index} style={{
                          padding: "3px 0",
                          borderBottom: index < order.items.length - 1 ? "1px solid var(--clr-border)" : "none"
                        }}>
                          <strong>{item.name}</strong> × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div style={{ 
                    display: "flex", 
                    gap: "8px",
                    marginTop: "15px" 
                  }}>
                    <button
                      className="action-btn complete-btn"
                      onClick={() => onCompleteOrder(order.id)}
                      style={{ flex: "1" }}
                    >
                      ✅ Close Order
                    </button>
                    <button
                      className="action-btn primary-btn"
                      onClick={() => printInvoice(order)}
                      style={{ flex: "0.7" }}
                    >
                      🖨️ Print
                    </button>
                    <button
                      className="action-btn cancel-btn"
                      onClick={() => onCancelOrder(order.id)}
                      style={{ flex: "1" }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ORDER HISTORY */}
      <div className="card">
        <h3 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>📊 Order History (Last 10)</h3>
        <table>
          <thead>
            <tr>
              <th>ID/Table</th>
              <th>Date</th>
              <th>Revenue</th>
              <th>Profit</th> {/* Optional: show profit after close */}
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((order) => {
              const orderDate = new Date(order.date);
              const statusColor =
                order.status === "Closed" ? "#2ecc71" : "#e74c3c";
              return (
                <tr key={order.id}>
                  <td>{order.table}</td>
                  <td>{orderDate.toLocaleDateString()}</td>
                  <td>{formatCurrency(order.revenue)}</td>
                  <td>{formatCurrency(order.profit || 0)}</td>
                  <td>
                    <span className={`status-badge ${
                      order.status === "Closed" ? "status-closed" : "status-cancelled"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        className="action-btn primary-btn"
                        onClick={() => printInvoice(order)}
                        style={{ fontSize: "0.8em", padding: "4px 8px" }}
                      >
                        🖨️ Print
                      </button>
                      <button
                        className="action-btn cancel-btn"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this order?')) {
                            onDeleteOrder(order.id);
                          }
                        }}
                        style={{ fontSize: "0.8em", padding: "4px 8px" }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {history.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No historical orders available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderListSection;
