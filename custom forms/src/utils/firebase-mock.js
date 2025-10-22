// Mock Firebase functions for development
export const saveUser = async (userData) => {
  console.log('Mock: Saving user:', userData.username);
  return Promise.resolve();
};

export const getUser = async (username) => {
  console.log('Mock: Getting user:', username);
  return null;
};

export const getAllUsers = async () => {
  console.log('Mock: Getting all users');
  return [];
};

export const deleteUser = async (username) => {
  console.log('Mock: Deleting user:', username);
  return Promise.resolve();
};

export const checkUsernameExists = async (username) => {
  console.log('Mock: Checking username:', username);
  return false;
};

export const saveRestaurant = async (restaurantData) => {
  console.log('Mock: Saving restaurant:', restaurantData);
  return Promise.resolve();
};

export const getAllRestaurants = async () => {
  console.log('Mock: Getting all restaurants');
  return [];
};

export const deleteRestaurant = async (tenantId) => {
  console.log('Mock: Deleting restaurant:', tenantId);
  return Promise.resolve();
};

export const saveUserData = async (username, dataType, data) => {
  console.log('Mock: Saving user data:', username, dataType);
  return Promise.resolve();
};

export const getUserData = async (username, dataType) => {
  console.log('Mock: Getting user data:', username, dataType);
  return [];
};

const db = {};
export default db;