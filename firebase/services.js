// src/firebase/services.js
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const serviziRef = collection(db, "servizi");

export async function addServizio(data) {
  // data = { giorno, orario, servizio, localita, autista, accompagnatore, mezzo, fascia, settimana }
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(serviziRef, payload);
  return docRef.id;
}

export async function updateServizio(id, data) {
  const ref = doc(db, "servizi", id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteServizio(id) {
  const ref = doc(db, "servizi", id);
  await deleteDoc(ref);
}
