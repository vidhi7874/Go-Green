import * as yup from "yup";

const filterFields = [
  {
    "Department Name": "department_name",
    isActiveFilter: false,

    label: "Department Name",
    name: "department_name",
    placeholder: "Department Name",
    type: "text",
  },
  {
    "CREATION DATE": "creation_date",
    isActiveFilter: false,
    label: "Creation Date",
    name: "creation_date",
    placeholder: "Creation Date",
    type: "date",
    max: new Date().toISOString().split("T")[0],
  },
  {
    "LAST UPDATED DATE": "last_updated_date",
    isActiveFilter: false,
    label: "Last Updated Date",
    name: "last_updated_date",
    placeholder: "Last Updated Date",
    type: "date",
    max: new Date().toISOString().split("T")[0],
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
        label: "Deactive",
        value: "False",
      },
    ],
  },
];

const addEditFormFields = [
  {
    name: "department_name",
    label: "Department Name",
    placeholder: "Department Name",
    type: "text",
  },

  {
    label: "Active",
    name: "is_active",
    type: "switch",
  },
];

const schema = yup.object().shape({
  department_name: yup
    .string()
    .trim()
    .required(() => null),
  is_active: yup.string(),
});

export { filterFields, addEditFormFields, schema };
