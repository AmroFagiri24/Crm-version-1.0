import React from "react";
import { formatCurrency } from "../utils/dataHelpers";

const KitchenOrderQueue = ({ orders, onCompleteOrder, onKitchenStatusChange, currentUser }) => {
  
  // Filter orders that are ready for kitchen or in preparation
  const kitchenOrders = orders.filter(order => 
    order.status === "New" ||
    order.status === "In Preparation" ||
    order.status === "Ready for Pickup"
  );



  const handleMarkReady = (orderId) => {
    // Update order status to "Ready for Pickup"
    if (onKitchenStatusChange) {
      onKitchenStatusChange(orderId, "Ready for Pickup");
    }
  };

  const handleCompleteOrder = (orderId) => {
    // Complete the order using the original handler for inventory deduction
    if (onCompleteOrder) {
      onCompleteOrder(orderId);
    }
  };



  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{
          color: "var(--clr-primary-brand)",
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>👨‍🍳 Kitchen Orders</h2>
        <p style={{
          color: "var(--clr-text-secondary)",
          fontSize: "1.1em"
        }}>Orders currently being prepared in the kitchen</p>
      </div>

      {kitchenOrders.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "var(--clr-bg-primary)",
          borderRadius: "12px",
          border: "2px dashed var(--clr-border)"
        }}>
          <div style={{ fontSize: "4em", marginBottom: "20px" }}>🍳</div>
          <h3 style={{ color: "var(--clr-text-secondary)", marginBottom: "10px" }}>No Orders in Preparation</h3>
          <p style={{ color: "var(--clr-text-secondary)" }}>Orders will appear here once sent to the kitchen.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px"
        }}>
          {kitchenOrders.map((order) => {
            const getOrderColor = (status) => {
              switch(status) {
                case "New": return "var(--clr-primary-brand)";
                case "In Preparation": return "var(--clr-warning)";
                case "Ready for Pickup": return "var(--clr-success)";
                default: return "var(--clr-border)";
              }
            };

            const getStatusIcon = (status) => {
              switch(status) {
                case "New": return "🆕";
                case "In Preparation": return "🔥";
                case "Ready for Pickup": return "✅";
                default: return "📋";
              }
            };

            const getStatusText = (status) => {
              switch(status) {
                case "New": return "New Order";
                case "In Preparation": return "Preparing";
                case "Ready for Pickup": return "Ready";
                default: return status;
              }
            };

            return (
            <div key={order.id} className="card" style={{
              border: `2px solid ${getOrderColor(order.status)}`,
              backgroundColor: "var(--clr-bg-secondary)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
                paddingBottom: "10px",
                borderBottom: "1px solid var(--clr-border)"
              }}>
                <h3 style={{
                  margin: "0",
                  color: "var(--clr-text-primary)",
                  fontSize: "1.3em"
                }}>
                  Order #{order.id}
                </h3>
                <span style={{
                  backgroundColor: getOrderColor(order.status),
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.85em",
                  fontWeight: "600"
                }}>
                  {getStatusIcon(order.status)} {getStatusText(order.status)}
                </span>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <p style={{
                  margin: "5px 0",
                  color: "var(--clr-text-primary)",
                  fontSize: "1.1em",
                  fontWeight: "600"
                }}>
                  Table: {order.table}
                </p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <h4 style={{
                  margin: "0 0 10px 0",
                  color: "var(--clr-text-primary)",
                  fontSize: "1.1em"
                }}>
                  Items:
                </h4>
                <div style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  backgroundColor: "var(--clr-bg-primary)",
                  padding: "10px",
                  borderRadius: "6px"
                }}>
                  {order.items.map((item, index) => (
                    <div key={index} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "5px 0",
                      borderBottom: index < order.items.length - 1 ? "1px solid var(--clr-border)" : "none"
                    }}>
                      <div>
                        <span style={{ fontWeight: "600", color: "var(--clr-text-primary)" }}>
                          {item.name}
                        </span>
                        <span style={{ color: "var(--clr-text-secondary)", marginLeft: "8px" }}>
                          x{item.quantity}
                        </span>
                      </div>
                      <span style={{ color: "var(--clr-success)", fontWeight: "600" }}>
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "15px",
                borderTop: "1px solid var(--clr-border)"
              }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {order.status === "New" && (
                    <button
                      onClick={() => onKitchenStatusChange && onKitchenStatusChange(order.id, "In Preparation")}
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
                    >
                      🔥 Start Cooking
                    </button>
                  )}
                  {order.status === "In Preparation" && (
                    <button
                      onClick={() => handleMarkReady(order.id)}
                      style={{
                        backgroundColor: "var(--clr-success)",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        fontSize: "0.9em",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                    >
                      ✅ Mark Ready
                    </button>
                  )}
                  {order.status === "Ready for Pickup" && (
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      style={{
                        backgroundColor: "var(--clr-success)",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        fontSize: "0.9em",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                    >
                      🎆 Complete Order
                    </button>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default KitchenOrderQueue;
