"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { ResponseData } from "@/service/network/config/types";
import DataCard from "@/components/card/data-card";
import {
  useDeleteMember,
  useRequestMember,
  useUpdateMember,
} from "@/service/network/api/member";
import { Button } from "@nextui-org/react";
import { ResponseMember } from "@/service/network/types/member";
import { useRouter } from "next/navigation";
import { DataCardProps } from "@/service/network/types";
import Toast from "@/components/toast/toast";

const MembersDetail = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();

  /**
   * @name 토스트(팝업)
   */
  const [isToast, setIsToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastBg, setToastBg] = useState("blue");

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    refetch,
  }: UseQueryResult<ResponseData> = useRequestMember(Number(params.slug));

  const dataCardRefs = useRef<DataCardProps | null>(null);

  useEffect(() => {
    if (!dataCardRefs.current) return;
    if (data && data!.data) {
      dataCardRefs.current.init!(
        [
          { key: "name", name: "이름", type: "input", readOnly: true },
          // {
          //   key: "mem_pw",
          //   name: "비밀번호",
          //   type: "input",
          //   inputType: "password",
          // },
          {
            // 0대기 1정상 2정지 3탈퇴
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
          // {
          //   key: "login_type",
          //   name: "로그인 타입",
          //   type: "select",
          //   selectorDataList: [
          //     { index: 0, name: "관리자" },
          //     { index: 1, name: "챗봇" },
          //     { index: 2, name: "매장" },
          //   ],
          //   selectorKetSet: { key: "index", display: "name" },
          //   placeholder: "",
          // },
          { key: "push_token", name: "토큰", type: "input" },
          {
            key: "reg_date",
            name: "등록일",
            type: "date",
            format: "yyyy-MM-dd",
          },
          {
            key: "upd_date",
            name: "등록일",
            type: "date",
            format: "yyyy-MM-dd",
          },
        ],
        data.data,
        "멤버 정보 수정/삭제",
        true,
        4
      );
    }
  }, [data]);

  const updateMember = useUpdateMember(Number(params.slug));
  const handlerUpdateMember = useCallback(() => {
    if (!dataCardRefs.current) return;

    const obj = {
      ...dataCardRefs.current.getData!(),
    } as ResponseMember;

    if (window.confirm("멤버 정보를 수정 하시겠습니까?")) {
      updateMember(obj, {
        onSuccess: () => {
          refetch();
          setIsToast(true);
          setToastMessage("멤버 정보를 수정 하였습니다.");
          setToastBg("blue");
        },
        onError: (error, variables, context) => {
          setIsToast(true);
          setToastMessage(error.message);
          setToastBg("red");
          console.log("error variables:::", variables);
        },
      });
    }
  }, [updateMember, refetch]);

  const deleteMember = useDeleteMember();
  const handlerDeleteChatbot = useCallback(() => {
    if (window.confirm("멤버 정보를 삭제 하시겠습니까?")) {
      deleteMember(Number(params.slug), {
        onSuccess: () => {
          setIsToast(true);
          setToastMessage("멤버 정보를 삭제 하였습니다.");
          setToastBg("red");
          if (
            window.confirm("멤버 정보를 삭제 하였습니다. 목록으로 이동합니다.")
          ) {
            router.push("/admin-api/back-office");
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
  }, [deleteMember, params.slug, router]);

  return (
    <>
      {isSuccess && (
        <>
          <DataCard ref={dataCardRefs} />
          <div className="flex gap-1 mb-4">
            <Button className="bg-red-900" onClick={handlerDeleteChatbot}>
              멤버 삭제
            </Button>
            <Button className="bg-blue-800" onClick={handlerUpdateMember}>
              멤버 수정
            </Button>
          </div>
        </>
      )}
      {isError && <span>isError</span>}
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

export default MembersDetail;
