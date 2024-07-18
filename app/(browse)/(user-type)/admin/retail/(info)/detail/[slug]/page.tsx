"use client";

import { useEffect, useRef } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { currentStore } from "@/admin-api/back-office/s1";
import { useRequestStoreInfo } from "@/service/network/api/retail";
import { DataCardProps } from "@/service/network/types";
import { ResponseData } from "@/service/network/config/types";
import DataCard from "@/components/card/data-card";

const RetailDetail = ({ params }: { params: { slug: string } }) => {
  const {
    data,
    isLoading,
    isError,
    isSuccess,
    refetch,
  }: UseQueryResult<ResponseData> = useRequestStoreInfo(
    params.slug,
    !!params.slug
  );

  const dataCardRefs = useRef<DataCardProps | null>(null);

  useEffect(() => {
    if (!dataCardRefs.current) return;
    if (data && data!.data) {
      dataCardRefs.current.init!(
        [
          { key: "mem_name", name: "이름", type: "input" },
          { key: "store_name", name: "상호", type: "input" },
          {
            key: "status",
            name: "상태",
            type: "",
            statusAr: [
              { 0: "대기" },
              { 1: "정상" },
              { 2: "정지" },
              { 3: "탈퇴" },
            ],
          },
          {
            key: "auth_status",
            name: "승인완료",
            type: "",
            statusAr: [{ 7: "승인" }],
          },
          {
            key: "regdate",
            name: "등록일",
            type: "date",
            format: "yyyy-MM-dd",
          },
          { key: "mem_hp", name: "휴대폰", type: "input" },
          { key: "store_open", name: "개장 시간", type: "input" },
          { key: "email", name: "이메일", type: "input" },
          { key: "address", name: "주소", type: "input" },
        ],
        data.data[0],
        "",
        true,
        4
      );
    }
  }, [data]);

  // HeaderSub title
  const [, setStoreInfo] = useRecoilState(currentStore);
  useEffect(() => {
    setStoreInfo({
      id: data ? data?.data[0].idx : null,
      name: data ? data?.data[0].store_name : "",
    });
  }, [data, setStoreInfo]);

  return (
    <>
      {isSuccess && <DataCard ref={dataCardRefs} />}
      {isError && <span>isError</span>}
    </>
  );
};

export default RetailDetail;
