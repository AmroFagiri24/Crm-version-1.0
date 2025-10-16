import React, { useState } from "react";
import { formatCurrency } from "../utils/dataHelpers";

const InvoiceManagement = ({ orders, currentUser }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter completed orders
  const completedOrders = orders.filter(order => order.status === "Completed");

  const generateInvoice = (order) => {
    setSelectedOrder(order);
    // In a real app, this would generate a PDF or printable format
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const InvoicePrintView = ({ order }) => {
    if (!order) return null;

    const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
      <div id="invoice-print" style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "white",
        color: "black"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #333", paddingBottom: "20px" }}>
          <h1 style={{ margin: "0", color: "#333" }}>INVOICE</h1>
          <p style={{ margin: "5px 0", fontSize: "1.2em" }}>{currentUser?.restaurantName || "Restaurant Name"}</p>
          <p style={{ margin: "5px 0" }}>Invoice #{order.id}</p>
          <p style={{ margin: "5px 0" }}>Date: {new Date(order.date).toLocaleDateString()}</p>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h3 style={{ margin: "0 0 10px 0" }}>Bill To:</h3>
              <p style={{ margin: "5px 0" }}>{order.customerName || "Walk-in Customer"}</p>
              {order.customerPhone && <p style={{ margin: "5px 0" }}>Phone: {order.customerPhone}</p>}
              <p style={{ margin: "5px 0" }}>Table: {order.table}</p>
            </div>
            <div>
              <h3 style={{ margin: "0 0 10px 0" }}>Payment Details:</h3>
              <p style={{ margin: "5px 0" }}>Payment Method: {order.paymentMethod || "Cash"}</p>
              <p style={{ margin: "5px 0" }}>Status: Paid</p>
            </div>
          </div>
        </div>

        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "30px"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "left" }}>Item</th>
              <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>Qty</th>
              <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "right" }}>Price</th>
              <th style={{ border: "1px solid #ddd", padding: "12px", textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{item.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>{item.quantity}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "right" }}>{formatCurrency(item.price)}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "right" }}>{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ border: "1px solid #ddd", padding: "12px", textAlign: "right", fontWeight: "bold" }}>Total:</td>
              <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "right", fontWeight: "bold", fontSize: "1.2em" }}>{formatCurrency(total)}</td>
            </tr>
          </tfoot>
        </table>

        <div style={{ textAlign: "center", marginTop: "40px", fontSize: "0.9em", color: "#666" }}>
          <p>Thank you for your business!</p>
          <p>Generated on {new Date().toLocaleString()}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{
          color: "var(--clr-primary-brand)",
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>📄 Invoice Management</h2>
        <p style={{
          color: "var(--clr-text-secondary)",
          fontSize: "1.1em"
        }}>Generate and manage invoices for completed orders</p>
      </div>

      {selectedOrder && (
        <div style={{ marginBottom: "30px" }}>
          <InvoicePrintView order={selectedOrder} />
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                backgroundColor: "var(--clr-border)",
                color: "var(--clr-text-primary)",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}

      {completedOrders.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "var(--clr-bg-primary)",
          borderRadius: "12px",
          border: "2px dashed var(--clr-border)"
        }}>
          <div style={{ fontSize: "4em", marginBottom: "20px" }}>📄</div>
          <h3 style={{ color: "var(--clr-text-secondary)", marginBottom: "10px" }}>No Completed Orders</h3>
          <p style={{ color: "var(--clr-text-secondary)" }}>Completed orders will appear here for invoice generation.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px"
        }}>
          {completedOrders.map((order) => (
            <div key={order.id} className="card">
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <h3 style={{
                  margin: "0",
                  color: "var(--clr-text-primary)",
                  fontSize: "1.2em"
                }}>
                  Order #{order.id}
                </h3>
                <span style={{
                  backgroundColor: "var(--clr-success)",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.8em",
                  fontWeight: "600"
                }}>
                  Completed
                </span>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <p style={{
                  margin: "5px 0",
                  color: "var(--clr-text-secondary)",
                  fontSize: "0.9em"
                }}>
                  <strong>Table:</strong> {order.table}
                </p>
                {order.customerName && (
                  <p style={{
                    margin: "5px 0",
                    color: "var(--clr-text-secondary)",
                    fontSize: "0.9em"
                  }}>
                    <strong>Customer:</strong> {order.customerName}
                  </p>
                )}
                <p style={{
                  margin: "5px 0",
                  color: "var(--clr-text-secondary)",
                  fontSize: "0.9em"
                }}>
                  <strong>Completed:</strong> {new Date(order.dateClosed || order.date).toLocaleString()}
                </p>
                <p style={{
                  margin: "5px 0",
                  color: "var(--clr-text-secondary)",
                  fontSize: "0.9em"
                }}>
                  <strong>Payment:</strong> {order.paymentMethod || "Cash"}
                </p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <h4 style={{
                  margin: "0 0 10px 0",
                  color: "var(--clr-text-primary)",
                  fontSize: "1em"
                }}>
                  Items ({order.items.length}):
                </h4>
                <div style={{
                  maxHeight: "100px",
                  overflowY: "auto",
                  backgroundColor: "var(--clr-bg-primary)",
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "0.85em"
                }}>
                  {order.items.map((item, index) => (
                    <div key={index} style={{ marginBottom: "4px" }}>
                      {item.name} x{item.quantity} - {formatCurrency(item.price * item.quantity)}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "15px",
                borderTop: "1px solid var(--clr-border)"
              }}>
                <div style={{
                  fontSize: "1.1em",
                  fontWeight: "700",
                  color: "var(--clr-success)"
                }}>
                  Total: {formatCurrency(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                </div>
                <button
                  onClick={() => generateInvoice(order)}
                  style={{
                    backgroundColor: "var(--clr-primary-brand)",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "0.9em",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "var(--clr-primary-brand-hover)"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "var(--clr-primary-brand)"}
                >
                  📄 Generate Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;
