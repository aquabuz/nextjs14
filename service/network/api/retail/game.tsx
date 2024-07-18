"use client";

import { useQuery } from "@tanstack/react-query";
import { request } from "@/service/network/api/api";
import { ResponseData } from "@/service/network/config/types";
import { PageVo } from "@/service/network/types";
import gameData from "@/data/test/store-games.json";

/**
 * 매장 정보
 * @param pageVo
 * @returns Promise
 */
export function useRequestGames(pageVo: PageVo) {
  return useQuery<ResponseData>({
    queryKey: ["requestGames"],
    queryFn: () =>
      request("post", "/admin-api/back-office/store/games", pageVo),
    // queryFn: () => gameData as any,
  });
}

/**
 * 타이머 정보
 * @param pageVo
 * @returns Promise
 */
export function useRequestGameTimer(pageVo: PageVo) {
  return useQuery<ResponseData>({
    queryKey: ["requestGameTimer"],
    queryFn: () =>
      request("post", "/admin-api/back-office/store/game/timer", pageVo),
  });
}

/**
 * 스트럭쳐 정보
 * @param pageVo
 * @returns Promise
 */
export function useRequestGameStructure(pageVo: PageVo) {
  return useQuery<ResponseData>({
    queryKey: ["requestGameStructure"],
    queryFn: () =>
      request("post", "/admin-api/back-office/store/game/structure", pageVo),
  });
}

/**
 * 스킨 정보
 * @param pageVo
 * @returns Promise
 */
export function useRequestGameTimerSkin(pageVo: PageVo) {
  return useQuery<ResponseData>({
    queryKey: ["requestGameTimerSkin"],
    queryFn: () =>
      request("post", "/admin-api/back-office/store/game/timer/skin", pageVo),
  });
}
