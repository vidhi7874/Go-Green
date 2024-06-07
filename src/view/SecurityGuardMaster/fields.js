import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    NAME: "from_security_guard_mappings__warehouse__warehouse_number",
    isActiveFilter: false,

    label: "Warehouse Number",
    name: "from_security_guard_mappings__warehouse__warehouse_number",
    placeholder: "Warehouse Number",
    type: "text",
  },
  {
    NAME: "security_agency_id",
    isActiveFilter: false,

    label: "Security Agency Name",
    name: "security_agency_id",
    placeholder: "Security Agency Name",
    type: "text",
  },
  {
    NAME: "security_guard_name",
    isActiveFilter: false,

    label: "Security Guard Name",
    name: "security_guard_name",
    placeholder: "Security Guard Name",
    type: "text",
  },
  {
    "REGION NAME": "region__region_name",
    isActiveFilter: false,

    label: "Region",
    name: "region__region_name",
    placeholder: "Region",
    type: "text",
  },
  {
    "STATE NAME": "state__state_name",
    isActiveFilter: false,

    label: "State",
    name: "state__state_name",
    placeholder: "State",
    type: "text",
  },
  {
    "STATE NAME": "substate__substate_name",
    isActiveFilter: false,

    label: "SubState Name",
    name: "substate__substate_name",
    placeholder: "SubState Name",
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
    "AREA NAME": "area__area_name",
    isActiveFilter: false,

    label: "Area Name",
    name: "area__area_name",
    placeholder: "Area Name",
    type: "text",
  },
  {
    ADDRESS: "address_of_security_guard",
    isActiveFilter: false,

    label: "Address",
    name: "address_of_security_guard",
    placeholder: "Address",
    type: "text",
  },
  {
    "PIN CODE": "pincode",
    isActiveFilter: false,

    label: "Pin Code",
    name: "pincode",
    placeholder: "Pin Code",
    type: "number",
  },
  {
    AADHAR: "aadhar_of_security_guard",
    isActiveFilter: false,

    label: "Aadhar Care ID",
    name: "aadhar_of_security_guard",
    placeholder: "Aadhar Card ID",
    type: "text",
  },
  {
    "BIRTH DATE": "dob_of_security_guard",
    isActiveFilter: false,

    label: "Date Of Birth",
    name: "dob_of_security_guard",
    placeholder: "Date Of Birth",
    // type: "date",
    type: "date_from_to",

    max: new Date().toISOString().split("T")[0],
  },
  {
    "CONTACT NUMBER": "contact_number",
    isActiveFilter: false,

    label: "Contact Number",
    name: "contact_number",
    placeholder: "Contact Number",
    type: "number",
  },
  {
    "ALTERNATE CONTACT NUMBER": "alternate_contact_number",
    isActiveFilter: false,

    label: "Alternative Contact Number",
    name: "alternate_contact_number",
    placeholder: "Alternative Contact Number",
    type: "number",
  },
  {
    "ON BOARDING DATE": "onboarding_date",
    isActiveFilter: false,

    label: "On Boarding Date Range",
    name: "onboarding_date",
    placeholder: "On Boarding Date",
    type: "date_from_to",
  },
  {
    "DE BOARDING DATE": "deboarding_date",
    isActiveFilter: false,

    label: "De Boarding Date Range",
    name: "deboarding_date",
    placeholder: "De Boarding Date",
    type: "date_from_to",
  },
  {
    "SHIFT AVAILABLE": "shift_availability",
    isActiveFilter: false,

    label: "Shift Available",
    name: "shift_availability",
    placeholder: "shift Available",
    type: "select",
    multi: false,
    options: [
      {
        label: "Day",
        value: "Day",
      },
      {
        label: "Night",
        value: "Night",
      },

      // {
      //   label: "Both",
      //   value: "Both",
      // },
    ],
  },
  {
    "GUARD SALARY": "salary",
    isActiveFilter: false,

    label: "Guard Salary",
    name: "salary",
    placeholder: "Guard Salary",
    type: "number",
  },
  {
    "CREATION DATE": "creation_date",
    isActiveFilter: false,

    label: "Creation Date Range",
    name: "creation_date",
    placeholder: "Creation Date",
    type: "date_from_to",
  },
  {
    "LAST UPDATED DATE": "last_update_date",
    isActiveFilter: false,

    label: "Last Updated Date Range",
    name: "last_update_date",
    placeholder: "Last Updated Date",
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
  // {
  //   DESCRIPTION: "description",
  //   isActiveFilter: false,
  // },
];

