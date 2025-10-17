// src/components/MultiLocationSelector.jsx

import React, { useState } from "react";

function MultiLocationSelector({ 
  locations = [], 
  activeLocations = [], 
  onActiveLocationsChange, 
  readOnly = false 
}) {
  const [selectedLocations, setSelectedLocations] = useState(activeLocations);

  const handleLocationToggle = (locationId) => {
    if (readOnly) return;
    
    const newSelectedLocations = selectedLocations.includes(locationId)
      ? selectedLocations.filter(id => id !== locationId)
      : [...selectedLocations, locationId];
    
    setSelectedLocations(newSelectedLocations);
    onActiveLocationsChange(newSelectedLocations);
  };

  const handleSelectAll = () => {
    if (readOnly) return;
    
    const allLocationIds = locations.map(loc => loc.id);
    setSelectedLocations(allLocationIds);
    onActiveLocationsChange(allLocationIds);
  };

  const handleSelectNone = () => {
    if (readOnly) return;
    
    setSelectedLocations([]);
    onActiveLocationsChange([]);
  };

  if (locations.length === 0) {
    return (
      <div style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "var(--clr-bg-primary)",
        borderRadius: "8px",
        border: "2px dashed var(--clr-border)"
      }}>
        <div style={{ fontSize: "2em", marginBottom: "10px" }}>🏢</div>
        <p style={{ color: "var(--clr-text-secondary)" }}>
          No locations available. Create locations first.
        </p>
      </div>
    );
  }

  return (
    <div className="multi-location-selector">
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "15px",
        padding: "12px",
        backgroundColor: "var(--clr-bg-primary)",
        borderRadius: "8px",
        border: "1px solid var(--clr-border)"
      }}>
        <div>
          <h4 style={{ margin: "0", color: "var(--clr-text-primary)" }}>
            Active Locations
          </h4>
          <p style={{ margin: "5px 0 0 0", color: "var(--clr-text-secondary)", fontSize: "0.9em" }}>
            {selectedLocations.length} of {locations.length} locations active
          </p>
        </div>
        
        {!readOnly && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleSelectAll}
              style={{
                backgroundColor: "var(--clr-primary-brand)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: "0.8em"
              }}
            >
              All
            </button>
            <button
              onClick={handleSelectNone}
              style={{
                backgroundColor: "var(--clr-text-secondary)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: "0.8em"
              }}
            >
              None
            </button>
          </div>
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "12px"
      }}>
        {locations.map((location) => {
          const isActive = selectedLocations.includes(location.id);
          
          return (
            <div
              key={location.id}
              onClick={() => handleLocationToggle(location.id)}
              style={{
                backgroundColor: isActive ? "var(--clr-success-light)" : "var(--clr-bg-primary)",
                border: `2px solid ${isActive ? "var(--clr-success)" : "var(--clr-border)"}`,
                borderRadius: "10px",
                padding: "12px",
                cursor: readOnly ? "default" : "pointer",
                transition: "all 0.2s ease",
                opacity: readOnly ? 0.7 : 1,
                position: "relative"
              }}
            >
              {isActive && (
                <div style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  backgroundColor: "var(--clr-success)",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7em",
                  fontWeight: "bold"
                }}>
                  ✓
                </div>
              )}
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "1.2em" }}>🏢</span>
                <h5 style={{ 
                  margin: "0", 
                  color: isActive ? "var(--clr-success)" : "var(--clr-text-primary)",
                  fontWeight: "600",
                  fontSize: "0.95em"
                }}>
                  {location.name}
                </h5>
              </div>
              
              <p style={{ 
                margin: "0", 
                color: "var(--clr-text-secondary)", 
                fontSize: "0.8em",
                lineHeight: "1.2"
              }}>
                📍 {location.address}
              </p>
              
              {location.manager && (
                <p style={{ 
                  margin: "4px 0 0 0", 
                  color: "var(--clr-text-secondary)", 
                  fontSize: "0.75em"
                }}>
                  👤 {location.manager}
                </p>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedLocations.length === 0 && !readOnly && (
        <div style={{
          marginTop: "15px",
          padding: "12px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "6px",
          color: "#856404"
        }}>
          ⚠️ No locations selected. User will not have access to any location data.
        </div>
      )}
    </div>
  );
}

export default MultiLocationSelector;