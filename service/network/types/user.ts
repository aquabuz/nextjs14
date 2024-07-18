export interface User {
  roles: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
  nickname: string;
  email: string;
  accessTokenExpires: string | undefined;
}

export interface LoginData {
  nickname: string | null | undefined;
  userId: string;
  id: string;
  name: string;
  email: string;
  // image: "aaaaa",
  accessToken: string;
  refreshToken: string;
  roles: string;
  accessTokenExpires: string;
}

export interface RefreshData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: string;
}
