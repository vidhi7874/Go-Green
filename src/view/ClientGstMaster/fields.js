import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Text } from "@chakra-ui/react";
import { BsEye } from "react-icons/bs";

const columnHelper = createColumnHelper();

const viewForm = (info) => {
  // console.log("info --> ", info);
  // navigate(`/warehouse-proposal`, {
  //   state: {
  //     details: {
  //       id: info.row.original.id,
  //       view: true,
  //       warehouse_type: info.row.original.warehouse_type,
  //       warehouse_subtype: info.row.original.warehouse_subtype,
  //     },
  //   },
  // });
};

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),

  columnHelper.accessor("branch_name", {
    cell: (info) => info.getValue(),
    header: "Client Name",
  }),

  columnHelper.accessor("state.state_name", {
    cell: (info) => info.getValue(),
    header: "State Name",
  }),

  columnHelper.accessor("branch_address", {
    cell: (info) => info.getValue(),
    header: "Address",
  }),
  columnHelper.accessor("pincode", {
    cell: (info) => info.getValue(),
    header: "GST NO",
  }),
  columnHelper.accessor("created_at", {
    cell: (info) => info.getValue(),
    header: "Creation Date",
  }),

  columnHelper.accessor("updated_at", {
    cell: (info) => info.getValue(),
    header: "Last Updated Date",
  }),
  columnHelper.accessor("view", {
    header: () => (
      <Text as="span" id="update_col" fontWeight="800">
        View
      </Text>
    ),
    cell: (info) => (
      <Flex justifyContent="center" color="primary.700" id="update_row">
        <BsEye
          fontSize="26px"
          cursor="pointer"
          onClick={() => viewForm(info)}
        />
      </Flex>
    ),
    id: "view_col",
    accessorFn: (row) => row.view_col,
  }),
  // columnHelper.accessor("is_active", {
  //   header: () => (
  //     <Text id="active_col" fontWeight="800">
  //       Active
  //     </Text>
  //   ),
  //   cell: (info) => (
  //     <Box id="active_row">
  //       <Switch
  //         size="md"
  //         colorScheme="whatsapp"
  //         isChecked={info.row.original.is_active}
  //       />
  //     </Box>
  //   ),
  //   id: "active",
  //   accessorFn: (row) => row.active,
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
    .required(() => null)
    .typeError(""),
  is_active: yup.string(),
  group_email: yup.string().required(""),
  branch_contact_detail: yup.array().of(
    yup.object().shape({
      authorized_name: yup.string().required("").trim(),
      authorized_mobile_no: yup.string().trim().required(" "),
      authorized_email_id: yup
        .string()
        .trim()
        .email("Invalid email")
        .required(""),
      valid_from: yup.string().trim().required(""),
      valid_to: yup
        .string()
        .required("")
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
      signature_img_upload_path: yup.string().required(""),
      person_rank: yup.string().required(""),
    })
  ),
});

export { filterFields, addEditFormFields, schema, columns };
