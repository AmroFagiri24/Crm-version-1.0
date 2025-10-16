// src/components/LocationManagement.jsx

import React, { useState } from "react";

function LocationManagement({ locations, onAddLocation, onDeleteLocation, currentLocation, setCurrentLocation }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [manager, setManager] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      alert("Please fill in required fields");
      return;
    }

    onAddLocation({
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      manager: manager.trim(),
    });

    setName("");
    setAddress("");
    setPhone("");
    setManager("");
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>🏢 Location Management</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Manage multiple store locations</p>
      </div>

      {/* Current Location Selector */}
      {locations.length > 0 && (
        <div className="card">
          <h3 style={{ color: "var(--clr-success)", marginBottom: "15px" }}>📍 Current Location</h3>
          <select
            value={currentLocation?.id || ""}
            onChange={(e) => {
              const location = locations.find(loc => loc.id === parseInt(e.target.value));
              setCurrentLocation(location || null);
            }}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          >
            <option value="">Select Location</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name} - {location.address}
              </option>
            ))}
          </select>
          {currentLocation && (
            <p style={{ color: "var(--clr-text-secondary)", margin: 0 }}>
              Currently managing: <strong>{currentLocation.name}</strong>
            </p>
          )}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Add Location Form */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-success)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>➕ Add New Location</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Location Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Downtown Branch"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address"
                required
              />
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
              <label>Manager Name</label>
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="Manager name"
              />
            </div>
            
            <button type="submit" className="primary-btn" style={{ width: "100%" }}>
              ➕ Add Location
            </button>
          </form>
        </div>

        {/* Locations List */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            🏢 All Locations 
            <span style={{
              backgroundColor: "var(--clr-primary-brand)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.8em",
              fontWeight: "600"
            }}>({locations.length})</span>
          </h3>

          {locations.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px",
              backgroundColor: "var(--clr-bg-primary)",
              borderRadius: "8px",
              border: "2px dashed var(--clr-border)"
            }}>
              <div style={{ fontSize: "3em", marginBottom: "15px" }}>🏢</div>
              <p style={{ color: "var(--clr-text-secondary)", fontSize: "1.1em" }}>
                No locations added yet.<br/>
                Add your first location to get started!
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px"
            }}>
              {locations.map((location) => (
                <div key={location.id} style={{
                  backgroundColor: "var(--clr-bg-primary)",
                  border: currentLocation?.id === location.id ? "2px solid var(--clr-success)" : "2px solid var(--clr-border)",
                  borderRadius: "12px",
                  padding: "20px",
                  position: "relative"
                }}>
                  {currentLocation?.id === location.id && (
                    <div style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "var(--clr-success)",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.75em",
                      fontWeight: "600"
                    }}>
                      ACTIVE
                    </div>
                  )}
                  
                  <h4 style={{ margin: "0 0 10px 0", color: "var(--clr-text-primary)" }}>
                    {location.name}
                  </h4>
                  
                  <p style={{ margin: "5px 0", color: "var(--clr-text-secondary)", fontSize: "0.9em" }}>
                    📍 {location.address}
                  </p>
                  
                  {location.phone && (
                    <p style={{ margin: "5px 0", color: "var(--clr-text-secondary)", fontSize: "0.9em" }}>
                      📞 {location.phone}
                    </p>
                  )}
                  
                  {location.manager && (
                    <p style={{ margin: "5px 0", color: "var(--clr-text-secondary)", fontSize: "0.9em" }}>
                      👤 Manager: {location.manager}
                    </p>
                  )}
                  
                  <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => setCurrentLocation(location)}
                      className="primary-btn"
                      style={{ flex: 1, padding: "8px", fontSize: "0.85em" }}
                      disabled={currentLocation?.id === location.id}
                    >
                      {currentLocation?.id === location.id ? "✅ Active" : "📍 Select"}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete location "${location.name}"?`)) {
                          if (currentLocation?.id === location.id) {
                            setCurrentLocation(null);
                          }
                          onDeleteLocation(location.id);
                        }
                      }}
                      className="cancel-btn"
                      style={{ padding: "8px", fontSize: "0.85em" }}
                    >
                      🗑️
                    </button>
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

export default LocationManagement;