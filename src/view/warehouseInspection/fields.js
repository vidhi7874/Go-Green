import * as yup from "yup";

const filterFields = [
  {
    WarehouseTypeID: "hiring_proposal__proposal_number",
    isActiveFilter: false,

    label: "PROPOSAL NO.",
    name: "hiring_proposal__proposal_number",
    placeholder: "PROPOSAL NO.",
    type: "text",
  },
  {
    WarehouseTypeID: "warehouse_type",
    isActiveFilter: false,

    label: "Warehouse Type",
    name: "warehouse_type",
    placeholder: "Warehouse Type",
    type: "text",
  },
  {
    WarehouseSubTypeID: "warehouse_sub_type",
    isActiveFilter: false,

    label: "Warehouse Sub Type",
    name: "warehouse_sub_type",
    placeholder: "Warehouse Sub Type",
    type: "text",
  },
  {
    WarehouseUnitTypeID: "warehouse_unit_type__warehouse_unit_type",
    isActiveFilter: false,

    label: "Warehouse Unit Type",
    name: "warehouse_unit_type__warehouse_unit_type",
    placeholder: "Warehouse Unit Type",
    type: "text",
  },
  {
    "Warehouse Name": "warehouse_name",
    isActiveFilter: false,

    label: "Warehouse Name",
    name: "warehouse_name",
    placeholder: "Warehouse Name",
    type: "text",
  },
  {
    Region: "region",
    isActiveFilter: false,

    label: "Region",
    name: "region",
    placeholder: "Region",
    type: "text",
  },
  {
    State: "state",
    isActiveFilter: false,

    label: "State ",
    name: "state",
    placeholder: "State",
    type: "text",
  },
  {
    "Sub State ": "substate",
    isActiveFilter: false,

    label: "Sub State ",
    name: "substate",
    placeholder: "Sub State",
    type: "text",
  },
  {
    "District ": "district",
    isActiveFilter: false,

    label: "District ",
    name: "district",
    placeholder: "District",
    type: "text",
  },
  {
    "Area ": "area",
    isActiveFilter: false,

    label: "Area",
    name: "area",
    placeholder: "Area",
    type: "text",
  },
  {
    "WarehouseAddress ": "warehouse_address",
    isActiveFilter: false,

    label: "Address ",
    name: "warehouse_address",
    placeholder: "Address ",
    type: "text",
  },
  {
    WarehousePincode: "warehouse_pincode",
    isActiveFilter: false,

    label: "Pincode ",
    name: "warehouse_pincode",
    placeholder: "Pincode ",
    type: "number",
  },
  // {
  //   "NoOfChambers ": "no_of_chambers",
  //   isActiveFilter: false,

  //   label: "NoOfChambers ",
  //   name: "no_of_chambers",
  //   placeholder: "NoOfChambers ",
  //   type: "number",
  // },

  // {
  //   "StandardCapacity ": "standard_capacity",
  //   isActiveFilter: false,

  //   label: "StandardCapacity ",
  //   name: "standard_capacity",
  //   placeholder: "StandardCapacity",
  //   type: "number",
  // },
  // {
  //   "CurrentCapacity ": "currrent_capacity",
  //   isActiveFilter: false,

  //   label: "CurrentCapacity ",
  //   name: "currrent_capacity",
  //   placeholder: "CurrentCapacity ",
  //   type: "number",
  // },
  // {
  //   "CurrentUtilisedCapacity ": "currrent_utilised_capacity",
  //   isActiveFilter: false,

  //   label: "CurrentUtilisedCapacity ",
  //   name: "currrent_utilised_capacity",
  //   placeholder: "CurrentUtilisedCapacity ",
  //   type: "number",
  // },
  // {
  //   "NoOfWarehouseInArea ": "no_of_warehouse_in_area",
  //   isActiveFilter: false,

  //   label: "NoOfWarehouseInArea",
  //   name: "no_of_warehouse_in_area",
  //   placeholder: "NoOfWarehouseInArea",
  //   type: "number",
  // },
  // {
  //   "LockinPeriod ": "lock_in_period",
  //   isActiveFilter: false,

  //   label: "LockinPeriod ",
  //   name: "lock_in_period",
  //   placeholder: "LockinPeriod",
  //   type: "number",
  // },
  // {
  //   "LockinPeriodMonth ": "lock_in_period_month",
  //   isActiveFilter: false,

  //   label: "LockinPeriodMonth ",
  //   name: "lock_in_period_month",
  //   placeholder: "LockinPeriodMonth",
  //   type: "date",
  // },
  // {
  //   "CoveredArea ": "covered_area",
  //   isActiveFilter: false,

  //   label: "CoveredArea",
  //   name: "covered_area",
  //   placeholder: "CoveredArea",
  //   type: "number",
  // },
  // {
  //   "SupervisorDayShift ": "supervisor_day_shift",
  //   isActiveFilter: false,

  //   label: "SupervisorDayShift ",
  //   name: "supervisor_day_shift ",
  //   placeholder: "SupervisorDayShift ",
  //   type: "text",
  // },
  // {
  //   "SupervisorNightShift ": "supervisor_night_shift",
  //   isActiveFilter: false,

  //   label: "SupervisorNightShift ",
  //   name: "supervisor_night_shift",
  //   placeholder: "SupervisorNightShift ",
  //   type: "text",
  // },
  // {
  //   "SecurityGuardDunayShift ": "security_guard_day_shift",
  //   isActiveFilter: false,

  //   label: "SecurityGuardDayShift ",
  //   name: "security_guard_day_shift",
  //   placeholder: "SecurityGuardDayShift ",
  //   type: "number",
  // },
  // {
  //   "SecurityGuardNightShift ": "security_guard_night_shift",
  //   isActiveFilter: false,

  //   label: "Security Guard Night Shift ",
  //   name: "security_guard_night_shift",
  //   placeholder: "Security Guard Night Shift",
  //   type: "number",
  // },
  // {
  //   "Expected Commodity ": "expected_commodity",
  //   isActiveFilter: false,

  //   label: "Expected Commodity ",
  //   name: "expected_commodity",
  //   placeholder: "Expected Commodity ",
  //   type: "number",
  // },
  // {
  //   CommodityInwardType: "commodity_inward_type",
  //   isActiveFilter: false,

  //   label: "CommodityInwardType",
  //   name: "commodity_inward_type",
  //   placeholder: "CommodityInwardType",
  //   type: "text",
  // },
  // {
  //   PreStackCommodity: "prestack_commodity",
  //   isActiveFilter: false,

  //   label: "PreStackCommodity",
  //   name: "prestack_commodity",
  //   placeholder: "PreStackCommodity",
  //   type: "number",
  // },
  // {
  //   PreStackCommodityQty: "prestack_commodity_qty",
  //   isActiveFilter: false,

  //   label: "PreStackCommodity",
  //   name: "prestack_commodity_qty",
  //   placeholder: "PreStackCommodityQty",
  //   type: "number",
  // },
  // {
  //   CCBanker: "ccbanker_name",
  //   isActiveFilter: false,

  //   label: "CCBanker",
  //   name: "ccbanker_name",
  //   placeholder: "CCBanker",
  //   type: "number",
  // },
  // {
  //   FundingRequired: "is_funding_required",
  //   isActiveFilter: false,

  //   label: "FundingRequired",
  //   name: "is_funding_required",
  //   placeholder: "FundingRequired",
  //   type: "text",
  // },
  // {
  //   "Rent ": "rent",
  //   isActiveFilter: false,

  //   label: "Rent ",
  //   name: "rent",
  //   placeholder: "Rent ",
  //   type: "number",
  // },
  // {
  //   GGRevenueSharingRatio: "gg_revenue_ratio",
  //   isActiveFilter: false,

  //   label: "GGRevenueSharingRatio",
  //   name: "gg_revenue_ratio",
  //   placeholder: "GGRevenueSharingRatio",
  //   type: "number",
  // },
  // {
  //   SecurityDepositeMonth: "security_deposit_month",
  //   isActiveFilter: false,

  //   label: "SecurityDepositeMonth",
  //   name: "security_deposit_month",
  //   placeholder: "SecurityDepositeMonth",
  //   type: "date",
  // },
  // {
  //   AdvanceRent: "advance_rent",
  //   isActiveFilter: false,

  //   label: "AdvanceRent",
  //   name: "advance_rent",
  //   placeholder: "AdvanceRent",
  //   type: "number",
  // },
  // {
  //   AdvanceRentMonth: "advance_rent_month",
  //   isActiveFilter: false,

  //   label: "AdvanceRentMonth",
  //   name: "advance_rent_month",
  //   placeholder: "AdvanceRentMonth",
  //   type: "date",
  // },
  // {
  //   "GST ": "gst",
  //   isActiveFilter: false,

  //   label: "GST ",
  //   name: "gst",
  //   placeholder: "GST ",
  //   type: "text",
  // },
  // {
  //   CommencementDate: "commencement_date",
  //   isActiveFilter: false,

  //   label: "Commencement Date Range",
  //   name: "commencement_date",
  //   placeholder: "Commencement Date",
  //   type: "date_from_to",
  // },
  // {
  //   "AgreementPeriodMonth ": "security_deposit_month",
  //   isActiveFilter: false,

  //   label: "AgreementPeriodMonth",
  //   name: "security_deposit_month",
  //   placeholder: "AgreementPeriodMonth",
  //   type: "text",
  // },

  // {
  //   "NoticePeriodMonth ": "notice_period_month",
  //   isActiveFilter: false,

  //   label: "NoticePeriodMonth ",
  //   name: "notice_period_month",
  //   placeholder: "NoticePeriodMonth ",
  //   type: "date",
  // },

  // {
  //   Remarks: "remarks",
  //   isActiveFilter: false,

  //   label: "Remarks",
  //   name: "remarks",
  //   placeholder: "Remarks",
  //   type: "text",
  // },

  {
    L1User: "l1_user",
    isActiveFilter: false,

    label: "L1User",
    name: "l1_user",
    placeholder: "L1User",
    type: "text",
  },
  {
    L2User: "l2_user",
    isActiveFilter: false,

    label: "L2User",
    name: "l2_user",
    placeholder: "L2User",
    type: "text",
  },
  {
    L2User: "l3_user",
    isActiveFilter: false,

    label: "L3User",
    name: "l3_user",
    placeholder: "L3User",
    type: "text",
  },
  {
    L2User: "l4_user",
    isActiveFilter: false,

    label: "L4User",
    name: "l4_user",
    placeholder: "L4User",
    type: "text",
  },
  {
    L2User: "status__description",
    isActiveFilter: false,

    label: "Application Status",
    name: "status__description",
    placeholder: "Application Status",
    type: "text",
  },

  // {
  //   "Document ": "bank_name",
  //   isActiveFilter: false,

  //   label: "Document",
  //   name: "bank_name",
  //   placeholder: "Document",
  //   type: "text",
  // },
  // {
  //   "InspectionAssignedTo ": "bank_name",
  //   isActiveFilter: false,

  //   label: "InspectionAssignedTo ",
  //   name: "bank_name",
  //   placeholder: "InspectionAssignedTo ",
  //   type: "text",
  // },

  {
    "CREATION DATE": "creation_date",
    isActiveFilter: false,

    label: "Creation Date Range",
    name: "creation_date",
    placeholder: "Creation Date",
    type: "date_from_to",
  },
  {
    "LAST UPDATED DATE": "last_updated_date",
    isActiveFilter: false,

    label: "Last Updated Date Range",
    name: "last_updated_date",
    placeholder: "Last Updated Date",
    type: "date_from_to",
  },

  // {
  //   "LAST UPDATED ACTIVE": "ACTIVE",
  //   isActiveFilter: false,

  //   label: "ACTIVE/DeActive",
  //   name: "active",
  //   placeholder: "Active/DeActive",
  //   type: "select",
  //   multi: false,
  //   options: [
  //     {
  //       label: "ACTIVE",
  //       value: "True",
  //     },
  //     {
  //       label: "DeActive",
  //       value: "False",
  //     },
  //   ],
  // },
];

