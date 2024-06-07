import { Suspense, lazy } from "react";
import Layout from "../components/Layout/Layout";
// import { headerType } from "./routes";
import ProtectedRoutes from "./ProtectedRoutes";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";
const DeliveryOrder = lazy(() => import("../view/DeliveryOrder/DeliveryOrder"));
const AddEditDeliveryOrder = lazy(() =>
  import("../view/DeliveryOrder/AddEditDeliveryOrder")
);

const deliveryOrderRoute = [
  {
    // path: "/delivery-order",
    path: `${ROUTE_PATH.DELIVERY_ORDER}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Delivery Order"}>
            <DeliveryOrder />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: "add/delivery-order",
    path: `${ROUTE_PATH.DELIVERY_ORDER_ADD}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Delivery Order"}>
            <AddEditDeliveryOrder />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: "edit/delivery-order/:id",
    path: `${ROUTE_PATH.DELIVERY_ORDER_EDIT}/:id`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Delivery Order"}>
            <AddEditDeliveryOrder />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default deliveryOrderRoute;
