import React, { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { columns, filterFields } from "./fields";
import { setUpFilterFields } from "../../../features/filter.slice";
import FunctionalTable from "../../../components/Tables/FunctionalTable";
import NotaccessImage from "../../../components/NotAccessImage/NotaccessImage";
import {
  useGetServiceContractMutation,
  usePostMultipleAssignServiceContractMutation,
} from "../../../features/service-contract-api.slice";
import { BiEditAlt } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import MultiFunctionalTable from "../../../components/Tables/MultiFunctionalTable";
import { showToastByStatusCode } from "../../../services/showToastByStatusCode";
import ROUTE_PATH from "../../../constants/ROUTE";

const ServiceContractPwh = () => {
  const navigate = useNavigate();
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
    filter: "contract_type",
    contract_type: "pwh",
    modal: "ServiceContract",
    excelDownload: "ServiceContract",
  });
  const [viewColumns, setViewColumns] = useState(columns);
  const [isRefresh, setIsRefresh] = useState(false);

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  const [data, setData] = useState([]);

  let paramString = "";

  const renewServiceContract = (info) => {
    console.log("Renewing service contract", info?.row?.original);
    navigation(
      `${ROUTE_PATH.SERVICE_CONTRACT_PWH_EDIT}/${info.row.original.id}`,
      {
        state: { details: info.row.original, isRenewingServiceContract: true },
      }
    );
  };

  //Add Form Link Function Start.
  const addForm = () => {
    navigate(`${ROUTE_PATH.SERVICE_CONTRACT_PWH_ADD}`);
  };
  //Add Form Link Function End

  //Edit Form Link Function Start
  const viewForm = (info) => {
    navigation(
      `${ROUTE_PATH.SERVICE_CONTRACT_PWH_EDIT}/${info.row.original.id}`,
      {
        state: { details: info.row.original, isViewOnly: true },
      }
    );
  };

  const editForm = (info) => {
    navigation(
      `${ROUTE_PATH.SERVICE_CONTRACT_PWH_EDIT}/${info.row.original.id}`,
      {
        state: { details: info.row.original },
      }
    );
  };

  //Edit Form Link Function End

  const [selectedItems, setSelectedItems] = useState([]);

  const SelectionFunction = (id) => {
    console.log(id);
    if (selectedItems?.filter((item) => item === id).length > 0) {
      const temp = selectedItems.map((item) => (item !== id ? item : ""));
      setSelectedItems([...temp.filter((item) => item !== "")]);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const [assignToMe] = usePostMultipleAssignServiceContractMutation();

  const AssignToMeFunction = async () => {
    try {
      const response = await assignToMe({ id_list: selectedItems }).unwrap();
      // console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        // console.log("response --> ", response);
        // SelectionFunction(null)
        //  setSelectedItems([])
        //  SelectionFunction()
        // setIsRefresh(true)
        getData();
        toasterAlert({
          message: response?.message,
          status: 200,
        });
        //   setIsRefresh(false)
        // setIsRefresh(true)
        //window.location.reload();
        // navigate("/service-contract-pwh");
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
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const toasterAlert = (obj) => {
    let msg = obj?.message;
    let status = obj?.status;
    console.log("toasterAlert", obj);
    if (status === 400) {
      const errorData = obj?.data || obj?.data?.data;
      let errorMessage = "";

      Object.keys(errorData)?.forEach((key) => {
        const messages = errorData[key];
        // console.log("messages --> ", messages);
        if (typeof messages === "object") {
          messages &&
            messages?.forEach((message) => {
              errorMessage += `${key} : ${message} \n`;
            });
        } else {
          showToastByStatusCode(status, msg);
        }
      });
      showToastByStatusCode(status, errorMessage);
      return false;
    } else if (status === 410) {
      showToastByStatusCode(status, msg);
    }
    showToastByStatusCode(status, msg);
  };

  // ServiceContract Master Get Api Start

  const [getServiceContract, { isLoading: getServiceContractApiIsLoading }] =
    useGetServiceContractMutation();

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

      const response = await getServiceContract(query).unwrap();
      console.log("Success:", response);
      setData(response?.results || []);

      // setPagePerm({
      //   view: response?.view || false,
      //   add: response?.add || false,
      //   edit: response?.edit || false,
      // });

      if (response?.edit) {
        setViewColumns([
          ...columns,
          columnHelper.accessor("service_con_col", {
            header: () => (
              <Text as="span" id="service_con_col" fontWeight="800">
                Service contract renewal
              </Text>
            ),
            cell: (info) => (
              <Button
                rounded={"full"}
                _hover={{ bgColor: "primary.700" }}
                color="white"
                bg="primary.700"
                onClick={() => renewServiceContract(info)}
              >
                Renew Service Contract
              </Button>
            ),
            id: "service_con_col",
            accessorFn: (row) => row.service_con_col,
          }),
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
      setPagePerm({
        view: response?.view || false,
        add: response?.add || false,
        edit: response?.edit || false,
      });
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
    console.log("isRfresh", isRefresh);
    tableFilterSet();
    getData();
    // eslint-disable-next-line
  }, [filter.limit, filter.page, filterQuery, isRefresh]);

  //ServiceContract master get Api End

  return (
    <div>
      {pagePerm?.view ? (
        // <FunctionalTable
        //   filter={filter}
        //   filterFields={filterFields}
        //   setFilter={setFilter}
        //   columns={viewColumns}
        //   data={data}
        //   //     loading={getRegionMasterApiIsLoading}
        //   addForm={() => addForm()}
        // />
        <MultiFunctionalTable
          filter={filter}
          filterFields={filterFields}
          setFilter={setFilter}
          columns={viewColumns}
          data={data || []}
          loading={getServiceContractApiIsLoading}
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
};

export default ServiceContractPwh;