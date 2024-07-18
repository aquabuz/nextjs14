"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useRequestFile,
  useUploadFile,
  useUploadFileNew,
} from "@/service/network/api/file";
import { Button } from "@nextui-org/react";
import { useHeaderSubContext } from "@/app/context/header/HeaderSubContext";
import { UserIcon } from "@heroicons/react/24/outline";
import { ResponseData } from "@/service/network/config/types";
import { UseQueryResult } from "@tanstack/react-query";
import { PageVo, SortVo } from "@/service/network/types";
// import SearchUI from "@/components/search";
import { DataTable } from "@/components/table/data-table";
import { FileInfo } from "@/service/network/types/fileInfo";

const SEARCH: PageVo = {
  page: 1,
  rows: 20,
  sorts: [
    {
      column: "reg_date",
      order: "DESC",
    },
  ],
};

const DownloadList = () => {
  const contextData = useHeaderSubContext(); // layout (server component) data
  const [isMobile, setIsMobile] = useState(false);
  const [requestSearch, setRequestSearch] = useState(SEARCH);

  const {
    data: fileList,
    isSuccess,
    isError,
    refetch,
  }: UseQueryResult<ResponseData> = useRequestFile(
    contextData.isAdmin
      ? SEARCH
      : {
          ...SEARCH,
          rows: 1,
          search: {
            groupOp: "AND",
            rules: [
              // 파일 업로드 시 정의함 type: 1 = APK
              {
                column: "type",
                op: "eq",
                keyword: "1",
              },
            ],
          },
        }
  );

  const filterColumns = [
    "status",
    "path",
    "reg_date",
    {
      name: "actions",
      items: [
        "download",
        // "delete", // API : 파일 삭제 시 <DB URL> 도 삭제 추가 작업해야 됨 (백엔드)
      ],
    },
  ];

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("android") || userAgent.includes("iphone")) {
      setIsMobile(true);
    }
  }, []);

  const handlerActions = ({
    action,
    path,
  }: {
    action: string;
    path: string;
  }) => {
    if (action === "download") {
      if (isMobile) {
        if (window.confirm("파일을 다운로드 하시겠습니까?")) {
          const url = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/admin-api/back-office/file/resources?fileName=${path}`;
          window.open(url, "_blank");
        }
      } else {
        alert("모바일 전용 다운로드입니다.");
      }
    }
  };

  // TODO: 사용자 버전 다운로드
  // 추후 관리자 함수와 머지할 예정
  const handlerUserActions = () => {
    if (isMobile) {
      if (window.confirm("파일을 다운로드 하시겠습니까?")) {
        const url = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/admin-api/back-office/file/resources?fileName=${fileList?.data[0].path}`;
        window.open(url, "_blank");
      }
    } else {
      alert("모바일 전용 다운로드입니다.");
    }
  };

  const handlerPage = useCallback((pageNumber: number) => {
    setRequestSearch((prevState) => ({
      ...prevState,
      page: pageNumber,
    }));
  }, []);

  /**
   * @name Sorting
   * @param {requestSort}
   */
  const sortDescriptor = useCallback((sorts: SortVo) => {
    console.log("sort", sorts);

    setRequestSearch((prevState: PageVo) => ({
      ...prevState,
      sorts: [sorts],
    }));
  }, []);

  useEffect(() => {
    // sorts 이벤트 이후
    refetch();
  }, [refetch, requestSearch]);

  /**
   * @name File
   * @param {File}
   */
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    console.log("files[0]", event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleSubmit = (submit: FormEvent<HTMLFormElement>) => {
    submit.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("multipartFile", file);
    handlerUploadFile(formData);
  };

  const uploadFile = useUploadFile();
  const handlerUploadFile = (formData: FormData) => {
    if (window.confirm("파일을 등록 하시겠습니까?")) {
      uploadFile(formData, {
        onSuccess: (data) => {
          console.log("FormData success");
          if (data.data[0].url) {
            handlerUploadFileNew(data.data[0].url);
          } else {
            console.error("url 이 없습니다.");
          }
        },
        onError: () => {
          console.error("FormData error");
        },
      });
      setFile(null);
    }
  };

  const uploadFileNew = useUploadFileNew();
  const handlerUploadFileNew = (path: string) => {
    const obj = {
      status: 1,
      path: path,
      type: 1, // 1 = APK
    };
    uploadFileNew(obj, {
      onSuccess: () => {
        console.log("uploadFileNew success");
        refetch();
      },
      onError: (error) => {
        console.error("uploadFileNew error", error);
      },
    });
  };

  return (
    <>
      <div className="py-8 flex flex-col gap-2">
        {contextData.isAdmin && (
          <>
            <hr />
            <p>APK 파일 등록</p>
            <div slot="uploadForm" className="py-4 flex flex-col gap-3">
              <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />

                <Button
                  startContent={<UserIcon width={20} height={20} />}
                  className="bg-cyan-700"
                  type="submit"
                  isDisabled={!file}
                >
                  업로드
                </Button>
              </form>
              {file && <p>Selected file: {file.name}</p>}
            </div>
            <hr />
          </>
        )}
        {
          <>
            {/* <SearchUI
                  title="검색"
                  searchFormData={searchFormData}
                  onFormSubmit={onFormSubmit}
                /> */}
            {isSuccess &&
              (contextData.isAdmin ? (
                <DataTable
                  title="다운로드 리스트"
                  selectionMode="none"
                  data={fileList}
                  filterColumns={filterColumns}
                  onActions={handlerActions}
                  page={requestSearch.page}
                  totalPages={fileList.pageInfo.totalPages} // 매장에선 최신 1개 리스트만 출력
                  handlerPage={handlerPage}
                  allowsSorting={true}
                  sortDescriptor={sortDescriptor}
                />
              ) : (
                <Button
                  className="py-8 bg-blue-800"
                  onClick={handlerUserActions}
                >
                  파일 다운로드
                </Button>
                // <a
                //   href={`${process.env.NEXT_PUBLIC_API_SERVER_URL}/admin-api/back-office/file/resources?fileName=${fileList?.data[0].path}`}
                //   className="bg-cyan-700 w-80 p-6"
                // >
                //   파일 다운로드
                // </a>
              ))}
            {isError && <span>isError</span>}
          </>
        }
      </div>
    </>
  );
};

export default DownloadList;
