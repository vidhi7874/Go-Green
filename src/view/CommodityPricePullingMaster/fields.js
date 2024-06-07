import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Text } from "@chakra-ui/react";
// import { BsEye } from "react-icons/bs";
import { BiDownload } from "react-icons/bi";
// import { API } from "../../constants/api.constants";
// import axios from "axios";
// import { localStorageService } from "../../services/localStorge.service";
import { downloadexcel } from "../../services/excelDownload";
import moment from "moment";
//import { useGetCommodityPricePullingMutation } from "../../features/master-api-slice";

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "Commodity Type":
      "commodity_variety__commodity_id__commodity_type__commodity_type",
    isActiveFilter: false,

    label: "Commodity Type ",
    name: "commodity_variety__commodity_id__commodity_type__commodity_type",
    placeholder: "Commodity Type ",
    type: "text",
  },
  {
    " Commodity Name": "commodity_variety__commodity_id__commodity_name",
    isActiveFilter: false,

    label: "Commodity Name",
    name: "commodity_variety__commodity_id__commodity_name",
    placeholder: "Commodity Name ",
    type: "text",
  },
  {
    "Commodity Verity ": "commodity_variety__commodity_variety",
    isActiveFilter: false,

    label: "Commodity Variety ",
    name: "commodity_variety__commodity_variety",
    placeholder: "Commodity Variety",
    type: "text",
  },
  {
    "region ": "region",
    isActiveFilter: false,

    label: "Region ",
    name: "region",
    placeholder: "Region",
    type: "text",
  },
  {
    state: "state",
    isActiveFilter: false,

    label: "State",
    name: "state",
    placeholder: "State",
    type: "text",
  },
  {
    "Sub State": "substate",
    isActiveFilter: false,

    label: "Sub State",
    name: "substate",
    placeholder: "Sub State",
    type: "text",
  },
  {
    District: "district",
    isActiveFilter: false,

    label: "District",
    name: "district",
    placeholder: "District",
    type: "text",
  },

  {
    "Commodity verity Rate(Rs/mt)": "commodity_rate",
    isActiveFilter: false,

    label: "Commodity variety Rate",
    name: "commodity_rate",
    placeholder: "Commodity variety Rate",
    type: "number",
  },
  {
    "Recorded Date": "recorded_date",
    isActiveFilter: false,
    label: "Recorded Date",
    name: "recorded_date",
    placeholder: "Recorded Date",
    type: "date_future",
  },

  {
    "LAST UPDATED DATE": "updated_at",
    isActiveFilter: false,
    label: "Last Updated Date Range",
    name: "updated_at",
    placeholder: "LAST UPDATED DATE",
    type: "date_from_to",
  },

  // {
  //   "LAST UPDATED ACTIVE": "ACTIVE",
  //   isActiveFilter: false,

  //   label: "Active",
  //   name: "is_active",
  //   placeholder: "Active",
  //   type: "select",
  //   multi: false,
  //   options: [
  //     {
  //       label: "Active",
  //       value: "True",
  //     },
  //     {
  //       label: "DeActive",
  //       value: "False",
  //     },
  //   ],
  // },
];
// ! commented the unused function..
// const downloadHistoricalRates = (id) => {
//   console.log("Downloading historical rates for ID: ", id);

