import { formatHEX, newColor } from "color-bits";
import { oklchToXyzd50, xyzd50ToSrgb } from "color-bits/convert.js";
import type { OklchInt32, Vector3 } from "./palette.types.ts";

const isWithinSrgb = (...oklch: Readonly<Vector3>): boolean => {
  const srgb = oklchToSrgb(...oklch);
  return 0 <= Math.min(...srgb) && Math.max(...srgb) <= 1;
};

export const fitWithinSrgb = (...oklch: Readonly<Vector3>): Vector3 => {
  if (isWithinSrgb(...oklch)) {
    return oklch as Vector3;
  }

  const epsilon = 0.001;
  const [l, , h] = oklch;
  const nh = h < 0 ? h + 360 : h % 360;
  let [, nextC] = oklch;
  let nextCMin = 0;
  let nextCMax = nextC;
  while (nextCMax - nextCMin > epsilon) {
    if (isWithinSrgb(l, nextC, h)) nextCMin = nextC;
    else nextCMax = nextC;
    nextC = (nextCMax + nextCMin) / 2;
  }
  return [l, nextC, nh];
};

export const hexFromOklchInt32 = (oklch: OklchInt32): string =>
  formatHEX(
    newColor(
      ...(oklchToSrgb(...oklchVector3FromInt32(oklch)).map(
        unitIntervalToUint8,
      ) as unknown as Vector3),
      255,
    ),
  );

const oklchToSrgb = (...oklch: Readonly<Vector3>): Vector3 =>
  xyzd50ToSrgb(...oklchToXyzd50(...oklch));

const unitIntervalToUint8 = (n: number): number =>
  Math.min(255, Math.max(0, n * 255));

export const oklchVector3FromInt32 = (n: OklchInt32): Vector3 => [
  ((n >> 22) & 0x3ff) / 1024,
  ((n >> 12) & 0x3ff) / 1024,
  ((n & 0xfff) / 4096) * 360,
];

/**
 * Converts an array of [lightness, chroma, hue] to a 32-bit integer where
 * lightness and chroma are in the range of 0 to 1, and hue is in the range of 0
 * to 360.
 * @param array An array of [lightness, chroma, hue] where lightness and
 * chroma are in the range of 0 to 1, and hue is in the range of 0 to 360.
 * @returns A 32-bit integer representing the color in Oklch format.
 */
export const oklchInt32FromVector3 = (
  ...vector3: Readonly<Vector3>
): OklchInt32 => {
  const l = Math.min(1023, Math.round(vector3[0] * 1024));
  const c = Math.min(1023, Math.round(vector3[1] * 1024));
  const h = Math.min(4095, Math.round(((vector3[2] % 360) / 360) * 4096));
  return ((l << 22) | (c << 12) | h) as OklchInt32;
};

export const componentOf = (
  oklchInt32: OklchInt32,
  component: "l" | "c" | "h",
): number =>
  component === "l"
    ? ((oklchInt32 >> 22) & 0x3ff) / 1024
    : component === "c"
      ? ((oklchInt32 >> 12) & 0x3ff) / 1024
      : ((oklchInt32 & 0xfff) / 4096) * 360;
