import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "index.scss";
import App from "components/App/App";
import { BrowserRouter } from "react-router-dom";

const root = document.getElementById("root") as HTMLElement;
ReactDOM.unstable_createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
