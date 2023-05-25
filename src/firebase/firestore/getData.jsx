import firebase_app from "../config";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const db = getFirestore(firebase_app)

export default async function getDocument(collection, id) {
    let docRef = doc(db, collection, id);

    let result = null;
    let error = null;

    try {
        const docSnap = await getDoc(docRef);
        result = docSnap.data();
    } catch (e) {
        error = e;
    }

    return { result, error };
}