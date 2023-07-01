import Link from "next/link";

import DevStyle from "@/styles/nav.development.module.css";

export default function Home() {
  return (
    <>
      {/* NOT FOR PROD */}
      <section className={DevStyle.devSection}>
        <div className={DevStyle.container}>
          <h1>Home | Dev Nav</h1>
          <div className={DevStyle.links}>
            <Link href="/chat" className={DevStyle.button}>
              Chat
            </Link>
            <Link href="/user" className={DevStyle.button}>
              User
            </Link>
            <Link href="/account" className={DevStyle.button}>
              Account
            </Link>
          </div>
          <div className={DevStyle.functions}>
            <Link href="/account/logout" className={DevStyle.button} id={DevStyle.logout}>
              logout
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
