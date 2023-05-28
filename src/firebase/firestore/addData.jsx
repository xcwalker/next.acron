import firebase_app from "../config";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore(firebase_app)

export default async function setDocData(collectionId, id, data) {
    let result = null;
    let error = null;

    try {
        result = await setDoc(doc(db, collectionId, id), data, {
            merge: true,
        });
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export async function addData(collectionId, data) {
    let result = null;
    let error = null;

    try {
        const docRef = await addDoc(collection(db, collectionId), data);
        result = { id: docRef.id }
    } catch (e) {
        error = e;
    }

    return { result, error };
}