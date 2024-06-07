import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";
// import { BiEditAlt } from "react-icons/bi";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "BANK NAME": "bank_branch__bank__bank_name",
    isActiveFilter: false,

    label: "Bank Name",
    name: "bank_branch__bank__bank_name",
    placeholder: "Bank Name",
    type: "text",
  },
  {
    "BRANCH NAME": "bank_branch",
    isActiveFilter: false,

    label: "Branch Name",
    name: "bank_branch__branch_name",
    placeholder: "Branch Name",
    type: "text",
  },
  {
    "Bank CM Location Name": "bank_cm_location_name",
    isActiveFilter: false,

    label: "Branch Cm Location Name",
    name: "bank_cm_location_name",
    placeholder: "Bank Cm Location Name",
    type: "text",
  },
  {
    "CM Charges": "cm_charges",
    isActiveFilter: false,

    label: "CM Charges",
    name: "cm_charges",
    placeholder: "CM Charges",
    type: "number",
  },

  {
    "Fix Charges": "fix_charges",
    isActiveFilter: false,

    label: "Fix Charges",
    name: "fix_charges",
    placeholder: "Fix Charges",
    type: "number",
  },
  {
    "Minimum Commitment": "minimum_commitment",
    isActiveFilter: false,

    label: "Minimum Commitment",
    name: "minimum_commitment",
    placeholder: "Minimum Commitment",
    type: "number",
  },
  {
    "Creation Date": "created_at",
    isActiveFilter: false,
    label: "Creation Date Range",
    name: "creation_date",
    placeholder: "Creation Date",
    type: "date_from_to",
  },
  {
    "Last Updated Date": "last_updated_date",
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
  //   {
  //     name: "security_guard_name",
  //     label: "NAME",
  //     placeholder: "NAME",
  //     type: "text",
  //   },
  // {
  //   name: "bank_branch",
  //   label: "Branch Name",
  //   placeholder: "Branch Name",
  //   type: "select",
  // },
  {
    name: "bank_cm_location_name",
    label: "Branch Cm Location Name",
    placeholder: "Branch Cm Location Name",
    type: "text",
  },
  {
    name: "cm_charges",
    label: "CM Charges",
    placeholder: "CM Charges",
    type: "number",
  },
  {
    name: "fix_charges",
    label: "Fix Charges",
    placeholder: "Fix Charges",
    type: "number",
  },
  {
    name: "minimum_commitment",
    label: "Minimum Commitment",
    placeholder: "Minimum Commitment",
    type: "number",
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
  columnHelper.accessor("bank_branch.bank.bank_name", {
    cell: (info) => info.getValue(),
    header: "Bank",
  }),
  columnHelper.accessor("bank_branch.branch_name", {
    cell: (info) => info.getValue(),
    header: "BRANCH NAME",
  }),
  columnHelper.accessor("bank_cm_location_name", {
    cell: (info) => info.getValue(),
    header: "Bank CM Location Name",
  }),
  columnHelper.accessor("cm_charges", {
    cell: (info) => info.getValue(),
    header: "CM Charges",
  }),
  columnHelper.accessor("fix_charges", {
    cell: (info) => info.getValue(),
    header: "Fix Charges",
  }),
  columnHelper.accessor("minimum_commitment", {
    cell: (info) => info.getValue(),
    header: "Minimum Commitment",
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

const schema = yup.object().shape({
  bank:yup.string().trim().required(() => null),
  bank_branch: yup
    .string()
    .trim()
    .required(() => null),
  bank_cm_location_name: yup
    .string()
    .trim()
    .required(() => null),
  cm_charges: yup
    .number()
    .required(() => null)
    .typeError(""),
  fix_charges: yup
    .number()
    .required(() => null)
    .typeError(""),
  minimum_commitment: yup
    .number()
    .required(() => null)
    .typeError(""),
  is_active: yup.string(),
});

export { filterFields, addEditFormFields, schema, columns };
