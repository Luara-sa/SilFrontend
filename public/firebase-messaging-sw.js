// // Scripts for firebase and firebase messaging
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.9.0/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging-compat.js"
// );

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//   apiKey: "AIzaSyBqWHN_KhFUn5_XwpX7Iizwz-8yyDCAKJE",
//   authDomain: "auto-343620.firebaseapp.com",
//   projectId: "auto-343620",
//   storageBucket: "auto-343620.appspot.com",
//   messagingSenderId: "133742594039",
//   appId: "1:133742594039:web:75e5a486d7bef6fd7450f2",
// };

// firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log("Received background message ", payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// *******************************final**********************************************
// // Scripts for firebase and firebase messaging
// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
// );

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//   apiKey: "AIzaSyDFxwtGObfiMQAbXVWhkMwwYr39wrENz9g",
//   authDomain: "sil-platform.firebaseapp.com",
//   databaseURL: "https://sil-platform-default-rtdb.firebaseio.com",
//   projectId: "sil-platform",
//   storageBucket: "sil-platform.appspot.com",
//   messagingSenderId: "801196929391",
//   appId: "1:801196929391:web:f55fb8dd320ba39b9a389a",
//   measurementId: "G-5VMV0C9NR2",
// };

// firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log("Received background message ", payload);
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     // icon: "./images/logo.svg",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
