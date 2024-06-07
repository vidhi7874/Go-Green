import * as yup from "yup";
// import validation from "../../utils/validation";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { localStorageService } from "../../services/localStorge.service";
import { Text } from "@chakra-ui/react";
import validation from "../../utils/validation";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "COR No": "cor__cor_no",
    isActiveFilter: false,
    label: "COR No",
    name: "cor__cor_no",
    placeholder: "Enter COR No",
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
  // {
  //   "gatepass creation date": "gatepass creation date",
  //   isActiveFilter: false,
  //   label: "Gatepass creation date",
  //   name: "gatepass creation date",
  //   placeholder: "gatepass creation date",
  //   type: "date",
  // },
  // {
  //   "Pending gate pass count": "Pending gate pass count",
  //   isActiveFilter: false,
  //   label: "Pending gate pass count",
  //   name: "Pending gate pass count",
  //   placeholder: "Enter Pending gate pass count",
  //   type: "text",
  // },
  {
    "cor status": "cor_status",
    isActiveFilter: false,
    label: "Cor Status",
    name: "cor_status",
    placeholder: "Enter cor status",
    type: "text",
  },
  {
    "COR L 1 user": "cir__l1_user__employee_name",
    isActiveFilter: false,
    label: "COR L 1 user",
    name: "cor__l1_user__employee_name",
    placeholder: "COR L 1 user",
    type: "text",
  },
  {
    "COR L 2 user": "cor__l2_user__employee_name",
    isActiveFilter: false,
    label: "CIR L 2 user",
    name: "cor__l2_user__employee_name",
    placeholder: "COR L 2 user",
    type: "text",
  },
  {
    "COR L 3 user": "cor__l3_user__employee_name",
    isActiveFilter: false,
    label: "CIR L 3 user",
    name: "cor__l3_user__employee_name",
    placeholder: "COR L 3 user",
    type: "text",
  },
  {
    "COR Creation date ": "cor__id__creation_date",
    isActiveFilter: false,
    label: "COR Creation date",
    name: "cor__id__creation_date",
    placeholder: "Enter Creation date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },
  {
    "COR Last updated date": "updated_at",
    isActiveFilter: false,
    label: "COR Last updated date",
    name: "updated_at",
    placeholder: "Enter Last updated date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },
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

// const schema = yup.object().shape({
//   warehouse: yup
//     .string()
//     .trim()
//     .required(() => null),
//   chamber: yup
//     .string()
//     .trim()
//     .required(() => null),
//   commodity: yup
//     .string()
//     .trim()
//     .required(() => null),
//   commodity_variety: yup
//     .string()
//     .trim()
//     .required(() => null),
// });

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
  // agent_name: yup
  //   .string()
  //   .trim()
  //   .required(() => null),
  total_net_weight: yup
    .string()
    .trim()
    .required(() => null),
  total_bags: yup
    .string()
    .trim()
    .required(() => null),
  market_rate: yup
    .string()
    .trim()
    .required(() => null),
  value_of_commodity: yup
    .string()
    .trim()
    .required(() => null),
  client_rep_name: yup
    .string()
    .trim()
    .required(() => null),
  client_mobile_no: yup
    .string()
    .trim()
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
  spilage_bag_count: yup
    .number()
    .min(0, "Spillage bag count cannot be negative")
    .typeError("")
    .required(() => null),

  // spilage_bag_count: yup
  //   .number()
  //   .positive("Spillage bag count Must Be Positive")
  //   .typeError("")
  //   .test({
  //     name: "total_bags",
  //     message: "Spillage bag count must be less than total bags",
  //     test: function (bag_count) {
  //       console.log(bag_count);
  //       const total_bags = Number(this.parent.total_bags);
  //       console.log(total_bags);
  //       // return minPrice <= maxPrice;
  //       return Number(bag_count) < total_bags;
  //     },
  //   })
  //   .required(() => null),

  supervisor_name: yup
    .string()
    .trim()
    .required(() => null),
  remarks: yup.string().trim(),
  gatepass: yup.array(),
});

const userRoles = localStorageService.get("GG_ADMIN")?.userDetails?.user_role;
console.log("userRoles", userRoles);

let isCirMaker =
  userRoles?.filter((role) => role?.role_name === "COR Maker")?.length > 0;

console.log("role details -->", isCirMaker);

const dynamicFieldName = isCirMaker ? "cor__id.cor_no" : "cor__id.cor_no";
// ! commented the unused variable ...
// const dynamicHeader = "CIR No";

