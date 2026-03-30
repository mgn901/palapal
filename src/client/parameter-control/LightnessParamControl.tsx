import { memo, type ReactNode, useCallback } from "react";
import { Label } from "react-aria-components";
import { Slider, SliderThumb, SliderTrack } from "../components/Slider.tsx";
import type { LightnessParam } from "../model/palette.types.ts";
import {
  usePaletteParam,
  usePaletteParamsReducer,
} from "../model/palette-editor-hooks.ts";
import { PaletteControlNumberField } from "./components.tsx";
import { CurvatureControl, PrimaryStepsControl } from "./curve-control.tsx";

export const LightnessParamControl = memo((props: { paramId: string }) => {
  const [param] = usePaletteParam(props.paramId);
  if (param === undefined) return undefined;

  return (
    <LightnessParamControlPresentation
      paramId={props.paramId}
      lightnessParam={param.lightnessParam}
    />
  );
});

const LightnessParamControlPresentation = memo(
  (props: { paramId: string; lightnessParam: LightnessParam }): ReactNode => {
    const paramsReducer = usePaletteParamsReducer();

    const setX = useCallback(
      (values: readonly [number, number]) => {
        paramsReducer({
          type: "Lightness:Set",
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

    const setY = useCallback(
      (values: readonly [number, number, number, number]) => {
        paramsReducer({
          type: "Lightness:Set",
          paramId: props.paramId,
          param: (p) => ({
            ...p,
            points: [
              [p.points[0][0], values[3]],
              [p.points[1][0], values[2]],
              [p.points[2][0], values[1]],
              [p.points[3][0], values[0]],
            ],
          }),
        });
      },
      [paramsReducer, props.paramId],
    );

    const setStepsCount = useCallback(
      (value: number) => {
        paramsReducer({
          type: "Lightness:Set",
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
          type: "Lightness:Set",
          paramId: props.paramId,
          param: (p) => ({ ...p, lightnessCurvature: value }),
        });
      },
      [paramsReducer, props.paramId],
    );

    return (
      <section className="flex w-full flex-col gap-y-2">
        <div className="flex flex-row items-baseline gap-x-2">
          <h3 className="font-bold text-lg">Lightness</h3>

          <PaletteControlNumberField
            className="flex flex-row items-baseline gap-x-1"
            step={1}
            minValue={4}
            maxValue={16}
            value={props.lightnessParam.points[3][0] + 1}
            onChange={setStepsCount}
            inputGroupClassName="w-24"
          >
            <Label className="text-xs">Steps</Label>
          </PaletteControlNumberField>
        </div>

        <CurvatureControl
          curvature={props.lightnessParam.lightnessCurvature}
          setCurvature={setCurvature}
        />

        <PrimaryStepsControl points={props.lightnessParam.points} setX={setX} />

        <Slider
          value={
            [...props.lightnessParam.points]
              .reverse()
              .map((point) => point[1]) as [number, number, number, number]
          }
          step={0.01}
          minValue={0}
          maxValue={1}
          onChange={setY}
          orientation="horizontal"
          className="flex w-full flex-row items-center"
        >
          <Label className="w-32 shrink-0 text-sm">
            Lightness on Primary Steps
          </Label>

          <SliderTrack className="my-6 w-full">
            {[...props.lightnessParam.points].reverse().map((point, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Order of points won't be changed
              <SliderThumb key={i} index={i}>
                <Label className="absolute -inset-s-1 bottom-4 block w-7 text-center">
                  {point[0]}
                </Label>
                <span
                  className="absolute -inset-s-1 top-5 block w-7 text-center text-xs"
                  aria-hidden={true}
                >
                  {point[1].toFixed(2)}
                </span>
              </SliderThumb>
            ))}
          </SliderTrack>
        </Slider>
      </section>
    );
  },
);
