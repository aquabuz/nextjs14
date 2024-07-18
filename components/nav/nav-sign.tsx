"use client";

import React from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { Skeleton, NavbarItem, Button, Link } from "@nextui-org/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface NavSignProps {
  user: {
    name: string;
    type: string;
  };
  classes?: string;
}

export const NavSign = ({ classes, user }: NavSignProps) => {
  const { data: session, status } = useSession();

  const handlerSignOut = async () => {
    sessionStorage.removeItem("userInfo");
    signOut();
  };

  if (status === "loading") {
    return (
      <>
        <Skeleton className="rounded-lg">
          <div className="w-[100px] h-[24px] rounded-lg bg-default-300"></div>
        </Skeleton>
      </>
    );
  }

  return (
    <div className={`${classes} gap-2`}>
      {status === "authenticated" ? (
        <NavbarItem>
          <div className="flex items-center gap-3">
            <>
              <UserCircleIcon
                width={28}
                height={28}
                className={
                  user?.type === "최고관리자" ? "text-red-700" : "text-lime-700"
                }
              />
              <b>{user?.name}</b>님 반갑습니다.
            </>
            <Button onClick={handlerSignOut}>Logout</Button>
          </div>
        </NavbarItem>
      ) : (
        <NavbarItem>
          <Button onClick={() => signIn()}>LOGIN</Button>
        </NavbarItem>
      )}
    </div>
  );
};
