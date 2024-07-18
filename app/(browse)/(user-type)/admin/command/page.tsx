"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { RequestCommandVo } from "@/service/network/types/command";
import {
  useRequestCommand,
  useUpdateCommand,
} from "@/service/network/api/command";
import { ResponseData } from "@/service/network/config/types";
import { DataCardProps } from "@/service/network/types";
import DataCard from "@/components/card/data-card";
import Toast from "@/components/toast/toast";
import { Button } from "@nextui-org/react";

const CommandDetail = () => {
  /**
   * @name 토스트(팝업)
   */
  const [isToast, setIsToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastBg, setToastBg] = useState("blue");

  const { data, isError, isSuccess, refetch }: UseQueryResult<ResponseData> =
    useRequestCommand();

  const dataCardRefs = useRef<DataCardProps | null>(null);

  useEffect(() => {
    if (!dataCardRefs.current) return;
    if (data && data!.data) {
      dataCardRefs.current.init!(
        [
          {
            key: "contest_cmd",
            name: "대회별 명령어",
            type: "textarea",
            size: "full",
            maxRow: 50,
          },
          {
            key: "def_template",
            name: "템플릿",
            type: "textarea",
            maxRow: 50,
          },
          {
            key: "help_cm",
            name: "관리자 사용 설명서",
            type: "textarea",
            maxRow: 50,
          },
          {
            key: "user_help",
            name: "사용자 도움말",
            type: "textarea",
            maxRow: 50,
          },
          {
            key: "reg_date",
            name: "등록일",
            type: "date",
            format: "yyyy-MM-dd",
          },
          {
            key: "upd_date",
            name: "수정일",
            type: "date",
            format: "yyyy-MM-dd",
          },
        ],
        data.data,
        "명령어 관리",
        true,
        3
      );
    }
  }, [data]);

  const updateCommand = useUpdateCommand();
  const handlerUpdateCommand = () => {
    if (!dataCardRefs.current) return;

    let obj = {
      ...dataCardRefs.current.getData!(),
    } as RequestCommandVo;

    if (window.confirm("명령어를 수정 하시겠습니까?")) {
      updateCommand(obj, {
        onSuccess: () => {
          refetch();
          setIsToast(true);
          setToastMessage("명령어를 수정 하였습니다.");
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
  };

  return (
    <>
      {isSuccess && (
        <>
          <DataCard ref={dataCardRefs} />
          <div className="flex gap-1 mb-4">
            <Button className="bg-blue-800" onClick={handlerUpdateCommand}>
              명령어 수정
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

export default CommandDetail;
