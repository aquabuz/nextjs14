import axios from "axios";
import interceptor from "./interceptor";

import type { Instance } from "./types";

const createInterceptor = () => {
  const instance: Instance = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
    // baseURL: '/',
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Accept: "application/json",
    },
  });
  interceptor(instance);

  return instance;
};

const config = createInterceptor();

// const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/admin-api/back-office/authenticate`, {
//     method: 'POST',
//     headers: {
//     'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(Object.fromEntries(formData)),
// });

export default config;
