import clsx from "clsx";
import { type HTMLAttributes, memo, type ReactNode } from "react";
import { usePaletteRow } from "../model/palette-editor-hooks.ts";

export const PaletteHueHeading = memo(
  (props: {
    rowId: string;
    className?: HTMLAttributes<HTMLSpanElement>["className"];
  }): ReactNode => {
    const paletteRow = usePaletteRow(props.rowId);

    if (!paletteRow) return undefined;

    return (
      <span
        className={clsx(
          "flex flex-row items-baseline justify-between gap-x-2",
          props.className,
        )}
      >
        <span className="font-semibold">{paletteRow.name}</span>{" "}
        <span className="font-semibold text-xs">
          H{paletteRow.oklchHue.toFixed(1)}
        </span>
      </span>
    );
  },
);
