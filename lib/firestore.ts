import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export async function isUsernameTaken(username: string) {
  const q = query(
    collection(db, "users"),
    where("username", "==", username.toLowerCase())
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function getEmailByUsername(username: string) {
  const q = query(
    collection(db, "users"),
    where("username", "==", username.toLowerCase())
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  return snap.docs[0].data().email as string;
}

export async function createUserProfile(
  uid: string,
  data: Record<string, any>
) {
  await setDoc(doc(db, "users", uid), data);
}
