import * as yup from "yup";
import validation from "../../utils/validation";
import { Box, Switch, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();
const filterFields = [
  {
    "Warehouse name  ": "warehouseownermapping__warehouse__warehouse_name",
    isActiveFilter: false,
    label: "Warehouse name ",
    name: "warehouseownermapping__warehouse__warehouse_name",
    placeholder: "Warehouse name ",
    type: "text",
  },
  {
    "Owner Name": "owner_type__type_name",
    isActiveFilter: false,

    label: "Owner Type",
    name: "owner_type__type_name",
    placeholder: "Owner Type",
    type: "text",
  },
  {
    "Owner Name": "warehouse_owner_name",
    isActiveFilter: false,

    label: "Owner Name",
    name: "warehouse_owner_name",
    placeholder: "Owner Name",
    type: "text",
  },
  {
    "Owner Name": "warehouseownerkyc__document_number",
    isActiveFilter: false,

    label: "Pan Card Number",
    name: "warehouseownerkyc__document_number",
    placeholder: "Pan Card Number",
    type: "text",
  },
  {
    "REGION ": "warehouseownermapping__warehouse__region__region_name",
    isActiveFilter: false,
    label: "Region",
    name: "warehouseownermapping__warehouse__region__region_name",
    placeholder: "Region",
    type: "text",
  },
  {
    "State ": "warehouseownermapping__warehouse__state__state_name",
    isActiveFilter: false,
    label: "State",
    name: "warehouseownermapping__warehouse__state__state_name",
    placeholder: "State",
    type: "text",
  },
  {
    "Sub state  ": "warehouseownermapping__warehouse__substate__substate_name",
    isActiveFilter: false,
    label: "Sub state ",
    name: "warehouseownermapping__warehouse__substate__substate_name",
    placeholder: "Sub state ",
    type: "text",
  },
  {
    "District ": "warehouseownermapping__warehouse__district__district_name",
    isActiveFilter: false,
    label: "District",
    name: "warehouseownermapping__warehouse__district__district_name",
    placeholder: "District",
    type: "text",
  },
  {
    "Area ": "warehouseownermapping__warehouse__area__area_name",
    isActiveFilter: false,
    label: "Area",
    name: "warehouseownermapping__warehouse__area__area_name",
    placeholder: "Area",
    type: "text",
  },
  {
    "Owner Address ": "warehouse_owner_address",
    isActiveFilter: false,

    label: "Owner Address",
    name: "warehouse_owner_address",
    placeholder: "Owner Address",
    type: "text",
  },
  {
    "Owner ContactNo": "warehouse_owner_contact_no",
    isActiveFilter: false,

    label: "Contact Number",
    name: "warehouse_owner_contact_no",
    placeholder: "Owner ContactNo",
    type: "text",
  },

  // {
  //   "Rent Amt": "rent_amount",
  //   isActiveFilter: false,

  //   label: "Rent Amt",
  //   name: "rent_amount",
  //   placeholder: "Rent Amt",
  //   type: "number",
  // },
  // {
  //   "Revenue Sharing Ratio": "revenue_sharing_ratio",
  //   isActiveFilter: false,

  //   label: "Revenue Sharing Ratio",
  //   name: "revenue_sharing_ratio",
  //   placeholder: "Revenue Sharing Ratio",
  //   type: "number",
  // },
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
        label: "ACTIVE",
        value: "True",
      },
      {
        label: "DeActive",
        value: "False",
      },
    ],
  },
  // {
  //   "MINIMUM BAG SIZE": "minimum_bag_size",
  //   isActiveFilter: false,
  // },
  // {
  //   "MAXIMUM BAG SIZE": "maximum_bag_size",
  //   isActiveFilter: false,
  // },
  // {
  //   "RENT ON BAG M/T": "rent_on_bag",
  //   isActiveFilter: false,
  // },
];

const addEditFormFields = [
  // {
  //   name: "hiring_proposal_id.id",
  //   label: "Hiring Proposal ID",
  //   placeholder: "Hiring Proposal ID",
  //   type: "select",
  // },
  {
    name: "warehouse_owner_name",
    label: "Owner Name",
    placeholder: "Owner Name",
    type: "text",
  },
  {
    name: "warehouse_owner_contact_no",
    label: "Owner ContactNo",
    placeholder: "Owner ContactNo",
    type: "text",
  },
  {
    name: "warehouse_owner_address",
    label: "Owner Address",
    placeholder: "Owner Address",
    type: "text",
  },
  {
    name: "rent_amount",
    label: "Rent Amt",
    placeholder: "Rent Amt",
    type: "number",
  },
  {
    name: "revenue_sharing_ratio",
    label: "Revenue Sharing Ratio",
    placeholder: "Revenue Sharing Ratio",
    type: "number",
  },

  //   {
  //     label: "Active",
  //     name: "is_active",
  //     type: "switch",
  //   },
];

