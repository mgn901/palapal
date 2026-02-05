import { createFileRoute } from "@tanstack/react-router";
import { environmentVariables } from "../../lib/env";
import { useHead } from "../../lib/head";
import { constrainFunctionFromSchema } from "../../lib/tanstack-router-utils";

export const Route = createFileRoute("/test")({
  validateSearch: constrainFunctionFromSchema({
    type: "object",
    properties: { q: { type: "string" } },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const routeSearch = Route.useSearch();

  useHead({
    path: Route.useMatch().fullPath,
    title: `${routeSearch.q} - ${environmentVariables.APP_TITLE}`,
  });

  return (
    <div>
      Hello "/test!"
      <ul>
        <li>q: {routeSearch.q}</li>
      </ul>
    </div>
  );
}
