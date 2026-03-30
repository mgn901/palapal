import { range } from "@mgn901/mgn901-utils-ts/range";
import clsx from "clsx";
import { memo, type PropsWithChildren, type ReactNode } from "react";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "../components/Table.tsx";
import { usePaletteRowsMetadata } from "../model/palette-editor-hooks.ts";
import { useViewMode } from "../ui-state/view-mode.ts";
import { PaletteColorSwatch } from "./PaletteColorSwatch.tsx";
import { PaletteHueHeading } from "./PaletteHueHeading.tsx";

export const Palette = memo((): ReactNode => {
  return (
    <PaletteViewModeStyleProvider>
      <PaletteTableProvider
        renderHueHeading={(rowId) => (
          <PaletteHueHeading rowId={rowId} className="palapal-hue-heading" />
        )}
        renderCell={(rowId, columnIndex) => (
          <PaletteColorSwatch
            rowId={rowId}
            columnIndex={columnIndex}
            className="h-full w-full"
          />
        )}
      />
    </PaletteViewModeStyleProvider>
  );
});

const PaletteViewModeStyleProvider = memo(
  (props: PropsWithChildren): ReactNode => {
    const viewMode = useViewMode();

    return (
      <div
        className={clsx(
          "h-full w-full",
          viewMode === "compact"
            ? compactTableSectionCn
            : scrollableTableSectionCn,
        )}
      >
        {props.children}
      </div>
    );
  },
);

const scrollableTableSectionCn = clsx(
  "[&_.palapal-cell]:h-12 [&_.palapal-cell]:w-12 [&_.palapal-cell]:min-w-12",
  "[&_.palapal-col-heading]:text-base",
);
const compactTableSectionCn = clsx(
  "[&_.palapal-table]:grid [&_.palapal-table]:h-full [&_.palapal-table]:max-h-full [&_.palapal-table]:w-full [&_.palapal-table]:max-w-full [&_.palapal-table]:grid-rows-[min-content]",
  "[&_.palapal-thead]:col-span-full [&_.palapal-thead]:grid [&_.palapal-thead]:auto-rows-min [&_.palapal-thead]:grid-cols-subgrid",
  "[&_.palapal-thead_tr]:col-span-full [&_.palapal-thead_tr]:grid [&_.palapal-thead_tr]:grid-flow-col [&_.palapal-thead_tr]:grid-cols-subgrid",
  "[&_.palapal-tr]:col-span-full [&_.palapal-tr]:grid [&_.palapal-tr]:grid-cols-subgrid",
  "[&_.palapal-row-heading]:w-4 [&_.palapal-row-heading]:shrink-0 [&_.palapal-row-heading]:p-0 lg:[&_.palapal-row-heading]:w-8",
  "[&_.palapal-col-heading]:font-normal [&_.palapal-col-heading]:text-xs",
  "[&_.palapal-hue-heading]:sr-only [&_.palapal-hue-heading]:w-0",
);
const paletteHeadingCn = clsx(
  "border-g1-0 bg-white/80 backdrop-blur-lg dark:border-g1-1000 dark:bg-black/80",
);

const PaletteTableProvider = memo(
  (props: {
    renderHueHeading: (rowId: string) => ReactNode;
    renderCell: (rowId: string, columnIndex: number) => ReactNode;
  }): ReactNode => {
    const paletteRowsMetadata = usePaletteRowsMetadata();
    const columnsCount = Math.max(
      0,
      ...paletteRowsMetadata.map(([, size]) => size),
    );

    return (
      <Table
        className={clsx(
          "palapal-table",
          "border-separate border-spacing-0",
          "pe-4 pb-4",
          "lg:pe-8 lg:pb-safe-offset-12",
        )}
        aria-label="Generated Palette"
        style={{
          gridTemplateColumns: `min-content repeat(${columnsCount}, minmax(0, 1fr))`,
        }}
      >
        <TableHeader className="palapal-thead sticky top-0 z-20">
          <Column
            isRowHeader={true}
            className={clsx(
              paletteHeadingCn,
              "palapal-row-heading",
              "sticky inset-s-0 z-10 border-e border-b",
            )}
          />
          {range(0, columnsCount, 1).map((i) => (
            <Column
              key={i}
              className={clsx(
                paletteHeadingCn,
                "palapal-col-heading border-b py-2 text-center",
              )}
            >
              {i * 100}
            </Column>
          ))}
        </TableHeader>
        <TableBody className="palapal-tr">
          {paletteRowsMetadata.map(([id]) => (
            <Row key={id} id={id} className="palapal-tr">
              <Cell
                id={`${id}-0`}
                className={clsx(
                  paletteHeadingCn,
                  "palapal-row-heading",
                  "sticky inset-s-0 z-10 border-e px-2",
                  "ps-4 lg:ps-8",
                )}
              >
                {props.renderHueHeading(id)}
              </Cell>
              {range(0, columnsCount, 1).map((i) => (
                <Cell
                  key={`${id}-${i + 1}`}
                  id={`${id}-${i + 1}`}
                  className="palapal-cell"
                >
                  {props.renderCell(id, i)}
                </Cell>
              ))}
            </Row>
          ))}
        </TableBody>
      </Table>
    );
  },
);
