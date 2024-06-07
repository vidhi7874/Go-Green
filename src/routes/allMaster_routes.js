import { Suspense, lazy } from "react";
import Layout from "../components/Layout/Layout";
import headerType from "./headerConfig";
import { ROUTE_PATH } from "../constants/ROUTE";
import ProtectedRoutes from "./ProtectedRoutes";
import TransferMaster from "../view/SecurityGuardTransfer/TransferMaster";
const ZoneMaster = lazy(() => import("../view/ZoneMaster/ZoneMaster"));
const AddEditZoneMaster = lazy(() =>
  import("../view/ZoneMaster/AddEditZoneMaster")
);
const RegionMaster = lazy(() => import("../view/RegionMaster/RegionMaster"));
const AddEditFormRegionMaster = lazy(() =>
  import("../view/RegionMaster/AddEditFormRegionMaster")
);
const StateMaster = lazy(() => import("../view/StateMaster/StateMaster"));
const AddEditFormStateMaster = lazy(() =>
  import("../view/StateMaster/AddEditFormStateMaster")
);
const DistrictMaster = lazy(() =>
  import("../view/DistrictMaster/DistrictMaster")
);
const AddEditFormDistrictMaster = lazy(() =>
  import("../view/DistrictMaster/AddEditDistrictMaster")
);
const AreaMaster = lazy(() => import("../view/AreaMaster/AreaMaster"));
const AddEditFormArea = lazy(() =>
  import("../view/AreaMaster/AddEditAreaMaster")
);
const UserMaster = lazy(() => import("../view/UserMaster/UserMaster"));
const AddEditFormUserMaster = lazy(() =>
  import("../view/UserMaster/AddEditFormUserMaster")
);
const SupervisorHiringMaster = lazy(() =>
  import("../view/SupervisorHiringMaster/SupervisorHiringMaster")
);
const AddEditSupervisorHiringMaster = lazy(() =>
  import("../view/SupervisorHiringMaster/AddEditSupervisorHiringMaster")
);
const RoleMaster = lazy(() => import("../view/Role Master/RoleMaster"));
const AddEditRoleMaster = lazy(() =>
  import("../view/Role Master/AddEditRoleMaster")
);
const AddEditBankCmLocationMaster = lazy(() =>
  import("../view/BankCMLocationMaster/AddEditBankCmLocationMaster")
);
const BankCMLocationMaster = lazy(() =>
  import("../view/BankCMLocationMaster/BankCMLocationMaster")
);
const AddEditFormBankBranchMaster = lazy(() =>
  import("../view/BankBranchMaster/AddEditFormBankBranchMaster")
);
const BankBranchMaster = lazy(() =>
  import("../view/BankBranchMaster/BankBranchMaster")
);
const AddEditFormBankMaster = lazy(() =>
  import("../view/BankMaster/AddEditFormBankMaster")
);
const BankMaster = lazy(() => import("../view/BankMaster/BankMaster"));
const AddEditFormEarthQuackZoneTypeMaster = lazy(() =>
  import("../view/EarthquakeZoneTypeMaster/AddEditFormEarthQuackZoneTypeMaster")
);
const EarthquakeZoneTypeMaster = lazy(() =>
  import("../view/EarthquakeZoneTypeMaster/EarthquakeZoneTypeMaster")
);
const AddEditInsurancePolicy = lazy(() =>
  import("../view/InsurancePolicyMaster/AddEditInsurancePolicy")
);
const InsurancePolicyMaster = lazy(() =>
  import("../view/InsurancePolicyMaster/InsurancePolicyMaster")
);
const AddEditPricePullingMaster = lazy(() =>
  import("../view/CommodityPricePullingMaster/AddEditPricePullingMaster")
);
const CommodityPricePullingMaster = lazy(() =>
  import("../view/CommodityPricePullingMaster/CommodityPricePullingMaster")
);
const AddEditQualityMaster = lazy(() =>
  import("../view/QualityMaster/AddEditQualityMaster")
);
const QualityMaster = lazy(() => import("../view/QualityMaster/QualityMaster"));
const AddEditHsnMaster = lazy(() =>
  import("../view/HsnMaster/AddEditHsnMaster")
);
const HsnMaster = lazy(() => import("../view/HsnMaster/HsnMaster"));
const AddEditCommodityBagMaster = lazy(() =>
  import("../view/CommodityBagMaster/AddEditCommodityBagMaster")
);
const CommodityBagMaster = lazy(() =>
  import("../view/CommodityBagMaster/CommodityBagMaster")
);
const AddEditFormCommodityVariety = lazy(() =>
  import("../view/CommodityVarietyMaster/AddEditFormCommodityVariety")
);
const CommodityVariety = lazy(() =>
  import("../view/CommodityVarietyMaster/CommodityVariety")
);
const AddEditFormCommodityType = lazy(() =>
  import("../view/CommodityTypeMaster/AddEditFormCommodityType")
);
const CommodityType = lazy(() =>
  import("../view/CommodityTypeMaster/CommodityType")
);
const AddEditFormCommodityMaster = lazy(() =>
  import("../view/CommodityMaster/AddEditFormCommodityMaster")
);
const CommodityMaster = lazy(() =>
  import("../view/CommodityMaster/CommodityMaster")
);
const WarehouseAgreement = lazy(() =>
  import("../view/WareHouseMaster/WarehouseAgreement")
);
const OtherDetail = lazy(() => import("../view/WareHouseMaster/OtherDetail"));
const SupervisorAndSecurityGuardDetail = lazy(() =>
  import("../view/WareHouseMaster/SupervisorAndSecurityGuardDetail")
);
const FacilitiesAtWarehouse = lazy(() =>
  import("../view/warehouseInspection/FacilitiesAtWarehouse")
);
const WarehousesubDetail = lazy(() =>
  import("../view/WareHouseMaster/WarehousesubDetail")
);
const WareHouseMasterDetail = lazy(() =>
  import("../view/WareHouseMaster/WareHouseMasterDetail")
);
const WareHouseMaster = lazy(() =>
  import("../view/WareHouseMaster/WareHouseMaster")
);
const AddEditWareHouseOwnerMaster = lazy(() =>
  import("../view/WareHouseOwnerMaster/AddEditWareHouseOwnerMaster")
);
const WareHouseOwnerMaster = lazy(() =>
  import("../view/WareHouseOwnerMaster/WareHouseOwnerMaster")
);
const AddEditFormWareHouseTypeMaster = lazy(() =>
  import("../view/WarehouseTypeMaster/AddEditFormWareHouseTypeMaster")
);
const WarehouseTypeMaster = lazy(() =>
  import("../view/WarehouseTypeMaster/WarehouseTypeMaster")
);
const WareHouseSubType = lazy(() =>
  import("../view/WareHouseSubTypeMaster/WareHouseSubType")
);
const AddEditFormWareHouseSubTypeMaster = lazy(() =>
  import("../view/WareHouseSubTypeMaster/AddEditFormWareHouseSubTypeMaster")
);
const AddEditFormSecurityAgencyMaster = lazy(() =>
  import("../view/SecurityAgencyMaster/AddEditFormSecurityAgencyMaster")
);
const SecurityAgencyMaster = lazy(() =>
  import("../view/SecurityAgencyMaster/SecurityAgencyMaster")
);
const AddEditSecurityGuardMaster = lazy(() =>
  import("../view/SecurityGuardMaster/AddEditSecurityGuardMaster")
);
const SecurityGuardTransfer = lazy(() =>
  import("../view/SecurityGuardTransfer/SecurityGuardTransfer")
);
const SecurityGuardMaster = lazy(() =>
  import("../view/SecurityGuardMaster/SecurityGuardMaster")
);
const WareHouseClientMaster = lazy(() =>
  import("../view/WareHouseClientMaster/WareHouseClientMaster")
);
const AddEditWareHouseClientMaster = lazy(() =>
  import("../view/WareHouseClientMaster/AddEditWareHouseClientMaster")
);

