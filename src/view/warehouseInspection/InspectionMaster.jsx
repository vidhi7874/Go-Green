// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Flex, Text } from "@chakra-ui/react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   useAddInspectionMasterMutation,
//   useGetInspectionMasterMutation,
//   useMultipleAssignInspectionMasterMutation,
//   useUpdateInspectionMasterMutation,
// } from "../../features/master-api-slice";
// import { BiEditAlt } from "react-icons/bi";
// import FunctionalTable from "../../components/Tables/FunctionalTable";
// import { createColumnHelper } from "@tanstack/react-table";
// import { setUpFilterFields } from "../../features/filter.slice";
// import { filterFields } from "./fields";
// import { useNavigate } from "react-router-dom";
// import { BsEye } from "react-icons/bs";
// import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
// import MultiFunctionalTable from "../../components/Tables/MultiFunctionalTable";
// import { showToastByStatusCode } from "../../services/showToastByStatusCode";
// import { usePostAssignToMeMutation } from "../../features/warehouse-proposal.slice";
// import ROUTE_PATH from "../../constants/ROUTE";

// const GLOBAL_OBJ_FOR_FILTER_STATE = {
//   // filter: [],
//   // search: null,
//   page: 1,
//   totalPage: 1,
//   limit: 25,
//   totalFilter: 0,
//   total: 0,
//   add: false,
//   modal: "WarehouseHiringProposal",
//   excelDownload: "WarehouseHiringProposal",
// };

// function InspectionMaster() {
//   console.count("Inspection master >>>");
//   // hooks
//   const dispatch = useDispatch();
//   const columnHelper = createColumnHelper();
//   const navigate = useNavigate();
//   // state variables ...
//   const [filter, setFilter] = useState(GLOBAL_OBJ_FOR_FILTER_STATE);
//   const [data, setData] = useState([]);

//   const [pagePerm, setPagePerm] = useState({
//     view: true,
//     edit: false,
//     add: false,
//   });

//   // ? making it memoize ....
//   const memoizedColumns = useMemo(() => {
//     return [
//       columnHelper.accessor("id", {
//         cell: (info) => info.getValue(),
//         header: "SR. NO",
//       }),
//       // columnHelper.accessor("inspection_number", {
//       //   cell: (info) =>
//       //     info.getValue() ? info.getValue()?.inspection_number || " - " : " - ",
//       //   header: " Warehouse Proposal no.",
//       // }),
//       columnHelper.accessor("hiring_proposal.proposal_number", {
//         cell: (info) => info.getValue() || "-",
//         header: "Warehouse Proposal no.",
//       }),
//       columnHelper.accessor("warehouse_type", {
//         cell: (info) =>
//           info.getValue()
//             ? info.getValue()?.warehouse_type_name || " - "
//             : " - ",
//         header: "Warehouse Type",
//       }),
//       columnHelper.accessor("warehouse_sub_type", {
//         cell: (info) =>
//           info.getValue() ? info.getValue()?.warehouse_subtype || " - " : " - ",
//         header: "Warehouse Sub Type",
//       }),
//       columnHelper.accessor("warehouse_name", {
//         cell: (info) => (info.getValue() ? info.getValue() : " - "),
//         header: "Warehouse Name",
//       }),
//       columnHelper.accessor("region", {
//         cell: (info) =>
//           info.getValue() ? info.getValue()?.region_name || " - " : " - ",
//         header: "Region",
//       }),
//       columnHelper.accessor("state", {
//         cell: (info) =>
//           info.getValue() ? info.getValue()?.state_name || " - " : " - ",
//         header: "State",
//       }),
//       columnHelper.accessor("substate", {
//         cell: (info) =>
//           info.getValue() ? info.getValue()?.substate_name || " - " : " - ",
//         header: "Sub State",
//       }),
//       columnHelper.accessor("district", {
//         cell: (info) =>
//           info.getValue() ? info.getValue()?.district_name || " - " : " - ",
//         header: "District",
//       }),
//       columnHelper.accessor("area", {
//         cell: (info) =>
//           info.getValue() ? info.getValue()?.area_name || " - " : " - ",
//         header: "Area",
//       }),
//       columnHelper.accessor("warehouse_address", {
//         cell: (info) =>
//           info.getValue()
//             ? info.getValue().length > 50
//               ? info.getValue().slice(0, 50) + "..."
//               : info.getValue()
//             : " - ",
//         header: " Address ",
//       }),
//       columnHelper.accessor("warehouse_pincode", {
//         cell: (info) => (info.getValue() ? info.getValue() : " - "),
//         header: " Pincode",
//       }),
//       // columnHelper.accessor("warehouse_pincode", {
//       //   cell: (info) => (info.getValue() ? info.getValue() : " - "),
//       //   header: "Application status ",
//       // }),
//       columnHelper.accessor("l1_user", {
//         cell: (info) =>
//           info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
//         header: "L1 User",
//       }),
//       columnHelper.accessor("l2_user", {
//         cell: (info) =>
//           info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
//         header: "L2 User  ",
//       }),
//       columnHelper.accessor("l3_user", {
//         cell: (info) =>
//           info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
//         header: "L3 User  ",
//       }),
//       columnHelper.accessor("l4_user", {
//         cell: (info) =>
//           info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
//         header: "L4 User  ",
//       }),
//       columnHelper.accessor("status", {
//         cell: (info) => info.getValue()?.description || " - ",
//         header: "Application Status",
//       }),
//       columnHelper.accessor("creation_date", {
//         cell: (info) => (info.getValue() ? info.getValue() : " - "),
//         header: "Creation Date",
//       }),
//       columnHelper.accessor("last_updated_date", {
//         cell: (info) => (info.getValue() ? info.getValue() : " - "),
//         header: "Last Update Date",
//       }),

