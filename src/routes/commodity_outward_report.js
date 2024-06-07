import { Suspense, lazy } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "../components/Layout/Layout";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";
const AddEditCommodityOutwardReport = lazy(() =>
  import("../view/CommodityOutwardReport/AddEditCommodityOutwardReport")
);
const CommodityOutwardReport = lazy(() =>
  import("../view/CommodityOutwardReport/CommodityOutwardReport")
);

const commodityOutwardRoutes = [
  {
    // path: "/commodity-outward-report",
    path: `${ROUTE_PATH.COMMODITY_OUTWARD_REPORT}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Outward Report"}>
            <CommodityOutwardReport />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: "/add/commodity-outward-report",
    path: `${ROUTE_PATH.COMMODITY_OUTWARD_REPORT_ADD}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Outward Report "}>
            <AddEditCommodityOutwardReport />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "/edit/commodity-outward-report/:id",
    path: `${ROUTE_PATH.COMMODITY_OUTWARD_REPORT_EDIT}/:id`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Outward Report "}>
            <AddEditCommodityOutwardReport />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default commodityOutwardRoutes;
