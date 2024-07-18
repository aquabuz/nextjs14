"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useRecoilState } from "recoil";
import { currentStore } from "@/admin-api/back-office/s1";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useRequestStoreInfo } from "@/service/network/api/retail";
import { ResponseData } from "@/service/network/config/types";
import { UseQueryResult } from "@tanstack/react-query";
import { useHeaderSubContext } from "@/app/context/header/HeaderSubContext";

interface Props {
  title?: string | null;
  titleFixed?: boolean;
}

const HeaderSub = ({ title, titleFixed }: Props) => {
  /**
   * @constant {/retail}
   * @description
   * 관리자 && /retail(매장 정보 페이지)
   * 타이틀 = 매장 이름
   * 새로고침 시 API 호출 필요
   */
  const { slug } = useParams<{ slug: string }>();

  const [storeInfo, setStoreInfo] = useRecoilState(currentStore);
  const [isNullStore, setIsNullStore] = useState(false);

  const contextData = useHeaderSubContext();
  const pathname = usePathname();
  if (!title) {
    title = pathname.split("/")[2] || pathname.split("/")[1];
  }

  const isRetailHeader = useCallback(() => {
    // !매장 페이지 || !매장 상세 페이지
    if (
      !pathname.includes("/retail") ||
      (!slug && pathname.includes("/retail"))
    ) {
      setStoreInfo({
        id: null,
        name: "",
      });
    }
  }, [pathname, setStoreInfo, slug]);

  useEffect(() => {
    isRetailHeader();
    if (contextData) {
      contextData.setPageName!(title); // page name 초기화
    }
  }, [contextData, isRetailHeader, title]);

  // 매장 리로드 시
  useEffect(() => {
    if (titleFixed) return;
    if (slug && pathname.includes("/retail") && !storeInfo.name) {
      setIsNullStore(true);
    }
  }, [pathname, slug, storeInfo.name, titleFixed]);

  const { data: storeData }: UseQueryResult<ResponseData> = useRequestStoreInfo(
    slug,
    isNullStore
  );

  useEffect(() => {
    setStoreInfo({
      id: storeData?.data[0].idx,
      name: storeData?.data[0].store_name,
    });
  }, [setStoreInfo, storeData]);

  useEffect(() => {
    if (!contextData) return;
    contextData?.isAdmin && pathname.includes("/download")
      ? contextData.setPageName!("파일 관리")
      : pathname.includes("/download")
      ? contextData.setPageName!("파일 다운로드")
      : pathname.includes("/community")
      ? contextData.setPageName!("게시판")
      : contextData.setPageName!(title);
  }, [contextData, pathname, title]);

  return (
    <div className="flex items-center gap-4 py-5 border-b border-default-200">
      <HomeIcon className="w-8 h-8" />
      <h2 className="text-2xl">
        {storeInfo && storeInfo.name ? storeInfo.name : contextData.pageName}
      </h2>
    </div>
  );
};

export default HeaderSub;
