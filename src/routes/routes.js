import allMasterRoutes from "./allMaster_routes";
import dashboardRoutes from "./dashboard";
import hiringProposalRoute from "./hiring_proposal";
import inspectionMasterRoute from "./inspection-master";
import reInspectionRoute from "./re-inspection-master";
import serviceContract from "./service_contract";
import commodityInwardReport from "./commodity_inward_reports";
import settingRoute from "./settings";
import gatePassRoute from "./gatepass_inward_outward";
import commodityOutwardRoutes from "./commodity_outward_report";
import deliveryOrderRoute from "./deliveryOrder";
import QualityReportRoute from "./qualityControlReport";
import wareHouse_ProposalRoute from "./ware_house_proposal";
import notFoundRoute from "./not_found";
import guestListRoute from "./GuestRouteList";
import AllBillingRoutes from "./AllBillingRoutes";
// import { ROUTE_PATH } from "../constants/ROUTE";
// import ServiceContractWms from "../view/ServiceContractWms/ServiceContractWms";
// import Layout from "../components/Layout/Layout";
// import headerType from "./headerConfig";
// import { Suspense } from "react";
// import ProtectedRoutes from "./ProtectedRoutes";
// import ServiceContractPwh from "../view/Service Contract/Service Contract Pwh/ServiceContractPwh";
// import StateMaster from "../view/StateMaster/StateMaster";
// import RegionMaster from "../view/RegionMaster/RegionMaster";
// import { Navigate, Route } from "react-router-dom";

// ??  variable for the css work ..

const routes = [
  // ?? guest routes ...

  ...guestListRoute,

  // ?? dashboard , change password page routes
  ...dashboardRoutes,

  // ?? All master module for the routes
  // {
  //   // path: "/all-master",
  //   path: `/${ROUTE_PATH.ALL_MASTERS.SUB_KEY}`,
  //   children: [...allMasterRoutes],
  // },
  ...allMasterRoutes,
  // {
  //   // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.STATE}`,
  //   path:"/all-master-state",
  //   element: (
  //     <ProtectedRoutes>
  //       <Suspense fallback={<div>Loading...</div>}>
  //         <Layout variant={headerType} title={"State Master"}>
  //           <StateMaster />
  //         </Layout>
  //       </Suspense>
  //     </ProtectedRoutes>
  //   ),
  // },
  // {
  //   // path: "/pwh",
  //   // path: `${ROUTE_PATH.SERVICE_CONTRACT.SERVICE_CONTRACT_PWH}`,
  //   path: "/service-contract-pwh",
  //   element: (
  //     <ProtectedRoutes>
  //       <Suspense fallback={<div>Loading...</div>}>
  //         <Layout variant={headerType} title={"Service contract(PWH)"}>
  //           <ServiceContractPwh />
  //         </Layout>
  //       </Suspense>
  //     </ProtectedRoutes>
  //   ),
  // },
  // {
  //   // path: "/wms",
  //   // path: `${ROUTE_PATH.SERVICE_CONTRACT.SERVICE_CONTRACT_WMS}`,

  //   path: "/service-contract-wms",
  //   element: (
  //     <ProtectedRoutes>
  //       <Suspense fallback={<div>Loading...</div>}>
  //         <Layout variant={headerType} title={"Service Contract (WMS) "}>
  //           <ServiceContractWms />
  //         </Layout>
  //       </Suspense>
  //     </ProtectedRoutes>
  //   ),
  // },
  // ?? hiring proposal ..
  ...hiringProposalRoute,

  // ?? inspection master...
  ...inspectionMasterRoute,

  // ?? reinspection master...
  ...reInspectionRoute,

  //?? service contract...

  ...serviceContract,
  // {
  //   // path: "/service-contract",
  //   path: `/${ROUTE_PATH.SERVICE_CONTRACT.SUB_KEY}`,
  //   children: [...serviceContract],
  // },

  // ?? commodity inward...
  ...commodityInwardReport,

  // ?? commodity outward
  ...commodityOutwardRoutes,

  //?? setting routes..
  ...settingRoute,

  //  ?? gate pass inward and outward
  ...gatePassRoute,

  // ?? delivery order
  ...deliveryOrderRoute,

  // ?? Quality Control Report
  ...QualityReportRoute,

  // ?? all the billing routes declared here ..
  ...AllBillingRoutes,

  // ?? warehouse proposal ..
  ...wareHouse_ProposalRoute,

  // ?? mot found page route
  ...notFoundRoute,
];

export default routes;
