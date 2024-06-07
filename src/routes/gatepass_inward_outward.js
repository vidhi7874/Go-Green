import { Suspense, lazy } from "react";
import Layout from "../components/Layout/Layout";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";
import ProtectedRoutes from "./ProtectedRoutes";
const AddEditGatePassOutward = lazy(() =>
  import("../view/GatePass/AddEditGatePassOutward")
);
const GatePassOutwardPage = lazy(() =>
  import("../view/GatePass/GatePassOutwardPage")
);
const AddEditGatePassInward = lazy(() =>
  import("../view/GatePass/AddEditGatePassInward")
);
const GatePassInwardPage = lazy(() =>
  import("../view/GatePass/GatePassInwardPage")
);

const gatePassRoute = [
  {
    // path: "/gate-pass/inward",
    // path: `/${ROUTE_PATH.GATE_PASS.SUB_KEY}/${ROUTE_PATH.GATE_PASS.GATE_PASS_INWARD}`,
    path: `${ROUTE_PATH.GATE_PASS_INWARD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Gate Pass"}>
            <GatePassInwardPage />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "/gate-pass/add/inward",
    // path: `/${ROUTE_PATH.GATE_PASS.SUB_KEY}/${ROUTE_PATH.GATE_PASS.GATE_PASS_INWARD_ADD}`,
    path: `${ROUTE_PATH.GATE_PASS_INWARD_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Gate Pass Details"}>
            <AddEditGatePassInward />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "gate-pass/edit/inward/:id",
    // path: `/${ROUTE_PATH.GATE_PASS.SUB_KEY}/${ROUTE_PATH.GATE_PASS.GATE_PASS_INWARD_EDIT}`,
    path: `${ROUTE_PATH.GATE_PASS_INWARD_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Gate Pass Details"}>
            <AddEditGatePassInward />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: "/gate-pass/outward",
    // path: `/${ROUTE_PATH.GATE_PASS.SUB_KEY}/${ROUTE_PATH.GATE_PASS.GATE_PASS_OUTWARD}`,
    path: `${ROUTE_PATH.GATE_PASS_OUTWARD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Gate Pass"}>
            <GatePassOutwardPage />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "/gate-pass/add/outward",
    // path: `/${ROUTE_PATH.GATE_PASS.SUB_KEY}/${ROUTE_PATH.GATE_PASS.GATE_PASS_OUTWARD_ADD}`,
    path: `${ROUTE_PATH.GATE_PASS_OUTWARD_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Gate Pass Details"}>
            <AddEditGatePassOutward />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "gate-pass/edit/outward/:id",
    // path: `/${ROUTE_PATH.GATE_PASS.SUB_KEY}/${ROUTE_PATH.GATE_PASS.GATE_PASS_OUTWARD_EDIT}`,
    path: `${ROUTE_PATH.GATE_PASS_OUTWARD_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Gate Pass Details"}>
            <AddEditGatePassOutward />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default gatePassRoute;
