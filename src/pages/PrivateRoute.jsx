// PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element: Element }) => {
  const userInfo = useSelector((state) => state.auth.userInfo); // Check if the user is authenticated

  return userInfo ? <Element /> : <Navigate to="/auth" />;
};

export default PrivateRoute;
