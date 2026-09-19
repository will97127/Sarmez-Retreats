import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-pNaOwoA7cgKe3DM6Di0L_EBD3v_h2O4",
  authDomain: "sarmez-retreats.firebaseapp.com",
  databaseURL: "https://sarmez-retreats-default-rtdb.firebaseio.com",
  projectId: "sarmez-retreats",
  storageBucket: "sarmez-retreats.firebasestorage.app",
  messagingSenderId: "586728433767",
  appId: "1:586728433767:web:567f3000153393b13c8cc2",
  measurementId: "G-ZG0YTEEGHP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
