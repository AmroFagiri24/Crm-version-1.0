// Enhanced data storage system for persistent data across sessions

const STORAGE_KEYS = {
  USERS: 'pos_system_users',
  RESTAURANTS: 'pos_system_restaurants',
  ORDERS: 'pos_system_orders',
  INVENTORY: 'pos_system_inventory',
  MENU_ITEMS: 'pos_system_menu_items',
  SYSTEM_DATA: 'pos_system_data'
};

// Initialize default data if not exists
const initializeDefaultData = () => {
  const defaultUsers = [
    { username: "AmroFagiri", password: "K93504241Aa", name: "System Admin", role: "admin", tenantId: null },
    { username: "Al_Hawatat", password: "pass123", name: "Alhawatat", role: "super_manager", tenantId: "restaurant_1", restaurantName: "Al Hawatat Restaurant", licenseType: "trial", trialStartDate: new Date().toISOString(), trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
    { username: "Ahmed", password: "pass123", name: "Ahmed", role: "cashier", tenantId: "restaurant_1", restaurantName: "Al Hawatat Restaurant", licenseType: "trial" },
    { username: "waiter1", password: "pass123", name: "John Waiter", role: "waiter", tenantId: "restaurant_1", restaurantName: "Al Hawatat Restaurant", licenseType: "trial" },
    { username: "chef1", password: "pass123", name: "Mary Chef", role: "chef", tenantId: "restaurant_1", restaurantName: "Al Hawatat Restaurant", licenseType: "trial" }
  ];

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.SYSTEM_DATA)) {
    localStorage.setItem(STORAGE_KEYS.SYSTEM_DATA, JSON.stringify({
      initialized: true,
      version: "1.0.0",
      lastUpdate: new Date().toISOString()
    }));
  }
};

// Enhanced save function with error handling
export const saveToStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    
    // Also save to backup key
    localStorage.setItem(`${key}_backup`, serializedData);
    
    return true;
  } catch (error) {
    console.error('Failed to save data:', error);
    return false;
  }
};

// Enhanced load function with backup recovery
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    
    // Try backup if main data is missing
    const backupData = localStorage.getItem(`${key}_backup`);
    if (backupData) {
      const parsed = JSON.parse(backupData);
      // Restore main data from backup
      localStorage.setItem(key, backupData);
      return parsed;
    }
    
    return defaultValue;
  } catch (error) {
    console.error('Failed to load data:', error);
    
    // Try backup on error
    try {
      const backupData = localStorage.getItem(`${key}_backup`);
      if (backupData) {
        return JSON.parse(backupData);
      }
    } catch (backupError) {
      console.error('Backup data also corrupted:', backupError);
    }
    
    return defaultValue;
  }
};

// User-specific data management
export const saveUserData = (username, dataType, data) => {
  const key = `${username}_${dataType}`;
  return saveToStorage(key, data);
};

export const loadUserData = (username, dataType, defaultValue = []) => {
  const key = `${username}_${dataType}`;
  return loadFromStorage(key, defaultValue);
};

// Tenant-specific data management
export const saveTenantData = (tenantId, dataType, data) => {
  const key = `${tenantId}_${dataType}`;
  return saveToStorage(key, data);
};

export const loadTenantData = (tenantId, dataType, defaultValue = []) => {
  const key = `${tenantId}_${dataType}`;
  return loadFromStorage(key, defaultValue);
};

// Initialize system
initializeDefaultData();

export { STORAGE_KEYS };