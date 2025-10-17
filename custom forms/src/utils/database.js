import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://username:password@docdb-cluster.cluster-xyz.us-east-1.docdb.amazonaws.com:27017/?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false';

const client = new MongoClient(uri, {
  ssl: true,
  sslValidate: false,
  sslCA: process.env.SSL_CA_PATH
});

let db;

const connectDB = async () => {
  if (!db) {
    await client.connect();
    db = client.db('crm_database');
  }
  return db;
};

// User Management
export const saveUser = async (userData) => {
  try {
    console.log('Saving user to DocumentDB:', userData.username);
    const database = await connectDB();
    const users = database.collection('users');
    
    await users.replaceOne(
      { username: userData.username },
      {
        username: userData.username,
        password: userData.password,
        role: userData.role,
        email: userData.email,
        phone: userData.phone,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { upsert: true }
    );
    console.log('User saved successfully to DocumentDB:', userData.username);
  } catch (error) {
    console.error('Error saving user to DocumentDB:', error);
    throw error;
  }
};

export const getUser = async (username) => {
  try {
    const database = await connectDB();
    const users = database.collection('users');
    const userData = await users.findOne({ username });
    if (userData) {
      console.log('User found in DocumentDB:', username);
    }
    return userData;
  } catch (error) {
    console.error('Error getting user from DocumentDB:', error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const database = await connectDB();
    const users = database.collection('users');
    const result = await users.find({}).sort({ createdAt: -1 }).toArray();
    console.log('Retrieved users from DocumentDB:', result.length);
    return result;
  } catch (error) {
    console.error('Error getting all users from DocumentDB:', error);
    return [];
  }
};

export const deleteUser = async (username) => {
  try {
    console.log('Deleting user from DocumentDB:', username);
    const database = await connectDB();
    const users = database.collection('users');
    await users.deleteOne({ username });
    console.log('User deleted successfully from DocumentDB:', username);
  } catch (error) {
    console.error('Error deleting user from DocumentDB:', error);
    throw error;
  }
};

export const checkUsernameExists = async (username) => {
  try {
    const user = await getUser(username);
    return user !== null;
  } catch (error) {
    console.error('Error checking username existence:', error);
    return false;
  }
};

// Restaurant Management
export const saveRestaurant = async (restaurantData) => {
  const database = await connectDB();
  const restaurants = database.collection('restaurants');
  
  await restaurants.replaceOne(
    { tenantId: restaurantData.tenantId },
    {
      tenantId: restaurantData.tenantId,
      name: restaurantData.name,
      address: restaurantData.address,
      phone: restaurantData.phone,
      email: restaurantData.email,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { upsert: true }
  );
};

export const getAllRestaurants = async () => {
  const database = await connectDB();
  const restaurants = database.collection('restaurants');
  return await restaurants.find({}).sort({ createdAt: -1 }).toArray();
};

export const deleteRestaurant = async (tenantId) => {
  const database = await connectDB();
  const restaurants = database.collection('restaurants');
  await restaurants.deleteOne({ tenantId });
};

// Menu Items Management
export const saveMenuItem = async (userId, menuItem) => {
  const database = await connectDB();
  const menuItems = database.collection('menu_items');
  
  await menuItems.insertOne({
    ...menuItem,
    userId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getMenuItems = async (userId) => {
  const database = await connectDB();
  const menuItems = database.collection('menu_items');
  return await menuItems.find({ userId, isActive: true }).toArray();
};

export const deleteMenuItem = async (userId, itemId) => {
  const database = await connectDB();
  const menuItems = database.collection('menu_items');
  await menuItems.updateOne(
    { _id: itemId, userId },
    { $set: { isActive: false, updatedAt: new Date() } }
  );
};

// Orders Management
export const saveOrder = async (userId, orderData) => {
  const database = await connectDB();
  const orders = database.collection('orders');
  
  await orders.insertOne({
    ...orderData,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getOrders = async (userId) => {
  const database = await connectDB();
  const orders = database.collection('orders');
  return await orders.find({ userId }).sort({ date: -1 }).toArray();
};

export const updateOrderStatus = async (userId, orderId, status) => {
  const database = await connectDB();
  const orders = database.collection('orders');
  await orders.updateOne(
    { _id: orderId, userId },
    { $set: { status, updatedAt: new Date() } }
  );
};

// Inventory Management
export const saveInventoryBatch = async (userId, inventoryData) => {
  const database = await connectDB();
  const inventory = database.collection('inventory');
  
  await inventory.insertOne({
    ...inventoryData,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getInventory = async (userId) => {
  const database = await connectDB();
  const inventory = database.collection('inventory');
  return await inventory.find({ userId }).sort({ date: -1 }).toArray();
};

export const deleteInventoryBatch = async (userId, batchId) => {
  const database = await connectDB();
  const inventory = database.collection('inventory');
  await inventory.deleteOne({ _id: batchId, userId });
};

// Employees Management
export const saveEmployee = async (userId, employeeData) => {
  const database = await connectDB();
  const employees = database.collection('employees');
  
  await employees.insertOne({
    ...employeeData,
    userId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getEmployees = async (userId) => {
  const database = await connectDB();
  const employees = database.collection('employees');
  return await employees.find({ userId, isActive: true }).toArray();
};

// Suppliers Management
export const saveSupplier = async (userId, supplierData) => {
  const database = await connectDB();
  const suppliers = database.collection('suppliers');
  
  await suppliers.insertOne({
    ...supplierData,
    userId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getSuppliers = async (userId) => {
  const database = await connectDB();
  const suppliers = database.collection('suppliers');
  return await suppliers.find({ userId, isActive: true }).toArray();
};

// User Data Management (Legacy support)
export const saveUserData = async (username, dataType, data) => {
  const database = await connectDB();
  const userData = database.collection('user_data');
  
  await userData.replaceOne(
    { username, dataType },
    {
      username,
      dataType,
      data,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { upsert: true }
  );
};

export const getUserData = async (username, dataType) => {
  const database = await connectDB();
  const userData = database.collection('user_data');
  const result = await userData.findOne({ username, dataType });
  return result ? result.data : [];
};

export default client;