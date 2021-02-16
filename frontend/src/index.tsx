import React from "react";
import ReactDOM from "react-dom";
import "index.scss";
import App from "components/App/App";

const root = document.getElementById("root") as HTMLElement;
ReactDOM.unstable_createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
