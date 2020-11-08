// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyA57DjPlsNfvMo9K-G5v4zcjm26zIprv9Q",
  authDomain: "insta-clone-react-ca1d1.firebaseapp.com",
  databaseURL: "https://insta-clone-react-ca1d1.firebaseio.com",
  projectId: "insta-clone-react-ca1d1",
  storageBucket: "insta-clone-react-ca1d1.appspot.com",
  messagingSenderId: "378775932134",
  appId: "1:378775932134:web:72bfb327ad335c97f0bf27",
  measurementId: "G-6LWD68PNSC",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
