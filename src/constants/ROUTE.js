// export const ROUTE_PATH = {
// DASHBOARD: "dashboard",
// DASHBOARD: "",

// CHANGE_CURRENT_PASSWORD: "change-current-password",
// SUPERSET_DASHBOARD_ID: "superset-dashboard/:id",
// TESTING: "testing",
// ALL_MASTERS: {
//   SUB_KEY: "all-master",
//   MANAGE_LOCATION_KEY: "manage-location",
//   MANAGE_USERS_KEY: "manage-user",
//   MANAGE_BANKS_KEY: "manage-bank",
//   MANAGE_INSURANCE_KEY: "manage-insurance",
//   MANAGE_COMMODITY_KEY: "manage-commodity",
//   MANAGE_WAREHOUSE_KEY: "manage-warehouse",
//   MANAGE_CLIENT_KEY: "manage-client",
//   MANAGE_VENDORS_KEY: "manage-vendor",
//   MANAGE_SECURITY_GUARD_KEY: "manage-security-guard",
//   MANAGE_SERVICE_CONTRACT_KEY: "manage-service-contract",
//   MANAGE_GATE_PASS_KEY: "manage-gate-pass",

//   MANAGE_LOCATION: {
//     REGION: "region-master",
//     REGION_ADD: "add/region-master",
//     REGION_EDIT: "edit/region-master",
//     STATE: "state-master",
//     STATE_ADD: "add/state-master",
//     STATE_EDIT: "edit/state-master",
//     SUB_STATE: "sub-state-master",
//     SUB_STATE_ADD: "add/sub-state-master",
//     SUB_STATE_EDIT: "edit/sub-state-master",
//     DISTRICT: "district-master",
//     DISTRICT_ADD: "add/district-master",
//     DISTRICT_EDIT: "edit/district-master",
//     AREA: "area-master",
//     AREA_ADD: "add/area-master",
//     AREA_EDIT: "edit/area-master",
//   },
//   MANAGE_USERS: {
//     USER: "user-master",
//     USER_ADD: "add/user-master",
//     USER_EDIT: "edit/user-master/:id",
//     SUPERVISOR_HIRING: "supervisor-hiring-master",
//     SUPERVISOR_HIRING_ADD: "add/supervisor-hiring-master",
//     SUPERVISOR_HIRING_EDIT: "edit/supervisor-hiring-master/:id",
//     ROLE: "role-master",
//     ROLE_ADD: "add/role-master",
//     ROLE_EDIT: "edit/role-master/:id",
//   },
//   MANAGE_BANKS: {
//     BANK: "bank-master",
//     BANK_ADD: "add/bank-master",
//     BANK_EDIT: "edit/bank-master/:id",
//     BRANCH: "bank-branch-master",
//     BRANCH_ADD: "add/bank-branch-master",
//     BRANCH_EDIT: "edit/bank-branch-master/:id",
//     CM_LOCATION: "bank-cm-location-master",
//     CM_LOCATION_ADD: "add/bank-cm-location-master",
//     CM_LOCATION_EDIT: "edit/bank-cm-location-master/:id",
//   },
//   MANAGE_INSURANCE: {
//     INSURANCE_POLICY: "insurance-policy-master",
//     INSURANCE_POLICY_ADD: "add/insurance-policy-master",
//     INSURANCE_POLICY_EDIT: "edit/insurance-policy-master/:id",
//     EARTHQUAKE_ZONE: "earthquake-zone-type-master",
//     EARTHQUAKE_ZONE_ADD: "add/earthquake-zone-type-master",
//     EARTHQUAKE_ZONE_EDIT: "edit/earthquake-zone-type-master/:id",
//   },
//   MANAGE_COMMODITY: {
//     COMMODITY_TYPE: "commodity-type",
//     COMMODITY_TYPE_ADD: "add/commodity-type",
//     COMMODITY_TYPE_EDIT: "edit/commodity-type/:id",
//     COMMODITY_MASTER: "commodity-master",
//     COMMODITY_MASTER_ADD: "add/commodity-master",
//     COMMODITY_MASTER_EDIT: "edit/commodity-master/:id",
//     COMMODITY_VARIETY: "commodity-variety",
//     COMMODITY_VARIETY_ADD: "add/commodity-variety",
//     COMMODITY_VARIETY_EDIT: "edit/commodity-variety/:id",
//     COMMODITY_BAG: "commodity-bag-master",
//     COMMODITY_BAG_ADD: "add/commodity-bag-master",
//     COMMODITY_BAG_EDIT: "edit/commodity-bag-master/:id",
//     HSN: "hsn-master",
//     HSN_ADD: "add/hsn-master",
//     HSN_EDIT: "edit/hsn-master/:id",
//     PRICE_PULLING: "price-pulling-master",
//     PRICE_PULLING_ADD: "add/price-pulling-master",
//     PRICE_PULLING_EDIT: "edit/price-pulling-master/:id",
//     QUALITY_PARAMETER: "quality-parameter-master",
//     QUALITY_PARAMETER_ADD: "add/quality-parameter-master",
//     QUALITY_PARAMETER_EDIT: "edit/quality-parameter-master/:id",
//   },
//   MANAGE_WAREHOUSE: {
//     WAREHOUSE_TYPE: "warehouse-type-master",
//     WAREHOUSE_TYPE_ADD: "add/warehouse-type-master",
//     WAREHOUSE_TYPE_EDIT: "edit/warehouse-type-master/:id",
//     WAREHOUSE_SUB_TYPE: "warehouse-sub-type-master",
//     WAREHOUSE_SUB_TYPE_ADD: "add/warehouse-sub-type-master",
//     WAREHOUSE_SUB_TYPE_EDIT: "edit/warehouse-sub-type-master/:id",
//     WAREHOUSE: "warehouse-master",
//     WAREHOUSE_DETAILS: "warehouse-master-details",
//     WAREHOUSE_FACILITIES: "warehouse-master-facilitiesatwarehouse",
//     WAREHOUSE_SUPERVISOR: "warehouse-master-supervisorandsecurityguard",
//     WAREHOUSE_OTHER_DETAILS: "warehouse-master-otherdetails",
//     WAREHOUSE_MASTER_AGREEMENT: "warehouse-master-agreement",
//     WAREHOUSE_VIEW: "view/warehouse-master-details/:id",
//     WAREHOUSE_ADD: "add/warehouse-master",
//     WAREHOUSE_EDIT: "edit/warehouse-master/:id",
//     WAREHOUSE_OWNER: "warehouse-owner-master",
//     WAREHOUSE_OWNER_ADD: "add/warehouse-owner-master",
//     WAREHOUSE_OWNER_EDIT: "edit/warehouse-owner-master/:id",
//   },
//   MANAGE_CLIENT: {
//     WAREHOUSE_CLIENT: "warehouse-client-master",
//     WAREHOUSE_CLIENT_ADD: "add/warehouse-client-master",
//     WAREHOUSE_CLIENT_EDIT: "edit/warehouse-client-master/:id",
//   },
//   MANAGE_VENDORS: {
//     SECURITY_AGENCY_MASTER: "security-agency-master",
//     SECURITY_AGENCY_MASTER_ADD: "add/security-agency-master",
//     SECURITY_AGENCY_MASTER_EDIT: "edit/security-agency-master/:id",
//   },
//   MANAGE_SECURITY_GUARD: {
//     SECURITY_GUARD: "security-guard-master",
//     SECURITY_GUARD_ADD: "add/security-guard-master",
//     SECURITY_GUARD_EDIT: "edit/security-guard-master/:id",
//     SECURITY_TRANSFER: "security-guard-transfer",
//     SECURITY_TRANSFER_ADD: "add/security-guard-transfer",
//     SECURITY_TRANSFER_EDIT: "edit/security-guard-transfer/:id",
//   },
// },
// WAREHOUSE_PROPOSAL: "hiring-proposal-master",
// WAREHOUSE_PROPOSAL_ADD: "add/hiring-proposal-master",
// WAREHOUSE_PROPOSAL_EDIT: "edit/hiring-proposal-master/:id",
// WAREHOUSE_INSPECTION_MASTER: "inspection-master",
// WAREHOUSE_INSPECTION_MASTER_ADD: "add/inspection-master",
// WAREHOUSE_INSPECTION_MASTER_EDIT: "edit/inspection-master/:id",
// WAREHOUSE_INSPECTION: "warehouse-inspection",
// WAREHOUSE_RE_INSPECTION_MASTER: "re-inspection-master",
// WAREHOUSE_RE_INSPECTION_ADD: "add/re-inspection-master",
// WAREHOUSE_RE_INSPECTION_EDIT: "edit/re-inspection-master/:id",
// SERVICE_CONTRACT: {
//   SUB_KEY: "service-contract",
//   SERVICE_CONTRACT_PWH: "pwh",
//   SERVICE_CONTRACT_PWH_ADD: "add/pwh",
//   SERVICE_CONTRACT_PWH_EDIT: "edit/pwh/:id",
//   SERVICE_CONTRACT_WMS: "wms",
//   SERVICE_CONTRACT_WMS_ADD: "add/wms",
//   SERVICE_CONTRACT_WMS_EDIT: "edit/wms/:id",
// },
// GATE_PASS: {
//   SUB_KEY: "gate-pass",
//   GATE_PASS_INWARD: "inward",
//   GATE_PASS_INWARD_ADD: "add/inward",
//   GATE_PASS_INWARD_EDIT: "edit/inward/:id",
//   GATE_PASS_OUTWARD: "outward",
//   GATE_PASS_OUTWARD_ADD: "add/outward",
//   GATE_PASS_OUTWARD_EDIT: "edit/outward/:id",
// },
// COMMODITY_INWARD_REPORT: "commodity-inward-report",
// COMMODITY_INWARD_REPORT_ADD: "add/commodity-inward-report",
// COMMODITY_INWARD_REPORT_EDIT: "edit/commodity-inward-report/:id",
// COMMODITY_OUTWARD_REPORT: "commodity-outward-report",
// COMMODITY_OUTWARD_REPORT_ADD: "add/commodity-outward-report",
// COMMODITY_OUTWARD_REPORT_EDIT: "edit/commodity-outward-report/:id",
// QUALITY_CONTROL_REPORT: "quality-control-report",
// QUALITY_CONTROL_REPORT_ADD: "add/quality-control-report",
// QUALITY_CONTROL_REPORT_EDIT: "edit/quality-control-report/:id",
// DELIVERY_ORDER: "delivery-order",
// DELIVERY_ORDER_ADD: "add/delivery-order",
// DELIVERY_ORDER_EDIT: "edit/delivery-order/:id",
// SETTING: "setting",
// LOGIN: "login",
// NOT_FOUND: "*",
// FORGOT_PASSWORD: "forgot-password",
// CHANGE_PASSWORD: "change-password",-inspection",
// WAREHOUSE_RE_INSPECTION_MASTER: "re-inspection-master",
// WAREHOUSE_RE_INSPECTION_ADD: "add/re-inspection-master",
// WAREHOUSE_RE_INSPECTION_EDIT: "edit/re-inspection-master/:id",
// SERVICE_CONTRACT: {
//   SUB_KEY: "service-contract",
//   SERVICE_CONTRACT_PWH: "pwh",
//   SERVICE_CONTRACT_PWH_ADD: "add/pwh",
//   SERVICE_CONTRACT_PWH_EDIT: "edit/pwh/:id",
//   SERVICE_CONTRACT_WMS: "wms",
//   SERVICE_CONTRACT_WMS_ADD: "add/wms",
//   SERVICE_CONTRACT_WMS_EDIT: "edit/wms/:id",
// },
// GATE_PASS: {
//   SUB_KEY: "gate-pass",
//   GATE_PASS_INWARD: "inward",
//   GATE_PASS_INWARD_ADD: "add/inward",
//   GATE_PASS_INWARD_EDIT: "edit/inward/:id",
//   GATE_PASS_OUTWARD: "outward",
//   GATE_PASS_OUTWARD_ADD: "add/outward",
//   GATE_PASS_OUTWARD_EDIT: "edit/outward/:id",
// },
// COMMODITY_INWARD_REPORT: "commodity-inward-report",
// COMMODITY_INWARD_REPORT_ADD: "add/commodity-inward-report",
// COMMODITY_INWARD_REPORT_EDIT: "edit/commodity-inward-report/:id",
// COMMODITY_OUTWARD_REPORT: "commodity-outward-report",
// COMMODITY_OUTWARD_REPORT_ADD: "add/commodity-outward-report",
// COMMODITY_OUTWARD_REPORT_EDIT: "edit/commodity-outward-report/:id",
// QUALITY_CONTROL_REPORT: "quality-control-report",
// QUALITY_CONTROL_REPORT_ADD: "add/quality-control-report",
// QUALITY_CONTROL_REPORT_EDIT: "edit/quality-control-report/:id",
// DELIVERY_ORDER: "delivery-order",
// DELIVERY_ORDER_ADD: "add/delivery-order",
// DELIVERY_ORDER_EDIT: "edit/delivery-order/:id",
// SETTING: "setting",
// LOGIN: "login",
// NOT_FOUND: "*",
// FORGOT_PASSWORD: "forgot-password",
// CHANGE_PASSWORD: "change-password",
// };

