import clsx from "clsx";
import { memo, type ReactNode } from "react";
import { Button as AriaButton, type ButtonProps } from "react-aria-components";
import {
  type RoundedVariant,
  roundedCn,
  roundedForAfterCn,
} from "./class-names.ts";
import { render, renderClassName } from "./render.tsx";

export const buttonCn = (rounded: RoundedVariant = "rounded-base") =>
  clsx(
    "relative outline-none ring-t1b7-600/50 transition-shadow dark:ring-t1b7-400/50",
    "before:pointer-events-none before:absolute before:inset-e-0 before:inset-s-0 before:top-0 before:bottom-0 before:border-g1-800/20 before:border-b-2 dark:before:border-g1-200/20",
    "after:pointer-events-none after:absolute after:inset-e-0 after:inset-s-0 after:top-0 after:bottom-0 after:border after:border-transparent",
    "data-focus-visible:ring-2 data-hovered:ring-2",
    "aria-checked:shadow-inner dark:shadow-black/10",
    "aria-checked:bg-white aria-checked:after:border-g1-300 dark:aria-checked:bg-g1-800 dark:aria-checked:after:border-g1-700",
    "data-pressed:after:bg-g1-800/20 dark:data-pressed:after:bg-g1-200/20",
    "disabled:opacity-50",
    roundedCn(rounded),
    roundedForAfterCn(rounded),
  );

export const Button = memo(
  (
    props: { rounded?: Parameters<typeof buttonCn>[0] } & ButtonProps,
  ): ReactNode => {
    return (
      <AriaButton
        {...props}
        className={renderClassName(
          props.className,
          buttonCn(props.rounded ?? "rounded-base"),
        )}
      >
        {render(props.children)}
      </AriaButton>
    );
  },
);
