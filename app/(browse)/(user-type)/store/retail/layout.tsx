import { ReactNode } from "react";
import { HeaderSubProvider } from "@/app/context/header/HeaderSubContext";
import HeaderSub from "@/components/header";

const RetailLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto pb-[150px]">
      <HeaderSubProvider data={{}}>
        <HeaderSub title="매장 관리" titleFixed />
        {children}
      </HeaderSubProvider>
    </div>
  );
};
export default RetailLayout;
