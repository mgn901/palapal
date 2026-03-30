import { type ComponentProps, memo } from "react";
import { ColorSwatch } from "react-aria-components";
import { hexFromOklchInt32, oklchVector3FromInt32 } from "../model/color.ts";
import { usePaletteCell } from "../model/palette-editor-hooks.ts";

export const PaletteColorSwatch = memo(
  (props: {
    rowId: string;
    columnIndex: number;
    className?: ComponentProps<typeof ColorSwatch>["className"];
  }) => {
    const color = usePaletteCell(props.rowId, props.columnIndex);

    if (color === undefined) return undefined;

    return (
      <ColorSwatch
        color={hexFromOklchInt32(color)}
        colorName={`oklch(${oklchVector3FromInt32(color)
          .map((v) => v.toFixed(2))
          .join(" ")})`}
        {...(props.className ? { className: props.className } : {})}
        style={({ color }) => ({
          backgroundColor: color.toString(),
        })}
      />
    );
  },
);
