"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";

export const InputSignIn = () => {
  const [inputs, setInputs] = useState<any[]>([
    { name: "이메일", label: "이메일", type: "email", value: "" },
    { name: "비밀번호", label: "비밀번호", type: "password", value: "" },
  ]);

  const handleChange = (input: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(
      inputs.map((i) => {
        if (i.name === input.target.name) {
          i.value = input.target.value;
        }
        return i;
      })
    );
  };

  return (
    <>
      {inputs.map((input) => (
        <React.Fragment key={input.name}>
          <Input
            name={input.name}
            label={input.label}
            type={input.type}
            onChange={handleChange}
          />
        </React.Fragment>
      ))}
    </>
  );
};
