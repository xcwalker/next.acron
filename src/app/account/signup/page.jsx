"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import signUp from "@/firebase/auth/signup";
import { RelativeLink } from "@/RelativeLink";
import { toast } from "react-hot-toast";
import style from "@/styles/account.handler.module.css";
import Link from "next/link";
import LogoAcron from "@/logos/acron";

export default function Page() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");

  const handleSignup = async () => {
    if (passwordOneRef.current.value !== passwordTwoRef.current.value) {
      return;
    }

    const promise = signUp(email, password).then((res) => {
      if (res.error) {
        return console.error(res.error);
      }

      // else successful
      console.log(res.result);
      return router.push("/user");
    });

    toast.promise(promise, {
      loading: "Signing Up",
      success: "Signed In",
      error: "Error",
    });
  };

  useEffect(() => {
    if (user !== null) router.push("/user");
  }, [user, router]);

  return (
    <>
          <div className={style.form}>
            <form action="" onSubmit={handleSignup}>
              <LogoAcron />
              <input
                type="email"
                name="signup-email"
                id="signup-email"
                required
                placeholder="example@acron.dev"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                name="signup-password"
                id="signup-password-one"
                required
                placeholder="password"
                onChange={(e) => setPasswordOne(e.target.value)}
                value={passwordOne}
              />
              <input
                type="password"
                name="signup-password-repeat"
                id="signup-password-two"
                required
                placeholder="password repeat"
                onChange={(e) => setPasswordTwo(e.target.value)}
                value={passwordTwo}
              />
              <button type="submit">Signup</button>
            </form>
            <div className={style.others}>
              <Link href="/account/login">Already Have An Account?</Link>
              <Link href="/account/forgot">Forgot Password</Link>
            </div>
          </div>
    </>
  );
}