//   // Replace the console.log with your actual download logic
// };

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue() || "-",
    header: "Sr. No",
  }),
  columnHelper.accessor(
    "commodity_id.commodity_type.commodity_type",
    {
      cell: (info) => info.getValue() || "-",
      header: " Commodity type",
    }
  ),
  columnHelper.accessor("commodity_variety.commodity_id.commodity_name", {
    cell: (info) => info.getValue() || "-",
    header: "Commodity name",
  }),
  columnHelper.accessor("commodity_variety.commodity_variety", {
    cell: (info) => info.getValue() || "-",
    header: "Commodity variety",
  }),
  columnHelper.accessor("region.region_name", {
    cell: (info) => info.getValue() || "-",
    header: "Region",
  }),
  columnHelper.accessor("state.state_name", {
    cell: (info) => info.getValue() || "-",
    header: "State",
  }),
  columnHelper.accessor("substate.substate_name", {
    cell: (info) => info.getValue() || "-",
    header: "Sub State",
  }),
  columnHelper.accessor("district.district_name", {
    cell: (info) => info.getValue() || "-",
    header: "District",
  }),
  // columnHelper.accessor("commodity_rate", {
  //   cell: (info) => info.getValue(),
  //   header: "Commodity verity Rate(Rs/mt) ",
  // }),
  columnHelper.accessor("min_price", {
    cell: (info) => info.getValue() || "-",
    header: "Min price ",
  }),
  columnHelper.accessor("max_price", {
    cell: (info) => info.getValue() || "-",
    header: "Max price ",
  }),
  columnHelper.accessor("modal_price", {
    cell: (info) => info.getValue() || "-",
    header: "Modal price(Rs/MT) ",
  }),
  // columnHelper.accessor("state.state_name", {
  //   cell: (info) => info.getValue(),
  //   header: "Download historical Rates",
  // }),
  columnHelper.accessor("id", {
    header: () => (
      <Text as="span" id="id"  fontWeight="800" >
        Download historical Rates
      </Text>
    ),
    cell: (info) => (
      <Flex justifyContent="center" color="primary.700" id="id">
        <BiDownload
          fontSize="26px"
          cursor="pointer"
          onClick={() => {
            try {
              downloadexcel(
                info?.row?.original?.id,
                info?.row?.original?.commodity_variety.commodity_id
                  .commodity_name
              );
            } catch (error) {
              console.error("Error downloading Excel file:", error);
            }
          }}
          // Assuming there's a function downloadHistoricalRates that takes the ID as a parameter
        />
      </Flex>
    ),
    id: "view_col",
    accessorFn: (row) => row.view_col,
  }),
  columnHelper.accessor("last_updated_user.employee_name", {
    cell: (info) => info.getValue() || "-",
    header: "last Updated User",
  }),
  columnHelper.accessor("recorded_date", {
    cell: (info) =>
      info.getValue() ? moment(info.getValue()).format("LL") : "-",
    header: "Recorded Date",
  }),
  columnHelper.accessor("last_updated_date", {
    cell: (info) => info.getValue(),
    header: "Last Updated Date",
  }),
  // columnHelper.accessor("is_active", {
  //   header: () => (
  //     <Text id="active_col" fontWeight="800">
  //       Active
  //     </Text>
  //   ),
  //   cell: (info) => (
  //     <Box id="active_row">
  //       <Switch
  //         size="md"
  //         colorScheme="whatsapp"
  //         isChecked={info.row.original.is_active}
  //       />
  //     </Box>
  //   ),
  //   id: "is_active",
  //   accessorFn: (row) => row.active,
  // }),
];

const schema = yup.object().shape({
  recorded_date: yup
    .date()
    .required(() => null)
    .typeError(),
  commodity_variety: yup
    .string()
    .required(() => null)
    .typeError(),
  commodity_id: yup
    .string()
    .trim()
    .required(() => null)
    .typeError(),

  max_price: yup
    .number()
    .required(() => null)
    .positive("Max Price Must Be Positive")
    .typeError(),
  min_price: yup
    .number()
    .required(() => null)
    .positive("Min Price Must Be Positive")
    .typeError("")
    .test({
      name: "minMaxCheck",
      message: "Min Price must be less than Max Price",
      test: function (minPrice) {
        const maxPrice = this.parent.max_price;
        return minPrice <= maxPrice;
      },
    }),
  modal_price: yup
    .number()
    .required(() => null)
    .positive("Modal Price Must Be Positive")
    .typeError(),
  is_active: yup.boolean().typeError(""),
  // commodity_type: yup
  //   .string()
  //   .trim()
  //   .required(() => null),
  region: yup.string().trim().required(" "),
  state: yup.string().trim().required(" "),

  substate: yup.string().trim().required(" "),
  district: yup.string().trim().required(" "),
});

export { filterFields, columns, schema };
