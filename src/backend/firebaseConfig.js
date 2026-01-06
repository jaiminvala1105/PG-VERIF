// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUdtomvk_S5O7s3CVxjB5rILJaG9-VkK8",
  authDomain: "pg-verif.firebaseapp.com",
  projectId: "pg-verif",
  storageBucket: "pg-verif.firebasestorage.app",
  messagingSenderId: "671826929638",
  appId: "1:671826929638:web:b989d5ffdcad3bed385827"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export let __AUTH =getAuth(firebaseApp) 
export let __DB =getFirestore(firebaseApp) 

export default firebaseApp