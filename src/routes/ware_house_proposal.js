import { Box } from "@chakra-ui/react";
import Layout from "../components/Layout/Layout";
// import { headerType } from "./routes";
import { Suspense, lazy } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import headerType from "./headerConfig";
import ROUTE_PATH from "../constants/ROUTE";
const WarehouseProposal = lazy(() =>
  import("../view/WarehouseProposal/WarehouseProposal")
);

const wareHouse_ProposalRoute = [
  {
    // path: "/warehouse-proposal/:id",
    path: `${ROUTE_PATH.PROPOSALS_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense
          fallback={
            <Box
              color="red"
              display={"flex"}
              justifyContent="center"
              alignItems="center"
            >
              Loading...
            </Box>
          }
        >
          <Layout variant={headerType} title={"warehouseProposal"}>
            <WarehouseProposal />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "/warehouse-proposal",
    path: `${ROUTE_PATH.PROPOSALS}`,
    element: (
      <ProtectedRoutes>
        <Suspense
          fallback={
            <Box
              color="red"
              display={"flex"}
              justifyContent="center"
              alignItems="center"
            >
              Loading...
            </Box>
          }
        >
          <Layout variant={headerType} title={"warehouseProposal"}>
            <WarehouseProposal />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default wareHouse_ProposalRoute;
