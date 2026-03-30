import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import type { MaterialIconName } from "../lib/material-icon-name.ts";

const iconCn = (variant?: "outlined" | "fill") =>
  clsx(variant === "fill" ? "font-icon-fill" : "font-icon-outlined");

export const Icon = (
  props: { name: MaterialIconName; variant?: "outlined" | "fill" } & Omit<
    HTMLAttributes<HTMLSpanElement>,
    "children"
  >,
): ReactNode => (
  <span
    {...props}
    className={clsx(props.className, iconCn(props.variant))}
    aria-hidden={true}
  >
    {props.name}
  </span>
);
