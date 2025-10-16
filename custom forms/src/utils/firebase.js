import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdBYsfMQRQRo_RAX8TlntumGpRSG9pfhc",
  authDomain: "possystem-f3d55.firebaseapp.com",
  projectId: "possystem-f3d55",
  storageBucket: "possystem-f3d55.firebasestorage.app",
  messagingSenderId: "127781304851",
  appId: "1:127781304851:web:bdfb5194f36787a24d1de6",
  measurementId: "G-4YJ1BPVWMF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// User Management
export const saveUser = async (userData) => {
  try {
    console.log('Saving user to Firebase:', userData.username);
    await setDoc(doc(db, 'users', userData.username), userData);
    console.log('User saved successfully to Firebase:', userData.username);
  } catch (error) {
    console.error('Error saving user to Firebase:', error);
    throw error;
  }
};

export const getUser = async (username) => {
  try {
    const docRef = doc(db, 'users', username);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.exists() ? docSnap.data() : null;
    if (userData) {
      console.log('User found in Firebase:', username);
    }
    return userData;
  } catch (error) {
    console.error('Error getting user from Firebase:', error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(doc => doc.data());
    console.log('Retrieved users from Firebase:', users.length);
    return users;
  } catch (error) {
    console.error('Error getting all users from Firebase:', error);
    return [];
  }
};

export const deleteUser = async (username) => {
  try {
    console.log('Deleting user from Firebase:', username);
    await deleteDoc(doc(db, 'users', username));
    console.log('User deleted successfully from Firebase:', username);
  } catch (error) {
    console.error('Error deleting user from Firebase:', error);
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
  await setDoc(doc(db, 'restaurants', restaurantData.tenantId), restaurantData);
};

export const getAllRestaurants = async () => {
  const querySnapshot = await getDocs(collection(db, 'restaurants'));
  return querySnapshot.docs.map(doc => doc.data());
};

export const deleteRestaurant = async (tenantId) => {
  await deleteDoc(doc(db, 'restaurants', tenantId));
};

// User Data Management
export const saveUserData = async (username, dataType, data) => {
  await setDoc(doc(db, 'userData', `${username}_${dataType}`), { data });
};

export const getUserData = async (username, dataType) => {
  const docRef = doc(db, 'userData', `${username}_${dataType}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().data : [];
};

export default db;