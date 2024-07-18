import { atom } from "recoil";

interface Store {
  id: number | null;
  name: string | undefined;
}

export const currentStore = atom<Store>({
  key: "currentStore",
  default: {
    id: null,
    name: "",
  },
});
