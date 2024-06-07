import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "COMMODITY NAME": "commodity_name",
    isActiveFilter: false,
    label: "Commodity Name",
    name: "commodity_name",
    placeholder: "Commodity Name",
    type: "text",
  },
  {
    "Commodity Type": "commodity_type__commodity_type",
    isActiveFilter: false,
    label: "Commodity Type",
    name: "commodity_type__commodity_type",
    placeholder: "Commodity Type",
    type: "text",
  },
  {
    "Primary commodity type": "commodity_type__primary_commodity_name__name",
    isActiveFilter: false,
    label: "Primary Commodity ",
    name: "commodity_type__primary_commodity_name__name",
    placeholder: "Primary Commodity ",
    type: "text",
  },
  {
    "CREATION DATE": "created_at",
    isActiveFilter: false,

    label: "Creation Date Range",
    name: "created_at",
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
  {
    "Fumigation Required": "fumigation_required",
    isActiveFilter: false,

    label: "Fumigation Required",
    name: "fumigation_required",
    placeholder: "Fumigation Required",
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
    " Lab Testing Required": "ACTIVE",
    isActiveFilter: false,

    label: " Lab Testing Required",
    name: "lab_testing_required",
    placeholder: " Lab Testing Required",
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

const addEditFormFields = [
  {
    name: "commodity_name",
    label: "Commodity Name",
    placeholder: "Commodity Name",
    type: "text",
  },
];

const qualityParameterSchema = yup.object().shape({
  quality_parameter: yup.number().typeError(""),
  quality_grade: yup.string().typeError(""),
  //  .required(() => null),

  permissible_value: yup.string().nullable().typeError(""),

  permissible_range_one: yup
    .number()
    .positive("valid positive number")
    .nullable()
    .typeError(""),

  permissible_range_two: yup
    .number()
    .positive("valid positive number")
    .nullable()
    .typeError(""),
});

// const qualityParameterSchema = yup.object().shape({
//   quality_parameter: yup.object().shape({
//     label: yup.string().required(() => null),
//     value: yup.number().required(() => null),
//     to_capture: yup
//       .string()
//       .required(() => null)
//       .typeError("")
//       .oneOf(["value", "range"], "Invalid value"),
//   }),

//   permissible_value: yup.number().when("quality_parameter.to_capture", {
//     is: "value",
//     then: () =>
//       yup
//         .number()
//         .required(() => null)
//         .typeError(""),
//   }),

//   permissible_range_one: yup.number().when("quality_parameter.to_capture", {
//     is: "range",

//     then: () =>
//       yup
//         .number()
//         .required(() => null)
//         .typeError(""),
//   }),

//   permissible_range_two: yup.number().when("quality_parameter.to_capture", {
//     is: "range",
//     then: () =>
//       yup
//         .number()
//         .required(() => null)
//         .typeError(""),
//   }),
// });

const schema = yup.object().shape({
  primary_commodity_name: yup
    .string()
    .trim()
    .required(() => null),
  commodity_name: yup
    .string()
    .trim()
    .required(() => null),
  is_active: yup.string(),
  fumigation_required: yup.string().trim(),
  lab_testing_required: yup.string().trim(),
  commodity_type: yup
    .string()
    .trim()
    .required(() => null),
  // primary_commodity_name: yup.string().trim().required(" "),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),

  columnHelper.accessor("commodity_name", {
    cell: (info) => info.getValue(),
    header: "COMMODITY name",
  }),
  columnHelper.accessor("commodity_type.commodity_type", {
    cell: (info) => info.getValue(),
    header: "Commodity Type",
  }),
  columnHelper.accessor("commodity_type.primary_commodity_name.name", {
    cell: (info) => info.getValue(),
    header: "Primary Commodity Type",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("created_at", {
    cell: (info) => info.getValue(),
    header: "Creation Date",
  }),

  columnHelper.accessor("last_updated_date", {
    cell: (info) => info.getValue(),
    header: "LAST UPDATED DATE",
  }),
  columnHelper.accessor("fumigation_required", {
    header: "Fumigation required",
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
  columnHelper.accessor("lab_testing_required", {
    header: "lab testing required",
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

export {
  filterFields,
  qualityParameterSchema,
  addEditFormFields,
  schema,
  columns,
};
