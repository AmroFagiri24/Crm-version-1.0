// src/components/SalesDashboard.jsx

import React from "react";
import { formatCurrency, exportSalesToCSV, exportRentalsToCSV } from "../utils/dataHelpers";
import DailySummary from "./DailySummary";
import Chart from "./Chart";

function SalesDashboard({ cars, sales, rentals, customers }) {
  // Safety check for array existence
  const carsCount = cars ? cars.length : 0;
  const salesCount = sales ? sales.length : 0;
  const rentalsCount = rentals ? rentals.length : 0;
  const customersCount = customers ? customers.length : 0;

  // Calculate additional metrics
  const activeRentals = rentals ? rentals.filter(rental => rental.status === 'Active').length : 0;
  const completedSales = sales ? sales.filter(sale => sale.status === 'Completed').length : 0;
  const totalRevenue = sales ? sales
    .filter(sale => sale.status === 'Completed')
    .reduce((sum, sale) => sum + (sale.revenue || 0), 0) : 0;

  // Low stock alerts for cars (assuming cars have stock or availability)
  const lowStockCars = cars ? cars.filter(car => car.stock < 5) : []; // Alert when stock is below 5

  return (
    <div className="main-content">
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{
          color: "var(--clr-primary-brand)",
          marginBottom: "10px",
          fontSize: "2.5em",
          fontWeight: "700"
        }}>Sales Dashboard</h2>
        <p style={{
          color: "var(--clr-text-secondary)",
          fontSize: "1.1em"
        }}>Welcome to your Car CRM management system</p>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="dashboard-summary">
        <div className="summary-box" style={{ borderTopColor: "var(--clr-primary-brand)" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px" }}>🚗</div>
          <h3>Cars in Inventory</h3>
          <div className="value">{carsCount}</div>
        </div>

        <div className="summary-box" style={{ borderTopColor: "var(--clr-success)" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px" }}>📦</div>
          <h3>Active Rentals</h3>
          <div className="value">{activeRentals}</div>
        </div>

        <div className="summary-box" style={{ borderTopColor: "#f39c12" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px" }}>✅</div>
          <h3>Completed Sales</h3>
          <div className="value">{completedSales}</div>
        </div>

        <div className="summary-box" style={{ borderTopColor: "var(--clr-danger)" }}>
          <div style={{ fontSize: "2em", marginBottom: "10px" }}>👥</div>
          <h3>Customers</h3>
          <div className="value">{customersCount}</div>
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
      {lowStockCars.length > 0 && (
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
            {lowStockCars.map(car => (
              <div key={car.id} style={{
                backgroundColor: "#f8d7da",
                color: "#721c24",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "0.9em",
                fontWeight: "600"
              }}>
                {car.make} {car.model}: {car.stock} left
              </div>
            ))}
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
            <strong>Create New Sale</strong>
            <p style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)", marginTop: "5px" }}>Sell a car to a customer</p>
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
            <strong>Manage Rentals</strong>
            <p style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)", marginTop: "5px" }}>Handle car rentals</p>
          </div>

          <div style={{
            padding: "15px",
            backgroundColor: "var(--clr-bg-primary)",
            borderRadius: "8px",
            textAlign: "center",
            border: "2px solid var(--clr-border)",
            transition: "all 0.3s ease"
          }}>
            <div style={{ fontSize: "1.5em", marginBottom: "8px" }}>🚗</div>
            <strong>Car Inventory</strong>
            <p style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)", marginTop: "5px" }}>Manage car stock</p>
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
            onClick={() => exportSalesToCSV(sales)}
            className="secondary-btn"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            📊 Export Sales
          </button>

          <button
            onClick={() => exportRentalsToCSV(rentals)}
            className="secondary-btn"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            📦 Export Rentals
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
              const daySales = sales.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate.toDateString() === date.toDateString() && sale.status === 'Completed';
              });
              const dayRevenue = daySales.reduce((sum, sale) => sum + (sale.revenue || 0), 0);
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

      {/* Top Selling Cars Chart */}
      <div className="card">
        <h3 style={{
          color: "var(--clr-primary-brand)",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>Top Selling Cars</h3>

        <Chart
          data={(() => {
            const carSales = {};
            sales.filter(sale => sale.status === 'Completed').forEach(sale => {
              const car = cars.find(c => c.id === sale.carId);
              if (car) {
                const carName = `${car.make} ${car.model}`;
                carSales[carName] = (carSales[carName] || 0) + 1;
              }
            });
            return Object.entries(carSales)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([name, count]) => ({ label: name, value: count }));
          })()}
          type="bar"
          width={600}
          height={200}
        />
      </div>

      {/* Daily Summary - assuming it can be adapted or removed */}
      <DailySummary orders={sales} />
    </div>
  );
}

export default SalesDashboard;
