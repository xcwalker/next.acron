import DevStyle from "@/styles/nav.development.module.css";
import Link from "next/link";

export const metadata = {}

export default function Page() {
  return (
    <>
      {/* NOT FOR PROD */}
      <section className={DevStyle.devSection}>
        <div className={DevStyle.container}>
          <h1>Account | Dev Nav</h1>
          <div className={DevStyle.links}>
            <Link href="/account/signup" className={DevStyle.button}>
              Signup
            </Link>
            <Link href="/account/login" className={DevStyle.button}>
              Login
            </Link>
            <Link href="/account/forgot" className={DevStyle.button}>
              Forgot Password
            </Link>
            <Link href="/account/logout" className={DevStyle.button}>
              Logout
            </Link>
          </div>
          <div className={DevStyle.links}>
            <Link href="/" className={DevStyle.button}>
              Home
            </Link>
          </div>
          <div className={DevStyle.functions}>
            {/* <Link href="/account/logout" className={DevStyle.button} id={DevStyle.logout}>
              logout
            </Link> */}
          </div>
        </div>
      </section>
    </>
  );
}
