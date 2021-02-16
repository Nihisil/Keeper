import React from "react";
import "components/App/index.scss";

function App(): JSX.Element {
  return (
    <div className="app">
      <header className="header">
        <p>Hi there... {process.env.REACT_APP_API_HOST}</p>
      </header>
    </div>
  );
}

export default App;
