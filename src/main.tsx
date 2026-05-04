import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Temporarily re-register sw.js so the old cache-first SW gets replaced by
// the self-uninstalling one (which then unregisters itself and clears caches).
// After most users have visited once, we can drop this and re-introduce a
// properly-versioned SW.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => reg.update())
      .catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
