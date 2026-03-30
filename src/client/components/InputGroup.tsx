import clsx from "clsx";
import type { ReactNode } from "react";
import { Group as AriaGroup, type GroupProps } from "react-aria-components";
import { type RoundedVariant, roundedCn } from "./class-names.ts";
import { render, renderClassName } from "./render.tsx";

const textFieldGroupCn = (rounded: RoundedVariant) =>
  clsx(
    "border border-g1-200 bg-white shadow-inner outline-none ring-t1b7-600/50 transition-shadow dark:border-g1-700 dark:bg-g1-800 dark:shadow-black/10 dark:ring-t1b7-400/50",
    "disabled:opacity-50",
    "data-focus-within:ring-2 data-hovered:ring-2",
    roundedCn(rounded),
  );

export const InputGroup = (
  props: { rounded?: RoundedVariant } & GroupProps,
): ReactNode => {
  return (
    <AriaGroup
      {...props}
      className={renderClassName(
        props.className,
        textFieldGroupCn(props.rounded ?? "rounded-base"),
      )}
    >
      {render(props.children)}
    </AriaGroup>
  );
};
