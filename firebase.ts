// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFTKeehznnI15fLXWWFQw44Jj6Fg2Z2RA",
  authDomain: "strikeleaguefinal.firebaseapp.com",
  projectId: "strikeleaguefinal",
  storageBucket: "strikeleaguefinal.firebasestorage.app",
  messagingSenderId: "751938608902",
  appId: "1:751938608902:web:a6cb84661fb6c42f710887"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore database
export const db = getFirestore(app);