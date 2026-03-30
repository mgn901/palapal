import { memo, type ReactNode, useCallback } from "react";
import { Button } from "../components/Button.tsx";
import { Icon } from "../components/Icon.tsx";
import { Slider, SliderThumb, SliderTrack } from "../components/Slider.tsx";
import { Label } from "../components/Text.tsx";
import type { HueParam } from "../model/palette.types.ts";
import {
  usePaletteParam,
  usePaletteParamsReducer,
} from "../model/palette-editor-hooks.ts";
import {
  PaletteControlNumberField,
  PaletteControlTextField,
} from "./components.tsx";

export const HueParamControl = memo((props: { paramId: string }): ReactNode => {
  const [param] = usePaletteParam(props.paramId);
  if (param === undefined) return undefined;

  return (
    <HueParamControlPresentation
      paramId={props.paramId}
      hueParam={param.hueParam}
    />
  );
});

const HueParamControlPresentation = memo(
  (props: { paramId: string; hueParam: HueParam }): ReactNode => {
    const paramsReducer = usePaletteParamsReducer();

    const setHue = useCallback(
      (values: readonly number[]) => {
        values.forEach((value, i) => {
          const hueStep = props.hueParam.steps[i];
          paramsReducer({
            type: "HueSteps:SetOne",
            paramId: props.paramId,
            hueStepId: hueStep.id,
            param: (p) => ({ ...p, hue: value }),
          });
        });
      },
      [props.hueParam.steps, paramsReducer, props.paramId],
    );

    const setHueOf = useCallback(
      (hueStepId: string) => (value: number) => {
        paramsReducer({
          type: "HueSteps:SetOne",
          paramId: props.paramId,
          hueStepId,
          param: (p) => ({ ...p, hue: value }),
        });
      },
      [props.paramId, paramsReducer],
    );

    const setHueNameOf = useCallback(
      (hueStepId: string) => (newName: string) => {
        paramsReducer({
          type: "HueSteps:SetOne",
          paramId: props.paramId,
          hueStepId,
          param: (p) => ({ ...p, name: newName }),
        });
      },
      [props.paramId, paramsReducer],
    );

    const addHueStep = useCallback(() => {
      paramsReducer({ type: "HueSteps:New", paramId: props.paramId });
    }, [paramsReducer, props.paramId]);

    const deleteHueStep = useCallback(
      (hueStepId: string) => () => {
        paramsReducer({
          type: "HueSteps:Delete",
          paramId: props.paramId,
          hueStepId,
        });
      },
      [paramsReducer, props.paramId],
    );

    const setHueInterpolations = useCallback(
      (value: number) => {
        paramsReducer({
          type: "Hue:SetHueInterpolations",
          paramId: props.paramId,
          hueInterpolations: value,
        });
      },
      [props.paramId, paramsReducer],
    );

    return (
      <section className="flex w-full flex-col gap-y-2">
        <div className="flex flex-row items-baseline gap-x-2">
          <h3 className="font-bold text-lg">Hue</h3>

          <PaletteControlNumberField
            className="flex flex-row items-baseline gap-x-1"
            step={1}
            minValue={1}
            maxValue={32}
            value={props.hueParam.hueInterpolations}
            onChange={setHueInterpolations}
            inputGroupClassName="w-24"
          >
            <Label className="text-xs">Interpolations</Label>
          </PaletteControlNumberField>

          <Button onClick={addHueStep} className="px-1">
            Add Hue
          </Button>
        </div>

        <Slider
          value={props.hueParam.steps.map((step) => step.hue)}
          minValue={0}
          maxValue={360}
          orientation="horizontal"
          onChange={setHue}
          className="w-full"
          aria-label="Hue Steps"
        >
          <SliderTrack className="my-6">
            {props.hueParam.steps.map((step, i) => (
              <SliderThumb key={step.id} index={i}>
                <Label className="absolute -inset-s-1 bottom-4 block w-7 text-center">
                  {step.name}
                </Label>

                <span
                  className="absolute -inset-s-1 top-5 block w-7 text-center text-xs"
                  aria-hidden={true}
                >
                  {step.hue}
                </span>
              </SliderThumb>
            ))}
          </SliderTrack>
        </Slider>

        <ol className="flex list-decimal flex-col gap-1">
          {props.hueParam.steps.map((step, i) => (
            <HueStepsControl
              key={step.id}
              name={step.name}
              hue={step.hue}
              prevHue={i === 0 ? 0 : props.hueParam.steps[i - 1].hue}
              nextHue={
                i === props.hueParam.steps.length - 1
                  ? 360
                  : props.hueParam.steps[i + 1].hue
              }
              setHue={setHueOf(step.id)}
              setHueName={setHueNameOf(step.id)}
              deleteHueStep={deleteHueStep(step.id)}
            />
          ))}
        </ol>
      </section>
    );
  },
);

const HueStepsControl = memo(
  (props: {
    name: string;
    hue: number;
    prevHue: number;
    nextHue: number;
    setHue: (value: number) => void;
    setHueName: (value: string) => void;
    deleteHueStep: () => void;
  }): ReactNode => (
    <li className="ms-8 list-item">
      <div className="flex flex-row gap-2">
        <PaletteControlTextField
          value={props.name}
          onChange={props.setHueName}
          className="w-full"
          inputGroupClassName="w-full"
        >
          <Label className="text-xs">Name</Label>
        </PaletteControlTextField>

        <PaletteControlNumberField
          value={props.hue}
          minValue={props.prevHue}
          maxValue={props.nextHue}
          onChange={props.setHue}
          inputGroupClassName="w-24"
        >
          <Label className="text-xs">Hue</Label>
        </PaletteControlNumberField>

        <Button onClick={props.deleteHueStep} className="w-6 shrink-0">
          <Label className="sr-only">Delete</Label>
          <Icon name="delete" />
        </Button>
      </div>
    </li>
  ),
);
