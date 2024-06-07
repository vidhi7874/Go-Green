/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import { columns, filterFields } from "./fields";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { setUpFilterFields } from "../../features/filter.slice";
import { useGetWarehouseUserTransferMasterMutation } from "../../features/master-api-slice";
import { BiEditAlt } from "react-icons/bi";
import { Flex, Text } from "@chakra-ui/react";
import ROUTE_PATH from "../../constants/ROUTE";

function SupervisorHiringMaster() {
  const dispatch = useDispatch();
  const columnHelper = createColumnHelper();
  const navigate = useNavigate();
  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );
  let paramString = "";

  const [pagePerm, setPagePerm] = useState({
    view: true,
    edit: false,
    add: false,
  });
  const [filter, setFilter] = useState({
    page: 1,
    totalPage: 1,
    limit: 25,
    add: false,
    totalFilter: 0,
    total: 0,
    modal: "User",
    excelDownload: "User",
  });

  const [viewColumns, setViewColumns] = useState(columns);
  const [data, setData] = useState([]);

  // User List Api Start

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  const [getWarehouse, { isLoading: getWarehouseMasterApiIsLoading }] =
    useGetWarehouseUserTransferMasterMutation();

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
      const query = filterQuery ? `${paramString}&${filterQuery}` : paramString;
      const response = await getWarehouse(query).unwrap();
      console.log("Success:", response);
      setData(response?.results || []);
      setPagePerm({
        view: response?.view || false,
        add: false,
        edit: response?.edit || false,
      });

      if (response?.edit) {
        setViewColumns([
          ...columns,
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
        add: false,
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
  // Add Form Function Start

  const addForm = () => {
    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_SUPERVISOR_HIRING_ADD}`);
  };

  // Add Form Function End

  // Edit Form Function Start

  const editForm = (info) => {
    console.log("User info --->", info);
    const editedFormId = info.row.original.id;
    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_SUPERVISOR_HIRING_EDIT}/${editedFormId}`, {
      state: { details: info.row.original },
    });
  };

  // Edit Form Function End

  return (
    <div>
      {pagePerm?.view ? (
        <FunctionalTable
          filter={filter}
          filterFields={filterFields}
          setFilter={setFilter}
          columns={viewColumns}
          data={data}
          loading={getWarehouseMasterApiIsLoading}
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

export default SupervisorHiringMaster;
