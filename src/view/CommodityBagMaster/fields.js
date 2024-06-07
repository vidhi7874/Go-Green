import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "Commodity Type": "commodity__commodity_type__commodity_type",
    isActiveFilter: false,

    label: "Commodity Type",
    name: "commodity__commodity_type__commodity_type",
    placeholder: "Commodity Type",
    type: "text",
  },
  {
    "Commodity Id": "commodity__commodity_name",
    isActiveFilter: false,  

    label: "Commodity Name",
    name: "commodity__commodity_name",
    placeholder: "Commodity Name",
    type: "text",
  },
  {
    "Primary commodity type":
      "commodity__commodity_type__primary_commodity_name__name",
    isActiveFilter: false,
    label: "Primary Commodity ",
    name: "commodity__commodity_type__primary_commodity_name__name",
    placeholder: "Primary Commodity ",
    type: "text",
  },
  {
    "Bag Size": "bag_size",
    isActiveFilter: false,

    label: "Bag Size",
    name: "bag_size",
    placeholder: "Bag Size",
    type: "number",
  },
  {
    "CREATION DATE": "creation_date",
    isActiveFilter: false,
    label: "Creation Date Range",
    name: "creation_date",
    placeholder: "CREATION DATE",
    type: "date_from_to",
  },
  {
    "LAST UPDATED DATE": "last_updated_date",
    isActiveFilter: false,
    label: "Last Updated Date Range",
    name: "last_updated_date",
    placeholder: "LAST UPDATED DATE",
    type: "date_from_to",
  },
  {
    "LAST UPDATED ACTIVE": "is_active",
    isActiveFilter: false,

    label: "ACTIVE/DeActive",
    name: "is_active",
    placeholder: "Active/DeActive",
    type: "select",
    multi: false,
    options: [
      {
        label: "ACTIVE",
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
    label: "Bag Size(Kg)",
    name: "bag_size",
    placeholder: "Bag Size(Kg)",
    type: "number",
  },
  {
    label: "Space / bag / sq. ft",
    name: "space_per_bag_sq_ft",
    placeholder: "Space / bag / sq. ft",
    type: "number",
  },
  {
    label: "Stack height",
    name: "stack_height",
    placeholder: "Stack height",
    type: "number",
  },

  {
    label: "Active",
    name: "is_active",
    type: "switch",
  },
];

const schema = yup.object().shape({
  primary_commodity_name: yup
    .string()
    .trim()
    .required(() => null),
  commodity_type: yup
    .string()
    .trim()
    .required(() => null),
  commodity: yup
    .string()
    .trim()
    .required(() => null),
  bag_size: yup
    .number()
    .required(() => null)
    .typeError(""),
  space_per_bag_sq_ft: yup
    .number()
    .required(() => null)
    .typeError(""),
  stack_height: yup
    .number()
    .required(() => null)
    .typeError(""),
  is_active: yup.string(),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  
  columnHelper.accessor("commodity.commodity_name", {
    cell: (info) => info.getValue(),
    header: "Commodity Name",
  }),
  columnHelper.accessor("commodity.commodity_type.commodity_type", {
    cell: (info) => info.getValue(),
    header: "Commodity Type",
  }),
  columnHelper.accessor(
    "commodity.commodity_type.primary_commodity_name.name",
    {
      cell: (info) => info.getValue(),
      header: "Primary Commodity Type",
    }
  ),
  columnHelper.accessor("bag_size", {
    cell: (info) => info.getValue(),
    header: "Bag Size",
  }),
  columnHelper.accessor("space_per_bag_sq_ft", {
    cell: (info) => info.getValue(),
    header: "Space / bag / sq. ft",
  }),
  columnHelper.accessor("stack_height", {
    cell: (info) => info.getValue(),
    header: "Stack height",
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

export { filterFields, addEditFormFields, schema, columns };
