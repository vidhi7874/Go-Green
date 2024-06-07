import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("earthquake_zone_type", {
    cell: (info) => info.getValue(),
    header: "EARTH QUACK ZONE TYPE",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),

  columnHelper.accessor("creation_date", {
    cell: (info) => info.getValue(),
    header: "CREATION DATE",
  }),
  columnHelper.accessor("last_updated_date", {
    cell: (info) => info.getValue(),
    header: "LAST UPDATED DATE",
  }),
  columnHelper.accessor("is_active", {
    // header: "ACTIVE",
    header: () => (
      <Text  as="span" id="active_col" fontWeight="800">
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

const filterFields = [
  {
    "EARTH QUACK ZONE TYPE": "earthquake_zone_type",
    isActiveFilter: false,

    label: "Earthquake Zone Type",
    name: "earthquake_zone_type",
    placeholder: "Earthquake Zone Type",
    type: "text",
  },

  {
    "CREATION DATE": "creation_date",
    isActiveFilter: false,

    label: "Creation Date Range",
    name: "creation_date",
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
    name: "earthquake_zone_type",
    label: "Earthquake Zone Type",
    placeholder: "Earthquake Zone Type",
    type: "text",
  },

  // {
  //   name: "remarks",
  //   label: "Remark",
  //   placeholder: "Remark",
  //   type: "text",
  // },

  {
    label: "Active",
    name: "is_active",
    type: "switch",
  },
];

const schema = yup.object().shape({
  earthquake_zone_type: yup
    .string()
    .trim()
    .required(() => null),
  is_active: yup.string(),
  remarks: yup.string().trim(),
});

export { filterFields, addEditFormFields, schema, columns };
