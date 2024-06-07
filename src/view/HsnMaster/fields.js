import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "HSN CODE": "hsn_code",
    isActiveFilter: false,

    label: "HSN Code",
    name: "hsn_code",
    placeholder: "HSN Code",
    type: "number",
  },
  {
    "IGST%": "igst",
    isActiveFilter: false,

    label: "IGST% ",
    name: "igst",
    placeholder: "IGST% ",
    type: "number",
  },
  {
    "SGST% ": "sgst",
    isActiveFilter: false,

    label: "SGST% ",
    name: "sgst",
    placeholder: "SGST% ",
    type: "number",
  },
  {
    "CGST% ": "cgst",
    isActiveFilter: false,

    label: "CGST% ",
    name: "cgst",
    placeholder: "CGST% ",
    type: "number",
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
  // {
  //   name: "hsn_code",
  //   label: "HSN CODE",
  //   placeholder: "HSN CODE",
  //   type: "number",
  // },
  {
    name: "description",
    label: "Description",
    placeholder: "Description",
    type: "text",
  },
];

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("hsn_code", {
    cell: (info) => info.getValue(),
    header: "HSN CODE",
  }),
  columnHelper.accessor("igst", {
    cell: (info) => info.getValue(),
    header: " IGST%",
  }),
  columnHelper.accessor("sgst", {
    cell: (info) => info.getValue(),
    header: "SGST%",
  }),
  columnHelper.accessor("cgst", {
    cell: (info) => info.getValue(),
    header: "CGST%",
  }),
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: "Description",
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
    header: " Last Updated Date",
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

const schema = yup.object().shape({
  hsn_code: yup
    .number()
    .integer()
     .required(() => null).typeError()
    .min(1000, "HSN code must be at least 4 digits")
    .max(99999999, "HSN code cannot exceed 8 digits")
   ,
  start_date: yup.string().required(() => null).typeError(),
  end_date: yup 
    .string()
    .required(() => null).typeError()
    .test(
      "is-greater-than-start",
      "End date must be after start date",
      function (value) {
        const { start_date } = this.parent;

        // If agreement_start_date is not provided, consider the validation as success
        if (!start_date || !value) {
          return true;
        }

        // Compare the dates
        const startDate = new Date(start_date);
        const endDate = new Date(value);

        return endDate >= startDate;
      }
    ),
    igst: yup.number().min(0, "Please enter a non-negative number").required(() => null).typeError(),

  sgst: yup.number().required(() => null).typeError(),
  cgst: yup.number().required(() => null).typeError(),
  description: yup.string().trim().required(() => null).typeError(),
  is_active: yup.string(),
});

const schema2 = yup.object().shape({
  hsn_code: yup
    .number()
    .integer()
    .min(1000, "HSN code must be at least 4 digits")
    .max(99999999, "HSN code cannot exceed 8 digits")
    .required(() => null).typeError(),
  description: yup.string().trim().required(() => null).typeError(),
  is_active: yup.string(),
  hsn: yup.array().required(""),
});

export { filterFields, addEditFormFields, schema, columns, schema2 };
