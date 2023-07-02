"use client";

import { useAuthContext } from "@/context/AuthContext";
import LogoAcron from "@/logos/acron";
import defaultStyle from "@/styles/components/navbar.default.module.css";
import authedStyle from "@/styles/components/navbar.authed.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuthContext();

  useEffect(() => {
    console.log(pathname);

    return () => {};
  }, [pathname]);

  return (
    <>
      {user === null && (
        <header className={defaultStyle.header}>
          <div className={defaultStyle.container}>
            <Link aria-label="home" href="">
              <LogoAcron />
            </Link>
            <nav>
              <ul>
                <li>
                  <Link href="/account/signup">Signup</Link>
                </li>
                <li>
                  <Link href="/account/login" className={defaultStyle.action}>
                    Login
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      )}
      {user !== null && (
        <header className={authedStyle.header}>
          <div className={authedStyle.container}>
            <nav>
              <ul>
                <Link aria-label="home" className="material-symbols-outlined" href="">
                  home
                </Link>
                <Link aria-label="chat" className="material-symbols-outlined" href="">
                  chat
                </Link>
                <Link aria-label="feed" className="material-symbols-outlined" href="">
                  feed
                </Link>
              </ul>
            </nav>
          </div>
        </header>
      )}
    </>
  );
}
