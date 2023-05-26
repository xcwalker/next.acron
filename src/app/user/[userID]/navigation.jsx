import { RelativeLink } from "@/RelativeLink";
import userStyle from "@/styles/user.module.css"

export function UserNavigation(props) {
    return <>
        <div className={userStyle.navigation}>
            <ol>
                <RelativeLink href="/posts" following={props.userID} >Posts</RelativeLink>
                <RelativeLink href="/media" following={props.userID}>Media</RelativeLink>
                <RelativeLink href="/following" following={props.userID}>Following</RelativeLink>
                <RelativeLink href="/friends" following={props.userID}>Friends</RelativeLink>
            </ol>
        </div>
    </>
}