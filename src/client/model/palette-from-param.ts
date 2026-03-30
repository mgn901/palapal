import { dedupe } from "@mgn901/mgn901-utils-ts/set-operations";
import { accumulateNeighbor } from "../lib/array-reduce-util.ts";
import { createVectorCache } from "../lib/cache.ts";
import { localMax, localMin, max, min } from "../lib/math.ts";
import { fitWithinSrgb } from "./color.ts";
import { stepsFromCurveParams } from "./curve.ts";
import type { PaletteParam, PaletteRow, Vector3 } from "./palette.types.ts";

export const paletteRowsFromParam = (param: PaletteParam): PaletteRow[] => {
  const lightnessParamPoints = param.lightnessParam.points;
  const chromaParamPoints = param.chromaParam.points;
  const hueSteps = vectorCache(param.hueParam.steps.map((step) => step.hue));

  const [primaryChromaStep, primaryChromaInGamut] = chromaParamPoints[2];

  const oklchLightnessSteps = vectorCache(
    stepsFromCurveParams(
      lightnessParamPoints,
      param.lightnessParam.lightnessCurvature,
    ),
  );

  const chromaInGamutSteps = vectorCache(
    stepsFromCurveParams(chromaParamPoints, param.chromaParam.chromaCurvature),
  );

  const colorsOnPrimaryLightnessStep = colorsOnLightnessStep(
    oklchLightnessSteps[primaryChromaStep],
    primaryChromaInGamut,
    hueSteps,
    param.hueParam.hueInterpolations,
  );

  return colorsOnPrimaryLightnessStep.map(
    ([, oklchChromaOnPrimaryChromaStep, oklchHue], index) => {
      const definedHueStepIndex = Math.floor(
        index / param.hueParam.hueInterpolations,
      );
      const interpolationIndex = index % param.hueParam.hueInterpolations;
      const currentHueName = param.hueParam.steps[definedHueStepIndex].name;
      const nextHueName = (
        param.hueParam.steps[definedHueStepIndex + 1] ?? param.hueParam.steps[0]
      ).name;
      return {
        id: `${param.id}-${index}`,
        index,
        name: `${currentHueName}${param.hueParam.hueInterpolations - interpolationIndex}${interpolationIndex === 0 ? "" : `${nextHueName}${interpolationIndex}`}`,
        oklchLightnessSteps,
        chromaInGamutSteps,
        oklchHue,
        primaryChromaStep,
        oklchChromaOnPrimaryChromaStep,
      };
    },
  );
};

const vectorCache = createVectorCache<readonly number[]>(128);

/**
 * Returns colors on specified `lightness`, `chromaInGamut` and `hueSteps` with
 * `hueInterpolations` interpolated colors between each hue step.
 */
const colorsOnLightnessStep = (
  lightness: number,
  chromaInGamut: number,
  hueSteps: readonly number[],
  hueInterpolations: number,
): readonly Vector3[] => {
  const colorsOnDefinedHueSteps = hueSteps.map((hue) => {
    const [, c, nh] = fitWithinSrgb(lightness, 1, hue);
    return [lightness, c * chromaInGamut, nh] as const;
  });

  if (hueInterpolations === 1 || colorsOnDefinedHueSteps.length === 1) {
    return colorsOnDefinedHueSteps;
  }

  const interpolatedColors: Vector3[] = [];

  for (let i = 0; i < colorsOnDefinedHueSteps.length; i++) {
    interpolatedColors.push(
      ...interpolateBetweenTwoHues(
        lightness,
        chromaInGamut,
        colorsOnDefinedHueSteps[i][2],
        (colorsOnDefinedHueSteps[i + 1] ?? colorsOnDefinedHueSteps[0])[2],
        hueInterpolations,
      ).slice(0, -1),
    );
  }

  return interpolatedColors;
};

const interpolateBetweenTwoHues = (
  lightness: number,
  chromaInGamut: number,
  startHue: number,
  endHue: number,
  hueInterpolations: number,
): Vector3[] => {
  const times = 3;
  const adjustments = Array.from<number>({ length: hueInterpolations }).fill(0);
  let interporatedColors: Vector3[] = [];

  for (let i = 0; i < times; i++) {
    interporatedColors = interpolateBetweenTwoHuesBase(
      lightness,
      chromaInGamut,
      startHue,
      endHue,
      hueInterpolations,
      adjustments,
    );

    if (i === times - 1) break;

    const ds = interporatedColors
      .reduce<[number, number, number][]>(
        accumulateNeighbor(
          (acc, _, current, next) => {
            acc.push(colorDistanceBetween(current, next));
            return acc;
          },
          { startsAt: 0 },
        ),
        [],
      )
      .slice(0, -1);
    const hds = ds.map(([, hd]) => hd);
    const eds = ds.map(([, , ed]) => ed);
    const edMaxs = dedupe([max(...eds), ...localMax(...eds)], compareTuple);
    const edMins = dedupe([min(...eds), ...localMin(...eds)], compareTuple);

    for (const [j] of edMaxs) {
      const lowerSideEd = eds[j];
      const upperSideEd = eds[j + 1];
      const lowerEdMin = edMins.filter(([index]) => index < j).slice(-1)[0];
      const upperEdMin = edMins.find(([index]) => index > j + 1);

      if (lowerEdMin) {
        const targetEd = (lowerSideEd + 2 * lowerEdMin[1]) / 3;
        for (let k = lowerEdMin[0]; k < j; k++)
          adjustments[k] += ((targetEd / eds[k]) * hds[k] - hds[k]) * 360;
      }

      if (upperEdMin) {
        const targetEd = (upperSideEd + 2 * upperEdMin[1]) / 3;
        for (let k = upperEdMin[0]; k > j; k--)
          adjustments[k] += (hds[k] - (targetEd / eds[k]) * hds[k]) * 360;
      }
    }
  }

  return interporatedColors;
};

const interpolateBetweenTwoHuesBase = (
  lightness: number,
  chromaInGamut: number,
  startHue: number,
  endHue: number,
  hueInterpolations: number,
  adjustments: readonly number[],
): Vector3[] => {
  const hueDiff = endHue + (endHue < startHue ? 360 : 0) - startHue;

  const interpolatedColors: Vector3[] = [];

  for (let i = 0; i < hueInterpolations + 1; i++) {
    const [, c, nh] = fitWithinSrgb(
      lightness,
      1,
      startHue + hueDiff * (i / hueInterpolations) + (adjustments[i - 1] ?? 0),
    );
    interpolatedColors.push([lightness, c * chromaInGamut, nh] as const);
  }

  return interpolatedColors;
};

const colorDistanceBetween = (
  a: Vector3,
  b: Vector3,
): [chromaDistance: number, hueDistance: number, euclidDistance: number] => {
  const chromaDistance = b[1] - a[1];
  const hueDistance = (b[2] + (b[2] < a[2] ? 360 : 0) - a[2]) / 360;
  const euclidDistance = Math.sqrt(chromaDistance ** 2 + hueDistance ** 2);
  return [chromaDistance, hueDistance, euclidDistance];
};

const compareTuple = (
  a: readonly number[],
  b: readonly number[],
): -1 | 0 | 1 => {
  if (a.length < b.length) return -1;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
};
