/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import { columns, filterFields } from "./fields";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import { useDispatch, useSelector } from "react-redux";
import { setUpFilterFields } from "../../features/filter.slice";
import { useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { BiEditAlt } from "react-icons/bi";
import { Flex, Text } from "@chakra-ui/react";
import {
  useAssignToMeMutation,
  useGetDOMutation,
} from "../../features/do.slice";
import { BsEye } from "react-icons/bs";
import ROUTE_PATH from "../../constants/ROUTE";
import MultiFunctionalTable from "../../components/Tables/MultiFunctionalTable";
import { toasterAlert } from "../../services/common.service";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

function DeliveryOrder() {
  const navigate = useNavigate();
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );

  const [data, setData] = useState([]);
  const columnHelper = createColumnHelper();
  const [pagePerm, setPagePerm] = useState({
    view: true,
    edit: false,
    add: false,
  });
  // ?? setting up the name for the downloading the delivery order list
  const [filter, setFilter] = useState({
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    add: false,
    modal: "DeliveryOrder",
    excelDownload: "DeliveryOrder",
  });

  const [viewColumns, setViewColumns] = useState(columns);

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  //Add Form Link Function Start
  const addForm = () => {
    navigate(`${ROUTE_PATH.DELIVERY_ORDER_ADD}`);
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const SelectionFunction = (id) => {
    console.log(id, "hello");
    if (id) {
      if (selectedItems?.filter((item) => item === id).length > 0) {
        const temp = selectedItems.map((item) => (item !== id ? item : ""));
        setSelectedItems([...temp.filter((item) => item !== "")]);
      } else {
        setSelectedItems([...selectedItems, id]);
      }
    }
  };

  const [assignToMe] = useAssignToMeMutation();

  const AssignToMeFunction = async () => {
    try {
      const response = await assignToMe({ id_list: selectedItems }).unwrap();

      console.log("test response -->", response);
      // console.log("saveAsDraftData - Success:", response);
      if (
        response.status === 200 &&
        !response?.message?.includes("not assigned forms")
      ) {
        // console.log("response --> ", response);
        // tableFilterSet();
        showToastByStatusCode(200, response?.message);
        getData();

        // setTimeout(() => {
        //   window.location.reload();
        //   navigate("/hiring-proposal-master");
        // }, 1500);

        // navigate("/hiring-proposal-master");
      } else {
        showToastByStatusCode(400, response?.message);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Assign Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: errorMessage,
        status: 400,
      });
    }
  };

  //Add Form Link Function End
  //Edit Form Link Function Start
  const viewForm = (info) => {
    navigation(`${ROUTE_PATH.DELIVERY_ORDER_EDIT}/${info.row.original.id}`, {
      state: { details: info.row.original, isViewOnly: true },
    });
  };
  //Edit Form Link Function Start
  const editForm = (info) => {
    navigation(`${ROUTE_PATH.DELIVERY_ORDER_EDIT}/${info.row.original.id}`, {
      state: { details: info.row.original },
    });
  };

  //Delivery order get api start call

  const [getDoMaster, { isLoading: getRDOMasterApiIsLoading }] =
    useGetDOMutation();

  let paramString = "";
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
      const response = await getDoMaster(query).unwrap();
      // console.log("Success:", response);
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
              <Text id="view_col" fontWeight="800">
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

  //Delivery order get api end call

  useEffect(() => {
    tableFilterSet();

    getData();
    // eslint-disable-next-line
  }, [filter.limit, filter.page, filterQuery]);

  return (
    <div>
      {pagePerm?.view ? (
        // <FunctionalTable
        //   filter={filter}
        //   filterFields={filterFields}
        //   setFilter={setFilter}
        //   columns={viewColumns}
        //   data={data}
        //   loading={getRDOMasterApiIsLoading}
        //   addForm={() => addForm()}
        // />

        <MultiFunctionalTable
          filter={filter}
          filterFields={filterFields}
          setFilter={setFilter}
          columns={viewColumns}
          data={data || []}
          loading={getRDOMasterApiIsLoading}
          addForm={() => addForm()}
          selectedItems={selectedItems}
          SelectionFunction={(id) => SelectionFunction(id)}
          AssignToMeFunction={() => AssignToMeFunction()}
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

export default DeliveryOrder;