// const allMasterRoutes = [
//   // ?? manage location all  routes`
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION_KEY}`,
//     children: [
//       // zone master get add update start`
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.SUB_STATE}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Sub State Master"}>
//                 <ZoneMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.SUB_STATE_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Sub State Master"}>
//                 <AddEditZoneMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.SUB_STATE_EDIT}/:id`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Sub State Master"}>
//                 <AddEditZoneMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.REGION_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Region Master"}>
//                 <AddEditFormRegionMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.REGION_EDIT}/:id`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Region Master"}>
//                 <AddEditFormRegionMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.STATE_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"State Master"}>
//                 <AddEditFormStateMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.STATE_EDIT}/:id`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"State Master"}>
//                 <AddEditFormStateMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       //  state-master get add update end
//       // {
//       //   path: "state-master",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout variant={headerType} title={"State Master"}>
//       //           <StateMaster />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//       //  state-master get add update end
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.DISTRICT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"District Master"}>
//                 <DistrictMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.DISTRICT_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"District Master"}>
//                 <AddEditFormDistrictMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.DISTRICT_EDIT}/:id`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"District Master"}>
//                 <AddEditFormDistrictMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       // {
//       //   path: "area-master",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout variant={headerType} title={"Area Master"}>
//       //           <AreaMaster />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.AREA}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Area Master"}>
//                 <AreaMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.AREA_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Area Master"}>
//                 <AddEditFormArea />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.AREA_EDIT}/:id`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Area Master"}>
//                 <AddEditFormArea />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//     ],
//   },

