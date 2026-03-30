import { accumulateNeighbor } from "./array-reduce-util.ts";

export const max = (
  ...values: readonly number[]
): [index: number, max: number] =>
  values.reduce<[index: number, max: number]>(
    (cmax, current, i) => (cmax[1] < current ? [i, current] : cmax),
    [0, values[0]],
  );

export const min = (
  ...values: readonly number[]
): [index: number, min: number] =>
  values.reduce<[index: number, min: number]>(
    (cmin, current, i) => (cmin[1] > current ? [i, current] : cmin),
    [0, values[0]],
  );

export const localMax = (
  ...values: readonly number[]
): [index: number, max: number][] =>
  values.reduce<[index: number, max: number][]>(
    accumulateNeighbor((acc, prev, current, next, i, array) => {
      if (i > 0 && current > prev && i < array.length - 1 && current > next)
        acc.push([i, current]);
      return acc;
    }),
    [],
  );

export const localMin = (
  ...values: readonly number[]
): [index: number, min: number][] =>
  values.reduce<[index: number, min: number][]>(
    accumulateNeighbor((acc, prev, current, next, i, array) => {
      if (i > 0 && current < prev && i < array.length - 1 && current < next)
        acc.push([i, current]);
      return acc;
    }),
    [],
  );
