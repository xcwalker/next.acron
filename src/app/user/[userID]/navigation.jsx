import { RelativeLink } from "@/RelativeLink";
import userStyle from "@/styles/user.module.css"

export function UserNavigation(props) {
    return <>
        <div className={userStyle.navigation}>
            <ol>
                <RelativeLink href="" following={props.userID} active={userStyle.active}>Posts</RelativeLink>
                <RelativeLink href="/media" following={props.userID} active={userStyle.active}>Media</RelativeLink>
                <RelativeLink href="/following" following={props.userID} active={userStyle.active}>Following</RelativeLink>
                <RelativeLink href="/friends" following={props.userID} active={userStyle.active}>Friends</RelativeLink>
            </ol>
        </div>
    </>
}