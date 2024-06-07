import { Suspense, lazy } from "react";
import GuestRoute from "./GusetRoute";
import { ROUTE_PATH } from "../constants/ROUTE";

const Login = lazy(() => import("../view/Auth/Login"));
const ForgotPassword = lazy(() => import("../view/Auth/ForgotPassword"));
const ChangePassword = lazy(() => import("../view/Auth/ChangePassword"));

const guestListRoute = [
  {
    // path: "/login",
    path: `${ROUTE_PATH.LOGIN}`,

    element: (
      <GuestRoute>
        <Suspense fallback={<div>Loading...</div>}>
          <Login />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    // path: "/forgot-password",
    path: `${ROUTE_PATH.FORGOT_PASSWORD}`,

    element: (
      <GuestRoute>
        <Suspense fallback={<div>Loading...</div>}>
          <ForgotPassword />
        </Suspense>
      </GuestRoute>
    ),
  },

  {
    // path: "/change-password",
    path: `${ROUTE_PATH.CHANGE_PASSWORD}`,

    element: (
      <GuestRoute>
        <Suspense fallback={<div>Loading...</div>}>
          <ChangePassword />
        </Suspense>
      </GuestRoute>
    ),
  },
];

export default guestListRoute;
