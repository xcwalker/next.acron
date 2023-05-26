"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export function RelativeLink(props) {
    console.log(props)

    var path = usePathname()
    var newPath = path;
    var className;

    if (props.following) {
        async function pathCheck() {
            if (newPath.endsWith(props.following)) {
                return
            } else {
                newPath = newPath.slice(0, -1)
                pathCheck()
            }
        }
        pathCheck()
    }

    if (props.active) {
        if (newPath + props.href === path) {
            if (props.className) {
                className = props.className + " " + props.active;
            } else {
                className = props.active
            }
        }
    } else {
        className = props.className;
    }

    return <Link {...props} href={newPath + props.href} className={className} passHref prefetch={false}>{props.children}</Link>
}