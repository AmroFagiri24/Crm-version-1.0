// Simplified App.jsx without Firebase dependencies
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
} from "../utils/dataStorage";

const LOCATIONS_KEY = "locations";
const EMPLOYEES_KEY = "employees";
const SUPPLIERS_KEY = "suppliers";
const AUTH_KEY = "crm_auth_status";

const CUSTOMER_CREDENTIALS = [
  { username: "AmroFagiri", password: "K93504241Aa", name: "System Admin", role: "admin", tenantId: null }
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [userAccounts, setUserAccounts] = useState(CUSTOMER_CREDENTIALS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [activeSection, setActiveSection] = useState("Dashboard");
  
  const { toasts, removeToast, success, error, warning, info } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setCurrentTenant(user.tenantId);

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

  const handleLogin = (user) => {
    if (user) {
      const userKey = `user_${user.username}`;
      setCurrentTenant(user.tenantId);
      
      setMenuItems(loadFromStorage(`${userKey}_menu_items`, []));
      setInventory(loadFromStorage(`${userKey}_inventory`, []));
      setOrders(loadFromStorage(`${userKey}_orders`, []));
      setLocations(loadFromStorage(`${userKey}_locations`, []));
      setEmployees(loadFromStorage(`${userKey}_employees`, []));
      setSuppliers(loadFromStorage(`${userKey}_suppliers`, []));
      
      setCurrentUser(user);
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      localStorage.setItem('current_user_key', userKey);
      
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    if (currentUser) {
      const userKey = `user_${currentUser.username}`;
      
      saveToStorage(`${userKey}_inventory`, inventory);
      saveToStorage(`${userKey}_orders`, orders);
      saveToStorage(`${userKey}_menu_items`, menuItems);
      saveToStorage(`${userKey}_locations`, locations);
      saveToStorage(`${userKey}_employees`, employees);
      saveToStorage(`${userKey}_suppliers`, suppliers);
    }
    
    setCurrentUser(null);
    setCurrentTenant(null);
    localStorage.removeItem(AUTH_KEY);
    
    setInventory([]);
    setOrders([]);
    setMenuItems([]);
    setLocations([]);
    setEmployees([]);
    setSuppliers([]);
  };

  const handleNewOrder = (newOrder) => {
    const orderWithId = {
      ...newOrder,
      id: Date.now(),
      status: "New",
      date: new Date().toISOString(),
    };
    const updatedOrders = [...orders, orderWithId];
    setOrders(updatedOrders);
    
    if (currentUser) {
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_orders`, updatedOrders);
    }
    
    success(`Order #${orderWithId.id} created successfully!`);
    setActiveSection("Kitchen");
  };

  const handleAddMenuItem = (newItem) => {
    const itemWithId = { ...newItem, id: Date.now() };
    const updatedMenuItems = [...menuItems, itemWithId];
    setMenuItems(updatedMenuItems);
    
    if (currentUser) {
      const userKey = `user_${currentUser.username}`;
      saveToStorage(`${userKey}_menu_items`, updatedMenuItems);
    }
    
    success(`Menu item "${newItem.name}" added successfully!`);
  };

  // Minimal handlers for other functions
  const handleCompleteOrder = (orderId) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: "Completed" } : order
      )
    );
  };

  const handleCancelOrder = (orderId) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      )
    );
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const handleEditMenuItem = (updatedItem) => {
    setMenuItems(prevItems => 
      prevItems.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
  };

  const handleDeleteMenuItem = (itemId) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleRecordPurchase = (newPurchase) => {
    const purchaseWithMeta = {
      ...newPurchase,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setInventory(prev => [...prev, purchaseWithMeta]);
  };

  const handleDeleteInventoryBatch = (batchId) => {
    setInventory(prev => prev.filter(batch => batch.id !== batchId));
  };

  const handleAddLocation = (location) => {
    setLocations(prev => [...prev, { ...location, id: Date.now() }]);
  };

  const handleDeleteLocation = (locationId) => {
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
  };

  const handleAddEmployee = (employee) => {
    setEmployees(prev => [...prev, { ...employee, id: Date.now() }]);
  };

  const handleDeleteEmployee = (employeeId) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  const handleAddSupplier = (supplier) => {
    setSuppliers(prev => [...prev, { ...supplier, id: Date.now() }]);
  };

  const handleDeleteSupplier = (supplierId) => {
    setSuppliers(prev => prev.filter(sup => sup.id !== supplierId));
  };

  const handleCreateUserAccount = (employee) => {
    const newUser = {
      ...employee,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setUserAccounts(prev => [...prev, newUser]);
    success(`User account "${newUser.username}" created successfully!`);
  };

  const handleDeleteUserAccount = (username) => {
    setUserAccounts(prev => prev.filter(user => user.username !== username));
    success(`User account "${username}" deleted successfully!`);
  };

  const handleEditUserAccount = (oldUsername, updates) => {
    setUserAccounts(prev => 
      prev.map(user => 
        user.username === oldUsername ? { ...user, ...updates } : user
      )
    );
    success("User account updated successfully!");
  };

  const handlePasswordChange = (newPassword) => {
    handleEditUserAccount(currentUser.username, { password: newPassword });
  };

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
        users={userAccounts}
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
        onCompleteOrder={handleCompleteOrder}
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