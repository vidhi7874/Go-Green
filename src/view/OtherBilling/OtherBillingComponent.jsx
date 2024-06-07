import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { columns, filterFields } from "./field";
import { useNavigate } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Text } from "@chakra-ui/react";
import { setUpFilterFields } from "../../features/filter.slice";
import ROUTE_PATH from "../../constants/ROUTE";
import { useGetRegionMasterMutation } from "../../features/master-api-slice";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import { useGetOtherBillingMutation } from "../../features/billing.slice";
import { BsEye } from "react-icons/bs";

export default function OtherBillingComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigation = useNavigate();

  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );

  const columnHelper = createColumnHelper();

  const [pagePerm, setPagePerm] = useState({
    view: true,
    edit: false,
    add: false,
  });

  const [filter, setFilter] = useState({
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    add: false,
    modal: "OtherBilling",
    excelDownload: "OtherBilling",
  });

  const [viewColumns, setViewColumns] = useState(columns);

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  const [data, setData] = useState([]);
  let paramString = "";
  //Add Form Link Function Start
  const addForm = () => {
    navigate(`${ROUTE_PATH.OTHER_BILLING_ADD}`);
  };
  //Add Form Link Function End

  //Edit Form Link Function Start
  // const editForm = (info) => {
  //   // console.log(
  //   //   // "info.row.original.id kunal>>",
  //   //   `${ROUTE_PATH.OTHER_BILLING_EDIT}/${info.row.original.id}`,
  //   //   info.row.original.id
  //   // );
  //   navigation(`${ROUTE_PATH.OTHER_BILLING_EDIT}/${info.row.original.id}`, {
  //     state: { details: info.row.original },
  //   });
  // };

  const viewForm = (info) => {
    console.log("Info:", info);
    const otherBillingId = info.row.original.id;

    console.log("Navigating to role id:", otherBillingId);

    navigate(`${ROUTE_PATH.OTHER_BILLING_EDIT}/${otherBillingId}`, {
      state: {
        details: info.row.original,
        view: true,
      },
    });
  };


  //Edit Form Link Function End

  //Other Billing Get Api Start
  const [
    getOtherBillingMaster,
    { isLoading: getOtherBillingMasterApiIsLoading },
  ] = useGetOtherBillingMutation();

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
      const response = await getOtherBillingMaster(query).unwrap();
      console.log("Success:", response);
      setData(response?.results || []);

      setPagePerm({
        view: response?.view || false,
        add: response?.add || false,
        edit: response?.edit || false,
      });

      if (response?.edit) {
        setViewColumns([
          ...columns,
          // columnHelper.accessor("view", {
  //   header: () => (
  //     <Text as="span" id="view_col" fontWeight="800">
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
  //   accessorFn: (row) => row.update_col,
  // }),
    columnHelper.accessor("view", {
    header: () => (
      <Text as="span" id="update_col" fontWeight="800">
        View
      </Text>
    ),
    cell: (info) => (
      <Flex justifyContent="center" color="primary.700" id="update_row">
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
      console.error("Error:", error);
      setPagePerm({
        // view: false,
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
      {pagePerm?.view ? (
        <FunctionalTable
          filter={filter}
          filterFields={filterFields}
          setFilter={setFilter}
          columns={viewColumns}
          data={data}
          loading={getOtherBillingMasterApiIsLoading}
          addForm={() => addForm()}
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
