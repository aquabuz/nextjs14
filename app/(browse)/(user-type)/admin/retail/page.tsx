"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UseQueryResult } from "@tanstack/react-query";
import { useRequestStore } from "@/service/network/api/retail";
import { PageVo, SearchRule, SortVo } from "@/service/network/types";
import { ResponseData } from "@/service/network/config/types";
import SearchUI, { SearchFormData } from "@/components/search";
import { DataTable } from "@/components/table/data-table";

const SEARCH: PageVo = {
  page: 1,
  rows: 20,
  sorts: [
    {
      column: "regdate",
      order: "DESC",
    },
  ],
};

const RetailList = () => {
  const router = useRouter();

  const [requestSearch, setRequestSearch] = useState(SEARCH);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    refetch,
  }: UseQueryResult<ResponseData> = useRequestStore(requestSearch);

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
      { store_name: "매장 이름", default: true },
      { mem_hp: "휴대폰" },
      { mem_name: "성명" },
      { mem_id: "아이디" },
      { address: "주소" },
    ],
    keyword: "검색어",
  };

  const onFormSubmit = useCallback((obj: SearchRule) => {
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
  }, []);

  const handlerMovePage = async (item: any) => {
    const updatedStore = {
      id: item.idx,
      name: item.store_name,
    };
    router.push(`/admin-api/back-office/detail/${updatedStore.id}`);
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
    "store_name",
    "mem_name",
    "mem_hp",
    "address",
  ];

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
      />
      {isSuccess && (
        <DataTable
          title="매장 리스트"
          data={data}
          filterColumns={filterColumns}
          onMovePage={handlerMovePage}
          page={requestSearch.page}
          totalPages={data.pageInfo.totalPages}
          handlerPage={handlerPage}
          allowsSorting={true}
          sortDescriptor={sortDescriptor}
        />
      )}
      {isError && <span>isError</span>}
    </>
  );
};

export default RetailList;
