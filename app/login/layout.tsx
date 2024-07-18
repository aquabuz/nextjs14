import { ReactNode } from "react";
import { Logo } from "../../components/logo/logo";
import { Footer } from "@/components/footer";

const LoginLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-4 p-20 ">
      <Logo />
      {children}
      <Footer />
    </div>
  );
};
export default LoginLayout;
