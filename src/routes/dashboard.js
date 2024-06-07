import React, { lazy, Suspense } from "react";
import Layout from "../components/Layout/Layout";
// import { headerType } from "./routes";
import ProtectedRoutes from "./ProtectedRoutes";
// import Dashboard from "../view/Dashboard/Dashboard";
import CircleComponent from "../view/Circlecomponent";
// import NotFound from "../view/NotFound/NotFound";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";
import { Box, Center } from "@chakra-ui/react";
import Loader from "../components/Loader";
import RedirectComponent from "../view/RedirectComponent";

const Dashboard = lazy(() => import("../view/Dashboard/Dashboard"));
const ChangeCurrentPassword = lazy(() =>
  import("../view/Auth/ChangeCurrentPassword")
);
const SupersetDeshboard = lazy(() =>
  import("../view/SupersetDeshboard/SupersetDeshboard")
);

const dashboardRoutes = [
  // ?? main dashboard page route..
  {
    // path: "/dashboard",
    path: `/`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          {/* <Layout variant={headerType} title={"Dashboard"}>
            <Dashboard />
          </Layout> */}
          <RedirectComponent />
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "/dashboard",
    path: `/${ROUTE_PATH.DASHBOARD}`,

    element: (
      <ProtectedRoutes>
        <Suspense
          fallback={
            <Center h={"full"}>
              <Loader w="50px" h="50px" />
            </Center>
          }
        >
          <Layout variant={headerType} title={"Dashboard"}>
            <Dashboard />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  // ?? superSet Dashboard routes..
  {
    // path: "/superset-dashboard/:id",
    path: `${ROUTE_PATH.SUPERSET_DASHBOARD_ID}/:id`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Dashboard"}>
            <SupersetDeshboard />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // ?? change password route
  {
    // path: "/change-current-password",
    path: `${ROUTE_PATH.CHANGE_CURRENT_PASSWORD}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <ChangeCurrentPassword />
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "/testing",
    path: `${ROUTE_PATH.TESTING}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Area Master"}>
            <CircleComponent />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];
export default dashboardRoutes;
