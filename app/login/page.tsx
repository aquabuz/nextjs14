"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button, Radio, RadioGroup } from "@nextui-org/react";
import { WaInput } from "@/components/form/wa-input";
import Toast from "@/components/toast/toast";

export type LoginInput = {
  username: string;
  password: string;
  loginType: string;
};

export default function Login() {
  const session = useSession();
  const router = useRouter();

  const [isToast, setIsToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [inputs, setInputs] = useState<LoginInput>({
    username: "",
    password: "",
    loginType: "2",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | any>) => {
    const { name, value } = event?.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    sessionStorage.removeItem("userInfo");
    try {
      const res = await signIn("credentials", {
        username: inputs.username,
        password: inputs.password,
        loginType: inputs.loginType,
        callbackUrl: "/",
        redirect: false,
      });
      if (res?.error) {
        console.log("error", res);
        alert("아이디 및 비밀번호를 확인해주세요");
        setToastMessage(res.error);
        setIsToast(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const focusInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session && session.status === "authenticated") {
      return router.push("/", { scroll: false });
    }
    if (focusInput.current) {
      focusInput.current.focus();
    }
  }, [, router, session]);

  return (
    <>
      <form className="grid w-full gap-2 max-w-96 " onSubmit={handleSubmit}>
        <WaInput
          id="username"
          name="username"
          label="username"
          type="text"
          required
          onChange={handleChange}
          ref={focusInput}
        />

        <WaInput
          id="password"
          name="password"
          label="password"
          type="password"
          required
          onChange={handleChange}
        />

        <RadioGroup
          name="loginType"
          defaultValue={inputs.loginType}
          orientation="horizontal"
          onChange={handleChange}
          onKeyUp={handleChange}
          className="py-2"
        >
          <Radio value="2">매장 로그인</Radio>
          <Radio value="0">관리자</Radio>
        </RadioGroup>

        <Button
          size="lg"
          type="submit"
          className="text-lg text-white shadow-lg bg-gradient-to-tr from-pink-500 to-yellow-500 "
        >
          로그인
        </Button>

        {/* <div className="flex justify-between mt-6">
          <Link href="#" className="text-white opacity-45">
            아이디/비밀번호 찾기
          </Link>
          <Link href="#" className="text-white opacity-45">
            회원가입
          </Link>
        </div> */}
      </form>

      {isToast && (
        <Toast
          setIsToast={setIsToast}
          message={toastMessage}
          position="bottom"
          bgColor="red"
        />
      )}
    </>
  );
}
