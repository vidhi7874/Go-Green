import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "WAREHOUSE TYPE NAME": "warehouse_type_name",
    isActiveFilter: false,

    label: "Warehouse Type",
    name: "warehouse_type_name",
    placeholder: "Warehouse Type",
    type: "text",
  },
  {
    DESCRIPTION: "description",
    isActiveFilter: false,

    label: "Description",
    name: "description",
    placeholder: "Description",
    type: "text",
  },
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
    placeholder: "last Updated Date",
    type: "date_from_to",
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
    name: "warehouse_type_name",
    label: "Warehouse Type Name",
    placeholder: "Warehouse Type Name",
    type: "text",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Description",
    type: "text",
  },
  {
    label: "Active",
    name: "is_active",
    type: "switch",
  },
];

const schema = yup.object().shape({
  warehouse_type_name: yup
    .string()
    .trim()
    .required(() => null),
  description: yup
    .string()
    .trim()
    .required(() => null),
  is_active: yup.string(),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("warehouse_type_name", {
    cell: (info) => info.getValue(),
    header: "Warehouse Type ",
  }),
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: "description",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),

  columnHelper.accessor("creation_date", {
    cell: (info) => info.getValue(),
    header: "Creation Date",
  }),

  columnHelper.accessor("last_updated_date", {
    cell: (info) => info.getValue(),
    header: "Last Updated Date ",
  }),

  columnHelper.accessor("is_active", {
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

export { filterFields, addEditFormFields, schema, columns };
