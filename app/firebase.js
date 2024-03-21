import {initializeApp} from 'firebase/app'
import { getFirestore } from "firebase/firestore";

// banco de dados da versão teste
const firebaseConfig = {
  apiKey: "AIzaSyDiKkoY18g-dbIGXJ8ETV11VtSvnpWKPEI",
  authDomain: "kotinskiapp.firebaseapp.com",
  projectId: "kotinskiapp",
  storageBucket: "kotinskiapp.appspot.com",
  messagingSenderId: "93939874105",
  appId: "1:93939874105:web:c35a30647fb6daa6c710e8",
  measurementId: "G-3SC0CDGBJW"
};

// banco de dados da versão de produção
// const firebaseConfig = {
//   apiKey: "AIzaSyALFL80aJJ01bNDWMEBID6hy-gZcslOn5I",
//   authDomain: "postos-kotinski.firebaseapp.com",
//   projectId: "postos-kotinski",
//   storageBucket: "postos-kotinski.appspot.com",
//   messagingSenderId: "966626975838",
//   appId: "1:966626975838:web:d131930d79bf9ebce314cf",
//   measurementId: "G-ZXPG45NDY6"
// };


let app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {app, db}