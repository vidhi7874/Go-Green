// import React from "react";

// export default function GatePassOutwardPage() {
//   return <div>GatePassOutwardPage</div>;
// }

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
// import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
// import FunctionalTable from "../../components/Tables/FunctionalTable";
import { outward_columns, filterFields } from "./fields";
import { useDispatch, useSelector } from "react-redux";
import { setUpFilterFields } from "../../features/filter.slice";
import { useNavigate } from "react-router-dom";
// import { useGetRegionMasterMutation } from "../../features/master-api-slice";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Text } from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { useGetGatePassOutwardMutation } from "../../features/gate-pass.slice";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import { BsEye } from "react-icons/bs";
import ROUTE_PATH from "../../constants/ROUTE";
// import { useGetGatePassMutation } from "../../features/gate-pass.slice";

function GatePassOutwardPage() {
  const navigation = useNavigate();
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

  const [filter, setFilter] = useState({
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    add: false,
    modal: "OutwardGatePass",
    excelDownload: "OutwardGatePass",
  });

  const [viewColumns, setViewColumns] = useState(outward_columns);

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };
  const [data, setData] = useState([]);
  const viewForm = (info) => {
    navigation(`${ROUTE_PATH.GATE_PASS_OUTWARD_EDIT}/${info.row.original.id}`, {
      state: { details: info.row.original, isViewOnly: true },
    });
  };

  let paramString = "";

  //Add Form Link Function Start
  const addForm = () => {
    //  navigate(`/add/gate-pass`);
    navigation(`${ROUTE_PATH.GATE_PASS_OUTWARD_ADD}`, {
      state: { from: "gate-pass" },
    });
  };
  //Add Form Link Function End

  //Edit Form Link Function Start
  const editForm = (info) => {
    navigation(`${ROUTE_PATH.GATE_PASS_OUTWARD_EDIT}/${info.row.original.id}`, {
      state: { details: info.row.original, from: "gate-pass" },
    });
  };

  //Edit Form Link Function End

  const [gatePassOutward, { isLoading: gatePassOutwardApiIsLoading }] =
    useGetGatePassOutwardMutation();

  //get api calling start
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

      const response = await gatePassOutward(query).unwrap();
      console.log("Success:", response);
      setData(response?.results || []);

      setPagePerm({
        view: response?.view || false,
        add: response?.add || false,
        edit: response?.edit || false,
      });

      if (response?.edit) {
        setViewColumns([
          ...outward_columns,
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
            cell: (info) => (
              <Flex justifyContent="center" color="primary.700" id="update_row">
                <BiEditAlt
                  fontSize="26px"
                  cursor="pointer"
                  onClick={() => editForm(info)}
                />
              </Flex>
            ),
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
      console.error("Error:", error);
      setPagePerm({
        view: false,
        add: false,
        edit: false,
      });
    }
  };
  //get api calling End

  useEffect(() => {
    tableFilterSet();
    getData();
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
          loading={gatePassOutwardApiIsLoading}
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

export default GatePassOutwardPage;
