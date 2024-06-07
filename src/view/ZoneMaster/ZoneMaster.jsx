/* eslint-disable react-hooks/exhaustive-deps */
import { createColumnHelper } from "@tanstack/react-table";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import React, { useEffect, useState } from "react";
import { useGetZoneMasterMutation } from "../../features/master-api-slice";
import { Box, Flex, Text } from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { setUpFilterFields } from "../../features/filter.slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { filterFields, columns } from "./fields";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import { ROUTE_PATH } from "../../constants/ROUTE";
import { BsEye } from "react-icons/bs";

const ZoneMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    modal: "SubState",
    excelDownload: "SubState",
  });

  const [viewColumns, setViewColumns] = useState(columns);
  

  const viewForm = (info) => {
    console.log("Info:", info);
    const substateId = info.row.original.id;

    console.log("Navigating to role id:", substateId);

    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_SUB_STATE_EDIT}/${substateId}`, {
      state: {
        details: info.row.original,
        view: true,
      },
    });
  };

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  const [data, setData] = useState([]);

  let paramString = "";

  // Add Form Link Function Start
  const addForm = () => {
    navigate(
      `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_SUB_STATE_ADD}`
    );
  };
  // Add Form Link Function End

  // Edit Form Link Function Start
  const editForm = (info) => {
    let editedFormId = info.row.original.id;

    navigate(      `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_SUB_STATE_EDIT}/${info.row.original.id}`, {
      state: { details: info.row.original },
    });
  };
  // Edit Form Link Function End

  // Zone Master Get Api Start
  const [getZoneMaster, { isLoading: getZoneMasterApiIsLoading }] =
    useGetZoneMasterMutation();

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

    console.log("paramString ---> ", paramString);

    try {
      let query = filterQuery ? `${paramString}&${filterQuery}` : paramString;

      const response = await getZoneMaster(query).unwrap();
      console.log("Success:", response);

      console.log(Math.ceil(response?.total / filter.page_length), "length");
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

  useEffect(() => {
    tableFilterSet();
    getData();
  }, [filter.limit, filter.page, filterQuery]);
  // Zone Master Get Api End

  return (
    <Box position="relative">
      {pagePerm?.view ? (
        <FunctionalTable
          filter={filter}
          filterFields={filterFields}
          setFilter={setFilter}
          columns={viewColumns}
          data={data}
          loading={getZoneMasterApiIsLoading}
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
    </Box>
  );
};

export default ZoneMaster;
