import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyBjOO4gGr8iBvNr1D8ConkQxfRvTBDgxbQ",
  authDomain: "crud-ems-eca3d.firebaseapp.com",
  projectId: "crud-ems-eca3d",
  storageBucket: "crud-ems-eca3d.firebasestorage.app",
  messagingSenderId: "434053866448",
  appId: "1:434053866448:web:ae57f7c0fed755b7ea8fd5"
};


const firebaseApp = initializeApp(firebaseConfig);
let __AUTH=getAuth(firebaseApp);
let __DB=getFirestore(firebaseApp);
export default firebaseApp;
export {__AUTH,__DB};

//^JAIMIN personal firebase configuration
