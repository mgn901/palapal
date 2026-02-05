import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { environmentVariables } from "../lib/env";
import { useHead } from "../lib/head";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  useHead({
    path: Route.useMatch().fullPath,
    title: environmentVariables.APP_TITLE,
  });
  return (
    <>
      <div>Hello "__root"!</div>
      <Link to="/test">Go to /test</Link>
      <Outlet />
    </>
  );
}
