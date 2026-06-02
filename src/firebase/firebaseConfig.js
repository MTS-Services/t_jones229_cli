/** @format */

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZK6rqUABRzuT8WoH4LLAcZUyKTfFTnDo",
  authDomain: "the-fishing-hub.firebaseapp.com",
  projectId: "the-fishing-hub",
  storageBucket: "the-fishing-hub.firebasestorage.app",
  messagingSenderId: "1018255801928",
  appId: "1:1018255801928:web:c57e75ac50c09afe53a27d",
  measurementId: "G-DTRMZ3YXZ8"
};
// Initialize Firebase only on client side and only once
let app;
let auth;

if (typeof window !== "undefined") {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { auth };
