import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Switch, Text } from "@chakra-ui/react";
import moment from "moment";
// t
const columnHelper = createColumnHelper();

const filterFields = [
  {
    NAME: "security_agency_name",
    isActiveFilter: false,

    label: "Name",
    name: "security_agency_name",
    placeholder: "Name",
    type: "text",
  },
  {
    NAME: "district__substate__state__region__region_name",
    isActiveFilter: false,

    label: "Region",
    name: "district__substate__state__region__region_name",
    placeholder: "Region",
    type: "text",
  },
  {
    NAME: "district__substate__state__state_name",
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
    NAME: "district__district_name",
    isActiveFilter: false,

    label: "District",
    name: "district__district_name",
    placeholder: "District",
    type: "text",
  },
  {
    NAME: "area__area_name",
    isActiveFilter: false,

    label: "Area",
    name: "area__area_name",
    placeholder: "Area",
    type: "text",
  },
  {
    NAME: "security_agency_address",
    isActiveFilter: false,

    label: "Address",
    name: "security_agency_address",
    placeholder: "Security Agency address",
    type: "text",
  },
  {
    NAME: "pincode",
    isActiveFilter: false,

    label: "Pin Code",
    name: "pincode",
    placeholder: "Pin Code",
    type: "number",
  },
  {
    NAME: "contact_no",
    isActiveFilter: false,

    label: "Agency Contact No",
    name: "contact_no",
    placeholder: "Agency Contact No",
    type: "number",
  },
  {
    NAME: "securityagencyagreementdetails__agreement_start_date__range",
    isActiveFilter: false,

    label: " Contract Start Date Range",
    name: "securityagencyagreementdetails__agreement_start_date__range",
    placeholder: "Contract Start Date",
    type: "date_from_to",
  },
  {
    NAME: "securityagencyagreementdetails__agreement_end_date__range",
    isActiveFilter: false,

    label: " Contract End Range",
    name: "securityagencyagreementdetails__agreement_end_date__range",
    placeholder: "Contract End Date",
    type: "date_future",
  },
  // {
  //   NAME: "agency_contract_duration",
  //   isActiveFilter: false,

  //   label: "Contract Duration",
  //   name: "agency_contract_duration",
  //   placeholder: "Contract Duration",
  //   type: "text",
  // },
  // {
  //   NAME: "service_cost",
  //   isActiveFilter: false,

  //   label: "Service Cost",
  //   name: "service_cost",
  //   placeholder: "Service Cost",
  //   type: "number",
  // },
  {
    NAME: "remarks",
    isActiveFilter: false,

    label: "Remarks",
    name: "remarks",
    placeholder: "Remarks",
    type: "text",
  },
  {
    "Creation Date": "creation_date",
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
  {
    DESCRIPTION: "description",
    isActiveFilter: false,
  },
];

const addEditFormFields = [
  {
    name: "pincode",
    label: "Pin Code",
    placeholder: "Pin Code",
    type: "number",
  },
  {
    name: "security_agency_address",
    label: "Security Agency address",
    placeholder: "Security Agency address",
    type: "textArea",
  },
  {
    name: "contact_no",
    label: "Contact No",
    placeholder: "Contact No",
    type: "number",
  },
  {
    name: "contact_person_name",
    label: "Contact Person Name",
    placeholder: "Contact Person Name",
    type: "text",
  },
  {
    name: "security_agency_gstin",
    label: "Security agency GSTIN",
    placeholder: "Security agency GSTIN",
    type: "text",
  },
  {
    name: "epf_no",
    label: "EPF no",
    placeholder: "EPF no",
    type: "text",
  },
  {
    name: "esic_no",
    label: "ESIC no",
    placeholder: "ESIC no",
    type: "number",
  },
  {
    name: "remarks",
    label: "Remarks",
    placeholder: "remarks",
    type: "textArea",
  },
];

const schema = yup.object().shape({
  security_agency_name: yup
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
  security_agency_address: yup
    .string()
    .trim()
    .required(() => null),
  pincode: yup
    .number()
    .integer("Pin code must be an integer")
    .transform((value, originalValue) => {
      if (originalValue.trim() === "") {
        return NaN; // Treat empty input as NaN
      }
      return value;
    })
    .min(100000, "Pin code must be at least 6 digits")
    .max(999999, "Pin code cannot be longer than 6 digits")
    .required(() => null)
    .typeError(),
  contact_no: yup
    .number() // Value should be a number
    .typeError("") // Error message if not a number
    .required(() => null) // Error message if not provided
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
  contact_person_name: yup
    .string()
    .trim()
    .required(() => null),
  security_agency_gstin: yup
    .string()
    .trim()
    .required(() => null),
  epf_no: yup
    .string()
    .trim()
    .max(22, "EPF number Not More Than 22")
    .required(() => null),
  remarks: yup.string().trim().nullable(),
  // esic_no: yup
  //   .number() // Value should be a string
  //   // .test(
  //   //   "esic-length",
  //   //   "ESIC no must be exactly 17 characters",
  //   //   (val) => val === undefined || val.length === 17
  //   // )
  //   .typeError()
  //   .required(() => null)
  //   .min(17, "ESIC number must be exactly 17 characters")
  //   .max(17, "ESIC number must be exactly 17 characters"), // Error message if not provided
  // remarks: yup.string().trim(),
  esic_no: yup
  .string()
  
  .required(() => null)
  .typeError("")
  .length(17, "ESIC number must be exactly 17 digits"),

  is_active: yup.string(),
  agreement: yup.array(),
  services: yup.array(),
  //agreement_upload_path: yup.string().required(""),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("security_agency_name", {
    cell: (info) => info.getValue(),
    header: "NAME",
  }),
  columnHelper.accessor("region.region_name", {
    cell: (info) => info.getValue(),
    header: "REGION NAME",
  }),
  columnHelper.accessor("state.state_name", {
    cell: (info) => info.getValue(),
    header: "STATE NAME",
  }),
  columnHelper.accessor("substate.substate_name", {
    cell: (info) => info.getValue(),
    header: "SUB STATE NAME",
  }),
  columnHelper.accessor("district.district_name", {
    cell: (info) => info.getValue(),
    header: "DISTRICT NAME",
  }),
  columnHelper.accessor("area.area_name", {
    cell: (info) => info.getValue(),
    header: "AREA NAME",
  }),
  columnHelper.accessor("security_agency_address", {
    cell: (info) => info.getValue(),
    header: "ADDRESS",
  }),
  columnHelper.accessor("pincode", {
    cell: (info) => info.getValue(),
    header: "PINCODE",
  }),
  columnHelper.accessor("contact_person_name", {
    cell: (info) => info.getValue(),
    header: "CONTACT PERSON NAME",
  }),
  columnHelper.accessor("contact_no", {
    cell: (info) => info.getValue(),
    header: "AGENCY CONTACT NO.",
  }),
  columnHelper.accessor("current_agreement.agreement_start_date", {
    cell: (info) =>
      info.getValue() ? moment(info.getValue()).format("LL") : " - ",
    header: "CONTRACT START DATE ",
  }),
  columnHelper.accessor("current_agreement.agreement_end_date", {
    cell: (info) =>
      info.getValue() ? moment(info.getValue()).format("LL") : " - ",
    header: "CONTRACT END DATE ",
  }),
  columnHelper.accessor("remarks", {
    cell: (info) => info.getValue(),
    header: "REMARKS",
  }),
  columnHelper.accessor("last_updated_user.employee_name",{
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("creation_date", {
    cell: (info) => info.getValue(),
    header: " Creation Date",
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
          isChecked={info.row.original.is_active}
        />
      </Box>
    ),
    id: "active",
    accessorFn: (row) => row.active,
  }),
];

export { filterFields, addEditFormFields, schema, columns };
