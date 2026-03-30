import { createTupleCache } from "@mgn901/mgn901-utils-ts/cached-function";
import { except } from "@mgn901/mgn901-utils-ts/set-operations";
import { TupleKeyedMap } from "@mgn901/mgn901-utils-ts/tuple-keyed-map";
import { ReactiveMap } from "../lib/reactive-map.ts";
import { fitWithinSrgb, oklchInt32FromVector3 } from "./color.ts";
import type { OklchInt32, PaletteRow } from "./palette.types.ts";

export type PaletteRowMetadata = readonly [id: string, length: number];

const paletteRowMetadataCache =
  createTupleCache<readonly [string, number]>(2048);
const tupleOfPaletteRowMetadataCache =
  createTupleCache<readonly (readonly [string, number])[]>(1);

export const paletteRowsMetadataFromPaletteRows = (
  paletteRows: readonly PaletteRow[],
): readonly PaletteRowMetadata[] =>
  tupleOfPaletteRowMetadataCache(
    ...paletteRows.map(({ id, oklchLightnessSteps }) =>
      paletteRowMetadataCache(id, oklchLightnessSteps.length),
    ),
  );

export type PaletteRowMap = ReactiveMap<string, PaletteRow>;

export const createPaletteRowMap = (): PaletteRowMap =>
  new ReactiveMap(new Map());

export type PaletteCellMap = ReactiveMap<
  [rowId: string, columnIndex: number],
  OklchInt32
>;

const comparePaletteRow = (a: PaletteRow, b: PaletteRow) =>
  a.id === b.id &&
  a.name === b.name &&
  a.primaryChromaStep === b.primaryChromaStep &&
  a.oklchChromaOnPrimaryChromaStep === b.oklchChromaOnPrimaryChromaStep &&
  a.oklchHue === b.oklchHue &&
  a.oklchLightnessSteps === b.oklchLightnessSteps &&
  a.chromaInGamutSteps === b.chromaInGamutSteps;

export const createPaletteCellMap = (): PaletteCellMap =>
  new ReactiveMap(new TupleKeyedMap(), { listenerMap: new TupleKeyedMap() });

export const syncPaletteMapsWithPaletteRows = (
  paletteRowMap: PaletteRowMap,
  paletteCellMap: PaletteCellMap,
  newPaletteRows: readonly PaletteRow[],
): void => {
  const deletedRowIds = except(
    Array.from(paletteRowMap.keys()),
    newPaletteRows.map(({ id }) => id),
  );

  for (const newPaletteRow of newPaletteRows) {
    const oldPaletteRow = paletteRowMap.get(newPaletteRow.id);

    if (
      oldPaletteRow !== undefined &&
      comparePaletteRow(oldPaletteRow, newPaletteRow)
    )
      continue;

    paletteRowMap.set(newPaletteRow.id, newPaletteRow);

    const rowLength = Math.max(
      oldPaletteRow?.oklchLightnessSteps.length ?? 0,
      newPaletteRow.oklchLightnessSteps.length,
    );

    for (let i = 0; i < rowLength; i++) {
      const oldColor = paletteCellMap.get([newPaletteRow.id, i]);

      const newL = newPaletteRow.oklchLightnessSteps[i];
      const newC = newPaletteRow.chromaInGamutSteps[i];
      const chromaInGamutOnPrimaryChromaStep = Math.max(
        newPaletteRow.chromaInGamutSteps[newPaletteRow.primaryChromaStep],
        0.01,
      );

      const newColor =
        newL !== undefined && newC !== undefined
          ? oklchInt32FromVector3(
              ...fitWithinSrgb(
                newL,
                newC *
                  (newPaletteRow.oklchChromaOnPrimaryChromaStep /
                    chromaInGamutOnPrimaryChromaStep),
                newPaletteRow.oklchHue,
              ),
            )
          : undefined;

      if (newColor === undefined) {
        paletteCellMap.delete([newPaletteRow.id, i]);
        continue;
      }

      if (oldColor !== newColor)
        paletteCellMap.set([newPaletteRow.id, i], newColor);
    }
  }

  for (const deletedRowId of deletedRowIds) paletteRowMap.delete(deletedRowId);
};
