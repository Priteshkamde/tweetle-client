import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { AuthContext } from "../context/auth";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);

  const menuBar = user ? (
    <div>
      <div className="ui inverted segment">
        <div className="ui inverted secondary pointing menu">
          <NavLink exact="true" to="/" className="item">
            {user.username}
          </NavLink>
          <NavLink to="/" className="item" onClick={logout}>
            Logout
          </NavLink>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div className="ui inverted segment">
        <div className="ui inverted secondary pointing menu">
          <NavLink exact="true" to="/" className="item">
            Home
          </NavLink>
          <NavLink to="/login" className="item">
            Login
          </NavLink>
          <NavLink to="/register" className="item">
            Register
          </NavLink>
        </div>
      </div>
    </div>
  );

  return menuBar;
}

export default MenuBar;
