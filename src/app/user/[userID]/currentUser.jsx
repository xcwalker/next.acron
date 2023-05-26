'use client'

import { RelativeLink } from "@/RelativeLink"
import { useAuthContext } from "@/context/AuthContext"

export function CurrentUser(props) {
    const { user } = useAuthContext()

    return <>
        {props.userID === user.uid && <>
            <RelativeLink href="/edit">Edit</RelativeLink>
        </>}
    </>
}