import { firebase } from '@firebase/app'
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBUAMfK3tF2ngDCqZc-N_2BXRQEkKxzJxA",
  authDomain: "vuetime-caf3f.firebaseapp.com",
  projectId: "vuetime-caf3f",
  storageBucket: "vuetime-caf3f.appspot.com",
  messagingSenderId: "715549855713",
  appId: "1:715549855713:web:63310b3d67d8f14c2b8ca0",
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseDb = firebaseApp.database();

export { firebaseDb };