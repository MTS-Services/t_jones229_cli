// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

  // Rahat configuration
  // apiKey: "AIzaSyDkMs6OJUSKbfx2qYNXFfhisqAF5mkjfs0",
  // authDomain: "fishing-tripper.firebaseapp.com",
  // projectId: "fishing-tripper",
  // storageBucket: "fishing-tripper.firebasestorage.app",
  // messagingSenderId: "735137753039",
  // appId: "1:735137753039:web:9997d717548ac3ea9cd4ba",
  // measurementId: "G-GPH27H1334",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

//client configuration

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
// apiKey: "AIzaSyC7DcfQMamZa8UKQCrUdZrkpKVbkVH6tWs",
// authDomain: "fishingtirpper.firebaseapp.com",
// projectId: "fishingtirpper",
// storageBucket: "fishingtirpper.firebasestorage.app",
// messagingSenderId: "103198651245",
// appId: "1:103198651245:web:00614de298ad85cb51a064",
// measurementId: "G-LCJSV6NW2S"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
