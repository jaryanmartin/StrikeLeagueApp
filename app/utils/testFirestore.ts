import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function writeTestSwing() {
  try {
    const docRef = await addDoc(collection(db, "swings"), {
      faceAngle: 5.2,
      swingPath: -3.4,
      timestamp: serverTimestamp(),
      test: true
    });
    console.log("Test document written with ID:", docRef.id);
  } catch (err) {
    console.error("Error writing test document:", err);
  }
}
