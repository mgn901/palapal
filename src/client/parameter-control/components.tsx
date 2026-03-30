import clsx from "clsx";
import { type ComponentProps, memo, type ReactNode } from "react";
import {
  composeRenderProps,
  type GroupProps,
  type NumberFieldProps,
  type SliderProps,
  type TextFieldProps,
} from "react-aria-components";
import { Button } from "../components/Button.tsx";
import { Icon } from "../components/Icon.tsx";
import { Input } from "../components/Input.tsx";
import { InputGroup } from "../components/InputGroup.tsx";
import { NumberField } from "../components/NumberField.tsx";
import {
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "../components/Slider.tsx";
import { TextField } from "../components/TextField.tsx";

export const PaletteControlTextField = memo(
  (
    props: TextFieldProps & { inputGroupClassName?: GroupProps["className"] },
  ): ReactNode => {
    return (
      <TextField
        {...props}
        className={clsx(
          "flex flex-row items-baseline gap-x-1",
          props.className,
        )}
      >
        {composeRenderProps(props.children, (children) => (
          <>
            {children}
            <InputGroup className={clsx(props.inputGroupClassName)}>
              <Input className="w-full px-1" />
            </InputGroup>
          </>
        ))}
      </TextField>
    );
  },
);

export const PaletteControlNumberField = memo(
  (
    props: NumberFieldProps & { inputGroupClassName?: GroupProps["className"] },
  ): ReactNode => {
    return (
      <NumberField
        {...props}
        className={clsx(
          "flex flex-row items-baseline gap-x-1",
          props.className,
        )}
      >
        {composeRenderProps(props.children, (children) => (
          <>
            {children}
            <InputGroup
              className={clsx(
                "flex flex-row items-baseline",
                props.inputGroupClassName,
              )}
            >
              <Input className="w-full px-1 text-end" />
              <Button slot="decrement" className="w-6 shrink-0">
                <Icon name="remove" />
              </Button>
              <Button slot="increment" className="w-6 shrink-0">
                <Icon name="add" />
              </Button>
            </InputGroup>
          </>
        ))}
      </NumberField>
    );
  },
);

const PaletteControlSliderWithoutMemo = <T extends number>(
  props: SliderProps<T> & {
    sliderTrackClassName?: ComponentProps<typeof SliderTrack>["className"];
  },
): ReactNode => {
  return (
    <Slider<T>
      {...props}
      className={clsx(
        props.orientation === "vertical"
          ? "flex flex-col items-center"
          : "flex flex-row items-center gap-x-2",
        props.className,
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <SliderOutput className="w-12 shrink-0">
            {props.value?.toFixed(2)}
          </SliderOutput>

          <SliderTrack
            className={clsx(
              props.orientation === "vertical" ? "h-20" : "w-full",
              props.className,
            )}
          >
            <SliderThumb
              {...(props["aria-label"]
                ? { "aria-label": props["aria-label"] }
                : {})}
            />
          </SliderTrack>
        </>
      ))}
    </Slider>
  );
};

export const PaletteControlSlider = memo(
  PaletteControlSliderWithoutMemo,
) as typeof PaletteControlSliderWithoutMemo;
