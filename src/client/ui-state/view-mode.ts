import { useState } from "react";
import { ShowerHead } from "../shower-head.ts";

type ViewMode = "compact" | "scrollable";

export const [, useViewMode, useSetViewMode] = ShowerHead.put(
  () => useState<ViewMode>("compact"),
  ["scrollable", () => {}],
);
