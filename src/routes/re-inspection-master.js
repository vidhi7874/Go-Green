import { Suspense, lazy } from "react";
import Layout from "../components/Layout/Layout";
// import { headerType } from "./routes";
import ProtectedRoutes from "./ProtectedRoutes";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";
const WarehouseReInspection = lazy(() =>
  import("../view/WarehouseReInspection/WarehouseReInspection")
);

const ReInspectionMaster = lazy(() =>
  import("../view/WarehouseReInspection/ReInspectionMaster")
);

const ReInspectionStandard = lazy(() =>
  import("../view/WarehouseReInspection/GoGreen/WarehouseInspection")
);

const reInspectionRoute = [
  {
    // path: "/re-inspection-master",
    path: `${ROUTE_PATH.WAREHOUSE_RE_INSPECTION_MASTER}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout
            variant={headerType}
            title={"Warehouse Re-inspection report list"}
          >
            <ReInspectionMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "/re-inspection-master",
    path: `${ROUTE_PATH.WAREHOUSE_RE_INSPECTION_STANDARD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Re-inspection report"}>
            <ReInspectionStandard />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "/re-inspection-master",
    path: `${ROUTE_PATH.WAREHOUSE_RE_INSPECTION_HDFC}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Re-inspection report"}>
            <WarehouseReInspection />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default reInspectionRoute;
