import { getServerSession, type NextAuthOptions } from "next-auth";
import { signOut } from "next-auth/react";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import config from "@/service/network/config";

import { Response } from "@/service/network/config/types";
import { LoginData, RefreshData } from "@/service/network/types/user";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", //(1) the default is jwt when no adapter defined, we redefined here to make it obvious what strategy that we use
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      //(2)
      // console.log("------------ JWT ------------2");
      // console.log({ token }, { user }, { account }, { profile });
      if (account && account.type === "credentials") {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.loginType = "api";
        token.roles = user.roles;
        token.accessTokenExpires = user.accessTokenExpires;
      } else if (account && account.type === "oauth") {
        token.accessToken = account.access_token;
        token.refresh_token = account.refresh_token;
        token.loginType = account.provider;

        if (profile?.resultcode === "00") {
          token.name = profile.response?.name;
          token.mobile = profile.response?.mobile;
          token.mobile_e164 = profile.response?.mobile_e164;
          token.birthyear = profile.response?.birthyear;
        }
      }
      if (token.accessTokenExpires) {
        const nowTime = Math.round(Date.now() / 1000);
        const tokenExt = (Number(token.accessTokenExpires) as number) / 1000;
        const shouldRefreshTime = tokenExt - nowTime;
        // console.log("만료 남은 시간", `${shouldRefreshTime} 초`);

        if (shouldRefreshTime > 0) {
          return token;
        }

        try {
          config.defaults.headers["Authorization"] = String(token.refreshToken);
          const response = await config.get<Response<RefreshData>>(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/admin-api/back-office/refreshToken`
          );
          if (response.data.status === 200 && response.data.code === "0000") {
            const refreshData = response.data.data as unknown as RefreshData;
            token.accessToken = refreshData.accessToken;
            token.refreshToken = refreshData.refreshToken;
            token.accessTokenExpires = refreshData.accessTokenExpires;
          } else {
            // TODO: 로그아웃 => 로그인 화면 이동
            console.log("토근 만료 => callbackUrl: '/login'");
          }
        } catch (e) {
          console.error("error🙃", e);
          sessionStorage.removeItem("userInfo");
          token = {
            loginType: "",
            accessTokenExpires: "",
          };
          console.log("token ::", token);
          signOut();
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      //(3)
      // console.log("------------ SESSION ------------3");
      // console.log({ session }, { token }, { user });
      session.user.id = token.sub;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.roles = token.roles;
      session.user.loginType = token.loginType;
      session.user.mobile = token.mobile;
      session.user.mobile_e164 = token.mobile_e164;
      session.user.birthyear = token.birthyear;
      session.user.accessTokenExpires = token.accessTokenExpires;
      return session;
    },
  },
  pages: {
    signIn: "/login", //(4) custom signIn page path
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
        loginType: { label: "LoginType", type: "loginType" },
      },
      async authorize(credentials, req) {
        // console.log("------------ authorize ------------1", credentials);
        const { username, password, loginType } = credentials as {
          username: string;
          password: string;
          loginType: string;
        };
        if (!username || !password || !loginType) {
          throw new Error("username && password && loginType 필수요소!😉");
        }
        try {
          const response = await config.post<Response<LoginData>>(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/admin-api/back-office/authenticate`,
            JSON.stringify({
              userId: username,
              password: password,
              loginType: loginType,
            })
          );
          if (response.data.status === 200 && response.data.code === "0000") {
            // console.log("-----------authorize:::", response.data.data);
            return response.data.data;
          }
        } catch (e) {
          console.error("error", e);
        }
        return null;
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions); //(6)
