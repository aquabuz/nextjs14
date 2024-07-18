"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UseQueryResult } from "@tanstack/react-query";
import { useRequestGames } from "@/service/network/api/retail/game";
import { PageVo, SearchRule, SortVo } from "@/service/network/types";
import SearchUI, { SearchFormData } from "@/components/search";
import { DataTable } from "@/components/table/data-table";

const RetailContest = () => {
  const { slug } = useParams<{ slug: string }>();

  const initSearch = (idx: string) =>
    ({
      page: 1,
      rows: 20,
      search: {
        groupOp: "AND",
        rules: [
          {
            op: "eq",
            column: "mem_idx",
            keyword: idx,
          },
          {
            // 삭제 대회 제외
            column: "real_status",
            op: "ne",
            keyword: "4",
          },
        ],
      },
      sorts: [
        {
          column: "regdate",
          order: "DESC",
        },
      ],
    }) as PageVo;

  const [requestSearch, setRequestSearch] = useState(initSearch(slug));

  const { data, isLoading, isError, isSuccess, refetch }: UseQueryResult<any> =
    useRequestGames(requestSearch);

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
    columns: [{ game_name: "대회" }],
    keyword: "검색어",
  };

  const filterColumn = (col: string) => {
    // mem_idx column 가져오고, 중첩 제거
    return requestSearch?.search?.rules?.filter((item) => item.column !== col);
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
          rules: [...(filterColumn(obj.column) || []), obj],
        },
      });
    } else {
      setRequestSearch(initSearch(slug));
    }
  };

  const handlerPage = useCallback((pageNumber: number) => {
    setRequestSearch((prevState) => ({
      ...prevState,
      page: pageNumber,
    }));
  }, []);

  const filterColumns = [
    "real_status",
    "idx",
    "game_name",
    "game_method",
    "game_start_time",
    "regdate",
  ];

  useEffect(() => {
    const isEqual = (value1: any, value2: any) => {
      if (value1 === value2) {
        return true;
      }

      if (
        typeof value1 !== "object" ||
        value1 === null ||
        typeof value2 !== "object" ||
        value2 === null
      ) {
        return false;
      }

      const keys1 = Object.keys(value1);
      const keys2 = Object.keys(value2);

      if (keys1.length !== keys2.length) {
        return false;
      }

      for (const key of keys1) {
        if (!keys2.includes(key) || !isEqual(value1[key], value2[key])) {
          return false;
        }
      }

      return true;
    };

    if (!isEqual(requestSearch, initSearch(slug))) {
      refetch();
    }
  }, [refetch, requestSearch, slug]);

  return (
    <>
      <SearchUI
        title="검색"
        searchFormData={searchFormData}
        onFormSubmit={onFormSubmit}
      />
      {isSuccess && (
        <DataTable
          title="대회 리스트"
          data={data}
          filterColumns={filterColumns}
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

export default RetailContest;
