'use client'

import { RelativeLink } from "@/RelativeLink"
import { useAuthContext } from "@/context/AuthContext"
import { getChatID } from "@/firebase/firestore/getData"
import userStyle from "@/styles/user.module.css"
import Link from "next/link"
import { useEffect, useState } from "react"

export function CurrentUser(props) {
    const { user } = useAuthContext()
    const [chatID, setChatID] = useState("")

    var userID = props.userID
    var userUID = props.userUID;

    if (userUID) {
        userID = userUID
    }

    useEffect(() => {
        if (userID && user && userID !== user.uid) {
            getChatID(userID, user.uid).then(res => {
                console.log(res)
                if (res.result) {
                    setChatID(res.result.docID)
                } else if (res.error) {
                    console.error(res.error)
                } else {
                    setChatID("new/" + userID)
                }
            })
        }
    }, [user, userID])



    console.log(chatID)

    return <>
        {chatID !== "" && <>
            <Link href={"/chat/" + chatID} className={userStyle.button}>Message</Link>
        </>}
        {!props.userUID && <>
            {props.userID && user && props.userID === user.uid && <>
                <RelativeLink href="/edit" following={props.userID} active={userStyle.active} className={userStyle.button}>Edit</RelativeLink>
            </>}
        </>}
        {props.userUID && <>
            {props.userUID && user && props.userUID === user.uid && <>
                <RelativeLink href="/edit" following={props.userID.slice(3)} active={userStyle.active} className={userStyle.button}>Edit</RelativeLink>
            </>}
        </>}
    </>
}