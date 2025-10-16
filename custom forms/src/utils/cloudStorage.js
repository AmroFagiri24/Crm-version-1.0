// Real cloud storage using JSONBin.io
const API_BASE = 'https://api.jsonbin.io/v3/b';
const BIN_ID = '676f8a2bad19ca34f8c8f8a2'; // Shared bin for all data
const API_KEY = '$2a$10$8K8vwjaq89X-4F4OqDdOKOuH.WGELEuFEWJGABkUYnxGOmAGy3/G2';

// Fallback to localStorage if cloud fails
const FALLBACK_STORAGE = {
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  },
  load: (key, defaultValue) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
};

// Real cloud storage functions
const cloudAPI = {
  async save(data) {
    try {
      const response = await fetch(`${API_BASE}/${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (error) {
      console.error('Cloud save failed:', error);
      return false;
    }
  },
  
  async load() {
    try {
      const response = await fetch(`${API_BASE}/${BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });
      if (response.ok) {
        const result = await response.json();
        return result.record;
      }
      return null;
    } catch (error) {
      console.error('Cloud load failed:', error);
      return null;
    }
  }
};

// Initialize default users in cloud storage
const DEFAULT_USERS = [
  { username: "AmroFagiri", password: "K93504241Aa", name: "System Admin", role: "admin", tenantId: null },
  { username: "Al_Hawatat", password: "pass123", name: "Alhawatat", role: "super_manager", tenantId: "restaurant_1", restaurantName: "Al Hawatat Restaurant", licenseType: "trial", trialStartDate: new Date().toISOString(), trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
  { username: "Ahmed", password: "pass123", name: "Ahmed", role: "cashier", tenantId: "restaurant_1", restaurantName: "Al Hawatat Restaurant", licenseType: "trial" },
  { username: "waiter1", password: "pass123", name: "John Waiter", role: "waiter", tenantId: "restaurant_1", restaurantName: "Al Hawatat Restaurant", licenseType: "trial" },
  { username: "chef1", password: "pass123", name: "Mary Chef", role: "chef", tenantId: "restaurant_1", restaurantName: "Al Hawatat Restaurant", licenseType: "trial" }
];

// Real cloud storage functions
export const saveToCloud = async (key, data) => {
  try {
    // Load current cloud data
    let cloudData = await cloudAPI.load() || {};
    
    // Update the specific key
    cloudData[key] = data;
    
    // Save back to cloud
    const success = await cloudAPI.save(cloudData);
    
    if (success) {
      // Also save locally as backup
      FALLBACK_STORAGE.save(key, data);
      return true;
    }
    
    // Fallback to local storage
    return FALLBACK_STORAGE.save(key, data);
  } catch (error) {
    console.error('Cloud save failed:', error);
    return FALLBACK_STORAGE.save(key, data);
  }
};

export const loadFromCloud = async (key, defaultValue = null) => {
  try {
    // Load from cloud first
    const cloudData = await cloudAPI.load();
    
    if (cloudData && cloudData[key]) {
      // Save to local as backup
      FALLBACK_STORAGE.save(key, cloudData[key]);
      return cloudData[key];
    }
    
    // Fallback to local storage
    const localData = FALLBACK_STORAGE.load(key, defaultValue);
    
    // If we have local data but no cloud data, sync to cloud
    if (localData && localData !== defaultValue) {
      await saveToCloud(key, localData);
    }
    
    return localData;
  } catch (error) {
    console.error('Cloud load failed:', error);
    return FALLBACK_STORAGE.load(key, defaultValue);
  }
};

// Initialize cloud storage with default users
export const initializeCloudStorage = async () => {
  try {
    const existingUsers = await loadFromCloud('pos_system_users', null);
    if (!existingUsers) {
      await saveToCloud('pos_system_users', DEFAULT_USERS);
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize cloud storage:', error);
    // Fallback to localStorage
    FALLBACK_STORAGE.save('pos_system_users', DEFAULT_USERS);
    return false;
  }
};

// Cross-device user management
export const saveUserData = async (username, dataType, data) => {
  const key = `${username}_${dataType}`;
  return await saveToCloud(key, data);
};

export const loadUserData = async (username, dataType, defaultValue = []) => {
  const key = `${username}_${dataType}`;
  return await loadFromCloud(key, defaultValue);
};

export const saveTenantData = async (tenantId, dataType, data) => {
  const key = `${tenantId}_${dataType}`;
  return await saveToCloud(key, data);
};

export const loadTenantData = async (tenantId, dataType, defaultValue = []) => {
  const key = `${tenantId}_${dataType}`;
  return await loadFromCloud(key, defaultValue);
};