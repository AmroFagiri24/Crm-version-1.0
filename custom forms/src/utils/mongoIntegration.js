import * as mongoDb from './mongoDatabase.js';

// Auto-sync all data to MongoDB
export const syncAllDataToMongoDB = async (userData) => {
  try {
    const { username, inventory, orders, menuItems, locations, employees, suppliers } = userData;
    
    console.log('Syncing all data to MongoDB for user:', username);
    
    // Save all data types to MongoDB
    await Promise.all([
      // Save inventory items
      ...(inventory || []).map(item => 
        mongoDb.saveInventoryItem({ ...item, username, tenant_id: userData.tenantId })
      ),
      
      // Save orders
      ...(orders || []).map(order => 
        mongoDb.saveOrder({ ...order, username, tenant_id: userData.tenantId })
      ),
      
      // Save menu items
      ...(menuItems || []).map(item => 
        mongoDb.saveMenuItem({ ...item, username, tenant_id: userData.tenantId })
      ),
      
      // Save employees
      ...(employees || []).map(emp => 
        mongoDb.saveEmployee({ ...emp, username, tenant_id: userData.tenantId })
      ),
      
      // Save suppliers
      ...(suppliers || []).map(sup => 
        mongoDb.saveSupplier({ ...sup, username, tenant_id: userData.tenantId })
      ),
      
      // Save user data
      mongoDb.saveUserData(username, 'locations', locations || []),
      mongoDb.saveUserData(username, 'profile', {
        name: userData.name,
        role: userData.role,
        tenantId: userData.tenantId,
        restaurantName: userData.restaurantName,
        licenseType: userData.licenseType,
        lastSync: new Date().toISOString()
      })
    ]);
    
    console.log('✅ All data synced to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('❌ Error syncing data to MongoDB:', error);
    return false;
  }
};

// Save individual order to MongoDB
export const saveOrderToMongoDB = async (order, username, tenantId) => {
  try {
    await mongoDb.saveOrder({ ...order, username, tenant_id: tenantId });
    console.log('Order saved to MongoDB:', order.id);
  } catch (error) {
    console.error('Error saving order to MongoDB:', error);
  }
};

// Save individual menu item to MongoDB
export const saveMenuItemToMongoDB = async (menuItem, username, tenantId) => {
  try {
    await mongoDb.saveMenuItem({ ...menuItem, username, tenant_id: tenantId });
    console.log('Menu item saved to MongoDB:', menuItem.id);
  } catch (error) {
    console.error('Error saving menu item to MongoDB:', error);
  }
};

// Save individual inventory item to MongoDB
export const saveInventoryToMongoDB = async (inventoryItem, username, tenantId) => {
  try {
    await mongoDb.saveInventoryItem({ ...inventoryItem, username, tenant_id: tenantId });
    console.log('Inventory item saved to MongoDB:', inventoryItem.id);
  } catch (error) {
    console.error('Error saving inventory to MongoDB:', error);
  }
};

// Save employee to MongoDB
export const saveEmployeeToMongoDB = async (employee, username, tenantId) => {
  try {
    await mongoDb.saveEmployee({ ...employee, username, tenant_id: tenantId });
    console.log('Employee saved to MongoDB:', employee.id);
  } catch (error) {
    console.error('Error saving employee to MongoDB:', error);
  }
};

// Save supplier to MongoDB
export const saveSupplierToMongoDB = async (supplier, username, tenantId) => {
  try {
    await mongoDb.saveSupplier({ ...supplier, username, tenant_id: tenantId });
    console.log('Supplier saved to MongoDB:', supplier.id);
  } catch (error) {
    console.error('Error saving supplier to MongoDB:', error);
  }
};

// Get all data from MongoDB for a user
export const getAllDataFromMongoDB = async (username, tenantId) => {
  try {
    const [orders, menuItems, inventory, employees, suppliers, userData] = await Promise.all([
      mongoDb.getAllOrders(tenantId),
      mongoDb.getAllMenuItems(tenantId),
      mongoDb.getAllInventory(tenantId),
      mongoDb.getAllEmployees(tenantId),
      mongoDb.getAllSuppliers(tenantId),
      mongoDb.getAllUserData(username)
    ]);
    
    return {
      orders: orders || [],
      menuItems: menuItems || [],
      inventory: inventory || [],
      employees: employees || [],
      suppliers: suppliers || [],
      userData: userData || []
    };
  } catch (error) {
    console.error('Error loading data from MongoDB:', error);
    return {
      orders: [],
      menuItems: [],
      inventory: [],
      employees: [],
      suppliers: [],
      userData: []
    };
  }
};