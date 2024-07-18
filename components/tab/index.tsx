"use client";

import { usePathname, useParams, useRouter } from "next/navigation";
import { Tabs, Tab } from "@nextui-org/react";
import {
  InformationCircleIcon,
  BuildingOfficeIcon,
  ChatBubbleOvalLeftIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { retailTabs } from "@/data/menu-item";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TabProps {
  name: string;
  path: string;
  contents: any;
  onMovePage?: (item: Object) => void;
}

export default function HeaderTab() {
  const session = useSession();
  const router = useRouter();

  const pathname = usePathname();
  const { slug } = useParams<{ slug: string }>();

  const [roles, setRoles] = useState<string>("");

  /**
   * @constant {Tab}
   * @property {href}
   * @description
   * const matchPath = (path: string) => (slug ? `${path}/${slug}` : path);
   * href 속성 사용 시 페이지 새로고침 => recoil 상태 초기화
   *
   * onClick={() => handlerMovePage(path)}
   * onClick router push 로 변경
   */
  const handlerMovePage = (path: string) => {
    router.push(slug ? path + "/" + slug : path);
  };

  const handlerSelected: string = pathname.replace(/\/\d+$/, "");

  useEffect(() => {
    if (session) {
      session.data?.user.roles?.includes("ADMIN_READ")
        ? setRoles("admin")
        : session.data?.user.roles?.includes("STORE_READ")
          ? setRoles("store")
          : null;
    }
  }, [, session]);

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="tabs"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit py-9 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
        items={roles === "admin" ? retailTabs.admin : retailTabs.store}
        selectedKey={handlerSelected}
      >
        {({ path, name, contents }: TabProps) => (
          <Tab
            key={path}
            // href={matchPath(path)}
            title={
              <div
                className="text-lg flex items-center space-x-3"
                onClick={() => handlerMovePage(path)}
              >
                {name === "상세" ? (
                  <InformationCircleIcon className="w-5 h-5" />
                ) : name === "대회" ? (
                  <BuildingOfficeIcon className="w-5 h-5" />
                ) : name === "카카오" ? (
                  <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                ) : (
                  <NewspaperIcon className="w-5 h-5" />
                )}
                <span>{name}</span>
              </div>
            }
          ></Tab>
        )}
      </Tabs>
    </div>
  );
}
