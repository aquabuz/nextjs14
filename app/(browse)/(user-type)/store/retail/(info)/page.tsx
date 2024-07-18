"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RetailHome = () => {
  const router = useRouter();

  /**
   * @description
   * 관리자에는 매장리스트 페이지가 있다.
   * 매장 관리자에는 매장리스트 페이지가 없다.
   *
   * @file menu-item.ts
   * 매장 관리자(store)
   * { name: "매장관리", path: "/admin-api/back-office/s1" }
   * path를 /admin-api/back-office/s1/contest 일 경우 nav 메뉴 활성화 이슈
   */
  useEffect(() => {
    router.push(`/admin-api/back-office/s1/contest`);
  }, [router]);
};

export default RetailHome;
