export const API = {
  SIGNUP: "/register/",
  LOGIN: "/login/",
  FORGOT_PWD: "/Forgotpass_Api/",
  CHANGE_PASSWORD: "/verify_password/",
  CHANGE_CURRENT_PASSWORD: "/change_password/", // This is for the changeCurrentPassword Method
  // http://13.127.52.147:8080/api/v1/dashboard/?q={%22page%22:0,%22page_size%22:100}
  // "page":0,"page_size":100}
  DASHBOARD: {
    REPORTS: "/api/v1/dashboard/?'q={page:1000,page_size:100}'",
    SUPERSET_DASHBOARD: "/api/v1/security/login",
    SUPERSET_EMBEDDED_DASHBOARD_URL: "/api/v1/dashboard/ ",
    SUPERSET_GUEST_TOKEN: "/api/v1/security/guest_token/",
    DISTRICT_MASTER: "/warehouse/district/",
    DISTRICT_MASTER_FREE: "/open_apis/district/",
    STATE_MASTER: "/warehouse/state/",
    STATE_MASTER_FREE: "/open_apis/state/",
    SUBSTATE_MASTER: "/warehouse/substate/",
    SUBSTATE_MASTER_FREE: "/open_apis/substate/",
    AREA_MASTER: "/warehouse/area/",
    AREA_MASTER_FREE: "/open_apis/area/",
    BANK_MASTER: "/business_flow/bank/",
    BANK_MASTER_FREE: "/open_apis/bank/",
    BANK_MASTER_SECTOR: "/business_flow/bank_sectors/",
    BANK_BRANCH_MASTER: "/business_flow/bank_branch/",
    BANK_BRANCH_MASTER_FREE: "/open_apis/bank_branch/",
    EARTHQUAKE_ZONE_TYPE_MASTER: "/warehouse/earthquake_zone_type/",
    EARTHQUAKE_ZONE_TYPE_MASTER_FREE: "/open_apis/earthquake/",
    EARTHQUAKE_ZONE_ACTIVE: "/warehouse/earthquake/",
    INSURANCE_COMPANY_MASTER: "/business_flow/insurance/",
    INSURANCE_POLICY_MASTER: "/business_flow/insurance_policy/",
    REGION_MASTER: "/warehouse/region/",
    REGION_MASTER_FREE: "/open_apis/region/",
    COMMODITY_TYPE_MASTER: "/warehouse/commodity_type/",
    COMMODITY_TYPE_MASTER_FREE: "/open_apis/commodity_type/",
    COMMODITY_GRADE: "/warehouse/commodity_grade/",
    COMMODITY_MASTER: "/warehouse/commodity/",
    COMMODITY_MASTER_FREE: "/open_apis/commodity/",
    STACK_FREE: "/open_apis/unusedstack/",
    COMMODITY_VARITY_FREE: "/open_apis/commodity_variety/",
    COMMODITY_PRICE_PULLING: "business_flow/current_price/",
    COMMODITY_EXCEL_UPLOAD: "business_flow/current_price/",
    PAGE_MASTER: "/page/",
    PAGE_FREE_MASTER: "/open_apis/page/",
    EMPLOYEE_MASTER: "/employeeapi/",
    EMPLOYEE_MASTER_ACTIVE: "",
    DEPARTMENT_MASTER: "/departmentapi/",
    DEPARTMENT_MASTER_ACTIVE: "",
    HIRING_PROPOSAL_MASTER: "/warehouse/warehousehiring_proposal/",
    INSPECTION_MASTER: "/warehouse/warehouse_hiring_inspection/",
    INSPECTION_ASSIGN_MASTER: "/warehouse/inspection_assign/",
    /// INSPECTION_ASSIGN_MASTER: "/warehouse/warehouse_hiring_inspection/",

    INSPECTION_MULTIPLE_ASSIGN_MASTER: "/warehouse/inspection_assign/",
    HIRING_PROPOSAL_MASTER_ACTIVE: "",
    ROLE_MASTER: "/role/",
    ROLE_MASTER_FREE: "/open_apis/role/",
    ROLE_PAGE_ASSIGNMENT_MASTER: "/role",
    USER_MASTER: "/user/",
    WAREHOUSE_USER_TRANSFER_MASTER: "/warehouse/hr_warehouse/",
    USER_MASTER_FREE: "/open_apis/user/",
    DESIGNATION_MASTER: "/designations/",
    DESIGNATION_MASTER_FREE: "/open_apis/designations/",
    COMMODITY_VARIETY: "/warehouse/commodity_variety/",
    WAREHOUSE_SUB_TYPE: "/warehouse/warehouse_sub_type/",
    WAREHOUSE_MASTER: "/warehouse/warehouse/",
    WAREHOUSE_MASTER_FREE: "/open_apis/warehouse/",
    // in warehouse master  security guard api endpoint start
    WAREHOUSE_MASTER_SECURITY: "/open_apis/warehouse_security_guard",
    // in warehouse master security guard api endpoint end

    // in warehouse master supervisor  api endpoint start
    WAREHOUSE_MASTER_SUPERVISOR: "/open_apis/warehouse_supervisor",
    // in warehouse master supervisor  api endpoint end

    WAREHOUSE_OWNER_MASTER_FREE: "/open_apis/warehouse_owner/",
    CHAMBER_FREE: "/open_apis/chamber/",
    WAREHOUSE_AGREEMENT_RENEWAL: "/warehouse/agreement_renewal/",
    SECURITY_AGENCY_MASTER: "/business_flow/security_agency/",
    SECURITY_AGENCY_MASTER_FREE: "/open_apis/security_agency/",
    SECURITY_GUARD_MASTER: "/warehouse/security_guard/",
    SECURITY_GUARD_TYPE_MASTER: "/business_flow/security_agency_service_type/",
    SECURITY_GUARD_TRANSFER: "/warehouse/security_guard_transfer/",
    WAREHOUSE_TYPE_MASTER: "/warehouse/warehouse_type/",
    COMMODITY_ACTIVE: "/warehouse/commodity_active/",
    COMMODITY_TYPE_ACTIVE: "",
    COMMODITY_GRADE_ACTIVE: "/warehouse/commodity_grade_active/",
    COMMODITY_VARIETY_ACTIVE: "/warehouse/commodity_variety_active/",
    STATE_ACTIVE: "/warehouse/state_active/",
    ZONE_ACTIVE: "/warehouse/zone_active/",
    REGION_ACTIVE: "/warehouse/region_active_api/",
    DISTRICT_ACTIVE: "",
    AREA_ACTIVE: "",
    INSURANCE_ACTIVE: "/business_flow/insurance/",
    SECURITY_AGENCY_ACTIVE: "",
    SECURITY_GUARD_ACTIVE: "",
    CLIENT_MASTER: "",
    PAGE_MASTER_ACTIVE: "",
    BANK_MASTER_ACTIVE: "",
    BANK_BRANCH_MASTER_ACTIVE: "",
    WAREHOUSE_TYPE_MASTER_ACTIVE: "",
    WAREHOUSE_SUB_TYPE_MASTER_ACTIVE: "",
    USER_MASTER_ACTIVE: "",
    BANK_CM_LOCATION_MASTER: "/business_flow/bank_cm_location/",
    COMMODITY_BAG_MASTER: "/warehouse/commodity_bag/",
    COMMODITY_BAG_FREE_MASTER: "/open_apis/commodity_bag/",
    HSN_MASTER: "/business_flow/hsnapi/",
    HSN_MASTER_FREE: "/open_apis/hsnapi/",
    WAREHOUSE_CLIENT_MASTER: "/warehouse/client/",
    WAREHOUSE_OWNER_MASTER: "/warehouse/warehouse_owner/",
    WAREHOUSE_OWNER_TYPE: "/open_apis/warehouse_owner_type/",
    WAREHOUSE_OWNER_DOCUMENT_TYPE: "/open_apis/warehouse_owner_document/",
    EXCEL_DOWNLOAD_MASTER: "excel_download",
    PRICE_PULLING_EXCEL_DOWNLOAD_MASTER:
      "business_flow/commodity_price_pulling_download",

    QUALITY_PARAMETER_MASTER: "/warehouse/commodity/",
    PRIMARY_COMMODITY_TYPE: "warehouse/primary_commodity_types",
    COMMODITY: {
      GET_ALL_QUALITY: "/warehouse/quality_parameter/",
    },
  },

  WAREHOUSE_PROPOSAL: {
    SAVE_AS_DRAFT: "/warehouse/save_draft_create/",
    SUPERVISOR_DAY: "/warehouse/day/supervisor",
    SUPERVISOR_NIGHT: "/warehouse/night/supervisor",
    SECURITY_DAY: "/warehouse/day/security",
    SECURITY_NIGHT: "/warehouse/night/security",
    SUPERVISOR_DAY_FREE: "/open_apis/day/supervisor",
    SUPERVISOR_NIGHT_FREE: "/open_apis/night/supervisor",
    SECURITY_DAY_FREE: "/open_apis/day/security",
    SECURITY_NIGHT_FREE: "/open_apis/night/security",
    PBPM: "/operational_flow/pbpm/pbpm_list/",
    MIN_MAX_AVG: "warehouse/warehousehiring_proposal/",
    GET_WAREHOUSE_TYPE: "/warehouse/warehouse_type/",
    GET_WAREHOUSE_SUB_TYPE: "/warehouse/warehouse_sub_type",
    GET_WAREHOUSE_TYPE_FREE: "/open_apis/warehouse_type/",
    GET_WAREHOUSE_SUB_TYPE_FREE: "/open_apis/warehouse_sub_type",
    GET_WAREHOUSE_UNIT_TYPE: "/warehouse/warehouse_unit_types",
    WAREHOUSE_PROPOSAL_DETAILS: "/warehouse/warehousehiring_proposal/",
    DOCUMENT_STATUS_TRACKER: "/warehouse/document_status_tracker/",
    ASSIGN_TO_ME: "/warehouse/assign/",
  },
  COMMON_API_END_POINTS: {
    LOCATION_DRILL_DOWN: "/warehouse/location/filter",
    LOCATION_DRILL_DOWN_FREE: "/open_apis/location/filter",
    FILE_UPLOAD: "/operational_flow/upload_file/",
  },

  ALL_SECURITY_GUARD_MASTER: {
    GET_GUARD_TRANSFER: "/warehouse/security_guard_transfer/",
    GET_WAREHOUSE_LIST: "/open_apis/security_guard_transfer/",
    GET_WAREHOUSE_FREE_LIST: "/open_apis/security_agency_transfer/",
    GET_GUARD_TRANSFER_LIST: "/open_apis/guard_tranfer/",
  },

  GET_PASS: {
    GET_PASS: "/warehouse/gate_pass/",
    GET_PASS_OUT_WARD: "/warehouse/gate_pass_cor/",
    DO_NO: "/open_apis/delivery-order/",
    OUTWARD_GATEPASS: "/open_apis/outward_gatepass_do_status/",
  },
  CIR: {
    CIR: "/warehouse/cir_gatepass/",
    CIR_FREE: "/open_apis/gatepass_cir/",
    WHR_FREE: "/open_apis/cir/",
    CIR_CREATE: "/warehouse/cir/",
    POLICY_NO: "/open_apis/cir_insurance_policy/",
    GET_MARKET_VALUE: "/open_apis/current_price",
    CIR_ASSIGN: "/warehouse/cir_assign/",
    ASSIGN_TO_ME: "/warehouse/cir_assign/",
  },
  COR: {
    COR: "/warehouse/cor",
    COR_FREE: "/open_apis/cor/",
    GATE_PASS_COR: "open_apis/gatepass_cor/",
    COR_CREATE: "/warehouse/cor/",
    COR_ASSIGN: "/warehouse/cor_assign/",
    ASSIGN_TO_ME: "/warehouse/cor_assign/",
  },
  QCR: {
    GET: "/warehouse/quality_control_report/",
    POST: "/warehouse/quality_control_report/",
    PATCH: "/warehouse/qcr_assign/",
    ASSIGN_TO_ME: "/warehouse/qcr_assign/",
  },
  DO: {
    GET: "/warehouse/delivery_order/",
    POST: "/warehouse/delivery_order/",
    PATCH: "/warehouse/delivery_order",
    ASSIGN_TO_ME: "/warehouse/delivery_order_assign/",
    STACK_GET: "/open_apis/stack_number_cir/",
    MT_BAG_GET: "/warehouse/delivery_order_bag_mt_status/",
    STACK_NUMBER_FOR_LOT: "/open_apis/delivery_order_stack_list",
    GET_ALL_LOTS_ON_STACK: "/open_apis/stack_number_cir",
    ASSIGN_TO_ME_DO__SECTION: "/warehouse/delivery_order_assign",
  },

  WAREHOUSE_AGREEMENT_DETAILS: {
    FETCH_WAREHOUSE_AGREEMENT_DETAILS: "/warehouse/warehouse_agreement/",
  },
  WAREHOUSE_OWNER_MASTER: {
    CHECK_PAN_NUMBER: "/warehouse/pan_no_check/",
  },

  COUNT: {
    WAREHOUSE: "/warehouse/warehouse_count/",
    INSURANCE: "/business_flow/gg_insurace_amount/",
    ACTIVE_SECURITY: "/warehouse/active_security_guard/",
    COMMODITY_WITH_HIGHEST: "/business_flow/commodity_highest_price/",
    TOTAL_CLIENT: "/warehouse/client_count/",
    OWNER_BILLING: "/billing_flow/owner_count/",
    CLIENT_BILLING: "/billing_flow/client_count/",
  },

  WAREHOUSE_CLIENT_MASTER: {
    GET_DOC_TYPE: "/warehouse/document_list/",
    GET_CONSTITUTION_CLIENT: "/warehouse/constitution_client",
    GET_ALL_STATE: "/warehouse/state/",
    GET_CLIENT_FREE: "/open_apis/client/",
    POST: "/warehouse/client/",
    PATCH: "/warehouse/client/",
    CHECK_PAN_NUMBER: "/warehouse/pan_no_client/",
    GET_AGREEMENT_START_DATE: "/warehouse/get_agreement_start_date",
    WAREHOUSE_CLIENT_ASSIGN: "/warehouse/client_assign/",
    WAREHOUSE_CLIENT_MULTIPLE_ASSIGN: "warehouse/client_assign/",
  },

  BILLING: {
    OWNER_BILLING: "/billing_flow/owner_billing/",
    CLIENT_BILLING: "/billing_flow/client_billing",
    OTHER_BILLING: "/billing_flow/other_billing/",
    REGENERATE_BILLING:"/billing_flow/regenerate_billing/",
  },

  REINSPECTION_MASTER: {
    CREATE: "/warehouse/warehouse_hiring_re_inspection/",
    GET: "/warehouse/warehouse_hiring_re_inspection/",
    RE_INSPECTION_MASTER_FETCH_DATA: "/warehouse/warehouse_hiring_inspection/",
  },

  SETTING: {
    PBPM_CONFIGURATION: "/business_flow/pbpm_config/",
  },

  // Service Contract Api Link start
  SERVICE_CONTRACT: {
    FETCH_ALL_CLIENT: "/open_apis/client/",
    SERVICE_CONTRACT: "warehouse/service_contract/",
    SERVICE_CONTRACT_MULTIPLE_ASSIGN: "warehouse/service_contract_assign/",
    SERVICE_CONTRACT_FREE: "open_apis/service_contract/",
    SERVICE_CONTRACT_ASSIGN: "warehouse/service_contract_assign/",
    FETCH_BAG_WISE_RATES: "/operational_flow/pbpm/",
  },
  COMMODITY_PRICE_PULLING: {
    GET_BY_ID: "/business_flow/individual_current_price",
    UPDATE_PRICE_PULLING: "/business_flow/current_price/",
  },
};
