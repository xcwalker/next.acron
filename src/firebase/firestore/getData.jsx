import firebase_app from "../config";
import { doc, getDoc, getFirestore, query, collection, limit, where, getDocs, or, and } from "firebase/firestore";

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

export async function getDocumentFromSimpleQuery(collectionData, queryData) {
    const q = query(collection(db, collectionData), where(queryData.fieldPath, queryData.operator, queryData.value), limit(1));

    let result = null;
    let error = null;

    try {

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            result = doc.data();
            result.docID = doc.id;
        });
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export async function getDocumentFromCompoundAndQuery(collectionData, queryOneData, queryTwoData) {
    const q = query(collection(db, collectionData), where(queryOneData.fieldPath, queryOneData.operator, queryOneData.value), where(queryTwoData.fieldPath, queryTwoData.operator, queryTwoData.value), limit(1));

    let result = null;
    let error = null;

    try {

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            result = doc.data();
            result.docID = doc.id;
        });
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export async function getChatID(userIdOne, userIdTwo) {
    const q = query(collection(db, "chats"),
        or(
            and(where("users.from", "==", userIdOne),
                where("users.to", "==", userIdTwo)),
            and(where("users.from", "==", userIdTwo),
                where("users.to", "==", userIdOne))
        ),
        limit(1));

    let result = null;
    let error = null;

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc)
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            result = doc.data();
            result.docID = doc.id;
        });
    } catch (e) {
        error = e;
    }

    return { result, error };
}