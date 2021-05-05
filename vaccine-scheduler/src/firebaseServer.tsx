import firebase from "firebase"; 

const config = { 
    apiKey: process.env.REACT_APP_API_KEY,
    projectId: process.env.REACT_APP_PROJECT_ID, 
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
}

firebase.initializeApp(config); 
export const auth = firebase.auth; 
export const db = firebase.database(); 