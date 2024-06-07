import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import { columns, filterFields } from "./fields";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import {
  useGetCommodityPricePullingMutation,
  usePricePullingpostFileUploadMutation,
} from "../../features/master-api-slice";
import { createColumnHelper } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import { setUpFilterFields } from "../../features/filter.slice";
import { BiEditAlt } from "react-icons/bi";
// import { toasterAlert } from "../../services/common.service";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { useNavigate } from "react-router-dom";
import ROUTE_PATH from "../../constants/ROUTE";
import moment from "moment";
import { downloadExcelFile, uploadExcel } from "../../services/excelDownload";
import { CommonToasterAlert } from "../../services/common.service";
import { BsEye } from "react-icons/bs";

function CommodityPricePullingMaster() {
  const dispatch = useDispatch();

  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );

  const columnHelper = createColumnHelper();

  const [pagePerm, setPagePerm] = useState({
    view: true,
    edit: false,
    add: false,
  });
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    // filter: [],
    // search: null,
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    add: false,
    modal: "CommodityCurrentPrice",
    excelDownload: "CommodityCurrentPrice",
    upload: true,
  });
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [fileUploadHandle] = usePricePullingpostFileUploadMutation();

  const handleFileUpload = async (e) => {
    try {
      if (e?.target?.files[0]) {
        const selectedFile = e.target.files[0];

        const response = await uploadExcel(selectedFile);
        console.log("file upload response", response);
        getData();
      }
    } catch (error) {
      console.error("Error:", error);
      // showToastByStatusCode(error);
      CommonToasterAlert(error);
    }
  };

  const editForm = (info) => {
    let editedFormId = info.row.original.id;

    navigate(
      `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING_EDIT}/${info.row.original.id}`,
      {
        state: { details: info.row.original },
      }
    );
  };

  const [viewColumns, setViewColumns] = useState(columns);

  const viewForm = (info) => {
    console.log("Info:", info);
    const pullingId = info.row.original.id;

    console.log("Navigating to role id:", pullingId);

    navigate(
      `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING_EDIT}/${pullingId}`,
      {
        state: {
          details: info.row.original,
          view: true,
        },
      }
    );
  };

  const addForm = () => {
    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING_ADD}`);
  };
  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  const [data, setData] = useState([]);

  let paramString = "";

  //start calling get api of commodity price pulling
  const [
    getCommodityPricePulling,
    { isLoading: getCommodityPricePullingMasterApiIsLoading },
  ] = useGetCommodityPricePullingMutation();

  const getData = async () => {
    paramString = Object.entries(filter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .map((item) => `${key}=${encodeURIComponent(item)}`)
            .join("&");
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join("&");
    try {
      let query = filterQuery ? `${paramString}&${filterQuery}` : paramString;

      const response = await getCommodityPricePulling(query).unwrap();
      // console.log("success", response);
      setData(response?.results || []);

      setPagePerm({
        view: response?.view || false,
        add: response?.add || false,
        edit: response?.edit || false,
      });

      if (response?.edit) {
        setViewColumns([
          ...columns,

          columnHelper.accessor("view", {
            header: () => (
              <Text as="span" id="view_col" fontWeight="800">
                View
              </Text>
            ),
            cell: (info) => (
              <Flex justifyContent="center" color="primary.700" id="view_row">
                <BsEye
                  fontSize="26px"
                  cursor="pointer"
                  onClick={() => viewForm(info)}
                />
              </Flex>
            ),
            id: "view_col",
            accessorFn: (row) => row.update_col,
          }),

          columnHelper.accessor("update", {
            header: () => (
              <Text id="update_col" fontWeight="800">
                UPDATE
              </Text>
            ),
            cell: (info) => {
              const givenDate = info.row.original.recorded_date;
              const todayDate = moment().format("YYYY-MM-DD");
              const isNotToday = moment(givenDate).isSame(todayDate, "day");
              const isNotEqualAndGreater = moment(givenDate).isAfter(
                todayDate,
                "day"
              );
              return (
                <Flex
                  justifyContent="center"
                  color="primary.700"
                  id="update_row"
                >
                  <Button
                    isDisabled={!(isNotToday || isNotEqualAndGreater)}
                    onClick={() => editForm(info)}
                    bg="transparent"
                    color="primary.700"
                  >
                    <BiEditAlt fontSize="26px" />
                  </Button>
                </Flex>
              );
            },
            id: "update_col",
            accessorFn: (row) => row.update_col,
          }),
        ]);
      }

      setFilter((old) => ({
        ...old,
        totalPage: Math.ceil(response?.total / old.limit),
        total: response?.total_data,
        totalFilter: response?.total,
        add: response?.add || false,
        excelDownload: filterQuery ? `${old.modal}&${filterQuery}` : old.modal,
      }));
    } catch (error) {
      console.log("error: " + error);
      setPagePerm({
        view: false,
        add: false,
        edit: false,
      });
    }
  };

  useEffect(() => {
    tableFilterSet();
    getData();
    // eslint-disable-next-line
  }, [filter.limit, filter.page, filterQuery]);
  return (
    <div>
      <Input
        // {...field}
        type="file"
        ref={fileInputRef}
        height={"15px"}
        display={"none"}
        // accept={}
        onChange={handleFileUpload}
        // isDisabled={InputDisabled}
        // width={{ base: "90%" }}
        // borderColor={showErr ? "red" : "gray.10"}
      />
      {pagePerm?.view ? (
        <FunctionalTable
          filter={filter}
          filterFields={filterFields}
          setFilter={setFilter}
          columns={viewColumns}
          data={data}
          loading={getCommodityPricePullingMasterApiIsLoading}
          addForm={() => addForm()}
          uploadFile={() => handleButtonClick()}
        />
      ) : (
        <>
          <NotaccessImage />
          {/* <Text as="h3" color="black" fontWeight="800">
            You do not have access to this page{" "}
          </Text> */}
        </>
      )}
    </div>
  );
}
export default CommodityPricePullingMaster;
