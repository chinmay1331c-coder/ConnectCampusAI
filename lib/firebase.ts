import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDIHPQshORiAgxCCUoci9pPdwjNpcBslbM",
  authDomain: "campusconnect-ai-4a60c.firebaseapp.com",
  projectId: "campusconnect-ai-4a60c",
  storageBucket: "campusconnect-ai-4a60c.firebasestorage.app",
  messagingSenderId: "730836147214",
  appId: "1:730836147214: web:a79e74ddb83de2d2a6f05f",
  measurementId: "G-TYFCC3JXS1",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider =
  new GoogleAuthProvider();

export const db = getFirestore(app);