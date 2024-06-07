import { createColumnHelper } from "@tanstack/react-table";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import React, { useEffect, useState } from "react";
import {
  // useActiveDeActiveMutation,
  useGetCommodityMasterMutation,
} from "../../features/master-api-slice";
import { Flex, Text } from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setUpFilterFields } from "../../features/filter.slice";
// import { API } from "../../constants/api.constants";
import { useNavigate } from "react-router-dom";
import { columns, filterFields } from "./fields";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import ROUTE_PATH from "../../constants/ROUTE";
import { BsEye } from "react-icons/bs";

const CommodityMaster = () => {
  const dispatch = useDispatch();
  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );

  const navigate = useNavigate();

  const columnHelper = createColumnHelper();

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
    total: 0,
    add: false,
    modal: "Commodity",
    excelDownload: "Commodity",
  });
  // ! commented unused  rtk hook  ..
  // const [
  // activeDeActive,
  // { error: activeDeActiveApiErr, isLoading: activeDeActiveApiIsLoading },
  // ] = useActiveDeActiveMutation();
  const [viewColumns, setViewColumns] = useState(columns);

  const viewForm = (info) => {
    console.log("Info:", info);
    const commodityId = info.row.original.id;

    console.log("Navigating to role id:", commodityId);

    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER_EDIT}/${commodityId}`, {
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
  // ! commented the unused function ..
  // const handleActiveDeActive = async (e, info) => {
  //   let obj = {
  //     id: info.row.original.id,
  //     is_active: e.target.checked,
  //     endPoint: API.DASHBOARD.COMMODITY_ACTIVE,
  //   };

  //   try {
  //     const response = await activeDeActive(obj).unwrap();

  //     if (response.status === 201) {
  //       toast({
  //         title: `${response.message}`,
  //         status: "success",
  //         position: "top-right",
  //         isClosable: true,
  //         duration: 2000,
  //       });
  //       let table_data = data;
  //       console.log("table_data", data);

  //       const updatedData = table_data.map((item) => {
  //         if (item.id === obj.id) {
  //           return {
  //             ...item,
  //             active: obj.active,
  //           };
  //         } else {
  //           return item;
  //         }
  //       });

  //       setData(updatedData);
  //       // getData();
  //     }

  //     console.log("response --> ", response);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  // ! commented the unused variable ..
  // const toast = useToast();

  // Edit Form Link Function Start
  const editForm = (info) => {
    let editedFormId = info.row.original.id;

    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER_EDIT}/${editedFormId}`, {
      state: { details: info.row.original },
    });
  };
  // Edit Form Link Function End

  //  Add Form Link Function Start
  const addForm = () => {
    navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER_ADD}`);
  };
  //  Edit Form Link Function End

  // Commodity Master Get Api Start
  const [
    getCommodityMaster,
    {
      // error: getCommodityMasterApiErr,
      isLoading: getCommodityMasterApiIsLoading,
    },
  ] = useGetCommodityMasterMutation();
  const getData = async () => {
    //params filter
    // filter.filter.length ||
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
      const response = await getCommodityMaster(query).unwrap();

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
    // eslint-disable-next-line
  }, [filter.limit, filter.page, filterQuery]);
  // Commodity Master Get Api End
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
            loading={getCommodityMasterApiIsLoading}
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

export default CommodityMaster;
