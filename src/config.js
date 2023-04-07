import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyAxQsOLyuBXrZrB_WIwk2zVI3ZFUcVnO_w",
  authDomain: "newellfinance-4ad85.firebaseapp.com",
  databaseURL: "https://newellfinance-4ad85-default-rtdb.firebaseio.com",
  projectId: "newellfinance-4ad85",
  storageBucket: "newellfinance-4ad85.appspot.com",
  messagingSenderId: "279806473603",
  appId: "1:279806473603:web:fbb6c486a48030680ab2b6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.firestore().settings({ timestampsInSnapshots: true })

export const f = firebase;
export const database = firebase.database();
export const storage = firebase.storage();
export const auth = firebase.auth();
export default firebase.firestore()