const addEditFormFields = [
  {
    label: "WarehouseType",
    name: "warehouse_type",
    placeholder: "WarehouseType",
    type: "text",
  },
  {
    label: "WarehouseSubType",
    name: "warehouse_subtype",
    placeholder: "WarehouseSubType",
    type: "number",
  },
  {
    label: "Warehouse Name",
    name: "warehouse_name",
    placeholder: "Warehouse Name",
    type: "text",
  },
  {
    label: "Region",
    name: "region",
    placeholder: "Region",
    type: "text",
  },
  {
    label: "State",
    name: "state",
    placeholder: "State",
    type: "text",
  },
  // {
  //   label: "ZoneID ",
  //   name: "bank_name",
  //   placeholder: "ZoneID ",
  //   type: "text",
  // },
  {
    label: "District ",
    name: "district",
    placeholder: "District ",
    type: "text",
  },
  {
    label: "Area ",
    name: "area",
    placeholder: "Area ",
    type: "number",
  },
  {
    label: "WarehouseAddress ",
    name: "warehouse_address",
    placeholder: "WarehouseAddress ",
    type: "text",
  },
  {
    label: "WarehousePincode ",
    name: "warehouse_pincode",
    placeholder: "WarehousePincode ",
    type: "number",
  },
  {
    label: "NoOfChambers ",
    name: "no_of_chambers",
    placeholder: "NoOfChambers ",
    type: "number",
  },

  {
    label: "StandardCapacity ",
    name: "standard_capacity",
    placeholder: "StandardCapacity",
    type: "number",
  },
  {
    label: "CurrentCapacity ",
    name: "currrent_capacity",
    placeholder: "CurrentCapacity ",
    type: "number",
  },
  {
    label: "CurrentUtilisedCapacity ",
    name: "currrent_utilised_capacity",
    placeholder: "CurrentUtilisedCapacity ",
    type: "number",
  },
  {
    label: "NoOfWarehouseInArea",
    name: "no_of_warehouse_in_area",
    placeholder: "NoOfWarehouseInArea",
    type: "number",
  },
  {
    label: "LockinPeriod ",
    name: "lock_in_period",
    placeholder: "LockinPeriod",
    type: "number",
  },
  {
    label: "LockinPeriodMonth ",
    name: "lock_in_period_month",
    placeholder: "LockinPeriodMonth",
    type: "date",
  },
  {
    label: "CoveredArea",
    name: "covered_area",
    placeholder: "CoveredArea",
    type: "number",
  },
  {
    label: "SupervisorDayShift ",
    name: "supervisor_day_shift ",
    placeholder: "SupervisorDayShift ",
    type: "number",
  },
  {
    label: "SupervisorNightShift ",
    name: "supervisor_night_shift",
    placeholder: "SupervisorNightShift ",
    type: "number",
  },
  {
    label: "SecurityGuardDayShift ",
    name: "security_guard_day_shift",
    placeholder: "SecurityGuardDayShift ",
    type: "number",
  },
  {
    label: "SecurityGuardNightShift ",
    name: "security_guard_night_shift",
    placeholder: "SecurityGuardNightShift",
    type: "number",
  },
  {
    label: "Expected Commodity ",
    name: "expected_commodity",
    placeholder: "Expected Commodity ",
    type: "number",
  },
  {
    label: "CommodityInwardType",
    name: "commodity_inward_type",
    placeholder: "CommodityInwardType",
    type: "text",
  },
  {
    label: "PreStackCommodity",
    name: "prestack_commodity",
    placeholder: "PreStackCommodity",
    type: "number",
  },
  {
    label: "PreStackCommodity",
    name: "prestack_commodity_qty",
    placeholder: "PreStackCommodityQty",
    type: "number",
  },
  {
    label: "CCBanker",
    name: "banker_id",
    placeholder: "CCBanker",
    type: "number",
  },
  // {
  //   label: "FundingRequired",
  //   name: "bank_name",
  //   placeholder: "FundingRequired",
  //   type: "text",
  // },
  {
    label: "Rent ",
    name: "rent",
    placeholder: "Rent ",
    type: "number",
  },
  {
    label: "GGRevenueSharingRatio",
    name: "gg_revenue_ratio",
    placeholder: "GGRevenueSharingRatio",
    type: "number",
  },
  {
    label: "SecurityDepositeMonth",
    name: "security_deposit_month",
    placeholder: "SecurityDepositeMonth",
    type: "date",
  },
  {
    label: "AdvanceRent",
    name: "advance_rent",
    placeholder: "AdvanceRent",
    type: "number",
  },
  {
    label: "AdvanceRentMonth",
    name: "advance_rent_month",
    placeholder: "AdvanceRentMonth",
    type: "date",
  },
  // {
  //   label: "GST ",
  //   name: "bank_name",
  //   placeholder: "GST ",
  //   type: "text",
  // },
  // {
  //   label: "CommencementDate",
  //   name: "bank_name",
  //   placeholder: "CommencementDate",
  //   type: "text",
  // },
  // {
  //   label: "AgreementPeriodMonth",
  //   name: "bank_name",
  //   placeholder: "AgreementPeriodMonth",
  //   type: "text",
  // },

  {
    label: "NoticePeriodMonth ",
    name: "notice_period_month",
    placeholder: "NoticePeriodMonth ",
    type: "date",
  },

  {
    label: "Remarks",
    name: "remarks",
    placeholder: "Remarks",
    type: "text",
  },

  {
    label: "L1User",
    name: "l1_user",
    placeholder: "L1User",
    type: "number",
  },
  {
    label: "L2User",
    name: "l2_user",
    placeholder: "L2User",
    type: "number",
  },

  // {
  //   label: "DocumentID ",
  //   name: "bank_name",
  //   placeholder: "DocumentID ",
  //   type: "text",
  // },
  // {
  //   label: "InspectionAssignedTo ",
  //   name: "bank_name",
  //   placeholder: "InspectionAssignedTo ",
  //   type: "text",
  // },

  {
    label: "Active",
    name: "active",
    type: "switch",
  },
];

