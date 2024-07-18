"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { UseQueryResult } from "@tanstack/react-query";
import { UserIcon } from "@heroicons/react/24/outline";
import { useRequestApps } from "@/service/network/api/apps";
import { PageVo, SearchRule, SortVo } from "@/service/network/types";
import SearchUI, { SearchFormData } from "@/components/search";
import { DataTable } from "@/components/table/data-table";
import AppRegister from "./_components/app-register";
import { useRequestGames } from "@/service/network/api/retail/game";

const SEARCH: PageVo = {
  page: 1,
  rows: 20,
};

const MembersList = () => {
  const router = useRouter();

  const [requestSearch, setRequestSearch] = useState(SEARCH);

  const {
    data: appsData,
    isError,
    isSuccess,
    refetch,
  }: UseQueryResult<any> = useRequestApps(requestSearch);

  // const { data }: UseQueryResult<any> = useRequestGames(requestSearch);

  /**
   * @name Sorting
   * @param {requestSort}
   */
  const sortDescriptor = useCallback((sorts: SortVo) => {
    setRequestSearch((prevState: PageVo) => ({
      ...prevState,
      sorts: [sorts],
    }));
  }, []);

  const searchFormData: SearchFormData = {
    columns: [
      { idx: "일련 번호" },
      { name: "성명" },
      { mem_id: "아이디" },
      { status: "상태" },
    ],
    keyword: "검색어",
  };

  const onFormSubmit = (obj: SearchRule) => {
    /**
     * @name onFormSubmit
     * @description
     * 페이징 초기화 (page: 1)
     * 기존 조건 무시
     * 초기화 버튼: obj === null (else)
     */
    if (obj) {
      setRequestSearch({
        page: 1,
        rows: 20,
        search: {
          groupOp: "AND",
          rules: [{ ...obj }],
        },
      });
    } else {
      setRequestSearch(SEARCH);
    }
  };

  const handlerPage = useCallback((pageNumber: number) => {
    setRequestSearch((prevState) => ({
      ...prevState,
      page: pageNumber,
    }));
  }, []);

  const filterColumns = [
    "status",
    "mem_id",
    "name",
    "login_type",
    "push_token",
  ];

  useEffect(() => {
    refetch();
  }, [refetch, requestSearch]);

  const [isShowAppPopup, setShowAppPopup] = useState<boolean>(false); // 앱 등록 팝업
  const openAppRegModal = useCallback(() => {
    setShowAppPopup(true);
  }, []);

  const handlerAppRegister = useCallback(
    (message: string) => {
      console.log("message", message);
      if (message === "close") {
        setShowAppPopup(false);
      }
      if (message === "done") {
        refetch();
      }
    },
    [refetch]
  );

  return (
    <>
      <SearchUI
        title="검색"
        searchFormData={searchFormData}
        onFormSubmit={onFormSubmit}
      >
        <div className="ml-auto">
          <Button
            startContent={<UserIcon width={20} height={20} />}
            className="bg-cyan-700"
            onClick={openAppRegModal}
          >
            앱 등록
          </Button>
        </div>
      </SearchUI>
      {isSuccess && (
        <DataTable
          title="멤버 리스트"
          data={appsData}
          filterColumns={filterColumns}
          page={requestSearch.page}
          totalPages={appsData.pageInfo.totalPages}
          handlerPage={handlerPage}
          allowsSorting={true}
          sortDescriptor={sortDescriptor}
        >
          <div
            slot="noDataButton"
            className="py-10 flex flex-col items-center gap-5"
          >
            <p className="flex justify-center items-center text-center gap-1 text-lg">
              등록된 앱이 없습니다. 🥲
              <br />
              앱을 먼저 등록해주세요.
            </p>
            <Button
              startContent={<UserIcon width={20} height={20} />}
              className="w-60 bg-cyan-700"
              onClick={openAppRegModal}
            >
              앱 등록
            </Button>
          </div>
        </DataTable>
      )}
      {isError && <span>isError</span>}
      <AppRegister
        isShow={isShowAppPopup}
        handlerAppRegister={handlerAppRegister}
      />
    </>
  );
};

export default MembersList;
