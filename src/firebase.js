// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAWySZuXFEJVCxLr-AzX4AvYFhAb0eNrY",
  authDomain: "hall-allocation-c720d.firebaseapp.com",
  projectId: "hall-allocation-c720d",
  storageBucket: "hall-allocation-c720d.appspot.com",
  messagingSenderId: "791800414601",
  appId: "1:791800414601:web:62b5aa8a208e925f666158",
  measurementId: "G-GG773MRH0F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);