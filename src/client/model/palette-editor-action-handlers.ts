import {
  toAdded,
  toDeleted,
  toSet,
} from "@mgn901/mgn901-utils-ts/immutable-operations";
import { generateId } from "@mgn901/mgn901-utils-ts/random-values";
import type {
  ChromaParam,
  HueStep,
  LightnessParam,
  PaletteParam,
} from "./palette.types.ts";

export const paletteEditorActionHandlersFrom = (
  paletteParams: readonly PaletteParam[],
) =>
  ({
    "Palettes:New": (_args: { type: "Palettes:New" }) => [
      ...paletteParams,
      { ...defaultPalette, id: generateId() },
    ],

    "Palettes:Delete": (args: { type: "Palettes:Delete"; paramId: string }) => {
      const i = paletteParams.findIndex((p) => p.id === args.paramId);
      if (i === -1) return paletteParams;

      return toDeleted(paletteParams, i);
    },

    "Palettes:Set": (args: {
      type: "Palettes:Set";
      params: (
        prevPaletteParams: readonly PaletteParam[],
      ) => readonly PaletteParam[];
    }) => args.params(paletteParams),

    "Hue:SetHueInterpolations": (args: {
      type: "Hue:SetHueInterpolations";
      paramId: string;
      hueInterpolations: number;
    }) => {
      const i = paletteParams.findIndex((p) => p.id === args.paramId);
      if (i === -1) return paletteParams;

      return toSet(paletteParams, i, {
        ...paletteParams[i],
        hueParam: {
          ...paletteParams[i].hueParam,
          hueInterpolations: args.hueInterpolations,
        },
      });
    },

    "HueSteps:New": (args: { type: "HueSteps:New"; paramId: string }) => {
      const i = paletteParams.findIndex((p) => p.id === args.paramId);
      if (i === -1) return paletteParams;

      const length = paletteParams[i].hueParam.steps.length;
      const hue =
        length === 0
          ? 180
          : (paletteParams[i].hueParam.steps[length - 1].hue + 360) / 2;
      return toSet(paletteParams, i, {
        ...paletteParams[i],
        hueParam: {
          ...paletteParams[i].hueParam,
          steps: toAdded(paletteParams[i].hueParam.steps, length, {
            id: generateId(),
            name: (length + 1).toString(),
            hue,
          }),
        },
      });
    },

    "HueSteps:Delete": (args: {
      type: "HueSteps:Delete";
      paramId: string;
      hueStepId: string;
    }) => {
      const i = paletteParams.findIndex((p) => p.id === args.paramId);
      if (i === -1) return paletteParams;

      const j = paletteParams[i].hueParam.steps.findIndex(
        (s) => s.id === args.hueStepId,
      );
      if (j === -1) return paletteParams;

      return toSet(paletteParams, i, {
        ...paletteParams[i],
        hueParam: {
          ...paletteParams[i].hueParam,
          steps: toDeleted(paletteParams[i].hueParam.steps, j),
        },
      });
    },

    "HueSteps:SetOne": (args: {
      type: "HueSteps:SetOne";
      paramId: string;
      hueStepId: string;
      param: (prevHueStep: HueStep) => HueStep;
    }) => {
      const i = paletteParams.findIndex((p) => p.id === args.paramId);
      if (i === -1) return paletteParams;

      const j = paletteParams[i].hueParam.steps.findIndex(
        (s) => s.id === args.hueStepId,
      );
      if (j === -1) return paletteParams;

      return toSet(paletteParams, i, {
        ...paletteParams[i],
        hueParam: {
          ...paletteParams[i].hueParam,
          steps: toSet(
            paletteParams[i].hueParam.steps,
            j,
            args.param(paletteParams[i].hueParam.steps[j]),
          ),
        },
      });
    },

    "Lightness:Set": (args: {
      type: "Lightness:Set";
      paramId: string;
      param: (prevLightnessParam: LightnessParam) => LightnessParam;
    }) => {
      const i = paletteParams.findIndex((p) => p.id === args.paramId);
      if (i === -1) return paletteParams;

      return toSet(paletteParams, i, {
        ...paletteParams[i],
        lightnessParam: args.param(paletteParams[i].lightnessParam),
      });
    },

    "Chroma:Set": (args: {
      type: "Chroma:Set";
      paramId: string;
      param: (prevChromaParam: ChromaParam) => ChromaParam;
    }) => {
      const i = paletteParams.findIndex((p) => p.id === args.paramId);
      if (i === -1) return paletteParams;

      return toSet(paletteParams, i, {
        ...paletteParams[i],
        chromaParam: args.param(paletteParams[i].chromaParam),
      });
    },
  }) as const;

export type PaletteEditorActions = Parameters<
  ReturnType<typeof paletteEditorActionHandlersFrom>[keyof ReturnType<
    typeof paletteEditorActionHandlersFrom
  >]
>[0];

// export const defaultPalette = {
//   id: generateId(),
//   hueParam: {
//     steps: [
//       { id: generateId(), hue: 43, name: "G1" },
//       { id: generateId(), hue: 110, name: "G2" },
//       { id: generateId(), hue: 158, name: "G3" },
//       { id: generateId(), hue: 260, name: "G4" },
//       { id: generateId(), hue: 315, name: "G5" },
//     ],
//     hueInterpolations: 1,
//   },
//   lightnessParam: {
//     points: [
//       [0, 0.99],
//       [4, 0.7],
//       [6, 0.5],
//       [10, 0.18],
//     ],
//     lightnessCurvature: 0.9,
//   },
//   chromaParam: {
//     points: [
//       [0, 0.05],
//       [4, 0.07],
//       [6, 0.09],
//       [10, 0.05],
//     ],
//     chromaCurvature: 0.5,
//   },
// } satisfies PaletteParam;

export const defaultPalette = {
  id: generateId(),
  hueParam: {
    steps: [
      { id: generateId(), hue: 20, name: "R" },
      { id: generateId(), hue: 98, name: "Y" },
      { id: generateId(), hue: 150, name: "G" },
      { id: generateId(), hue: 263, name: "B" },
      { id: generateId(), hue: 308, name: "P" },
    ],
    hueInterpolations: 8,
  },
  lightnessParam: {
    points: [
      [0, 0.99],
      [4, 0.7],
      [6, 0.5],
      [10, 0.17],
    ],
    lightnessCurvature: 0.95,
  },
  chromaParam: {
    points: [
      [0, 0.25],
      [4, 0.8],
      [6, 1],
      [10, 0.5],
    ],
    chromaCurvature: 0.5,
  },
} satisfies PaletteParam;
