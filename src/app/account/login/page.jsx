"use client";

import { useAuthContext } from "@/context/AuthContext";
import signIn from "@/firebase/auth/signin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import style from "@/styles/account.handler.module.css";
import LogoAcron from "@/logos/acron";
import Link from "next/link";

export default function Page({ searchParams }) {
  const { user, userLoading } = useAuthContext();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true)

    // const promise = 
    signIn(email, password).then((res) => {
    setLoading(false);
      if (res.error) {
        toast.error("Check Email & Password");
        return console.error(res.error);
      }

      // else successful
      toast.success("Logged In")
      console.log(res.result);
      return router.push(searchParams.from ? searchParams.from : "/user");
    });

    // toast.promise(promise, {
    //   loading: "Signing In",
    //   success: "Logged In",
    //   error: "Check Email & Password",
    // });
  };

  useEffect(() => {
    if (user && !userLoading) router.push(searchParams.from ? searchParams.from : "/user");
  }, [user, userLoading, router, searchParams]);

  return (
    <>
      <div className={style.form}>
        <form action="" onSubmit={handleLogin}>
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
          <input
            type="password"
            name="login-password"
            id="login-password-one"
            required
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button type="submit" disabled={loading || password === "" || email === ""}>
            {!loading && "Login"}
            {loading && <div className={style.dots} />}
          </button>
        </form>
        <div className={style.others}>
          <Link href="/account/signup">Don&#39;t Have An Account?</Link>
          <Link href="/account/forgot">Forgot Password</Link>
        </div>
      </div>
    </>
  );
}
