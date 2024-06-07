import { Suspense, lazy } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
// import { headerType } from "./routes";
import Layout from "../components/Layout/Layout";
import headerType from "./headerConfig";
import ROUTE_PATH from "../constants/ROUTE";
const QualityControlReport = lazy(() =>
  import("../view/QualityControlReport/QualityControlReport")
);
const AddEditQualityControlReport = lazy(() =>
  import("../view/QualityControlReport/AddEditQualityControlReport")
);

const QualityReportRoute = [
  {
    // path: "/quality-control-report",
    path: `${ROUTE_PATH.QUALITY_CONTROL_REPORT}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Quality Control Report"}>
            <QualityControlReport />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: "/quality-control-report/add",
    path: `${ROUTE_PATH.QUALITY_CONTROL_REPORT_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Quality Control Report"}>
            <AddEditQualityControlReport />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "/quality-control-report/edit/:id",
    path: `${ROUTE_PATH.QUALITY_CONTROL_REPORT_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Quality Control Report"}>
            <AddEditQualityControlReport />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default QualityReportRoute;
