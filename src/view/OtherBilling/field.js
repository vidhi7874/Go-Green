import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { BiDownload, BiEditAlt } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import configuration from "../../config/configuration";
import moment from "moment";

function downloadPdf(info) {
  let id = info?.row?.original?.id;
  //  let id = info.row?.original?.qcr?.map((el) => el?.id);
  let name = info?.row?.original?.invoice_number;
  let url = `${configuration.BASE_URL}billing_flow/other_billing_download/${id}/`;
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.pdf`; // Set the filename with .pdf extension
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error downloading PDF:", error));
}

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "Invoice no ": "invoice_number",
    isActiveFilter: false,
    label: "Invoice no",
    name: "invoice_number",
    placeholder: "Enter Invoice no",
    type: "text",
  },
  {
    "Invoice Date ": "invoice_date",
    isActiveFilter: false,
    label: "Invoice Date",
    name: "invoice_date",
    placeholder: "Enter Invoice Date",
    type: "date",
  },
  {
    "Client Name ": "client__name_of_client",
    isActiveFilter: false,
    label: "Client Name",
    name: "client__name_of_client",
    placeholder: "Enter Client Name",
    type: "text",
  },
  {
    "Warehouse no ": "warehouse__warehouse_number",
    isActiveFilter: false,
    label: "Warehouse no",
    name: "warehouse__warehouse_number",
    placeholder: "Enter Warehouse no",
    type: "text",
  },
  {
    "REGION ": "region__region_name",
    isActiveFilter: false,
    label: "Region",
    name: "region__region_name",
    placeholder: "Region",
    type: "text",
  },
  {
    "State ": "state__state_name",
    isActiveFilter: false,
    label: "State",
    name: "state__state_name",
    placeholder: "State",
    type: "text",
  },
  {
    Substate: "substate__substate_name",
    isActiveFilter: false,
    label: "Substate ",
    name: "region_name",
    placeholder: "Substate    ",
    type: "text",
  },

  {
    "District ": "district__district_name",
    isActiveFilter: false,
    label: "District",
    name: "district__district_name",
    placeholder: "District",
    type: "text",
  },
  {
    "Area ": "area__area_name",
    isActiveFilter: false,
    label: "Area",
    name: "area__area_name",
    placeholder: "Area",
    type: "text",
  },
  {
    "Warehouse name ": "warehouse__warehouse_name",
    isActiveFilter: false,
    label: "Warehouse name",
    name: "warehouse__warehouse_name",
    placeholder: "Warehouse name",
    type: "text",
  },

  {
    "Chamber name ": "chamber__chamber_number",
    isActiveFilter: false,
    label: "Chamber name",
    name: "chamber__chamber_number",
    placeholder: "Chamber name",
    type: "text",
  },
  {
    "Commodity name ": "commodity__commodity_name",
    isActiveFilter: false,
    label: "Commodity name",
    name: "commodity__commodity_name",
    placeholder: "Commodity name",
    type: "text",
  },
  {
    "Service Type": "service_type",
    isActiveFilter: false,
    label: "Service Type",
    name: "service_type",
    placeholder: "Service Type",
    type: "text",
  },

  // {
  //   "Start date": "created_at",
  //   isActiveFilter: false,
  //   label: "Start date",
  //   name: "created_at",
  //   placeholder: "Start date ",
  //   type: "date",
  //   // max: new Date().toISOString().split("T")[0],
  // },

  // {
  //   "End date": "last_updated_date",
  //   isActiveFilter: false,
  //   label: "End date",
  //   name: "last_updated_date",
  //   placeholder: "End date",
  //   type: "date",
  //   // max: new Date().toISOString().split("T")[0],
  // },
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
  is_active: yup.string(),
  region: yup
    .string()
    .trim()
    .required(() => null),
  state: yup
    .string()
    .trim()
    .required(() => null),
  district: yup.string().trim().notRequired(),
  substate: yup.string().trim().notRequired(),
  area: yup.string().trim().notRequired(),

  client_region: yup
    .string()
    .trim()
    .required(() => null),
  client_state: yup
    .string()
    .trim()
    .required(() => null),
  client_address: yup
    .string()
    .trim()
    .required(() => null),
  // client_district: yup
  //   .string()
  //   .trim()
  //   .required(() => null),
  // client_substate: yup
  //   .string()
  //   .trim()
  //   .required(() => null),

  warehouse: yup.string(),
  chamber: yup.string().notRequired(),
  client: yup.string().required(""),
  invoice_date: yup.string().required(""),
  // commodity: yup.string().required(() => null),
  commodity: yup.string(),
  final_amount: yup.string().trim(),
  cgst_amount: yup.string().trim(),
  sgst_amount: yup.string().trim(),
  cgst: yup.string().trim(),
  sgst: yup.string().trim(),
  igst: yup.string().trim(),
  tgst_amount: yup.string().trim(),
  client_pan_number: yup
    .string()
    .trim()
    .required(() => null),
  client_gst_number: yup.string().trim(),
  tax_percentage: yup.string().trim(),
  narration: yup.string().required(""),
  hsn_code: yup.string().required(""),
  amount: yup.number().required(""),
  service_type: yup.string().required(""),
  applicability_of_revere_charge: yup.string().required(""),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("invoice_number", {
    cell: (info) => info.getValue(),
    header: "Invoice no",
  }),

  columnHelper.accessor("invoice_date", {
    cell: (info) => moment(info.getValue()).format("LL"),
    header: "Invoice Date",
  }),

  columnHelper.accessor("client.name_of_client", {
    cell: (info) => info.getValue(),
    header: "Client Name",
  }),
  columnHelper.accessor("warehouse.warehouse_number", {
    cell: (info) => info.getValue(),
    header: "Warehouse no",
  }),
  columnHelper.accessor("warehouse.warehouse_name", {
    cell: (info) => info.getValue(),
    header: "Warehouse name",
  }),
  columnHelper.accessor("chamber.chamber_number", {
    cell: (info) => info.getValue(),
    header: "Chamber name",
  }),
  columnHelper.accessor("commodity.commodity_name", {
    cell: (info) => info.getValue(),
    header: "Commodity Name",
  }),
  columnHelper.accessor("service_type", {
    cell: (info) => info.getValue(),
    header: "Service Type",
  }),
  columnHelper.accessor("final_amount", {
    cell: (info) => info.getValue(),
    header: "Final Total Amount",
  }),
  // columnHelper.accessor("region_name", {
  //   cell: (info) => info.getValue(),
  //   header: "Owner name",
  // }),
  // columnHelper.accessor("region_name", {
  //   cell: (info) => info.getValue(),
  //   header: "Start date",
  // }),
  // columnHelper.accessor("region_name", {
  //   cell: (info) => info.getValue(),
  //   header: "End date",
  // }),
  // columnHelper.accessor("region_name", {
  //   cell: (info) => info.getValue(),
  //   header: "Total Rent",
  // }),
  // columnHelper.accessor("view", {
  //   header: () => (
  //     <Text as="span" id="view_col" fontWeight="800">
  //       View
  //     </Text>
  //   ),
  //   cell: (info) => (
  //     <Flex justifyContent="center" color="primary.700" id="view_row">
  //       <BsEye
  //         fontSize="26px"
  //         cursor="pointer"
  //         // onClick={() => viewForm(info)}
  //       />
  //     </Flex>
  //   ),
  //   id: "view_col",
  //   accessorFn: (row) => row.update_col,
  // }),
  columnHelper.accessor("view", {
    header: () => (
      <Text id="view_col" fontWeight="600">
        Download
      </Text>
    ),
    cell: (info) => (
      <Flex justifyContent="center" color="primary.700" id="view_row">
        <BiDownload
          fontSize="26px"
          cursor="pointer"
          onClick={() => downloadPdf(info)}
        />
      </Flex>
    ),
    id: "view_col",
    accessorFn: (row) => row.update_col,
  }),
];

const backendKeys = {
  invoice_no: "invoice_no",
  invoice_date: "invoice_date",
  region: "region",
  state: "state",
  state_code: "state_code",
  substate: "sub_state",
  district: "district",
  area: "area",
  warehouse_name: "warehouse_id",
  chamber_name: "chamber",
  client_name: "client",
  client_pan_card: "client_pan_card",
  client_gst_number: "client_gst_no",
  client_region: "client_region",
  client_state: "client_state",
  client_sub_state: "client_sub_state",
  client_district: "client_district",
  commodity: "commodity",
  service_type: "service_type",
  hsn_code: "hsn_code",
  amount: "amount",
  narration: "narration",
  client_address: "client_address",
  applicability_of_revere_charge: "applicability_of_revere_charge",
};

export { filterFields, addEditFormFields, schema, columns, backendKeys };
