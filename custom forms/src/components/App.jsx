// src/components/App.jsx

import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import MainLayout from "./MainLayout";
import Toast from "./Toast";
import IdleAnimation from "./IdleAnimation";
import { useToast } from "../hooks/useToast";

import {
  loadData,
  saveData,
  INVENTORY_KEY_BASE,
  ORDERS_KEY_BASE,
  MENU_KEY_BASE,
} from "../utils/dataHelpers";
import {
  saveToStorage,
  loadFromStorage,
  saveUserData,
  loadUserData,
  saveTenantData,
  loadTenantData,
  STORAGE_KEYS
} from "../utils/dataStorage";
import {
  saveToCloud,
  loadFromCloud,
  initializeCloudStorage,
  saveUserData as saveUserDataCloud,
  loadUserData as loadUserDataCloud,
  saveTenantData as saveTenantDataCloud,
  loadTenantData as loadTenantDataCloud
} from "../utils/cloudStorage";


const LOCATIONS_KEY = "locations";
const EMPLOYEES_KEY = "employees";
const SUPPLIERS_KEY = "suppliers";
const USER_ACCOUNTS_KEY = "user_accounts";
const TENANT_KEY = "current_tenant";

// Get tenant-specific key
const getTenantKey = (baseKey, tenantId) => {
  return tenantId ? `${tenantId}_${baseKey}` : baseKey;
};

// --- Customer Credentials (Only username needs to be defined for the check) ---
const AUTH_KEY = "crm_auth_status";
const CUSTOMER_CREDENTIALS = [
  // Only admin account - all other users must be created by admin
  { username: "AmroFagiri", password: "K93504241Aa", name: "System Admin", role: "admin", tenantId: null }
];

// Helper function to safely load initial state and catch JSON errors
const safeLoadData = (keyBase, defaultValue) => {
  try {
    return loadData(keyBase, defaultValue);
  } catch (e) {
    // This catches the 'SyntaxError' on startup (like parsing "Ahmed")
    console.error(
      `Failed to load initial data for key: ${keyBase}. Clearing key.`,
      e
    );
    // Crucial step: if data is corrupted, clear it to prevent endless crashes
    localStorage.removeItem(keyBase);
    return defaultValue;
  }
};

