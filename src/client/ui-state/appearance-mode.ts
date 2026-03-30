import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { ShowerHead } from "../shower-head.ts";

export type PreferredAppearanceMode = "system" | "light" | "dark";
export type AppearanceMode = "light" | "dark";

const appearanceModeMediaQueryList = globalThis.window.matchMedia(
  "(prefers-color-scheme: dark)",
);

const getSystemAppearanceMode = (): AppearanceMode => {
  const result = appearanceModeMediaQueryList.matches ? "dark" : "light";
  return result;
};

const subscribeSystemAppearanceMode = (onChange: () => void): (() => void) => {
  appearanceModeMediaQueryList.addEventListener("change", onChange);
  return () => {
    appearanceModeMediaQueryList.removeEventListener("change", onChange);
  };
};

const defaultAppearance = getSystemAppearanceMode();

export const [
  ,
  usePreferredAppearanceMode,
  useAppearanceMode,
  useSetPreferredAppearanceMode,
] = ShowerHead.put((): [
  PreferredAppearanceMode,
  AppearanceMode,
  Dispatch<SetStateAction<PreferredAppearanceMode>>,
] => {
  const [preferredAppearanceMode, setPreferredAppearanceMode] =
    useState<PreferredAppearanceMode>("system");

  const systemAppearanceMode = useSyncExternalStore(
    subscribeSystemAppearanceMode,
    getSystemAppearanceMode,
  );

  const appearanceMode =
    preferredAppearanceMode === "system"
      ? systemAppearanceMode
      : preferredAppearanceMode;

  useEffect(() => {
    document.documentElement.dataset.appearanceMode = appearanceMode;
  }, [appearanceMode]);

  return [preferredAppearanceMode, appearanceMode, setPreferredAppearanceMode];
}, ["system", defaultAppearance, () => {}]);
