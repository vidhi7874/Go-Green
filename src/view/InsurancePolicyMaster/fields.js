import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("policy_number", {
    cell: (info) => info.getValue(),
    header: "Insurance policy number",
  }),
  columnHelper.accessor("insurance_company", {
    cell: (info) => info.getValue(),
    header: "Insurance company",
  }),
  columnHelper.accessor("risk_cover_type", {
    cell: (info) => info.getValue(),
    header: "Insurance Risk Cover Type",
  }),
  columnHelper.accessor("policy_amount", {
    cell: (info) => info.getValue(),
    header: "Insurance Policy Amount",
  }),
  columnHelper.accessor("policy_start_date", {
    cell: (info) => info.getValue(),
    header: "policy start date",
  }),
  columnHelper.accessor("policy_end_date", {
    cell: (info) => info.getValue(),
    header: "policy end date",
  }),
  columnHelper.accessor("earthquake_zone.earthquake_zone_type", {
    cell: (info) => {
      // Get the value from the info object
      const value = info.getValue();

      // Check if the value is null or undefined
      if (value === null || typeof value === "undefined") {
        return "N/A"; // Display "N/A" for null or undefined values
      }

      // If the value is not null or undefined, return the actual value
      return value;
    },
    header: "Earthquake zone",
  }),
  columnHelper.accessor("warehouse_unit_type.warehouse_unit_type", {
    cell: (info) => {
      // Get the value from the info object
      const value = info.getValue();

      // Check if the value is null or undefined
      if (value === null || typeof value === "undefined") {
        return "N/A"; // Display "N/A" for null or undefined values
      }

      // If the value is not null or undefined, return the actual value
      return value;
    },
    header: "Warehouse Unit Type",
  }),
  columnHelper.accessor("commodity", {
    cell: (info) => {
      // Get the value from the info object (should be the array of commodity objects)
      const commodities = info.getValue();

      // Check if commodities is an array and not empty
      if (Array.isArray(commodities) && commodities.length > 0) {
        // Extract the commodity names from each commodity object
        const commodityNames = commodities.map(
          (commodity) => commodity.commodity_name
        );

        // Return the commodity names as a comma-separated string
        return commodityNames.join(", ");
      }

      return "N/A"; // Display "N/A" if the array is empty or not available
    },
    header: "Commodity",
  }),
  columnHelper.accessor("policy_by", {
    cell: (info) => {
      // Get the value from the info object
      const value = info.getValue();

      // Check if the value is null or undefined
      if (value === null || typeof value === "undefined") {
        return "N/A"; // Display "N/A" for null or undefined values
      }
      // If the value is not null or undefined, return the actual value
      return value;
    },
    header: "Policy By",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("creation_date", {
    cell: (info) => info.getValue(),
    header: "Creation Date",
  }),
  columnHelper.accessor("last_update_date", {
    cell: (info) => info.getValue(),
    header: " Last Updated Date",
  }),
  columnHelper.accessor("is_active", {
    // header: "ACTIVE",
    header: () => (
      <Text  as="span" id="active_col" fontWeight="800">
        Active
      </Text>
    ),
    cell: (info) => (
      <Box id="active_row">
        <Switch
          size="md"
          colorScheme="whatsapp"
          // onChange={(e) => handleActiveDeActive(e, info)}
          isChecked={info.row.original.is_active}
          // id="active_row"
          // isReadOnly
          // isChecked={flexRender(
          //   cell.column.columnDef.cell,
          //   cell.getContext()
          // )}
        />
      </Box>
    ),
    id: "active",
    accessorFn: (row) => row.active,
  }),
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

const filterFields = [
  {
    "Insurance policy number": "policy_number",
    isActiveFilter: false,

    label: "Insurance policy number",
    name: "policy_number",
    placeholder: "Insurance policy number",
    type: "text",
  },
  {
    "Insurance company": "insurance_policy_holder_name",
    isActiveFilter: false,

    label: "Insurance Policy Holder Name",
    name: "insurance_policy_holder_name",
    placeholder: "Insurance Policy Holder Name",
    type: "text",
  },
  {
    "Insurance company": "insurance_company",
    isActiveFilter: false,

    label: "Insurance company",
    name: "insurance_company",
    placeholder: "Insurance company",
    type: "text",
  },
  {
    "Insurance Risk Cover Type": "risk_cover_type",
    isActiveFilter: false,

    label: "Insurance  Type",
    name: "risk_cover_type",
    placeholder: "Insurance  Type",
    type: "select",
    multi: false,
    options: [
      {
        label: "Fire",
        value: "fire",
      },
      {
        label: "Burglary",
        value: "burglary",
      },
    ],
  },
  {
    "Insurance Policy Amount": "policy_amount",
    isActiveFilter: false,

    label: "Insurance Policy Amount",
    name: "policy_amount",
    placeholder: "Insurance Policy Amount",
    type: "text",
  },
  {
    "policy start date": "policy_start_date",
    isActiveFilter: false,

    label: "Policy start date Range",
    name: "policy_start_date",
    placeholder: "Policy start date",
    type: "date_future",
  },
  {
    "policy end date": "policy_end_date",
    isActiveFilter: false,

    label: "Policy end date Range",
    name: "policy_end_date",
    placeholder: "Policy end date",
    type: "date_future",
  },
  {
    "Earthquake zone": "earthquake_zone",
    isActiveFilter: false,

    label: "Earthquake zone",
    name: "earthquake_zone",
    placeholder: "Earthquake zone",
    type: "text",
  },
  {
    "Warehouse Unit Type": "warehouse_unit_type",
    isActiveFilter: false,

    label: "Warehouse Unit Type",
    name: "warehouse_unit_type",
    placeholder: "Warehouse Unit Type",
    type: "text",
  },
  {
    "Commodity Name": "commodity__commodity_name",
    isActiveFilter: false,

    label: "Commodity Name",
    name: "commodity__commodity_name",
    placeholder: "Commodity Name",
    type: "text",
  },
  {
    "Policy By": "policy_by",
    isActiveFilter: false,

    label: "Policy By",
    name: "policy_by",
    placeholder: "Policy By",
    type: "text",
  },

  {
    "CREATION DATE": "creation_date",
    isActiveFilter: false,
    label: "Creation Date Range",
    name: "creation_date",
    placeholder: "CREATION DATE",
    type: "date_from_to",
  },
  {
    "LAST UPDATED DATE": "last_update_date",
    isActiveFilter: false,
    label: "Last Updated Date Range",
    name: "last_update_date",
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
  //   {
  //     name: "insurance_company_name",
  //     label: "Insurance policy number",
  //     placeholder: "Insurance policy number",
  //     type: "text",
  //   },
  // {
  //   name: "insurance_type",
  //   label: "Insurance Policy Type",
  //   placeholder: "Insurance Policy Type",
  //   type: "select",
  // },
  {
    name: "policy_amount",
    label: "Policy Amount (Rs)",
    placeholder: "Insurance Policy Amount",
    type: "number",
  },
  // {
  //   name: "policy_start_date",
  //   label: "Policy Start Date",
  //   placeholder: "Policy Start Date",
  //   type: "date",
  // },
  // {
  //   name: "policy_end_date",
  //   label: "Policy End Date",
  //   placeholder: "Policy End Date",
  //   type: "date",
  // },
  //   {
  //     name: "maximum_bag_size",
  //     label: "MAXIMUM BAG SIZE",
  //     placeholder: "MAXIMUM BAG SIZE",
  //     type: "number",
  //   },
  //   {
  //     name: "rent_on_bag",
  //     label: "RENT ON BAG",
  //     placeholder: "RENT ON BAG",
  //     type: "number",
  //   },
  // {
  //   label: "Active",
  //   name: "is_active",
  //   type: "switch",
  // },
  //   {
  //     label: "COMMODITY TYPE",
  //     name: "commodity_type",
  //     placeholder: "COMMODITY TYPE",
  //     type: "select",
  //     multi: false,
  //     options: [],
  //   },
];

const schema = yup.object().shape({
  policy_number: yup.string().trim().max(20,"Ensure this field has no more than 20 characters").required(() => null).typeError(),
  insurance_policy_holder_name: yup.string().required(() => null).typeError(),
  insurance_company: yup.string().required(() => null).typeError(),
  risk_cover_type: yup.string().required(() => null).typeError(),
  policy_amount: yup.number().required(() => null).typeError(),
  policy_start_date: yup.string().required(() => null).typeError(),
  policy_end_date: yup
    .string()
    .required("")
    .test(
      "is-greater-than-start",
      "End date must be after start date",
      function (value) {
        const { policy_start_date } = this.parent;

        // If agreement_start_date is not provided, consider the validation as success
        if (!policy_start_date || !value) {
          return true;
        }

        // Compare the dates
        const startDate = new Date(policy_start_date);
        const endDate = new Date(value);

        return endDate >= startDate;
      }
    ),
  earthquake_zone: yup.string().nullable(),
  warehouse_unit_type: yup.string().nullable(),
  warehouse_risk_cover_limit: yup
  .number()
  .nullable()
  .max(yup.ref("policy_amount"), "Warehouse Risk Cover Limit must be less than Policy Amount")
  ,

  policy_by: yup.string().required(() => null),
  client: yup.string().when('policy_by', {
      is: (value) => value === 'client', // Corrected the condition
      then: () => yup.string().required(() => null),
      otherwise: () => yup.string().nullable(),
  }),
  // warehouse_owner: yup.string().when('policy_by', {
  //     is: (value) => value === 'owner', // Corrected the condition
  //     then: () => yup.string().required(() => null),
  //     otherwise: () => yup.string().nullable(),
  // }),
  bank: yup.string().when('policy_by', {
      is: (value) => value === 'bank', // Corrected the condition
      then: () => yup.string().required(() => null),
      otherwise: () => yup.string().nullable(),
  }),
  warehouse_name: yup.array().when('policy_by', {
    is: (value) => value === 'warehouse', // Corrected the condition
    then: () => yup.array().required(() => null),
    otherwise: () => yup.array().nullable(),
}),
  // warehouse_name: yup.array().nullable(),
  hypothecation_with_multiple_bank: yup.array().nullable(),

  insurance_policy: yup.string().required(""),
  email_attactment: yup.string().required(""),
  // insurance_policy: yup.string().required(""),
  is_active: yup
    .string()
    .required(() => null)
    .typeError(""),
  remark: yup.string().nullable(),
});

export { filterFields, addEditFormFields, schema, columns };
