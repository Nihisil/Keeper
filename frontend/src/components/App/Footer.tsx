import "components/App/Footer.scss";

import React from "react";

interface FooterProps {}

export default function Footer({}: FooterProps): JSX.Element {
  return (
    <>
      <footer className="footer">
        <div className="container text-right">
          <span className="small text-muted">{process.env.REACT_APP_VERSION} version</span>
        </div>
      </footer>
    </>
  );
}
