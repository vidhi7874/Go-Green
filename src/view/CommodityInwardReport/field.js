import * as yup from "yup";
import validation from "../../utils/validation";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { localStorageService } from "../../services/localStorge.service";
import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import configuration from "../../config/configuration";
import { BiDownload } from "react-icons/bi";
// import { BiEditAlt } from "react-icons/bi";
// import { BsEye } from "react-icons/bs";



function downloadPdf(info) {
  let whrNo = info.row?.original?.cir__id?.whr_no;

  if (!whrNo) {
    console.error("Error: Missing whr_no in row data.");
    return;
  }

  let id = info.row?.original?.cir__id.id;
  let url = `${configuration.BASE_URL}billing_flow/whr_billing_download/${id}/`;

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `${whrNo}.pdf`; // Set the filename with whr_no.pdf
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error downloading PDF:", error));
}


const columnHelper = createColumnHelper();

const filterFields = [
  {
    "CIR No": "cir__cir_no",
    isActiveFilter: false,

    label: "CIR No",
    name: "cir__cir_no",
    placeholder: "Enter CIR No",
    type: "text",
  },
  {
    "WHR No": "cir__whr_no",
    isActiveFilter: false,

    label: "WHR No",
    name: "cir__whr_no",
    placeholder: "Enter WHR No",
    type: "text",
  },
  {
    Region: "warehouse__region__region_name",
    isActiveFilter: false,

    label: "Region",
    name: "warehouse__region__region_name",
    placeholder: "Enter Region",
    type: "text",
  },
  {
    State: "warehouse__state__state_name",
    isActiveFilter: false,

    label: "State",
    name: "warehouse__state__state_name",
    placeholder: "Enter State",
    type: "text",
  },
  {
    "Sub state": "warehouse__substate__substate_name",
    isActiveFilter: false,

    label: "Sub state",
    name: "warehouse__substate__substate_name",
    placeholder: "Enter Sub state",
    type: "text",
  },
  {
    District: "warehouse__district__district_name",
    isActiveFilter: false,

    label: "District",
    name: "warehouse__district__district_name",
    placeholder: "Enter District",
    type: "text",
  },
  {
    area: "warehouse__area__area_name",
    isActiveFilter: false,

    label: "Area",
    name: "warehouse__area__area_name",
    placeholder: "Enter Area",
    type: "text",
  },
  {
    "Warehouse name": "warehouse",
    isActiveFilter: false,

    label: "Warehouse name",
    name: "warehouse",
    placeholder: "Enter Warehouse name",
    type: "text",
  },
  {
    "Chamber No": "chamber__chamber_number",
    isActiveFilter: false,

    label: "Chamber No",
    name: "chamber__chamber_number",
    placeholder: "Enter Chamber No",
    type: "text",
  },
  {
    "Client name": "client",
    isActiveFilter: false,

    label: "Client name",
    name: "client",
    placeholder: "Enter Client name",
    type: "text",
  },

  {
    "Commodity name": "commodity",
    isActiveFilter: false,

    label: "Commodity name",
    name: "commodity",
    placeholder: "Enter Commodity name",
    type: "text",
  },
  {
    "Commodity variety": "commodity_variety",
    isActiveFilter: false,

    label: "Commodity variety",
    name: "commodity_variety",
    placeholder: "Enter Commodity variety",
    type: "text",
  },
  {
    "Bag Size ": "expected_bag_weight__bag_size",
    isActiveFilter: false,

    label: "Bag Size",
    name: "expected_bag_weight__bag_size",
    placeholder: "Enter Bag Size  ",
    type: "text",
  },

  {
    "Gate Pass Count": "gatepass_count",
    isActiveFilter: false,

    label: "Gate Pass Count",
    name: "gatepass_count",
    placeholder: "Enter Gate Pass Count",
    type: "text",
  },
  {
    "gatepass creation date": "gate_pass_date_time_in__date",
    isActiveFilter: false,

    label: "gatepass creation date",
    name: "gate_pass_date_time_in__date",
    placeholder: "gatepass creation date",
    type: "date_from_to",
  },
  {
    "cir status": "cir__status__description",
    isActiveFilter: false,

    label: "cir status",
    name: "cir__status__description",
    placeholder: "cir status",
    type: "text",
  },
  {
    "CIR L 1 user": "cir__l1_user__employee_name",
    isActiveFilter: false,

    label: "CIR L 1 user",
    name: "cir__l1_user__employee_name",
    placeholder: "CIR L 1 user",
    type: "text",
  },
  {
    "CIR L 2 user": "cir__l2_user__employee_name",
    isActiveFilter: false,

    label: "CIR L 2 user",
    name: "cir__l2_user__employee_name",
    placeholder: "CIR L 2 user",
    type: "text",
  },
  {
    "cIR L 3 user": "cir__l3_user__employee_name",
    isActiveFilter: false,

    label: "CIR L 3 user",
    name: "cir__l3_user__employee_name",
    placeholder: "CIR L 3 user",
    type: "text",
  },
  // {
  //   "Pending gate pass count": "Pending gate pass count",
  //   isActiveFilter: false,

  //   label: "Pending gate pass count",
  //   name: "Pending gate pass count",
  //   placeholder: "Pending gate pass count",
  //   type: "text",
  // },
  // {
  //   "Create cir": "Create cir",
  //   isActiveFilter: false,

  //   label: "Create cir",
  //   name: "Create cir",
  //   placeholder: "Create cir",
  //   type: "text",
  // },

  {
    "QC report status": "cir__qc_report_status",
    isActiveFilter: false,

    label: "QC report status",
    name: "cir__qc_report_status",
    placeholder: "QC report status",
    type: "text",
  },

  {
    "CIR Creation date ": "created_at",
    isActiveFilter: false,
    label: "CIR Creation date",
    name: "created_at",
    placeholder: "Enter Creation date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },
  {
    "CIR Last updated date": "updated_at",
    isActiveFilter: false,
    label: "CIR Last updated date",
    name: "updated_at",
    placeholder: "Enter Last updated date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },
  // {
  //   "LAST UPDATED ACTIVE": "ACTIVE",
  //   isActiveFilter: false,

  //   label: "Active",
  //   name: "is_active",
  //   placeholder: "Active",
  //   type: "select",
  //   multi: false,
  //   options: [
  //     {
  //       label: "ACTIVE",
  //       value: "True",
  //     },
  //     {
  //       label: "DeActive",
  //       value: "False",
  //     },
  //   ],
  // },
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
  warehouse: yup
    .string()
    .trim()
    .required(() => null),
  chamber: yup
    .string()
    .trim()
    .required(() => null),
  commodity: yup
    .string()
    .trim()
    .required(() => null),
  commodity_variety: yup
    .string()
    .trim()
    .required(() => null),
  agent_name: yup
    .string()
    .trim()
    .required(() => null),
  total_net_weight: yup
    .string()
    .trim()
    .required(() => null),
  total_no_of_bags: yup.number().required(() => null),
  // market_rate: yup
  //   .number()
  //   .trim()
  //   .required(() => null),

  market_rate: yup
    .number()
    .typeError("")
    .required(() => null)
    .test(
      "not-zero",
      "Commodity price not found. kindly update commodity current price.",
      (value) => value !== 0
    ),

  value_of_commodity: yup
    .string()
    .trim()
    .required(() => null),
  client_representative_name: yup
    .string()
    .trim()
    .required(() => null),
  client_representative_mobile_no: yup
    .string()
    .trim()
    .typeError("")
    .matches(validation.phoneRegExp, "Invalid Mobile Number")
    .required(() => null),
  client_signature: yup
    .string()
    .trim()
    .required(() => null),
  client_id_proof_path: yup
    .string()
    .trim()
    .required(() => null),
  authority_letter_path: yup
    .string()
    .trim()
    .required(() => null),
  // spilage_bag_count: yup
  //   .string()
  //   .trim()
  //   .required(() => null),

  // spilage_bag_count: yup
  //   .number()
  //   .typeError("")
  //   .integer("Spillage bag count must be an integer")
  //   .positive("Spillage bag count must be a positive integer")
  //   .required(() => null),

  // spilage_bag_count: yup
  //   .number()
  //   .typeError("")
  //   .integer("Spillage bag count must be an integer")
  //   .positive("Spillage bag count must be a positive integer")
  //   .lessThan(
  //     yup.ref("total_no_of_bags"),
  //     "Spillage bag count must be less than total number of bags"
  //   )
  //   .required(() => null),

  // spilage_bag_count: yup
  //   .number()
  //   .typeError("")
  //   .integer("Spillage bag count must be an integer")
  //   .moreThan(-1, "Spillage bag count must be 0 or a positive integer")
  //   .lessThan(
  //     yup.ref("total_no_of_bags"),
  //     "Spillage bag count must be less than total number of bags"
  //   )
  //   .required(() => null),

  spilage_bag_count: yup
    .number()
    .typeError("")
    .integer("Spillage bag count must be an integer")
    .moreThan(-1, "Spillage bag count must be 0 or a positive integer")
    .max(
      yup.ref("total_no_of_bags"),
      "Spillage bag count must be less than or equal to total number of bags"
    )
    .required(() => null),

  supervisor_name: yup
    .string()
    .trim()
    .required(() => null),
  remarks: yup.string().trim(),
  gatepass: yup.array(),
});

console.log(
  "columnHelper ",
  columnHelper.accessor("id", { cell: (info) => info.getValue("id") })
);

const userRoles = localStorageService.get("GG_ADMIN")?.userDetails?.user_role;
console.log("userRoles", userRoles);

let isCirMaker =
  userRoles?.filter((role) => role?.role_name === "CIR Maker")?.length > 0;

console.log("role details -->", isCirMaker);

const dynamicFieldName = isCirMaker ? "cir__cir_no" : "cir__id.cir_no";
// ! commented the unused variable ..
// const dynamicHeader = "CIR No";

function createDynamicColumn(fieldName, headerText) {
  return columnHelper.accessor(fieldName, {
    cell: (info) => info.getValue() ?? "-",
    header: headerText,
  });
}

// role === 'macker' 'noraml columns' : 'extra columns'

// ! commented the unused variable ...
// const columns_for_level_two_three_user = [
//   columnHelper.accessor("status.description", {
//     cell: (info) => info.getValue() ?? "N/A",
//     header: "cir status",
//   }),
//   columnHelper.accessor("l1_user?.employee_name", {
//     cell: (info) => info.getValue() ?? "N/A",
//     header: "cIR L 1 user",
//   }),
//   columnHelper.accessor("l2_user?.employee_name", {
//     cell: (info) => info.getValue() ?? "N/A",
//     header: "cIR L 2 user ",
//   }),
//   columnHelper.accessor("l3_user?.employee_name", {
//     cell: (info) => info.getValue() ?? "N/A",
//     header: "cIR L 3 user",
//   }),
//   columnHelper.accessor("qc_report_status", {
//     cell: (info) => (info.getValue() ? "TRUE" : "FALSE"),
//     header: "QA report status",
//   }),
//   columnHelper.accessor("created_at", {
//     cell: (info) =>
//       info.getValue() ? moment(info.getValue()).format("MM/DD/YYYY") : "N/A",
//     header: "CIR Creation date",
//   }),
//   columnHelper.accessor("updated_at", {
//     cell: (info) =>
//       info.getValue() ? moment(info.getValue()).format("MM/DD/YYYY") : "N/A",
//     header: "CIR Last updated date",
//   }),
//   columnHelper.accessor("view", {
//     header: () => (
//       <Text id="view_col" fontWeight="800">
//         View
//       </Text>
//     ),
//     cell: (info) => (
//       <Flex justifyContent="center" color="primary.700" id="view_row">
//         <BsEye
//           fontSize="26px"
//           cursor="pointer"
//           // onClick={() => viewForm(info)}
//         />
//       </Flex>
//     ),
//     id: "view_col",
//     accessorFn: (row) => row.view_col,
//   }),

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
//         //onClick={() => editForm(info)}
//       />
//     </Flex>
//   ),
//   id: "update_col",
//   accessorFn: (row) => row.update_col,
// }),
// ];

const normal_columns = [
  columnHelper.accessor("cir__id.id", {
    cell: (info) => info.getValue() ?? "-",
    header: "Sr. No",
  }),

  columnHelper.accessor("cir__id.whr_no", {
    cell: (info) => info.getValue() ?? "-",
    header: "WHR NO",
  }),
  createDynamicColumn(dynamicFieldName, "CIR No"),

  columnHelper.accessor("warehouse.warehouse_name", {
    cell: (info) => info.getValue() ?? "-",
    header: "Warehouse name",
  }),
  columnHelper.accessor("chamber.chamber_number", {
    cell: (info) => info.getValue() ?? "-",
    header: "Chamber No",
  }),
  columnHelper.accessor("client.name_of_client", {
    cell: (info) => info.getValue() ?? "-",
    header: "Client name",
  }),
  // columnHelper.accessor("gatepass_count", {
  //   cell: (info) => info.getValue() ?? "-",
  //   header: "Gate pass count",
  // }),

  columnHelper.accessor("commodity.commodity_name", {
    cell: (info) => info.getValue() ?? "-",
    header: "Commodity name",
  }),
  columnHelper.accessor("commodity_variety.commodity_variety", {
    cell: (info) => info.getValue() ?? "-",
    header: "Commodity variety     ",
  }),
  columnHelper.accessor("service_contract__storage_rate_on", {
    cell: (info) => (info.getValue() === "Bag" ? "On Bag" : "On MT" ?? "-"),
    header: "Storage rate type",
  }),
  columnHelper.accessor("expected_bag_weight__bag_size", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "Bag size (SC) ",
  }),
  columnHelper.accessor("avg_bag_size", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "AVG Bag size (in cir) ",
  }),
  columnHelper.accessor("gatepass_count", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "GatePass Count",
  }),

  columnHelper.accessor("gate_pass_date_time_in__date", {
    cell: (info) => moment(info.getValue()).format("LL") ?? "-",
    header: "gatepass creation date",
  }),
  // columnHelper.accessor("gatepass_count", {
  //   cell: (info) => info.getValue() ?? "-",
  //   header: "Pending gate pass count",
  // }),

  ///  fsfd dsfas

  columnHelper.accessor("cir__id.status.description", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "cir status",
  }),
  columnHelper.accessor("cir__id.l1_user.employee_name", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "cIR L 1 user",
  }),
  columnHelper.accessor("cir__id.l2_user.employee_name", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "cIR L 2 user ",
  }),
  columnHelper.accessor("cir__id.l3_user.employee_name", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "cIR L 3 user",
  }),
  columnHelper.accessor("cir__id.qc_report_status", {
    cell: (info) => (info.getValue() ? "TRUE" : "FALSE"),
    header: "QC report status",
  }),
  columnHelper.accessor("cir__id.cir_creation_date", {
    cell: (info) =>
      info.getValue() ? moment(info.getValue()).format("MMMM DD YYYY") : "N/A",
    header: "CIR Creation date",
  }),
  columnHelper.accessor("cir__id.updated_at", {
    cell: (info) =>
      info.getValue() ? moment(info.getValue()).format("LL") : "N/A",
    header: "CIR Last updated date",
  }),
  columnHelper.accessor("update", {
    header: () => (
      <Text id="update_col" fontWeight="800">
        DOWNLOAD
      </Text>
    ),
    cell: (info) => (
      <Flex justifyContent="center" color="primary.700" id="update_row">
        {info.row.original.cir__id.whr_no ? (
          <BiDownload
            fontSize="26px"
            cursor="pointer"
            // onClick={() => editForm(info)}
            onClick={() => downloadPdf(info)}
          />
        ) : (
          <BiDownload
            fontSize="26px"
            cursor="not-allowed"
            color="gray.400"
          />
        )}
      </Flex>
    ),
    id: "update_col",
    accessorFn: (row) => row.update_col,
  }),
  
  // columnHelper.accessor("view", {
  //   header: () => (
  //     <Text id="view_col" fontWeight="800">
  //       View
  //     </Text>
  //   ),
  //   cell: (info) => (
  //     <Flex justifyContent="center" color="primary.700" id="view_row">
  //       <BsEye
  //         fontSize="26px"
  //         cursor="pointer"
  //        onClick={() => viewForm(info) }
  //       />
  //     </Flex>
  //   ),
  //   id: "view_col",
  //   accessorFn: (row) => row.view,
  // }),

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
  //         //onClick={() => editForm(info)}
  //       />
  //     </Flex>
  //   ),
  //   id: "update_col",
  //   accessorFn: (row) => row.update_col,
  // }),
];

const columns = normal_columns;
// : [...normal_columns, ...columns_for_level_two_three_user];

export { filterFields, addEditFormFields, schema, columns };
