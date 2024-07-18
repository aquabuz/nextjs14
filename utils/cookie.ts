"use server";

import { cookies } from "next/headers";

interface Nameable {
  name: string;
}

interface GetCookie {
  name: string;
  value: string;
}

interface SetCookie<T extends Nameable> {
  name: string;
  data?: T | null;
}

export async function requestCookie(
  name: string
): Promise<GetCookie | undefined> {
  return cookies().get(name);
}

export async function deleteCookie(name: string): Promise<void> {
  cookies().delete(name);
}

export async function createCookie<T extends Nameable>({
  name,
  data,
}: SetCookie<any>): Promise<void> {
  if (data !== null && data !== undefined) {
    let value: string;
    if (typeof data === "object") {
      try {
        value = JSON.stringify(data);
      } catch (error) {
        throw new Error("Error converting object to JSON string");
      }
    } else {
      value = data as string;
    }
    cookies().set({
      name: name,
      value: value,
      httpOnly: true,
      path: "/",
    });
  }
}
