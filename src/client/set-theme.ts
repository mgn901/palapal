globalThis.document.documentElement.dataset.appearanceMode =
  globalThis.window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
