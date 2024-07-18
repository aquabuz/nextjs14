"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";

interface HeaderSubProvider<T = any> {
  children: ReactNode;
  data: HeaderSubContextType<T>; // layout 에서 할당
}
interface HeaderSubContextType<T = any> {
  isAdmin?: boolean | null;
  pageName?: string;
  setPageName?: (data: string) => T;
}

const HeaderSubContext = createContext<HeaderSubContextType | undefined>(
  undefined
);

export const useHeaderSubContext = () => {
  const context = useContext(HeaderSubContext);
  if (!context) {
    throw new Error(
      "useHeaderSubContext must be used within a HeaderSubProvider"
    );
  }
  return context;
};

export const HeaderSubProvider = ({ children, data }: HeaderSubProvider) => {
  const [pageName, setPageName] = useState(""); // 자식에서 setSyncData 에 업데이트 됨
  const { isAdmin = null } = data;

  return (
    <HeaderSubContext.Provider value={{ isAdmin, pageName, setPageName }}>
      {children}
    </HeaderSubContext.Provider>
  );
};
