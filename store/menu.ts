import { atom, selector } from "recoil";

export const menuListState = atom<any[]>({
  key: "menuState",
  default: [],
});

export const getMenuListState = selector({
  key: "getMenuListState", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => get(menuListState),
});
