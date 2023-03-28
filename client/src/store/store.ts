import { atomWithStorage } from "jotai/utils";
import Constants from "../utils/Constants";
import { Theme } from "../utils/Types";

export const themeAtom = atomWithStorage<Theme>(
  Constants.Theme,
  Constants.LightPalette
);
