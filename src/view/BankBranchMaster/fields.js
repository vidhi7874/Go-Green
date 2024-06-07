import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("branch_name", {
    cell: (info) => info.getValue(),
    header: "Branch Name",
  }),
  columnHelper.accessor("bank.bank_name", {
    cell: (info) => info.getValue(),
    header: "Bank",
  }),
  columnHelper.accessor("region.region_name", {
    cell: (info) => info.getValue(),
    header: "Region ",
  }),
  columnHelper.accessor("state.state_name", {
    cell: (info) => info.getValue(),
    header: "State ",
  }),
  columnHelper.accessor("district.district_name", {
    cell: (info) => info.getValue(),
    header: "Discrict ",
  }),
  columnHelper.accessor("area.area_name", {
    cell: (info) => info.getValue(),
    header: "Area ",
  }),
  columnHelper.accessor("branch_address", {
    cell: (info) => info.getValue(),
    header: "Address",
  }),
  columnHelper.accessor("pincode", {
    cell: (info) => info.getValue(),
    header: "Pincode",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("created_at", {
    cell: (info) => info.getValue(),
    header: "Creation Date",
  }),

  columnHelper.accessor("updated_at", {
    cell: (info) => info.getValue(),
    header: "Last Updated Date",
  }),
  columnHelper.accessor("is_active", {
    // header: "ACTIVE",
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
          // onChange={(e) => handleActiveDeActive(e, info)}
          isChecked={info.row.original.is_active}
          // id="active_row"
          // isReadOnly
          // isChecked={flexRender(
          //   cell.column.columnDef.cell,
          //   cell.getContext()
          // )}
        />
      </Box>
    ),
    id: "active",
    accessorFn: (row) => row.active,
  }),
  // columnHelper.accessor("update", {
  //   // header: "UPDATE",
  //   header: () => (
  //     <Text id="update_col" fontWeight="800">
  //       UPDATE
  //     </Text>
  //   ),
  //   cell: (info) => (
  //     <Flex justifyContent="center" color="primary.700" id="update_row">
  //       <BiEditAlt
  //         // color="#A6CE39"
  //         fontSize="26px"
  //         cursor="pointer"
  //         onClick={() => editForm(info)}
  //       />
  //     </Flex>
  //   ),
  //   id: "update_col",
  //   accessorFn: (row) => row.update_col,
  // }),
];

const filterFields = [
  {
    "Branch Name": "branch_name",
    isActiveFilter: false,

    label: "Branch Name",
    name: "branch_name",
    placeholder: "Branch Name",
    type: "text",
  },
  {
    "Bank ": "bank__bank_name",
    isActiveFilter: false,

    label: "Bank",
    name: "bank__bank_name",
    placeholder: "Bank ",
    type: "text",
  },
  {
    Region: "region__region_name",
    isActiveFilter: false,

    label: "Region ",
    name: "region__region_name",
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
    "Discrict ": "district__district_name",
    isActiveFilter: false,

    label: "Discrict ",
    name: "district__district_name",
    placeholder: "Discrict ",
    type: "text",
  },
  {
    Area: "area__area_name",
    isActiveFilter: false,

    label: "Area",
    name: "area__area_name",
    placeholder: "Area",
    type: "text",
  },
  {
    Address: "branch_address",
    isActiveFilter: false,

    label: "Address",
    name: "branch_address",
    placeholder: "Address",
    type: "text",
  },
  {
    Pincode: "pincode",
    isActiveFilter: false,

    label: "Pincode ",
    name: "pincode",
    placeholder: "Pincode ",
    type: "number",
  },
  {
    "CREATION DATE": "created_at",
    isActiveFilter: false,
    label: "Creation Date Range",
    name: "created_at",
    placeholder: "CREATION DATE",
    type: "date_from_to",
  },
  {
    "LAST UPDATED DATE": "updated_at",
    isActiveFilter: false,
    label: "Last Updated Date Range",
    name: "updated_at",
    placeholder: "LAST UPDATED DATE",
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
    name: "branch_name",
    label: "Branch Name",
    placeholder: "Branch Name",
    type: "text",
  },
];

const schema = yup.object().shape({
  branch_name: yup
    .string()
    .trim()
    .required(() => null),
  bank: yup
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
  substate: yup
    .string()
    .trim()
    .required(() => null),
  district: yup
    .string()
    .trim()
    .required(() => null),
  area: yup
    .string()
    .trim()
    .required(() => null),
  branch_address: yup
    .string()
    .trim()
    .required(() => null),
  pincode: yup
    .number()
    .integer("Pin code must be an integer")
    .transform((value, originalValue) => {
      if (originalValue.trim() === "") {
        return NaN; // Treat empty input as NaN
      }
      return value;
    })
    .min(100000, "Pin code must be at least 6 digits")
    .max(999999, "Pin code cannot be longer than 6 digits")
    .required(() => null)
    .typeError(),
  is_active: yup.string(),
  email_attactment: yup.string(),
  authority_signature_letter: yup.string().notRequired(),
  branch_contact_detail: yup.array().of(
    yup.object().shape({
      authorized_name: yup.string().trim(),
      authorized_mobile_no: yup.string().trim(),
      authorized_email_id: yup.string().trim().email("Invalid email"),

      valid_from: yup.string().trim(),
      valid_to: yup
        .string()
        .trim()
        .test(
          "is-greater-than-start",
          "End date must be after start date",
          function (value) {
            const { valid_from } = this.parent;

            // If agreement_start_date is not provided, consider the validation as success
            if (!valid_from || !value) {
              return true;
            }

            // Compare the dates
            const startDate = new Date(valid_from);
            const endDate = new Date(value);

            return endDate >= startDate;
          }
        ),
      signature_img_upload_path: yup.string(),
      person_rank: yup.string(),
    })
  ),
});

export { filterFields, addEditFormFields, schema, columns };
