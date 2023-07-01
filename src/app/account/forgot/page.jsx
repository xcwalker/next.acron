"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import style from "@/styles/account.handler.module.css";
import LogoAcron from "@/logos/acron";
import Link from "next/link";
import forgot from "@/firebase/auth/forgot";

export default function Page({ searchParams }) {
  const { user, userLoading } = useAuthContext();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();

    const promise = forgot(email);

    promise.then((res) => {
      if (res.error) {
        return console.error(res.error);
      }
    });

    toast.promise(promise, {
      loading: "Sending Email",
      success: "Reset Email Sent",
      error: "Failure Sending Email",
    });
  };

  useEffect(() => {
    if (user && !userLoading) router.push(searchParams.from ? searchParams.from : "/user");
  }, [user, userLoading, router, searchParams]);

  return (
    <>
      <div className={style.form}>
        <form action="" onSubmit={handleForgot}>
          <LogoAcron />
          <input
            type="email"
            name="login-email"
            id="login-email"
            required
            placeholder="example@acron.dev"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <button type="submit">Forgot Password</button>
        </form>
        <div className={style.others}>
          <Link href="/account/login">Login</Link>
        </div>
      </div>
    </>
  );
}
