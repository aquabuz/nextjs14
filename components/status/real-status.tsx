"use client";

import { Chip } from "@nextui-org/react";

interface Props {
  value: number;
  noText: boolean;
  variant:
    | "flat"
    | "shadow"
    | "dot"
    | "solid"
    | "bordered"
    | "light"
    | "faded"
    | undefined;
}

export const RealStatus = ({ value, noText, variant }: Props) => {
  return (
    <Chip
      className={`capitalize ${!noText ? "gap-1" : ""}`}
      color={
        value === 0
          ? "secondary"
          : value === 1
          ? "success"
          : value === 2
          ? "success"
          : value === 3
          ? "warning"
          : value === 4
          ? "danger"
          : "default"
      }
      size="sm"
      variant={variant}
    >
      {!noText &&
        (value === 0
          ? "대기"
          : value === 1
          ? "예약중"
          : value === 2
          ? "진행중"
          : value === 3
          ? "종료"
          : value === 4
          ? "삭제"
          : value === 5
          ? "일시정지"
          : value === 6
          ? "진행중레지마감후"
          : "null")}
    </Chip>
  );
};
