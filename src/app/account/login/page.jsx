'use client'

import { RelativeLink } from "@/RelativeLink";
import { useAuthContext } from "@/context/AuthContext";
import signIn from "@/firebase/auth/signin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast";

export default function Page({ searchParams }) {
  const { user, userLoading } = useAuthContext();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const promise = signIn(email, password).then((res) => {
      if (res.error) {
        return console.error(res.error);
      }

      // else successful
      console.log(res.result);
      return router.push(searchParams.from ? searchParams.from : "/user");
    });

    toast.promise(promise, {
      loading: "Signing In",
      success: "Logged In",
      error: "Check Email & Password",
    });
  };

  useEffect(() => {
    if (user && !userLoading) router.push(searchParams.from ? searchParams.from : "/user");
  }, [user, userLoading, router, searchParams]);

  return (
    <>
      <section className="account-handler">
        <div className="container">
          <form action="" onSubmit={handleLogin}>
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
            <button type="submit">Login</button>
          </form>
          <RelativeLink href="./signup">Don&#39;t Have An Account?</RelativeLink>
          <RelativeLink href="./forgot">Forgot Password</RelativeLink>
        </div>
      </section>
    </>
  );
}