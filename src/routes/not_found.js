import { Suspense } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "../components/Layout/Layout";
// import { headerType } from "./routes";
import NotFound from "../view/NotFound/NotFound";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";

const notFoundRoute = [
  {
    // path: "*",
    path: `${ROUTE_PATH.NOT_FOUND}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Not Found"}>
            <NotFound />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default notFoundRoute;
