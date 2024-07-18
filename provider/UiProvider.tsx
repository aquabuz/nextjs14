"use client";
import { useEffect, useState, ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const UiProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NextUIProvider>
      <NextThemesProvider>{children}</NextThemesProvider>
    </NextUIProvider>
  );
};

export default UiProvider;
