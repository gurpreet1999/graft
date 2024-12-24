import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);

// Initialize Firebase

const app = initializeApp({
  apiKey: "AIzaSyAMs_grW8dpJewMp05I_XIS7ka1sOJu-9c",
  authDomain: "graft-c27b4.firebaseapp.com",
  projectId: "graft-c27b4",
  storageBucket: "graft-c27b4.firebasestorage.app",
  messagingSenderId: "1033227126858",
  appId: "1:1033227126858:web:08ea7b0b73919a5d8ebeb3",
  measurementId: "G-JVBLTXXDMJ",
});

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
