// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSpS-3fI_w2DOFDspla361smvD9x5SHys",
  authDomain: "antibodyinventory-740f2.firebaseapp.com",
  projectId: "antibodyinventory-740f2",
  storageBucket: "antibodyinventory-740f2.firebasestorage.app",
  messagingSenderId: "738358171369",
  appId: "1:738358171369:web:5dbe461379776e7ce24278"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
