import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";
// import { BiEditAlt } from "react-icons/bi";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "Quality parameter ": "quality_parameter",
    isActiveFilter: false,
    label: "Quality parameter",
    name: "quality_parameter",
    placeholder: "Quality parameter",
    type: "text",
  },
  {
    "TO CAPTURE ": "to_capture",
    isActiveFilter: false,
    label: "To Capture",
    name: "to_capture",
    placeholder: "To Capture",
    type: "select",
    multi: false,
    options: [
      {
        label: "Value",
        value: "value",
      },
      {
        label: "Range",
        value: "range",
      },
    ],
  },
  {
    "Decides grade ": "decides_grade",
    isActiveFilter: false,
    label: "Decides grade",
    name: "decides_grade",
    placeholder: "Decides grade",
    type: "select",
    multi: false,
    options: [
      {
        label: "Yes",
        value: "yes",
      },
      {
        label: "No",
        value: "no",
      },
    ],
  },

  {
    "CREATION DATE ": "created_at",
    isActiveFilter: false,
    label: "Creation Date Range",
    name: "created_at",
    placeholder: "Creation Date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },

  {
    "LAST UPDATED DATE": "updated_at",
    isActiveFilter: false,
    label: "Last Updated Date Range",
    name: "updated_at",
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
    label: "Quality parameter ",
    name: "quality_parameter",
    placeholder: "Quality parameter ",
    type: "text",
  },
  // {
  //   label: "TO CAPTURE ",
  //   name: "TO CAPTURE",
  //   placeholder: "TO CAPTURE ",
  //   type: "text",
  // },
  // {
  //   label: "Decides grade ",
  //   name: "Decides grade",
  //   placeholder: "Decides grade",
  //   type: "text",
  // },
  // {
  //   label: "Active",
  //   name: "is_active",
  //   type: "switch",
  // },
];

const schema = yup.object().shape({
  is_active: yup.string(),

  quality_parameter: yup
    .string()
    .trim()
    .required(() => null),
  to_capture: yup
    .string()
    .trim()
    .required(() => null),
  decides_grade: yup
    .string()
    .trim()
    .required(() => null),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("quality_parameter", {
    cell: (info) => info.getValue(),
    header: "Quality parameter",
  }),
  columnHelper.accessor("to_capture", {
    cell: (info) => info.getValue(),
    header: "TO CAPTURE",
  }),
  columnHelper.accessor("decides_grade", {
    cell: (info) => info.getValue(),
    header: "Decides grade",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),

  columnHelper.accessor("created_at", {
    cell: (info) => info.getValue(),
    header: "Creation date",
  }),
  columnHelper.accessor("updated_at", {
    cell: (info) => info.getValue(),
    header: "  Last Updated Date",
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
export { filterFields, addEditFormFields, schema, columns };