//   // ?? manage user all routes
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS_KEY}`,
//     children: [
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.USER}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"User Master"}>
//                 <UserMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.USER_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"User Master"}>
//                 <AddEditFormUserMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.USER_EDIT}/:id`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"User master"}>
//                 <AddEditFormUserMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.SUPERVISOR_HIRING}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Supervisor Hiring Master"}>
//                 <SupervisorHiringMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.SUPERVISOR_HIRING_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Supervisor Hiring Master "}>
//                 <AddEditSupervisorHiringMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.SUPERVISOR_HIRING_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Supervisor Hiring Master"}>
//                 <AddEditSupervisorHiringMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       // ! unused route ..
//       // {
//       //   path: "page-master",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout variant={headerType} title={"Module Master"}>
//       //           <PageMaster />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//       // {
//       //   path: "edit/page-master/:id",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout variant={headerType} title={"Module Master"}>
//       //           <AddEditPageMaster />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//       // {
//       //   path: "add/page-master/",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout variant={headerType} title={"Module Master"}>
//       //           <AddEditPageMaster />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.ROLE}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Role Master"}>
//                 <RoleMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.ROLE_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Role Master"}>
//                 <AddEditRoleMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.ROLE_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Role Master"}>
//                 <AddEditRoleMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       // ! unused sed routes
//       // {
//       //   path: "role-page-assignment-master",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout
//       //           variant={headerType}
//       //           title={"Role Page Assignment Master"}
//       //         >
//       //           <RolePageAssignmentMaster />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//     ],
//   },
//   // ?? manage banks all routes ..
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS_KEY}`,
//     children: [
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BANK}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Bank Master"}>
//                 <BankMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BANK_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Bank Master"}>
//                 <AddEditFormBankMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BANK_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Bank master"}>
//                 <AddEditFormBankMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BRANCH}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Bank Branch Master"}>
//                 <BankBranchMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BRANCH_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Bank Branch Master"}>
//                 <AddEditFormBankBranchMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BRANCH_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Bank Branch Master"}>
//                 <AddEditFormBankBranchMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       // bank-cm-location Routes start
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.CM_LOCATION}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Bank CM Location Master"}>
//                 <BankCMLocationMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.CM_LOCATION_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Bank CM Location Master"}>
//                 <AddEditBankCmLocationMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.CM_LOCATION_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Bank CM Location Master"}>
//                 <AddEditBankCmLocationMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       //Bank cm location Routes End
//     ],
//   },
//   // ?? manage insurance ..
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE_KEY}`,
//     children: [
//       // insurance company master get add update start
//       // ?? insurance policy ..
//       // {
//       //   path: "insurance-company-master",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout variant={headerType} title={"Insurance Company Master"}>
//       //           <InsuranceCompanyMaster />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//       // {
//       //   path: "add/insurance-company-master",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout variant={headerType} title={"Insurance Company Master"}>
//       //           <AddEditFormInsuranceCompanyMaster />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//       // {
//       //   path: "edit/insurance-company-master/:id",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout variant={headerType} title={"Insurance Company Master"}>
//       //           <AddEditFormInsuranceCompanyMaster />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.INSURANCE_POLICY}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Insurance Policy Master"}>
//                 <InsurancePolicyMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.INSURANCE_POLICY_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Insurance Policy Master"}>
//                 <AddEditInsurancePolicy />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.INSURANCE_POLICY_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Insurance Policy Master"}>
//                 <AddEditInsurancePolicy />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.EARTHQUAKE_ZONE}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout
//                 variant={headerType}
//                 title={"Earthquake Zone Type Master"}
//               >
//                 <EarthquakeZoneTypeMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.EARTHQUAKE_ZONE_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout
//                 variant={headerType}
//                 title={"Earthquake Zone Type Master"}
//               >
//                 <AddEditFormEarthQuackZoneTypeMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.EARTHQUAKE_ZONE_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout
//                 variant={headerType}
//                 title={"Earthquake Zone Type Master"}
//               >
//                 <AddEditFormEarthQuackZoneTypeMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//     ],
//   },

