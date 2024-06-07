import * as yup from "yup";
// import validation from "../../utils/validation";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("employee_id", {
    cell: (info) => info.getValue(),
    header: "EMPLOYEE ID",
  }),
  columnHelper.accessor("employee_name", {
    cell: (info) => info.getValue(),
    header: "FULL NAME",
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: "USER NAME (EMAIL)",
  }),
  columnHelper.accessor("designation.designation_name", {
    cell: (info) => info.getValue(),
    header: "Designation",
  }),
  columnHelper.accessor("user_role.role_name", {
    header: "ROLE",
    cell: (info) => {
      const userRoles = info.row.original.user_role;
      console.log("userRoles", userRoles);
      if (Array.isArray(userRoles) && userRoles.length > 0) {
        // Extract the role names from each role object
        const roleNames = userRoles.map((role) => role.role_name);

        // Return the role names as a comma-separated string
        return roleNames.join(", ");
      }

      return "N/A"; // Display "N/A" if the array is empty or not available
    },
  }),
  columnHelper.accessor("address", {
    cell: (info) => info.getValue(),
    header: "Address ",
  }),
  columnHelper.accessor("pin_code", {
    cell: (info) => info.getValue(),
    header: " Pin Code ",
  }),
  columnHelper.accessor("phone", {
    cell: (info) => info.getValue(),
    header: "CONTACT NO",
  }),
  columnHelper.accessor("reporting_manager.employee_name", {
    cell: (info) => info.getValue() || "N/A",
    header: "Reporting Manager",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("created_at", {
    cell: (info) => info.getValue(),
    header: "CREATION DATE",
  }),
  columnHelper.accessor("updated_at", {
    cell: (info) => info.getValue(),
    header: "LAST UPDATED DATE",
  }),

  columnHelper.accessor("is_active", {
    header: () => (
      <Text as={"span"} id="active_col" fontWeight="800">
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

const filterFields = [
  {
    "FULL NAME": "employee_name",
    isActiveFilter: false,

    label: "Full Name",
    name: "employee_name",
    placeholder: "Full Name",
    type: "text",
  },
  {
    "EMPLOYEE ID": "phone",
    isActiveFilter: false,

    label: "Employee Id",
    name: "employee_id",
    placeholder: "Employee Id",
    type: "text",
  },
  {
    "CONTACT NO": "phone",
    isActiveFilter: false,

    label: "Contact No",
    name: "phone",
    placeholder: "Contact No",
    type: "text",
  },
  {
    Address: "address",
    isActiveFilter: false,

    label: "Address",
    name: "address",
    placeholder: "Address",
    type: "text",
  },
  {
    "Pin code": "pin_code",
    isActiveFilter: false,

    label: "Pin code",
    name: "pin_code",
    placeholder: "Pin Code",
    type: "number",
  },

  {
    Email: "email",
    isActiveFilter: false,

    label: "Email",
    name: "email",
    placeholder: "Email",
    type: "text",
  },
  {
    DESIGNATION: "designation",
    isActiveFilter: false,

    label: "DESIGNATION",
    name: "designation",
    placeholder: "Designation",
    type: "text",
  },

  {
    ROLE: "user_role__role_name",
    isActiveFilter: false,

    label: "Role",
    name: "user_role__role_name",
    placeholder: "Role",
    type: "text",
  },
  {
    ROLE: "reporting_manager",
    isActiveFilter: false,

    label: "Reporting Manager",
    name: "reporting_manager",
    placeholder: "Reporting Manager",
    type: "text",
  },
  {
    "CREATION DATE": "created_at",
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

const addEditFormFields = [];
const mobileNumberRegex = /^\+91\d{10}$/;
const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required(() => null),
  employee_name: yup
    .string()
    .trim()
    .required(() => null),
  reporting_manager: yup.string(),
  address: yup
    .string()
    .trim()
    .required(() => null),
  phone: yup
    .string()
    .trim()
    .test("valid-mobile", "", (value) => {
      if (value === null) {
        return true; // This means no error if value is null
      }
      return mobileNumberRegex.test(value); // Test the mobile number format
    })
    .required(() => null)
    .typeError("Phone number must be a valid string"),

  designation: yup
    .string()
    .trim()
    .required(() => null),
  user_role: yup
    .array()
    .min(1)
    .required(() => null)
    .typeError(""),
  pin_code: yup
    .number()
    .integer("Pin code must be an integer")
    // .transform((value, originalValue) => {
    //   if (originalValue.trim() === "") {
    //     return NaN; // Treat empty input as NaN
    //   }
    //   return value;
    // })
    .min(100000, "Pin code must be at least 6 digits")
    .max(999999, "Pin code cannot be longer than 6 digits")
    .required(() => null)
    .typeError(),

  user_location: yup
    .array()
    .min(1, "User location is required")
    .required("User location is required")
    .typeError("User location is required"),
  employee_id: yup
    .string()
    .required(() => null)
    .max(25, "Employee id must be less than 25 characters")
    .typeError(),
  is_active: yup.string(),
});

export { filterFields, addEditFormFields, schema, columns };
