import { Suspense, lazy } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "../components/Layout/Layout";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";
const CommodityInwardReport = lazy(() =>
  import("../view/CommodityInwardReport/CommodityInwardReport")
);
const AddEditCommodityInwardReport = lazy(() =>
  import("../view/CommodityInwardReport/AddEditCommodityInwardReport")
);

// Commodity inward report routes strat
const commodityInwardReport = [
  {
    // path: "/commodity-inward-report",
    path: `${ROUTE_PATH.COMMODITY_INWARD_REPORT}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Inward Report"}>
            <CommodityInwardReport />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: "/add/commodity-inward-report",
    path: `${ROUTE_PATH.COMMODITY_INWARD_REPORT_ADD}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Inward Report "}>
            <AddEditCommodityInwardReport />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "/edit/commodity-inward-report/:id",
    path: `${ROUTE_PATH.COMMODITY_INWARD_REPORT_EDIT}/:id`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Inward Report "}>
            <AddEditCommodityInwardReport />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default commodityInwardReport;
// Commodity inward report routes end