//   // ?? manage commodity all routes ..
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY_KEY}`,
//     children: [
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_MASTER}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity master"}>
//                 <CommodityMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_MASTER_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity master"}>
//                 <AddEditFormCommodityMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_MASTER_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity master"}>
//                 <AddEditFormCommodityMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_TYPE}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity Type Master"}>
//                 <CommodityType />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_TYPE_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity Type Master"}>
//                 <AddEditFormCommodityType />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_TYPE_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity Type Master"}>
//                 <AddEditFormCommodityType />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       // ! unused commidity grade ...
//       // {
//       //   path: "commodity-grade",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout variant={headerType} title={"Commodity Grade Master"}>
//       //           <CommodityGrade />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//       // {
//       //   path: "add/commodity-grade",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout variant={headerType} title={"Commodity Grade Master"}>
//       //           <AddEditFormCommodityGrade />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//       // {
//       //   path: "edit/commodity-grade/:id",
//       //   element: (
//       //     <ProtectedRoutes>
//       //       <Suspense fallback={<div>Loading...</div>}>
//       //         <Layout variant={headerType} title={"Commodity Grade Master"}>
//       //           <AddEditFormCommodityGrade />
//       //         </Layout>
//       //       </Suspense>
//       //     </ProtectedRoutes>
//       //   ),
//       // },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_VARIETY}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity variety master"}>
//                 <CommodityVariety />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_VARIETY_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity variety master"}>
//                 <AddEditFormCommodityVariety />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_VARIETY_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity variety master"}>
//                 <AddEditFormCommodityVariety />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_BAG}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity Bag Master"}>
//                 <CommodityBagMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_BAG_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity Bag master"}>
//                 <AddEditCommodityBagMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_BAG_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Commodity Bag master"}>
//                 <AddEditCommodityBagMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.HSN}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"HSN Master"}>
//                 <HsnMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.HSN_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"HSN Master"}>
//                 <AddEditHsnMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.HSN_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"HSN Master"}>
//                 <AddEditHsnMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       // This is for the Quality master routes start
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.QUALITY_PARAMETER}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Quality Parameter Master"}>
//                 <QualityMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.QUALITY_PARAMETER_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Quality Parameter Master"}>
//                 <AddEditQualityMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.QUALITY_PARAMETER_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Quality Parameter Master"}>
//                 <AddEditQualityMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       // The Quality master routes end

//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.PRICE_PULLING}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout
//                 variant={headerType}
//                 title={"Commodity Price Pulling Master"}
//               >
//                 <CommodityPricePullingMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.PRICE_PULLING_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout
//                 variant={headerType}
//                 title={"Commodity Price Pulling Master"}
//               >
//                 <AddEditPricePullingMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.PRICE_PULLING_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout
//                 variant={headerType}
//                 title={"Commodity Price Pulling Master"}
//               >
//                 <AddEditPricePullingMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//     ],
//   },
//   // ?? manage warehouse

//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE_KEY}`,
//     children: [
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_SUB_TYPE}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse sub type master"}>
//                 <WareHouseSubType />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_SUB_TYPE_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse sub type Master"}>
//                 <AddEditFormWareHouseSubTypeMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_SUB_TYPE_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse sub type Master"}>
//                 <AddEditFormWareHouseSubTypeMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_TYPE}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Type Master"}>
//                 <WarehouseTypeMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_TYPE_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Type Master"}>
//                 <AddEditFormWareHouseTypeMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_TYPE_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Type Master"}>
//                 <AddEditFormWareHouseTypeMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_OWNER}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Owner Master"}>
//                 <WareHouseOwnerMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_OWNER_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Owner Master"}>
//                 <AddEditWareHouseOwnerMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_OWNER_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Owner Master"}>
//                 <AddEditWareHouseOwnerMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Master"}>
//                 <WareHouseMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_VIEW}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Details"}>
//                 <WareHouseMasterDetail />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_DETAILS}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Master"}>
//                 <WarehousesubDetail />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_FACILITIES}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Master"}>
//                 <FacilitiesAtWarehouse />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_FACILITIES}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Master"}>
//                 <SupervisorAndSecurityGuardDetail />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_OTHER_DETAILS}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Master"}>
//                 <OtherDetail />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },

