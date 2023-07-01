import firebase_app from "../config";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function forgot(email) {
  let result = null,
    error = null;

  try {
    result = await sendPasswordResetEmail(auth, email);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
