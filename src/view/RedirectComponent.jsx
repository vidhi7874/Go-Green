import React from "react";
import { Navigate } from "react-router-dom";

export default function RedirectComponent() {
  return <Navigate to="/dashboard" replace={true} />;
}
