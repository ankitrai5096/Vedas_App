// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0khNXx-4u-2zIA3OUAhrGVh4THnCLdUc",
  authDomain: "ved-prakash-c4017.firebaseapp.com",
  projectId: "ved-prakash-c4017",
  storageBucket: "ved-prakash-c4017.appspot.com",
  messagingSenderId: "318451475423",
  appId: "1:318451475423:web:11a5a27b95d851a17ada6a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
