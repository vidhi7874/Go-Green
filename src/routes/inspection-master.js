import { Suspense, lazy } from "react";
import Layout from "../components/Layout/Layout";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";
import ProtectedRoutes from "./ProtectedRoutes";
const InspectionMaster = lazy(() =>
  import("../view/warehouseInspection/InspectionMaster")
);
const WarehouseInspection = lazy(() =>
  import("../view/warehouseInspection/WarehouseInspection")
);

const inspectionMasterRoute = [
  {
    // path: "/inspection-master",
    path: `${ROUTE_PATH.WAREHOUSE_INSPECTION_MASTER}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Inspection Report"}>
            <InspectionMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "/warehouse-inspection",
    path: `${ROUTE_PATH.WAREHOUSE_INSPECTION}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Inspection "}>
            <WarehouseInspection />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default inspectionMasterRoute;
