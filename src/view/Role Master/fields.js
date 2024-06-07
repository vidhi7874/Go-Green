import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    RoleName: "role_name",
    isActiveFilter: false,

    label: "Role Name",
    name: "role_name",
    placeholder: "Role Name",
    type: "text",
  },
  {
    RoleName: "is_system_role",
    isActiveFilter: false,

    label: "Role Type",
    name: "is_system_role",
    placeholder: "Role Type",
    type: "select",
    multi: false,
    options: [
      {
        label: "System Created",
        value: "True",
      },
      {
        label: "User Created",
        value: "False",
      },
    ],
  },
  {
    Description: "description",
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
    name: "role_name",
    label: "Role Name",
    placeholder: "Role Name",
    type: "text",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Description",
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
  columnHelper.accessor("role_name", {
    cell: (info) => info.getValue(),
    header: "ROLE NAME",
  }),
  columnHelper.accessor("is_system_role", {
    header: "ROLE Type",
    cell: (info) => {
      const isSystemRole = info.row.original.is_system_role;
      const roleType = isSystemRole ? "System role" : "User Created role";

      return <span>{roleType}</span>;
    },
  }),
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: "DESCRIPTION",
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
    header: " Last Updated Date",
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

const schema = yup.object().shape({
  role_name: yup
    .string()
    .trim()
    .required(() => null),
  description: yup
    .string()
    .trim()
    .required(() => null),
  is_active: yup.string(),
});

export { filterFields, addEditFormFields, schema, columns };
