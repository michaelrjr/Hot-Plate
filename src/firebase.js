import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCBkDtK0Px6EHyoGX-iJy4luIG_r8iF87o",
  authDomain: "fb-test-proj-abde8.firebaseapp.com",
  projectId: "fb-test-proj-abde8",
  storageBucket: "fb-test-proj-abde8.appspot.com",
  messagingSenderId: "328801899539",
  appId: "1:328801899539:web:241f5f6e3e71651c101be6",
});

export const auth = app.auth();
export default app;
