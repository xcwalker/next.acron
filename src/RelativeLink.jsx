"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export function RelativeLink(props) {
    const path = usePathname()

    return <Link {...props} href={path + props.href} passHref >{props.children}</Link>
}