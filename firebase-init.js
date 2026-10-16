import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, setDoc, doc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-pNaOwoA7cgKe3DM6Di0L_EBD3v_h2O4",
  authDomain: "sarmez-retreats.firebaseapp.com",
  projectId: "sarmez-retreats",
  storageBucket: "sarmez-retreats.firebasestorage.app",
  messagingSenderId: "586728433767",
  appId: "1:586728433767:web:567f3000153393b13c8cc2"
};

const app = initializeApp(firebaseConfig);

window.firebaseDb = getFirestore(app);
window.firebaseCollection = collection;
window.firebaseAddDoc = addDoc;
window.firebaseSetDoc = setDoc;
window.firebaseDoc = doc;
window.firebaseOnSnapshot = onSnapshot;
window.firebaseTimestamp = serverTimestamp;

window.dispatchEvent(new Event("firebase-ready"));
