import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { createHashHistory, createBrowserHistory } from "@tanstack/react-router";

import "@xterm/xterm/css/xterm.css";
import "./index.css";

import { isElectron } from "./env";
import { getRouter } from "./router";
import { APP_DISPLAY_NAME } from "./branding";

// Electron loads the app from a file-backed shell, so hash history avoids path resolution issues.
const history = isElectron ? createHashHistory() : createBrowserHistory();

if (import.meta.env.DEV && typeof document !== "undefined") {
  const existing = document.querySelector<HTMLScriptElement>("script[data-react-grab]");
  if (!existing) {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/react-grab/dist/index.global.js";
    script.async = true;
    script.setAttribute("data-react-grab", "true");
    document.head.appendChild(script);
  }
}

const router = getRouter(history);

document.title = APP_DISPLAY_NAME;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
