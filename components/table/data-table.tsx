"use client";

import React, { useEffect, useCallback, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  CircularProgress,
  Pagination,
  SortDescriptor,
} from "@nextui-org/react";
import { SortVo } from "@/service/network/types";
import { ResponseData } from "@/service/network/config/types";
import { FileInfo } from "@/service/network/types/fileInfo";
import { regexPhoneNumber } from "@/utils/converter";
import dateFormat from "@/utils/dateFormat";
import { WaInput } from "../form/wa-input";
import Actions from "./actions";

export interface FilterActions {
  name: string;
  items: string[];
}

interface TableProps {
  title?: string;
  selectionMode?: "none" | "single" | "multiple";
  isLoading?: boolean;
  data: ResponseData;
  filterColumns: (string | FilterActions)[];
  onActions?: ({ action, path }: { action: string; path: string }) => void;
  onMovePage?: (item: Object) => void;
  page?: number | undefined;
  pageInfo?: any;
  totalPages?: number | undefined;
  handlerPage?: any;
  allowsSorting?: boolean;
  sortDescriptor?: (sorts: SortVo) => any; // sorting
  children?: React.ReactNode; // slot
}

export const DataTable = ({
  title = "테이블",
  selectionMode = "single",
  isLoading,
  data,
  filterColumns,
  onActions,
  onMovePage,
  page,
  pageInfo,
  totalPages,
  handlerPage,
  allowsSorting,
  sortDescriptor,
  children,
}: TableProps) => {
  // children 속성 중 slot 활용 위치 조정
  const slots = React.Children.toArray(children).reduce((acc: any, child) => {
    if (React.isValidElement(child) && child.props.slot) {
      acc[child.props.slot] = child;
    }
    return acc;
  }, {});

  const { data: propsData, columns } = data;
  const [storeColumns, setStoreColumns] = useState([...columns]);

  const handlerActions = useCallback(
    (action: string, data: FileInfo) => {
      if (!onActions) return;
      onActions({
        action: action,
        path: data.path,
      });
    },
    [, onActions]
  );

  const renderColumn = useCallback((data: any, name: any) => {
    switch (name) {
      case "idx":
        return "IDX";
      case "status":
        return "상태";
      case "game_status":
        return "상태";
      case "real_status":
        return "상태";
      case "login_type":
        return "타입";
      default:
        return data["description"];
    }
  }, []);

  const renderCell = useCallback(
    (data: any, columnKey: any) => {
      const cellValue = data[columnKey];

      switch (columnKey) {
        //       1 정상 2 정지 3 탈퇴 <= 매장리스트
        // 0 대기 1 정상 2 정지 3 탈퇴 <= 멤버리스트
        case "status":
          return (
            <Chip
              className="gap-1 capitalize"
              color={
                cellValue === 0
                  ? "secondary"
                  : cellValue === 1
                    ? "success"
                    : cellValue === 2
                      ? "warning"
                      : cellValue === 3
                        ? "danger"
                        : "default"
              }
              size="sm"
              variant="dot"
            >
              {cellValue === 0
                ? "대기"
                : cellValue === 1
                  ? "정상"
                  : cellValue === 2
                    ? "정지"
                    : cellValue === 3
                      ? "탈퇴"
                      : "null"}
            </Chip>
          );
        case "real_status":
          return (
            <Chip
              className="gap-1 capitalize"
              color={
                cellValue === 0
                  ? "secondary"
                  : cellValue === 1
                    ? "success"
                    : cellValue === 2
                      ? "success"
                      : cellValue === 3
                        ? "warning"
                        : cellValue === 4
                          ? "danger"
                          : "default"
              }
              size="sm"
              variant="dot"
            >
              {cellValue === 0
                ? "대기"
                : cellValue === 1
                  ? "예약중"
                  : cellValue === 2
                    ? "진행중"
                    : cellValue === 3
                      ? "종료"
                      : cellValue === 4
                        ? "삭제"
                        : cellValue === 5
                          ? "일시정지"
                          : cellValue === 6
                            ? "진행중레지마감후"
                            : "null"}
            </Chip>
          );
        case "regdate":
          return dateFormat.parser(cellValue, "yyyy-MM-dd");
        case "game_start_time":
          return dateFormat.parser(cellValue, "yyyy-MM-dd");
        case "reg_date":
          return dateFormat.parser(cellValue, "yyyy-MM-dd");
        case "upd_date":
          return dateFormat.parser(cellValue, "yyyy-MM-dd");
        case "mem_hp":
          return regexPhoneNumber(cellValue);
        case "address":
          return `${cellValue} ${data["address_detail"]}`;
        case "login_type":
          return (
            <Chip
              className="gap-1 capitalize"
              color={
                cellValue === 0
                  ? "primary"
                  : cellValue === 1
                    ? "success"
                    : "secondary"
              }
              size="sm"
              variant="dot"
            >
              {cellValue === 0 ? "관리자" : cellValue === 1 ? "챗봇" : "매장"}
            </Chip>
          );
        case "push_token":
          return (
            <WaInput
              type="text"
              size="sm"
              classNames="basis-2/3"
              defaultValue={cellValue}
            />
          );
        case "actions":
          const { items } = filterColumns.find(
            (Column) =>
              typeof Column === "object" &&
              "name" in Column &&
              Column.name === columnKey
          ) as FilterActions;

          return (
            <Actions
              data={data}
              actions={items}
              handlerActions={handlerActions}
            />
          );
        default:
          return cellValue;
      }
    },
    [filterColumns, handlerActions]
  );

  useEffect(() => {
    /**
     * @var {filterColumns, columns}
     * @description
     * 사용자 정의 (보여줄 컬럼)과 response 의 column 을 비교 반환
     */
    const filtered = columns.filter((column: any) =>
      filterColumns.includes(column.name)
    );
    // action (유틸 버튼) 항목
    filterColumns.forEach((col) => {
      if (typeof col === "object" && "name" in col) {
        if (col.name === "actions") {
          filtered.push({
            name: "actions",
            description: "actions",
          });
        }
      }
    });
    setStoreColumns(filtered);
  }, [columns, filterColumns]);

  const handlerLink = useCallback(
    (item: Object) => {
      if (!onMovePage) return;
      return (event: React.MouseEvent) => {
        event.preventDefault();
        onMovePage(item);
      };
    },
    [onMovePage]
  );

  /**
   * @name handlerSortDescriptor
   * @function sortDescriptor 바인딩 함수
   * @param {allowsSorting}
   * @description
   * TableColumn [allowsSorting] 옵션 추가
   * @param {SortDescriptor, SortVo}
   * @description
   * SortDescriptor --> SortVo 로 변환 (*)
   * ascending = ASC
   * descending = DESC
   */
  const [sortDesc, setSortDesc] = useState<SortDescriptor>(); // sort 화살표 변환 바인딩

  const handlerSortDescriptor = useCallback(
    (obj: SortDescriptor) => {
      if (obj && sortDescriptor) {
        setSortDesc(obj);
        const sorts = {
          column: obj.column as string,
          order: obj.direction === "ascending" ? "ASC" : "DESC",
        };
        sortDescriptor(sorts as SortVo); // 변환 후 전달
      }
    },
    [sortDescriptor]
  );
  /**
   * @param pageInfo.sorts
   * @default sorts
   * sorts 가 null 이면 기본 오름차순 (ascending)
   * @description
   * 초기 sorting 화살표 방향 맞춰야 함
   * pageInfo={membersData.pageInfo} <-- parent binding
   * @TODO
   * reg_date 공통 사용 가능한가?
   * 추후 사용?
   */
  // useEffect(() => {
  //   if (!pageInfo?.sorts) {
  //     const _obj: SortDescriptor = {
  //       column: "reg_date", // TODO:: reg_date 공통 사용 가능한가?
  //       direction: "ascending",
  //     };
  //     handlerSortDescriptor(_obj); // TODO:: 추후 사용?
  //   }
  // }, [handlerSortDescriptor, pageInfo]);

  return (
    <Table
      isHeaderSticky
      aria-label={title}
      selectionMode={selectionMode}
      sortDescriptor={sortDesc}
      onSortChange={handlerSortDescriptor}
      classNames={{
        base: "min-h-full",
        table: "h-full",
      }}
      bottomContent={
        page && totalPages && page > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={totalPages}
              onChange={handlerPage}
            />
          </div>
        ) : null
      }
    >
      <TableHeader columns={storeColumns}>
        {(column: { name: string; description: string }) => (
          <TableColumn
            key={column.name}
            allowsSorting={allowsSorting}
            align={column.name === "actions" ? "center" : "start"}
          >
            {renderColumn(column, column.name)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        loadingContent={<CircularProgress />}
        emptyContent={"No data found"}
        items={propsData}
      >
        {(item: { idx: number }) => (
          <TableRow key={item.idx}>
            {(columnKey) => (
              <TableCell
                onClick={onMovePage && handlerLink(item)}
                className="cursor-pointer whitespace-nowrap"
              >
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
