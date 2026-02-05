import { createRouter, RouterProvider } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({ routeTree });

export const Router = (): ReactNode => <RouterProvider router={router} />;

// 型推論を使用するのに必要。
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
