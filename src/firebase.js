import { firebase } from '@firebase/app'
import "firebase/database";

const firebaseConfig = {

};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseDb = firebaseApp.database();

export { firebaseDb };
