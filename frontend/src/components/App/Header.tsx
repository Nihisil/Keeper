import React from "react";
import { Link } from "react-router-dom";
import { User } from "client/data-contracts";
import { deleteToken } from "utils/token";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps): JSX.Element {
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