//       // columnHelper.accessor("is_active", {
//       //   header: () => (
//       //     <Text id="active_col" fontWeight="800">
//       //       Active
//       //     </Text>
//       //   ),
//       //   cell: (info) => (
//       //     <Box id="active_row">
//       //       <Switch
//       //         size="md"
//       //         colorScheme="whatsapp"
//       //         isChecked={info.row.original.is_active}
//       //       />
//       //     </Box>
//       //   ),
//       //   id: "active",
//       //   accessorFn: (row) => row.active,
//       // }),
//       columnHelper.accessor("view", {
//         header: () => (
//           <Text id="view_col" fontWeight="800">
//             View
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex justifyContent="center" color="primary.700" id="view_row">
//             <BsEye
//               fontSize="26px"
//               cursor="pointer"
//               onClick={() => viewFormMemoized(info)}
//             />
//           </Flex>
//         ),
//         id: "view_col",
//         accessorFn: (row) => row.view_col,
//       }),
//     ];
//   }, []);

//   // Selection Logic Start

//   const [selectedItems, setSelectedItems] = useState([]);

//   const SelectionFunction = (id) => {
//     console.log(id);
//     if (selectedItems?.filter((item) => item === id).length > 0) {
//       const temp = selectedItems.map((item) => (item !== id ? item : ""));
//       setSelectedItems([...temp.filter((item) => item !== "")]);
//     } else {
//       setSelectedItems([...selectedItems, id]);
//     }
//   };

//   const [assignToMe] = useMultipleAssignInspectionMasterMutation();

//   const AssignToMeFunction = async () => {
//     try {
//       const response = await assignToMe({ id_list: selectedItems }).unwrap();
//       // console.log("saveAsDraftData - Success:", response);
//       if (response.status === 200) {
//         // console.log("response --> ", response);
//         toasterAlert({
//           message: "Assigned Successfully.",
//           status: 200,
//         });
//         window.location.reload();
//         // navigate("/hiring-proposal-master");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       let errorMessage =
//         error?.data?.data ||
//         error?.data?.message ||
//         error?.data ||
//         "Assign Request Failed.";
//       console.log("Error:", errorMessage);
//       toasterAlert({
//         message: JSON.stringify(errorMessage),
//         status: 440,
//       });
//     }
//   };

