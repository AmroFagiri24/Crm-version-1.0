// src/components/MenuManagement.jsx

import React from "react";
import AddMenuItemForm from "./AddMenuItemForm";
import { formatCurrency } from "../utils/dataHelpers";

function MenuManagement({ menuItems, onAddMenuItem, onEditMenuItem, onDeleteMenuItem }) {
  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>🍽️ Menu Management</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Add, edit, and manage your menu items</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Left Side: Add Form */}
        <div style={{ position: "sticky", top: "20px" }}>
          <AddMenuItemForm onAddMenuItem={onAddMenuItem} />
        </div>

        {/* Right Side: Menu List */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            📋 Current Menu 
            <span style={{
              backgroundColor: "var(--clr-primary-brand)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.8em",
              fontWeight: "600"
            }}>({menuItems.length} items)</span>
          </h3>

          {menuItems.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px",
              backgroundColor: "var(--clr-bg-primary)",
              borderRadius: "8px",
              border: "2px dashed var(--clr-border)"
            }}>
              <div style={{ fontSize: "3em", marginBottom: "15px" }}>🍽️</div>
              <p style={{ color: "var(--clr-text-secondary)", fontSize: "1.1em" }}>
                No menu items added yet.<br/>
                Create your first menu item to get started!
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px"
            }}>
              {menuItems.map((item) => (
                <div key={item.id} style={{
                  backgroundColor: "var(--clr-bg-primary)",
                  border: "2px solid var(--clr-border)",
                  borderRadius: "12px",
                  padding: "20px",
                  transition: "all 0.3s ease",
                  position: "relative"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "15px"
                  }}>
                    <h4 style={{
                      margin: "0",
                      color: "var(--clr-text-primary)",
                      fontSize: "1.2em",
                      fontWeight: "600",
                      flex: "1",
                      marginRight: "10px"
                    }}>{item.name}</h4>
                    
                    <button
                      onClick={() => onDeleteMenuItem(item.id)}
                      style={{
                        backgroundColor: "var(--clr-danger)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        fontSize: "0.8em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.1)";
                        e.target.style.backgroundColor = "#c0392b";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.backgroundColor = "var(--clr-danger)";
                      }}
                      title="Delete item"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "15px"
                  }}>
                    <span style={{ 
                      color: "var(--clr-text-secondary)",
                      fontSize: "0.9em"
                    }}>Price:</span>
                    <span style={{
                      fontSize: "1.4em",
                      fontWeight: "700",
                      color: "var(--clr-success)"
                    }}>{formatCurrency(item.price)}</span>
                  </div>
                  
                  {item.cost && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px"
                    }}>
                      <span style={{ 
                        color: "var(--clr-text-secondary)",
                        fontSize: "0.9em"
                      }}>Cost:</span>
                      <span style={{
                        fontSize: "1.1em",
                        fontWeight: "600",
                        color: "var(--clr-text-secondary)"
                      }}>{formatCurrency(item.cost)}</span>
                    </div>
                  )}
                  
                  <div style={{
                    marginTop: "15px",
                    paddingTop: "15px",
                    borderTop: "1px solid var(--clr-border)",
                    fontSize: "0.85em",
                    color: "var(--clr-text-secondary)"
                  }}>
                    ID: #{item.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuManagement;
