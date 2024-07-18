import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import DataCard from "@/components/card/data-card";
import { Column, DataCardProps } from "@/service/network/types";
import { RequestRoomChatbot } from "@/service/network/types/chatbot";

interface Props {
  noSelectGames: any;
  cbStoreIdx: string;
  createOnSuccess: Function;
}

const ChatbotCreate = forwardRef(
  ({ noSelectGames, cbStoreIdx, createOnSuccess }: Props, ref) => {
    /**
     * @name 챗봇명령어(등록)
     * @var chatbotCmdRef
     * @var isWriteCmd
     * @description 챗봇명령어 등록
     */

    const chatbotCmdRef = useRef<DataCardProps | null>(null);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const showCreateChatbotCmdForm = () => {
      new Promise((resolve) => {
        onOpen();
        const animationFrameId = requestAnimationFrame(resolve);
        return () => cancelAnimationFrame(animationFrameId);
      }).then(() => {
        if (!chatbotCmdRef.current) return;
        if (noSelectGames && noSelectGames.length > 0) {
          chatbotCmdRef.current.init!(
            [
              {
                key: "game_idx",
                name: "대회 선택",
                type: "select",
                selectorDataList: noSelectGames,
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
                isRequired: true,
              },
              // @deprecated 추후 사용 가능성
              // {
              //   key: "contest",
              //   name: "대회명",
              //   type: "input",
              //   placeholder: "대회명을 입력해주세요",
              // },
              {
                key: "alias",
                name: "대회 별칭;적용",
                type: "input;button",
                placeholder: "별칭",
              },
              {
                key: "max_user_cnt",
                name: "최대 예약자 수",
                type: "input",
                inputType: "number",
                value: "100",
              },
              {
                key: "cmd_add",
                name: "예약 등록 명령",
                type: "input",
                placeholder: "등록",
              },
              {
                key: "cmd_cancel",
                name: "예약 취소 명령",
                type: "input",
                placeholder: "취소",
              },
              {
                key: "cmd_person",
                name: "예약 정보 명령",
                type: "input",
                placeholder: "정보",
              },
              {
                key: "cmd_update",
                name: "정보 변경 명령",
                type: "input",
                placeholder: "변경",
              },
              {
                key: "cmd_reset",
                name: "예약 리셋 명령",
                type: "input",
                placeholder: "리셋",
              },
              {
                key: "cmd_timer",
                name: "타이머 명령",
                type: "input",
                placeholder: "타이머",
              },
              {
                key: "add_info",
                name: "예약 완료 문구",
                type: "input",
                placeholder: "문구",
              },
              {
                key: "contest_template",
                name: "대회 정보 템플릿",
                type: "input",
                placeholder: "",
              },
              {
                key: "description",
                name: "추가정보",
                type: "textarea",
                size: "full",
              },
              // {
              //   key: "regdate",
              //   name: "등록일",
              //   type: "date",
              //   format: "yyyy-MM-dd HH:mm:ss",
              // },
              // { key: "moddate", name: "수정일", type: "input", placeholder: "" },
            ],
            null,
            "대회 명령어 등록",
            true,
            4
          );
        }
      });
    };

    const handlerCloseModal = () => {
      setReadyCreateChatbot(false);
      onClose();
    };

    const handlerCreateChatbot = () => {
      if (!chatbotCmdRef.current) return;

      const obj = {
        ...chatbotCmdRef.current.getData!(),
      } as RequestRoomChatbot;

      createOnSuccess(obj);
      handlerCloseModal();
    };

    useImperativeHandle(ref, () => ({
      hiddenWriteCmd: () => handlerCloseModal,
    }));

    const handlerAlias = (value: string) => {
      if (chatbotCmdRef && chatbotCmdRef.current) {
        chatbotCmdRef.current.setColumnData!("cmd_add", value);
        chatbotCmdRef.current.setColumnData!("cmd_add", value + "등록");
        chatbotCmdRef.current.setColumnData!("cmd_cancel", value + "취소");
        chatbotCmdRef.current.setColumnData!("cmd_person", value + "정보");
        chatbotCmdRef.current.setColumnData!("cmd_update", value + "변경");
        chatbotCmdRef.current.setColumnData!("cmd_reset", value + "리셋");
        chatbotCmdRef.current.setColumnData!("cmd_timer", value + "타이머");
      }
    };

    const [isReadyCreateChatbot, setReadyCreateChatbot] =
      useState<boolean>(false); // 등록 버튼 활성
    const changeChatbotData = useCallback((columns: Column[]) => {
      if (columns.length > 0) {
        columns.some((item) => {
          if (item.key === "game_idx") {
            item.data && setReadyCreateChatbot(true);
          }
        });
      }
    }, []);

    return (
      <>
        <Modal
          isOpen={isOpen}
          size="5xl"
          scrollBehavior="outside"
          backdrop="blur"
          isDismissable={false}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            <ModalBody>
              <DataCard
                ref={chatbotCmdRef}
                handlerEvent={handlerAlias}
                handlerDataChange={changeChatbotData}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={handlerCloseModal}
              >
                취소
              </Button>
              <Button
                color="primary"
                onClick={handlerCreateChatbot}
                isDisabled={!isReadyCreateChatbot}
              >
                등록
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <div className="py-10 flex flex-col gap-1 text-lg">
          <Button className="bg-purple-800" onClick={showCreateChatbotCmdForm}>
            챗봇 명령어 신규 등록
          </Button>
        </div>
      </>
    );
  }
);

ChatbotCreate.displayName = "ChatbotCreate";

export default ChatbotCreate;
