// src/components/NewOrderSection.jsx

import React, { useState, useEffect } from "react";
import { formatCurrency, getVATBreakdown, calculateAmountWithVAT } from "../utils/dataHelpers";

const NewOrderSection = ({ menuItems, onNewOrder }) => {
  // State for the new order being built
  const [currentOrder, setCurrentOrder] = useState({
    table: "",
    items: [], // Array of { id, name, price, quantity, cost }
  });
  const [tableInput, setTableInput] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [multiPayments, setMultiPayments] = useState([]);
  const [showMultiPayment, setShowMultiPayment] = useState(false);
  const [includeVAT, setIncludeVAT] = useState(true);


  // Helper function to calculate the total revenue and cost for the order
  const calculateTotals = (items) => {
    let revenue = 0;
    let cost = 0;
    items.forEach((item) => {
      revenue += item.price * item.quantity;
      cost += item.cost * item.quantity;
    });
    return { revenue, cost };
  };

  // 1. Adds or increases the quantity of a menu item in the current order
  const addItemToOrder = (menuItem) => {
    const existingItemIndex = currentOrder.items.findIndex(
      (item) => item.id === menuItem.id
    );

    let updatedItems;

    if (existingItemIndex > -1) {
      // Item already in order, increase quantity
      updatedItems = currentOrder.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Item not in order, add with quantity 1
      updatedItems = [
        ...currentOrder.items,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          cost: menuItem.cost, // Include cost for later profit calculation
        },
      ];
    }

    setCurrentOrder((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // 2. Removes an item from the order or decreases its quantity
  const removeItemFromOrder = (itemId) => {
    const existingItemIndex = currentOrder.items.findIndex(
      (item) => item.id === itemId
    );

    if (existingItemIndex === -1) return;

    let updatedItems = [];
    const itemToRemove = currentOrder.items[existingItemIndex];

    if (itemToRemove.quantity > 1) {
      // Decrease quantity if greater than 1
      updatedItems = currentOrder.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    } else {
      // Remove item entirely if quantity is 1
      updatedItems = currentOrder.items.filter(
        (item, index) => index !== existingItemIndex
      );
    }

    setCurrentOrder((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Print customer receipt
  const printCustomerReceipt = (orderData) => {
    const printWindow = window.open('', '_blank');
    
    const printContent = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              margin: 0; 
              padding: 10px; 
              max-width: 280px; 
              font-size: 12px;
              line-height: 1.3;
            }
            .header { 
              text-align: center; 
              border-bottom: 1px dashed #000; 
              padding-bottom: 8px; 
              margin-bottom: 10px; 
            }
            .company-name { 
              font-weight: bold; 
              font-size: 14px; 
              margin-bottom: 5px; 
            }
            .order-info { 
              margin-bottom: 10px; 
              font-size: 11px;
            }
            .items { 
              margin-bottom: 10px; 
            }
            .item-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 2px 0; 
            }
            .item-name { 
              flex: 1; 
              margin-right: 10px; 
            }
            .item-qty { 
              margin-right: 10px; 
              min-width: 20px; 
            }
            .item-price { 
              min-width: 60px; 
              text-align: right; 
            }
            .separator { 
              border-top: 1px dashed #000; 
              margin: 8px 0; 
            }
            .total-section { 
              border-top: 1px dashed #000; 
              padding-top: 8px; 
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              margin: 2px 0; 
            }
            .final-total { 
              font-weight: bold; 
              font-size: 13px; 
              border-top: 1px solid #000; 
              padding-top: 5px; 
              margin-top: 5px; 
            }
            .footer { 
              text-align: center; 
              margin-top: 15px; 
              font-size: 10px; 
              border-top: 1px dashed #000; 
              padding-top: 8px; 
            }
            @media print { 
              body { margin: 0; padding: 5px; } 
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header">
            <div class="company-name">EMPOROS NEXUS</div>
            <div>Order #${Date.now()}</div>
            <div>${new Date().toLocaleString()}</div>
          </div>
          
          <div class="order-info">
            <div>Table: ${orderData.table}</div>
            ${orderData.customerName ? `<div>Customer: ${orderData.customerName}</div>` : ''}
            ${orderData.customerPhone ? `<div>Phone: ${orderData.customerPhone}</div>` : ''}
            <div>Payment: ${orderData.paymentMethod.toUpperCase()}</div>
            <div>Status: ${orderData.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}</div>
          </div>
          
          <div class="separator"></div>
          
          <div class="items">
            ${orderData.items.map(item => `
              <div class="item-row">
                <div class="item-name">${item.name}</div>
                <div class="item-qty">${item.quantity}x</div>
                <div class="item-price">${formatCurrency(item.price * item.quantity)}</div>
              </div>
            `).join('')}
          </div>
          
          ${orderData.paymentMethod === 'multi' && orderData.multiPayments.length > 0 ? `
            <div class="separator"></div>
            <div style="margin-bottom: 10px; font-size: 11px;">
              <div style="font-weight: bold; margin-bottom: 5px;">PAYMENT BREAKDOWN:</div>
              ${orderData.multiPayments.map(payment => `
                <div class="total-row">
                  <span>${payment.method.toUpperCase()}</span>
                  <span>${formatCurrency(payment.amount)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="total-section">
            ${orderData.includeVAT ? `
              <div class="total-row">
                <span>Subtotal</span>
                <span>${formatCurrency(orderData.baseRevenue)}</span>
              </div>
              <div class="total-row">
                <span>VAT (18%)</span>
                <span>${formatCurrency(orderData.vatAmount)}</span>
              </div>
            ` : ''}
            <div class="total-row final-total">
              <span>TOTAL</span>
              <span>${formatCurrency(orderData.revenue)}</span>
            </div>
          </div>
          
          <div class="footer">
            <div>Thank you for your order!</div>
            <div>Keep this receipt</div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // 3. Submits the new order
  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!tableInput || currentOrder.items.length === 0) {
      return;
    }

    if (!paymentMethod || !paymentStatus) {
      return;
    }

    if (paymentMethod === "multi" && multiPayments.length === 0) {
      return;
    }

    const { revenue: baseRevenue, cost } = calculateTotals(currentOrder.items);
    const finalRevenue = includeVAT ? calculateAmountWithVAT(baseRevenue) : baseRevenue;
    const vatAmount = includeVAT ? finalRevenue - baseRevenue : 0;

    const newOrderData = {
      table: tableInput,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      multiPayments: paymentMethod === "multi" ? multiPayments : [],
      items: currentOrder.items,
      revenue: finalRevenue,
      baseRevenue: baseRevenue,
      vatAmount: vatAmount,
      includeVAT: includeVAT,
      cost: cost,
      profit: finalRevenue - cost,
      date: new Date().toISOString(),
      status: "New", // Orders start as "New" and appear in kitchen
      locationId: null, // Will be set by parent component
    };

    // Print customer receipt
    printCustomerReceipt(newOrderData);

    onNewOrder(newOrderData); // Call the main App function to add the order

    // Reset the form
    setCurrentOrder({ table: "", items: [] });
    setTableInput("");
    setCustomerName("");
    setCustomerPhone("");
    setPaymentMethod("cash");
    setPaymentStatus("paid");
    setMultiPayments([]);
    setShowMultiPayment(false);
    setIncludeVAT(true);
  };

  // Calculate totals for display
  const { revenue: baseRevenue } = calculateTotals(currentOrder.items);
  const vatBreakdown = getVATBreakdown(baseRevenue);
  const currentRevenue = includeVAT ? vatBreakdown.total : baseRevenue;

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>🛒 Create New Order</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Select items from the menu and build your order</p>
      </div>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: window.innerWidth <= 1024 ? "1fr" : "1fr 400px",
        gap: "20px",
        alignItems: "start"
      }}>
        {/* Left Column: Menu Items */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>Available Menu Items</h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth <= 1024 ? "repeat(auto-fill, minmax(250px, 1fr))" : "repeat(auto-fill, minmax(200px, 1fr))",
            gap: window.innerWidth <= 1024 ? "20px" : "15px"
          }}>
            {menuItems.length === 0 ? (
              <div style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px 20px",
                backgroundColor: "var(--clr-bg-primary)",
                borderRadius: "8px",
                border: "2px dashed var(--clr-border)"
              }}>
                <div style={{ fontSize: "3em", marginBottom: "15px" }}>🍽️</div>
                <p style={{ color: "var(--clr-text-secondary)" }}>No menu items available.<br/>Please add some in Menu Management.</p>
              </div>
            ) : (
              menuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addItemToOrder(item)}
                  style={{
                    backgroundColor: "var(--clr-bg-secondary)",
                    border: "2px solid var(--clr-border)",
                    borderRadius: "12px",
                    padding: "15px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.borderColor = "var(--clr-primary-brand)";
                    e.target.style.boxShadow = "0 6px 20px rgba(52, 152, 219, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.borderColor = "var(--clr-border)";
                    e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                  }}
                >
                  <h4 style={{ 
                    margin: "0 0 8px 0", 
                    color: "var(--clr-text-primary)",
                    fontSize: "1.1em"
                  }}>{item.name}</h4>
                  <p style={{ 
                    margin: "0 0 12px 0", 
                    color: "var(--clr-success)", 
                    fontSize: "1.2em",
                    fontWeight: "600"
                  }}>{formatCurrency(item.price)}</p>
                  <div style={{
                    backgroundColor: "var(--clr-primary-brand)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.85em",
                    fontWeight: "600",
                    display: "inline-block"
                  }}>+ ADD TO ORDER</div>
                </div>
              ))
            )}
          </div>
      </div>

        {/* Right Column: Order Form */}
        <div className="card" style={{
          position: window.innerWidth <= 1024 ? "relative" : "sticky",
          top: window.innerWidth <= 1024 ? "0" : "20px",
          maxHeight: window.innerWidth <= 1024 ? "none" : "calc(100vh - 40px)",
          overflowY: window.innerWidth <= 1024 ? "visible" : "auto"
        }}>
          <form onSubmit={handleSubmitOrder}>
            <h3 style={{ 
              color: "var(--clr-success)", 
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>📋 Order Summary</h3>
          <div className="form-group">
            <label htmlFor="tableId">Table/Order ID</label>
            <input
              id="tableId"
              type="text"
              placeholder="e.g., T4, Delivery #101"
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Customer Name (Optional)</label>
            <input
              type="text"
              placeholder="Customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number (Optional)</label>
            <input
              type="tel"
              placeholder="Phone number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                if (e.target.value === "multi") {
                  setShowMultiPayment(true);
                } else {
                  setShowMultiPayment(false);
                  setMultiPayments([]);
                }
              }}
            >
              <option value="cash">💵 Cash</option>
              <option value="credit">💳 Credit Card</option>
              <option value="mobile">📱 Mobile Money</option>
              <option value="multi">🔄 Multi Payment</option>
            </select>
          </div>

          <div className="form-group">
            <label>Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="paid">✅ Paid</option>
              <option value="pending">⏳ Pending Payment</option>
            </select>
          </div>

          {showMultiPayment && (
            <div style={{
              backgroundColor: "var(--clr-bg-primary)",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "15px"
            }}>
              <h4 style={{ margin: "0 0 10px 0", color: "var(--clr-text-primary)" }}>Multi Payment Setup</h4>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <select 
                  id="multiPaymentMethod"
                  style={{ flex: "1", padding: "8px" }}
                >
                  <option value="cash">💵 Cash</option>
                  <option value="credit">💳 Credit Card</option>
                  <option value="mobile">📱 Mobile Money</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Amount"
                  id="multiPaymentAmount"
                  style={{ flex: "1", padding: "8px" }}
                  step="0.01"
                />
                <button
                  type="button"
                  onClick={() => {
                    const method = document.getElementById('multiPaymentMethod').value;
                    const amount = parseFloat(document.getElementById('multiPaymentAmount').value);
                    if (amount > 0) {
                      setMultiPayments(prev => [...prev, { method, amount }]);
                      document.getElementById('multiPaymentAmount').value = '';
                    }
                  }}
                  style={{
                    backgroundColor: "var(--clr-primary-brand)",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Add
                </button>
              </div>
              {multiPayments.length > 0 && (
                <div>
                  <p style={{ margin: "5px 0", fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>Payment Breakdown:</p>
                  {multiPayments.map((payment, index) => (
                    <div key={index} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "5px 10px",
                      backgroundColor: "var(--clr-bg-secondary)",
                      borderRadius: "4px",
                      marginBottom: "5px"
                    }}>
                      <span>{payment.method === 'cash' ? '💵' : payment.method === 'credit' ? '💳' : '📱'} {payment.method}</span>
                      <span>{formatCurrency(payment.amount)}</span>
                      <button
                        type="button"
                        onClick={() => setMultiPayments(prev => prev.filter((_, i) => i !== index))}
                        style={{
                          backgroundColor: "var(--clr-danger)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          fontSize: "0.8em"
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div style={{
                    marginTop: "10px",
                    padding: "8px",
                    backgroundColor: multiPayments.reduce((sum, p) => sum + p.amount, 0) >= currentRevenue ? "var(--clr-success)" : "var(--clr-danger)",
                    color: "white",
                    borderRadius: "4px",
                    textAlign: "center",
                    fontSize: "0.9em"
                  }}>
                    Total Paid: {formatCurrency(multiPayments.reduce((sum, p) => sum + p.amount, 0))} / {formatCurrency(currentRevenue)}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={includeVAT}
                onChange={(e) => setIncludeVAT(e.target.checked)}
                style={{ transform: "scale(1.2)" }}
              />
              Include VAT (18%)
            </label>
          </div>

          {includeVAT && (
            <div style={{
              backgroundColor: "var(--clr-bg-primary)",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "0.9em"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(vatBreakdown.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span>VAT (18%):</span>
                <span>{formatCurrency(vatBreakdown.vatAmount)}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                borderTop: "1px solid var(--clr-border)",
                paddingTop: "3px"
              }}>
                <span>Total with VAT:</span>
                <span>{formatCurrency(vatBreakdown.total)}</span>
              </div>
            </div>
          )}

            <div style={{
              backgroundColor: "var(--clr-bg-primary)",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px"
            }}>
              <h4 style={{ 
                margin: "0 0 15px 0", 
                color: "var(--clr-text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                📝 Items Added 
                <span style={{
                  backgroundColor: "var(--clr-primary-brand)",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.8em"
                }}>({currentOrder.items.length})</span>
              </h4>
              
              {currentOrder.items.length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "20px",
                  color: "var(--clr-text-secondary)",
                  fontStyle: "italic"
                }}>
                  👆 Click on a menu item to add it to the order
                </div>
              ) : (
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {currentOrder.items.map((item) => (
                    <div key={item.id} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px",
                      backgroundColor: "var(--clr-bg-secondary)",
                      borderRadius: "6px",
                      marginBottom: "8px",
                      border: "1px solid var(--clr-border)"
                    }}>
                      <div style={{ flex: "1" }}>
                        <div style={{ fontWeight: "600", color: "var(--clr-text-primary)" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                          {formatCurrency(item.price)} each
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px",
                        marginLeft: "10px"
                      }}>
                        <button
                          type="button"
                          onClick={() => removeItemFromOrder(item.id)}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: "var(--clr-danger)",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "0.8em",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          -
                        </button>
                        
                        <span style={{
                          minWidth: "20px",
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "1.1em"
                        }}>{item.quantity}</span>
                        
                        <button
                          type="button"
                          onClick={() => addItemToOrder(item)}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: "var(--clr-success)",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "0.8em",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          +
                        </button>
                        
                        <div style={{
                          marginLeft: "10px",
                          fontWeight: "600",
                          color: "var(--clr-success)",
                          minWidth: "60px",
                          textAlign: "right"
                        }}>
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{
              padding: "15px",
              backgroundColor: "var(--clr-success)",
              color: "white",
              borderRadius: "8px",
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "1.3em",
              fontWeight: "700"
            }}>
              💰 Total: {formatCurrency(currentRevenue)}
            </div>

            <button
              type="submit"
              disabled={currentOrder.items.length === 0 || !tableInput || !paymentMethod || !paymentStatus}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: (currentOrder.items.length === 0 || !tableInput || !paymentMethod || !paymentStatus) ? "var(--clr-border)" : "var(--clr-primary-brand)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1em",
                fontWeight: "600",
                cursor: (currentOrder.items.length === 0 || !tableInput || !paymentMethod || !paymentStatus) ? "not-allowed" : "pointer",
                transition: "all 0.3s ease"
              }}
            >
              {!paymentMethod || !paymentStatus ? "⚠️ Select Payment Status" : "🚀 Submit Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewOrderSection;
