import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../context/auth";

function AuthRoute({ redirectTo }) {
  const { user } = useContext(AuthContext);

  return user ? <Navigate to={redirectTo} /> : <Outlet />;
}

export default AuthRoute;
