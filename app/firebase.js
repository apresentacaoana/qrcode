import {initializeApp} from 'firebase/app'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiKkoY18g-dbIGXJ8ETV11VtSvnpWKPEI",
  authDomain: "kotinskiapp.firebaseapp.com",
  projectId: "kotinskiapp",
  storageBucket: "kotinskiapp.appspot.com",
  messagingSenderId: "93939874105",
  appId: "1:93939874105:web:c35a30647fb6daa6c710e8",
  measurementId: "G-3SC0CDGBJW"
};

let app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {app, db}