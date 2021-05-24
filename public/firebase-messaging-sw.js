importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDau3NjzTAnevHaPV39Sf19JaIl-i4EfmQ",
  authDomain: "omenu-staging.firebaseapp.com",
  databaseURL: "https://omenu-staging-default-rtdb.firebaseio.com",
  projectId: "omenu-staging",
  storageBucket: "omenu-staging.appspot.com",
  messagingSenderId: "278042122208",
  appId: "1:278042122208:web:17a0a92b49885b9d76fd85",
  measurementId: "G-ZL55LCX3B4"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  const title = "Tin nhắn mới";
  let body = "";
  if (payload.data.title) {
    if (payload.data.action === "call_staff") {
      body = payload.data.table_name
        ? `${payload.data.table_name}${payload.data.title}`
        : payload.data.title + 'aaaa'
    }
  } else {
    body = "Ohazo xin chào"
  }
  const icon = payload.data.icon ? payload.data.icon : 'images/logo-omenu.png';
  const notificationOptions = {
    body: body,
    icon: icon,
  };
  return self.registration.showNotification(
    title,
    notificationOptions
  );
});
