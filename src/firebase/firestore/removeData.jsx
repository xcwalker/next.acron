import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import firebase_app from "../config";
const db = getFirestore(firebase_app)

export default async function removeDoc(collection, ID) {
    let result = null;
    let error = null;

    try {
        const docSnap = await deleteDoc(doc(db, collection, ID));
        result = "Deleted"
    } catch (e) {
        error = e;
    }

    return { result, error };
}