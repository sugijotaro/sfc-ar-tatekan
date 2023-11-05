import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";

import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
export { storage, db, Tatekan, postTatekan, getTatekans };

class Tatekan {
  constructor(imagePath, latitude, longitude, handleName, comment, timestamp) {
    this.imagePath = imagePath;
    this.latitude = latitude;
    this.longitude = longitude;
    this.handleName = handleName;
    this.comment = comment;
    this.timestamp = timestamp || serverTimestamp();
  }
  toFirestore() {
    return {
      imagePath: this.imagePath,
      latitude: this.latitude,
      longitude: this.longitude,
      handleName: this.handleName,
      comment: this.comment,
      timestamp: this.timestamp,
    };
  }
}

async function postTatekan(tatekan) {
  try {
    const docRef = await addDoc(
      collection(db, "tatekans"),
      tatekan.toFirestore()
    );
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

async function getTatekans(callback) {
  console.log("Fetching tatekans from the database...");
  try {
    const querySnapshot = await getDocs(collection(db, "tatekans"));
    const tatekans = [];
    querySnapshot.forEach((doc) => {
      console.log(`Processing document ID: ${doc.id}`);
      tatekans.push({ ...doc.data(), id: doc.id });
    });
    console.log("All tatekans have been processed.");
    callback(tatekans);
    console.log("Callback has been executed.");
  } catch (error) {
    console.error("Error fetching tatekans: ", error);
  }
}
