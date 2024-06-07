import { Suspense, lazy } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "../components/Layout/Layout";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";
// import { headerType } from "./routes";
const ServiceContractPwh = lazy(() =>
  import("../view/Service Contract/Service Contract Pwh/ServiceContractPwh")
);
const AddEditServiceContractPwh = lazy(() =>
  import(
    "../view/Service Contract/Service Contract Pwh/AddEditServiceContractPwh"
  )
);
const AddEditServiceContractWms = lazy(() =>
  import("../view/ServiceContractWms/AddEditServiceContractWms")
);
const ServiceContractWms = lazy(() =>
  import("../view/ServiceContractWms/ServiceContractWms")
);

const serviceContract = [
  {
    // path: "/pwh",
    // path: `${ROUTE_PATH.SERVICE_CONTRACT.SERVICE_CONTRACT_PWH}`,
    path: `${ROUTE_PATH.SERVICE_CONTRACT_PWH}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Service contract(PWH)"}>
            <ServiceContractPwh />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "add/pwh",
    // path: `${ROUTE_PATH.SERVICE_CONTRACT.SERVICE_CONTRACT_PWH_ADD}`,
    path: `${ROUTE_PATH.SERVICE_CONTRACT_PWH_ADD}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Service contract(PWH)"}>
            <AddEditServiceContractPwh />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  // ! un used route ...
  //   {
  //     path: "add/service-contract-pwh",
  //     element: (
  //       <ProtectedRoutes>
  //         <Suspense fallback={<div>Loading...</div>}>
  //           <Layout variant={headerType} title={"Service Contract (PWH)"}>
  //             <AddEditServiceContractWms />
  //           </Layout>
  //         </Suspense>
  //       </ProtectedRoutes>
  //     ),
  //   },
  {
    // path: "edit/pwh/:id",
    // path: `${ROUTE_PATH.SERVICE_CONTRACT.SERVICE_CONTRACT_PWH_EDIT}`,
    path: `${ROUTE_PATH.SERVICE_CONTRACT_PWH_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Service Contract (PWH)"}>
            <AddEditServiceContractPwh />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // ! unused route due to same route name but different component..
  // {
  //   path: "edit/service-contract-pwh/:id",
  //   element: (
  //     <ProtectedRoutes>
  //       <Suspense fallback={<div>Loading...</div>}>
  //         <Layout variant={headerType} title={"Service Contract (PWH)"}>
  //           <AddEditServiceContractWms />
  //         </Layout>
  //       </Suspense>
  //     </ProtectedRoutes>
  //   ),
  // },
  {
    // path: "/wms",
    // path: `${ROUTE_PATH.SERVICE_CONTRACT.SERVICE_CONTRACT_WMS}`,

    path: `${ROUTE_PATH.SERVICE_CONTRACT_WMS}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Service Contract (WMS) "}>
            <ServiceContractWms />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "add/wms",
    // path: `${ROUTE_PATH.SERVICE_CONTRACT.SERVICE_CONTRACT_WMS_ADD}`,
    path: `${ROUTE_PATH.SERVICE_CONTRACT_WMS_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Service Contract (WMS)"}>
            <AddEditServiceContractWms />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "edit/wms/:id",
    // path: `${ROUTE_PATH.SERVICE_CONTRACT.SERVICE_CONTRACT_WMS_EDIT}`,
    path: `${ROUTE_PATH.SERVICE_CONTRACT_WMS_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Service Contract (WMS)"}>
            <AddEditServiceContractWms />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];
export default serviceContract;