const schema = yup.object().shape({
  warehouse_type: yup.string().trim().required(""),
  warehouse_subtype: yup.string().trim().required(""),
  warehouse_name: yup.string().trim().required(""),
  region: yup.string().trim().required(""),
  state: yup.string().trim().required(""),
  // warehouse_type: yup.string().trim().required("Zone ID is required"),
  district: yup.string().trim().required(""),
  area: yup.string().trim().required(""),
  warehouse_address: yup.string().trim().required(""),
  warehouse_pincode: yup.number().required(""),
  no_of_chambers: yup.number().required(""),
  standard_capacity: yup.number().required(""),
  currrent_capacity: yup.number().required(""),
  currrent_utilised_capacity: yup.number().required(""),
  no_of_warehouse_in_area: yup.number().required(""),
  lock_in_period: yup.number().required(""),
  lock_in_period_month: yup.date().required(""),
  covered_area: yup.number().required(""),
  supervisor_day_shift: yup.number().required(""),
  supervisor_night_shift: yup.number().required(""),
  security_guard_day_shift: yup.string().trim().required(""),
  security_guard_night_shift: yup.number().required(""),
  expected_commodity: yup.number().required(""),
  commodity_inward_type: yup.string().trim().required(""),
  prestack_commodity: yup.number().required(""),
  prestack_commodity_qty: yup.number().required(""),
  banker_id: yup.number().required(""),
  // bank_name: yup.string().trim().required("Funding Required is required"),
  rent: yup.number().required(""),
  gg_revenue_ratio: yup.number().required(""),
  security_deposit_month: yup.date().required(""),
  advance_rent: yup.number().required(""),
  advance_rent_month: yup.date().required(""),
  // warehouse_type: yup.string().trim().required("GST type is required"),
  // warehouse_type: yup.string().trim().required("CommencementDate type is required"),
  // warehouse_type: yup.string().trim().required("AgreementPeriodMonth type is required"),
  notice_period_month: yup.date().required(""),
  remarks: yup.string().trim().required(""),
  l1_user: yup.number().required(""),
  l2_user: yup.number().required(""),
  // warehouse_type: yup.string().trim().required("DocumentID type is required"),
  // warehouse_type: yup.string().trim().required("InspectionAssignedTo type is required"),

  active: yup.string(),
});

export { filterFields, schema, addEditFormFields };