//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_MASTER_AGREEMENT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout
//                 variant={headerType}
//                 title={"Warehouse Agreement Details"}
//               >
//                 <WarehouseAgreement />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//     ],
//   },
//   // ?? manage client all routes
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_CLIENT_KEY}`,
//     children: [
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_CLIENT.WAREHOUSE_CLIENT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Client Master"}>
//                 <WareHouseClientMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_CLIENT.WAREHOUSE_CLIENT_ADD}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Client Master"}>
//                 <AddEditWareHouseClientMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//       {
//         path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_CLIENT.WAREHOUSE_CLIENT_EDIT}`,
//         element: (
//           <ProtectedRoutes>
//             <Suspense fallback={<div>Loading...</div>}>
//               <Layout variant={headerType} title={"Warehouse Client Master"}>
//                 <AddEditWareHouseClientMaster />
//               </Layout>
//             </Suspense>
//           </ProtectedRoutes>
//         ),
//       },
//     ],
//   },
//   //   {
//   //     path: "/manage-client",
//   //     children: [
//   //       {
//   //         path: "client-master",
//   //         element: (
//   //           <ProtectedRoutes>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <Layout variant={headerType} title={"Client-master"}>
//   //                 <ClientMaster />
//   //               </Layout>
//   //             </Suspense>
//   //           </ProtectedRoutes>
//   //         ),
//   //       },
//   //       {
//   //         path: "add/client-master",
//   //         element: (
//   //           <ProtectedRoutes>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <Layout variant={headerType} title={"Client-master"}>
//   //                 <AddEditClientMaster />
//   //               </Layout>
//   //             </Suspense>
//   //           </ProtectedRoutes>
//   //         ),
//   //       },
//   //       {
//   //         path: "edit/client-master/:id",
//   //         element: (
//   //           <ProtectedRoutes>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <Layout variant={headerType} title={"Client-master"}>
//   //                 <AddEditClientMaster />
//   //               </Layout>
//   //             </Suspense>
//   //           </ProtectedRoutes>
//   //         ),
//   //       },

//   //       {
//   //         path: "client-gst-master",
//   //         element: (
//   //           <ProtectedRoutes>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <Layout variant={headerType} title={"Client GST Master"}>
//   //                 <ClientGstMaster />
//   //               </Layout>
//   //             </Suspense>
//   //           </ProtectedRoutes>
//   //         ),
//   //       },
//   //       {
//   //         path: "add/client-gst-master",
//   //         element: (
//   //           <ProtectedRoutes>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <Layout variant={headerType} title={"Client GST Master"}>
//   //                 <AddEditClientGstMaster />
//   //               </Layout>
//   //             </Suspense>
//   //           </ProtectedRoutes>
//   //         ),
//   //       },
//   //       {
//   //         path: "edit/client-gst-master/:id",
//   //         element: (
//   //           <ProtectedRoutes>
//   //             <Suspense fallback={<div>Loading...</div>}>
//   //               <Layout variant={headerType} title={"Client GST Master"}>
//   //                 <AddEditClientGstMaster />
//   //               </Layout>
//   //             </Suspense>
//   //           </ProtectedRoutes>
//   //         ),
//   //       },
//   //     ],
//   //   },

