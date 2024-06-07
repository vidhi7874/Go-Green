import { createColumnHelper } from "@tanstack/react-table";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import React, { useEffect, useState } from "react";
import {
  // useActiveDeActiveMutation,
  useGetPageMasterMutation,
  // useGetStateMasterMutation,
} from "../../features/master-api-slice";
import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setUpFilterFields } from "../../features/filter.slice";
// import { API } from "../../constants/api.constants";
import { useNavigate } from "react-router-dom";
import { filterFields } from "./fields";

const PageMaster = () => {
  const dispatch = useDispatch();
  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );
  // console.log("Pagemaster", filterQuery);
  const columnHelper = createColumnHelper();
  const [filter, setFilter] = useState({
    // filter: [],
    // search: null,
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    modal: "Page",
    excelDownload: "Page",
  });
  const navigate = useNavigate();
  // ! commented the un used code ..
  const [
    getStateMaster,
    {
      // error: getPageMasterApiErr,
      isLoading: getPageMasterApiIsLoading,
    },
  ] = useGetPageMasterMutation();
  //  ! commented the unused rtk hook ...
  // const [
  //   activeDeActive,
  //   // { error: activeDeActiveApiErr, isLoading: activeDeActiveApiIsLoading },
  // ] = useActiveDeActiveMutation();

  // ! commented the unused variable ..
  // const toast = useToast();

  // ! commented the unused function ..
  // const handleActiveDeActive = async (e, info) => {
  //   console.log("event --> ", e.target.checked, info);
  //   let obj = {
  //     id: info.row.original.id,
  //     active: e.target.checked,
  //     endPoint: API.DASHBOARD.PAGE_MASTER_ACTIVE,
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
  //             is_active: obj.is_active,
  //           };
  //         } else {
  //           return item;
  //         }
  //       });

  //       console.log("updatedData", updatedData);

  //       setData(updatedData);
  //       // getData();
  //     }

  //     console.log("response --> ", response);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  const editForm = (info) => {
    console.log("info --> ", info);
    let editedFormId = info.row.original.id;

    navigate(`/manage-users/edit/page-master/${editedFormId}`, {
      state: { details: info.row.original },
    });
  };

  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "SR. NO",
    }),
    columnHelper.accessor("page_name", {
      cell: (info) => info.getValue(),
      header: "PAGE NAME",
    }),
    columnHelper.accessor("description", {
      cell: (info) => info.getValue(),
      header: "DESCRIPTION",
    }),
    columnHelper.accessor("creation_date", {
      cell: (info) => info.getValue(),
      header: "CREATION DATE",
    }),
    columnHelper.accessor("last_updated_date", {
      cell: (info) => info.getValue(),
      header: "LAST UPDATED DATE",
    }),
    columnHelper.accessor("is_active", {
      // header: "ACTIVE",
      header: () => (
        <Text  as="span" id="active_col" fontWeight="800">
          Active
        </Text>
      ),
      cell: (info) => (
        <Box id="active_row">
          <Switch
            size="md"
            colorScheme="whatsapp"
            // onChange={(e) => handleActiveDeActive(e, info)}
            isChecked={info.row.original.is_active}
            // id="active_row"
            // isReadOnly
            // isChecked={flexRender(
            //   cell.column.columnDef.cell,
            //   cell.getContext()
            // )}
          />
        </Box>
      ),
      id: "active",
      accessorFn: (row) => row.active,
    }),
    columnHelper.accessor("update", {
      // header: "UPDATE",
      header: () => (
        <Text id="update_col" fontWeight="800">
          UPDATE
        </Text>
      ),
      cell: (info) => (
        <Flex justifyContent="center" color="primary.700" id="update_row">
          <BiEditAlt
            // color="#A6CE39"
            fontSize="26px"
            cursor="pointer"
            onClick={() => editForm(info)}
          />
        </Flex>
      ),
      id: "update_col",
      accessorFn: (row) => row.update_col,
    }),
  ];

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  const [data, setData] = useState([]);

  let paramString = "";

  const addForm = () => {
    navigate(`/manage-users/add/page-master/`);
  };

  const getData = async () => {
    //params filter
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
      const response = await getStateMaster(query).unwrap();
      console.log("Success:", response);
      setData(response?.results || []);
      setFilter((old) => ({
        ...old,
        totalPage: Math.ceil(response?.total / old.limit),
        total: response?.total_data,
        totalFilter: response?.total,
        excelDownload: filterQuery ? `${old.modal}&${filterQuery}` : old.modal,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    tableFilterSet();
    getData();
    // eslint-disable-next-line
  }, [filter.limit, filter.page, filterQuery]);

  // useMemo(() => {
  //   if (filter.search !== null) {
  //     getData();
  //   }
  // }, [filter.search]);
  // useMemo(() => {
  //   console.log("filter query", filterQuery);
  //   if (filterQuery) {
  //     getData();
  //   }
  // }, [filterQuery]);

  return (
    <div>
      <FunctionalTable
        filter={filter}
        filterFields={filterFields}
        setFilter={setFilter}
        columns={columns}
        data={data}
        loading={getPageMasterApiIsLoading}
        addForm={() => addForm()}
      />
    </div>
  );
};

export default PageMaster;
