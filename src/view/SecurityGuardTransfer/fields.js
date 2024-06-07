import { createColumnHelper } from "@tanstack/react-table";

const filterFields = [
  {
    "REGION ": "region",
    isActiveFilter: false,
    label: "Region",
    name: "region",
    placeholder: "Region",
    type: "text",
  },
  {
    "STATE ": "state_name",
    isActiveFilter: false,
    label: "State ",
    name: "state_name",
    placeholder: "State",
    type: "text",
  },
  {
    "STATE CODE": "state_code",
    isActiveFilter: false,
    label: "State Code",
    name: "state_code",
    placeholder: "State Code",
    type: "text",
  },
  // {
  //   "TIN NO": "tin_no",
  //   isActiveFilter: false,
  //   label: "Tin No",
  //   name: "tin_no",
  //   placeholder: "Tin No",
  //   type: "text",
  // },
  {
    GSTN: "gstn",
    isActiveFilter: false,
    label: "GSTN",
    name: "gstn",
    placeholder: "GSTN",
    type: "text",
  },
  // {
  //   "NAV CODE": "nav_code",
  //   isActiveFilter: false,
  //   label: "Nav Code",
  //   name: "nav_code",
  //   placeholder: "Nav Code",
  //   type: "number",
  // },
  {
    ho_overhead: "ho_overhead",
    isActiveFilter: false,
    label: "HO Overhead",
    name: "ho_overhead",
    placeholder: "HO overhead",
    type: "text",
  },
  {
    state_overhead: "state_overhead",
    isActiveFilter: false,
    label: "State Overhead",
    name: "state_overhead",
    placeholder: "State Overhead",
    type: "text",
  },
  {
    "OFFICE ADDRESS": "state_india_office_addr",
    isActiveFilter: false,
    label: "Office Address",
    name: "state_india_office_addr",
    placeholder: "Office Address",
    type: "text",
  },
  {
    "CREATION DATE": "created_at",
    isActiveFilter: false,
    label: "Creation Date Range",
    name: "created_at",
    placeholder: "Creation Date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },
  {
    "LAST UPDATED DATE": "updated_at",
    isActiveFilter: false,
    label: "Last Updated Date Range",
    name: "updated_at",
    placeholder: "Last Updated Date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },
  {
    "LAST UPDATED ACTIVE": "ACTIVE",
    isActiveFilter: false,
    label: "Active",
    name: "is_active",
    placeholder: "Active",
    type: "select",
    multi: false,
    options: [
      {
        label: "Active",
        value: "True",
      },
      {
        label: "DeActive",
        value: "False",
      },
    ],
  },
];

const columnHelper = createColumnHelper();

const addEditFormFields = [
  {
    name: "state_name",
    label: "State ",
    placeholder: "State ",
    type: "text",
  },
  {
    name: "state_code",
    label: "State Code",
    placeholder: "State Code",
    type: "text",
  },
  {
    name: "tin_no",
    label: "TIN No",
    placeholder: "TIN No",
    type: "number",
  },
  {
    name: "gstn",
    label: "GSTN",
    placeholder: "GSTN",
    type: "text",
  },
  {
    name: "nav_code",
    label: "Nav Code",
    placeholder: "Nav Code",
    type: "number",
  },
  {
    name: "ho_overhead",
    label: "HO Overhead (Rs)",
    placeholder: "HO Overhead (Rs)",
    type: "number",
  },
  {
    name: "state_overhead",
    label: "State Overhead (Rs)",
    placeholder: "State Overhead (Rs)",
    type: "number",
  },

  {
    name: "state_india_office_addr",
    label: "Office Address",
    placeholder: "Office Address",
    type: "textArea",
  },
  {
    label: "Active",
    name: "is_active",
    type: "switch",
  },
];

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("warehouse.warehouse_number", {
    cell: (info) => info.getValue(),
    header: "WAREHOUSE",
  }),
  columnHelper.accessor("from_security_agency.security_agency_name", {
    cell: (info) => info.getValue(),
    header: "FROM AGENCY",
  }),
  columnHelper.accessor("from_security_guard.security_guard_name", {
    cell: (info) => info.getValue(),
    header: "FROM SECURITY GUARD",
  }),
  columnHelper.accessor("to_security_agency.security_agency_name", {
    cell: (info) => info.getValue(),
    header: "TO AGENCY",
  }),
  columnHelper.accessor("to_security_guard.security_guard_name", {
    cell: (info) => info.getValue(),
    header: "TO SECURITY GUARD",
  }),
  columnHelper.accessor("start_date", {
    cell: (info) => info.getValue(),
    header: "TRANSFER DATE",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
];

export { filterFields, addEditFormFields, columns };
