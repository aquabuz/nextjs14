//src/types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    roles?: string | undefined;
    accessToken: string | undefined;
    refreshToken?: string | undefined;
    accessTokenExpires?: string | undefined;
  }

  interface Session extends DefaultSession {
    user: {
      id: string | undefined;
      nickname: string | undefined;
      mobile: string | undefined;
      mobile_e164: string | undefined;
      birthyear: string | undefined;
      accessToken: string | undefined;
      refreshToken?: string | undefined;
      loginType: string;
      roles: string | undefined;
      accessTokenExpires: string | undefined;
    } & DefaultSession["user"];
  }

  interface Profile {
    sub?: string;
    name?: string;
    email?: string;
    image?: string;

    resultcode?: string;
    message?: string;
    response?: {
      id?: string;
      nickname?: string;
      profile_image?: string;
      mobile?: string;
      mobile_e164?: string;
      name?: string;
      birthyear?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    roles?: string | undefined;
    loginType: string;
    mobile?: string | undefined;
    mobile_e164?: string | undefined;
    birthyear?: string | undefined;
    accessTokenExpires: string | undefined;
  }
}
