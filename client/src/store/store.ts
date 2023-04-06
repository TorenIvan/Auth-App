import { atomWithStorage } from "jotai/utils";
import { GlobalConstants, Theme } from "../utils";

export const themeAtom = atomWithStorage<Theme>(
  GlobalConstants.Theme,
  GlobalConstants.LightPalette
);
