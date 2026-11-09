// ============================================
// CONFIGURAZIONE FIREBASE
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyBntNu1VVGnUn4BeTL7dW0CpeKlDx7227Q",
  authDomain: "sitolind.firebaseapp.com",
  projectId: "sitolind",
  storageBucket: "sitolind.firebasestorage.app",
  messagingSenderId: "329069494008",
  appId: "1:329069494008:web:e8a5f0db638fb449fd050d",
  databaseURL: "https://sitolind-default-rtdb.europe-west1.firebasedatabase.app"
};

// Inizializza Firebase compat
firebase.initializeApp(firebaseConfig);

// Riferimento al database
const db = firebase.database();
