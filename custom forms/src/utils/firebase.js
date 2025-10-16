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
  await setDoc(doc(db, 'users', userData.username), userData);
};

export const getUser = async (username) => {
  const docRef = doc(db, 'users', username);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => doc.data());
};

export const deleteUser = async (username) => {
  await deleteDoc(doc(db, 'users', username));
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