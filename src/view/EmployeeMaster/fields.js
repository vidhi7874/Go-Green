import * as yup from "yup";

const filterFields = [
  {
    " Full Name": "employee_full_name",
    isActiveFilter: false,

    label: " Full Name",
    name: "employee_full_name",
    placeholder: " Full Name",
    type: "text",
  },
  {
    "Mobile No": "contact_number",
    isActiveFilter: false,

    label: "Mobile No",
    name: "contact_number",
    placeholder: "Mobile No",
    type: "number",
  },
  {
    " User": "user__email",
    isActiveFilter: false,
    label: "User ",
    name: "user__email",
    placeholder: " User",
    type: "select",
  },
  {
    Region: "region_id__region_name",
    isActiveFilter: false,

    label: "Region ",
    name: "region_id__region_name",
    placeholder: "Region ",
    type: "select",
    multi: false,
    options: [
      {
        label: "Region",
        value: "True",
      },
    ],
  },
  {
    "State ": "state_id__state_name",
    isActiveFilter: false,

    label: "State ",
    name: "state_id__state_name",
    placeholder: "State ",
    type: "select",
  },
  {
    "Zone ": "zone_id__zone_name",
    isActiveFilter: false,

    label: "Zone ",
    name: "zone_id__zone_name",
    placeholder: "Zone ",
    type: "select",
  },
  {
    "District ": "district_id__district_name",
    isActiveFilter: false,

    label: "District ",
    name: "district_id__district_name",
    placeholder: "District ",
    type: "select",
  },
  {
    "Role ": "role__role_name",
    isActiveFilter: false,

    label: "Role ",
    name: "role__role_name",
    placeholder: "Role ",
    type: "select",
  },
  {
    "Area ": "area__area_name",
    isActiveFilter: false,

    label: "Area ",
    name: "area__area_name",
    placeholder: "Area ",
    type: "select",
  },
  {
    "Department ": "department__department_name",
    isActiveFilter: false,

    label: "Department ",
    name: "department__department_name",
    placeholder: "Department ",
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
    "Pin Code": "pin_code",
    isActiveFilter: false,

    label: "Pin Code",
    name: "pin_code",
    placeholder: "Pin Code",
    type: "number",
  },
  {
    "Email ": "email_id",
    isActiveFilter: false,

    label: "Email ",
    name: "email_id",
    placeholder: "Email ",
    type: "text",
  },

  {
    "Job Title": "job_title",
    isActiveFilter: false,

    label: "Job Title",
    name: "job_title",
    placeholder: "Job Title",
    type: "text",
  },
  {
    "Reporting Manager": "reporting_manager_id__email",
    isActiveFilter: false,

    label: "Reporting Manager ",
    name: "reporting_manager_id__email",
    placeholder: "Reporting Manager ",
    type: "text",
  },

  {
    "Last Update Active": "ACTIVE",
    isActiveFilter: false,

    label: "ACTIVE/DeActive",
    name: "is_active",
    placeholder: "Active/DeActive",
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
  // {
  //   label: "User ",
  //   name: "user.email",
  //   placeholder: " User",
  //   type: "email",
  // },
  // {
  //   label: " Full Name",
  //   name: "employee_full_name",
  //   placeholder: " Full Name",
  //   type: "text",
  // },
  // {
  //   label: "Mobile No",
  //   name: "contact_number",
  //   placeholder: "Mobile No",
  //   type: "number",
  // },
  // {
  //   label: "Region ",
  //   name: "region_id.region_name",
  //   placeholder: "Region ",
  //   type: "text",
  // },
  // {
  //   label: "State ",
  //   name: "state_id.state_name",
  //   placeholder: "State ",
  //   type: "number",
  // },
  // {
  //   label: "Zone ",
  //   name: "zone_id.zone_name",
  //   placeholder: "Zone ",
  //   type: "text",
  // },
  // {
  //   label: "District ",
  //   name: "district_id.district_name",
  //   placeholder: "District ",
  //   type: "text",
  // },
  // {
  //   label: "Role ",
  //   name: "role.role_name",
  //   placeholder: "Role ",
  //   type: "text",
  // },
  // {
  //   label: "Area ",
  //   name: "area.area_name",
  //   placeholder: "Area ",
  //   type: "text",
  // },
  //
  // {
  //   label: "Address",
  //   name: "address",
  //   placeholder: "Address",
  //   type: "text",
  // },
  // {
  //   label: "Pin Code",
  //   name: "pin_code",
  //   placeholder: "Pin Code",
  //   type: "number",
  // },
  // {
  //   label: "Email",
  //   name: "email_id",
  //   placeholder: "Enter Username",
  //   type: "email",
  // },
  // {
  //   label: "Department ",
  //   name: "department.department_name",
  //   placeholder: "Department ",
  //   type: "text",
  // },
  // {
  //   label: "Job Title",
  //   name: "job_title",
  //   placeholder: "Job Title",
  //   type: "text",
  // },
  // {
  //   label: "Reporting Manager ",
  //   name: "reporting_manager_id.email",
  //   placeholder: "Reporting Manager ",
  //   type: "email",
  // },
  // {
  //   label: "Active/DeActive",
  //   name: "active",
  //   type: "switch",
  // },
];

const schema = yup.object().shape({
  user: yup
    .string()
    .trim()
    .required(() => null),
  employee_full_name: yup
    .string()
    .trim()
    .required(() => null),
  contact_number: yup
    .string()
    .trim()
    .required(() => null),
  region_id: yup
    .string()
    .trim()
    .required(() => null),
  state_id: yup
    .string()
    .trim()
    .required(() => null),
  zone_id: yup
    .string()
    .trim()
    .required(() => null),
  district_id: yup
    .string()
    .trim()
    .required(() => null),
  role: yup
    .string()
    .trim()
    .required(() => null),
  area_id: yup
    .string()
    .trim()
    .required(() => null),
  // department__department_name: yup.string().trim().required("department is required"),
  address: yup
    .string()
    .trim()
    .required(() => null),
  pin_code: yup.number().required(() => null),
  email_id: yup
    .string()
    .trim()
    .email()
    .required(() => null),
  job_title: yup
    .string()
    .trim()
    .required(() => null),
  reporting_manager_id: yup
    .string()
    .trim()
    .required(() => null),

  is_active: yup.string(),
});

export { filterFields, addEditFormFields, schema };
