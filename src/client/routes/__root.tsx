import { createRootRoute, Outlet } from "@tanstack/react-router";
import { environmentVariables } from "../lib/env.ts";
import { useHead } from "../lib/head.tsx";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  useHead({
    path: Route.useMatch().fullPath,
    title: environmentVariables.APP_TITLE,
  });
  return <Outlet />;
}
