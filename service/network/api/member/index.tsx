"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "@/service/network/api/api";
import { ResponseData } from "@/service/network/config/types";
import { PageVo } from "@/service/network/types";
import { RequestMember } from "@/service/network/types/member";

/**
 * 멤버 리스트
 * @param pageVo
 * @returns Promise
 */
export function useRequestMembers(pageVo: PageVo) {
  return useQuery<ResponseData>({
    queryKey: ["requestMembers"],
    queryFn: () => request("post", "/admin-api/back-office/members", pageVo),
    // enabled: storeIdx !== "" ? true : false,
  });
}

/**
 * 멤버 정보 (단일)
 * @param id
 * @returns Promise
 */
export function useRequestMember(id: number) {
  return useQuery<ResponseData>({
    queryKey: ["requestMember"],
    queryFn: () => request("get", `/admin-api/back-office/member/${id}`, {}),
  });
}

/**
 * 멤버 정보 (자신 정보 호출)
 * @param id === 0
 * @returns Promise
 */
export function useRequestUserInfo(isNull: boolean) {
  return useQuery<ResponseData>({
    queryKey: ["requestUserInfo"],
    queryFn: () => request("get", `/admin-api/back-office/member/0`, {}),
    enabled: isNull,
  });
}

/**
 * 멤버 등록
 * @param createMemberVo
 * @returns Promise
 */
export const useCreateMember = () => {
  const { mutate } = useMutation({
    mutationFn: (createMemberVo: RequestMember) =>
      request("post", "/admin-api/back-office/member/new", createMemberVo),
  });
  return mutate;
};

/**
 * 멤버 수정
 * @param id
 * @returns Promise
 */
export const useUpdateMember = (id: number) => {
  const { mutate } = useMutation({
    mutationFn: (updateMemberVo: RequestMember) =>
      request("put", `/admin-api/back-office/member/${id}`, updateMemberVo),
  });
  return mutate;
};

/**
 * 멤버 삭제
 * @param id
 * @returns Promise
 */
export const useDeleteMember = () => {
  const { mutate } = useMutation({
    mutationFn: (id: number) =>
      request("delete", `/admin-api/back-office/member/${id}`, {}),
  });
  return mutate;
};