function createDynamicColumn(fieldName, headerText) {
  console.log(fieldName);
  console.log(headerText);
  return columnHelper.accessor(fieldName, {
    cell: (info) => info.getValue() ?? "-",
    header: headerText,
  });
}

const columns = [
  columnHelper.accessor("cor__id.id", {
    cell: (info) => info.getValue() ?? "-",
    header: "Sr. No",
  }),
  createDynamicColumn(dynamicFieldName, "COR No"),

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

  columnHelper.accessor("commodity.commodity_name", {
    cell: (info) => info.getValue() ?? "-",
    header: "Commodity name",
  }),
  columnHelper.accessor("commodity_variety.commodity_variety", {
    cell: (info) => info.getValue() ?? "-",
    header: "Commodity variety     ",
  }),
  // columnHelper.accessor("client__servicecontract__storage_rate_on", {
  //   cell: (info) => (info.getValue() === "bag" ? "On Bag" : "On MT" ?? "-"),
  //   header: "Storage rate type",
  // }),
  // columnHelper.accessor("bag_size", {
  //   cell: (info) => info.getValue() ?? "N/A",
  //   header: "Bag size ",
  // }),
  // columnHelper.accessor("avg_bag_size  ", {
  //   cell: (info) => info.getValue() ?? "N/A",
  //   header: "AVG Bag size ",
  // }),
  columnHelper.accessor("gate_pass_date_time_in__date", {
    cell: (info) => moment(info.getValue()).format("LL") ?? "-",
    header: "gatepass creation date",
  }),

  // // cor_status
  // IF cor_status === 'created' then show (outward_gate_pass_count) ohter wite show '-'
  // columnHelper.accessor("gatepass_count", {
  //   cell: (info) => info.getValue() ?? "-",
  //   header: "Pending gate pass count",
  // }),

  columnHelper.accessor("outward_gate_pass_count", {
    cell: (info) => {
      const cor_status = info.row.original.cor_status;
      const outward_gate_pass_count = info.row.original.outward_gate_pass_count;

      console.log(cor_status);
      console.log(outward_gate_pass_count);

      if (cor_status === "created") {
        return outward_gate_pass_count !== undefined
          ? outward_gate_pass_count
          : "-";
      } else {
        return "-";
      }
    },
    header: "Gate pass count",
  }),

  // columnHelper.accessor("outward_gate_pass_count", {
  //   cell: (info) => { 
  //     const cor_status = info.row.original.cor_status;
  //     const outward_gate_pass_count = info.row.original.outward_gate_pass_count;

  //     console.log(cor_status);
  //     console.log(outward_gate_pass_count);

  //     if (cor_status !== "created") {
  //       return outward_gate_pass_count !== undefined
  //         ? "-"
  //         : outward_gate_pass_count;
  //     } else {
  //       return "-";
  //     }
  //   },
  //   header: "Pending gate pass count",
  // }),

  // columnHelper.accessor("gatepass_count", {
  //   cell: (info) => info.getValue() ?? "-",
  //   header: "Use gate pass count",
  // }),
  ///  fsfd dsfas

  // columnHelper.accessor("cor_status", {
  //   cell: (info) => {
  //     const value = info.getValue() ?? "N/A";
  //     // Prepend "COR" and pad with leading zeros to make it, for example, "COR001"
  //     return `cor ${value}`.padStart(6, '0'); // Adjust the padding length as needed
  //   },
  //   header: "cor status",
  // }),
  columnHelper.accessor("cor__id.status.description", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "cor status",
  }),
  
  columnHelper.accessor("cor__id.l1_user.employee_name", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "COR L1 user",
  }),
  columnHelper.accessor("cor__id.l2_user.employee_name", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "COR L2 user ",
  }),
  columnHelper.accessor("cor__id.l3_user.employee_name", {
    cell: (info) => info.getValue() ?? "N/A ",
    header: "COR L3 user",
  }),
  // columnHelper.accessor("qc_report_status", {
  //   cell: (info) => (info.getValue() ? "TRUE" : "FALSE"),
  //   header: "QA report status",
  // }),
  columnHelper.accessor("cor__id.creation_date", {
    // cell: (info) => moment(info.getValue()).format("MM/DD/YYYY"),
    cell: (info) => moment(info.getValue()).format("LL") ?? "-",
    header: "COR Creation date",
  }),
  columnHelper.accessor("cor_date_time", {
    cell: (info) => moment(info.getValue()).format("LL"),
    header: "COR Last updated date",
  }),
];

export { filterFields, addEditFormFields, schema, columns };
