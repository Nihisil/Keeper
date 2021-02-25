import { Token, User } from "client/data-contracts";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "utils/api";

interface HeaderProps {
  setToken(userToken: Token | null): void;
}

export default function Header({ setToken }: HeaderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.users
      .getAuthUserInfo({ secure: true })
      .then((data) => {
        setUser(data.data);
      })
      .catch((error) => {
        if (error.status === 401) {
          // token was expired
          setToken(null);
        }
      });
  }, [setToken]);

  const handleLogOut = (e: React.MouseEvent) => {
    e.preventDefault();
    setToken(null);
  };

  const logoutLink = user ? (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <a href="#" className="nav-link" onClick={handleLogOut}>
          logout ({user.username})
        </a>
      </li>
    </ul>
  ) : (
    ""
  );

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
      {logoutLink}
    </nav>
  );
}
