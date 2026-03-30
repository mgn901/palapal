import clsx from "clsx";
import { memo, type ReactNode } from "react";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger as AriaMenuTrigger,
  type MenuItemProps,
  type MenuProps,
} from "react-aria-components";
import {
  type RoundedVariant,
  roundedCn,
  roundedForAfterCn,
} from "./class-names.ts";
import { render, renderClassName } from "./render.tsx";

const menuItemCn = (rounded: RoundedVariant) =>
  clsx(
    "relative min-w-max outline-none ring-t1b7-600/50 transition-shadow dark:ring-t1b7-400/50",
    "after:pointer-events-none after:absolute after:top-0 after:left-0 after:h-full after:w-full",
    "data-focus-visible:ring-2 data-hovered:ring-2",
    "data-pressed:after:bg-g1-800/10 dark:data-pressed:after:bg-g1-200/10",
    roundedCn(rounded),
    roundedForAfterCn(rounded),
  );

export const MenuTrigger = memo(AriaMenuTrigger);

export const Menu = memo(<T extends object>(props: MenuProps<T>): ReactNode => {
  return (
    <AriaMenu
      {...props}
      className={renderClassName(props.className, clsx("outline-none"))}
    >
      {props.children}
    </AriaMenu>
  );
}) as typeof AriaMenu;

const MenuItemWithoutMemo = <T extends object>(
  props: { rounded?: Parameters<typeof menuItemCn>[0] } & MenuItemProps<T>,
): ReactNode => {
  return (
    <AriaMenuItem
      {...props}
      className={renderClassName(
        props.className,
        menuItemCn(props.rounded ?? "rounded-base"),
      )}
    >
      {render(props.children)}
    </AriaMenuItem>
  );
};

export const MenuItem = memo(MenuItemWithoutMemo) as typeof MenuItemWithoutMemo;
