"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { useCreateMember } from "@/service/network/api/member";
import { RequestMember } from "@/service/network/types/member";
import { DataCardProps } from "@/service/network/types";
import { validateUser } from "@/utils/validation/memberRegister";
import DataCard from "@/components/card/data-card";
import Toast from "@/components/toast/toast";

const MemberRegister = () => {
  const router = useRouter();

  /**
   * @name 토스트(팝업)
   */
  const [isToast, setIsToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastBg, setToastBg] = useState("blue");

  const registerRef = useRef<DataCardProps | null>(null);

  useEffect(() => {
    if (!registerRef.current) return;
    registerRef.current.init!(
      [
        { key: "mem_id", name: "사용자 아이디", type: "input" },
        {
          key: "mem_pw",
          name: "사용자 비밀번호",
          type: "input",
          inputType: "password",
        },
        { key: "name", name: "사용자 이름", type: "input" },
        {
          key: "status",
          name: "상태",
          type: "select",
          selectorDataList: [
            { index: 0, name: "대기" },
            { index: 1, name: "정상" },
            { index: 2, name: "정지" },
            { index: 3, name: "탈퇴" },
          ],
          selectorKetSet: { key: "index", display: "name" },
          placeholder: "",
        },
        {
          key: "login_type",
          name: "로그인 타입",
          type: "select",
          selectorDataList: [
            { index: 0, name: "관리자" },
            { index: 1, name: "챗봇" },
            { index: 2, name: "매장" },
          ],
          selectorKetSet: { key: "index", display: "name" },
          disabledKeys: ["0"], // 관리자 disabled
          placeholder: "",
        },
      ],
      null,
      "멤버 정보 등록",
      true,
      3
    );
  }, []);

  const createMember = useCreateMember();
  const [validations, setValidations] = useState<Array<{}>>([]);
  const registerMember = useCallback(() => {
    if (!registerRef.current) return;

    let obj = {
      ...registerRef.current.getData!(),
    } as RequestMember;

    obj = {
      ...obj,
      login_type: obj.login_type && Number(obj.login_type),
      status: obj.status && Number(obj.status),
    };

    const validationResult = validateUser(obj);
    if (validationResult && validationResult?.length > 0) {
      console.error(validationResult);
      setValidations(validationResult);
    } else {
      if (window.confirm("멤버를 등록 하시겠습니까?")) {
        createMember(obj, {
          onSuccess: () => {
            setIsToast(true);
            setToastMessage("멤버를 등록 하였습니다.");
            setToastBg("blue");
            if (
              window.confirm("멤버를 등록 하였습니다. 목록으로 이동합니다.")
            ) {
              router.push("admin-api/back-office");
            }
          },
          onError: (error, variables, context) => {
            setIsToast(true);
            setToastMessage(error.message);
            setToastBg("red");
            console.log("error variables:::", variables);
          },
        });
      }
    }
  }, [createMember, router]);

  return (
    <>
      <DataCard validations={validations} ref={registerRef} />
      <Button className="bg-blue-800" onClick={registerMember}>
        멤버 등록
      </Button>
      {isToast && (
        <Toast
          setIsToast={setIsToast}
          message={toastMessage}
          position="bottom"
          bgColor={toastBg}
        />
      )}
    </>
  );
};

export default MemberRegister;
