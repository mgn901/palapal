import clsx from "clsx";
import { memo, type ReactNode } from "react";
import {
  Slider as AriaSlider,
  SliderOutput as AriaSliderOutput,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
  type SliderOutputProps,
  type SliderProps,
  type SliderThumbProps,
  type SliderTrackProps,
} from "react-aria-components";
import { render, renderClassName } from "./render.tsx";

export const sliderTrackCn = clsx(
  "m-1.5 rounded-full border border-g1-400 bg-g1-300 shadow-inner disabled:opacity-50 dark:border-g1-700 dark:bg-g1-800 dark:shadow-black/10",
);

export const sliderThumbCn = clsx(
  "h-5 w-5 rounded-full border border-g1-200 shadow-md ring-t1b7-600/50 transition-shadow dark:border-g1-700 dark:ring-t1b7-400/50",
  "bg-white data-dragging:bg-g1-100 dark:bg-g1-400 dark:data-dragging:bg-g1-500",
  "ring-0 data-focus-visible:ring-2 data-hovered:ring-2",
);

export const Slider = memo(
  <T extends number | number[]>(props: SliderProps<T>): ReactNode => {
    return (
      <AriaSlider {...props} className={renderClassName(props.className)}>
        {render(props.children)}
      </AriaSlider>
    );
  },
) as typeof AriaSlider;

export const SliderOutput = memo((props: SliderOutputProps): ReactNode => {
  return (
    <AriaSliderOutput
      {...props}
      className={renderClassName(props.className, "text-end")}
    >
      {render(props.children)}
    </AriaSliderOutput>
  );
});

export const SliderTrack = memo((props: SliderTrackProps): ReactNode => {
  return (
    <AriaSliderTrack
      {...props}
      className={renderClassName(props.className, ({ state }) =>
        clsx(
          sliderTrackCn,
          state.orientation === "horizontal" && "h-1.5",
          state.orientation === "vertical" && "w-1.5",
        ),
      )}
    >
      {render(props.children)}
    </AriaSliderTrack>
  );
});

export const SliderThumb = memo((props: SliderThumbProps): ReactNode => {
  return (
    <AriaSliderThumb
      {...props}
      className={renderClassName(props.className, ({ state }) =>
        clsx(
          sliderThumbCn,
          state.orientation === "horizontal" && "top-1/2",
          state.orientation === "vertical" && "inset-s-1/2",
        ),
      )}
    >
      {render(props.children)}
    </AriaSliderThumb>
  );
});
