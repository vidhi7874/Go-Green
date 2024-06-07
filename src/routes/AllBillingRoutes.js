import { Suspense, lazy } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
// import { headerType } from "./routes";
import Layout from "../components/Layout/Layout";
import headerType from "./headerConfig";
import ROUTE_PATH from "../constants/ROUTE";

const OwnerBilling = lazy(() => import("../view/OwnerBilling/OwnerBilling"));
const AddEditOwnerBilling = lazy(() =>
  import("../view/OwnerBilling/AddEditOwnerBilling")
);
const ClientBillingComponent = lazy(() =>
  import("../view/ClientBilling/ClientBillingComponent")
);
const OtherBillingComponent = lazy(() =>
  import("../view/OtherBilling/OtherBillingComponent")
);
const AddEditOtherBillingComponent = lazy(() =>
  import("../view/OtherBilling/AddEditOtherBillingComponent")
);

const AllBillingRoutes = [
  // routes for the owner billing ...
  {
    path: `${ROUTE_PATH.OWNER_BILLING}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Owner Billing"}>
            <OwnerBilling />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    path: `${ROUTE_PATH.OWNER_BILLING_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Owner Billing"}>
            <AddEditOwnerBilling />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    path: `${ROUTE_PATH.OWNER_BILLING_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Owner Billing"}>
            <AddEditOwnerBilling />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // routes for the client billing ...
  {
    path: `${ROUTE_PATH.CLIENT_BILLING}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Client Billing"}>
            <ClientBillingComponent />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // {Client
  //     <ProtectedRoutes>
  //       <Suspense fallback={<div>Loading...</div>}>
  //         <Layout variant={headerType} title={"Client Billing"}>
  //           <AddEditOwnerBilling />
  //         </Layout>
  //       </Suspense>
  //     </ProtectedRoutes>
  //   ),
  // },
  // for the edit ..
  // {
  //   path: `${ROUTE_PATH.CLIENT_BILLING_EDIT}/:id`,
  //   element: (
  //     <ProtectedRoutes>
  //       <Suspense fallback={<div>Loading...</div>}>
  //         <Layout variant={headerType} title={"Client Billing"}>
  //           <AddEditOwnerBilling />
  //         </Layout>
  //       </Suspense>
  //     </ProtectedRoutes>
  //   ),
  // },

  // routes for the other billing .....
  {
    path: `${ROUTE_PATH.OTHER_BILLING}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Other Billing"}>
            <OtherBillingComponent />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    path: `${ROUTE_PATH.OTHER_BILLING_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Other Billing"}>
            <AddEditOtherBillingComponent />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    path: `${ROUTE_PATH.OTHER_BILLING_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Other Billing"}>
            <AddEditOtherBillingComponent />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default AllBillingRoutes;
