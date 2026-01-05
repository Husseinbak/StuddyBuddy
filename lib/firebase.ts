import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtiGoM1YADTRPnDGyBgDbdAGUliJX0gmw",
  authDomain: "study-buddy-437bc.firebaseapp.com",
  projectId: "study-buddy-437bc",
  storageBucket: "study-buddy-437bc.firebasestorage.app",
  messagingSenderId: "894173809878",
  appId: "1:894173809878:web:b516748367da9ccb8ccd77",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
