"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { UseQueryResult } from "@tanstack/react-query";
import { UserIcon } from "@heroicons/react/24/outline";
import { useRequestMembers } from "@/service/network/api/member";
import { PageVo, SearchRule, SortVo } from "@/service/network/types";
import SearchUI, { SearchFormData } from "@/components/search";
import { DataTable } from "@/components/table/data-table";

const SEARCH: PageVo = {
  page: 1,
  rows: 20,
  search: {
    groupOp: "AND",
    rules: [
      {
        op: "eq",
        column: "login_type",
        keyword: "1",
      },
    ],
  },
};

const MembersList = () => {
  const router = useRouter();

  const [requestSearch, setRequestSearch] = useState(SEARCH);

  const {
    data: membersData,
    isError,
    isSuccess,
    refetch,
  }: UseQueryResult<any> = useRequestMembers(requestSearch);

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
      { store_name: "매장 이름" },
      { mem_id: "아이디" },
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
    "idx",
    "mem_id",
    "name",
    "store_name",
    "login_type",
    "reg_date",
    "upd_date",
    "push_token",
  ];

  const handlerMovePage = (item: any) => {
    router.push(`admin-api/back-office/detail/${item.idx}`);
  };

  useEffect(() => {
    if (requestSearch !== SEARCH) {
      refetch();
    }
  }, [refetch, requestSearch]);

  return (
    <>
      <SearchUI
        title="검색"
        searchFormData={searchFormData}
        onFormSubmit={onFormSubmit}
      >
        {/*
        기능 사용 X
        <div className="ml-auto">
          <Button
            startContent={<UserIcon width={20} height={20} />}
            className="bg-cyan-700"
          >
            회원 등록
          </Button>
        </div>
        */}
      </SearchUI>
      {isSuccess && (
        <DataTable
          title="멤버 리스트"
          selectionMode="none"
          data={membersData}
          filterColumns={filterColumns}
          onMovePage={handlerMovePage}
          page={requestSearch.page}
          totalPages={membersData.pageInfo.totalPages}
          handlerPage={handlerPage}
          allowsSorting={true}
          sortDescriptor={sortDescriptor}
        />
      )}
      {isError && <span>isError</span>}
    </>
  );
};

export default MembersList;
