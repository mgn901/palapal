import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeadProvider } from "./lib/HeadProvider.tsx";
import { Router } from "./router.tsx";
import { ShowerHead } from "./shower-head.ts";

// biome-ignore lint/style/noNonNullAssertion: #root element exists in HTML file
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ShowerHead.Provider>
      <HeadProvider>
        <Router />
      </HeadProvider>
    </ShowerHead.Provider>
  </StrictMode>,
);
