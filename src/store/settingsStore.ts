import { Direction } from "@mui/material";
import create from "zustand";
import { setCookie, getCookie } from "cookies-next";

export type ModeUnion = "light" | "dark";

interface SettingsState {
  direction: Direction;
  responsiveFontSizes: boolean;
  mode: ModeUnion;
}

interface SettingsActions {
  setDirection: (dir: Direction) => void;
  setResponsiveFontSizes: (resFont: boolean) => void;
  setMode: (mode: ModeUnion) => void;
}

function storeMode(mode: ModeUnion) {
  setCookie("mode", mode);
}

function storeDirection(lang: Direction) {
  setCookie("direction", lang);
}

function getMode() {
  if (!!getCookie("mode")) {
    return getCookie("mode") as ModeUnion;
  } else {
    return "light";
  }
}

function getLang() {
  if (!!getCookie("direction")) {
    return getCookie("direction") as Direction;
  } else {
    return "ltr";
  }
}

export const settingsStore = create<SettingsState & SettingsActions>((set) => ({
  direction: getLang(),
  responsiveFontSizes: true,
  mode: getMode(),

  setDirection: (dir) => {
    set(() => ({ direction: dir }));
    storeDirection(dir);
  },
  setResponsiveFontSizes: (resFont) =>
    set(() => ({ responsiveFontSizes: resFont })),
  setMode: (mode) => {
    set(() => ({ mode: mode }));
    storeMode(mode);
  },
}));
