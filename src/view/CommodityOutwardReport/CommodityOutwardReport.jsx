import { createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUpFilterFields } from "../../features/filter.slice";
import { BiEditAlt } from "react-icons/bi";
import { Button, Flex, Text } from "@chakra-ui/react";
import { BsEye } from "react-icons/bs";
import { columns, filterFields } from "./field";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import ROUTE_PATH from "../../constants/ROUTE";
import {
  useGetCORMutation,
  usePostMultipleCORToMeMutation,
  usePostMultipleToMeMutation,
} from "../../features/cor.slice";
import MultiFunctionalTable from "../../components/Tables/MultiFunctionalTable";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

export default function CommodityOutwardReport() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const columnHelper = createColumnHelper();

  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );
  console.log("Warehouse Owner Type Master", filterQuery);
  const [pagePerm, setPagePerm] = useState({
    view: true,
    edit: false,
    add: false,
  });

  const [filter, setFilter] = useState({
    // filter: [],
    // search: null,
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    add: false,
    total: 0,
    modal: "COR",
    excelDownload: "COR",
  });

  const [viewColumns, setViewColumns] = useState(columns);

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };
  const [data, setData] = useState([]);

  let paramString = "";

  // Edit Form Link Function Start
  const editForm = (info) => {
    const editedFormId = info.row.original?.cor__id?.id;

    // console.log("editedFormId originals : ", info.row.original);
    // console.log("editedFormId: ", editedFormId);
    navigate(`${ROUTE_PATH.COMMODITY_OUTWARD_REPORT_EDIT}/${editedFormId}`, {
      state: { details: info.row.original, stage: 1 },
    });
  };

  // function to view the form ..
  const viewForm = (info) => {
    const editedFormId = info.row.original.id;
    navigate(`${ROUTE_PATH.COMMODITY_OUTWARD_REPORT_EDIT}/${editedFormId}`, {
      state: { details: info.row.original, stage: 1 },
    });
  };

  // Selection Logic Start

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

  const [assignToMe] = usePostMultipleCORToMeMutation();

  const AssignToMeFunction = async () => {
    try {
      const response = await assignToMe({ id_list: selectedItems }).unwrap();

      console.log("test response -->", response);
      // console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        // console.log("response --> ", response);
        // tableFilterSet();
        getData();
        toasterAlert({
          message: response?.message,
          status: 200,
        });
        setTimeout(() => {
          window.location.reload();
          // navigate("/hiring-proposal-master");
        }, 1500);

        // navigate("/hiring-proposal-master");
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

  // Selection Logic End

  // Add Form Link Function Start
  const addForm = () => {
    navigate(`${ROUTE_PATH.COMMODITY_OUTWARD_REPORT_ADD}`);
  };

  // Add Form Link Function End

  // WareHouseClient Master Get Api Start
  const [getGatepassCIR, { isLoading: getgetGatepassCIRApiIsLoading }] =
    useGetCORMutation();

  const getData = async () => {
    //params filter
    //filter.filter.length || filter.search
    // if (filterQuery) {
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
    // }

    try {
      let query = filterQuery ? `${paramString}&${filterQuery}` : paramString;
      const response = await getGatepassCIR(query).unwrap();
      console.log("response", response);

      if (response.status === 200) {
        console.log("Success:", response?.view);

        let arr = response?.results.map((item, i) => {
          return {
            ...item,
          };
        });
        setData(arr || []);

        setPagePerm({
          view: response?.view || false,
          add: false,
          edit: response?.edit || false,
        });

        console.log("response pageperm ->", response);
        console.log("response pageperm ->", response?.edit);

        if (false && response?.edit) {
          setViewColumns([
            ...columns,
            columnHelper.accessor("update", {
              header: () => (
                <Text as="span" id="update_col" fontWeight="800">
                  Create CIR
                </Text>
              ),
              cell: (info) => (
                <Flex
                  justifyContent="center"
                  color="primary.700"
                  id="update_row"
                >
                  <Button
                    onClick={() => editForm(info)}
                    cursor={"pointer"}
                    type="submit"
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    borderRadius={"full"}
                    px={"6"}
                  >
                    Create CIR
                  </Button>
                </Flex>
              ),
              id: "update_col",
              accessorFn: (row) => row.update_col,
            }),
          ]);
        }
        // else {
        //   setViewColumns([

        //     ...columns,
        //     columnHelper.accessor("view", {
        //       header: () => (
        //         <Text id="view_col" fontWeight="800">
        //           View
        //         </Text>
        //       ),
        //       cell: (info) => (
        //         <Flex justifyContent="center" color="primary.700" id="view_row">
        //           <BsEye
        //             fontSize="26px"
        //             cursor="pointer"
        //             onClick={() => navigate(`edit/commodity-inward-report/44`)}
        //           />
        //         </Flex>
        //       ),
        //       id: "view_col",
        //       accessorFn: (row) => row.view,
        //     }),
        //   ]);
        // }

        setViewColumns([
          ...columns,
          columnHelper.accessor("cor__id", {
            header: () => (
              <Text as="span" id="update_col" fontWeight="800">
                Create COR
              </Text>
            ),
            cell: (info) => {
              return (
                <Flex
                  justifyContent="center"
                  color="primary.700"
                  id="update_row"
                >
                  <Button
                    onClick={() => editForm(info)}
                    cursor={"pointer"}
                    type="submit"
                    // isDisabled={
                    //   response?.edit && info.row.original.cor__id?.cor_no !== ""
                    // }

                    isDisabled={
                      info.row.original.cor__id !== null ||
                      response?.edit === false
                    }
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    borderRadius={"full"}
                    px={"6"}
                  >
                    Create COR
                  </Button>
                </Flex>
              );
            },
            id: "update_col",
            accessorFn: (row) => row.update_col,
          }),
          columnHelper.accessor("view", {
            header: () => (
              <Text as="span" id="view_col" fontWeight="800">
                View
              </Text>
            ),
            cell: (info) => {
              // let isDisabled =
              //   response?.view && info.row.original.cir__cir_no !== null
              //     ? true
              //     : false;

              let isDisabled =
                response?.view && info.row.original.cor__id !== null
                  ? true
                  : false;
              return (
                <Flex
                  justifyContent="center"
                  color={isDisabled ? "primary.700" : "gray.300"}
                  id="view_row"
                >
                  <BsEye
                    fontSize="26px"
                    cursor={isDisabled ? "pointer" : "not-allowed"}
                    // cursor="pointer"
                    //  cursor="not-allowed"
                    onClick={() => isDisabled && viewForm(info)}
                  />
                </Flex>
              );
            },
            id: "view_col",
            accessorFn: (row) => row.view_col,
          }),

          columnHelper.accessor("update", {
            header: () => (
              <Text as="span" id="update_col" fontWeight="800">
                Edit
              </Text>
            ),
            cell: (info) => {
              let isDisabled =
                response?.view && info.row.original.cor__id !== null
                  ? true
                  : false;
              return (
                <Flex
                  justifyContent="center"
                  color={isDisabled ? "primary.700" : "gray.300"}
                  id="update_row"
                >
                  <BiEditAlt
                    fontSize="26px"
                    cursor={isDisabled ? "pointer" : "not-allowed"}
                    onClick={() => isDisabled && editForm(info)}
                  />
                </Flex>
              );
            },
            id: "update_col",
            accessorFn: (row) => row.update_col,
          }),
        ]);

        setFilter((old) => ({
          ...old,
          totalPage: Math.ceil(response?.total / old.limit),
          total: response?.total_data,
          totalFilter: response?.total,
          add: false,
          excelDownload: filterQuery
            ? `${old.modal}&${filterQuery}`
            : old.modal,
        }));
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.limit, filter.page, filterQuery]);
  // WareHouseClient Master Get Api End

  return (
    <>
      <div>
        {pagePerm?.view ? (
          // <FunctionalTable
          //   filter={filter}
          //   filterFields={filterFields}
          //   setFilter={setFilter}
          //   columns={viewColumns}
          //   data={data}
          //   loading={getgetGatepassCIRApiIsLoading}
          //   addForm={() => addForm()}
          // />
          <MultiFunctionalTable
            filter={filter}
            filterFields={filterFields}
            setFilter={setFilter}
            columns={viewColumns}
            data={data || []}
            loading={getgetGatepassCIRApiIsLoading}
            addForm={() => addForm()}
            selectedItems={selectedItems}
            SelectionFunction={(id) => SelectionFunction(id)}
            AssignToMeFunction={() => AssignToMeFunction()}
          />
        ) : (
          <>
            <NotaccessImage />
          </>
        )}
      </div>
    </>
  );
}
