// src/components/SupplierManagement.jsx

import React, { useState } from "react";

function SupplierManagement({ suppliers, onAddSupplier, onDeleteSupplier }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("food");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      alert("Please fill in required fields");
      return;
    }

    onAddSupplier({
      name: name.trim(),
      contact: contact.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      category,
      notes: notes.trim(),
      status: "active",
    });

    setName("");
    setContact("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCategory("food");
    setNotes("");
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "food": return "🥘";
      case "beverages": return "🥤";
      case "equipment": return "🔧";
      case "cleaning": return "🧽";
      case "packaging": return "📦";
      default: return "🏪";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "food": return "#e67e22";
      case "beverages": return "#3498db";
      case "equipment": return "#95a5a6";
      case "cleaning": return "#2ecc71";
      case "packaging": return "#9b59b6";
      default: return "var(--clr-text-secondary)";
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
        }}>🚚 Supplier Management</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Manage your business suppliers and vendors</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Add Supplier Form */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-success)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>➕ Add New Supplier</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Supplier company name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Contact Person *</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Contact person name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="food">🥘 Food & Ingredients</option>
                <option value="beverages">🥤 Beverages</option>
                <option value="equipment">🔧 Equipment</option>
                <option value="cleaning">🧽 Cleaning Supplies</option>
                <option value="packaging">📦 Packaging</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
            </div>
            
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Business address"
              />
            </div>
            
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about supplier"
                rows="3"
              />
            </div>
            
            <button type="submit" className="primary-btn" style={{ width: "100%" }}>
              ➕ Add Supplier
            </button>
          </form>
        </div>

        {/* Suppliers List */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            🚚 All Suppliers 
            <span style={{
              backgroundColor: "var(--clr-primary-brand)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.8em",
              fontWeight: "600"
            }}>({suppliers.length})</span>
          </h3>

          {suppliers.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px",
              backgroundColor: "var(--clr-bg-primary)",
              borderRadius: "8px",
              border: "2px dashed var(--clr-border)"
            }}>
              <div style={{ fontSize: "3em", marginBottom: "15px" }}>🚚</div>
              <p style={{ color: "var(--clr-text-secondary)", fontSize: "1.1em" }}>
                No suppliers added yet.<br/>
                Add your first supplier to track vendors!
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px"
            }}>
              {suppliers.map((supplier) => (
                <div key={supplier.id} style={{
                  backgroundColor: "var(--clr-bg-primary)",
                  border: "2px solid var(--clr-border)",
                  borderRadius: "12px",
                  padding: "20px",
                  position: "relative"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "15px"
                  }}>
                    <h4 style={{ margin: "0", color: "var(--clr-text-primary)" }}>
                      {supplier.name}
                    </h4>
                    
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove supplier "${supplier.name}"?`)) {
                          onDeleteSupplier(supplier.id);
                        }
                      }}
                      style={{
                        backgroundColor: "var(--clr-danger)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        fontSize: "0.8em"
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div style={{
                    backgroundColor: getCategoryColor(supplier.category),
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.85em",
                    fontWeight: "600",
                    display: "inline-block",
                    marginBottom: "15px"
                  }}>
                    {getCategoryIcon(supplier.category)} {supplier.category.toUpperCase()}
                  </div>
                  
                  <div style={{ fontSize: "0.9em", color: "var(--clr-text-secondary)" }}>
                    <p style={{ margin: "5px 0", fontWeight: "600", color: "var(--clr-text-primary)" }}>
                      👤 {supplier.contact}
                    </p>
                    
                    {supplier.phone && (
                      <p style={{ margin: "5px 0" }}>
                        📞 {supplier.phone}
                      </p>
                    )}
                    
                    {supplier.email && (
                      <p style={{ margin: "5px 0" }}>
                        📧 {supplier.email}
                      </p>
                    )}
                    
                    {supplier.address && (
                      <p style={{ margin: "5px 0" }}>
                        📍 {supplier.address}
                      </p>
                    )}
                    
                    {supplier.notes && (
                      <p style={{ 
                        margin: "10px 0 5px 0", 
                        padding: "8px", 
                        backgroundColor: "var(--clr-bg-secondary)", 
                        borderRadius: "6px",
                        fontSize: "0.85em",
                        fontStyle: "italic"
                      }}>
                        💭 {supplier.notes}
                      </p>
                    )}
                    
                    <p style={{ margin: "10px 0 0 0", fontSize: "0.8em" }}>
                      Added: {new Date(supplier.createdAt).toLocaleDateString()}
                    </p>
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

export default SupplierManagement;