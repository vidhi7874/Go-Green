import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    Region: "district__substate__state__region__region_name",
    isActiveFilter: false,
    label: "Region",
    name: "district__substate__state__region__region_name",
    placeholder: "Region",
    type: "text",
  },
  {
    State: "district__substate__state__state_name",
    isActiveFilter: false,
    label: "State",
    name: "district__substate__state__state_name",
    placeholder: "State",
    type: "text",
  },
  {
    SUBSTATE: "district__substate__substate_name",
    isActiveFilter: false,
    label: "Sub State",
    name: "district__substate__substate_name",
    placeholder: "Sub State",
    type: "text",
  },
  {
    "DISTRICT NAME": "district__district_name",
    isActiveFilter: false,
    label: "District",
    name: "district__district_name",
    placeholder: "District",
    type: "text",
  },
  {
    "AREA NAME": "area_name",
    isActiveFilter: false,
    label: "Area",
    name: "area_name",
    placeholder: "Area",
    type: "text",
  },
  {
    "Earthquack zone": "earthquake_zone_type",
    isActiveFilter: false,
    label: "Earthquack zone",
    name: "earthquake_zone_type",
    placeholder: "Earthquack zone",
    type: "text",
  },

  {
    Block: "is_block",
    isActiveFilter: false,
    label: "Block",
    name: "is_block",
    placeholder: "Block",
    type: "select",
    multi: false,
    options: [
      {
        label: "Yes",
        value: "True",
      },
      {
        label: "No",
        value: "False",
      },
    ],
  },
  {
    "CREATION DATE": "created_at",
    isActiveFilter: false,
    label: "Creation Date Range",
    name: "creation_date",
    placeholder: "Creation Date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },
  {
    "LAST UPDATED DATE": "last_updated_date",
    isActiveFilter: false,
    label: "Last Updated Date Range",
    name: "last_updated_date",
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

const addEditFormFields = [];

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("district.substate.state.region.region_name", {
    cell: (info) => info.getValue(),
    header: " Region",
  }),
  columnHelper.accessor("district.substate.state.state_name", {
    cell: (info) => info.getValue(),
    header: " State",
  }),
  columnHelper.accessor("district.substate.substate_name", {
    cell: (info) => info.getValue(),
    header: "Sub State",
  }),
  columnHelper.accessor("district.district_name", {
    cell: (info) => info.getValue(),
    header: "DISTRICT ",
  }),
  columnHelper.accessor("earthquake_zone_type.earthquake_zone_type", {
    cell: (info) => info.getValue(),
    header: "Earthquake Zone",
  }),
  columnHelper.accessor("area_name", {
    cell: (info) => info.getValue(),
    header: "AREA ",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),

  columnHelper.accessor("creation_date", {
    cell: (info) => info.getValue(),
    header: "Creation Date",
  }),
  columnHelper.accessor("last_updated_date", {
    cell: (info) => info.getValue(),
    header: "Last Updated Date",
  }),
  columnHelper.accessor("is_block", {
    header: "Block",
    cell: (info) => (
      <Box id="active_row">
        <Switch
          size="md"
          colorScheme="whatsapp"
          isReadOnly
          isChecked={info.row.original.is_block}
        />
      </Box>
    ),
  }),
  columnHelper.accessor("is_active", {
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
          isChecked={info.row.original.is_active}
        />
      </Box>
    ),
    id: "active",
    accessorFn: (row) => row.active,
  }),
];

const schema = yup.object().shape({
  is_active: yup.string(),
  district: yup.string().trim().required(" "),
  is_block: yup.string(),
  earthquake_zone_type: yup
    .string()
    .trim()
    .required(() => null)
    .typeError(""),
  region: yup.string().trim().required(" "),
  state: yup.string().trim().required(" "),
  area_name: yup.string().trim().required(" "),
  substate: yup.string().trim().required(" "),
});

export { filterFields, addEditFormFields, schema, columns };
