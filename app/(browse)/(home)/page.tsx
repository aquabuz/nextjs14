"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Toast from "@/components/toast/toast";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  /**
   * @name 토스트(팝업)
   */
  const [isToast, setIsToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastBg, setToastBg] = useState("blue");

  useEffect(() => {
    if (session && session.data) {
      session.data?.user.roles?.toLowerCase().includes("admin_read")
        ? router.push("/admin-api/back-office")
        : session.data?.user.roles?.toLowerCase().includes("store_read")
        ? router.push("/admin-api/back-office/s1/contest")
        : router.push("/");

      if (session.data?.user.roles?.toLowerCase().includes("app_read")) {
        setToastMessage("챗봇 아이디입니다.");
        setToastBg("red");
        setIsToast(true);
      }
    } else {
      signIn();
    }
  }, [, router, session]);

  return (
    <main>
      {isToast && (
        <Toast
          setIsToast={setIsToast}
          message={toastMessage}
          bgColor={toastBg}
        />
      )}
    </main>
  );
}