//   // ?? manage vendor ...
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_VENDORS_KEY}/${ROUTE_PATH.ALL_MASTERS.MANAGE_VENDORS.SECURITY_AGENCY_MASTER}`,
//     element: (
//       <ProtectedRoutes>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Layout variant={headerType} title={"Security Agency Master"}>
//             <SecurityAgencyMaster />
//           </Layout>
//         </Suspense>
//       </ProtectedRoutes>
//     ),
//   },
//   // ?? FOR THE BACKUP

//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_VENDORS.SECURITY_AGENCY_MASTER_EDIT}`,
//     //   path: "security-agency-master/edit/security-agency-master/:id",
//     element: (
//       <ProtectedRoutes>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Layout variant={headerType} title={"Security Agency Master"}>
//             <AddEditFormSecurityAgencyMaster />
//           </Layout>
//         </Suspense>
//       </ProtectedRoutes>
//     ),
//   },
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_VENDORS.SECURITY_AGENCY_MASTER_ADD}`,
//     // path: "security-agency-master/add/security-agency-master/",
//     element: (
//       <ProtectedRoutes>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Layout variant={headerType} title={"Security Agency Master"}>
//             <AddEditFormSecurityAgencyMaster />
//           </Layout>
//         </Suspense>
//       </ProtectedRoutes>
//     ),
//   },

//   //  ?? manage security guard ..
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD_KEY}/${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD.SECURITY_GUARD}`,
//     element: (
//       <ProtectedRoutes>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Layout variant={headerType} title={"Security Guard Master"}>
//             <SecurityGuardMaster />
//           </Layout>
//         </Suspense>
//       </ProtectedRoutes>
//     ),
//   },
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD.SECURITY_GUARD_EDIT}`,
//     // path: "security-guard-master/edit/security-guard-master/:id",
//     element: (
//       <ProtectedRoutes>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Layout variant={headerType} title={"Security Guard Master"}>
//             <AddEditSecurityGuardMaster />
//           </Layout>
//         </Suspense>
//       </ProtectedRoutes>
//     ),
//   },
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD.SECURITY_GUARD_ADD}`,
//     element: (
//       <ProtectedRoutes>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Layout variant={headerType} title={"Security Guard Master"}>
//             <AddEditSecurityGuardMaster />
//           </Layout>
//         </Suspense>
//       </ProtectedRoutes>
//     ),
//   },
//   {
//     path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD_KEY}/${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD.SECURITY_TRANSFER}`,
//     element: (
//       <ProtectedRoutes>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Layout variant={headerType} title={"Security Guard Transfer"}>
//             <SecurityGuardTransfer />
//           </Layout>
//         </Suspense>
//       </ProtectedRoutes>
//     ),
//   },
// ];
// path:`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_REGION}/:id`, // ! for edit route

