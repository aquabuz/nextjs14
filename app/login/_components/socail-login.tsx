import React from "react";
import { signIn } from "next-auth/react";

export const SocialLogin = () => {
  return (
    <>
      <button
        className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
        onClick={() => signIn("kakao", { redirect: true, callbackUrl: "/" })}
      >
        kakao login
      </button>
      <button
        className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
        onClick={() => signIn("google", { redirect: true, callbackUrl: "/" })}
      >
        google login
      </button>
      <button
        className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
        onClick={() => signIn("naver", { redirect: true, callbackUrl: "/" })}
      >
        naver login
      </button>
    </>
  );
};
