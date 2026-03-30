import { type ComponentProps, memo, type ReactNode } from "react";
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
} from "react-aria-components";
import { buttonCn } from "./Button.tsx";
import type { RoundedVariant } from "./class-names.ts";
import { renderClassName } from "./render.tsx";

export const ToggleButtonGroup = memo(
  (
    props: { rounded?: RoundedVariant } & ComponentProps<
      typeof AriaToggleButtonGroup
    >,
  ): ReactNode => (
    <AriaToggleButtonGroup
      {...props}
      className={renderClassName(props.className, "flex flex-row")}
    />
  ),
);

export const ToggleButton = memo(
  (
    props: { rounded?: RoundedVariant } & ComponentProps<
      typeof AriaToggleButton
    >,
  ): ReactNode => (
    <AriaToggleButton
      {...props}
      className={renderClassName(props.className, buttonCn(props.rounded))}
    />
  ),
);