function App() {
  // --- CENTRAL STATE ---
  const [currentUser, setCurrentUser] = useState(null);

  // Initial data load: now only attempts to load UNPREFIXED data (Menu is shared)
  const [menuItems, setMenuItems] = useState([]);

  // Inventory and Orders are set to empty arrays initially, preventing crashes
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const [activeSection, setActiveSection] = useState("Dashboard");
  
  const { toasts, removeToast, success, error, warning, info } = useToast();

  // --- EFFECT: Load Data ---
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Set admin first to prevent loading issues
        setUserAccounts(CUSTOMER_CREDENTIALS);
        
        // Load users from Firebase with timeout
        const { getAllUsers } = await import('../utils/firebase');
        const firebaseUsers = await Promise.race([
          getAllUsers(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]);
        
        // Filter out admin from Firebase users to avoid duplicates
        const nonAdminFirebaseUsers = firebaseUsers.filter(u => u.username !== 'AmroFagiri');
        
        // Always include admin account first, then Firebase users
        const allUsers = [CUSTOMER_CREDENTIALS[0], ...nonAdminFirebaseUsers];
        setUserAccounts(allUsers);
        
        console.log('Loaded users:', allUsers.length);
      } catch (error) {
        console.error('Error loading users from Firebase:', error);
        // Keep admin only on error
        setUserAccounts(CUSTOMER_CREDENTIALS);
      }
    };
    
    loadUsers();
    
    // Check for stored auth
    const storedUser = localStorage.getItem(AUTH_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setCurrentTenant(user.tenantId);

        // Load user-specific data
        const userKey = `user_${user.username}`;
        setMenuItems(loadFromStorage(`${userKey}_menu_items`, []));
        setInventory(loadFromStorage(`${userKey}_inventory`, []));
        setOrders(loadFromStorage(`${userKey}_orders`, []));
        setLocations(loadFromStorage(`${userKey}_locations`, []));
        setEmployees(loadFromStorage(`${userKey}_employees`, []));
        setSuppliers(loadFromStorage(`${userKey}_suppliers`, []));
      } catch (e) {
        console.error("Corrupted authentication data found. Clearing auth.", e);
        localStorage.removeItem(AUTH_KEY);
        setCurrentUser(null);
        setCurrentTenant(null);
      }
    }
    
    setIsLoading(false);
  }, []);

  // --- EFFECT: Save Data ---
  useEffect(() => {
    if (currentUser && currentTenant !== undefined) {
      // Data is saved using tenant-specific keys
      saveData(getTenantKey(`${currentUser.username}_${INVENTORY_KEY_BASE}`, currentTenant), inventory);
      // Also save to user-specific storage
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_inventory`, inventory);
    }
  }, [inventory, currentUser, currentTenant]);

  useEffect(() => {
    if (currentUser && currentTenant !== undefined) {
      // Data is saved using tenant-specific keys
      saveData(getTenantKey(`${currentUser.username}_${ORDERS_KEY_BASE}`, currentTenant), orders);
      // Also save to user-specific storage
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_orders`, orders);
    }
  }, [orders, currentUser, currentTenant]);

  useEffect(() => {
    if (currentUser && currentTenant !== undefined) {
      // Menu is tenant-specific
      saveData(getTenantKey(MENU_KEY_BASE, currentTenant), menuItems);
      // Also save to user-specific storage
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_menu_items`, menuItems);
    }
  }, [menuItems, currentTenant, currentUser]);

  useEffect(() => {
    if (currentUser && currentTenant !== undefined) {
      saveData(getTenantKey(LOCATIONS_KEY, currentTenant), locations);
      // Also save to user-specific storage
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_locations`, locations);
    }
  }, [locations, currentTenant, currentUser]);

  useEffect(() => {
    if (currentUser && currentTenant !== undefined) {
      saveData(getTenantKey(EMPLOYEES_KEY, currentTenant), employees);
      // Also save to user-specific storage
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_employees`, employees);
    }
  }, [employees, currentTenant, currentUser]);

  useEffect(() => {
    if (currentUser && currentTenant !== undefined) {
      saveData(getTenantKey(SUPPLIERS_KEY, currentTenant), suppliers);
      // Also save to user-specific storage
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_suppliers`, suppliers);
    }
  }, [suppliers, currentTenant, currentUser]);

  // Auto-save to Firebase periodically
  useEffect(() => {
    if (!currentUser) return;
    
    const autoSaveInterval = setInterval(async () => {
      try {
        const { saveUserData } = await import('../utils/firebase');
        await Promise.all([
          saveUserData(currentUser.username, 'inventory', inventory),
          saveUserData(currentUser.username, 'orders', orders),
          saveUserData(currentUser.username, 'menuItems', menuItems),
          saveUserData(currentUser.username, 'locations', locations),
          saveUserData(currentUser.username, 'employees', employees),
          saveUserData(currentUser.username, 'suppliers', suppliers)
        ]);
        console.log('Auto-save to Firebase completed');
      } catch (error) {
        console.error('Auto-save to Firebase failed:', error);
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(autoSaveInterval);
  }, [currentUser, inventory, orders, menuItems, locations, employees, suppliers]);

  // User accounts are now saved immediately when changed

  // --- HANDLERS ---

  const handleLogin = (user) => {
    if (user) {
      // Check if trial has expired for non-admin users
      if (user.role !== 'admin' && user.licenseType === 'trial' && user.trialEndDate) {
        const trialEnd = new Date(user.trialEndDate);
        const now = new Date();
        
        if (now > trialEnd) {
          alert('🚫 TRIAL EXPIRED\n\nYour 7-day trial period has ended.\n\nTo continue using Emporos Nexus POS system, please:\n• Contact your system administrator\n• Upgrade to a paid plan\n• Or purchase a subscription\n\nThank you for trying our system!');
          return false;
        }
      }
      
      // Load user-specific data upon successful login
      const userKey = `user_${user.username}`;
      setCurrentTenant(user.tenantId);
      
      // Load user-specific data from Firebase first, fallback to localStorage
      const loadUserData = async () => {
        try {
          const { getUserData } = await import('../utils/firebase');
          const [firebaseOrders, firebaseInventory, firebaseMenuItems, firebaseLocations, firebaseEmployees, firebaseSuppliers] = await Promise.all([
            getUserData(user.username, 'orders'),
            getUserData(user.username, 'inventory'),
            getUserData(user.username, 'menuItems'),
            getUserData(user.username, 'locations'),
            getUserData(user.username, 'employees'),
            getUserData(user.username, 'suppliers')
          ]);
          
          // Load data with Firebase priority, fallback to localStorage
          setOrders(firebaseOrders.length > 0 ? firebaseOrders : loadFromStorage(`${userKey}_orders`, []));
          setInventory(firebaseInventory.length > 0 ? firebaseInventory : loadFromStorage(`${userKey}_inventory`, []));
          setMenuItems(firebaseMenuItems.length > 0 ? firebaseMenuItems : loadFromStorage(`${userKey}_menu_items`, []));
          setLocations(firebaseLocations.length > 0 ? firebaseLocations : loadFromStorage(`${userKey}_locations`, []));
          setEmployees(firebaseEmployees.length > 0 ? firebaseEmployees : loadFromStorage(`${userKey}_employees`, []));
          setSuppliers(firebaseSuppliers.length > 0 ? firebaseSuppliers : loadFromStorage(`${userKey}_suppliers`, []));
          
          console.log('User data loaded successfully from Firebase/localStorage');
        } catch (error) {
          console.error('Error loading from Firebase, using localStorage:', error);
          // Fallback to localStorage for all data
          setMenuItems(loadFromStorage(`${userKey}_menu_items`, []));
          setInventory(loadFromStorage(`${userKey}_inventory`, []));
          setOrders(loadFromStorage(`${userKey}_orders`, []));
          setLocations(loadFromStorage(`${userKey}_locations`, []));
          setEmployees(loadFromStorage(`${userKey}_employees`, []));
          setSuppliers(loadFromStorage(`${userKey}_suppliers`, []));
        }
      };
      
      loadUserData();
      
      setCurrentUser(user);
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      localStorage.setItem('current_user_key', userKey);
      

      
      // Show trial warning if trial expires soon
      if (user.role !== 'admin' && user.licenseType === 'trial' && user.trialEndDate) {
        const trialEnd = new Date(user.trialEndDate);
        const now = new Date();
        const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 0) {
          alert('🚫 TRIAL EXPIRED\n\nYour trial has ended. Please upgrade to continue.');
          return false;
        } else if (daysLeft <= 2) {
          alert(`⚠️ TRIAL EXPIRING SOON\n\nYour trial expires in ${daysLeft} day(s).\n\nPlease contact admin to upgrade your account before access is restricted.`);
        } else if (daysLeft <= 7) {
          warning(`Trial expires in ${daysLeft} day(s). Contact admin to upgrade.`);
        }
      }
      
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    // Save all current data before logout
    if (currentUser) {
      const userKey = `user_${currentUser.username}`;
      
      // Save to localStorage
      saveToStorage(`${userKey}_inventory`, inventory);
      saveToStorage(`${userKey}_orders`, orders);
      saveToStorage(`${userKey}_menu_items`, menuItems);
      saveToStorage(`${userKey}_locations`, locations);
      saveToStorage(`${userKey}_employees`, employees);
      saveToStorage(`${userKey}_suppliers`, suppliers);
      
      // Save to Firebase
      try {
        const { saveUserData } = await import('../utils/firebase');
        await Promise.all([
          saveUserData(currentUser.username, 'inventory', inventory),
          saveUserData(currentUser.username, 'orders', orders),
          saveUserData(currentUser.username, 'menuItems', menuItems),
          saveUserData(currentUser.username, 'locations', locations),
          saveUserData(currentUser.username, 'employees', employees),
          saveUserData(currentUser.username, 'suppliers', suppliers)
        ]);
        console.log('All data saved successfully before logout');
      } catch (error) {
        console.error('Error saving data to Firebase before logout:', error);
      }
    }
    
    // Clear user session but keep data
    setCurrentUser(null);
    setCurrentTenant(null);
    localStorage.removeItem(AUTH_KEY);
    
    // Reset state to empty arrays (data will be loaded on next login)
    setInventory([]);
    setOrders([]);
    setMenuItems([]);
    setLocations([]);
    setEmployees([]);
    setSuppliers([]);
  };

  const printKitchenInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Kitchen Order #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .order-details { margin-bottom: 20px; }
            .items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items th, .items td { border: 1px solid #000; padding: 8px; text-align: left; }
            .items th { background-color: #f0f0f0; }
            .total { text-align: right; font-weight: bold; font-size: 1.2em; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header">
            <h2>Kitchen Order Ticket</h2>
            <p>Order ID: #${order.id} | Table: ${order.table} | Status: ${order.status}</p>
            <p>Date: ${new Date(order.date).toLocaleString()}</p>
            ${order.customerName ? `<p>Customer: ${order.customerName} | Phone: ${order.customerPhone}</p>` : ''}
          </div>
          <div class="order-details">
            <h3>Items:</h3>
            <table class="items">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">Total Items: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}</div>
          </div>
          <p style="text-align: center; margin-top: 30px;">Prepare and serve promptly!</p>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleNewOrder = async (newOrder) => {
    const orderWithId = {
      ...newOrder,
      id: Date.now(), // Use timestamp as unique ID
      status: "New",
      date: new Date().toISOString(),
      // Cost and Profit properties REMOVED
    };
    const updatedOrders = [...orders, orderWithId];
    setOrders(updatedOrders);
    
    // Save to user-specific storage, Firebase AND MongoDB
    if (currentUser) {
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_orders`, updatedOrders);
      
      try {
        const { saveUserData } = await import('../utils/firebase');
        await saveUserData(currentUser.username, 'orders', updatedOrders);

      } catch (error) {
        console.error('Error saving order to Firebase/MongoDB:', error);
      }
    }
    
    success(`Order #${orderWithId.id} created successfully!`);
    setActiveSection("Kitchen");
  };

  const handleCancelOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      )
    );
  };

  const handlePayOrder = async (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Open" } : order
      )
    );
    success(`Order #${orderId} payment confirmed!`);
  };

  const handleSendToKitchen = async (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "In Preparation" } : order
      )
    );
    success(`Order #${orderId} sent to kitchen!`);
  };

  const handleMarkReady = async (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Ready for Pickup" } : order
      )
    );
    success(`Order #${orderId} is ready for pickup!`);
  };

  // New handler for kitchen status changes
  const handleKitchenStatusChange = async (orderId, newStatus) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      
      // Save to localStorage immediately
      if (currentUser) {
        const userKey = `user_${currentUser.username}`;
        saveToStorage(`${userKey}_orders`, updatedOrders);
        
        // Save to Firebase asynchronously
        import('../utils/firebase').then(({ saveUserData }) => {
          saveUserData(currentUser.username, 'orders', updatedOrders);
        }).catch(error => {
          console.error('Error saving order status to Firebase:', error);
        });
      }
      
      return updatedOrders;
    });
    
    // Show success message
    const statusMessages = {
      "In Preparation": "🔥 Order is now being prepared!",
      "Ready for Pickup": "✅ Order is ready for pickup!",
      "Completed": "🎉 Order completed successfully!"
    };
    
    success(statusMessages[newStatus] || `Order #${orderId} status updated!`);
  };

  const handleCompleteOrder = async (orderId) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        let newInventory = [...inventory];

        // 1. DEDUCT STOCK ONLY (Cost and Profit calculations REMOVED)
        order.items.forEach((item) => {
          let remainingToDeduct = item.quantity;
          newInventory.sort((a, b) => new Date(a.date) - new Date(b.date));

          newInventory = newInventory
            .map((invItem) => {
              if (
                // FIX: Use item.id for the menu item ID check
                invItem.menuItemId === item.id &&
                remainingToDeduct > 0
              ) {
                const deduction = Math.min(invItem.quantity, remainingToDeduct);
                remainingToDeduct -= deduction;
                return { ...invItem, quantity: invItem.quantity - deduction };
              }
              return invItem;
            })
            .filter((invItem) => invItem.quantity > 0);
        });

        // 2. Update Inventory State
        setInventory(newInventory);

        // 3. Return updated order with status change
        return {
          ...order,
          status: "Completed",
          // Cost and Profit properties REMOVED
          dateClosed: new Date().toISOString(),
        };
      });
      
      // Save updated orders to Firebase
      if (currentUser) {
        const userKey = `user_${currentUser.username}`;
        saveToStorage(`${userKey}_orders`, updatedOrders);
        
        // Save to Firebase
        import('../utils/firebase').then(({ saveUserData }) => {
          saveUserData(currentUser.username, 'orders', updatedOrders);
        }).catch(error => {
          console.error('Error saving completed order to Firebase:', error);
        });
      }
      
      return updatedOrders;
    });
  };

  // --- Inventory Handlers ---
  const handleRecordPurchase = async (newPurchase) => {
    const purchaseWithMeta = {
      ...newPurchase,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    const updatedInventory = [...inventory, purchaseWithMeta];
    setInventory(updatedInventory);
    
    // Save to Firebase, localStorage AND MongoDB
    if (currentUser) {
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_inventory`, updatedInventory);
      
      try {
        const { saveUserData } = await import('../utils/firebase');
        await saveUserData(currentUser.username, 'inventory', updatedInventory);

      } catch (error) {
        console.error('Error saving inventory to Firebase/MongoDB:', error);
      }
    }
  };

  const handleDeleteInventoryBatch = (batchId) => {
    const updatedInventory = inventory.filter((batch) => batch.id !== batchId);
    setInventory(updatedInventory);
    
    // Auto-save immediately
    if (currentUser && currentTenant !== undefined) {
      saveData(getTenantKey(`${currentUser.username}_${INVENTORY_KEY_BASE}`, currentTenant), updatedInventory);
    }
  };

  // --- Menu Handlers ---
  const handleAddMenuItem = async (newItem) => {
    const itemWithId = { ...newItem, id: Date.now() };
    const updatedMenuItems = [...menuItems, itemWithId];
    setMenuItems(updatedMenuItems);
    
    // Save to Firebase, localStorage AND MongoDB
    if (currentUser) {
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_menu_items`, updatedMenuItems);
      
      try {
        const { saveUserData } = await import('../utils/firebase');
        await saveUserData(currentUser.username, 'menuItems', updatedMenuItems);

      } catch (error) {
        console.error('Error saving menu item to Firebase/MongoDB:', error);
      }
    }
    
    success(`Menu item "${newItem.name}" added successfully!`);
  };

  const handleEditMenuItem = async (updatedItem) => {
    const updatedMenuItems = menuItems.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    setMenuItems(updatedMenuItems);
    
    // Save to Firebase and localStorage
    if (currentUser) {
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_menu_items`, updatedMenuItems);
      
      try {
        const { saveUserData } = await import('../utils/firebase');
        await saveUserData(currentUser.username, 'menuItems', updatedMenuItems);
      } catch (error) {
        console.error('Error saving menu item changes to Firebase:', error);
      }
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    const item = menuItems.find(m => m.id === itemId);
    const updatedMenuItems = menuItems.filter((item) => item.id !== itemId);
    setMenuItems(updatedMenuItems);
    
    // Save to Firebase and localStorage
    if (currentUser) {
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_menu_items`, updatedMenuItems);
      
      try {
        const { saveUserData } = await import('../utils/firebase');
        await saveUserData(currentUser.username, 'menuItems', updatedMenuItems);
      } catch (error) {
        console.error('Error deleting menu item from Firebase:', error);
      }
    }
    
    success(`Menu item "${item?.name}" deleted successfully!`);
  };

  const handleDeleteOrder = async (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    
    // Save to Firebase
    if (currentUser) {
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_orders`, updatedOrders);
      
      try {
        const { saveUserData } = await import('../utils/firebase');
        await saveUserData(currentUser.username, 'orders', updatedOrders);
      } catch (error) {
        console.error('Error deleting order from Firebase:', error);
      }
    }
    
    success(`Order #${orderId} deleted successfully!`);
  };

  // Location handlers
  const handleAddLocation = (location) => {
    const locationWithId = { ...location, id: Date.now() };
    setLocations((prev) => [...prev, locationWithId]);
  };

  const handleDeleteLocation = (locationId) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
  };

  // Employee handlers
  const handleAddEmployee = (employee) => {
    const employeeWithId = { ...employee, id: Date.now(), createdAt: new Date().toISOString() };
    setEmployees((prev) => [...prev, employeeWithId]);
  };

  const handleDeleteEmployee = (employeeId) => {
    // Find and delete associated user account
    const userAccount = userAccounts.find(user => user.employeeId === employeeId);
    if (userAccount) {
      setUserAccounts((prev) => prev.filter((user) => user.employeeId !== employeeId));
    }
    // Delete employee
    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
  };

  // Supplier handlers
  const handleAddSupplier = (supplier) => {
    const supplierWithId = { ...supplier, id: Date.now(), createdAt: new Date().toISOString() };
    setSuppliers((prev) => [...prev, supplierWithId]);
  };

  const handleDeleteSupplier = (supplierId) => {
    setSuppliers((prev) => prev.filter((sup) => sup.id !== supplierId));
  };

  // User account handlers
  const handleCreateUserAccount = async (employee) => {
    try {
      // Get current user's restaurant info for new users
      const currentUserRestaurant = currentUser?.restaurantName || currentUser?.companyName || 'Restaurant';
      const currentUserLicense = currentUser?.licenseType || 'trial';
      const currentUserSubscription = currentUser?.subscriptionStatus || 'trial';
      
      const newUser = {
        username: employee.username,
        password: employee.password,
        name: employee.name,
        role: employee.role,
        employeeId: employee.id || employee.employeeId,
        tenantId: employee.tenantId || currentTenant || currentUser?.tenantId,
        restaurantName: employee.restaurantName || currentUserRestaurant,
        companyName: employee.companyName || currentUserRestaurant,
        licenseType: employee.licenseType || currentUserLicense,
        trialStartDate: employee.trialStartDate || currentUser?.trialStartDate,
        trialEndDate: employee.trialEndDate || currentUser?.trialEndDate,
        subscriptionStatus: employee.subscriptionStatus || currentUserSubscription,
        email: employee.email || '',
        phone: employee.phone || '',
        createdAt: employee.createdAt || new Date().toISOString(),
        createdBy: currentUser?.username || 'system'
      };
      
      // Save to Firebase (skip admin account)
      if (newUser.username !== 'AmroFagiri') {
        const { saveUser } = await import('../utils/firebase');
        await saveUser(newUser);
        console.log('User saved to Firebase:', newUser.username);

      }
      
      const updatedAccounts = [...userAccounts, newUser];
      setUserAccounts(updatedAccounts);
      
      // Save to multiple storage keys for better persistence
      saveToStorage('global_user_accounts', updatedAccounts);
      
      const allUsers = JSON.parse(localStorage.getItem('all_system_users') || '[]');
      const updatedAllUsers = allUsers.filter(u => u.username !== newUser.username);
      updatedAllUsers.push(newUser);
      localStorage.setItem('all_system_users', JSON.stringify(updatedAllUsers));
      
      success(`User account "${newUser.username}" created successfully!`);
    } catch (error) {
      console.error('Error creating user:', error);
      error(`Failed to create user account: ${error.message}`);
    }
  };

  const handleDeleteUserAccount = async (username) => {
    try {
      // Delete from Firebase (skip admin account)
      if (username !== 'AmroFagiri') {
        const { deleteUser } = await import('../utils/firebase');
        await deleteUser(username);

      }
      
      const updatedAccounts = userAccounts.filter((user) => user.username !== username);
      setUserAccounts(updatedAccounts);
      
      // Save to global shared storage
      saveToStorage('global_user_accounts', updatedAccounts);
      
      success(`User account "${username}" deleted successfully!`);
    } catch (error) {
      console.error('Error deleting user:', error);
      error(`Failed to delete user account: ${error.message}`);
    }
  };

  const handleEditUserAccount = async (oldUsername, updates) => {
    try {
      const updatedUser = userAccounts.find(u => u.username === oldUsername);
      if (updatedUser) {
        const newUserData = { ...updatedUser, ...updates, updatedAt: new Date().toISOString() };
        
        // If username is changing, delete old Firebase entry and create new one
        if (updates.username && updates.username !== oldUsername && oldUsername !== 'AmroFagiri') {
          const { deleteUser, saveUser } = await import('../utils/firebase');
          
          await deleteUser(oldUsername);
          await saveUser(newUserData);
          console.log('User updated in Firebase:', newUserData.username);
        } else if (oldUsername !== 'AmroFagiri') {
          // Just update existing user
          const { saveUser } = await import('../utils/firebase');
          
          await saveUser(newUserData);
          console.log('User updated in Firebase:', newUserData.username);
        }
        
        // Update local state
        const updatedAccounts = userAccounts.map((user) => 
          user.username === oldUsername ? newUserData : user
        );
        setUserAccounts(updatedAccounts);
        
        // Update global storage
        saveToStorage('global_user_accounts', updatedAccounts);
        
        // If username changed, update localStorage auth if it's the current user
        if (updates.username && updates.username !== oldUsername && currentUser?.username === oldUsername) {
          const updatedCurrentUser = { ...currentUser, ...updates };
          setCurrentUser(updatedCurrentUser);
          localStorage.setItem(AUTH_KEY, JSON.stringify(updatedCurrentUser));
        }
        
        // If current user's data was updated, update current user state
        if (currentUser?.username === oldUsername) {
          const updatedCurrentUser = { ...currentUser, ...updates };
          setCurrentUser(updatedCurrentUser);
          localStorage.setItem(AUTH_KEY, JSON.stringify(updatedCurrentUser));
        }
        
        // Show upgrade notification if license type changed
        if (updates.licenseType && updates.licenseType !== updatedUser.licenseType) {
          success(`Account upgraded to ${updates.licenseType.toUpperCase()} plan! New features unlocked.`);
        } else {
          success(`User account updated successfully!`);
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
      error('Failed to update user account.');
    }
  };
  
  const handlePasswordChange = async (newPassword) => {
    try {
      await handleEditUserAccount(currentUser.username, { password: newPassword });
    } catch (error) {
      throw error;
    }
  };



  // --- RENDER ---
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2em'
      }}>
        Loading...
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <LoginForm
        onLogin={handleLogin}
        users={userAccounts} // Pass the dynamic user list for local validation
      />
    );
  }

  return (
    <>
      <IdleAnimation />
      <MainLayout
        currentUser={currentUser}
        onLogout={handleLogout}
        inventory={inventory}
        orders={orders}
        menuItems={menuItems}
        locations={locations}
        employees={employees}
        suppliers={suppliers}
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        onNewOrder={handleNewOrder}
        onCancelOrder={handleCancelOrder}
        onPayOrder={handlePayOrder}
        onSendToKitchen={handleSendToKitchen}
        onMarkReady={handleMarkReady}
        onCompleteOrder={handleCompleteOrder}
        onKitchenStatusChange={handleKitchenStatusChange}
        onRecordPurchase={handleRecordPurchase}
        onDeleteInventoryBatch={handleDeleteInventoryBatch}
        onAddMenuItem={handleAddMenuItem}
        onEditMenuItem={handleEditMenuItem}
        onDeleteMenuItem={handleDeleteMenuItem}
        onDeleteOrder={handleDeleteOrder}
        onAddLocation={handleAddLocation}
        onDeleteLocation={handleDeleteLocation}
        onAddEmployee={handleAddEmployee}
        onDeleteEmployee={handleDeleteEmployee}
        onAddSupplier={handleAddSupplier}
        onDeleteSupplier={handleDeleteSupplier}
        userAccounts={userAccounts}
        onCreateUserAccount={handleCreateUserAccount}
        onDeleteUserAccount={handleDeleteUserAccount}
        onEditUserAccount={handleEditUserAccount}
        onPasswordChange={handlePasswordChange}

        activeSection={activeSection}
        setActiveSection={setActiveSection}
        showToast={{ success, error, warning, info }}
      />
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}

export default App;
