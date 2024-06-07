import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";
// import { BsEye } from "react-icons/bs";

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
    "REGION ": "insurance_by",
    isActiveFilter: false,
    label: "Insurance by",
    name: "insurance_by",
    placeholder: "Insurance by",
    type: "text",
  },
  {
    "REGION ": "storage_rate_on",
    isActiveFilter: false,
    label: "Storage Rate On(Bag/MT)",
    name: "storage_rate_on",
    placeholder: "Storage Rate On(Bag/MT)",
    type: "text",
  },
  {
    "REGION ": "status__description",
    isActiveFilter: false,
    label: "Application status",
    name: "status__description",
    placeholder: "Application status",
    type: "text",
  },
  {
    "REGION ": "l1_user__employee_name",
    isActiveFilter: false,
    label: "L 1 user",
    name: "l1_user__employee_name",
    placeholder: "L 1 user",
    type: "text",
  },
  {
    "REGION ": "l2_user__employee_name",
    isActiveFilter: false,
    label: "L 2 user",
    name: "l2_user__employee_name",
    placeholder: "L 2 user",
    type: "text",
  },

  {
    "REGION ": "l3_user__employee_name",
    isActiveFilter: false,
    label: "L 3 user",
    name: "l3_user__employee_name",
    placeholder: "L 3 user",
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
  client: yup
    .object()
    .shape({
      label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
      value: yup.string().required(() => null), // Validate as a number and make it required
    })
    .required(() => null), // Make the whole "client" object required

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

  commodity: yup
    .object()
    .shape({
      label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
      value: yup.string().required(() => null), // Validate as a number and make it required
    })
    .required(() => null), // Make the whole "commodity" object required

  fumigation_by_gogreen: yup
    .object()
    .shape({
      label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
      value: yup.string().required(() => null), // Validate as a number and make it required
    })
    .required(() => null),

  insurance_by: yup
    .object()
    .shape({
      label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
      value: yup.string().required(() => null), // Validate as a number and make it required
    })
    .required(() => null),

  qc_charges_by_gogreen: yup
    .object()
    .shape({
      label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
      value: yup.string().required(() => null), // Validate as a number and make it required
    })
    .required(() => null),

  // Billing details schema Start here

  excess_billing_cycle: yup
    .object()
    .shape({
      label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
      value: yup.string().required(() => null), // Validate as a number and make it required
    })
    .required(() => null),

  storage_rate_on: yup
    .object()
    .shape({
      label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
      value: yup.string().required(() => null), // Validate as a number and make it required
    })
    .required(() => null),

  reservation: yup
    .object()
    .shape({
      label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
      value: yup.string().required(() => null), // Validate as a number and make it required
    })
    .required(() => null),

  storage_rate_per_mt: yup
    .number()
    .when("reservation.value", {
      is: "MT",
      then: () =>
        yup
          .number()
          .positive("Please enter a valid positive number")
          .typeError("Storage_rate_per_mt must be a number")
          .required(() => null),
      otherwise: () => yup.number(),
    })
    .nullable()
    .test(
      "is-number",
      "Storage_rate_per_mt must be a number",
      (value) => !isNaN(value) && typeof value === "number"
    ),

  // expected_quantity: yup.number().nullable().typeError("").notRequired(),
  // expected_no_of_bags: yup.number().nullable().typeError("").notRequired(),

  // post_reservation_billing_cycle: yup
  //   .object()
  //   .shape({
  //     label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
  //     value: yup.string().required(() => null), // Validate as a number and make it required
  //   })
  //   .required(() => null),

  // Agreement details :
  service_contract_start_date: yup.string().required(() => null), // Validate as a date and make it required
  service_contract_end_date: yup
    .date()
    .required(() => null)
    .typeError("")
    .test(
      "is-greater-than-start",
      "End Date should not be less than Start Date",
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
    ), // Validate as a date and make it required
  service_contract_billing_end_date: yup.string().notRequired(),
  upload_signed_service_contract: yup
    .string()
    .trim()
    .required(() => null), // Validate as a string, trim whitespace, and make it required
});

