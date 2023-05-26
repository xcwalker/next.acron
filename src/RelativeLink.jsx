"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export async function RelativeLink(props) {
    var path = usePathname()
    var originalPath = usePathname()

    if (props.following) {
        function pathCheck() {
            if (path.endsWith(props.following)) {
                return
            } else {
                path = path.slice(0, -1)
                pathCheck()
            }
        }
        pathCheck()
    }

    // if (props.activeClassName) {
    //     if (path + props.href === originalPath) {
    //         props.className = props.className + " " + props.activeClassName;
    //     }
    // }

    return <Link {...props} href={path + props.href} passHref >{props.children}</Link>
}