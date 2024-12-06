import { initializeApp } from "firebase/app";
import { initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { initializeAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDBfeBPhQh0359_rnSqNvadbIlqSwomE6c",
  authDomain: "germsbuster-b7b66.firebaseapp.com",
  projectId: "germsbuster-b7b66",
  storageBucket: "germsbuster-b7b66.firebasestorage.app",
  messagingSenderId: "457511774991",
  appId: "1:457511774991:web:3959c15d42c9817c712c7a",
  measurementId: "G-19EKXDWPM5"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app);

export {
  app,
  db,
  storage,
  auth
}