import { memo, type ReactNode } from "react";
import {
  Popover as AriaPopover,
  type PopoverProps,
} from "react-aria-components";
import { render, renderClassName } from "./render.tsx";

export const Popover = memo((props: PopoverProps): ReactNode => {
  return (
    <AriaPopover
      {...props}
      className={renderClassName(
        props.className,
        "rounded-lg border border-g1-100 bg-g1-0/75 shadow-lg backdrop-blur-md dark:border-g1-700 dark:bg-g1-800/75",
      )}
    >
      {render(props.children)}
    </AriaPopover>
  );
});
