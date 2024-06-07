import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("warehouse_number", {
    cell: (info) => info.getValue(),
    header: "Warehouse Number",
  }),
  columnHelper.accessor("hiring", {
    header: "Hiring Supervisor Types",
    cell: (info) => {
      const HiringType = info.row.original;

      if (
        HiringType.is_new_supervisor_day_shift === true &&
        HiringType.is_new_supervisor_night_shift === true
      ) {
        return "Day, Night";
      }
      if (HiringType.is_new_supervisor_day_shift === true) {
        return "Day";
      }
      if (HiringType.is_new_supervisor_night_shift === true) {
        return "Night";
      }
      return "";
    },
  }),
];
// This should be dynamically determined based on the user's selection
// Define selectedShift based on user input (for example, from a form field)
// Define the selected value (e.g., "day" or "night")
// Define the selected value (e.g., "day" or "night")
// Define the selected value (e.g., "day" or "night")
// const selectedValue = "day"; // You can change this value based on your logic

// // Determine the key based on the selected value
// if (selectedValue === "day") {
//   filterFields.name = "is_new_supervisor_day_shift";
// } else if (selectedValue === "night") {
//   filterFields.name = "is_new_supervisor_night_shift";
// }

// // Print the updated object
// console.log(filterFields);

const filterFields = [
  {
    "Warehouse Number": "warehouse_number",
    isActiveFilter: false,

    label: "Warehouse Number",
    name: "warehouse_number",
    placeholder: "Warehouse Number",
    type: "text",
  },
  // {
  //   "Hiring Supervisor Types": "hiring",
  //   isActiveFilter: false,

  //   label: "Hiring Supervisor Types",
  //   name: "hiring",
  //   placeholder: "Hiring Supervisor Types",
  //   type: "text",
  // },
  {
    "LAST UPDATED ACTIVE": "is_active",
    isActiveFilter: false,
    label: "Shift",
    name: "", // Initialize with an empty string
    placeholder: "Shift",
    type: "select",
    multi: false,
    options: [
      {
        label: "day",
        value: "day",
      },
      {
        label: "night",
        value: "night",
      },
    ],
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
  warehouse_id: yup
    .string()
    .trim()
    .required(() => null),
  warehouse_number: yup
    .string()
    .trim()
    .required(() => null),
  hiring_type: yup
    .string()
    .trim()
    .required(() => null),
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

  // user_location: yup
  //   .array()
  //   .min(1, "User location is required")
  //   .required("User location is required")
  //   .typeError("User location is required"),
  employee_id: yup
    .string()
    .required(() => null)
    .max(25, "Employee id must be less than 25 characters")
    .typeError(),
  is_active: yup.string(),
});

export { filterFields, addEditFormFields, schema, columns };
