"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "@/service/network/api/api";
import { ResponseData } from "@/service/network/config/types";
import { RequestCommandVo } from "@/service/network/types/command";

/**
 * 챗봇 공통 명령어
 * @returns Promise
 */
export function useRequestCommand() {
  return useQuery<ResponseData>({
    queryKey: ["requestCommand"],
    queryFn: () =>
      request("get", "/admin-api/back-office/store/chatbot/common", {}),
  });
}

/**
 * 챗봇 공통 명령어 수정
 * @param commandVo
 * @type {RequestCommandVo}
 * @returns Promise
 */
export function useUpdateCommand() {
  const { mutate } = useMutation({
    mutationFn: (commandVo: RequestCommandVo) =>
      request("put", "/admin-api/back-office/store/chatbot/common", commandVo),
  });
  return mutate;
}
