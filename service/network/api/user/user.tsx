"use client";

// import { useQuery } from "@tanstack/react-query";
// import { request } from "@/service/network/api/api";
// import type { PageVo } from "@/service/network/types/chatbot";
// import { ResponseData } from "@/service/network/config/types";
// import { User } from "../../types/user";

// /**
//  * 회원 정보
//  * @param pageVo
//  * @returns
//  */

// export function useRequestUsers(pageVo: PageVo) {
//   return useQuery<ResponseData<User>>({
//     queryKey: ["requestUsers"],
//     queryFn: () => request("post", "/admin-api/back-office/app/users", pageVo),
//   });
// }
