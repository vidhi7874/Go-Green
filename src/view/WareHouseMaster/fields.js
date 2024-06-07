import { createColumnHelper } from "@tanstack/react-table";
import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { BsEye } from "react-icons/bs";
import { EditIcon } from "@chakra-ui/icons";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "Warehouse Number": "warehouse_number",
    isActiveFilter: false,
    label: "Warehouse Number",
    name: "warehouse_number",
    placeholder: "Warehouse Number",
    type: "text",
  },

  {
    "Warehouse type ": "warehouse_type__warehouse_type_name",
    isActiveFilter: false,
    label: "Warehouse type",
    name: "warehouse_type__warehouse_type_name",
    placeholder: "Warehouse type",
    type: "text",
  },
  {
    "Warehosue Sub type ": "warehouse_sub_type__warehouse_subtype",
    isActiveFilter: false,
    label: "Warehosue Sub type",
    name: "warehouse_sub_type__warehouse_subtype",
    placeholder: "Warehosue Sub type",
    type: "text",
  },
  {
    "Warehouse Unit type ": "warehouse_unit_type__warehouse_unit_type",
    isActiveFilter: false,
    label: "Warehouse Unit type",
    name: "warehouse_unit_type__warehouse_unit_type",
    placeholder: "Warehouse Unit type",
    type: "text",
  },
  {
    "Warehouse name  ": "warehouse_name",
    isActiveFilter: false,
    label: "Warehouse name ",
    name: "warehouse_name",
    placeholder: "Warehouse name ",
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
    "Sub state  ": "substate__substate_name",
    isActiveFilter: false,
    label: "Sub state ",
    name: "substate__substate_name",
    placeholder: "Sub state ",
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
    "Address ": "warehouse_address",
    isActiveFilter: false,
    label: "Address",
    name: "warehouse_address",
    placeholder: "Address",
    type: "text",
  },
  {
    "Pin code ": "warehouse_pincode",
    isActiveFilter: false,
    label: "Pin code",
    name: "warehouse_pincode",
    placeholder: "Pin code",
    type: "number",
  },
  {
    "Owners Kyc completed ": "is_kyc_completed",
    isActiveFilter: false,
    label: "Owners Kyc completed",
    name: "is_kyc_completed",
    placeholder: "Owners Kyc completed",
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
  // {
  //   "Agreement renewal ": "region_name",
  //   isActiveFilter: false,
  //   label: "Agreement renewal",
  //   name: "region_name",
  //   placeholder: "Agreement renewal",
  //   type: "text",
  // },

  // {
  //   "View/Upload agreement ": "region_name",
  //   isActiveFilter: false,
  //   label: "Region",
  //   name: "region_name",
  //   placeholder: "View/Upload agreement",
  //   type: "text",
  // },
  // {
  //   "Re-Inspection  ": "region_name",
  //   isActiveFilter: false,
  //   label: "Re-Inspection ",
  //   name: "region_name",
  //   placeholder: "Re-Inspection ",
  //   type: "text",
  // },

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
];

// ! commented un-used function
// const viewForm = (e) => {
//   console.log(e);
// };

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("warehouse_number", {
    cell: (info) => info.getValue(),
    header: "Warehouse Number",
  }),
  columnHelper.accessor("warehouse_type.warehouse_type_name", {
    cell: (info) => info.getValue(),
    header: "Warehouse type",
  }),
  columnHelper.accessor("warehouse_sub_type.warehouse_subtype", {
    cell: (info) => info.getValue(),
    header: "Warehosue Sub type ",
  }),
  columnHelper.accessor("warehouse_unit_type.warehouse_unit_type", {
    cell: (info) => info.getValue(),
    header: "Warehouse Unit type ",
  }),
  columnHelper.accessor("warehouse_name", {
    cell: (info) => info.getValue(),
    header: "Warehouse name ",
  }),
  columnHelper.accessor("region.region_name", {
    cell: (info) => info.getValue(),
    header: "Region",
  }),
  columnHelper.accessor("state.state_name", {
    cell: (info) => info.getValue(),
    header: " State",
  }),
  columnHelper.accessor("substate.substate_name", {
    cell: (info) => info.getValue(),
    header: "Sub state ",
  }),
  columnHelper.accessor("district.district_name", {
    cell: (info) => info.getValue(),
    header: " District",
  }),
  columnHelper.accessor("area.area_name", {
    cell: (info) => info.getValue(),
    header: "area ",
  }),
  columnHelper.accessor("warehouse_address", {
    cell: (info) => info.getValue(),
    header: "Address ",
  }),
  columnHelper.accessor("warehouse_pincode", {
    cell: (info) => info.getValue(),
    header: "Pin code ",
  }),
  columnHelper.accessor("owner_kyc_completed", {
    cell: (info) => info.getValue(),
    header: " Owners Kyc completed",
  }),

  columnHelper.accessor("region_name", {
    cell: (info) => (
      <button
        style={{
          backgroundColor: "#A6CE39",
          padding: "6px",
          borderRadius: "10px",
          color: "white",
        }}
      >
        Agreement Renewal
      </button>
    ),
    header: "Agreement renewal ",
  }),
  columnHelper.accessor("region_name", {
    cell: (info) => {
      console.log("info.row.original", info.row.original);
      return (
        <Flex justifyContent="center" color="primary.700" id="update_row">
          {info.row.original.is_agreement_done ? (
            <EditIcon
              fontSize="26px"
              cursor="pointer"
              // onClick={() => router.push("/warehouse-master/warehouse-master")}
            />
          ) : (
            <BsEye
              fontSize="26px"
              cursor="pointer"
              //onClick={() => viewForm(info)}
            />
          )}
        </Flex>
      );
    },
    header: " View/Upload agreement",
  }),
  columnHelper.accessor("region_name", {
    cell: (info) => (
      <button
        style={{
          backgroundColor: "#A6CE39",
          padding: "6px",
          borderRadius: "10px",
          color: "white",
        }}
      >
        Re-Inspection
      </button>
    ),
    header: "Re-Inspection ",
  }),

  columnHelper.accessor("is_active", {
    header: () => (
      <Text id="active_col" fontWeight="800">
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
  columnHelper.accessor("is_block", {
    header: "Block",
    cell: (info) => (
      <Box id="is_block">
        <Switch
          size="md"
          colorScheme="whatsapp"
          isChecked={
            info.row.original.is_block || info.row.original.area.is_block
          }
        />
      </Box>
    ),
  }),
  //  info.row.original.is_block || info.row.original.area.is_block

  // columnHelper.accessor("view", {
  //   header: () => (
  //     <Text id="update_col" fontWeight="800">

  //       View
  //     </Text>
  //   ),
  //   cell: (info) => (
  //     <Flex justifyContent="center" color="primary.700" id="update_row">
  //       <BsEye fontSize="26px" cursor="pointer" />
  //     </Flex>
  //   ),
  //   id: "view_col",
  //   accessorFn: (row) => row.view_col,
  // }),
];

export { filterFields, columns };
