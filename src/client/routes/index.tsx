import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { Palette } from "../palette/Palette.tsx";
import { ParameterControl } from "../parameter-control/ParameterControl.tsx";
import { Toolbar } from "../toolbar/Toolbar.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-dvh-safe flex-col">
      <header className="sticky top-0 z-30 flex h-8 shrink-0 flex-row items-center justify-between border-g1-200 border-b bg-g1-100 px-4 lg:px-8 dark:border-g1-800 dark:bg-g1-900">
        <h1 className="font-bold">palapal</h1>
        <Toolbar />
      </header>
      <div
        className={clsx(
          "flex h-full max-h-[calc(100%-var(--spacing)*8)]",
          "flex-col",
          "lg:flex-row",
        )}
      >
        <section className="h-1/2 w-full overflow-auto lg:h-full">
          <Palette />
        </section>
        <section
          className={clsx(
            "shrink-0 overflow-auto border-g1-100 border-t bg-g1-0 dark:border-g1-900 dark:bg-g1-1000",
            "h-full max-h-1/2 w-full",
            "lg:-order-1 lg:max-h-none lg:w-md lg:border-e lg:border-t-0",
          )}
        >
          <ParameterControl />
        </section>
      </div>
    </div>
  );
}
