import { ReactNode } from "react";
import { HeaderSubProvider } from "@/app/context/header/HeaderSubContext";
import HeaderSub from "@/components/header";

const CommandLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto pb-[150px]">
      <HeaderSubProvider data={{}}>
        <HeaderSub title="공통 관리" />
        {children}
      </HeaderSubProvider>
    </div>
  );
};
export default CommandLayout;
