import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";
import moment from "moment";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    " sector": "bank_sector__name",
    isActiveFilter: false,

    label: "Sector",
    name: "bank_sector__name",
    placeholder: " Sector",
    type: "text", 
  },
  {
    "Bank Name": "bank_name",
    isActiveFilter: false,

    label: "Bank Name",
    name: "bank_name",
    placeholder: "Bank Name",
    type: "text",
  },
  {
    "Region ": "region__region_name",
    isActiveFilter: false,

    label: "Region ",
    name: "region__region_name",
    placeholder: "Region",
    type: "text",
  },
  {
    State: "state__state_name",
    isActiveFilter: false,

    label: "State",
    name: "state__state_name",
    placeholder: "State ",
    type: "text",
  },

  {
    Cm_Rate: "bankcmrate__cm_rate",
    isActiveFilter: false,

    label: "Cm Rate",
    name: "bankcmrate__cm_rate",
    placeholder: "Cm Rate ",
    type: "text",
  },

  {
    " Agreement Start Date": "bankcmrate__agreement_start_date__range",
    isActiveFilter: false,

    label: "Agreement Start Date Range",
    name: "bankcmrate__agreement_start_date__range",
    placeholder: "Agreement Start Date ",
    type: "date_from_to",
  },
  {
    " Agreement End Date": "bankcmrate__agreement_end_date__range",
    isActiveFilter: false,

    label: "Agreement End Date Range",
    name: "bankcmrate__agreement_end_date__range",
    placeholder: "Agreement End Date ",
    type: "date_from_to",
  },
  {
    " Bank Address": "bank_address",
    isActiveFilter: false,

    label: " Bank Address",
    name: "bank_address",
    placeholder: " Bank Address",
    type: "text",
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

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "Sr. No",
  }),
  columnHelper.accessor("bank_sector.name", {
    cell: (info) => info.getValue(),
    header: "sector",
  }),
  columnHelper.accessor("bank_name", {
    cell: (info) => info.getValue(),
    header: "Bank Name",
  }),
  columnHelper.accessor("current_cm.cm_rate", {
    header: "CM RATE ",
    cell: (info) => (info.getValue() ? info.getValue() : " - "),
  }),
  columnHelper.accessor("current_cm.agreement_start_date", {
    header: "AGREEMENT START DATE",
    cell: (info) =>
      info.getValue() ? moment(info.getValue()).format("LL") : " - ",
  }),
  columnHelper.accessor("current_cm.agreement_end_date", {
    header: "AGREEMENT END DATE ",
    cell: (info) =>
      info.getValue() ? moment(info.getValue()).format("LL") : " - ",
  }),

  columnHelper.accessor("region.region_name", {
    cell: (info) => info.getValue(),
    header: "Region ",
  }),
  columnHelper.accessor("state.state_name", {
    cell: (info) => info.getValue(),
    header: "State",
  }),

  columnHelper.accessor("bank_address", {
    cell: (info) => info.getValue(),
    header: "Bank Address",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("created_at", {
    cell: (info) => info.getValue(),
    header: "Creation Date",
  }),

  columnHelper.accessor("updated_at", {
    cell: (info) => info.getValue(),
    header: "Last Updated Date",
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
    id: "is_active",
    accessorFn: (row) => row.active,
  }),
  // columnHelper.accessor("update", {
  //   header: () => (
  //     <Text id="update_col" fontWeight="800">
  //       UPDATE
  //     </Text>
  //   ),
  //   cell: (info) => (
  //     <Flex justifyContent="center" color="primary.700" id="update_row">
  //       <BiEditAlt
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

const addEditFormFields = [
  {
    name: "bank_name",
    label: "Bank Name",
    placeholder: "Bank Name",
    type: "text",
  },
];

const schema = yup.object().shape({
  bank_name: yup
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
  bank_sector: yup
    .string()
    .trim()
    .required(() => null),
  bank_address: yup
    .string()
    .required(() => null)
    .typeError(""),
  is_active: yup.string(),
  cm_rate: yup.number().min(0).required("").typeError(""),
  agreement_start_date: yup
    .string()
    .required(() => null)
    .typeError(""),
  agreement_end_date: yup
    .string()
    .required(() => null)
    .typeError("")
    .test(
      "is-greater-than-start",
      "End date must be after start date",
      function (value) {
        const { agreement_start_date } = this.parent;

        // If agreement_start_date is not provided, consider the validation as success
        if (!agreement_start_date || !value) {
          return true;
        }

        // Compare the dates
        const startDate = new Date(agreement_start_date);
        const endDate = new Date(value);

        return endDate >= startDate;
      }
    ),
  agreement_path: yup.string().required(""),
});

const schema2 = yup.object().shape({
  bank_name: yup
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
  bank_sector: yup
    .string()
    .trim()
    .required(() => null),
  bank_address: yup
    .string()
    .required(() => null)
    .typeError(""),
  is_active: yup.string(),
  cm_rate: yup.array().required(""),
});

export { filterFields, addEditFormFields, schema, columns, schema2 };