const schema = yup.object().shape({
  // hiring_proposal_id: yup.string().trim().required("Hiring proposal id is required"),
  pan_card: yup
    .string()
    .trim()
    .required(() => null)
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid Pan Card Number"),

  // warehouse_name: yup
  //   .string()
  //   .trim()
  //   .required(() => null),

  warehouse_owner_name: yup
    .string()
    .trim()
    .required(() => null),

  //owner_type: yup.number().required(() => null),
  // doc_type: yup.object().shape({
  //   value: yup.string().required(() => null), // Assuming value should be a number and required
  //   label: yup.string().required(() => null), // Assuming label should be a string and required
  // }),

  warehouse_owner_contact_no: yup
    .string()
    .trim()
    .matches(validation.phoneRegExp, "Contact number is not valid")
    .required(() => null),
  warehouse_owner_address: yup
    .string()
    .trim()
    .required(() => null),
  alternate_mobile_no: yup
    .string()
    .trim()
    .matches(validation.phoneRegExp, " Number is not valid")
    .required(() => null),

  // account_holder_name: yup
  //   .string()
  //   .trim()
  //   .required(() => null),
  // account_number: yup
  //   .string()
  //   .trim()
  //   .required(() => null),
  // ifsc_code: yup
  //   .string()
  //   .trim()
  //   .required(() => null),

  email_id: yup
    .string()
    .trim()
    .required(() => null),

  // rent_amount: yup
  //   .number()
  //   .required(() => null)
  //   .typeError(""),
  // revenue_sharing_ratio: yup
  //   .number()
  //   .required(() => null)
  //   .typeError(""),
  //   is_active: yup.string(),

  // KYC Details
  // doc_type: yup.string(), //.required(() => null),
  // doc_type: yup.object().shape({
  //   value: yup.string(), // Assuming value should be a number and required
  //   label: yup.string(), // Assuming label should be a string and required
  // }),

  // owner_type_doc: yup.object().shape({
  //   value: yup.string(), // Assuming value should be a number and required
  //   label: yup.string(), // Assuming label should be a string and required
  // }),
  document_number: yup.string().trim().max(25), //.required(false),
  pan_document_path: yup.string(), //.required(() => null),
  document_path: yup.string(), //.required(() => null),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "SR. NO",
  }),
  // columnHelper.accessor("warehouse.warehouse_name", {
  //   cell: (info) => info.getValue() ?? "N/A",
  //   header: "WH name",
  // }),
  columnHelper.accessor("warehouse_owner_name", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "WH Owner name",
  }),
  columnHelper.accessor("owner_type.type_name", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "Wh owner type",
  }),
  columnHelper.accessor("email_id", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "Email ID",
  }),
  // columnHelper.accessor("region.region_name", {
  //   cell: (info) => info.getValue() ?? "N/A",
  //   header: "Region",
  // }),
  // columnHelper.accessor("state.state_name", {
  //   cell: (info) => info.getValue() ?? "N/A",
  //   header: "State",
  // }),
  // columnHelper.accessor("substate.substate_name", {
  //   cell: (info) => info.getValue() ?? "N/A",
  //   header: "Sub state",
  // }),
  // columnHelper.accessor("district.district_name", {
  //   cell: (info) => info.getValue() ?? "N/A",
  //   header: "District",
  // }),
  // columnHelper.accessor("area.area_name", {
  //   cell: (info) => info.getValue() ?? "N/A",
  //   header: "area",
  // }),
  columnHelper.accessor("warehouse_owner_address", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "Owner Address",
  }),
  columnHelper.accessor("warehouse_owner_contact_no", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "Owner ContactNo",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),

  // columnHelper.accessor("is_active", {
  //   // header: "ACTIVE",
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
  //         // onChange={(e) => handleActiveDeActive(e, info)}
  //         isChecked={info.row.original.is_active}
  //         // id="active_row"
  //         // isReadOnly
  //         // isChecked={flexRender(
  //         //   cell.column.columnDef.cell,
  //         //   cell.getContext()
  //         // )}
  //       />
  //     </Box>
  //   ),
  //   id: "active",
  //   accessorFn: (row) => row.active,
  // }),
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

export { filterFields, addEditFormFields, schema, columns };
