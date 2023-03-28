import { atom } from "jotai";
import Constants from "../utils/Constants";
import { Theme } from "../utils/Types";

export const themeAtom = atom<Theme>(Constants.LightPalette);
