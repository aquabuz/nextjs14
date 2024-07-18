import { getSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import config from "@/service/network/config";
import { ResponseData } from "@/service/network/config/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;

export async function request(
  method: string,
  url: string,
  data: any,
  headers: any = {}
) {
  const authSession = await getSession();

  if (authSession && authSession.user.accessToken) {
    config.defaults.headers["Authorization"] = String(
      authSession?.user.accessToken
    );
  }

  // 요청을 보낼 때 headers가 전달된 경우 config.headers와 병합
  const baseUrl = BASE_URL + url;
  const requestOptions: any = {
    method,
    url: baseUrl,
    data,
    headers: {
      ...config.defaults.headers,
      ...headers,
    },
  };

  return new Promise<ResponseData>((resolve, reject) => {
    config(requestOptions)
      .then(
        (result) => {
          if (result.data.code === "0000") {
            resolve(result.data);
          } else {
            reject(result.data);
          }
        },
        (reason) => {
          console.log("reason ===", reason);
          reject(reason); // react query 에 error 전달
          switch (reason.response.status) {
            case 404:
              console.log("status 404 error");
              break;
            case 400:
              console.log("status 400 error");
              break;
            case 401:
              console.log("status 401 error");
              signIn();
              break;
            default:
              console.log(reason);
          }
        }
      )
      .catch((err) => {
        console.log("err > " + err);
      });
  });
}
