"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useCreateMember } from "@/service/network/api/member";
import { RequestMember } from "@/service/network/types/member";
import { DataCardProps } from "@/service/network/types";
import { validateUser } from "@/utils/validation/memberRegister";
import { TRANSITION } from "@/utils/ui/modal";
import DataCard from "@/components/card/data-card";
import Toast from "@/components/toast/toast";

interface Props {
  isShow: boolean;
  handlerAppRegister: (message: any) => void;
}

const AppRegister = ({ isShow, handlerAppRegister }: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const focusInput = useRef<HTMLInputElement>(null); // TODO:: 포커스 forwardRef 필요
  useEffect(() => {
    if (isShow) {
      onOpen();
      init();
      console.log("focusInput", focusInput);
    }
  }, [isShow, onOpen]);

  const handlerCloseModal = useCallback(() => {
    onOpenChange();
  }, [onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      handlerAppRegister("close");
    }
  }, [handlerAppRegister, isOpen]);

  /**
   * @name 토스트(팝업)
   */
  const [isToast, setIsToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastBg, setToastBg] = useState("blue");

  const registerRef = useRef<DataCardProps | null>(null);

  const init = () => {
    if (!registerRef.current) return;
    registerRef.current.init!(
      [
        { key: "mem_id", name: "앱 아이디", type: "input" },
        {
          key: "mem_pw",
          name: "앱 비밀번호",
          type: "input",
          inputType: "password",
        },
        { key: "name", name: "앱 이름", type: "input" },
      ],
      null,
      "앱 등록",
      true,
      3
    );
  };

  const createMember = useCreateMember();
  const [validations, setValidations] = useState<Array<{}>>([]);
  const registerMember = useCallback(() => {
    if (!registerRef.current) return;

    let obj = {
      ...registerRef.current.getData!(),
    } as RequestMember;

    obj = {
      ...obj,
      login_type: 1, // 매장은 고정값
      status: 0, // 매장은 고정값
    };

    const validationResult = validateUser(obj);
    if (validationResult && validationResult?.length > 0) {
      console.error(validationResult);
      setValidations(validationResult);
    } else {
      if (window.confirm("앱을 등록 하시겠습니까?")) {
        createMember(obj, {
          onSuccess: () => {
            setIsToast(true);
            setToastMessage("앱을 등록 하였습니다.");
            setToastBg("blue");
            handlerCloseModal();
            handlerAppRegister("done");
          },
          onError: (error, variables, context) => {
            setIsToast(true);
            setToastMessage(error.message);
            setToastBg("red");
            handlerCloseModal();
            console.log("error variables:::", variables);
          },
        });
      }
    }
  }, [createMember, handlerAppRegister, handlerCloseModal]);

  return (
    <>
      <Modal
        isOpen={isShow}
        onClose={onClose}
        onOpenChange={onOpenChange}
        size="4xl"
        isDismissable={false}
        motionProps={TRANSITION}
      >
        <ModalContent>
          <ModalBody>
            <DataCard validations={validations} ref={registerRef} />
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onClick={handlerCloseModal}>
              취소
            </Button>
            <Button className="bg-blue-800" onClick={registerMember}>
              등록
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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

export default AppRegister;
