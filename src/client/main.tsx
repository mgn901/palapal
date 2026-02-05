import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeadProvider } from "./lib/head.tsx";
import { Router } from "./router.tsx";

// biome-ignore lint/style/noNonNullAssertion: #root element exists in HTML file
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeadProvider>
      <Router />
    </HeadProvider>
  </StrictMode>,
);
