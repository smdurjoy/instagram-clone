import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBrOdYtahC0QfEbZC6z3agzsp65J0N1Bd8",
    authDomain: "djes-instagram-clone.firebaseapp.com",
    databaseURL: "https://djes-instagram-clone.firebaseio.com",
    projectId: "djes-instagram-clone",
    storageBucket: "djes-instagram-clone.appspot.com",
    messagingSenderId: "993174530993",
    appId: "1:993174530993:web:c09392625ab9226ec1eb90",
    measurementId: "G-Z0ZN6011N1"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };