import * as yup from "yup";
import validation from "../../utils/validation";
import { Box, Switch, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();
const filterFields = [
  {
    "Client type": "client_type",
    isActiveFilter: false,

    label: "Client type",
    name: "client_type",
    placeholder: "Client type",
    type: "text",
  },
  {
    "Constitution of Client": "constitution_of_client__type_name",
    isActiveFilter: false,

    label: "Constitution of Client",
    name: "constitution_of_client__type_name",
    placeholder: "Constitution of Client",
    type: "text",
  },
  {
    "Name of Client ": "name_of_client",
    isActiveFilter: false,

    label: "Name of Client",
    name: "name_of_client",
    placeholder: "Name of Client",
    type: "text",
  },
  {
    "Name of Company": "name_of_company",
    isActiveFilter: false,

    label: "Name of Company",
    name: "name_of_company",
    placeholder: "Name of Company",
    type: "text",
  },
  {
    "PAN Card number": "clientkyc__document_number",
    isActiveFilter: false,

    label: "PAN Card number",
    name: "clientkyc__document_number",
    placeholder: "PAN Card number",
    type: "text",
  },
  // {
  //   "Mode of operations": "Mode of operations",
  //   isActiveFilter: false,

  //   label: "Mode of operations",
  //   name: "Mode of operations",
  //   placeholder: "Mode of operations",
  //   type: "text",
  // },
  {
    "Application status": "status__description",
    isActiveFilter: false,

    label: "Application status",
    name: "status__description",
    placeholder: "Application status",
    type: "text",
  },
  {
    "L 1 user": "l1_user__employee_name",
    isActiveFilter: false,

    label: "L 1 user",
    name: "l1_user__employee_name",
    placeholder: "L 1 user",
    type: "text",
  },
  {
    "L 2 user": "l2_user__employee_name",
    isActiveFilter: false,

    label: "L 2 user",
    name: "l2_user__employee_name",
    placeholder: "L 2 user",
    type: "text",
  },
  {
    "L 3 user": "l3_user__employee_name",
    isActiveFilter: false,

    label: "L 3 user",
    name: "l3_user__employee_name",
    placeholder: "L 3 user",
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
    "LAST UPDATED DATE": "last_update_date",
    isActiveFilter: false,
    label: "Last Updated Date Range",
    name: "last_update_date",
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
  warehouse_owner_name: yup
    .string()
    .trim()
    .required(() => null),
  owner_type: yup.number().required(() => null),
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
    .required(() => null),
  account_holder_name: yup
    .string()
    .trim()
    .required(() => null),
  account_number: yup
    .string()
    .trim()
    .required(() => null),
  ifsc_code: yup
    .string()
    .trim()
    .required(() => null),
  warehouse_name: yup
    .number()
    .required(() => null)
    .typeError(""),
  email_id: yup
    .string()
    .trim()
    .required(() => null),
  rent_amount: yup
    .number()
    .required(() => null)
    .typeError(""),
  revenue_sharing_ratio: yup
    .number()
    .required(() => null)
    .typeError(""),
  //   is_active: yup.string(),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "Sr. No",
  }),
  columnHelper.accessor("client.client_type", {
    cell: (info) => {
      // Assuming info.row.original.office is an array of offices
      const uniqueClientTypes = info?.row?.original?.office
        ?.map(el => el.client.client_type) // Extract client types
        ?.filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  
      // Convert the array to a comma-separated string
      const clientNames = uniqueClientTypes.join(",");
  
      // Return the resulting string or "-" if it's empty
      return clientNames || "-";
    },
    header: "Client type",
  }),  
  columnHelper.accessor("constitution_of_client.type_name", {
    cell: (info) => info.getValue() || "-",
    header: "Constitution of Client",
  }),
  columnHelper.accessor("name_of_client", {
    cell: (info) => info.getValue() || "-",
    header: "Name of Client",
  }),
  columnHelper.accessor("name_of_company", {
    cell: (info) => info.getValue() || "-",
    header: "Name of Company",
  }),
  columnHelper.accessor("pan_card_number", {
    cell: (info) => {
      console.log(
        info?.row?.original?.kyc
          ?.filter((el) => el.client_type_doc?.document_name === "Pan Card")
          .map((item) => item.document_number)
      );
      let pan_card_number = info?.row?.original?.kyc
        ?.filter((el) => el.client_type_doc?.document_name === "Pan Card")
        ?.map((item) => item?.document_number)
        .join(",");
      return pan_card_number || "-";
    },
    header: "PAN Card number",
  }),
  // columnHelper.accessor("Mode of operations", {
  //   cell: (info) => info.getValue() || "-",
  //   header: "Mode of operations",
  // }),
  columnHelper.accessor("status.description", {
    cell: (info) => info.getValue() || "",
    header: "Application status",
  }),
  columnHelper.accessor("l1_user.employee_name", {
    cell: (info) => info.getValue() || "-",
    header: "L 1 user",
  }),
  columnHelper.accessor("l2_user.employee_name", {
    cell: (info) => info.getValue() || "-",
    header: "L 2 user",
  }),
  columnHelper.accessor("l3_user.employee_name", {
    cell: (info) => info.getValue() || "-",
    header: "L 3 user",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("creation_date", {
    cell: (info) => info.getValue() || "-",
    header: "Creation date",
  }),
  columnHelper.accessor("last_update_date", {
    cell: (info) => info.getValue() || "-",
    header: "Last updated date",
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
