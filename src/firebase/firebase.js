import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyADXNY3A8WEWkDr9IETlZQfAINwXrYHIs0',
  authDomain: 'planner-3a5de.firebaseapp.com',
  projectId: 'planner-3a5de', 
  storageBucket: 'planner-3a5de.appspot.com',
  messagingSenderId: '325950812067',
  appId: '1:325950812067:web:13ad664d85659d49b73416',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();