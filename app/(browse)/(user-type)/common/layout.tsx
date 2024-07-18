import { ReactNode } from "react";
import { getServerAuthSession } from "@/service/next-auth/auth";
import { HeaderSubProvider } from "@/app/context/header/HeaderSubContext";
import HeaderSub from "@/components/header";

const RetailLayout = async ({ children }: { children: ReactNode }) => {
  // const pathname = headers().get("x-pathname") || ""; 리프레시 X ==> 감지 불가

  let contextData = { isAdmin: false };
  const session = await getServerAuthSession();
  if (session?.user.roles?.includes("ADMIN_CREATE")) {
    contextData = { isAdmin: true };
  }

  return (
    <div className="container mx-auto pb-[150px]">
      <HeaderSubProvider data={contextData}>
        <HeaderSub />
        {children}
      </HeaderSubProvider>
    </div>
  );
};
export default RetailLayout;