const chamberDetailsSchema = yup.object().shape({
  warehouse: yup
    .object()
    .shape({
      label: yup.string().required(() => null),
      value: yup.string().required(() => null),
    })
    .required(() => null),

  chamber: yup
    .object()
    .shape({
      label: yup.string().required(() => null),
      value: yup.string().required(() => null),
    })
    .required(() => null),
});

const contractCommodity_Bag_size_Schema = yup.object().shape({
  storage_rate_per_mt: yup
    .number()
    .positive("Please enter a valid positive number")
    .typeError()
    .required(() => null),
  contractCommodity: yup.array().of(
    yup.object().shape({
      bag_size: yup
        .number()
        .positive("Bag size must be a positive number")
        .integer("Bag size must be an integer")
        .required("Bag size is required"),
      pbpm_rate: yup
        .number()
        .positive("PBPM rate must be a positive number")
        .required("PBPM rate is required"),
      rate: yup
        .number()
        .positive("Rate must be a positive number")
        .required("Rate is required"),
    })
  ),
});

const reservationDetailsSchema = yup.object().shape({
  quantity: yup
    .number()
    .positive("Quantity must be a positive number")
    .typeError(),

  bag_size: yup
    .number()
    .positive("Bag size must be a positive number")
    .typeError(),
  start_date: yup
    .date()
    .typeError("Start date must be a valid date")
    .required(() => null),
  end_date: yup
    .date()
    .typeError("End date must be a valid date")
    .required(() => null),

  pbpm_rate: yup
    .number()
    .positive("PBPM rate must be a positive number")
    .typeError()
    .required(() => null),

  rate: yup
    .number()
    .positive("Rate must be a positive number")
    .typeError()
    .required(() => null),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue() || "-",
    header: "SR. NO",
  }),

  columnHelper.accessor("client.name_of_client", {
    cell: (info) => info.getValue() || "-",
    header: "Client name",
  }),

  columnHelper.accessor("service_contract_number", {
    cell: (info) => info.getValue() || "-",
    header: "Service Contract Number",
  }),

  columnHelper.accessor("warehouse.warehouse_name", {
    cell: (info) => {
      let warehouse_name = info?.row?.original?.warehousechamber?.map(
        (el) => el?.warehouse?.warehouse_name
      );

      let names = Array.from(new Set(warehouse_name)).join(",");
      return names || "-";
    },
    header: "Warehouse name",
  }),
  columnHelper.accessor("chamber.chamber_number", {
    cell: (info) => {
      let chamber_number = info?.row?.original?.warehousechamber
        ?.map((el) => el?.chamber?.chamber_number)
        .join(",");
      return chamber_number || "-";
    },
    header: "Chamber no",
  }),
  columnHelper.accessor("commodity.commodity_name", {
    cell: (info) => {
      let commodity_names = info?.row?.original?.contractcommodity?.map(
        (el) => el?.commodity?.commodity_name
      );
      let names = Array.from(new Set(commodity_names)).join(",");
      return names || "-";
    },
    header: "Commodity name",
  }),
  columnHelper.accessor("insurance_by", {
    cell: (info) => info.getValue() || "-",
    header: "Insurance by",
  }),
  columnHelper.accessor("status.description", {
    cell: (info) => info.getValue() || "-",
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

  columnHelper.accessor("creation_date", {
    cell: (info) => info.getValue() || "-",
    header: "Creation date",
  }),
  columnHelper.accessor("last_update_date", {
    cell: (info) => info.getValue() || "-",
    header: "  Last Updated Date",
  }),
  // columnHelper.accessor("view", {
  //   header: () => (
  //     <Text id="update_col" fontWeight="800">
  //       View
  //     </Text>
  //   ),
  //   cell: (info) => (
  //     <Flex justifyContent="center" color="primary.700" id="update_row">
  //       <BsEye
  //         fontSize="26px"
  //         cursor="pointer"
  //         // onClick={() => viewForm(info)}
  //       />
  //     </Flex>
  //   ),
  //   id: "view_col",
  //   accessorFn: (row) => row.view_col,
  // }),
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

export {
  filterFields,
  addEditFormFields,
  schema,
  chamberDetailsSchema,
  reservationDetailsSchema,
  contractCommodity_Bag_size_Schema,
  columns,
};