export const ROUTE_PATH = {
  DASHBOARD: "dashboard",
  CHANGE_CURRENT_PASSWORD: "/change-current-password",
  SUPERSET_DASHBOARD_ID: "/superset-dashboard",
  FORGOT_PASSWORD: "/forgot-password",
  CHANGE_PASSWORD: "/change-password",
  LOGIN: "/login",
  NOT_FOUND: "*", // dont use slash here

  TESTING: "/testing",

  // Manage Location key
  ALL_MASTER_MANAGE_LOCATION_REGION: "/all-master-region",
  ALL_MASTER_MANAGE_LOCATION_REGION_ADD: "/all-master-region-add",

  ALL_MASTER_MANAGE_LOCATION_REGION_EDIT: "/all-master-region-edit",

  ALL_MASTER_MANAGE_LOCATION_STATE: "/all-master-state",
  ALL_MASTER_MANAGE_LOCATION_STATE_ADD: "/all-master-state-add",
  ALL_MASTER_MANAGE_LOCATION_STATE_EDIT: "/all-master-state-edit",

  ALL_MASTER_MANAGE_LOCATION_SUB_STATE: "/all-master-substate",
  ALL_MASTER_MANAGE_LOCATION_SUB_STATE_ADD: "/all-master-substate-add",
  ALL_MASTER_MANAGE_LOCATION_SUB_STATE_EDIT: "/all-master-substate-edit",

  ALL_MASTER_MANAGE_LOCATION_DISTRICT: "/all-master-district",
  ALL_MASTER_MANAGE_LOCATION_DISTRICT_ADD: "/all-master-district-add",
  ALL_MASTER_MANAGE_LOCATION_DISTRICT_EDIT: "/all-master-district-edit",

  ALL_MASTER_MANAGE_LOCATION_AREA: "/all-master-area",
  ALL_MASTER_MANAGE_LOCATION_AREA_ADD: "/all-master-area-add",
  ALL_MASTER_MANAGE_LOCATION_AREA_EDIT: "/all-master-area-edit",

  // Manage Users Key Start

  ALL_MASTER_MANAGE_USERS_USER: "/all-master-user",
  ALL_MASTER_MANAGE_USERS_USER_ADD: "/all-master-user-add",
  ALL_MASTER_MANAGE_USERS_USER_EDIT: "/all-master-user-edit",

  ALL_MASTER_MANAGE_USERS_SUPERVISOR_HIRING: "/all-master-supervisor-hiring",
  ALL_MASTER_MANAGE_USERS_SUPERVISOR_HIRING_ADD:
    "/all-master-supervisor-hiring-add",
  ALL_MASTER_MANAGE_USERS_SUPERVISOR_HIRING_EDIT:
    "/all-master-supervisor-hiring-edit",

  ALL_MASTER_MANAGE_USERS_ROLE: "/all-master-role",
  ALL_MASTER_MANAGE_USERS_ROLE_ADD: "/all-master-role-add",
  ALL_MASTER_MANAGE_USERS_ROLE_EDIT: "/all-master-role-edit",

  // Manage Banks Key Start

  ALL_MASTER_MANAGE_BANKS_BANK: "/all-master-bank",
  ALL_MASTER_MANAGE_BANKS_BANK_ADD: "/all-master-bank-add",
  ALL_MASTER_MANAGE_BANKS_BANK_EDIT: "/all-master-bank-edit",

  ALL_MASTER_MANAGE_BANKS_BANK_BRANCH: "/all-master-branch",
  ALL_MASTER_MANAGE_BANKS_BANK_BRANCH_ADD: "/all-master-branch-add",
  ALL_MASTER_MANAGE_BANKS_BANK_BRANCH_EDIT: "/all-master-branch-edit",

  ALL_MASTER_MANAGE_BANKS_CM_LOCATION: "/all-master-cm-location",
  ALL_MASTER_MANAGE_BANKS_CM_LOCATION_ADD: "/all-master-cm-location-add",
  ALL_MASTER_MANAGE_BANKS_CM_LOCATION_EDIT: "/all-master-cm-location-edit",

  // Manage Insurance Key Start

  ALL_MASTER_MANAGE_LOCATION_INSURANCE_POLICY: "/all-master-insurance-policy",
  ALL_MASTER_MANAGE_LOCATION_INSURANCE_POLICY_ADD:
    "/all-master-insurance-policy-add",
  ALL_MASTER_MANAGE_LOCATION_INSURANCE_POLICY_EDIT:
    "/all-master-insurance-policy-edit",

  ALL_MASTER_MANAGE_LOCATION_EARTHQUACK_ZONE: "/all-master-earthquack-zone",
  ALL_MASTER_MANAGE_LOCATION_EARTHQUACK_ZONE_ADD:
    "/all-master-earthquack-zone-add",
  ALL_MASTER_MANAGE_LOCATION_EARTHQUACK_ZONE_EDIT:
    "/all-master-earthquack-zone-edit",

  // Manage Commodity Key Start
  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_TYPE: "/all-master-commodity-type",
  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_TYPE_ADD:
    "/all-master-commodity-type-add",
  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_TYPE_EDIT:
    "/all-master-commodity-type-edit",

  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER: "/all-master-commodity-master",
  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER_ADD:
    "/all-master-commodity-master-add",
  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER_EDIT:
    "/all-master-commodity-master-edit",

  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_VARIETY:
    "/all-master-commodity-variety",
  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_VARIETY_ADD:
    "/all-master-commodity-variety-add",
  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_VARITY_EDIT:
    "/all-master-commodity-variety-edit",

  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_BAG: "/all-master-commodity-bag",
  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_BAG_ADD:
    "/all-master-commodity-bag-add",
  ALL_MASTER_MANAGE_COMMODITY_COMMODITY_BAG_EDIT:
    "/all-master-commodity-bag-edit",

  ALL_MASTER_MANAGE_COMMODITY_HSN: "/all-master-hsn",
  ALL_MASTER_MANAGE_COMMODITY_HSN_ADD: "/all-master-hsn-add",
  ALL_MASTER_MANAGE_COMMODITY_HSN_EDIT: "/all-master-hsn-edit",

  ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING: "/all-master-price-pulling",
  ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING_ADD:
    "/all-master-price-pulling-add",
  ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING_EDIT:
    "/all-master-price-puling-edit",

  ALL_MASTER_MANAGE_COMMODITY_QUALTY_PARAMETER: "/all-master-quality-parameter",
  ALL_MASTER_MANAGE_COMMODITY_QUALITY_PARAMETER_ADD:
    "/all-master-quality-parameter-add",
  ALL_MASTER_MANAGE_COMMODITY_QUALITY_PARAMETER_EDIT:
    "/all-master-quality-parameter-edit",

  // Manage Warehouse Key Start

  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_TYPE: "/all-master-warehouse-type",
  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_TYPE_ADD:
    "/all-master-warehouse-type-add",
  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_TYPE_EDIT:
    "/all-master-warehouse-type-edit",

  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE:
    "/all-master-warehouse-sub-type",
  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE_ADD:
    "/all-master-warehouse-sub-type-add",
  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE_EDIT:
    "/all-master-warehouse-sub-type-edit",

  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE: "/all-master-warehouse-master",
  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_ADD: "/all-master-warehouse-master-add",
  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_EDIT:
    "/all-master-warehouse-master-edit",

  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_DETAILS:
    "/all-master-warehouse-master-details",

  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_FACILITIES:
    "/all-master-warehouse-master-facilitiesatwarehouse",

  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUPERVISOR:
    "/all-master-warehouse-master-supervisorandsecurityguard",

  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_OTHER_DETAILS:
    "/all-master-warehouse-master-otherdetails",

  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_MASTER_AGREEMENT:
    "/all-master-warehouse-master-agreement",

  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_VIEW:
    "/all-master-view-warehouse-master-details",

  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_OWNER: "/all-master-warehouse-owner",
  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_OWNER_ADD:
    "/all-master-warehouse-owner-add",
  ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_OWNER_EDIT:
    "/all-master-warehouse-owner-edit",

  // Manage Client Key Start

  ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT:
    "/all-master-warehouse-client",
  ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT_ADD:
    "/all-master-warehouse-client-add",
  ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT_EDIT:
    "/all-master-warehouse-client-edit",

  // Manage Vendor Key Start

  ALL_MASTER_MANAGE_VENDORS_SECURITY_AGENCY: "/all-master-security-agency",
  ALL_MASTER_MANAGE_VENDORS_SECURITY_AGENCY_ADD:
    "/all-master-security-agency-add",
  ALL_MASTER_MANAGE_VENDORS_SECURITY_AGENCY_EDIT:
    "/all-master-security-agency-edit",

  // Manage Security Guard Keys Start

  ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_GUARD: "/all-master-security-guard",
  ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_GUARD_ADD:
    "/all-master-security-guard-add",
  ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_GUARD_EDIT:
    "/all-master-security-guard-edit",

  ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_TRANSFER_LIST:
    "/all-master-securityguard-transfer-list",
  ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_TRANSFER:
    "/all-master-securityguard-transfer",
  ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_TRANSFER_ADD:
    "/all-master-security-transfer-add",
  ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_TRANSFER_EDIT:
    "/all-master-security-transfer-edit",

  // Hiring Proposals Key Start

  WAREHOUSE_PROPOSAL: "/hiring-proposal-master",
  WAREHOUSE_PROPOSAL_ADD: "/hiring-proposal-master-add",
  WAREHOUSE_PROPOSAL_EDIT: "/hiring-proposal-master-edit",

  // warehouse proposal.....
  PROPOSALS: "/warehouse-proposal",
  PROPOSALS_EDIT: "/warehouse-proposal",
  // Warehouse Inspection Key start

  WAREHOUSE_INSPECTION_MASTER: "/inspection-master",
  WAREHOUSE_INSPECTION_MASTER_ADD: "/add/inspection-master",
  WAREHOUSE_INSPECTION_MASTER_EDIT: "/edit/inspection-master",

  WAREHOUSE_INSPECTION: "/warehouse-inspection",

  WAREHOUSE_RE_INSPECTION_MASTER: "/re-inspection-master",
  WAREHOUSE_RE_INSPECTION_STANDARD: "/standard-re-inspection",
  WAREHOUSE_RE_INSPECTION_HDFC: "/hdfc-re-inspection",
  WAREHOUSE_RE_INSPECTION_ADD: "/add/re-inspection-master",
  WAREHOUSE_RE_INSPECTION_EDIT: "/edit/re-inspection-master",

  SERVICE_CONTRACT_PWH: "/service-contract-pwh",
  SERVICE_CONTRACT_PWH_ADD: "/service-contract-pwh-add",
  SERVICE_CONTRACT_PWH_EDIT: "/service-contract-pwh-edit",

  SERVICE_CONTRACT_WMS: "/service-contract-wms",
  SERVICE_CONTRACT_WMS_ADD: "/service-contract-wms-add",
  SERVICE_CONTRACT_WMS_EDIT: "/service-contract-wms-edit",

  GATE_PASS_INWARD: "/gate-pass-inward",
  GATE_PASS_INWARD_ADD: "/gate-pass-inward-add",
  GATE_PASS_INWARD_EDIT: "/gate-pass-inward-edit",

  GATE_PASS_OUTWARD: "/gate-pass-outward",
  GATE_PASS_OUTWARD_ADD: "/gate-pass-ouward-add",
  GATE_PASS_OUTWARD_EDIT: "/gate-pass-outward-edit",

  COMMODITY_INWARD_REPORT: "/commodity-inward-report",
  COMMODITY_INWARD_REPORT_ADD: "/commodity-inward-report-add",
  COMMODITY_INWARD_REPORT_EDIT: "/commodity-inward-report-edit",
  COMMODITY_OUTWARD_REPORT: "/commodity-outward-report",
  COMMODITY_OUTWARD_REPORT_ADD: "/commodity-outward-report-add",
  COMMODITY_OUTWARD_REPORT_EDIT: "/commodity-outward-report-edit",
  QUALITY_CONTROL_REPORT: "/quality-control-report",
  QUALITY_CONTROL_REPORT_ADD: "/quality-control-report-add",
  QUALITY_CONTROL_REPORT_EDIT: "/quality-control-report-edit",
  // owner billing routes ....
  OWNER_BILLING: "/owner-billing",
  OWNER_BILLING_ADD: "/owner-billing-add",
  OWNER_BILLING_EDIT: "/owner-billing-edit",
  // client billing routes ...
  CLIENT_BILLING: "/client-billing",
  CLIENT_BILLING_ADD: "/client-billing-add",
  CLIENT_BILLING_EDIT: "/client-billing-edit",
  // other billing ...
  OTHER_BILLING: "/other-billing",
  OTHER_BILLING_ADD: "/other-billing-add",
  OTHER_BILLING_EDIT: "/other-billing-edit",
  DELIVERY_ORDER: "/delivery-order",
  DELIVERY_ORDER_ADD: "/delivery-order-add",
  DELIVERY_ORDER_EDIT: "/delivery-order-edit",
  SETTING: "/setting",
};

export default ROUTE_PATH;
