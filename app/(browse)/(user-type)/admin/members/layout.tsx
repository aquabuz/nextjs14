import { ReactNode } from "react";
import { HeaderSubProvider } from "@/app/context/header/HeaderSubContext";
import HeaderSub from "@/components/header";

const MembersLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto pb-[150px]">
      <HeaderSubProvider data={{}}>
        <HeaderSub title="앱 관리" />
        {children}
      </HeaderSubProvider>
    </div>
  );
};
export default MembersLayout;
