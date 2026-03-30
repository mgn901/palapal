import clsx from "clsx";

export const render =
  <P extends unknown[], V, F = ((...args: P) => V) | V>(
    arbitaryChildren: F,
  ): ((...args: P) => V) =>
  (...args) =>
    typeof arbitaryChildren === "function"
      ? arbitaryChildren(...args)
      : arbitaryChildren;

export const renderClassName =
  <P extends unknown[]>(
    arbitaryCn: ((this: unknown, ...args: P) => string) | string | undefined,
    defaultCn?: ((this: unknown, ...args: P) => string) | string,
  ): ((...args: P) => string) =>
  (...args) =>
    clsx(
      typeof defaultCn === "function" ? defaultCn(...args) : defaultCn,
      typeof arbitaryCn === "function" ? arbitaryCn(...args) : arbitaryCn,
    );
