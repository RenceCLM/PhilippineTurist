const firebase = require('firebase/app');
require('firebase/database');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGVAmOZJIbVJJ2U5adiN1fk63g4fCEF6w",
    authDomain: "mindmaps-79c18.firebaseapp.com",
    projectId: "mindmaps-79c18",
    storageBucket: "mindmaps-79c18.firebasestorage.app",
    messagingSenderId: "525986003538",
    appId: "1:525986003538:web:73246af435b972d98abd8b"  
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database
const database = firebase.database();

module.exports = database;

