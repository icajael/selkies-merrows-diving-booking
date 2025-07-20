// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAE5EoqYjLNrC_t1d3X6Yz_KgiTSEx7KiE",
  authDomain: "facebook-b4a19.firebaseapp.com",
  databaseURL: "https://facebook-b4a19-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "facebook-b4a19",
  storageBucket: "facebook-b4a19.firebasestorage.app",
  messagingSenderId: "482598994364",
  appId: "1:482598994364:web:6e883f5a14c84c18e7ebb9",
  measurementId: "G-7QK5NQXTTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Export the Firebase app, analytics, and database for use in other modules
export { app, analytics, database };
