import { ReactNode } from "react";
import { headers } from "next/headers";
import { HeaderSubProvider } from "@/app/context/header/HeaderSubContext";
import HeaderSub from "@/components/header";

const RetailLayout = ({ children }: { children: ReactNode }) => {
  // server component usePathName: middleware 에서 header 에 저장
  const headersList = headers();
  const headerPathname = headersList.get("x-pathname") || "";

  return (
    <div className="container mx-auto pb-[150px]">
      <HeaderSubProvider data={{}}>
        <HeaderSub title="매장 관리" />
        {children}
      </HeaderSubProvider>
    </div>
  );
};
export default RetailLayout;
