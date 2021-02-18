import React from "react";
import { Link } from "react-router-dom";
import { deleteToken } from "utils/token";
import api, { fetchData } from "utils/api";

const resource = fetchData(api.users.getAuthUserInfo);

export default function Header(): JSX.Element {
  const user = resource.read();

  if (!user) {
    deleteToken()
    // easiest way to refresh user state is reload whole page
    window.location.href = "/";
  }

  const handleLogOut = (e: React.MouseEvent) => {
    e.preventDefault();
    deleteToken();
    // easiest way to refresh user state is reload whole page
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <Link to="/" className="navbar-brand">
        Keeper
      </Link>
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to="/finances" className="nav-link">
            Finances
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={handleLogOut}>
            {user.username} (logout)
          </a>
        </li>
      </ul>
    </nav>
  );
}
