import { Token, User } from "client/data-contracts";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "utils/api";
import { Nullish } from "utils/base";

interface HeaderProps {
  setToken(userToken: Nullish<Token>): void;
}

export default function Header({ setToken }: HeaderProps): JSX.Element {
  const [user, setUser] = useState<Nullish<User>>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.users.getAuthUserInfo({ secure: true });
        setUser(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // token was expired
          setToken(null);
        }
      }
    })();
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
