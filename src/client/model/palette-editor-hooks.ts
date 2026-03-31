import { ReactiveMap } from "@mgn901/mgn901-utils-ts/reactive-map";
import { defineRouter } from "@mgn901/mgn901-utils-ts/router-utils";
import {
  type ActionDispatch,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useSyncExternalStore,
} from "react";
import { ShowerHead } from "../shower-head.ts";
import type { OklchInt32, PaletteParam, PaletteRow } from "./palette.types.ts";
import {
  defaultPalette,
  type PaletteEditorActions,
  paletteEditorActionHandlersFrom,
} from "./palette-editor-action-handlers.ts";
import { paletteRowsFromParam } from "./palette-from-param.ts";
import {
  createPaletteParamMap,
  type PaletteParamMap,
  syncPaletteParamMapWithPaletteParams,
} from "./palette-param-util.ts";
import {
  createPaletteCellMap,
  createPaletteRowMap,
  type PaletteCellMap,
  type PaletteRowMap,
  paletteRowsMetadataFromPaletteRows,
  syncPaletteMapsWithPaletteRows,
} from "./palette-row-util.ts";

export type PaletteParamsReducer = ActionDispatch<[PaletteEditorActions]>;
export type PaletteRowMetadata = readonly [id: string, length: number];

const defaultPaletteParams = [defaultPalette];

const paletteParamsReducer = (
  paletteParams: readonly PaletteParam[],
  action: PaletteEditorActions,
) =>
  defineRouter(paletteEditorActionHandlersFrom(paletteParams), "type")(action);

const usePaletteEditorState = (
  paletteParams: readonly PaletteParam[] = defaultPaletteParams,
): [
  paletteParams: readonly PaletteParam[],
  paletteParamsReducer: PaletteParamsReducer,
  paletteParamMap: PaletteParamMap,
  paletteRows: readonly PaletteRow[],
  paletteRowsMetadata: readonly PaletteRowMetadata[],
  paletteRowMap: PaletteRowMap,
  paletteCellMap: PaletteCellMap,
] => {
  const [params, paramsReducer] = useReducer(
    paletteParamsReducer,
    paletteParams,
  );
  const [paletteParamMap] = useState(() => createPaletteParamMap());
  const [paletteRowMap] = useState(() => createPaletteRowMap());
  const [paletteCellMap] = useState(() => createPaletteCellMap());

  const [paletteRows, paletteRowsMetadata] = useMemo(() => {
    const paletteRows = params.flatMap(paletteRowsFromParam);
    const paletteRowsMetadata = paletteRowsMetadataFromPaletteRows(paletteRows);
    return [paletteRows, paletteRowsMetadata];
  }, [params]);

  useEffect(() => {
    syncPaletteParamMapWithPaletteParams(paletteParamMap, params);
    syncPaletteMapsWithPaletteRows(paletteRowMap, paletteCellMap, paletteRows);
  }, [params, paletteRows, paletteParamMap, paletteRowMap, paletteCellMap]);

  return [
    params,
    paramsReducer,
    paletteParamMap,
    paletteRows,
    paletteRowsMetadata,
    paletteRowMap,
    paletteCellMap,
  ];
};

export const [
  PaletteEditorProvider,
  usePaletteParams,
  usePaletteParamsReducer,
  usePaletteParamMap,
  usePaletteRows,
  usePaletteRowsMetadata,
  usePaletteRowMap,
  usePaletteCellMap,
] = ShowerHead.put(usePaletteEditorState, [
  defaultPaletteParams,
  () => {},
  new ReactiveMap(new Map()),
  [],
  [],
  new ReactiveMap(new Map()),
  new ReactiveMap(new Map()),
]);

export const usePaletteParam = (
  paramId: string,
): readonly [PaletteParam | undefined, PaletteParamsReducer] => {
  const paletteParamMap = usePaletteParamMap();
  const paletteParamsReducer = usePaletteParamsReducer();
  const paletteParam = useSyncExternalStore(
    paletteParamMap.subscribeToEntry.bind(paletteParamMap, paramId),
    paletteParamMap.get.bind(paletteParamMap, paramId),
  );
  return [paletteParam, paletteParamsReducer];
};

export const usePaletteRow = (rowId: string): PaletteRow | undefined => {
  const paletteRowMap = usePaletteRowMap();

  return useSyncExternalStore(
    paletteRowMap.subscribeToEntry.bind(paletteRowMap, rowId),
    paletteRowMap.get.bind(paletteRowMap, rowId),
  );
};

export const usePaletteCell = (
  rowId: string,
  columnIndex: number,
): OklchInt32 | undefined => {
  const paletteCellMap = usePaletteCellMap();

  return useSyncExternalStore(
    paletteCellMap.subscribeToEntry.bind(paletteCellMap, [rowId, columnIndex]),
    paletteCellMap.get.bind(paletteCellMap, [rowId, columnIndex]),
  );
};
