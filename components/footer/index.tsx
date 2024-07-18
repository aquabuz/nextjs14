import React from "react";

export const Footer = () => {
  const data: { [key: string]: string } = {
    상호명: "",
    대표자: "",
    사업자등록번호: "",
    "통신판매업 신고번호": "",
    주소: "",
    WEB: "",
    TEL: "",
    FAX: "",
    "E-mail": "",
  };

  return (
    <div className="fixed w-full flex justify-center bottom-0 color-white sm:p-[30px] bg-black font-[14px] z-20">
      <ul className="flex flex-wrap justify-center text-sm gap-x-3">
        {Object.entries(data).map(
          ([itemKey, value]: [string, string], index) => (
            <li
              className="flex whitespace-nowrap gap-1 text-slate-500"
              key={index}
            >
              <p>{itemKey}: </p>
              <h3>{value}</h3>
            </li>
          )
        )}
      </ul>
    </div>
  );
};
