"use client";

import { Link } from "@nextui-org/react";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href="/" aria-current="page">
      <Image
        src="/mainlogo.png"
        alt="Main logo"
        width={100}
        height={100}
        priority={true}
        className="w-full h-full"
      />
    </Link>
  );
};
