"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import { UseQueryResult } from "@tanstack/react-query";
import {
  useRequestStoreRoom,
  useCreateChatbot,
  useUpdateStoreRoom,
  useDeleteStoreRoom,
  useRequestRoomChatbot,
  useDeleteRoomChatbot,
  useUpdateRoomChatbot,
  useCreateRoomChatbot,
} from "@/service/network/api/retail/chatbot";
import { useRequestGames } from "@/service/network/api/retail/game";
import { ResponseData } from "@/service/network/config/types";
import { Column, DataCardProps, PageVo } from "@/service/network/types";
import {
  RequestChatbotVo,
  RequestRoomChatbot,
} from "@/service/network/types/chatbot";
import DataCard from "@/components/card/data-card";
import DataCardCreate from "@/components/card/data-card-create";
import { useRequestApps } from "@/service/network/api/apps";
import Toast from "@/components/toast/toast";

const RetailKakao = ({ params }: { params: { slug: string } }) => {
  /**
   * @name 토스트(팝업)
   */
  const [isToast, setIsToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastBg, setToastBg] = useState("blue");

  /**
   * @name 오픈채팅방(리스트)
   */
  const [cbStoreIdx, setCbStoreIdx] = useState("");
  const storeRoomRef = useRef<DataCardProps | null>(null);

  const storeRoomPageVo: PageVo = {
    page: 1,
    rows: 1,
    search: {
      groupOp: "AND",
      rules: [{ op: "eq", column: "store_idx", keyword: params.slug }],
    },
  };

  const {
    data: storeRoom,
    isSuccess: isSuccessStoreRoom,
    refetch,
  }: UseQueryResult<ResponseData> = useRequestStoreRoom(storeRoomPageVo);

  const { data: appsData }: UseQueryResult<ResponseData> = useRequestApps({
    page: 1,
    rows: 500,
  });

  useEffect(() => {
    if (!storeRoomRef.current) return;
    if (storeRoom && storeRoom.data && appsData && appsData.data) {
      storeRoomRef.current.init!(
        [
          {
            key: "room_name",
            name: "오픈 채팅방 이름",
            type: "input",
            placeholder: "오픈 채팅방 이름",
          },
          { key: "admins", name: "방장", type: "input", placeholder: "방장명" },
          {
            key: "welcome",
            name: "오픈채팅봇 환영 메시지",
            type: "input",
            placeholder: "환영 메시지",
          },
          {
            key: "app_idx",
            name: "연동 앱",
            type: "select",
            selectorDataList: appsData.data,
            selectorKetSet: {
              key: "idx",
              display: "name",
              displayBracket: "mem_id", // (id)
            },
            placeholder: "",
            isRequired: true,
          },
        ],
        storeRoom.data[0] || null,
        "오픈 채팅방 정보",
        true,
        4
      );
    }
  }, [cbStoreIdx, appsData, storeRoom]);

  useEffect(() => {
    if (storeRoom) {
      setCbStoreIdx(storeRoom.data[0]?.idx || "");
    }
  }, [storeRoom]);

  const createRoom = useCreateChatbot();
  const handlerCreateRoom = useCallback(() => {
    if (!storeRoomRef.current) return;

    let obj = {
      ...storeRoomRef.current.getData!(),
      store_idx: Number(params.slug),
    } as RequestChatbotVo;

    obj = {
      ...obj,
      app_idx: obj.app_idx && Number(obj.app_idx),
    };

    if (!obj.app_idx) {
      setToastMessage("연동 앱을 선택해주세요.");
      setToastBg("red");
      return setIsToast(true);
    }

    if (window.confirm("오픈채팅방을 등록 하시겠습니까?")) {
      createRoom(obj, {
        onSuccess: () => {
          refetch();
          setIsToast(true);
          setToastMessage("오픈채팅방을 등록 하였습니다.");
          setToastBg("blue");
        },
        onError: (error, variables, context) => {
          setIsToast(true);
          setToastMessage(error.message);
          setToastBg("red");
          console.log("error variables:::", variables);
        },
      });
    }
  }, [createRoom, params.slug, refetch]);

  const updateRoom = useUpdateStoreRoom();
  const handlerUpdateRoom = () => {
    if (!storeRoomRef.current) return;

    let obj = {
      ...storeRoomRef.current.getData!(),
      store_idx: Number(params.slug),
    } as RequestChatbotVo;

    obj = {
      ...obj,
      app_idx: obj.app_idx && Number(obj.app_idx),
    };

    if (window.confirm("오픈채팅방을 수정 하시겠습니까?")) {
      updateRoom(obj, {
        onSuccess: () => {
          refetch();
          setIsToast(true);
          setToastMessage("오픈채팅방을 수정 하였습니다.");
          setToastBg("blue");
        },
        onError: (error, variables, context) => {
          setIsToast(true);
          setToastMessage(error.message);
          setToastBg("red");
          console.log("error variables:::", variables);
        },
      });
    }
  };

  /**
   * @name 대회(리스트)
   */
  const gamePageVo: PageVo = {
    page: 1,
    rows: 100,
    search: {
      groupOp: "AND",
      rules: [
        { op: "eq", column: "mem_idx", keyword: params.slug },
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
  };
  const { data: gameData }: UseQueryResult<ResponseData> =
    useRequestGames(gamePageVo);

  /**
   * @name 챗봇명령어(리스트)
   * @constant {useQuery}
   * @constant {useMutation}
   * @description
   * - 채팅룸 삭제 후 반응성 (X)
   * - 이전 탭 이동 후 DataCard refs (X)
   * storeIdx 가 있는 경우에만 호출해야 함.
   * useQuery enabled 로 컨트롤 하기엔 무리
   */
  const [roomChatbot, setRoomChatbot] = useState<any | null>(null);
  const requestRoom = useRequestRoomChatbot();
  const handlerRequestRoom = useCallback(() => {
    const roomChatbotPageVo: PageVo = {
      page: 1,
      rows: 20,
      search: {
        groupOp: "AND",
        rules: [{ op: "eq", column: "cb_store_idx", keyword: cbStoreIdx }],
      },
      sorts: [
        {
          column: "idx",
          order: "DESC",
        },
      ],
    };

    requestRoom(roomChatbotPageVo, {
      onSuccess: (data) => {
        if (data) {
          setRoomChatbot(data.data);
        } else {
          console.log("no requestRoom data:::");
        }
      },
      onError: (error, variables, context) => {
        setIsToast(true);
        setToastMessage(error.message);
        setToastBg("red");
        console.log("error variables:::", variables);
      },
    });
  }, [cbStoreIdx, requestRoom]);
  useEffect(() => {
    // cbStoreIdx 업데이트 챗봇명령어 API 호출
    if (cbStoreIdx) {
      handlerRequestRoom();
    }
  }, [cbStoreIdx, handlerRequestRoom]);

  const deleteRoom = useDeleteStoreRoom();
  const handlerDeleteRoom = useCallback(() => {
    if (!storeRoomRef.current) return;

    const { idx, store_idx } = storeRoomRef.current
      .getData!() as RequestRoomChatbot;

    if (
      window.confirm(
        "오픈채팅방을 삭제하면 등록된 명령어도 모두 삭제됩니다. \n그래도 삭제 하시겠습니까?"
      )
    ) {
      const params = {
        idx: Number(idx),
        store_idx: Number(store_idx),
      };

      deleteRoom(params, {
        onSuccess: () => {
          refetch();
          setIsToast(true);
          setToastMessage("오픈채팅방을 삭제 하였습니다.");
          setToastBg("red");
          handlerRequestRoom();
        },
        onError: (error, variables, context) => {
          setIsToast(true);
          setToastMessage(error.message);
          setToastBg("red");
          console.log("error variables:::", variables);
          handlerRequestRoom();
        },
      });
    }
  }, [deleteRoom, handlerRequestRoom, refetch]);

  /**
   * @name 등록가능(대회)
   * @var DataCardCreate
   * @description gameData.idx !== roomChatbot.game_idx
   */
  const [noSelectGames, setNoSelectGames] = useState([]);
  useEffect(() => {
    /**
     * @data gameData
     * @data roomChatbot
     * @returns {noSelectGames}
     * @description 비선택 게임 리스트
     */
    if (gameData) {
      if (roomChatbot && roomChatbot.length > 0) {
        const noSelectGames = gameData?.data.filter(
          (game: any) =>
            !roomChatbot?.some((chatbot: any) => chatbot.game_idx === game.idx)
        );
        setNoSelectGames(noSelectGames);
      } else {
        setNoSelectGames(gameData.data);
      }
    }
  }, [gameData, roomChatbot]);

  const roomChatbotRefs = useRef<DataCardProps[]>([]);

  useEffect(() => {
    roomChatbotRefs.current.forEach(
      (chatbotRef: DataCardProps, index: number) => {
        if (roomChatbot && gameData) {
          if (!chatbotRef) return;
          chatbotRef.init!(
            [
              // {key: 'game_idx', name: '매장 게임정보 idx', type: ''},
              {
                key: "game_idx",
                name: "대회 선택",
                type: "select",
                selectorDataList: gameData.data,
                selectorKetSet: { key: "idx", display: "game_name" },
                placeholder: "",
                // @deprecated 추후 사용 가능성
                // optionalValue: [
                //   {
                //     key: 0,
                //     display: "😡 선택안함",
                //     relationKey: "contest", // 노출 여부 : key === 0 && column.key
                //   },
                // ],
              },
              // @deprecated 추후 사용 가능성
              // {
              //   key: "contest",
              //   name: "대회명",
              //   type: "input",
              //   placeholder: "대회명을 입력해주세요",
              // },
              {
                key: "max_user_cnt",
                name: "최대 예약자 수",
                type: "input",
                inputType: "number",
              },
              // { key: "alias", name: "대회 별칭", type: "input" },
              { key: "cmd_add", name: "예약 등록 명령", type: "input" },
              { key: "cmd_cancel", name: "예약 취소 명령", type: "input" },
              { key: "cmd_person", name: "예약 정보 명령", type: "input" },
              { key: "cmd_update", name: "정보 변경 명령", type: "input" },
              { key: "cmd_reset", name: "예약 리셋 명령", type: "input" },
              { key: "cmd_timer", name: "타이머 명령", type: "input" },
              { key: "add_info", name: "예약 완료 문구", type: "input" },
              {
                key: "contest_template",
                name: "대회 정보 템플릿",
                type: "input",
              },
              {
                key: "description",
                name: "추가정보",
                type: "textarea",
                size: "full",
              },
              {
                key: "regdate",
                name: "등록일",
                type: "date",
                format: "yyyy-MM-dd HH:mm:ss",
              },
              {
                key: "moddate",
                name: "수정일",
                type: "date",
                format: "yyyy-MM-dd HH:mm:ss",
              },
            ],
            roomChatbot[index],
            "대회 명령어 수정/삭제",
            true,
            4
          );
        }
      }
    );
  }, [gameData, roomChatbot, roomChatbotRefs]);

  const createRef: React.MutableRefObject<any | null> = useRef(null);

  const createRoomChatbot = useCreateRoomChatbot();
  const handlerCreateChatbot = (obj: RequestRoomChatbot) => {
    if (window.confirm("명령어를 등록 하시겠습니까?")) {
      obj = {
        ...obj,
        cb_store_idx: Number(cbStoreIdx),
      };

      createRoomChatbot(obj, {
        onSuccess: () => {
          createRef.current.hiddenWriteCmd();
          setIsToast(true);
          setToastMessage("명령어를 등록 하였습니다.");
          setToastBg("blue");
          handlerRequestRoom();
        },
        onError: (error, variables, context) => {
          setIsToast(true);
          setToastMessage(error.message);
          setToastBg("red");
          console.log("error variables:::", variables);
          handlerRequestRoom();
        },
      });
    }
  };

  const updateRoomChatbot = useUpdateRoomChatbot();
  const handlerUpdateChatbot = (index: number) => {
    if (!roomChatbotRefs.current) return;

    const obj = {
      ...roomChatbotRefs.current[index].getData!(),
    } as RequestRoomChatbot;

    if (window.confirm("명령어를 수정 하시겠습니까?")) {
      updateRoomChatbot(obj, {
        onSuccess: () => {
          setIsToast(true);
          setToastMessage("명령어를 수정 하였습니다.");
          setToastBg("blue");
          handlerRequestRoom();
        },
        onError: (error, variables, context) => {
          setIsToast(true);
          setToastMessage(error.message);
          setToastBg("red");
          console.log("error variables:::", variables);
          handlerRequestRoom();
        },
      });
    }
  };

  const deleteRoomChatbot = useDeleteRoomChatbot();
  const handlerDeleteChatbot = (index: number) => {
    if (!roomChatbotRefs.current) return;

    const { idx } = roomChatbotRefs.current[index]
      .getData!() as RequestRoomChatbot;

    if (window.confirm("명령어를 삭제 하시겠습니까?")) {
      deleteRoomChatbot(Number(idx), {
        onSuccess: () => {
          setIsToast(true);
          setToastMessage("명령어를 삭제 하였습니다.");
          setToastBg("red");
          handlerRequestRoom();
        },
        onError: (error, variables, context) => {
          setIsToast(true);
          setToastMessage(error.message);
          setToastBg("red");
          console.log("error variables:::", variables);
          handlerRequestRoom();
        },
      });
    }
  };

  const [isReadyCreateRoom, setReadyCreateRoom] = useState<boolean>(false); // 등록 버튼 활성
  const changeRoomData = (columns: Column[]) => {
    if (columns.length > 0) {
      columns.some((item) => {
        if (item.key === "app_idx") {
          item.data ? setReadyCreateRoom(true) : setReadyCreateRoom(false);
        }
      });
    }
  };

  return (
    <>
      {isSuccessStoreRoom && (
        <div className="p-2">
          <DataCard ref={storeRoomRef} handlerDataChange={changeRoomData} />
          {!cbStoreIdx ? (
            <Button
              className="bg-primary mb-4"
              onClick={handlerCreateRoom}
              isDisabled={!isReadyCreateRoom}
            >
              오픈채팅 등록
            </Button>
          ) : (
            <div className="flex gap-1 mb-4">
              <Button className="bg-red-900" onClick={handlerDeleteRoom}>
                오픈채팅 삭제
              </Button>
              <Button className="bg-blue-800" onClick={handlerUpdateRoom}>
                오픈채팅 수정
              </Button>
            </div>
          )}
        </div>
      )}
      {cbStoreIdx && (
        <>
          <div className="p-2">
            {roomChatbot &&
              roomChatbot.length > 0 &&
              roomChatbot?.map((_: any, index: number) => (
                <React.Fragment key={index}>
                  <DataCard
                    ref={(el) =>
                      (roomChatbotRefs.current[index] = el as DataCardProps)
                    }
                  />
                  <div className="flex gap-1 mb-4">
                    <Button
                      className="bg-red-900"
                      onClick={() => handlerDeleteChatbot(index)}
                    >
                      삭제
                    </Button>
                    <Button
                      className="bg-blue-800"
                      onClick={() => handlerUpdateChatbot(index)}
                    >
                      수정
                    </Button>
                  </div>
                </React.Fragment>
              ))}
          </div>
          {noSelectGames.length !== 0 ? (
            <>
              <div className="py-10 flex justify-center items-center gap-1 text-lg border-y-small border-default-200">
                <p>명령어 등록이 가능한 대회가</p>
                <strong>{noSelectGames.length}개</strong>
                <p>있습니다. 😏</p>
              </div>
              <DataCardCreate
                createOnSuccess={handlerCreateChatbot}
                cbStoreIdx={cbStoreIdx}
                noSelectGames={noSelectGames}
                ref={createRef}
              />
            </>
          ) : noSelectGames.length === 0 &&
            (!roomChatbot || roomChatbot?.length === 0) ? (
            <div className="py-10  border-y-small border-default-200">
              <p className="flex justify-center items-center text-center gap-1 text-lg">
                진행 중인 대회가 없습니다. 🥲
                <br />
                대회를 먼저 생성해주세요.
              </p>
            </div>
          ) : (
            <div className="py-10  border-y-small border-default-200">
              <p className="flex justify-center items-center text-center gap-1 text-lg">
                ✨✨ 모든 대회에 명령어를 설정하였습니다. ✨✨
              </p>
            </div>
          )}
        </>
      )}
      {isToast && (
        <Toast
          setIsToast={setIsToast}
          message={toastMessage}
          position="bottom"
          bgColor={toastBg}
        />
      )}
    </>
  );
};

export default RetailKakao;
