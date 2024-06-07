import React, { useEffect, useState } from "react";
import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  // useActiveDeActiveMutation,
  useGetDepartmentMasterMutation,
} from "../../features/master-api-slice";

import { BiEditAlt } from "react-icons/bi";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import { createColumnHelper } from "@tanstack/react-table";
import { setUpFilterFields } from "../../features/filter.slice";
// import { API } from "../../constants/api.constants";
import { filterFields } from "./fields";
import { useNavigate } from "react-router-dom";

function DepartmentMaster() {
  const dispatch = useDispatch();
  const columnHelper = createColumnHelper();
  const navigate = useNavigate();
  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );
  console.log("Department Master", filterQuery);
  const [filter, setFilter] = useState({
    // filter: [],
    // search: null,
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    excelDownload: "Department",
  });
  const [data, setData] = useState([]);

  const [getDepartmentMaster, { isLoading: getDepartmentMasterApiIsLoading }] =
    useGetDepartmentMasterMutation();
  // ! commented the unused rtk hook ..
  // const [activeDeActive] = useActiveDeActiveMutation();

  // ! commented the unused variable ..
  // const toast = useToast();

  //  !commented the unused function ..
  // const handleActiveDeActive = async (e, info) => {
  //   console.log("event --> ", e.target.checked, info);
  //   let obj = {
  //     id: info.row.original.id,
  //     active: e.target.checked,
  //     endPoint: API.DASHBOARD.DEPARTMENT_MASTER_ACTIVE,
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

  //       console.log("updatedData", updatedData);

  //       setData(updatedData);
  //       // getData();
  //     }

  //     console.log("response --> ", response);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const addForm = () => {
    navigate(`/add/department-master/`);
  };

  const editForm = (info) => {
    // console.log("department info --->", info);
    const editedFormId = info.row.original.id;
    navigate(`/edit/department-master/${editedFormId}`, {
      state: { details: info.row.original },
    });
  };

  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "SR. NO",
    }),
    columnHelper.accessor("department_name", {
      cell: (info) => info.getValue(),
      header: "Department Name",
    }),

    columnHelper.accessor("creation_date", {
      cell: (info) => info.getValue(),
      header: "Creation Date",
    }),
    columnHelper.accessor("last_updated_date", {
      cell: (info) => info.getValue(),
      header: "Last Updated Date",
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

  let paramString = "";

  const getDepartment = async () => {
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

    // console.log("paramString ---> ", paramString);

    try {
      const query = filterQuery ? `${paramString}&${filterQuery}` : paramString;
      const response = await getDepartmentMaster(query).unwrap();
      // console.log("Success:", response);
      setData(response?.results || []);
      setFilter((old) => ({
        ...old,
        totalPage: Math.ceil(response?.total / old.limit),
        total: response?.total_data,
        totalFilter: response?.total,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    tableFilterSet();
    getDepartment();
    // eslint-disable-next-line
  }, [filter.limit, filter.page, filterQuery]);

  return (
    <div>
      <FunctionalTable
        filter={filter}
        filterFields={filterFields}
        setFilter={setFilter}
        columns={columns}
        data={data}
        loading={getDepartmentMasterApiIsLoading}
        addForm={() => addForm()}
      />
    </div>
  );
}

export default DepartmentMaster;
