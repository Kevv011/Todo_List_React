// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-WhZCINq4uwPUoMkumcMDe2fS-HyK95s",
    authDomain: "todo-list-9e94b.firebaseapp.com",
    projectId: "todo-list-9e94b",
    storageBucket: "todo-list-9e94b.firebasestorage.app",
    messagingSenderId: "931989171646",
    appId: "1:931989171646:web:0523eebb67bc73571d1def"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
export { db };