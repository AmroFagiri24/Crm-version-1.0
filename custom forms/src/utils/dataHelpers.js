// src/utils/dataHelpers.js

// --- Constants ---
export const INVENTORY_KEY_BASE = "inventory";
export const ORDERS_KEY_BASE = "orders";
export const MENU_KEY_BASE = "menu";
const CURRENCY_SYMBOL = "RWF "; // Rwandan Franc Symbol
const VAT_RATE = 0.18; // Rwanda VAT rate (18%)

// --- Data Persistence Helpers ---

export const loadData = (usernameOrKey, defaultData = []) => {
  const key = usernameOrKey.includes("_")
    ? usernameOrKey
    : `${usernameOrKey}_data`;
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultData;
    }
    return JSON.parse(serializedData);
  } catch (e) {
    console.warn(`Error loading data for ${key}`, e);
    return defaultData;
  }
};

export const saveData = (usernameOrKey, keyBase, data) => {
  const key = usernameOrKey.includes("_")
    ? usernameOrKey
    : `${usernameOrKey}_${keyBase}`;
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (e) {
    console.error(`Error saving data for ${key}`, e);
  }
};

// --- Formatting and Utility Helpers ---

export const formatCurrency = (amount) => {
  // Ensure amount is a number before formatting
  if (typeof amount !== "number" || isNaN(amount)) {
    return `${CURRENCY_SYMBOL}0`;
  }
  return `${CURRENCY_SYMBOL}${Math.round(amount).toLocaleString()}`;
};

// VAT Calculation Functions
export const calculateVAT = (amount) => {
  return amount * VAT_RATE;
};

export const calculateAmountWithVAT = (amount) => {
  return amount + calculateVAT(amount);
};

export const calculateAmountExcludingVAT = (amountWithVAT) => {
  return amountWithVAT / (1 + VAT_RATE);
};

export const getVATBreakdown = (amount) => {
  const vatAmount = calculateVAT(amount);
  const totalWithVAT = amount + vatAmount;
  return {
    subtotal: amount,
    vatRate: VAT_RATE * 100,
    vatAmount: vatAmount,
    total: totalWithVAT
  };
};

export const getVATRate = () => VAT_RATE * 100;

/** Calculates the weighted average unit cost of an item from current inventory batches. */
export const getUnitCost = (itemId, inventory) => {
  const batches = inventory.filter(
    (item) => item.menuItemId === itemId && item.quantity > 0
  );

  if (batches.length === 0) return 0;

  let totalCost = 0;
  let totalQuantity = 0;

  batches.forEach((batch) => {
    totalCost += batch.quantity * batch.unitCost;
    totalQuantity += batch.quantity;
  });

  return totalQuantity > 0 ? totalCost / totalQuantity : 0;
};

// src/utils/dataHelpers.js

/**
 * Generates an invoice and opens the browser's native print dialog.
 * The user can then select their configured thermal printer or print to PDF.
 */