//   const toasterAlert = (obj) => {
//     let msg = obj?.message;
//     let status = obj?.status;
//     console.log("toasterAlert", obj);
//     if (status === 400) {
//       const errorData = obj?.data || obj?.data?.data;
//       let errorMessage = "";

//       Object.keys(errorData)?.forEach((key) => {
//         const messages = errorData[key];
//         // console.log("messages --> ", messages);
//         if (typeof messages === "object") {
//           messages &&
//             messages?.forEach((message) => {
//               errorMessage += `${key} : ${message} \n`;
//             });
//         } else {
//           showToastByStatusCode(status, msg);
//         }
//       });
//       showToastByStatusCode(status, errorMessage);
//       return false;
//     } else if (status === 410) {
//       showToastByStatusCode(status, msg);
//     }
//     showToastByStatusCode(status, msg);
//   };

//   const [viewColumns, setViewColumns] = useState(memoizedColumns);
//   let paramString = "";

//   // fetching the redux data ..
//   const filterQuery = useSelector(
//     (state) => state.dataTableFiltersReducer.filterQuery
//   );

//   // function definitions ...
//   // ? making the function memoized ..
//   const addFormMemoized = useCallback(() => {
//     navigate(`${ROUTE_PATH.WAREHOUSE_INSPECTION}`);
//   }, []);

//   // ? making the function memoized ..
//   const viewFormMemoized = useCallback((info) => {
//     // console.log("info --> ", info);
//     navigate(`${ROUTE_PATH.WAREHOUSE_INSPECTION}`, {
//       state: {
//         details: {
//           id: info.row.original.id,
//           view: true,
//         },
//       },
//     });
//   }, []);

//   // ? making the function memoized ...
//   const editFormMemoized = useCallback((info) => {
//     // console.log("info --> ", info);
//     navigate(`${ROUTE_PATH.WAREHOUSE_INSPECTION}`, {
//       state: {
//         details: {
//           id: info.row.original.id,
//         },
//       },
//     });
//   }, []);

//   const [
//     getHiringProposalMaster,
//     { isLoading: getHiringProposalMasterApiIsLoading },
//   ] = useGetInspectionMasterMutation();

//   // ? memoized the function ..
//   const tableFilterSet = useCallback(() => {
//     dispatch(setUpFilterFields({ fields: filterFields }));
//   }, []);

//   // ? memoized the function ..
//   const getHiringProposal = useCallback(async () => {
//     paramString = Object.entries(filter)
//       .map(([key, value]) => {
//         if (Array.isArray(value)) {
//           return value
//             .map((item) => `${key}=${encodeURIComponent(item)}`)
//             .join("&");
//         }
//         return `${key}=${encodeURIComponent(value)}`;
//       })
//       .join("&");

//     // console.log("paramString ---> ", paramString);

//     try {
//       const query = filterQuery ? `${paramString}&${filterQuery}` : paramString;
//       const response = await getHiringProposalMaster(query).unwrap();
//       // console.log("Success:", response);

//       setData(response?.results || []);

//       if (response?.edit) {
//         setViewColumns([
//           ...memoizedColumns,
//           columnHelper.accessor("update", {
//             header: () => (
//               <Text id="update_col" fontWeight="800">
//                 UPDATE
//               </Text>
//             ),
//             cell: (info) => (
//               <Flex justifyContent="center" color="primary.700" id="update_row">
//                 <BiEditAlt
//                   fontSize="26px"
//                   cursor="pointer"
//                   onClick={() => editFormMemoized(info)}
//                 />
//               </Flex>
//             ),
//             id: "update_col",
//             accessorFn: (row) => row.update_col,
//           }),
//         ]);
//       }

//       setFilter((old) => ({
//         ...old,
//         totalPage: Math.ceil(response?.total / old.limit),
//         total: response?.total_data,
//         totalFilter: response?.total,
//         add: false,
//         excelDownload: filterQuery ? `${old.modal}&${filterQuery}` : old.modal,
//       }));

