/* eslint-disable react-hooks/exhaustive-deps */
import { createColumnHelper } from "@tanstack/react-table";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import React, { useEffect, useState } from "react";
import { useGetUserMasterMutation } from "../../features/master-api-slice";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setUpFilterFields } from "../../features/filter.slice";
import { filterFields, columns } from "./fields";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../features/auth/loginApiSlice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import { ROUTE_PATH } from "../../constants/ROUTE";
import { BsEye } from "react-icons/bs";

const UserMaster = () => {
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

  const viewForm = (info) => {
    console.log("Info:", info);
    const userId = info.row.original.id;

    console.log("Navigating to role id:", userId);

    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_USER_EDIT}/${userId}`, {
      state: {
        details: info.row.original,
        view: true,
      },
    });
  };

  const [data, setData] = useState([]);

  // Resend Password Link Api Start

  const [forgotPassword] = useForgotPasswordMutation();

  const onResendLink = async ({ data }) => {
    console.log(data, "here");
    const res = await forgotPassword({
      email: data?.row?.original?.email || "",
    }).unwrap();
    if (res.status === 200) {
      toasterAlert(res);
    }
  };

  // Resend Password Link Api End

  // User List Api Start

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  const [getUserMaster, { isLoading: getUserMasterApiIsLoading }] =
    useGetUserMasterMutation();

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
      const response = await getUserMaster(query).unwrap();
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
          columnHelper.accessor("is_active", {
            header: () => (
              <Text as="span" id="active_col" fontSize="12px"
              fontWeight="bold" color="black" style={{
                textTransform : 'uppercase !important'
              }} >
                Reset Password
              </Text>
            ),
            cell: (info) => (
              <Box id="active_row">
                {/* <Switch
                  size="md"
                  colorScheme="whatsapp"
                  isChecked={info.row.original.is_active}
                /> */}
                <Button onClick={() => onResendLink({ data: info })}>
                  Resent Link
                </Button>
              </Box>
            ),
            id: "active",
            accessorFn: (row) => row.active,
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

  // User List Api End

  // Add Form Function Start

  const addForm = () => {
    navigate(
      `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_USER_ADD}`,
    );
  };

  // Add Form Function End

  // Edit Form Function Start

  const editForm = (info) => {
    console.log("User info --->", info);
    const editedFormId = info.row.original.id;
    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_USER_EDIT}/${info.row.original.id}`, {
      state: { details: info.row.original },
    });
  };

  // Edit Form Function End

  // Page Toast Logic Start

  const toasterAlert = (obj) => {
    let msg = obj?.message;
    let status = obj?.status;
    if (status === 400) {
      const errorData = obj.data;
      let errorMessage = "";

      Object.keys(errorData).forEach((key) => {
        const messages = errorData[key];
        messages.forEach((message) => {
          errorMessage += `${key} : ${message} \n`;
        });
      });
      showToastByStatusCode(status, errorMessage);
      return false;
    }
    showToastByStatusCode(status, msg);
  };

  // Page Toast Logic End

  return (
    <div>
      {pagePerm?.view ? (
        <FunctionalTable
          filter={filter}
          filterFields={filterFields}
          setFilter={setFilter}
          columns={viewColumns}
          data={data}
          loading={getUserMasterApiIsLoading}
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

export default UserMaster;