export const printInvoice = (order) => {
  if (!order) return;

  let invoiceHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Order Invoice</title>
            <style>
                body { font-family: 'monospace'; font-size: 10px; margin: 0; padding: 10px; }
                .invoice-container { width: 80mm; margin: 0 auto; }
                .header, .footer { text-align: center; margin-bottom: 5px; }
                .items-table { width: 100%; border-collapse: collapse; margin: 5px 0; }
                .items-table th, .items-table td { text-align: left; padding: 2px 0; }
                .items-table td:last-child { text-align: right; }
                .separator { border-top: 1px dashed #000; margin: 5px 0; }
                .total { text-align: right; font-weight: bold; font-size: 11px; padding-top: 5px; }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="header">
                    <h3>RESTAURANT SALES INVOICE</h3>
                </div>
                <p>Order ID/Table: ${order.table}</p>
                <p>Date: ${new Date(order.date).toLocaleString()}</p>
                
                <div class="separator"></div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items
                          .map(
                            (item) => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>${formatCurrency(
                                  item.price * item.quantity
                                )}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
                
                <div class="separator"></div>

                <div class="total">
                    TOTAL: ${formatCurrency(order.revenue)}
                </div>

                <div class="separator"></div>

                <div class="footer">
                    <p>STATUS: ${order.status}</p>
                    <p>Thank You!</p>
                </div>
            </div>
            <script>window.print(); window.close();</script>
        </body>
        </html>
    `;

  // Open the HTML content in a new temporary window for printing
  const printWindow = window.open("", "_blank");
  printWindow.document.write(invoiceHtml);
  printWindow.document.close();

  // Alert the user that the print dialog should appear
  alert(
    `The print dialog for Table/ID ${order.table} is opening. Select your thermal printer from the options.`
  );
};

/** Placeholder function for consistency. This function is currently not used but is required for the App.jsx imports. */
export const processOrderCostAndStock = (order, inventory, menuItems) => {
  // App.jsx contains the actual logic for updating inventory and calculating cost/profit.
  // This remains a placeholder to satisfy potential imports in other components.
  return { cost: 0, updatedInventory: inventory };
};

// src/utils/dataHelpers.js

// ... (Existing exports like formatCurrency, loadData, etc.) ...

/** * Formats data for printing and opens a new window/tab
 * to display and print the Sales Report.
 */
export const printReport = (orders) => {
  if (!orders || orders.length === 0) {
    alert("No orders to print.");
    return;
  }

  const reportContent = `
    <html>
      <head>
        <title>Sales Report</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          h1 { color: #2C3E50; border-bottom: 2px solid #3498DB; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .summary { margin-bottom: 30px; padding: 15px; background-color: #ECF0F1; }
        </style>
      </head>
      <body>
        <h1>POS Sales Report</h1>
        <div class="summary">
          <p>Total Orders: ${orders.length}</p>
          <p>Report Date: ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Revenue</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${orders
              .map(
                (order) => `
              <tr>
                <td>${order.id}</td>
                <td>${order.customer || "N/A"}</td>
                <td>${formatCurrency(order.revenue || 0)}</td>
                <td>${new Date(order.date).toLocaleString()}</td>
                <td>${order.status}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <script>
          window.print();
          window.onafterprint = function() { window.close(); };
        </script>
      </body>
    </html>
  `;

  // Create a new window to display the report
  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.write(reportContent);
  printWindow.document.close();
};

// Export data functions
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle nested objects and arrays
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportOrdersToCSV = (orders) => {
  const exportData = orders.map(order => ({
    id: order.id,
    table: order.table,
    customerName: order.customerName || '',
    customerPhone: order.customerPhone || '',
    status: order.status,
    revenue: order.revenue || 0,
    date: new Date(order.date).toLocaleString(),
    itemCount: order.items ? order.items.length : 0,
    items: order.items ? order.items.map(item => `${item.name} x${item.quantity}`).join('; ') : ''
  }));
  
  exportToCSV(exportData, 'orders');
};

export const exportInventoryToCSV = (inventory, menuItems) => {
  const exportData = inventory.map(batch => {
    let itemName = '';
    if (batch.itemType === 'raw_material') {
      itemName = batch.rawMaterialName;
    } else {
      const menuItem = menuItems.find(item => item.id === batch.menuItemId);
      itemName = menuItem ? menuItem.name : `Item #${batch.menuItemId}`;
    }

    return {
      itemName,
      itemType: batch.itemType === 'raw_material' ? 'Raw Material' : 'Menu Item',
      quantity: batch.quantity,
      unitCost: batch.unitCost,
      totalValue: batch.quantity * batch.unitCost,
      date: new Date(batch.date).toLocaleString()
    };
  });

  exportToCSV(exportData, 'inventory');
};

export const exportSalesToCSV = (sales) => {
  const exportData = sales.map(sale => ({
    id: sale.id,
    carId: sale.carId,
    customerId: sale.customerId,
    status: sale.status,
    revenue: sale.revenue || 0,
    date: new Date(sale.date).toLocaleString(),
    carMake: sale.carMake || '',
    carModel: sale.carModel || ''
  }));

  exportToCSV(exportData, 'sales');
};

export const exportRentalsToCSV = (rentals) => {
  const exportData = rentals.map(rental => ({
    id: rental.id,
    carId: rental.carId,
    customerId: rental.customerId,
    status: rental.status,
    startDate: new Date(rental.startDate).toLocaleString(),
    endDate: rental.endDate ? new Date(rental.endDate).toLocaleString() : '',
    revenue: rental.revenue || 0,
    carMake: rental.carMake || '',
    carModel: rental.carModel || ''
  }));

  exportToCSV(exportData, 'rentals');
};
