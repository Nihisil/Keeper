import "index.scss";

import App from "components/App/App";
import React from "react";
import ReactDOM from "react-dom";

const root = document.getElementById("root") as HTMLElement;
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root
);
