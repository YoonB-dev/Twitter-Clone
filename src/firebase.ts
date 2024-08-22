import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC63GXL-b039N7ppVDKX8juRnVfGbnFrM4",
  authDomain: "twitter-reloaded-aba54.firebaseapp.com",
  projectId: "twitter-reloaded-aba54",
  storageBucket: "twitter-reloaded-aba54.appspot.com",
  messagingSenderId: "499477233943",
  appId: "1:499477233943:web:764bb878b4b073f244b752"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);     