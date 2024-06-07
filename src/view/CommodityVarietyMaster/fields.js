import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();
const filterFields = [
  {
    "COMMODITY VARIETY": "commodity_variety",
    isActiveFilter: false,
    label: "Commodity Variety",
    name: "commodity_variety",
    placeholder: "Commmodity Variety",
    type: "text",
  },
  {
    "COMMODITY NAME": "commodity_id__commodity_name",
    isActiveFilter: false,
    label: "Commodity Name",
    name: "commodity_id__commodity_name",
    placeholder: "Commmodity Name",
    type: "text",
  },
  {
    "COMMODITY TYPE": "commodity_id__commodity_type__commodity_type",
    isActiveFilter: false,
    label: "Commodity Type",
    name: "commodity_id__commodity_type__commodity_type",
    placeholder: "Commmodity Type",
    type: "text",
  },
  {
    "Primary commodity type":
      "commodity_id__commodity_type__primary_commodity_name__name",
    isActiveFilter: false,
    label: "Primary Commodity ",
    name: "commodity_id__commodity_type__primary_commodity_name__name",
    placeholder: "Primary Commodity ",
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
    "HCN CODE": "hsn_code",
    isActiveFilter: false,
    label: "HSN Code",
    name: "hsn_code",
    placeholder: "HSN Code",
    type: "number",
  },
  // {
  //   "FUMIGATION REQUIRED": "fumigation_required",
  //   isActiveFilter: false,
  //   label: "Fumigation Required",
  //   name: "fumigation_required",
  //   placeholder: "Fumigation Required",
  //   type: "select",
  //   multi: false,
  //   options: [
  //     {
  //       label: "Yes",
  //       value: "True",
  //     },
  //     {
  //       label: "No",
  //       value: "False",
  //     },
  //   ],
  // },
  // {
  //   "FUMIGATION DAYS": "fumigation_day",
  //   isActiveFilter: false,
  //   label: "Fumigation Days",
  //   name: "fumigation_day",
  //   placeholder: "Fumigation Day",
  //   type: "number",
  // },
  // {
  //   "LAB TESTING REQUIRED": "lab_testing_required",
  //   isActiveFilter: false,
  //   label: "Lab Testing Required",
  //   name: "active",
  //   placeholder: "Lab Testing Required",
  //   type: "select",
  //   multi: false,
  //   options: [
  //     {
  //       label: "Yes",
  //       value: "True",
  //     },
  //     {
  //       label: "No",
  //       value: "False",
  //     },
  //   ],
  // },
  {
    "FINAL EXPIRY DATE": "fed",
    isActiveFilter: false,
    label: "Final expiry date(months)",
    name: "fed",
    placeholder: "Final expiry date(months)",
    type: "number",
    //min: new Date().toISOString().split("T")[0],
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
    placeholder: "Last Updated date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },
  {
    Block: "is_block",
    isActiveFilter: false,
    label: "Block",
    name: "is_block",
    placeholder: "Block",
    type: "select",
    multi: false,
    options: [
      {
        label: "Yes",
        value: "True",
      },
      {
        label: "No",
        value: "False",
      },
    ],
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

const addEditFormFields = [];

const schema = yup.object().shape({
  primary_commodity_name: yup
    .string()
    .trim()
    .required(() => null),
  commodity_variety: yup
    .string()
    .trim()
    .required(() => null),
  commodity_type: yup
    .string()
    .trim()
    .required(() => null),
  description: yup
    .string()
    .trim()
    .required(() => null),
  is_active: yup.string(),
  is_block: yup.string(),
  commodity_id: yup
    .string()
    .trim()
    .required(() => null),
  fed: yup
    .number()
    .required(() => null)
    .typeError(""),
  hsn_code: yup
    .number()
    .required(() => null)
    .typeError(""),
  commodity_min_price: yup
    .number()
    .min(0)
    .required(() => null)
    .typeError(""),
  commodity_max_price: yup
    .number()
    .min(
      yup.ref("commodity_min_price"),
      "Maximum price must be greater than or equal to minimum price"
    )
    .required(() => null)
    .typeError(""),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("commodity_variety", {
    cell: (info) => info.getValue(),
    header: "Commodity variety",
  }),
  columnHelper.accessor("commodity_id.commodity_name", {
    cell: (info) => info.getValue(),
    header: "Commodity Name",
  }),
  columnHelper.accessor("commodity_id.commodity_type.commodity_type", {
    cell: (info) => info.getValue(),
    header: "Commodity Type",
  }),
  columnHelper.accessor(
    "commodity_id.commodity_type.primary_commodity_name.name",
    {
      cell: (info) => info.getValue(),
      header: "Primary Commodity Type",
    }
  ),
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: "description",
  }),
  columnHelper.accessor("hsn_code.hsn_code", {
    cell: (info) => info.getValue(),
    header: "Hsn code",
  }),
  columnHelper.accessor("commodity_min_price", {
    cell: (info) => info.getValue(),
    header: "Min price ",
  }),
  columnHelper.accessor("commodity_max_price", {
    cell: (info) => info.getValue(),
    header: "Max price ",
  }),

  columnHelper.accessor("fed", {
    cell: (info) => info.getValue(),
    header: "Final expiry date",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("creation_date", {
    cell: (info) => info.getValue(),
    header: "Creation Date ",
  }),
  columnHelper.accessor("last_updated_date", {
    cell: (info) => info.getValue(),
    header: "Last Updated Date ",
  }),
  columnHelper.accessor("is_block", {
    header: "Block",
    cell: (info) => (
      <Box>
        <Switch
          size="md"
          colorScheme="whatsapp"
          isReadOnly
          isChecked={info.getValue()}
        />
      </Box>
    ),
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
