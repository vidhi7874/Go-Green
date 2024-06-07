/* eslint-disable react-hooks/exhaustive-deps */
import { createColumnHelper } from "@tanstack/react-table";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import React, { useEffect, useState } from "react";
import { useGetRoleMasterMutation } from "../../features/master-api-slice";
import { filterFields, columns } from "./fields";
import { Flex, Text } from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { setUpFilterFields } from "../../features/filter.slice";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import ROUTE_PATH from "../../constants/ROUTE";
import { BsEye } from "react-icons/bs";

const RoleMaster = () => {
  const dispatch = useDispatch();
  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );
  console.log("RoleMaster", filterQuery);
  const navigate = useNavigate();
  const columnHelper = createColumnHelper();

  const [pagePerm, setPagePerm] = useState({
    view: true,
    edit: false,
    add: false,
  });

  const [filter, setFilter] = useState({
    filter: [],
    search: null,
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    add: false,
    modal: "Role",
    excelDownload: "Role",
  });

  const [data, setData] = useState([]);

  let paramString = "";

  // Add Form Function Start

  const addForm = () => {
    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_ROLE_ADD}`);
  };

  // Add Form Function End

  // Edit Form Function Start

  const editForm = (info) => {
    console.log("info --> ", info);
    let editedFormId = info.row.original.id;

    navigate(
      `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_ROLE_EDIT}/${editedFormId}`,
      {
        state: { details: info.row.original },
      }
    );
  };

  // Edit Form Function End

  // Role List Api Start

  const [getRoleMaster, { isLoading: getRoleMasterApiIsLoading }] =
    useGetRoleMasterMutation();

  const [viewColumns, setViewColumns] = useState(columns);

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };
  const viewForm = (info) => {
    console.log("Info:", info);
    const roleId = info.row.original.id;

    console.log("Navigating to role id:", roleId);

    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_ROLE_EDIT}/${roleId}`, {
      state: {
        details: info.row.original,
        view: true,
      },
    });
  };

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

      const response = await getRoleMaster(query).unwrap();
      console.log("Success:", response);
      // const activeResponse =await
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
              const isSystemRole = info.row.original.is_system_role;
              console.log("isSystemRole", info.row.original);

              return (
                <Flex
                  justifyContent="center"
                  color="primary.700"
                  id="update_row"
                >
                  {!isSystemRole ? (
                    <BiEditAlt
                      fontSize="26px"
                      cursor="pointer"
                      onClick={() => editForm(info)}
                    />
                  ) : (
                    <></>
                  )}
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
      console.error("Error:", error);
      setPagePerm({
        view: true,
        add: false,
        edit: false,
      });
    }
  };

  useEffect(() => {
    tableFilterSet();
    getData();
  }, [filter.limit, filter.page, filterQuery]);

  // Role List Api End

  return (
    <div>
      {pagePerm?.view ? (
        <FunctionalTable
          filter={filter}
          filterFields={filterFields}
          setFilter={setFilter}
          columns={viewColumns}
          data={data}
          loading={getRoleMasterApiIsLoading}
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
};

export default RoleMaster;
