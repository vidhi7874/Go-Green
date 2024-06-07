import { Suspense, lazy } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "../components/Layout/Layout";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";
const Setting = lazy(() => import("../view/Setting/Setting"));
// import { headerType } from "./routes";

const settingRoute = [
  {
    // path: "/setting/",
    path: `${ROUTE_PATH.SETTING}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Setting"}>
            <Setting />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default settingRoute;
