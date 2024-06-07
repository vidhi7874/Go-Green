import * as yup from "yup";
// import validation from "../../utils/validation";
// import { Box, Button, Flex, Switch, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
// import { BsEye } from "react-icons/bs";
import moment from "moment";
import { Flex, Text } from "@chakra-ui/react";
import { BiDownload } from "react-icons/bi";
import configuration from "../../config/configuration";
import { useState } from "react";

function downloadPdf(info) {
  // let id = info?.row?.original?.id;
  let id = info.row?.original?.qcr?.map((el) => el?.id);

  let qcrStatusArray = info?.row?.original?.qcr?.map(
    (el) => el?.status?.description
  );

  if (qcrStatusArray.includes("l2 approved")) {
    let url = `${configuration.BASE_URL}billing_flow/qcr_billing_download/${id}/`;
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(
          new Blob([blob], { type: "application/pdf" })
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = `${id}.pdf`; // Set the filename with .pdf extension
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading PDF:", error));
  } else {
    // Disable the download and block the mouse pointer for other statuses
    console.log("Download not allowed. QCR status is not L2 approved.");
    document.body.style.pointerEvents = "none"; // Disable mouse events
    setTimeout(() => {
      document.body.style.pointerEvents = ""; // Enable mouse events after a delay
    }, 3000); // Adjust the delay as needed (in milliseconds)
  }

  // let url = `${configuration.BASE_URL}billing_flow/qcr_billing_download/${id}/`;
  // fetch(url)
  //   .then((response) => response.blob())
  //   .then((blob) => {
  //     const url = window.URL.createObjectURL(
  //       new Blob([blob], { type: "application/pdf" })
  //     );
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `${id}.pdf`; // Set the filename with .pdf extension
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   })
  //   .catch((error) => console.error("Error downloading PDF:", error));
}

const columnHelper = createColumnHelper();
const filterFields = [
  {
    "CIR No": "cir_no",
    isActiveFilter: false,

    label: "CIR No",
    name: "cir_no",
    placeholder: "CIR No",
    type: "text",
  },

  {
    "Warehouse name": "warehouse",
    isActiveFilter: false,

    label: "Warehouse name",
    name: "warehouse",
    placeholder: "Warehouse name",
    type: "text",
  },
  {
    "Client name": "service_contract_no__client__name_of_client",
    isActiveFilter: false,

    label: "Client name",
    name: "service_contract_no__client__name_of_client",
    placeholder: "Client name",
    type: "text",
  },
  {
    "Chamber No": "chamber__chamber_number",
    isActiveFilter: false,

    label: "Chamber No",
    name: "chamber__chamber_number",
    placeholder: "Chamber No",
    type: "text",
  },
  {
    "Commodity name": "commodity",
    isActiveFilter: false,

    label: "Commodity name",
    name: "commodity",
    placeholder: "Commodity name",
    type: "text",
  },
  {
    "Commodity variety": "commodity_variety",
    isActiveFilter: false,

    label: "Commodity variety",
    name: "commodity_variety",
    placeholder: "Commodity variety",
    type: "text",
  },

  // {
  //   "Create Qc report": "Create Qc report",
  //   isActiveFilter: false,

  //   label: "Create Qc report",
  //   name: "Create Qc report",
  //   placeholder: "Create Qc report",
  //   type: "text",
  // },
  {
    "QCR status": "status__description",
    isActiveFilter: false,

    label: "QCR status",
    name: "status__description",
    placeholder: "QCR status",
    type: "text",
  },
  {
    "QCR L 1 user": "l1_user__employee_name",
    isActiveFilter: false,

    label: "QCR L 1 user",
    name: "l1_user__employee_name",
    placeholder: "QCR L 1 user",
    type: "text",
  },
  {
    "Qcr L 2 user": "l2_user__employee_name",
    isActiveFilter: false,

    label: "Qcr L 2 user",
    name: "l2_user__employee_name",
    placeholder: "Qcr L 2 user",
    type: "text",
  },

  {
    "QCR Creation date": "created_at",
    isActiveFilter: false,
    label: "QCR Creation date",
    name: "created_at",
    placeholder: "QCR Creation date",
    type: "date_from_to",
    max: new Date().toISOString().split("T")[0],
  },
  {
    "QCR Last updated date": "updated_at",
    isActiveFilter: false,
    label: "QCR Last updated date",
    name: "updated_at",
    placeholder: "QCR Last updated date",
    type: "date_from_to",
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
        label: "ACTIVE",
        value: "True",
      },
      {
        label: "DeActive",
        value: "False",
      },
    ],
  },
  // {
  //   "MINIMUM BAG SIZE": "minimum_bag_size",
  //   isActiveFilter: false,
  // },
  // {
  //   "MAXIMUM BAG SIZE": "maximum_bag_size",
  //   isActiveFilter: false,
  // },
  // {
  //   "RENT ON BAG M/T": "rent_on_bag",
  //   isActiveFilter: false,
  // },
];

