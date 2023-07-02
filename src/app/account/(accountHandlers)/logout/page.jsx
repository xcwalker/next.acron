"use client";
import { useAuthContext } from "@/context/AuthContext";
import logout from "@/firebase/auth/logout";
import LogoutStyle from "@/styles/account.logout.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AccountLogout() {
  const user = useAuthContext();
  const router = useRouter();
  const dialog = document.querySelector("#" + LogoutStyle.dialog);

  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (user !== null) return;
    router.push("/account/login");
  }, [user, router]);

  useEffect(() => {
    console.log(dialog, document.querySelector("#" + LogoutStyle.dialog));
    if (!document.querySelector("#" + LogoutStyle.dialog)) return;
    document.querySelector("#" + LogoutStyle.dialog).showModal();

    return () => {
      if (!document.querySelector("#" + LogoutStyle.dialog)) return;
      document.querySelector("#" + LogoutStyle.dialog).close();
    };
  }, [dialog]);

  const handleLogout = (e) => {
    e.preventDefault();

    setLoading(true);

    logout().then((res) => {
      setLoading(false);
      if (res.error) {
        console.error("Error logging out user:" + res.error);
        return;
      }

      setComplete(true);
      console.log("User logged out successfully");
      router.push("/account/login");
    });
  };

  return (
    <>
      {user && (
        <dialog id={LogoutStyle.dialog}>
          <form className={LogoutStyle.container} onSubmit={handleLogout}>
            <h1>Are you sure you want to logout?</h1>
            <div className={LogoutStyle.controls}>
              <Link href={"/account"}>Cancel</Link>
              <button type="submit" disabled={complete || loading}>
                {!loading && !complete && "Logout"}
                {loading && <div className={LogoutStyle.dots} />}
                {complete && "Redirecting"}
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}
