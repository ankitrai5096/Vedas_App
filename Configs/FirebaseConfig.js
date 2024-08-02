// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBhPa7y6qSfKP1uABbE4GsiOTOYsy-ivw",
  authDomain: "native-app-39c4d.firebaseapp.com",
  projectId: "native-app-39c4d",
  storageBucket: "native-app-39c4d.appspot.com",
  messagingSenderId: "850623703376",
  appId: "1:850623703376:web:69d800ac4a50120e2d6455",
  measurementId: "G-QQWC30TTXV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
