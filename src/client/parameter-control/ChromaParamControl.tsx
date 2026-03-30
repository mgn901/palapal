import { memo, type ReactNode, useCallback } from "react";
import { Label } from "react-aria-components";
import { toSet } from "../lib/immutable-operations.ts";
import type { ChromaParam } from "../model/palette.types.ts";
import {
  usePaletteParam,
  usePaletteParamsReducer,
} from "../model/palette-editor-hooks.ts";
import {
  PaletteControlNumberField,
  PaletteControlSlider,
} from "./components.tsx";
import {
  CurvatureControl,
  type Points,
  PrimaryStepsControl,
} from "./curve-control.tsx";

export const ChromaParamControl = memo((props: { paramId: string }) => {
  const [param] = usePaletteParam(props.paramId);
  if (param === undefined) return undefined;

  return (
    <ChromaParamControlPresentation
      paramId={props.paramId}
      chromaParam={param.chromaParam}
    />
  );
});

const ChromaParamControlPresentation = memo(
  (props: { paramId: string; chromaParam: ChromaParam }): ReactNode => {
    const paramsReducer = usePaletteParamsReducer();

    const setX = useCallback(
      (values: readonly [number, number]) => {
        paramsReducer({
          type: "Chroma:Set",
          paramId: props.paramId,
          param: (p) => ({
            ...p,
            points: [
              p.points[0],
              [Math.min(values[0], p.points[3][0] - 2), p.points[1][1]],
              [
                Math.min(
                  Math.max(values[0] + 1, values[1]),
                  p.points[3][0] - 1,
                ),
                p.points[2][1],
              ],
              p.points[3],
            ],
          }),
        });
      },
      [paramsReducer, props.paramId],
    );

    const setYOf = useCallback(
      (index: number) => (value: number) => {
        paramsReducer({
          type: "Chroma:Set",
          paramId: props.paramId,
          param: (p) => ({
            ...p,
            points: toSet(p.points, index, [
              p.points[index][0],
              value,
            ]) as unknown as Points,
          }),
        });
      },
      [paramsReducer, props.paramId],
    );

    const setStepsCount = useCallback(
      (value: number) => {
        paramsReducer({
          type: "Chroma:Set",
          paramId: props.paramId,
          param: (p) => ({
            ...p,
            points: [
              p.points[0],
              [Math.min(value - 3, p.points[1][0]), p.points[1][1]],
              [Math.min(value - 2, p.points[2][0]), p.points[2][1]],
              [value - 1, p.points[3][1]],
            ],
          }),
        });
      },
      [paramsReducer, props.paramId],
    );

    const setCurvature = useCallback(
      (value: number) => {
        paramsReducer({
          type: "Chroma:Set",
          paramId: props.paramId,
          param: (p) => ({ ...p, chromaCurvature: value }),
        });
      },
      [paramsReducer, props.paramId],
    );

    return (
      <section className="flex w-full flex-col gap-y-2">
        <div className="flex flex-row items-baseline gap-x-2">
          <h3 className="font-bold text-lg">Chroma</h3>

          <PaletteControlNumberField
            className="flex flex-row items-baseline gap-x-1"
            step={1}
            minValue={4}
            maxValue={16}
            value={props.chromaParam.points[3][0] + 1}
            onChange={setStepsCount}
            inputGroupClassName="w-24"
          >
            <Label className="text-xs">Steps</Label>
          </PaletteControlNumberField>
        </div>

        <CurvatureControl
          curvature={props.chromaParam.chromaCurvature}
          setCurvature={setCurvature}
        />

        <PrimaryStepsControl points={props.chromaParam.points} setX={setX} />

        <h4>Chroma on Primary Steps</h4>

        {props.chromaParam.points.map((point, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Order of points won't be changed
          <div key={i} className="flex flex-row items-baseline gap-x-2">
            <PaletteControlSlider
              step={0.01}
              minValue={0}
              maxValue={1}
              value={point[1]}
              onChange={setYOf(i)}
              className="w-full"
            >
              <Label className="w-16 shrink-0 text-sm">Step {point[0]}</Label>
            </PaletteControlSlider>
          </div>
        ))}
      </section>
    );
  },
);
