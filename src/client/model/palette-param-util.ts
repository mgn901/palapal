import { ReactiveMap } from "@mgn901/mgn901-utils-ts/reactive-map";
import { except } from "@mgn901/mgn901-utils-ts/set-operations";
import type { PaletteParam } from "./palette.types.ts";

export type PaletteParamMap = ReactiveMap<string, PaletteParam>;

export const createPaletteParamMap = (): PaletteParamMap =>
  new ReactiveMap(new Map());

export const syncPaletteParamMapWithPaletteParams = (
  paletteParamMap: PaletteParamMap,
  paletteParams: readonly PaletteParam[],
): void => {
  const deletedKeys = except(
    Array.from(paletteParamMap.keys()),
    paletteParams.map((paletteParam) => paletteParam.id),
  );

  for (const paletteParam of paletteParams) {
    const oldPaletteParam = paletteParamMap.get(paletteParam.id);

    if (oldPaletteParam !== undefined && oldPaletteParam === paletteParam) {
      continue;
    }

    paletteParamMap.set(paletteParam.id, paletteParam);
  }

  for (const deletedKey of deletedKeys) {
    paletteParamMap.delete(deletedKey);
  }
};
