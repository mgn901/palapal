import clsx from "clsx";
import type { ReactNode } from "react";
import { usePaletteParams } from "../model/palette-editor-hooks.ts";
import { ChromaParamControl } from "./ChromaParamControl.tsx";
import { HueParamControl } from "./HueParamControl.tsx";
import { LightnessParamControl } from "./LightnessParamControl.tsx";

export const ParameterControl = (): ReactNode => {
  const paletteParams = usePaletteParams();
  return (
    <div className="flex w-full flex-row">
      {paletteParams.map((param) => (
        <div
          key={param.id}
          className={clsx(
            "flex w-full max-w-2xl flex-col gap-x-4 gap-y-6 pb-safe-offset-12",
            "p-4",
            "lg:px-8",
          )}
        >
          <HueParamControl paramId={param.id} />
          <LightnessParamControl paramId={param.id} />
          <ChromaParamControl paramId={param.id} />
        </div>
      ))}
    </div>
  );
};
