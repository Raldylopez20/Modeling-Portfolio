// Firebase Configuration - Raldy Lopez Portfolio
// Configuración de Firebase para el dashboard admin

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASAZv9OOKEqyYoTdyiyN2uz_mgDphciro",
  authDomain: "portafolio-de-modelaje.firebaseapp.com",
  databaseURL: "https://portafolio-de-modelaje-default-rtdb.firebaseio.com",
  projectId: "portafolio-de-modelaje",
  storageBucket: "portafolio-de-modelaje.firebasestorage.app",
  messagingSenderId: "703852643998",
  appId: "1:703852643998:web:add6cc33ae1e98aa2e1d8f",
  measurementId: "G-SNLGVN9H5G"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Exportar para uso global
window.FirebaseConfig = firebaseConfig;
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firestore = db;
window.firebaseStorage = storage;
