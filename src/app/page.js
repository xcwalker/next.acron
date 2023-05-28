import Link from "next/link";

export default function Home() {
  return <>
  <h1>Home | Dev Nav</h1>
  {/* NOT FOR PROD */}
  <Link href="/chat">Chat</Link>
  <Link href="/user">User</Link>
  </>
}
