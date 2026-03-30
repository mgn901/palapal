import type { NominalPrimitive } from "@mgn901/mgn901-utils-ts/nominal-primitive.type";

export interface PaletteParam {
  readonly id: string;
  readonly hueParam: HueParam;
  readonly lightnessParam: LightnessParam;
  readonly chromaParam: ChromaParam;
}

export interface HueParam {
  readonly steps: readonly HueStep[];
  readonly hueInterpolations: number;
}

export interface HueStep {
  readonly id: string;
  readonly name: string;
  readonly hue: number;
}

export interface LightnessParam {
  readonly points: readonly [readonly [0, number], Vector2, Vector2, Vector2];
  readonly lightnessCurvature: number;
}

export interface ChromaParam {
  readonly points: readonly [readonly [0, number], Vector2, Vector2, Vector2];
  readonly chromaCurvature: number;
}

export interface PaletteRow {
  readonly id: string;
  readonly index: number;
  readonly name: string;
  readonly oklchLightnessSteps: readonly number[];
  readonly chromaInGamutSteps: readonly number[];
  readonly oklchHue: number;
  readonly primaryChromaStep: number;
  readonly oklchChromaOnPrimaryChromaStep: number;
}

const oklchInt32TypeSymbol = Symbol("OklchInt32");
export type OklchInt32 = NominalPrimitive<number, typeof oklchInt32TypeSymbol>;

export type Vector2 = readonly [number, number];
export type Vector3 = readonly [number, number, number];
