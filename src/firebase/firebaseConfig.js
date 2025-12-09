// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC7DcfQMamZa8UKQCrUdZrkpKVbkVH6tWs',
  authDomain: 'fishingtirpper.firebaseapp.com',
  projectId: 'fishingtirpper',
  storageBucket: 'fishingtirpper.firebasestorage.app',
  messagingSenderId: '103198651245',
  appId: '1:103198651245:web:00614de298ad85cb51a064',
  measurementId: 'G-LCJSV6NW2S',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
