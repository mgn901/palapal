import { clsx } from "clsx";

export type RoundedVariant =
  | "rounded-xs"
  | "rounded-sm"
  | "rounded-base"
  | "rounded-md"
  | "rounded-lg"
  | "rounded-xl"
  | "rounded-2xl"
  | "rounded-3xl"
  | "rounded-4xl"
  | "rounded-none"
  | "rounded-full";

export const roundedCn = (rounded: RoundedVariant) =>
  clsx(
    rounded === "rounded-xs" && "rounded-xs",
    rounded === "rounded-sm" && "rounded-sm",
    rounded === "rounded-base" && "rounded",
    rounded === "rounded-md" && "rounded-md",
    rounded === "rounded-lg" && "rounded-lg",
    rounded === "rounded-xl" && "rounded-xl",
    rounded === "rounded-2xl" && "rounded-2xl",
    rounded === "rounded-3xl" && "rounded-3xl",
    rounded === "rounded-4xl" && "rounded-4xl",
    rounded === "rounded-none" && "rounded-none",
    rounded === "rounded-full" && "rounded-full",
  );

export const roundedForAfterCn = (rounded: RoundedVariant) =>
  clsx(
    rounded === "rounded-xs" && "after:rounded-xs",
    rounded === "rounded-sm" && "after:rounded-sm",
    rounded === "rounded-base" && "after:rounded",
    rounded === "rounded-md" && "after:rounded-md",
    rounded === "rounded-lg" && "after:rounded-lg",
    rounded === "rounded-xl" && "after:rounded-xl",
    rounded === "rounded-2xl" && "after:rounded-2xl",
    rounded === "rounded-3xl" && "after:rounded-3xl",
    rounded === "rounded-4xl" && "after:rounded-4xl",
    rounded === "rounded-none" && "after:rounded-none",
    rounded === "rounded-full" && "after:rounded-full",
  );

export const textFieldCn = (rounded: RoundedVariant) =>
  clsx(
    "border border-g1-200 bg-white shadow-inner outline-none ring-t1b7-600/50 transition-shadow dark:border-g1-700 dark:bg-g1-800 dark:shadow-black/10 dark:ring-t1b7-400/50",
    "disabled:opacity-50",
    "data-focus-visible:ring-2 data-hovered:ring-2",
    roundedCn(rounded),
  );
