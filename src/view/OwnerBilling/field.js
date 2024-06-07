import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Text } from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";

const columnHelper = createColumnHelper();
function getMonthName(monthNumber) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[monthNumber - 1]; // Adjust index since month numbers start from 1
}

const filterFields = [
  {
    "Rent Type ": "rent_type",
    isActiveFilter: false,
    label: "Rent Type",
    name: "rent_type",
    placeholder: "Enter Rent Type",
    type: "text",
  },
  {
    "Warehouse no ": "warehouse__warehouse_number",
    isActiveFilter: false,
    label: "Warehouse no",
    name: "warehouse__warehouse_number",
    placeholder: "Enter Warehouse no",
    type: "text",
  },
  {
    "REGION ": "warehouse__region__region_name",
    isActiveFilter: false,
    label: "Region",
    name: "warehouse__region__region_name",
    placeholder: "Region",
    type: "text",
  },
  {
    "State ": "warehouse__state__state_name",
    isActiveFilter: false,
    label: "State",
    name: "warehouse__state__state_name",
    placeholder: "State",
    type: "text",
  },
  {
    Substate: "warehouse__substate__substate_name",
    isActiveFilter: false,
    label: "Substate ",
    name: "warehouse__substate__substate_name",
    placeholder: "Substate",
    type: "text",
  },

  {
    "District ": "warehouse__district__district_name",
    isActiveFilter: false,
    label: "District",
    name: "warehouse__district__district_name",
    placeholder: "District",
    type: "text",
  },
  {
    "Area ": "warehouse__area__area_name",
    isActiveFilter: false,
    label: "Area",
    name: "warehouse__area__area_name",
    placeholder: "Area",
    type: "text",
  },
  {
    "Warehouse name ": "warehouse__warehouse_name",
    isActiveFilter: false,
    label: "Warehouse name",
    name: "warehouse__warehouse_name",
    placeholder: "Warehouse name",
    type: "text",
  },
  {
    "Owner name ": "warehouse_owner__warehouse_owner_name",
    isActiveFilter: false,
    label: "Owner name",
    name: "warehouse_owner__warehouse_owner_name",
    placeholder: "Owner name",
    type: "text",
  },
  {
    "Total Rent": "rent_ammount",
    isActiveFilter: false,
    label: "Total Rent",
    name: "rent_ammount",
    placeholder: "Total Rent",
    type: "number",
  },
  {
    "Billing Amount": "billing_ammount",
    isActiveFilter: false,
    label: "Billing Amount",
    name: "billing_ammount",
    placeholder: "Billing Amount",
    type: "number",
  },

 

  {
    "Start date": "start_date",
    isActiveFilter: false,
    label: "Start date",
    name: "start_date",
    placeholder: "Start date ",
    type: "date_from_to",
    // max: new Date().toISOString().split("T")[0],
  },

  {
    "End date": "end_date",
    isActiveFilter: false,
    label: "End date",
    name: "end_date",
    placeholder: "End date",
    type: "date_from_to",
    // max: new Date().toISOString().split("T")[0],
  },
];

const addEditFormFields = [
  {
    label: "Region ",
    name: "region_name",
    placeholder: "Region ",
    type: "text",
  },
  {
    label: "Active",
    name: "is_active",
    type: "switch",
  },
];

const schema = yup.object().shape({
  is_active: yup.string(),
  region_name: yup
    .string()
    .trim()
    .required(() => null),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  // columnHelper.accessor("invoice_number", {
  //   cell: (info) => info.getValue(),
  //   header: "Invoice no",
  // }),
  // columnHelper.accessor("created_at", {
  //   cell: (info) => info.getValue(),
  //   header: "Invoice Data",
  // }),
  columnHelper.accessor("rent_type", {
    cell: (info) => info.getValue(),
    header: "Rent Type",
  }),
  columnHelper.accessor("warehouse.warehouse_number", {
    cell: (info) => info.getValue(),
    header: "Warehouse NO",
  }),
  columnHelper.accessor("warehouse.warehouse_name", {
    cell: (info) => info.getValue(),
    header: "Warehouse Name",
  }),
  columnHelper.accessor("warehouse_owner.warehouse_owner_name", {
    cell: (info) => info.getValue(),
    header: "Owner Name",
  }),
  columnHelper.accessor("billing_month", {
    cell: (info) => {
      const billingDate = info.row.original.start_date; // Assuming 'billing_date' is a field in your row data
      const monthNumber = billingDate ? parseInt(billingDate.slice(5, 7), 10) : 0; // Extract mm and convert to number
      return monthNumber ? getMonthName(monthNumber) : ""; // Convert month number to month name
    },
    header: "Invoice Month",
  }),
  columnHelper.accessor("start_date", {
    cell: (info) => info.getValue(),
    header: "Start date",
  }),
  columnHelper.accessor("end_date", {
    cell: (info) => info.getValue(),
    header: "End date",
  }),

  columnHelper.accessor("rent_ammount", {
    cell: (info) => info.getValue(),
    header: "Total Rent",
  }),
  columnHelper.accessor("billing_ammount", {
    cell: (info) => info.getValue(),
    header: "Billing Amount",
  }),
];

export { filterFields, addEditFormFields, schema, columns };
