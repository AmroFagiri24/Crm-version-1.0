import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://amrofagiri24_db_user:MdrB73OPBKyM2urc@cluster0.s8me4tw.mongodb.net/?retryWrites=true&w=majority';

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

// Save user to MongoDB
export const saveUserToMongoDB = async (userData) => {
  try {
    const database = await connectToMongoDB();
    const users = database.collection('users');
    
    await users.replaceOne(
      { username: userData.username },
      userData,
      { upsert: true }
    );
    
    console.log('User saved to MongoDB:', userData.username);
  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
    throw error;
  }
};

// Get user from MongoDB
export const getUserFromMongoDB = async (username) => {
  try {
    const database = await connectToMongoDB();
    const users = database.collection('users');
    
    const user = await users.findOne({ username });
    return user;
  } catch (error) {
    console.error('Error getting user from MongoDB:', error);
    return null;
  }
};

// Get all users from MongoDB
export const getAllUsersFromMongoDB = async () => {
  try {
    const database = await connectToMongoDB();
    const users = database.collection('users');
    
    const userList = await users.find({}).toArray();
    return userList;
  } catch (error) {
    console.error('Error getting all users from MongoDB:', error);
    return [];
  }
};

// Delete user from MongoDB
export const deleteUserFromMongoDB = async (username) => {
  try {
    const database = await connectToMongoDB();
    const users = database.collection('users');
    
    await users.deleteOne({ username });
    console.log('User deleted from MongoDB:', username);
  } catch (error) {
    console.error('Error deleting user from MongoDB:', error);
    throw error;
  }
};

export const closeMongoDB = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};