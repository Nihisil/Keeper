// for supporting experimental features types
/// <reference types="react-dom/experimental" />

import React from "react";
import ReactDOM from "react-dom";
import "index.scss";
import App from "components/App";

const root = document.getElementById("root") as HTMLElement;
ReactDOM.unstable_createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
