import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6Gc3fUuugjeOjG3KkdvOMVB5U8Z6HL6k",
  authDomain: "budgetim001.firebaseapp.com",
  projectId: "budgetim001",
  storageBucket: "budgetim001.appspot.com",
  messagingSenderId: "422348614250",
  appId: "1:422348614250:web:8ff1054d974fe44501b813"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, doc, setDoc, updateDoc, getDoc };
