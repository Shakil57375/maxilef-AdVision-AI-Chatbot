// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhejZx3MXIQciEZHmrceUloYAo0QwqZdY",
  authDomain: "maxilef.firebaseapp.com",
  projectId: "maxilef",
  storageBucket: "maxilef.firebasestorage.app",
  messagingSenderId: "764469192648",
  appId: "1:764469192648:web:f922a4cc4966e49da902fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export {app}