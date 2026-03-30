import { memo, type ReactNode } from "react";
import { Slider, SliderThumb, SliderTrack } from "../components/Slider.tsx";
import { Label } from "../components/Text.tsx";
import type { Vector2 } from "../model/palette.types.ts";
import { PaletteControlSlider } from "./components.tsx";

export type Points = readonly [readonly [0, number], Vector2, Vector2, Vector2];

export const CurvatureControl = memo(
  (props: { curvature: number; setCurvature: (value: number) => void }) => (
    <PaletteControlSlider
      step={0.01}
      minValue={0}
      maxValue={1}
      value={props.curvature}
      onChange={props.setCurvature}
    >
      <Label className="w-16 shrink-0 text-sm">Curvature</Label>
    </PaletteControlSlider>
  ),
);

export const PrimaryStepsControl = memo(
  (props: {
    points: Points;
    setX: (values: [number, number]) => void;
  }): ReactNode => (
    <Slider
      value={
        props.points.slice(1, 3).map((point) => point[0]) as [number, number]
      }
      minValue={1}
      maxValue={props.points[3][0] - 1}
      onChange={props.setX}
      orientation="horizontal"
      className="flex w-full flex-row items-center"
    >
      <Label className="w-32 shrink-0 text-sm">Primary Steps</Label>

      <SliderTrack className="my-6 w-full">
        {props.points.slice(1, 3).map((point, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Order of points won't be changed
          <SliderThumb key={i} index={i}>
            <span
              className="absolute -inset-s-1 top-5 block w-7 text-center text-xs"
              aria-hidden={true}
            >
              {point[0]}
            </span>
          </SliderThumb>
        ))}
      </SliderTrack>
    </Slider>
  ),
);
