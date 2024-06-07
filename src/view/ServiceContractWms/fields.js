import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "Client name ": "client__name_of_client",
    isActiveFilter: false,
    label: "Client name",
    name: "client__name_of_client",
    placeholder: "Client name",
    type: "text",
  },
  {
    "Warehouse name ": "contractwarehousechamber__warehouse__warehouse_name",
    isActiveFilter: false,
    label: "Warehouse name",
    name: "contractwarehousechamber__warehouse__warehouse_name",
    placeholder: "Warehouse name",
    type: "text",
  },
  {
    "Chamber no ": "contractwarehousechamber__chamber__chamber_number",
    isActiveFilter: false,
    label: "Chamber no",
    name: "contractwarehousechamber__chamber__chamber_number",
    placeholder: "Chamber no",
    type: "text",
  },
  {
    "Commodity name ": "contractcommodity__commodity__commodity_name",
    isActiveFilter: false,
    label: "Commodity name",
    name: "contractcommodity__commodity__commodity_name",
    placeholder: "Commodity name",
    type: "text",
  },
  {
    "insurance by ": "insurance_by",
    isActiveFilter: false,
    label: "Insurance by",
    name: "insurance_by",
    placeholder: "Insurance by",
    type: "text",
  },
  {
    "Application status ": "status__description",
    isActiveFilter: false,
    label: "Application status",
    name: "status__description",
    placeholder: "Application status",
    type: "text",
  },
  {
    "L1 user ": "l1_user__employee_name",
    isActiveFilter: false,
    label: "L1 user",
    name: "l1_user__employee_name",
    placeholder: "L1 user",
    type: "text",
  },
  {
    "L2 user ": "l2_user__employee_name",
    isActiveFilter: false,
    label: "L2 user",
    name: "l2_user__employee_name",
    placeholder: "L2 user",
    type: "text",
  },

  {
    "L3 user ": "l3_user__employee_name",
    isActiveFilter: false,
    label: "L3 user",
    name: "l3_user__employee_name",
    placeholder: "L3 user",
    type: "text",
  },

  {
    "CREATION DATE ": "creation_date",
    isActiveFilter: false,
    label: "Creation Date Range",
    name: "creation_date",
    placeholder: "Creation Date ",
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
    "LAST UPDATED ACTIVE": "is_active",
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
  client: yup.number().required(() => null),
  client_rent_type: yup.string(),
  fumigation_by_gogreen: yup.string().required(() => null),
  insurance_by: yup.string().required(() => null),
  qc_charges_by_gogreen: yup.string().required(() => null),
  storage_rate_on: yup.string().required(() => null),
  client_bill_type: yup.string().required(() => null),
  billing_cycle: yup.string().required(() => null),
  is_gst_applicable: yup.boolean().required(() => null),
  minimum_billing_charge: yup
    .number()
    .min(1)
    .positive("Please enter a valid positive number")
    .typeError()
    .required(() => null),
  expected_quantity: yup
    .number()
    .min(1)
    .positive("Please enter a valid positive number")
    .typeError()
    .required(() => null),
  expected_no_of_bags: yup
    .number()
    .min(1)
    .positive("Please enter a valid positive number")
    .typeError()
    .required(() => null),
  service_contract_start_date: yup.string().required(() => null),
  service_contract_end_date: yup
    .string()
    .required(() => null)
    .test(
      "is-greater-than-start",
      "End date must be after start date",
      function (value) {
        const { service_contract_start_date } = this.parent;

        // If agreement_start_date is not provided, consider the validation as success
        if (!service_contract_start_date || !value) {
          return true;
        }

        // Compare the dates
        const startDate = new Date(service_contract_start_date);
        const endDate = new Date(value);

        return endDate >= startDate;
      }
    ),
  service_contract_billing_end_date: yup.string().notRequired(),
  upload_signed_service_contract: yup
    .array()
    .required(() => null)
    .typeError(),
  warehousechamber: yup
    .array()
    .min(1)
    .required(() => null),
  contractcommodity: yup
    .array()
    .min(1)
    .required(() => null),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("client?.name_of_client", {
    cell: (info) => {
      // cell: (info) => info.getValue() || "-",

      let client_name = info.row.original?.client?.name_of_client;
      return client_name || "-";
    },
    header: "Client name",
  }),
  columnHelper.accessor("service_contract_number", {
    cell: (info) => info.getValue() || "-",
    header: "Service Contract Number",
  }),
  columnHelper.accessor("warehouse?.warehouse_name", {
    cell: (info) => {
      console.log(info.row.original.warehousechamber);
      let warehouse_name = info.row.original.warehousechamber
        .map((el) => el.warehouse.warehouse_name)
        .join(",");
      return warehouse_name || "-";
    },
    header: "Warehouse name",
  }),
  columnHelper.accessor("chamber?.chamber_number", {
    cell: (info) => {
      console.log(info.row.original.warehousechamber);
      let chamber_number = info.row.original.warehousechamber
        .map((el) => el.chamber.chamber_number)
        .join(",");
      return chamber_number || "-";
    },
    header: "Chamber no",
  }),
  columnHelper.accessor("commodity?.commodity_name", {
    cell: (info) => {
      let commodity_names = info?.row?.original?.contractcommodity
        ?.map((el) => el.commodity?.commodity_name)
        .join(",");
      return commodity_names || "-";
    },
    header: "Commodity name",
  }),
  columnHelper.accessor("insurance_by", {
    cell: (info) => info.getValue() || "-",
    header: "Insurance by",
  }),
  columnHelper.accessor("status?.description", {
    cell: (info) => {
      // cell: (info) => info.getValue() || "-",

      let application_status = info.row.original?.status?.description;
      return application_status || "-";
    },

    header: "Application status",
  }),
  columnHelper.accessor("l1_user?.employee_name", {
    cell: (info) => {
      // cell: (info) => info.getValue() || "-",

      let l1_user = info.row.original?.l1_user?.employee_name;
      return l1_user || "-";
    },
    header: "L1 user",
  }),
  columnHelper.accessor("l2_user?.employee_name", {
    cell: (info) => {
      // cell: (info) => info.getValue() || "-",

      let l2_user = info.row.original?.l2_user?.employee_name;
      return l2_user || "-";
    },
    header: "L2 user",
  }),
  columnHelper.accessor("l3_user?.employee_name", {
    cell: (info) => {
      // cell: (info) => info.getValue() || "-",

      let l3_user = info.row.original?.l3_user?.employee_name;
      return l3_user || "-";
    },
    header: "L3 user",
  }),

  columnHelper.accessor("creation_date", {
    cell: (info) => info.getValue() || "-",
    header: "Creation date",
  }),
  columnHelper.accessor("last_update_date", {
    cell: (info) => info.getValue() || "-",
    header: "  Last Updated Date",
  }),

  columnHelper.accessor("is_active", {
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
          isChecked={info.row.original.is_active}
        />
      </Box>
    ),
    id: "active",
    accessorFn: (row) => row.active,
  }),
];

export { filterFields, addEditFormFields, schema, columns };
