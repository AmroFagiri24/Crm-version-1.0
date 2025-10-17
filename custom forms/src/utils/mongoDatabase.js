import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://amrofagiri24_db_user:MdrB73OPBKyM2urc@cluster0.s8me4tw.mongodb.net/crm_database?retryWrites=true&w=majority';

let client;
let db;

const connectToMongoDB = async () => {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('crm_database');
  }
  return db;
};

// Generic CRUD operations
export const saveDocument = async (collection, document, uniqueField = '_id') => {
  try {
    const database = await connectToMongoDB();
    const coll = database.collection(collection);
    
    const filter = uniqueField === '_id' ? { _id: document._id } : { [uniqueField]: document[uniqueField] };
    
    await coll.replaceOne(filter, document, { upsert: true });
    console.log(`Document saved to ${collection}`);
  } catch (error) {
    console.error(`Error saving to ${collection}:`, error);
    throw error;
  }
};

export const getDocument = async (collection, filter) => {
  try {
    const database = await connectToMongoDB();
    const coll = database.collection(collection);
    return await coll.findOne(filter);
  } catch (error) {
    console.error(`Error getting from ${collection}:`, error);
    return null;
  }
};

export const getAllDocuments = async (collection, filter = {}) => {
  try {
    const database = await connectToMongoDB();
    const coll = database.collection(collection);
    return await coll.find(filter).toArray();
  } catch (error) {
    console.error(`Error getting all from ${collection}:`, error);
    return [];
  }
};

export const deleteDocument = async (collection, filter) => {
  try {
    const database = await connectToMongoDB();
    const coll = database.collection(collection);
    await coll.deleteOne(filter);
    console.log(`Document deleted from ${collection}`);
  } catch (error) {
    console.error(`Error deleting from ${collection}:`, error);
    throw error;
  }
};

// Users
export const saveUser = async (userData) => {
  return saveDocument('users', { ...userData, created_at: new Date(), updated_at: new Date() }, 'username');
};

export const getUser = async (username) => {
  return getDocument('users', { username });
};

export const getAllUsers = async () => {
  return getAllDocuments('users');
};

export const deleteUser = async (username) => {
  return deleteDocument('users', { username });
};

// Restaurants
export const saveRestaurant = async (restaurantData) => {
  return saveDocument('restaurants', { ...restaurantData, created_at: new Date(), updated_at: new Date() }, 'tenant_id');
};

export const getRestaurant = async (tenant_id) => {
  return getDocument('restaurants', { tenant_id });
};

export const getAllRestaurants = async () => {
  return getAllDocuments('restaurants');
};

export const deleteRestaurant = async (tenant_id) => {
  return deleteDocument('restaurants', { tenant_id });
};

// User Data (flexible data storage)
export const saveUserData = async (username, data_type, data) => {
  const userData = {
    username,
    data_type,
    data,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  try {
    const database = await connectToMongoDB();
    const coll = database.collection('user_data');
    await coll.replaceOne({ username, data_type }, userData, { upsert: true });
    console.log(`User data saved: ${username} - ${data_type}`);
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const getUserData = async (username, data_type) => {
  return getDocument('user_data', { username, data_type });
};

export const getAllUserData = async (username) => {
  return getAllDocuments('user_data', { username });
};

export const deleteUserData = async (username, data_type) => {
  return deleteDocument('user_data', { username, data_type });
};

// Menu Items
export const saveMenuItem = async (menuItem) => {
  return saveDocument('menu_items', { ...menuItem, created_at: new Date(), updated_at: new Date() }, 'id');
};

export const getMenuItem = async (id) => {
  return getDocument('menu_items', { id });
};

export const getAllMenuItems = async (tenant_id) => {
  return getAllDocuments('menu_items', { tenant_id });
};

export const deleteMenuItem = async (id) => {
  return deleteDocument('menu_items', { id });
};

// Orders
export const saveOrder = async (order) => {
  return saveDocument('orders', { ...order, created_at: new Date(), updated_at: new Date() }, 'id');
};

export const getOrder = async (id) => {
  return getDocument('orders', { id });
};

export const getAllOrders = async (tenant_id) => {
  return getAllDocuments('orders', { tenant_id });
};

// Inventory
export const saveInventoryItem = async (item) => {
  return saveDocument('inventory', { ...item, created_at: new Date(), updated_at: new Date() }, 'id');
};

export const getAllInventory = async (tenant_id) => {
  return getAllDocuments('inventory', { tenant_id });
};

// Employees
export const saveEmployee = async (employee) => {
  return saveDocument('employees', { ...employee, created_at: new Date(), updated_at: new Date() }, 'id');
};

export const getAllEmployees = async (tenant_id) => {
  return getAllDocuments('employees', { tenant_id });
};

// Suppliers
export const saveSupplier = async (supplier) => {
  return saveDocument('suppliers', { ...supplier, created_at: new Date(), updated_at: new Date() }, 'id');
};

export const getAllSuppliers = async (tenant_id) => {
  return getAllDocuments('suppliers', { tenant_id });
};

// Sales Reports
export const saveSalesReport = async (report) => {
  return saveDocument('sales_reports', { ...report, created_at: new Date() }, 'id');
};

export const getSalesReports = async (tenant_id, dateRange) => {
  const filter = { tenant_id };
  if (dateRange) {
    filter.date = { $gte: dateRange.start, $lte: dateRange.end };
  }
  return getAllDocuments('sales_reports', filter);
};

export const closeMongoDB = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};