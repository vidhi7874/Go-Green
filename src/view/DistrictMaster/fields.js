import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    Region: "substate__state__region__region_name",
    isActiveFilter: false,
    label: "Region",
    name: "substate__state__region__region_name",
    placeholder: "Region",
    type: "text",
  },
  {
    State: "substate__state__state_name",
    isActiveFilter: false,
    label: "State",
    name: "substate__state__state_name",
    placeholder: "State",
    type: "text",
  },
  {
    "SUBSTATE NAME": "substate__substate_name",
    isActiveFilter: false,
    label: "Sub State",
    name: "substate__substate_name",
    placeholder: "Sub State",
    type: "text",
  },
  {
    "DISTRICT NAME": "district_name",
    isActiveFilter: false,
    label: "District",
    name: "district_name",
    placeholder: "District",
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

const addEditFormFields = [
  {
    label: "District",
    name: "district_name",
    placeholder: "District",
    type: "text",
  },
];

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("substate.state.region.region_name", {
    cell: (info) => info.getValue(),
    header: "REGION ",
  }),
  columnHelper.accessor("substate.state.state_name", {
    cell: (info) => info.getValue(),
    header: "STATE ",
  }),
  columnHelper.accessor("substate.substate_name", {
    cell: (info) => info.getValue(),
    header: "Sub State ",
  }),
  columnHelper.accessor("district_name", {
    cell: (info) => info.getValue(),
    header: "DISTRICT ",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("created_at", {
    cell: (info) => info.getValue(),
    header: " Creation Date",
  }),
  columnHelper.accessor("updated_at", {
    cell: (info) => info.getValue(),
    header: " Last Updated Date",
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

const schema = yup.object().shape({
  district_name: yup
    .string()
    .trim()
    .required(() => null),
  region: yup
    .string()
    .trim()
    .required(() => null),
  state: yup
    .string()
    .trim()
    .required(() => null),
  is_active: yup.string(),
  substate: yup
    .string()
    .trim()
    .required(() => null),
});

export { filterFields, addEditFormFields, schema, columns };
