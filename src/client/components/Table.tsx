import clsx from "clsx";
import { memo, type ReactNode } from "react";
import {
  Cell as AriaCell,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  type CellProps,
  type ColumnProps,
  type RowProps,
  type TableProps,
} from "react-aria-components";
import { renderClassName } from "./render.tsx";

const focusRingCn = clsx(
  // "relative outline-none after:pointer-events-none after:absolute after:start-0 after:end-0 after:top-0 after:bottom-0 after:z-50 after:rounded after:ring-0 after:ring-t1b7-600/50 after:transition-shadow data-focus-visible:after:ring-2",
  "outline-0 outline-t1b7-600/50 dark:outline-t1b7-400/50",
  "data-focus-visible:z-50 data-focus-visible:outline-2",
);

export const TableHeader = memo(AriaTableHeader);
export const TableBody = memo(AriaTableBody);

export const Table = memo((props: TableProps): ReactNode => {
  return (
    <AriaTable
      {...props}
      className={renderClassName(props.className, focusRingCn)}
    />
  );
});

export const Column = memo((props: ColumnProps): ReactNode => {
  return (
    <AriaColumn
      {...props}
      className={renderClassName(
        props.className,
        clsx("font-semibold", focusRingCn),
      )}
    />
  );
});

export const Cell = memo((props: CellProps): ReactNode => {
  return (
    <AriaCell
      {...props}
      className={renderClassName(props.className, focusRingCn)}
    />
  );
});

export const Row = memo(<T extends object>(props: RowProps<T>): ReactNode => {
  return (
    <AriaRow<T>
      {...props}
      className={renderClassName(props.className, focusRingCn)}
    />
  );
});