//       setPagePerm({
//         view: response?.view || false,
//         add: false,
//         edit: response?.edit || false,
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       setPagePerm({
//         view: false,
//         add: false,
//         edit: false,
//       });
//     }
//   }, []);

//   useEffect(() => {
//     tableFilterSet();
//     getHiringProposal();
//     // eslint-disable-next-line
//   }, [
//     tableFilterSet,
//     getHiringProposal,
//     filter.limit,
//     filter.page,
//     filterQuery,
//   ]);

//   return (
//     <div>
//       {pagePerm?.view ? (
//         // <FunctionalTable
//         //   filter={filter}
//         //   filterFields={filterFields}
//         //   setFilter={setFilter}
//         //   columns={viewColumns}
//         //   data={data || []}
//         //   loading={getHiringProposalMasterApiIsLoading}
//         //   addForm={() => addFormMemoized()}
//         // />
//         <MultiFunctionalTable
//           filter={filter}
//           filterFields={filterFields}
//           setFilter={setFilter}
//           columns={viewColumns}
//           data={data || []}
//           loading={getHiringProposalMasterApiIsLoading}
//           addForm={() => addFormMemoized()}
//           selectedItems={selectedItems}
//           SelectionFunction={(id) => SelectionFunction(id)}
//           AssignToMeFunction={() => AssignToMeFunction()}
//         />
//       ) : (
//         <>
//           <NotaccessImage />
//           {/* <Text as="h3" color="black" fontWeight="800">
//             You do not have access to this page{" "}
//           </Text> */}
//         </>
//       )}
//     </div>
//   );
// }

// export default React.memo(InspectionMaster);

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetInspectionMasterMutation,
  useMultipleAssignInspectionMasterMutation,
} from "../../features/master-api-slice";
import { BiEditAlt } from "react-icons/bi";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import { createColumnHelper } from "@tanstack/react-table";
import { setUpFilterFields } from "../../features/filter.slice";
import { filterFields } from "./fields";
import { useNavigate } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import ROUTE_PATH from "../../constants/ROUTE";
import MultiFunctionalTable from "../../components/Tables/MultiFunctionalTable";
// import { toasterAlert } from "../../services/common.service";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

function InspectionMaster() {
  const dispatch = useDispatch();
  const columnHelper = createColumnHelper();
  const navigate = useNavigate();
  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );

  const [filter, setFilter] = useState({
    // filter: [],
    // search: null,
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    add: false,
    modal: "WarehouseHiringInspection",
    excelDownload: "WarehouseHiringInspection",
  });

  const addForm = () => {
    navigate(`${ROUTE_PATH.WAREHOUSE_INSPECTION}`);
  };

  const viewForm = (info) => {
    console.log("info --> ", info);

    navigate(`${ROUTE_PATH.WAREHOUSE_INSPECTION}`, {
      state: {
        details: {
          id: info.row.original.id,
          view: true,
        },
      },
    });
  };

  const editForm = (info) => {
    console.log("info --> ", info);

    navigate(`${ROUTE_PATH.WAREHOUSE_INSPECTION}`, {
      state: {
        details: {
          id: info.row.original.id,
        },
      },
    });
  };

  const [
    getHiringProposalMaster,
    { isLoading: getHiringProposalMasterApiIsLoading },
  ] = useGetInspectionMasterMutation();

  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "SR. NO",
    }),
    // columnHelper.accessor("inspection_number", {
    //   cell: (info) =>
    //     info.getValue() ? info.getValue()?.inspection_number || " - " : " - ",
    //   header: " Warehouse Proposal no.",
    // }),
    columnHelper.accessor("hiring_proposal.proposal_number", {
      cell: (info) => info.getValue() || "-",
      header: "Warehouse Proposal no.",
    }),
    columnHelper.accessor("warehouse_type", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.warehouse_type_name || " - " : " - ",
      header: "Warehouse Type",
    }),
    columnHelper.accessor("warehouse_sub_type", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.warehouse_subtype || " - " : " - ",
      header: "Warehouse Sub Type",
    }),
    columnHelper.accessor("warehouse_name", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Warehouse Name",
    }),
    columnHelper.accessor("region", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.region_name || " - " : " - ",
      header: "Region",
    }),
    columnHelper.accessor("state", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.state_name || " - " : " - ",
      header: "State",
    }),
    columnHelper.accessor("substate", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.substate_name || " - " : " - ",
      header: "Sub State",
    }),
    columnHelper.accessor("district", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.district_name || " - " : " - ",
      header: "District",
    }),
    columnHelper.accessor("area", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.area_name || " - " : " - ",
      header: "Area",
    }),
    columnHelper.accessor("warehouse_address", {
      cell: (info) =>
        info.getValue()
          ? info.getValue().length > 50
            ? info.getValue().slice(0, 50) + "..."
            : info.getValue()
          : " - ",
      header: " Address ",
    }),
    columnHelper.accessor("warehouse_pincode", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: " Pincode",
    }),
    // columnHelper.accessor("warehouse_pincode", {
    //   cell: (info) => (info.getValue() ? info.getValue() : " - "),
    //   header: "Application status ",
    // }),
    columnHelper.accessor("l1_user", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
      header: "L1 User",
    }),
    columnHelper.accessor("l2_user", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
      header: "L2 User  ",
    }),
    columnHelper.accessor("l3_user", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
      header: "L3 User  ",
    }),
    columnHelper.accessor("l4_user", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
      header: "L4 User  ",
    }),
    columnHelper.accessor("status", {
      cell: (info) => info.getValue()?.description || " - ",
      header: "Application Status",
    }),
    columnHelper.accessor("creation_date", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Creation Date",
    }),
    columnHelper.accessor("last_updated_date", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Last Update Date",
    }),

    // columnHelper.accessor("is_active", {
    //   header: () => (
    //     <Text id="active_col" fontWeight="800">
    //       Active
    //     </Text>
    //   ),
    //   cell: (info) => (
    //     <Box id="active_row">
    //       <Switch
    //         size="md"
    //         colorScheme="whatsapp"
    //         isChecked={info.row.original.is_active}
    //       />
    //     </Box>
    //   ),
    //   id: "active",
    //   accessorFn: (row) => row.active,
    // }),
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
      accessorFn: (row) => row.view_col,
    }),
  ];

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  const [data, setData] = useState([]);

  let paramString = "";

  const [pagePerm, setPagePerm] = useState({
    view: true,
    edit: false,
    add: false,
  });

  // Selection Logic Start

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

  const [assignToMe] = useMultipleAssignInspectionMasterMutation();

  const AssignToMeFunction = async () => {
    try {
      const response = await assignToMe({ id_list: selectedItems }).unwrap();
      // console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        // console.log("response --> ", response);
        // tableFilterSet();
        getHiringProposal();
        toasterAlert({
          message: response?.message,
          status: 200,
        });

        setTimeout(() => {
          window.location.reload();
          // navigate("/hiring-proposal-master");
        }, 1500);
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

  const [viewColumns, setViewColumns] = useState(columns);

  const getHiringProposal = async () => {
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
      const query = filterQuery ? `${paramString}&${filterQuery}` : paramString;
      const response = await getHiringProposalMaster(query).unwrap();
      console.log("Success:", response);

      setData(response?.results || []);

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

      setPagePerm({
        view: response?.view || false,
        add: false,
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
    tableFilterSet();
    getHiringProposal();
  }, [filter.limit, filter.page, filterQuery]);

  return (
    <div>
      {pagePerm?.view ? (
        // <FunctionalTable
        //   filter={filter}
        //   filterFields={filterFields}
        //   setFilter={setFilter}
        //   columns={viewColumns}
        //   data={data || []}
        //   loading={getHiringProposalMasterApiIsLoading}
        //   addForm={() => addForm()}
        // />
        <MultiFunctionalTable
          filter={filter}
          filterFields={filterFields}
          setFilter={setFilter}
          columns={viewColumns}
          data={data || []}
          loading={getHiringProposalMasterApiIsLoading}
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

export default InspectionMaster;
