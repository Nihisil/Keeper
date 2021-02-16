import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "index.scss";
import App from "components/App/App";

const root = document.getElementById("root") as HTMLElement;
ReactDOM.unstable_createRoot(root).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading... </div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);
