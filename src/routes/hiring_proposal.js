import { Suspense, lazy } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "../components/Layout/Layout";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";
const HiringProposalMaster = lazy(() =>
  import("../view/HiringProposalMaster/HiringProposalMaster")
);
const AddEditFormHiringProposalMaster = lazy(() =>
  import("../view/HiringProposalMaster/AddEditFormHiringProposalMaster")
);

const hiringProposalRoute = [
  {
    // path: "/hiring-proposal-master",
    path: `${ROUTE_PATH.WAREHOUSE_PROPOSAL}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Hiring Proposal Master"}>
            <HiringProposalMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: "add/hiring-proposal-master",
    path: `${ROUTE_PATH.WAREHOUSE_PROPOSAL_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Hiring Proposal Master"}>
            <AddEditFormHiringProposalMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "edit/hiring-proposal-master/:id",
    path: `${ROUTE_PATH.WAREHOUSE_PROPOSAL_EDIT}/:id`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Hiring Proposal  Master"}>
            <AddEditFormHiringProposalMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default hiringProposalRoute;
