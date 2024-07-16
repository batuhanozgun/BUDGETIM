// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, deleteUser, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6Gc3fUuugjeOjG3KkdvOMVB5U8Z6HL6k",
  authDomain: "budgetim001.firebaseapp.com",
  projectId: "budgetim001",
  storageBucket: "budgetim001.appspot.com",
  messagingSenderId: "422348614250",
  appId: "1:422348614250:web:8ff1054d974fe44501b813"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, deleteUser, doc, setDoc, updateDoc, getDoc, collection, getDocs, addDoc, deleteDoc, functions, httpsCallable, setPersistence, browserLocalPersistence, browserSessionPersistence };
