import { atomWithStorage } from "jotai/utils";
import { GlobalConstants } from "../utils";
import { Theme } from "../utils/Types";

export const themeAtom = atomWithStorage<Theme>(
  GlobalConstants.Theme,
  GlobalConstants.LightPalette
);
