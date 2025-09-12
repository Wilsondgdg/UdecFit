// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBa1PMKMct5yanIa7ZV34klWt137pBW6g8",
  authDomain: "udecfit-b6d1f.firebaseapp.com",
  projectId: "udecfit-b6d1f",
  storageBucket: "udecfit-b6d1f.firebasestorage.app",
  messagingSenderId: "15781402606",
  appId: "1:15781402606:web:dc60388515159ba3b120ff"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
