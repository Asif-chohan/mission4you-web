import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default new (class FirebaseManager {
  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyBWvemcpxpOdVn5MpfkUcPhHcaR51fqq8w",
      authDomain: "specials-5b824.firebaseapp.com",
      databaseURL: "https://specials-5b824.firebaseio.com",
      projectId: "specials-5b824",
      storageBucket: "specials-5b824.appspot.com",
      messagingSenderId: "60419520752",
      appId: "1:60419520752:web:46a86d66d691a529336a35",
      measurementId: "G-NN9JX393YZ"
    });
  }
})();

export const firestore = firebase.firestore();
