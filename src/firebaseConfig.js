// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7vFisoP7xcK0Q-QB_zErK2kirbNxXb-U",
  authDomain: "aiinterview-44e44.firebaseapp.com",
  projectId: "aiinterview-44e44",
  storageBucket: "aiinterview-44e44.appspot.com",
  messagingSenderId: "371003614500",
  appId: "1:371003614500:web:94b2f7709971724f18ffb1",
  measurementId: "G-VNB17GP18C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Initialize providers
const googleProvider = new GoogleAuthProvider();

// Export initialized services and providers
export { app, auth, db, functions, googleProvider };