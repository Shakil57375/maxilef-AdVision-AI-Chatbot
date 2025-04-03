// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtokxoXM4XlK_j5sFe0xLvIdLUqCWCbf0",
  authDomain: "ag-court-1f9ea.firebaseapp.com",
  projectId: "ag-court-1f9ea",
  storageBucket: "ag-court-1f9ea.firebasestorage.app",
  messagingSenderId: "921561902533",
  appId: "1:921561902533:web:8ad5e06651b7873cc72fac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export  {app};