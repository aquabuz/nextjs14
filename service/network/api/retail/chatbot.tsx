"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "@/service/network/api/api";
import { ResponseData } from "@/service/network/config/types";
import { PageVo } from "@/service/network/types";
import type {
  RequestRoomChatbot,
  RequestChatbotVo,
  RequestDeleteVo,
} from "@/service/network/types/chatbot";
import roomData from "@/data/test/store-room.json";
import roomChatbotData from "@/data/test/store-room-chatbot.json";

/**
 * 매장 챗봇 정보
 * @param pageVo
 * @returns Promise
 */
export function useRequestStoreRoom(pageVo: PageVo) {
  return useQuery<ResponseData>({
    queryKey: ["requestStoreRoom"],
    queryFn: () => request("post", "/admin-api/back-office/store/room", pageVo),
    // queryFn: () => roomData as any,
  });
}

/**
 * 매장 챗봇 룸 신규 등록
 * @param chatbotVo
 * @returns Promise
 */
export function useCreateChatbot() {
  const { mutate } = useMutation({
    mutationFn: (chatbotVo: RequestChatbotVo) =>
      request("post", "/admin-api/back-office/store/room/new", chatbotVo),
  });
  return mutate;
}

/**
 * 매장 챗봇 룸 정보 변경
 * @param chatbotVo
 * @returns Promise
 */
export function useUpdateStoreRoom() {
  const { mutate } = useMutation({
    mutationFn: (chatbotVo: RequestChatbotVo) =>
      request("put", "/admin-api/back-office/store/room", chatbotVo),
  });
  return mutate;
}

/**
 * 매장 챗봇 룸 정보 삭제
 * @param deleteVo
 * @returns Promise
 */
export function useDeleteStoreRoom() {
  const { mutate } = useMutation({
    mutationFn: (deleteVo: RequestDeleteVo) =>
      request("delete", "/admin-api/back-office/store/room", deleteVo),
  });
  return mutate;
}

/**
 * 챗봇 조회
 * @param pageVo
 * @returns Promise
 */
export const useRequestRoomChatbot = () => {
  const { mutate } = useMutation({
    mutationFn: (pageVo: PageVo) =>
      request("post", "/admin-api/back-office/store/room/chatbot", pageVo),
  });
  return mutate;
};

/**
 * 챗봇 등록
 * @param createRoomChatbotVo
 * @returns Promise
 */
export const useCreateRoomChatbot = () => {
  const { mutate } = useMutation({
    mutationFn: (createRoomChatbotVo: RequestRoomChatbot) =>
      request(
        "post",
        "/admin-api/back-office/store/room/chatbot/new",
        createRoomChatbotVo
      ),
  });
  return mutate;
};

/**
 * 챗봇 변경
 * @param updateRoomChatbotVo
 * @returns Promise
 */
export const useUpdateRoomChatbot = () => {
  const { mutate } = useMutation({
    mutationFn: (updateRoomChatbotVo: RequestRoomChatbot) =>
      request(
        "put",
        "/admin-api/back-office/store/room/chatbot",
        updateRoomChatbotVo
      ),
  });
  return mutate;
};

/**
 * 챗봇 삭제
 * @param id
 * @returns Promise
 * @description 명령어 삭제는 기존 코드 사용. room idx 만 매칭하면 됨.
 */
export const useDeleteRoomChatbot = () => {
  const { mutate } = useMutation({
    mutationFn: (id: number) =>
      request("delete", `/admin-api/back-office/store/room/chatbot/${id}`, {}),
  });
  return mutate;
};
