/* eslint-disable react-hooks/exhaustive-deps */
import { createColumnHelper } from "@tanstack/react-table";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import React, { useEffect, useState } from "react";
import { useGetWareHouseSubTypeMutation } from "../../features/master-api-slice";
import { Flex, Text } from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setUpFilterFields } from "../../features/filter.slice";
import { columns, filterFields } from "./fields";
import { useNavigate } from "react-router-dom";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import ROUTE_PATH from "../../constants/ROUTE";
import { BsEye } from "react-icons/bs";

const WareHouseSubType = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const columnHelper = createColumnHelper();
  const [pagePerm, setPagePerm] = useState({
    view: true,
    edit: false,
    add: false,
  });

  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );
  const [viewColumns, setViewColumns] = useState(columns);

  const viewForm = (info) => {
    console.log("Info:", info);
    const subTypeId = info.row.original.id;

    console.log("Navigating to role id:", subTypeId);

    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE_EDIT}/${subTypeId}`, {
      state: {
        details: info.row.original,
        view: true,
      },
    });
  };

  const [data, setData] = useState([]);

  let paramString = "";

  const [filter, setFilter] = useState({
    // filter: [],
    // search: null,
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    add: false,
    modal: "WareHouseSubType",
    excelDownload: "WareHouseSubType",
  });

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  // Add Form Navigation Logic Start
  const addForm = () => {
    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE_ADD}`);
  };
  // Add Form Navigation Logic End

  // Edit Form Navigation Logic End
  const editForm = (info) => {
    const editedFormId = info.row.original.id;
    navigate(
      `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE_EDIT}/${editedFormId}`,
      {
        state: { details: info.row.original },
      }
    );
  };

  // Get Warehouse Sub Type Api Calling Start
  const [getWareHouseSubType, { isLoading: getWareHouseSubTypeApiIsLoading }] =
    useGetWareHouseSubTypeMutation();

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
      const response = await getWareHouseSubType(query).unwrap();

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
  // Get Warehouse Sub Type Api Calling End

  return (
    <>
      <div>
        {pagePerm?.view ? (
          <FunctionalTable
            filter={filter}
            filterFields={filterFields}
            setFilter={setFilter}
            columns={viewColumns}
            data={data}
            loading={getWareHouseSubTypeApiIsLoading}
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
    </>
  );
};

export default WareHouseSubType;
