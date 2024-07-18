"use client";

import Link from "next/link";
import { Logo } from "@/components/logo/logo";

function NotFound({}) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-4 p-20 ">
      <Logo />
      <h1 className="text-9xl text-bold">404</h1>
      <p>An NotFound occurred on client</p>
      <Link
        className="text-lg text-white shadow-lg"
        type="button"
        href="/"
        scroll={false}
      >
        홈으로
      </Link>
    </div>
  );
}

export default NotFound;
