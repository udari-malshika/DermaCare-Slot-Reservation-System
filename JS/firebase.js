
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpw6puFmJkUpW9UvbyFVjSwrr41578IJA",
  authDomain: "dermocare-9a089.firebaseapp.com",
  projectId: "dermocare-9a089",
  storageBucket: "dermocare-9a089.firebasestorage.app",
  messagingSenderId: "914680118573",
  appId: "1:914680118573:web:49a735bc204d537dec67a4",
  measurementId: "G-T3KXPX9L38"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("DermoCare Firebase initialized!");
