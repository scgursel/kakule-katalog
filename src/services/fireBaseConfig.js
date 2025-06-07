// src/services/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// YUKARIDA KOPYALADIĞINIZ CONFIG'İ BURAYA YAPIŞTIRIN
// Import the functions you need from the SDKs you need

const firebaseConfig = {
  apiKey: "AIzaSyAAotyh5_S9a6_xkaHEQpmAdCwi5-lw2N8",
  authDomain: "kakule-katalog.firebaseapp.com",
  projectId: "kakule-katalog",
  storageBucket: "kakule-katalog.firebasestorage.app",
  messagingSenderId: "878728651691",
  appId: "1:878728651691:web:276fe421b9c9381db4a8ee"
};



// Firebase initialize
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;