'use client'

import { RelativeLink } from "@/RelativeLink"
import { useAuthContext } from "@/context/AuthContext"
import userStyle from "@/styles/user.module.css"

export function CurrentUser(props) {
    const { user } = useAuthContext()

    return <>
        {props.userID && user && props.userID === user.uid && <>
            <RelativeLink href="/edit" following={props.userID} active={userStyle.active}>Edit</RelativeLink>
        </>}
    </>
}