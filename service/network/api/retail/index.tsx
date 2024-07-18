"use client";

import { useQuery } from "@tanstack/react-query";
import { request } from "@/service/network/api/api";
import { ResponseData } from "@/service/network/config/types";
import { PageVo } from "@/service/network/types";
import detailData from "@/data/test/store-detail.json";

/**
 * 매장 정보 (리스트)
 * @param pageVo
 * @returns Promise
 * @description /retail
 */
export function useRequestStore(pageVo: PageVo) {
  return useQuery<ResponseData>({
    queryKey: ["requestStore"],
    queryFn: () => request("post", "/admin-api/back-office/store", pageVo),
    // queryFn: () => detailData as any,
    placeholderData: (previousData, previousQuery) => previousData,
  });
}

/**
 * 매장 정보 (단일)
 * @param id
 * @returns Promise
 * @description /retail/detail
 * slug && storeInfo(recoil currentStore) 데이터 없음 = 페이지 새로고침 발생 시에
 * isNull = true
 */
export function useRequestStoreInfo(id: string, isNullStore: boolean = false) {
  const params = {
    page: 1,
    row: 1,
    search: {
      groupOp: "AND",
      rules: [{ op: "eq", column: "idx", keyword: id }],
    },
  };
  return useQuery<ResponseData>({
    queryKey: ["requestStoreName"],
    queryFn: () => request("post", "/admin-api/back-office/store", params),
    placeholderData: (previousData, previousQuery) => previousData,
    enabled: isNullStore,
  });
}
