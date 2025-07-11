import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRjO282vp070P3LrQ7JmwIZTq49ymVOLg",
  authDomain: "marcozero-19b64.firebaseapp.com",
  projectId: "marcozero-19b64",
  storageBucket: "marcozero-19b64.firebasestorage.app",
  messagingSenderId: "983441859241",
  appId: "1:983441859241:web:94b100c771027e18b47fb8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
