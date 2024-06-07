import * as yup from "yup";

const filterFields = [
  {
    "company name": "insurance_company_name",
    isActiveFilter: false,

    label: "Company Name",
    name: "insurance_company_name",
    placeholder: "Company Name",
    type: "text",
  },
  {
    "Region ": "region",
    isActiveFilter: false,

    label: " Region",
    name: "region",
    placeholder: "Region ",
    type: "text",
  },
  {
    " State": "state",
    isActiveFilter: false,

    label: " Region",
    name: "state",
    placeholder: "Region ",
    type: "text",
  },
  {
    ADDRESS: "insurance_company_address",
    isActiveFilter: false,

    label: "Address",
    name: "insurance_company_address",
    placeholder: "Address",
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
  {
    name: "insurance_company_name",
    label: "Company Name",
    placeholder: "Company Name",
    type: "text",
  },
  // {
  //   name: "insurance_company_address",
  //   label: "Address",
  //   placeholder: "Address",
  //   type: "text",
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
  insurance_company_name: yup
    .string()
    .trim()
    .required(() => null),
  insurance_company_address: yup
    .string()
    .trim()
    .required(() => null),

  active: yup.string(),
});

export { filterFields, addEditFormFields, schema };
