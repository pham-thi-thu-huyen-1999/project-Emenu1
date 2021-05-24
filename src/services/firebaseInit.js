import firebase from 'firebase/app';
import 'firebase/messaging';
import { save } from "./localStorage";

const config = {
  apiKey: "AIzaSyDau3NjzTAnevHaPV39Sf19JaIl-i4EfmQ",
  authDomain: "omenu-staging.firebaseapp.com",
  databaseURL: "https://omenu-staging-default-rtdb.firebaseio.com",
  projectId: "omenu-staging",
  storageBucket: "omenu-staging.appspot.com",
  messagingSenderId: "278042122208",
  appId: "1:278042122208:web:17a0a92b49885b9d76fd85",
  measurementId: "G-ZL55LCX3B4"
};

if (firebase.messaging.isSupported()) {
  firebase.initializeApp(config);
}

export const messaging = firebase.messaging.isSupported() ? firebase.messaging(): null;

export const requestFirebaseNotificationPermission = () =>
  new Promise((resolve, reject) => {
    if (firebase.messaging.isSupported()) {
      messaging
        .requestPermission()
        .then(() => messaging.getToken())
        .then((firebaseToken) => {
          save('fb_token', firebaseToken)
          resolve(firebaseToken);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
  