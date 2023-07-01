"use client";
import { useAuthContext } from "@/context/AuthContext";
import logout from "@/firebase/auth/logout";
import LogoutStyle from "@/styles/account.logout.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function AccountLogout() {
  const user = useAuthContext();
  const router = useRouter();
  const dialog = document.querySelector("#" + LogoutStyle.dialog);

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

    const promise = logout();

    toast.promise(promise, {
      loading: "Logging Out",
      success: "Logged Out",
      error: "Error Logging Out",
    });

    promise.then(() => {
      console.log("User logged out successfully");
      router.push("/account/login");
    });

    promise.catch((err) => {
      console.error("Error logging out:" + err);
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
              <button type="submit">Logout</button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}
