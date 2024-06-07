import { Navigate } from "react-router-dom";
import { localStorageService } from "../services/localStorge.service";

export default function GuestRoute({ children }) {
  const isAuth = localStorageService.get("GG_ADMIN")?.userDetails?.token.access;
  return isAuth ? (
    <Navigate to={{ pathname: "/", state: { from: "" } }} />
  ) : (
    children
  );
}
