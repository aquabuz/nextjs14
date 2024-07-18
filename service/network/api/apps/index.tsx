"use client";

import { useQuery } from "@tanstack/react-query";
import { request } from "@/service/network/api/api";
import { ResponseData } from "@/service/network/config/types";
import { PageVo } from "@/service/network/types";

/**
 * 멤버(단말) 리스트
 * @param pageVo
 * @returns Promise
 */
export function useRequestApps(pageVo: PageVo) {
  return useQuery<ResponseData>({
    queryKey: ["requestApps"],
    queryFn: () => request("post", "/admin-api/back-office/apps", pageVo),
  });
}