const addEditFormFields = [
  // {
  //   name: "address_of_security_guard",
  //   label: "Address",
  //   placeholder: "Address",
  //   type: "text",
  // },
  // {
  //   name: "pincode",
  //   label: "Pin Code",
  //   placeholder: "Pin Code",
  //   type: "number",
  // },
  // {
  //   name: "aadhar_of_security_guard",
  //   label: "Aadhar Card ID",
  //   placeholder: "Aadhar Card ID",
  //   type: "number",
  // },
  {
    name: "dob_of_security_guard",
    label: "Date Of Birth",
    placeholder: "Date Of Birth",
    type: "date",
    max: new Date().toISOString().split("T")[0],
  },
  {
    name: "contact_number",
    label: "Contact Number",
    placeholder: "Contact Number",
    type: "text",
  },
  {
    name: "alternate_contact_number",
    label: "Alternate Contact",
    placeholder: "Alternate Contact",
    type: "text",
  },
  {
    name: "onboarding_date",
    label: "On Boarding Date",
    placeholder: "On Boarding Date",
    type: "date",
  },
  // {
  //   name: "deboarding_date",
  //   label: "De Boarding DateDe Boarding Date",
  //   placeholder: "De Boarding Date",
  //   type: "date",
  // },
];

const schema = yup.object().shape({
  // warehouse_hiring_proposal: yup.string().required(() => null),
  security_agency_id: yup
    .string()
    .trim()
    .required(() => null),
  security_guard_service_type: yup
    .string()
    .trim()
    .required(() => null),
  security_guard_name: yup
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
  district: yup
    .string()
    .trim()
    .required(() => null),
  substate: yup
    .string()
    .trim()
    .required(() => null),
  area: yup
    .string()
    .trim()
    .required(() => null),
  address_of_security_guard: yup
    .string()
    .trim()
    .required(() => null),
    aadhar_of_security_guard: yup
    .string()
    .required(() => "")
    .typeError(() => "Aadhar number must be a string")
    .matches(/^[2-9]\d{11}$/, "It should start with a digit between 2 to 9 And Must Be 12 Digits."),
  salary: yup
    .number()
    .required(() => null)
    .typeError(),
  dob_of_security_guard: yup.string().required(() => null),
  // onboarding_date: yup
  //   .string()
  //   .trim()
  //   .required(() => null)
  //   .test(
  //     "onboarding-date",
  //     "Onboarding Date must be after Date of Birth",
  //     function (value) {
  //       const { dob_of_security_guard } = this.parent;
  //       return new Date(value) >= new Date(dob_of_security_guard);
  //     }
  //   ),
  onboarding_date: yup
    .string()
    .trim()
    .required(() => null)
    .test(
      "is-greater-than-start",
      "Onboarding Date must be after Date of Birth",
      function (value) {
        const { dob_of_security_guard } = this.parent;

        // If agreement_start_date is not provided, consider the validation as success
        if (!dob_of_security_guard || !value) {
          return true;
        }

        // Compare the dates
        const startDate = new Date(dob_of_security_guard);
        const endDate = new Date(value);

        return endDate >= startDate;
      }
    ),

  deboarding_date: yup.string(),
  alternate_contact_number: yup
    .number() // Value should be a number
    .typeError() // Error message if not a number
    .required("") // Error message if not provided
    .min(1000000000, "Alternate contact number must be at least 10 digits") // Example minimum value
    .max(9999999999, "Alternate contact number cannot exceed 10 digits") // Example maximum value
    .test(
      "is-ten-digits",
      "Alternate contact number must be exactly 10 digits",
      (val) => {
        if (val === undefined) return true; // Allow undefined values (for non-required fields)
        return String(val).length === 10;
      }
    ),
  adhaar_upload_path: yup.string().required(() => null),
  email_attachment: yup.string().nullable(),
  contact_number: yup
    .number() // Value should be a number
    .typeError() // Error message if not a number
    .required("") // Error message if not provided
    .min(1000000000, "Contact number must be at least 10 digits") // Example minimum value
    .max(9999999999, "Contact number cannot exceed 10 digits") // Example maximum value
    .test(
      "is-ten-digits",
      "Contact number must be exactly 10 digits",
      (val) => {
        if (val === undefined) return true; // Allow undefined values (for non-required fields)
        return String(val).length === 10;
      }
    ),
  is_active: yup.string(),
  shift_availability: yup
    .string()
    .trim()
    .required(() => null),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue() || "-",
    header: "SR. NO",
  }),
  columnHelper.accessor("active_warehouse", {
    cell: (info) => (info.getValue() ?? []).join(","),
    header: "Warehouse Numbers",
  }),
  columnHelper.accessor("security_agency_id.security_agency_name", {
    cell: (info) => info.getValue() || "-",
    header: "AGENCY NAME",
  }),
  columnHelper.accessor("security_guard_name", {
    cell: (info) => info.getValue() || "-",
    header: "NAME",
  }),

  columnHelper.accessor("region.region_name", {
    cell: (info) => info.getValue() || "-",
    header: "REGION ",
  }),
  columnHelper.accessor("state.state_name", {
    cell: (info) => info.getValue() || "-",
    header: "STATE ",
  }),
  columnHelper.accessor("substate.substate_name", {
    cell: (info) => info.getValue() || "-",
    header: "SUB STATE ",
  }),
  columnHelper.accessor("district.district_name", {
    cell: (info) => info.getValue() || "-",
    header: "DISTRICT ",
  }),
  columnHelper.accessor("area.area_name", {
    cell: (info) => info.getValue() || "-",
    header: "AREA ",
  }),
  columnHelper.accessor("address_of_security_guard", {
    cell: (info) => info.getValue() || "-",
    header: "ADDRESS",
  }),
  columnHelper.accessor("pincode", {
    cell: (info) => info.getValue() || "-",
    header: "PIN CODE",
  }),
  columnHelper.accessor("aadhar_of_security_guard", {
    cell: (info) => info.getValue() || "-",
    header: "AADHAR CARD ID",
  }),

  columnHelper.accessor("dob_of_security_guard", {
    cell: (info) => info.getValue() || "-",
    header: "DATE OF BIRTH ",
  }),
  columnHelper.accessor("contact_number", {
    cell: (info) => info.getValue(),
    header: "CONTACT NUMBER",
  }),
  columnHelper.accessor("alternate_contact_number", {
    cell: (info) => info.getValue() || "-",
    header: "ALTERNATE CONTACT NUMBER",
  }),
  columnHelper.accessor("onboarding_date", {
    cell: (info) => info.getValue() || "-",
    header: "ON BOARDING DATE",
  }),
  columnHelper.accessor("deboarding_date", {
    cell: (info) => info.getValue() || "-",
    header: "DEBOARDING DATE",
  }),
  columnHelper.accessor("shift_availability", {
    cell: (info) => info.getValue() || "-",
    header: "SHIFT AVAILABLE",
  }),
  columnHelper.accessor("salary", {
    cell: (info) => info.getValue() || "-",
    header: "GUARD SALARY",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("creation_date", {
    cell: (info) => info.getValue() || "-",
    header: "CREATION DATE",
  }),
  columnHelper.accessor("last_update_date", {
    cell: (info) => info.getValue() || "-",
    header: "LAST UPDATED DATE",
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
          isChecked={info.row.original.is_active}
        />
      </Box>
    ),
    id: "active",
    accessorFn: (row) => row.active,
  }),
];
export { filterFields, addEditFormFields, schema, columns };
