// src/components/Invoice.jsx

import React from "react";
import { formatCurrency } from "../utils/dataHelpers";

const Invoice = ({ order, onClose, onPrint, restaurantName }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  return (
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
      <div style={{
        backgroundColor: "white",
        padding: "10px",
        width: "300px",
        maxWidth: "90vw",
        maxHeight: "90vh",
        overflowY: "auto",
        fontFamily: "monospace",
        fontSize: "12px",
        lineHeight: "1.2",
        color: "black",
        border: "1px solid #ccc"
      }}>
        {/* Invoice Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "10px",
          paddingBottom: "5px",
          borderBottom: "1px dashed black"
        }}>
          <div style={{
            fontSize: "14px",
            fontWeight: "bold",
            margin: "0 0 2px 0"
          }}>{(restaurantName || "Restaurant").toUpperCase()}</div>
          <div style={{
            fontSize: "12px",
            margin: "0 0 2px 0"
          }}>KITCHEN ORDER</div>
          <div style={{
            fontSize: "12px",
            margin: "0"
          }}>Order #{order.id}</div>
        </div>

        {/* Order Details */}
        <div style={{ marginBottom: "10px" }}>
          <div style={{ marginBottom: "5px" }}>
            <span>Table: {order.table}</span>
          </div>
          <div style={{ marginBottom: "5px" }}>
            <span>Time: {new Date(order.date).toLocaleTimeString()}</span>
          </div>
          {order.customerName && (
            <div style={{ marginBottom: "5px" }}>
              <span>Customer: {order.customerName}</span>
            </div>
          )}
          <div style={{ marginBottom: "5px" }}>
            <span>Payment: {order.paymentMethod === 'cash' ? 'CASH' : 
                           order.paymentMethod === 'credit' ? 'CARD' : 
                           order.paymentMethod === 'mobile' ? 'MOBILE' : 'MULTI'}</span>
          </div>
          <div style={{ marginBottom: "5px" }}>
            <span>Status: {order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}</span>
          </div>
        </div>

        {/* Items List */}
        <div style={{ marginBottom: "10px" }}>
          <div style={{
            borderTop: "1px dashed black",
            borderBottom: "1px dashed black",
            padding: "5px 0",
            marginBottom: "5px"
          }}>
            <div style={{ fontWeight: "bold", textAlign: "center" }}>ITEMS TO PREPARE</div>
          </div>
          
          {order.items.map((item, index) => (
            <div key={index} style={{
              marginBottom: "3px",
              paddingBottom: "3px",
              borderBottom: index < order.items.length - 1 ? "1px dotted #ccc" : "none"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between"
              }}>
                <span style={{ fontWeight: "bold" }}>{item.name}</span>
                <span>x{item.quantity}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px"
              }}>
                <span>{formatCurrency(item.price)} each</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Multi Payment Details */}
        {order.paymentMethod === 'multi' && order.multiPayments && order.multiPayments.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <div style={{
              borderTop: "1px dashed black",
              padding: "5px 0",
              marginBottom: "5px"
            }}>
              <div style={{ fontWeight: "bold", fontSize: "11px" }}>PAYMENT BREAKDOWN:</div>
            </div>
            {order.multiPayments.map((payment, index) => (
              <div key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                marginBottom: "2px"
              }}>
                <span>{payment.method.toUpperCase()}</span>
                <span>{formatCurrency(payment.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Total with VAT breakdown */}
        <div style={{
          borderTop: "1px dashed black",
          padding: "5px 0",
          marginBottom: "5px"
        }}>
          {order.includeVAT && order.baseRevenue ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(order.baseRevenue)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                <span>VAT (18%):</span>
                <span>{formatCurrency(order.vatAmount || 0)}</span>
              </div>
              <div style={{
                borderTop: "1px solid black",
                paddingTop: "3px",
                marginTop: "3px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}>
                  <span>TOTAL:</span>
                  <span>{formatCurrency(order.revenue)}</span>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "14px"
            }}>
              TOTAL: {formatCurrency(order.revenue || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          fontSize: "11px",
          marginBottom: "10px",
          borderTop: "1px dashed black",
          paddingTop: "5px"
        }}>
          <div>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
          <div>Thank you!</div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center"
        }}>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: "#333",
              color: "white",
              border: "none",
              padding: "8px 16px",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Print
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#666",
              color: "white",
              border: "none",
              padding: "8px 16px",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;