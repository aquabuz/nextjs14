"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "@/service/network/api/api";
import { ResponseData } from "@/service/network/config/types";
import { PageVo } from "@/service/network/types";
import { FileInfo } from "@/service/network/types/fileInfo";

/**
 * 파일 요청
 * @param pageVo
 * @returns Promise
 */
export function useRequestFile(pageVo: PageVo) {
  return useQuery<ResponseData<FileInfo>>({
    queryKey: ["requestFile"],
    queryFn: () => request("post", `/admin-api/back-office/file`, pageVo),
  });
}

/**
 * 파일 업로드
 * @param uploadFileVo
 * @returns Promise
 */
export const useUploadFile = () => {
  const { mutate } = useMutation({
    mutationFn: (uploadFileVo: FormData) =>
      request("post", "/admin-api/back-office/file/upload", uploadFileVo, {
        "Content-Type": "multipart/form-data",
      }),
  });
  return mutate;
};

/**
 * 파일 업로드
 * @param obj
 * @returns Promise
 */
export const useUploadFileNew = () => {
  const { mutate } = useMutation({
    mutationFn: (obj: any) =>
      request("post", "/admin-api/back-office/file/new", obj),
  });
  return mutate;
};
