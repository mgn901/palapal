import bSpline from "b-spline";

const KNOTS = [0, 0, 0, 1, 1, 1];

const curveControlVector = (
  a: readonly [number, number],
  b: readonly [number, number],
  roc: number,
) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];

  if (roc === 0) return [-dx, -dy];

  const factorToClamp = Math.min(
    Math.abs(-dx) / Math.abs(-dy / roc),
    Math.abs(-dy) / Math.abs(-dx * roc),
  );

  return [(-dy / roc) * factorToClamp, -dx * roc * factorToClamp];
};

export const stepsFromCurveParams = (
  positions: readonly [
    readonly [number, number],
    readonly [number, number],
    readonly [number, number],
    readonly [number, number],
  ],
  curvature: number,
): readonly number[] => {
  const intermediateRoc = roc(positions[1], positions[2]);

  const lowerCurveControlVector = curveControlVector(
    positions[0],
    positions[1],
    intermediateRoc,
  );
  const higherCurveControlVector = curveControlVector(
    positions[3],
    positions[2],
    intermediateRoc,
  );

  const lowerCurveControlX =
    positions[1][0] + lowerCurveControlVector[0] * curvature;
  const lowerCurveControlY =
    positions[1][1] + lowerCurveControlVector[1] * curvature;
  const higherCurveControlX =
    positions[2][0] + higherCurveControlVector[0] * curvature;
  const higherCurveControlY =
    positions[2][1] + higherCurveControlVector[1] * curvature;

  const lowerCurve = (t: number) =>
    bSpline(
      t,
      2,
      [positions[0], [lowerCurveControlX, lowerCurveControlY], positions[1]],
      KNOTS,
    );
  const higherCurve = (t: number) =>
    bSpline(
      t,
      2,
      [positions[2], [higherCurveControlX, higherCurveControlY], positions[3]],
      KNOTS,
    );

  const lowerCurveXtoT = xToTFrom(lowerCurve);
  const higherCurveXtoT = xToTFrom(higherCurve);

  const steps = [];
  for (let i = 0; i < positions[1][0]; i++)
    steps.push(lowerCurve(lowerCurveXtoT(i))[1]);
  for (let i = 0; i < positions[2][0] - positions[1][0]; i++)
    steps.push(intermediateRoc * i + positions[1][1]);
  for (let i = positions[2][0]; i < positions[3][0] + 1; i++)
    steps.push(higherCurve(higherCurveXtoT(i))[1]);

  return steps;
};

const roc = (
  a: readonly [number, number],
  b: readonly [number, number],
): number => (b[1] - a[1]) / (b[0] - a[0]);

const xToTFrom =
  (func: (t: number) => readonly number[]): ((x: number) => number) =>
  (targetX) => {
    const epsilon = 0.001;
    const increasing = func(1)[0] - func(0)[0] > 0;
    let nextTMin = 0;
    let nextTMax = 1;
    let nextT = (nextTMax + nextTMin) / 2;
    let x = func(nextT)[0];
    while (Math.abs(x - targetX) > epsilon) {
      if (x > targetX && increasing) nextTMax = nextT;
      else if (x > targetX && !increasing) nextTMin = nextT;
      else if (increasing) nextTMin = nextT;
      else nextTMax = nextT;
      nextT = (nextTMax + nextTMin) / 2;
      x = func(nextT)[0];
    }
    return nextT;
  };