const addEditFormFields = [
  // {
  //   name: "hiring_proposal_id.id",
  //   label: "Hiring Proposal ID",
  //   placeholder: "Hiring Proposal ID",
  //   type: "select",
  // },
  {
    name: "warehouse_owner_name",
    label: "Owner Name",
    placeholder: "Owner Name",
    type: "text",
  },
  {
    name: "warehouse_owner_contact_no",
    label: "Owner ContactNo",
    placeholder: "Owner ContactNo",
    type: "text",
  },
  {
    name: "warehouse_owner_address",
    label: "Owner Address",
    placeholder: "Owner Address",
    type: "text",
  },
  {
    name: "rent_amount",
    label: "Rent Amt",
    placeholder: "Rent Amt",
    type: "number",
  },
  {
    name: "revenue_sharing_ratio",
    label: "Revenue Sharing Ratio",
    placeholder: "Revenue Sharing Ratio",
    type: "number",
  },

  //   {
  //     label: "Active",
  //     name: "is_active",
  //     type: "switch",
  //   },
];

const schema = yup.object().shape({
  // hiring_proposal_id: yup.string().trim().required("Hiring proposal id is required"),
  cir_no: yup
    .string()
    .trim()
    .required(() => null),
  warehouse: yup
    .string()
    .trim()
    .required(() => null),
  chamber: yup
    .string()
    .trim()
    .required(() => null),
  commodity: yup
    .string()
    .trim()
    .required(() => null),
  commodity_variety: yup
    .string()
    .trim()
    .required(() => null),
  lab_location: yup.string().required(() => null),
  model_of_packing: yup
    .string()
    //.trim()
    //.matches(validation.phoneRegExp, "Contact number is not valid")
    .required(() => null),
  sampling_date: yup
    .string()
    .trim()
    .required(() => null),
  receipt_date: yup
    .string()
    // .trim()
    .required(() => null),
  completion_date: yup
    .string()
    //.trim()
    .required(() => null),
  remarks: yup.string().trim(),
  rejectReason_text: yup.string().trim(),
  grade_for_bank:yup.string().trim().notRequired(),
  // grade_for_ggrn: yup.string().when('qcrstatus', {
  //   is: (qcrstatus) => {
  //     console.log('qcrstatus:', qcrstatus);
  //     return Number(qcrstatus || 0) > 1;
  //   },
  //   then:() => yup.string().required('Grade for GGRN is required'),
  //   otherwise: () => yup.string().trim(),
  // }),
  grade_for_ggrn:yup.string().trim().notRequired(),
  

  

  cir_date: yup
    .string()
    .trim()
    .required(() => null),

  quality_control_report_parameter_details: yup.array().of(
    yup.object().shape({
      // other properties...
      final_test_result: yup
        .string()
        .trim()
        .required("Final test result is required"),
    })
  ),

  // document_status: yup
  // .string()
  // .trim()
  // .required(() => null),
  // created_user: yup
  // .number()
  // .required(() => null)
  // .typeError(""),
  // email_id: yup
  //   .string()
  //   .trim()
  //   .required(() => null),
  // rent_amount: yup
  //   .number()
  //   .required(() => null)
  //   .typeError(""),
  // revenue_sharing_ratio: yup
  //   .number()
  //   .required(() => null)
  //   .typeError(""),
  //   is_active: yup.string(),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "Sr. No",
  }),
  columnHelper.accessor("cir_no", {
    cell: (info) => info.getValue() ?? "N/A",
    header: "CIR No",
  }),
  columnHelper.accessor("cir_no", {
    cell: (info) => {
      let warehouse_name = info.row?.original?.qcr?.map((el) => el?.id);
      console.log(warehouse_name);
      return warehouse_name;
    },
    header: "QCR No",
  }),

  columnHelper.accessor("warehouse.warehouse_name", {
    cell: (info) => {
      let warehouse_name = info.row?.original?.qcr?.map(
        (el) => el.cir_no?.warehouse?.warehouse_name
      );
      console.log(warehouse_name);
      return warehouse_name;
    },
    header: "Warehouse name",
  }),
  columnHelper.accessor("service_contract_no.client.name_of_client", {
    cell: (info) => info.getValue() || "-",
    header: "Client Name",
  }),
  // columnHelper.accessor("cir_no.client.name_of_client", {
  //   cell: (info) => {
  //     let warehouse_name = info.row?.original?.qcr?.map(
  //       (el) => el.cir_no?.warehouse?.warehouse_name
  //     );

  //     return warehouse_name || "-";
  //   },
  //   header: "Client name",
  // }),

  columnHelper.accessor("chamber.chamber_number", {
    cell: (info) => {
      let chamber_number = info.row?.original?.qcr?.map(
        (el) => el.cir_no?.chamber?.chamber_number
      );

      return chamber_number;
    },
    header: "Chamber No",
  }),
  columnHelper.accessor("commodity.commodity_name", {
    cell: (info) => {
      console.log(info.row?.original?.qcr, "hiii");
      let commodity_name = info.row?.original?.qcr?.map(
        (el) => el.cir_no?.commodity?.commodity_name
      );

      return commodity_name;
    },
    header: "Commodity name",
  }),
  columnHelper.accessor("commodity_variety.commodity_variety", {
    cell: (info) => {
      console.log(info.row?.original?.qcr, "hiii");
      let commodity_variety = info.row?.original?.qcr?.map(
        (el) => el.cir_no?.commodity_variety?.commodity_variety
      );

      return commodity_variety;
    },
    header: "Commodity variety",
  }),

  // columnHelper.accessor("Create Qc report Button", {
  //   cell: (info) => (
  //     <Button bg="primary.700" color="white" _hover={{}}>
  //       Create QCR
  //     </Button>
  //   ),
  //   header: "Create Qc report",
  // }),

  columnHelper.accessor("qc_report_status", {
    cell: (info) => {
      console.log(info.row?.original?.qcr, "hiii");
      let qcr_status = info.row?.original?.qcr?.map(
        (el) => el?.status?.description
      );
      console.log("qcr_status", qcr_status);
      return qcr_status;
    },
    header: "QCR status",
  }),
  columnHelper.accessor("employee_name", {
    cell: (info) => {
      console.log(info.row?.original?.qcr, "hiii");
      let qcr_l1_employee = info.row?.original?.qcr?.map(
        (el) => el?.l1_user?.employee_name
      );

      return qcr_l1_employee;
    },
    header: "QCR L 1 user",
  }),
  columnHelper.accessor("employee_name", {
    cell: (info) => {
      console.log(info.row?.original?.qcr, "hiii");
      let qcr_l2_employee = info.row?.original?.qcr?.map(
        (el) => el?.l2_user?.employee_name
      );

      return qcr_l2_employee;
    },
    header: "Qcr L 2 user ",
  }),

  columnHelper.accessor("created_user?.created_at", {
    cell: (info) => {
      let created_date = info.row?.original?.created_at;
      console.log("dates ", info.row?.original);
      console.log(created_date);
      return moment(created_date).format("MMMM DD YYYY");
    },
    header: "QCR Creation date",
  }),
  columnHelper.accessor("created_user?.updated_at", {
    cell: (info) => {
      let updated_date = info.row?.original?.updated_at;
      return moment(updated_date).format("MMMM DD YYYY");
    },
    header: "QCR Last updated date",
  }),
  // columnHelper.accessor("update", {
  //   header: () => (
  //     <Text id="update_col" fontWeight="800">
  //       DOWNLOAD
  //     </Text>
  //   ),
  //   cell: (info) => {
  //     let qcr_status = info.row?.original?.qcr?.map(
  //       (el) => el?.status?.description
  //     );

  //     <Flex justifyContent="center" color="primary.700" id="update_row">
  //       {info.row.original.qcr_status === "l2 approved" ? (
  //         <BiDownload
  //           fontSize="26px"
  //           cursor="pointer"
  //           onClick={() => downloadPdf(info)}
  //         />
  //       ) : (
  //         <BiDownload
  //           fontSize="26px"
  //           cursor="not-allowed"
  //           // onClick={() => downloadPdf(info)}
  //         />
  //       )}
  //     </Flex>;
  //   },

  //   id: "update_col",
  //   accessorFn: (row) => row.update_col,
  // }),

  columnHelper.accessor("update", {
    header: () => (
      <Text id="update_col" fontWeight="800">
        DOWNLOAD
      </Text>
    ),
    cell: (info) => {
      const qcrStatus = info.row?.original?.qcr?.map(
        (el) => el?.status?.description
      );
      const isDownloadAllowed = qcrStatus.includes("l2 approved");

      return (
        <Flex justifyContent="center" color="primary.700" id="update_row">
          <BiDownload
            fontSize="26px"
            cursor={isDownloadAllowed ? "pointer" : "not-allowed"}
            onClick={() => isDownloadAllowed && downloadPdf(info)}
          />
        </Flex>
      );
    },
    id: "update_col",
    accessorFn: (row) => row.update_col,
  }),

  // columnHelper.accessor("view", {
  //   header: () => (
  //     <Text id="view_col" fontWeight="800">
  //       View
  //     </Text>
  //   ),
  //   cell: (info) => (
  //     <Flex justifyContent="center" color="primary.700" id="view_row">
  //       <BsEye
  //         fontSize="26px"
  //         cursor="pointer"
  //         // onClick={() => viewForm(info)}
  //       />
  //     </Flex>
  //   ),
  //   id: "view_col",
  //   accessorFn: (row) => row.view_col,
  // }),

  // columnHelper.accessor("is_active", {
  //   // header: "ACTIVE",
  //   header: () => <Text id="active_col" fontWeight="800">Active</Text>,
  //   cell: (info) => (
  //     <Box id="active_row">
  //       <Switch
  //         size="md"
  //         colorScheme="whatsapp"
  //         // onChange={(e) => handleActiveDeActive(e, info)}
  //         isChecked={info.row.original.is_active}
  //         // id="active_row"
  //         // isReadOnly
  //         // isChecked={flexRender(
  //         //   cell.column.columnDef.cell,
  //         //   cell.getContext()
  //         // )}
  //       />
  //     </Box>
  //   ),
  //   id: "active",
  //   accessorFn: (row) => row.active,
  // }),
  // columnHelper.accessor("update", {
  //   // header: "UPDATE",
  //   header: () => (
  //     <Text id="update_col" fontWeight="800">
  //       UPDATE
  //     </Text>
  //   ),
  //   cell: (info) => (
  //     <Flex justifyContent="center" color="primary.700" id="update_row">
  //       <BiEditAlt
  //         // color="#A6CE39"
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
