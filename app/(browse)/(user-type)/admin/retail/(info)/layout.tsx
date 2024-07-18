import { ReactNode } from "react";
import HeaderTab from "@/components/tab";

const RetailInfoLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <HeaderTab />
      {children}
    </>
  );
};
export default RetailInfoLayout;
