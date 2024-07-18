import { ReactNode } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
};
export default HomeLayout;
