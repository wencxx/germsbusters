import { initializeApp } from "firebase/app";
import { initializeFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
const auth = getAuth(app);

const db = initializeFirestore(app, {
  cacheSizeBytes: 1048576 
});

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.error("Persistence failed, multiple tabs open.");
    } else if (err.code === 'unimplemented') {
      console.error("Persistence is not available in this browser.");
    }
  });

export {
  app,
  db,
  auth
};
