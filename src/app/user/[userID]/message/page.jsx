"use client"

import { useAuthContext } from "@/context/AuthContext";
import getDocument, { getChatID, getDocumentFromCompoundAndQuery, getDocumentFromSimpleQuery } from "@/firebase/firestore/getData";
import { useRouter } from "next/navigation";

export async function getServerSideProps(params) {
    let userData;

    if (params.userID.startsWith("%40")) {
        await getDocumentFromSimpleQuery("users", {
            fieldPath: "about.username",
            operator: "==",
            value: params.userID.slice(3),
        }).then(res => {
            userData = res.result
        })
    } else {
        await getDocument("users", params.userID).then(res => {
            userData = res.result
        })
    }

    return userData
}

export default async function Page({ params }) {
    const router = useRouter()
    const { user } = useAuthContext()
    const userData = await getServerSideProps(params)

    var userID = params.userID
    var userUID = userData.docID;

    if (userUID) {
        userID = userUID
    }

    const check = await getChatID(userID, user.uid).then(res => {
        console.log(res)
        if (res.result) {
            router.push("/chat/" + res.docID)
        } else {
            console.error(res.error)
        }
    })

    return <>
        Message
    </>;
}