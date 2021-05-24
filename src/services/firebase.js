import firebase from "firebase";

const initializeFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAPFTk3-dXDoWgpunK0-2pmZYeR4KQutdI",
    authDomain: "midota-ed268.firebaseapp.com",
    databaseURL: "https://midota-ed268.firebaseio.com",
    projectId: "midota-ed268",
    storageBucket: "midota-ed268.appspot.com",
    messagingSenderId: "134447532412",
    appId: "1:134447532412:web:a98afaf78a365bb637bcf9",
    measurementId: "G-8P6L4F4DWM"
  };

  return firebase.initializeApp(firebaseConfig);
};

const askForPermissionToReceiveNotifications = () => {
  try {
    const messaging = firebase.messaging();
    messaging
      .requestPermission()
      .then(() => {
        const token = messaging.getToken().then((currentToken) => {
          console.log(currentToken);
          });

        return token;
      })
      .then((token) => {
        localStorage.setItem("device_token", token);
        messaging.onMessage((payload) => {
          console.log("Message received. ", payload);
        });
      })
      .catch((error) => {
        console.log(error);
      });
      navigator.serviceWorker.addEventListener("message", (message) => console.log(message));
  } catch (error) {
    console.log(error);
  }
};

export { initializeFirebase, askForPermissionToReceiveNotifications };
