// import firebase from "firebase/app";
// import "firebase/messaging";
// import { _AuthService } from "services/auth.service";

// // See: https://firebase.google.com/docs/web/learn-more#config-object
// const firebaseConfig = {
//   apiKey: "AIzaSyDFxwtGObfiMQAbXVWhkMwwYr39wrENz9g",
//   authDomain: "sil-platform.firebaseapp.com",
//   databaseURL: "https://sil-platform-default-rtdb.firebaseio.com",
//   projectId: "sil-platform",
//   storageBucket: "sil-platform.appspot.com",
//   messagingSenderId: "801196929391",
//   appId: "1:801196929391:web:e6342deed06026d79a389a",
//   measurementId: "G-7WW2M2V8D4",
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// // Initialize Firebase Cloud Messaging and get a reference to the service
// let messaging;
// if (typeof window !== "undefined") {
//   messaging = firebase.messaging();
// }

// export const requestForToken = () => {
//   // Get registration token. Initially this makes a network call, once retrieved
//   // subsequent calls to getToken will return from cache.
//   messaging
//     .getToken({
//       vapidKey:
//         "BNIQ4XbF4upYyOkf6vroJpSARYvOLAUD58HQxOOtShkXm0YWFqqVANpP_mffrme_FpzWFPlw2OJjj4AvM5N4Pgk",
//     })
//     .then((currentToken) => {
//       if (localStorage.getItem("fcm_token") === currentToken) return;
//       if (currentToken) {
//         // Send the token to your server and update the UI if necessary

//         console.log("not found");
//         localStorage.setItem("fcm_token", currentToken);
//         _AuthService
//           .updateFCMToken({ fcm_token: currentToken })
//           .then((res) => console.log(res))
//           .catch((err) => console.error(err));
//       } else {
//         // Show permission request UI
//         console.log(
//           "No registration token available. Request permission to generate one."
//         );
//         // ...
//       }
//     })
//     .catch((err) => {
//       console.log("An error occurred while retrieving token. ", err);
//       // ...
//     });
// };

// export const onMessageListener = async () =>
//   new Promise((resolve) => {
//     messaging &&
//       messaging.onMessage((payload) => {
//         console.log(payload);
//         resolve(payload);
//       });
//   });

export {};
