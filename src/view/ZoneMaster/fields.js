import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const filterFields = [
  {
    " Region": "state__region__region_name",
    isActiveFilter: false,
    label: "Region ",
    name: "state__region__region_name",
    placeholder: "Region ",
    type: "text",
  },
  {
    " State": "state__state_name",
    isActiveFilter: false,
    label: "State ",
    name: "state__state_name",
    placeholder: "State ",
    type: "text",
  },
  {
    "Zone Name": "substate_name",
    isActiveFilter: false,
    label: "Sub State ",
    name: "substate_name",
    placeholder: "Sub State ",
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
    "LAST UPDATED DATE": "last_updated_date",
    isActiveFilter: false,
    label: "Last Updated Date Range",
    name: "last_updated_date",
    placeholder: "Last Updated Date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },
  {
    "LAST UPDATED ACTIVE": "is_active",
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

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("state.region.region_name", {
    cell: (info) => info.getValue(),
    header: "Region",
  }),
  columnHelper.accessor("state.state_name", {
    cell: (info) => info.getValue(),
    header: "State",
  }),
  columnHelper.accessor("substate_name", {
    cell: (info) => info.getValue(),
    header: "Sub State ",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("created_at", {
    cell: (info) => info.getValue(),
    header: " Creation Date",
  }),
  columnHelper.accessor("last_updated_date", {
    cell: (info) => info.getValue(),
    header: "Last Updated Date",
  }),
  columnHelper.accessor("is_active", {
    header: () => (
      <Text as="span" id="active_col" fontWeight="800">
        Active
      </Text>
    ),
    cell: (info) => (
      <Box id="active_row">
        <Switch
          size="md"
          colorScheme="whatsapp"
          isChecked={info.row.original.is_active}
        />
      </Box>
    ),
    id: "active",
    accessorFn: (row) => row.active,
  }),
];

const addEditFormFields = [
  {
    name: "substate_name",
    label: "Sub State ",
    placeholder: "Sub State ",
    type: "text",
  },
];

const schema = yup.object().shape({
  substate_name: yup
    .string()
    .trim()
    .required(() => null),
  state: yup
    .string()
    .trim()
    .required(() => null),
  region: yup
    .string()
    .trim()
    .required(() => null),
  is_active: yup.string(),
});

const BreadcrumbLinks = [
  {
    pathLink: "/test",
    label: "Test ",
  },
  {
    pathLink: "/dd",
    label: "Test-one ",
  },
  {
    pathLink: "/teerest",
    label: "Test-two",
  },
];

export { filterFields, addEditFormFields, schema, BreadcrumbLinks, columns };
