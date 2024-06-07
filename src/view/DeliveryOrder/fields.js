import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import {
  aadharValidationMessage,
  panValidationMessage,
} from "../../services/validation.service";
import { BiDownload } from "react-icons/bi";
import { Flex, Text } from "@chakra-ui/layout";
import configuration from "../../config/configuration";

const columnHelper = createColumnHelper();

function downloadPdf(info) {
  let id = info?.row?.original?.id;
  let do_no = info?.row?.original?.delivery_order_number;

  let url = `${configuration.BASE_URL}billing_flow/delivery_order/${id}/`;

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `${do_no}.pdf`; // Set the filename with .pdf extension
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error downloading PDF:", error));
}

const filterFields = [
  {
    "DO No ": "delivery_order_number",
    isActiveFilter: false,
    label: "DO No",
    name: "delivery_order_number",
    placeholder: "Enter DO No",
    type: "text",
  },
  {
    "Client name ": "client__name_of_client",
    isActiveFilter: false,
    label: "Client name",
    name: "client__name_of_client",
    placeholder: "Enter Client name",
    type: "text",
  },
  {
    "Warehouse name ": "Warehouse__warehouse_name",
    isActiveFilter: false,
    label: "Warehouse name",
    name: "Warehouse__warehouse_name",
    placeholder: "Enter Warehouse name ",
    type: "text",
  },
  {
    "Chamber No  ": "chamber__chamber_number",
    isActiveFilter: false,
    label: "Chamber No ",
    name: "chamber__chamber_number",
    placeholder: "Enter Chamber No ",
    type: "text",
  },
  {
    "REGION ": "region__region_name",
    isActiveFilter: false,
    label: "Region",
    name: "region__region_name",
    placeholder: " Enter Region",
    type: "text",
  },
  {
    "State ": "state__state_name",
    isActiveFilter: false,
    label: "State",
    name: "state__state_name",
    placeholder: "Enter State",
    type: "text",
  },
  {
    Substate: "substate__substate_name",
    isActiveFilter: false,
    label: "Substate",
    name: "substate__substate_name",
    placeholder: "Enter Substate",
    type: "text",
  },
  {
    "District ": "district__district_name",
    isActiveFilter: false,
    label: "District",
    name: "district__district_name",
    placeholder: "Enter District",
    type: "text",
  },
  {
    "Area ": "area__area_name",
    isActiveFilter: false,
    label: "Area",
    name: "area__area_name",
    placeholder: "Enter Area",
    type: "text",
  },
  {
    "Commodity name ": "commodity__commodity_name",
    isActiveFilter: false,
    label: "Commodity name",
    name: "commodity__commodity_name",
    placeholder: "Enter Commodity name",
    type: "text",
  },
  {
    "Commodity Variety ": "commodity_variety__commodity_variety",
    isActiveFilter: false,
    label: "Commodity Variety",
    name: "commodity_variety__commodity_variety",
    placeholder: "Enter Commodity Variety",
    type: "text",
  },
  {
    "DO status ": "status__description",
    isActiveFilter: false,
    label: "DO status",
    name: "status__description",
    placeholder: "Enter DO status",
    type: "text",
  },
  {
    "DO L1 user ": "l1_user__employee_name",
    isActiveFilter: false,
    label: "DO L1 user",
    name: "l1_user__employee_name",
    placeholder: "Enter DO L1 user",
    type: "text",
  },
  {
    "DO L2 user ": "l2_user__employee_name",
    isActiveFilter: false,
    label: "DO L2 user",
    name: "l2_user__employee_name",
    placeholder: "Enter DO L2 user",
    type: "text",
  },

  {
    "DO L3 user ": "l3_user__employee_name",
    isActiveFilter: false,
    label: "DO L3 user",
    name: "l3_user__employee_name",
    placeholder: "Enter DO L3 user",
    type: "text",
  },

  {
    "DO Creation date ": "creation_date",
    isActiveFilter: false,
    label: "DO Creation date",
    name: "creation_date",
    placeholder: "Creation Date ",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },

  {
    "DO Last updated date": "last_updated_date",
    isActiveFilter: false,
    label: "DO Last updated date",
    name: "last_updated_date",
    placeholder: "Last Updated Date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },

  {
    "DO expiry date ": "last_updated_date",
    isActiveFilter: false,
    label: "DO expiry date",
    name: "last_updated_date",
    placeholder: "Enter DO expiry date",
    type: "date_from_to",
  },
];

const addEditFormFields = [
  {
    label: "Region ",
    name: "region_name",
    placeholder: "Region ",
    type: "text",
  },
  {
    label: "Active",
    name: "is_active",
    type: "switch",
  },
];

const schema = yup.object().shape({
  market_rate: yup.string(),

  region: yup.string().trim().required(" "),
  state: yup.string().trim().required(" "),
  district: yup.string().trim().required(" "),
  substate: yup.string().trim().required(" "),
  area: yup.string().trim().required(""),
  whr_no: yup.string().required(() => null),
  current_do_bags: yup.string().required(() => null),
  current_do_mt: yup.string().required(() => null),
  client_authorised_person: yup.string().required(() => null),
  client_authorised_person_contact_number: yup
    .string()
    .required(() => null)
    .trim(),
  delivery_order_number: yup.string(),
  client_authorised_person_id_proof_type: yup.string().required(),
  client_authorised_person_id_proof_number: yup
    .string()
    .trim()

    .when("client_authorised_person_id_proof_type", (type, schema) => {
      return type[0] === "aadhar"
        ? schema.matches(/^[0-9]{12}$/, aadharValidationMessage())
        : type[0] === "pan"
        ? schema.matches(
            /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/,
            panValidationMessage()
          )
        : schema;
    })
    .required(() => null),

  client_authorised_letter_path: yup.string().required(() => null),
  broker_name: yup.string(),
  remarks: yup.string().trim().nullable(),
  client: yup.string().required(() => null),
  warehouse_id: yup.string().required(() => null), // for warehouse name key
  chamber: yup.string().required(() => null), // for chamber number
  commodity: yup.string().required(() => null), // for commodity name..
  commodity_varity: yup.string().required(() => null),
  cir: yup.string().required(() => null),
  expire_date: yup.string().required(() => null),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("delivery_order_number", {
    cell: (info) => info.getValue(),
    header: "Do no",
  }),
  columnHelper.accessor("client.name_of_client", {
    cell: (info) => info.getValue(),
    header: "Client Name",
  }),
  columnHelper.accessor("warehouse.warehouse_name", {
    cell: (info) => info.getValue(),
    header: "Warehouse Name",
  }),
  columnHelper.accessor("chamber.chamber_number", {
    cell: (info) => info.getValue(),
    header: "Chamber no",
  }),

  columnHelper.accessor("commodity.commodity_name", {
    cell: (info) => info.getValue(),
    header: "Commodity name",
  }),
  columnHelper.accessor("commodity_variety.commodity_variety", {
    cell: (info) => info.getValue(),
    header: "Commodity varity",
  }),
  columnHelper.accessor("status.description", {
    cell: (info) => {
      const value = info.getValue() || "-";
      return value;
    },
    header: "Do Status",
  }),

  columnHelper.accessor("l1_user.employee_name", {
    cell: (info) => {
      const value = info.getValue() || "-";
      return value;
    },
    header: "Do L1 user",
  }),
  columnHelper.accessor("l2_user.employee_name", {
    cell: (info) => {
      const value = info.getValue() || "-";
      return value;
    },
    header: "Do L2 user",
  }),
  columnHelper.accessor("l3_user.employee_name", {
    cell: (info) => {
      const value = info.getValue() || "-";
      return value;
    },
    header: "Do L3 user",
  }),

  columnHelper.accessor("creation_date", {
    cell: (info) => info.getValue(),
    header: "Do Creation date",
  }),
  columnHelper.accessor("last_updated_date", {
    cell: (info) => info.getValue(),
    header: "Do Last Updated Date",
  }),
  columnHelper.accessor("last_updated_date", {
    cell: (info) => info.getValue(),
    header: "DO Expiry date",
  }),
  columnHelper.accessor("update", {
    header: () => (
      <Text id="update_col" fontWeight="800">
        DOWNLOAD
      </Text>
    ),
    cell: (info) => (
      <Flex justifyContent="center" color="primary.700" id="update_row">
        <BiDownload
          fontSize="26px"
          cursor="pointer"
          // onClick={() => editForm(info)}
          onClick={() => downloadPdf(info)}
        />
      </Flex>
    ),
    id: "update_col",
    accessorFn: (row) => row.update_col,
  }),
];

export { filterFields, addEditFormFields, schema, columns };
