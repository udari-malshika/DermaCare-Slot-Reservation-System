import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAv65a5ktTExi-WUq68_K1DaAmXUGXoDhk",
  authDomain: "dermocare-c8a51.firebaseapp.com",
  projectId: "dermocare-c8a51",
  storageBucket: "dermocare-c8a51.firebasestorage.app",
  messagingSenderId: "22556805907",
  appId: "1:22556805907:web:39ffcfcd39a555b06e68e6",
  measurementId: "G-MEM8XV9W6M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);