const allMasterRoutes = [
  // Manage Locations Routes Starts
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.REGION}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_REGION}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Region Master"}>
            <RegionMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.REGION_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_REGION_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Region Master"}>
            <AddEditFormRegionMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.REGION_EDIT}/:id`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_REGION_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Region Master"}>
            <AddEditFormRegionMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // zone master get add update start`
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.SUB_STATE}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_SUB_STATE}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Sub State Master"}>
            <ZoneMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.SUB_STATE_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_SUB_STATE_ADD}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Sub State Master"}>
            <AddEditZoneMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.SUB_STATE_EDIT}/:id`,

    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_SUB_STATE_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Sub State Master"}>
            <AddEditZoneMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.SUB_STATE}`,
    // path:`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_SUB_STATE}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_STATE}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"State Master"}>
            <StateMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.STATE_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_STATE_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"State Master"}>
            <AddEditFormStateMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.STATE_EDIT}/:id`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_STATE_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"State Master"}>
            <AddEditFormStateMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.DISTRICT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_DISTRICT}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"District Master"}>
            <DistrictMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.DISTRICT_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_DISTRICT_ADD}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"District Master"}>
            <AddEditFormDistrictMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.DISTRICT_EDIT}/:id`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_DISTRICT_EDIT}/:id`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"District Master"}>
            <AddEditFormDistrictMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.AREA}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_AREA}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Area Master"}>
            <AreaMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.AREA_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_AREA_ADD}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Area Master"}>
            <AddEditFormArea />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_AREA_EDIT}/:id`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Area Master"}>
            <AddEditFormArea />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // Manage Users routes Start
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.USER}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_USER}`,

    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"User Master"}>
            <UserMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.USER_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_USER_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"User Master"}>
            <AddEditFormUserMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.USER_EDIT}/:id`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_USER_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"User master"}>
            <AddEditFormUserMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.SUPERVISOR_HIRING}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_SUPERVISOR_HIRING}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Supervisor Hiring Master"}>
            <SupervisorHiringMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.SUPERVISOR_HIRING_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_SUPERVISOR_HIRING_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Supervisor Hiring Master "}>
            <AddEditSupervisorHiringMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.SUPERVISOR_HIRING_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_SUPERVISOR_HIRING_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Supervisor Hiring Master"}>
            <AddEditSupervisorHiringMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.ROLE}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_ROLE}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Role Master"}>
            <RoleMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.ROLE_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_ROLE_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Role Master"}>
            <AddEditRoleMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_USERS.ROLE_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_ROLE_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Role Master"}>
            <AddEditRoleMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // Manage Banks Routes Start

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BANK}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Bank Master"}>
            <BankMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BANK_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Bank Master"}>
            <AddEditFormBankMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BANK_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Bank master"}>
            <AddEditFormBankMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BRANCH}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK_BRANCH}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Bank Branch Master"}>
            <BankBranchMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BRANCH_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK_BRANCH_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Bank Branch Master"}>
            <AddEditFormBankBranchMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.BRANCH_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK_BRANCH_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Bank Branch Master"}>
            <AddEditFormBankBranchMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  // bank-cm-location Routes start
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.CM_LOCATION}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_CM_LOCATION}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Bank CM Location Master"}>
            <BankCMLocationMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.CM_LOCATION_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_CM_LOCATION_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Bank CM Location Master"}>
            <AddEditBankCmLocationMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_BANKS.CM_LOCATION_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_CM_LOCATION_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Bank CM Location Master"}>
            <AddEditBankCmLocationMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // Managa Insurace Routes Start

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.INSURANCE_POLICY}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_INSURANCE_POLICY}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Insurance Policy Master"}>
            <InsurancePolicyMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.INSURANCE_POLICY_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_INSURANCE_POLICY_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Insurance Policy Master"}>
            <AddEditInsurancePolicy />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.INSURANCE_POLICY_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_INSURANCE_POLICY_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Insurance Policy Master"}>
            <AddEditInsurancePolicy />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.EARTHQUAKE_ZONE}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_EARTHQUACK_ZONE}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Earthquake Zone Type Master"}>
            <EarthquakeZoneTypeMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.EARTHQUAKE_ZONE_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_EARTHQUACK_ZONE_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Earthquake Zone Type Master"}>
            <AddEditFormEarthQuackZoneTypeMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_INSURANCE.EARTHQUAKE_ZONE_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_EARTHQUACK_ZONE_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Earthquake Zone Type Master"}>
            <AddEditFormEarthQuackZoneTypeMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // Manage Commodity Routes Start

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_MASTER}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity master"}>
            <CommodityMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_MASTER_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity master"}>
            <AddEditFormCommodityMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_MASTER_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity master"}>
            <AddEditFormCommodityMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_TYPE}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_TYPE}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Type Master"}>
            <CommodityType />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_TYPE_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_TYPE_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Type Master"}>
            <AddEditFormCommodityType />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_TYPE_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_TYPE_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Type Master"}>
            <AddEditFormCommodityType />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_VARIETY}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_VARIETY}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity variety master"}>
            <CommodityVariety />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_VARIETY_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_VARIETY_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity variety master"}>
            <AddEditFormCommodityVariety />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_VARIETY_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_VARITY_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity variety master"}>
            <AddEditFormCommodityVariety />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_BAG}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_BAG}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Bag Master"}>
            <CommodityBagMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_BAG_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_BAG_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Bag master"}>
            <AddEditCommodityBagMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.COMMODITY_BAG_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_BAG_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Bag master"}>
            <AddEditCommodityBagMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.HSN}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_HSN}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"HSN Master"}>
            <HsnMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.HSN_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_HSN_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"HSN Master"}>
            <AddEditHsnMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.HSN_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_HSN_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"HSN Master"}>
            <AddEditHsnMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // This is for the Quality master routes start
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.QUALITY_PARAMETER}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_QUALTY_PARAMETER}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Quality Parameter Master"}>
            <QualityMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.QUALITY_PARAMETER_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_QUALITY_PARAMETER_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Quality Parameter Master"}>
            <AddEditQualityMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.QUALITY_PARAMETER_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_QUALITY_PARAMETER_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Quality Parameter Master"}>
            <AddEditQualityMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  // The Quality master routes end

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.PRICE_PULLING}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Price Pulling Master"}>
            <CommodityPricePullingMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.PRICE_PULLING_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Price Pulling Master"}>
            <AddEditPricePullingMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_COMMODITY.PRICE_PULLING_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Commodity Price Pulling Master"}>
            <AddEditPricePullingMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // Manage Warehouse Routes Start

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_SUB_TYPE}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse sub type master"}>
            <WareHouseSubType />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_SUB_TYPE_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse sub type Master"}>
            <AddEditFormWareHouseSubTypeMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_SUB_TYPE_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse sub type Master"}>
            <AddEditFormWareHouseSubTypeMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_TYPE}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_TYPE}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Type Master"}>
            <WarehouseTypeMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_TYPE_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_TYPE_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Type Master"}>
            <AddEditFormWareHouseTypeMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_TYPE_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_TYPE_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Type Master"}>
            <AddEditFormWareHouseTypeMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_OWNER}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_OWNER}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Owner Master"}>
            <WareHouseOwnerMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_OWNER_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_OWNER_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Owner Master"}>
            <AddEditWareHouseOwnerMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_OWNER_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_OWNER_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Owner Master"}>
            <AddEditWareHouseOwnerMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Master"}>
            <WareHouseMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_VIEW}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_VIEW}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Details"}>
            <WareHouseMasterDetail />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_DETAILS}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_DETAILS}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Master"}>
            <WarehousesubDetail />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_FACILITIES}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_FACILITIES}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Master"}>
            <FacilitiesAtWarehouse />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_FACILITIES}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUPERVISOR}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Master"}>
            <SupervisorAndSecurityGuardDetail />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_OTHER_DETAILS}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_OTHER_DETAILS}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Master"}>
            <OtherDetail />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_WAREHOUSE.WAREHOUSE_MASTER_AGREEMENT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_MASTER_AGREEMENT}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Agreement Details"}>
            <WarehouseAgreement />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // Manage Client Routes Start

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_CLIENT.WAREHOUSE_CLIENT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Client Master"}>
            <WareHouseClientMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_CLIENT.WAREHOUSE_CLIENT_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Client Master"}>
            <AddEditWareHouseClientMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_CLIENT.WAREHOUSE_CLIENT_EDIT}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Warehouse Client Master"}>
            <AddEditWareHouseClientMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // Manage Vendors Routes Start

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_VENDORS_KEY}/${ROUTE_PATH.ALL_MASTERS.MANAGE_VENDORS.SECURITY_AGENCY_MASTER}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_VENDORS_SECURITY_AGENCY}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Security Agency Master"}>
            <SecurityAgencyMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_VENDORS.SECURITY_AGENCY_MASTER_EDIT}`,
    //   path: "security-agency-master/edit/security-agency-master/:id",
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_VENDORS_SECURITY_AGENCY_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Security Agency Master"}>
            <AddEditFormSecurityAgencyMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_VENDORS.SECURITY_AGENCY_MASTER_ADD}`,
    // path: "security-agency-master/add/security-agency-master/",
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_VENDORS_SECURITY_AGENCY_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Security Agency Master"}>
            <AddEditFormSecurityAgencyMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },

  // Manage Security Guard Routes Start

  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD_KEY}/${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD.SECURITY_GUARD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_GUARD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Security Guard Master"}>
            <SecurityGuardMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD.SECURITY_GUARD_EDIT}`,
    // path: "security-guard-master/edit/security-guard-master/:id",
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_GUARD_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Security Guard Master"}>
            <AddEditSecurityGuardMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD.SECURITY_GUARD_ADD}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_GUARD_ADD}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Security Guard Master"}>
            <AddEditSecurityGuardMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD_KEY}/${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD.SECURITY_TRANSFER}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_TRANSFER}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Security Guard Transfer"}>
            <SecurityGuardTransfer />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD_KEY}/${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD.SECURITY_TRANSFER}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_TRANSFER_LIST}`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Security Guard Transfer"}>
            <TransferMaster />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
  {
    // path: `${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD_KEY}/${ROUTE_PATH.ALL_MASTERS.MANAGE_SECURITY_GUARD.SECURITY_TRANSFER}`,
    path: `${ROUTE_PATH.ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_TRANSFER_EDIT}/:id`,
    element: (
      <ProtectedRoutes>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout variant={headerType} title={"Security Guard Transfer"}>
          <SecurityGuardTransfer />
          </Layout>
        </Suspense>
      </ProtectedRoutes>
    ),
  },
];

export default allMasterRoutes;
