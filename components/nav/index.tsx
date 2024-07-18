"use client";

import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { UseQueryResult } from "@tanstack/react-query";
import { ResponseData } from "@/service/network/config/types";
import { useRequestUserInfo } from "@/service/network/api/member";
import { getFromSessionStorage, saveToSessionStorage } from "@/utils/crypto";
import { menuListState } from "@/store/menu";
import { menuData } from "@/data/menu-item";
import { Logo } from "@/components/logo/logo";
import { NavSign } from "./nav-sign";
export interface SignUser {
  name: string;
  type: string;
}

export const Nav = () => {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [isNull, setIsNull] = useState<boolean>(false);
  const [user, setUser] = useState<SignUser>({
    name: "",
    type: "",
  });
  const [menu, setMenu] = useRecoilState(menuListState);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { data: userData }: UseQueryResult<ResponseData> =
    useRequestUserInfo(isNull);

  useEffect(() => {
    const userInfo = getFromSessionStorage("userInfo");

    // userData.data.name 이 session.data 보다 느려서 name으로 분기
    if (!userInfo?.name || userInfo?.name === "-") {
      // 마운트 시 실행되면 session 데이터 들어오기 전에 호출 됨
      // 종속성 [,] 빼야 함. 마운트 시 호출되면 안됨.
      setIsNull(true);
    }

    const updatedUser = {
      name: userData?.data.name ? userData?.data.name : "-",
      type: session.data?.user.roles?.toLowerCase().includes("admin_read")
        ? "최고관리자"
        : session.data?.user.roles?.toLowerCase().includes("store_read")
          ? "매장관리자"
          : session.data?.user.roles?.toLowerCase().includes("app_read")
            ? "챗봇아이디"
            : "",
    };
    saveToSessionStorage("userInfo", updatedUser);
    setUser(updatedUser);
  }, [userData, session.data?.user.roles]);

  useEffect(() => {
    user.type === "최고관리자"
      ? setMenu(menuData.admin)
      : user.type === "매장관리자"
        ? setMenu(menuData.store)
        : null;
  }, [setMenu, user.type]);

  const handlerColor = (path: string) => {
    if (pathname.startsWith(path)) {
      return "primary";
    }
    return "foreground";
  };

  /**
   * @constant {Tab}
   * @property {href}
   * @description
   * href 속성 사용 시 페이지 새로고침
   * router push = CSR
   */
  const handlerMovePage = (path: string) => {
    router.push(path);
  };

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      height={"6rem"}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <div className="w-[64px] h-[64px]">
            <Logo />
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {menu.map((item, index) => (
          <NavbarItem key={index}>
            <Link
              onClick={() => handlerMovePage(item.path)}
              color={handlerColor(item.path)}
              className="cursor-pointer"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavSign user={user} classes="hidden sm:flex" />
      </NavbarContent>

      <NavbarMenu>
        <NavSign user={user} />
        {menu.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link href={item.path} color={handlerColor(item.path)}>
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
