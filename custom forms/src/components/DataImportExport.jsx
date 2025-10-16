// src/components/DataImportExport.jsx

import React, { useState } from "react";

const DataImportExport = ({ 
  inventory, 
  orders, 
  menuItems, 
  employees, 
  suppliers, 
  locations,
  onImportData,
  currentUser 
}) => {
  const [importFile, setImportFile] = useState(null);
  const [importStatus, setImportStatus] = useState("");

  // Export all data to Excel CSV format
  const handleExportData = () => {
    const csvData = [];
    
    // Header information
    csvData.push(['Restaurant Export Data']);
    csvData.push(['Restaurant Name', currentUser?.restaurantName || 'Restaurant']);
    csvData.push(['Export Date', new Date().toLocaleDateString()]);
    csvData.push(['Tenant ID', currentUser?.tenantId || '']);
    csvData.push([]);
    
    // Menu Items
    if (menuItems && menuItems.length > 0) {
      csvData.push(['MENU ITEMS']);
      csvData.push(['ID', 'Name', 'Price', 'Cost', 'Category']);
      menuItems.forEach(item => {
        csvData.push([item.id, item.name, item.price, item.cost, item.category || '']);
      });
      csvData.push([]);
    }
    
    // Inventory
    if (inventory && inventory.length > 0) {
      csvData.push(['INVENTORY']);
      csvData.push(['ID', 'Name', 'Quantity', 'Unit', 'Cost', 'Supplier']);
      inventory.forEach(item => {
        csvData.push([item.id, item.name, item.quantity, item.unit, item.cost, item.supplier || '']);
      });
      csvData.push([]);
    }
    
    // Orders
    if (orders && orders.length > 0) {
      csvData.push(['ORDERS']);
      csvData.push(['ID', 'Table', 'Customer', 'Phone', 'Payment Method', 'Status', 'Total', 'Date']);
      orders.forEach(order => {
        csvData.push([
          order.id, 
          order.table, 
          order.customerName || '', 
          order.customerPhone || '', 
          order.paymentMethod, 
          order.status, 
          order.revenue || 0, 
          new Date(order.date).toLocaleDateString()
        ]);
      });
      csvData.push([]);
    }
    
    // Employees
    if (employees && employees.length > 0) {
      csvData.push(['EMPLOYEES']);
      csvData.push(['ID', 'Name', 'Role', 'Phone', 'Email']);
      employees.forEach(emp => {
        csvData.push([emp.id, emp.name, emp.role, emp.phone || '', emp.email || '']);
      });
      csvData.push([]);
    }
    
    // Suppliers
    if (suppliers && suppliers.length > 0) {
      csvData.push(['SUPPLIERS']);
      csvData.push(['ID', 'Name', 'Contact', 'Phone', 'Email']);
      suppliers.forEach(sup => {
        csvData.push([sup.id, sup.name, sup.contact || '', sup.phone || '', sup.email || '']);
      });
      csvData.push([]);
    }
    
    // Locations
    if (locations && locations.length > 0) {
      csvData.push(['LOCATIONS']);
      csvData.push(['ID', 'Name', 'Address', 'Phone']);
      locations.forEach(loc => {
        csvData.push([loc.id, loc.name, loc.address || '', loc.phone || '']);
      });
    }
    
    // Convert to CSV string
    const csvString = csvData.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const dataBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentUser?.restaurantName || 'restaurant'}_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setImportFile(file);
      setImportStatus("");
    } else {
      alert("Please select a valid CSV or Excel file");
      event.target.value = "";
    }
  };

  // Import data from CSV file
  const handleImportData = () => {
    if (!importFile) {
      alert("Please select a file to import");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const lines = csvText.split('\n').map(line => 
          line.split(',').map(cell => cell.replace(/^"|"$/g, '').replace(/""/g, '"'))
        );
        
        const importedData = {
          menuItems: [],
          inventory: [],
          orders: [],
          employees: [],
          suppliers: [],
          locations: []
        };
        
        let currentSection = null;
        let headers = [];
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.length === 0 || line[0] === '') continue;
          
          // Check for section headers
          if (line[0] === 'MENU ITEMS') {
            currentSection = 'menuItems';
            headers = lines[i + 1] || [];
            i++; // Skip header row
            continue;
          } else if (line[0] === 'INVENTORY') {
            currentSection = 'inventory';
            headers = lines[i + 1] || [];
            i++;
            continue;
          } else if (line[0] === 'ORDERS') {
            currentSection = 'orders';
            headers = lines[i + 1] || [];
            i++;
            continue;
          } else if (line[0] === 'EMPLOYEES') {
            currentSection = 'employees';
            headers = lines[i + 1] || [];
            i++;
            continue;
          } else if (line[0] === 'SUPPLIERS') {
            currentSection = 'suppliers';
            headers = lines[i + 1] || [];
            i++;
            continue;
          } else if (line[0] === 'LOCATIONS') {
            currentSection = 'locations';
            headers = lines[i + 1] || [];
            i++;
            continue;
          }
          
          // Parse data rows
          if (currentSection && headers.length > 0 && line.length >= headers.length) {
            const item = {};
            headers.forEach((header, index) => {
              if (header && line[index] !== undefined) {
                item[header.toLowerCase()] = line[index];
              }
            });
            
            if (item.id || item.name) {
              importedData[currentSection].push(item);
            }
          }
        }
        
        // Confirm import
        const totalItems = Object.values(importedData).reduce((sum, arr) => sum + arr.length, 0);
        if (totalItems === 0) {
          throw new Error("No valid data found in file");
        }
        
        const confirmMessage = `Import ${totalItems} items from CSV file?\n\nThis will add:\n• ${importedData.menuItems.length} menu items\n• ${importedData.inventory.length} inventory items\n• ${importedData.orders.length} orders\n• ${importedData.employees.length} employees\n• ${importedData.suppliers.length} suppliers\n• ${importedData.locations.length} locations`;

        if (window.confirm(confirmMessage)) {
          onImportData(importedData);
          setImportStatus("✅ Data imported successfully!");
          setImportFile(null);
          document.getElementById('importFile').value = "";
        }
      } catch (error) {
        console.error("Import error:", error);
        setImportStatus(`❌ Import failed: ${error.message}`);
      }
    };
    reader.readAsText(importFile);
  };

  // Generate sample CSV template
  const handleDownloadSample = () => {
    const sampleCsv = [
      ['Restaurant Export Data'],
      ['Restaurant Name', 'Sample Restaurant'],
      ['Export Date', new Date().toLocaleDateString()],
      ['Tenant ID', 'sample_tenant'],
      [],
      ['MENU ITEMS'],
      ['ID', 'Name', 'Price', 'Cost', 'Category'],
      ['1', 'Sample Burger', '12.99', '5.50', 'Main Course'],
      ['2', 'French Fries', '4.99', '1.50', 'Side Dish'],
      [],
      ['INVENTORY'],
      ['ID', 'Name', 'Quantity', 'Unit', 'Cost', 'Supplier'],
      ['1', 'Beef Patties', '50', 'pieces', '2.50', 'Sample Supplier'],
      ['2', 'Potatoes', '25', 'kg', '1.20', 'Local Farm'],
      [],
      ['EMPLOYEES'],
      ['ID', 'Name', 'Role', 'Phone', 'Email'],
      ['1', 'John Doe', 'chef', '123-456-7890', 'john@restaurant.com'],
      ['2', 'Jane Smith', 'waiter', '123-456-7891', 'jane@restaurant.com'],
      [],
      ['SUPPLIERS'],
      ['ID', 'Name', 'Contact', 'Phone', 'Email'],
      ['1', 'Sample Supplier', 'Mike Johnson', '123-456-7892', 'supplier@example.com'],
      [],
      ['LOCATIONS'],
      ['ID', 'Name', 'Address', 'Phone'],
      ['1', 'Main Branch', '123 Main St', '123-456-7893']
    ];
    
    const csvString = sampleCsv.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const dataBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_pos_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          color: "var(--clr-primary-brand)", 
          marginBottom: "10px",
          fontSize: "2.2em",
          fontWeight: "700"
        }}>📊 Data Import/Export</h2>
        <p style={{ 
          color: "var(--clr-text-secondary)", 
          fontSize: "1.1em" 
        }}>Transfer data to/from other POS systems</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Export Section */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-success)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>📤 Export Data</h3>
          
          <p style={{ 
            color: "var(--clr-text-secondary)", 
            marginBottom: "20px",
            fontSize: "0.95em"
          }}>
            Export all your restaurant data to Excel/CSV format for use in other POS systems or backup.
          </p>

          <div style={{
            backgroundColor: "var(--clr-bg-primary)",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}>
            <h4 style={{ margin: "0 0 10px 0", color: "var(--clr-text-primary)" }}>Export includes:</h4>
            <ul style={{ margin: "0", paddingLeft: "20px", color: "var(--clr-text-secondary)" }}>
              <li>🍽️ {menuItems?.length || 0} Menu Items</li>
              <li>📦 {inventory?.length || 0} Inventory Items</li>
              <li>🧾 {orders?.length || 0} Orders</li>
              <li>👥 {employees?.length || 0} Employees</li>
              <li>🏪 {suppliers?.length || 0} Suppliers</li>
              <li>📍 {locations?.length || 0} Locations</li>
            </ul>
          </div>

          <button
            onClick={handleExportData}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: "var(--clr-success)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1em",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            📊 Export to Excel/CSV
          </button>
        </div>

        {/* Import Section */}
        <div className="card">
          <h3 style={{ 
            color: "var(--clr-primary-brand)", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>📥 Import Data</h3>
          
          <p style={{ 
            color: "var(--clr-text-secondary)", 
            marginBottom: "20px",
            fontSize: "0.95em"
          }}>
            Import data from Excel/CSV files from other POS systems to continue where you left off.
          </p>

          <div className="form-group">
            <label>Select Excel/CSV Data File</label>
            <input
              id="importFile"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px dashed var(--clr-border)",
                borderRadius: "8px",
                backgroundColor: "var(--clr-bg-primary)",
                cursor: "pointer"
              }}
            />
          </div>

          {importFile && (
            <div style={{
              backgroundColor: "var(--clr-bg-primary)",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "0.9em",
              color: "var(--clr-text-secondary)"
            }}>
              📄 Selected: {importFile.name}
            </div>
          )}

          {importStatus && (
            <div style={{
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              backgroundColor: importStatus.includes("✅") ? "var(--clr-success)" : "var(--clr-danger)",
              color: "white",
              fontSize: "0.9em"
            }}>
              {importStatus}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <button
              onClick={handleImportData}
              disabled={!importFile}
              style={{
                flex: "1",
                padding: "12px",
                backgroundColor: !importFile ? "var(--clr-border)" : "var(--clr-primary-brand)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "1em",
                fontWeight: "600",
                cursor: !importFile ? "not-allowed" : "pointer",
                transition: "all 0.3s ease"
              }}
            >
              📥 Import Data
            </button>
          </div>

          <button
            onClick={handleDownloadSample}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "var(--clr-text-secondary)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.9em",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            📋 Download CSV Template
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h3 style={{ color: "var(--clr-text-primary)", marginBottom: "15px" }}>📖 Instructions</h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "20px",
          fontSize: "0.9em",
          color: "var(--clr-text-secondary)"
        }}>
          <div>
            <h4 style={{ color: "var(--clr-success)", margin: "0 0 10px 0" }}>Exporting Data:</h4>
            <ol style={{ paddingLeft: "20px" }}>
              <li>Click "Export All Data" button</li>
              <li>Save the JSON file to your device</li>
              <li>Use this file to import into another POS system</li>
              <li>Keep as backup for data recovery</li>
            </ol>
          </div>
          <div>
            <h4 style={{ color: "var(--clr-primary-brand)", margin: "0 0 10px 0" }}>Importing Data:</h4>
            <ol style={{ paddingLeft: "20px" }}>
              <li>Prepare JSON file from previous POS system</li>
              <li>Click "Choose File" and select your JSON file</li>
              <li>Review the import summary</li>
              <li>Click "Import Data" to add to current system</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataImportExport;