// src/components/InventorySection.jsx

import React, { useState } from "react";
import { formatCurrency } from "../utils/dataHelpers";

function InventorySection({ inventory, onRecordPurchase, onDeleteInventoryBatch, menuItems }) {
  const [itemType, setItemType] = useState("menu_item");
  const [menuItemId, setMenuItemId] = useState("");
  const [rawMaterialName, setRawMaterialName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");

  const handleAddStock = (e) => {
    e.preventDefault();
    if (!quantity || !unitCost) {
      alert("Please fill in all fields");
      return;
    }

    if (itemType === "menu_item" && !menuItemId) {
      alert("Please select a menu item");
      return;
    }

    if (itemType === "raw_material" && !rawMaterialName.trim()) {
      alert("Please enter raw material name");
      return;
    }

    const newPurchase = {
      itemType: itemType,
      menuItemId: itemType === "menu_item" ? parseInt(menuItemId) : null,
      rawMaterialName: itemType === "raw_material" ? rawMaterialName.trim() : null,
      quantity: parseInt(quantity),
      unitCost: parseFloat(unitCost),
    };
    
    onRecordPurchase(newPurchase);

    // Reset form
    setItemType("menu_item");
    setMenuItemId("");
    setRawMaterialName("");
    setQuantity("");
    setUnitCost("");
  };

  // Calculate total inventory value
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>📋 Inventory Management</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Track and manage your stock levels</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Left Side: Add Stock Form */}
        <div className="card" style={{ position: "sticky", top: "20px" }}>
          <h3 style={{ 
            color: "var(--clr-success)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>📦 Record New Purchase</h3>
          
          <form onSubmit={handleAddStock}>
            <div className="form-group">
              <label>Item Type</label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
              >
                <option value="menu_item">🍽️ Menu Item</option>
                <option value="raw_material">📦 Raw Material</option>
              </select>
            </div>
            
            {itemType === "menu_item" ? (
              <div className="form-group">
                <label>Menu Item</label>
                <select
                  value={menuItemId}
                  onChange={(e) => setMenuItemId(e.target.value)}
                  required
                >
                  <option value="">Select a menu item</option>
                  {menuItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({formatCurrency(item.price)})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="form-group">
                <label>Raw Material Name</label>
                <input
                  type="text"
                  value={rawMaterialName}
                  onChange={(e) => setRawMaterialName(e.target.value)}
                  placeholder="e.g., Beef (5kg), Tomatoes (2kg)"
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Quantity Purchased</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Unit Cost (RWF)</label>
              <input
                type="number"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                placeholder="0.00"
                min="0"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="primary-btn"
              style={{ width: "100%", marginTop: "10px" }}
            >
              📦 Record Purchase
            </button>
          </form>
          
          {/* Total Value Summary */}
          <div style={{
            marginTop: "25px",
            padding: "15px",
            backgroundColor: "var(--clr-bg-primary)",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <h4 style={{ 
              margin: "0 0 8px 0", 
              color: "var(--clr-text-primary)",
              fontSize: "0.9em"
            }}>Total Inventory Value</h4>
            <div style={{
              fontSize: "1.8em",
              fontWeight: "700",
              color: "var(--clr-success)"
            }}>
              {formatCurrency(totalValue)}
            </div>
          </div>
        </div>

        {/* Right Side: Stock Tracking and Inventory List */}
        <div>
          {/* Stock Summary */}
          <div className="card" style={{ marginBottom: "20px" }}>
            <h3 style={{
              color: "var(--clr-primary-brand)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              📈 Stock Levels
              <span style={{
                backgroundColor: "var(--clr-primary-brand)",
                color: "white",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.8em",
                fontWeight: "600"
              }}>
                Real-time Tracking
              </span>
            </h3>

            {(() => {
              // Group inventory by item
              const stockSummary = {};
              inventory.forEach(batch => {
                let key, name, type;
                if (batch.itemType === "raw_material") {
                  key = `raw_${batch.rawMaterialName}`;
                  name = batch.rawMaterialName;
                  type = "Raw Material";
                } else {
                  key = `menu_${batch.menuItemId}`;
                  const menuItem = menuItems.find(item => item.id === batch.menuItemId);
                  name = menuItem ? menuItem.name : `Item #${batch.menuItemId}`;
                  type = "Menu Item";
                }

                if (!stockSummary[key]) {
                  stockSummary[key] = {
                    name,
                    type,
                    totalQuantity: 0,
                    totalValue: 0,
                    batches: 0,
                    lastUpdated: batch.date
                  };
                }
                stockSummary[key].totalQuantity += batch.quantity;
                stockSummary[key].totalValue += batch.quantity * batch.unitCost;
                stockSummary[key].batches += 1;
                if (new Date(batch.date) > new Date(stockSummary[key].lastUpdated)) {
                  stockSummary[key].lastUpdated = batch.date;
                }
              });

              const stockItems = Object.values(stockSummary);

              return stockItems.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  backgroundColor: "var(--clr-bg-primary)",
                  borderRadius: "8px",
                  border: "2px dashed var(--clr-border)"
                }}>
                  <div style={{ fontSize: "2em", marginBottom: "10px" }}>📊</div>
                  <p style={{ color: "var(--clr-text-secondary)" }}>
                    No stock data available yet.
                  </p>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "15px"
                }}>
                  {stockItems.map((item, index) => {
                    const isLowStock = item.totalQuantity < 10;
                    const isCritical = item.totalQuantity < 5;
                    let stockColor = "var(--clr-success)";
                    let stockStatus = "Good";
                    if (isCritical) {
                      stockColor = "var(--clr-danger)";
                      stockStatus = "Critical";
                    } else if (isLowStock) {
                      stockColor = "var(--clr-warning)";
                      stockStatus = "Low";
                    }

                    return (
                      <div key={index} style={{
                        backgroundColor: "var(--clr-bg-primary)",
                        border: `2px solid ${stockColor}`,
                        borderRadius: "12px",
                        padding: "15px",
                        textAlign: "center"
                      }}>
                        <h4 style={{
                          margin: "0 0 10px 0",
                          color: "var(--clr-text-primary)",
                          fontSize: "1.1em"
                        }}>
                          {item.name}
                        </h4>
                        <div style={{
                          fontSize: "2em",
                          fontWeight: "700",
                          color: stockColor,
                          marginBottom: "8px"
                        }}>
                          {item.totalQuantity}
                        </div>
                        <div style={{
                          backgroundColor: stockColor,
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "0.8em",
                          fontWeight: "600",
                          display: "inline-block",
                          marginBottom: "8px"
                        }}>
                          {stockStatus}
                        </div>
                        <p style={{
                          margin: "5px 0",
                          color: "var(--clr-text-secondary)",
                          fontSize: "0.9em"
                        }}>
                          {item.type} • {item.batches} batch(es)
                        </p>
                        <p style={{
                          margin: "5px 0",
                          color: "var(--clr-success)",
                          fontSize: "0.9em",
                          fontWeight: "600"
                        }}>
                          Value: {formatCurrency(item.totalValue)}
                        </p>
                        {isLowStock && (
                          <div style={{
                            backgroundColor: "var(--clr-danger)",
                            color: "white",
                            padding: "6px",
                            borderRadius: "6px",
                            fontSize: "0.8em",
                            fontWeight: "600",
                            marginTop: "10px"
                          }}>
                            ⚠️ Low Stock Alert!
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Detailed Inventory Batches */}
          <div className="card">
            <h3 style={{
              color: "var(--clr-primary-brand)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              📦 Inventory Batches
              <span style={{
                backgroundColor: "var(--clr-primary-brand)",
                color: "white",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.8em",
                fontWeight: "600"
              }}>({inventory.length})</span>
            </h3>

            {inventory.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "var(--clr-bg-primary)",
                borderRadius: "8px",
                border: "2px dashed var(--clr-border)"
              }}>
                <div style={{ fontSize: "3em", marginBottom: "15px" }}>📦</div>
                <p style={{ color: "var(--clr-text-secondary)", fontSize: "1.1em" }}>
                  No inventory batches recorded yet.<br/>
                  Start by recording your first purchase!
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Unit Cost</th>
                      <th>Total Value</th>
                      <th>Date Added</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((batch) => {
                      const batchDate = new Date(batch.date);
                      let itemName, itemType;

                      if (batch.itemType === "raw_material") {
                        itemName = batch.rawMaterialName;
                        itemType = "📦 Raw Material";
                      } else {
                        const menuItem = menuItems.find(item => item.id === batch.menuItemId);
                        itemName = menuItem ? menuItem.name : `Item #${batch.menuItemId}`;
                        itemType = "🍽️ Menu Item";
                      }

                      return (
                        <tr key={batch.id}>
                          <td style={{ fontWeight: "600" }}>{itemName}</td>
                          <td>
                            <span style={{
                              backgroundColor: batch.itemType === "raw_material" ? "var(--clr-primary-brand)" : "var(--clr-success)",
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "8px",
                              fontSize: "0.75em",
                              fontWeight: "600"
                            }}>
                              {itemType}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              backgroundColor: batch.quantity > 10 ? "var(--clr-success)" : "var(--clr-danger)",
                              color: "white",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "0.85em",
                              fontWeight: "600"
                            }}>
                              {batch.quantity}
                            </span>
                          </td>
                          <td>{formatCurrency(batch.unitCost)}</td>
                          <td style={{ fontWeight: "600", color: "var(--clr-success)" }}>
                            {formatCurrency(batch.quantity * batch.unitCost)}
                          </td>
                          <td style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                            {batchDate.toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              onClick={() => onDeleteInventoryBatch(batch.id)}
                              className="cancel-btn"
                              style={{
                                padding: "4px 8px",
                                fontSize: "0.8em",
                                borderRadius: "4px"
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventorySection;
