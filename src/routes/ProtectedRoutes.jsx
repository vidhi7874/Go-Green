import { Navigate } from "react-router-dom";
import { localStorageService } from "../services/localStorge.service";

export default function ProtectedRoutes({ children }) {
  const isAuth = localStorageService.get("GG_ADMIN")?.userDetails?.token.access;
  return isAuth ? (
    children
  ) : (
    <Navigate to={{ pathname: "/login", state: { from: "" } }} />
  );
}
