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
import { RequestMember } from "@/service/network/types/member";
import { DataCardProps } from "@/service/network/types";
import { TRANSITION } from "@/utils/ui/modal";
import DataCard from "@/components/card/data-card";
import Toast from "@/components/toast/toast";
import React from "react";

interface Props {
  isShow: boolean;
  handlerModal?: (message: any) => void;
  children?: React.ReactNode; // slot
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full"
    | undefined;
}

const ModalContainer = (props: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  // children 속성 중 slot 활용 위치 조정
  const slots = React.Children.toArray(props.children).reduce(
    (acc: any, child) => {
      if (React.isValidElement(child) && child.props.slot) {
        acc[child.props.slot] = child;
      }
      return acc;
    },
    {}
  );

  const focusInput = useRef<HTMLInputElement>(null); // TODO:: 포커스 forwardRef 필요
  useEffect(() => {
    if (props.isShow) {
      onOpen();
      console.log("focusInput", focusInput);
    }
  }, [onOpen, props]);

  const handlerCloseModal = useCallback(() => {
    onOpenChange();
  }, [onOpenChange]);

  useEffect(() => {
    if (!isOpen && props.handlerModal) {
      props.handlerModal("close");
    }
  }, [isOpen, props]);

  /**
   * @name 토스트(팝업)
   */
  const [isToast, setIsToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastBg, setToastBg] = useState("blue");

  const handlerConfirm = useCallback(() => {}, []);

  return (
    <>
      <Modal
        isOpen={props.isShow}
        onClose={onClose}
        onOpenChange={onOpenChange}
        size={props.size}
        isDismissable={false}
        motionProps={TRANSITION}
      >
        <ModalContent>
          <ModalBody>{slots.uploadForm}</ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onClick={handlerCloseModal}>
              취소
            </Button>
            <Button className="bg-blue-800" onClick={handlerConfirm}>
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

export default ModalContainer;
