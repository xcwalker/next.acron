'use client'

import { useAuthContext } from "@/context/AuthContext";
import getDocument from "@/firebase/firestore/getData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { user } = useAuthContext()
  const router = useRouter()

  const [userData, setUserData] = useState();

  useEffect(() => {
    if (user === null) router.push("/")
    if (user !== null) router.push("/user/" + user.uid)
  }, [user, router])

  return <>
  </>;
}