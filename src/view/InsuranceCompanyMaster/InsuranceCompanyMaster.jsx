import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import { useEffect, useState } from "react";
import {
  // useActiveDeActiveMutation,
  useGetInsuranceCompanyMasterMutation,
} from "../../features/master-api-slice";
import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { BiEditAlt } from "react-icons/bi";
import { setUpFilterFields } from "../../features/filter.slice";
// import { API } from "../../constants/api.constants";
import { filterFields } from "./fields";
import { useNavigate } from "react-router-dom";

function InsuranceCompanyMaster() {
  const dispatch = useDispatch();
  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );
  const navigate = useNavigate();
  console.log("InsuranceCompanyMaster", filterQuery);
  const columnHelper = createColumnHelper();
  const [filter, setFilter] = useState({
    // filter: [],
    // search: null,
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    modal: "InsuranceCompany",
    excelDownload: "InsuranceCompany",
  });

  const [
    getInsuranceCompanyMaster,
    { isLoading: getInsuranceCompanyMasterApiIsLoading },
  ] = useGetInsuranceCompanyMasterMutation();

  // ! commented the un used rtk hook ..
  // const [
  //   activeDeActive,
  // { isLoading: activeDeActiveApiIsLoading }
  // ] = useActiveDeActiveMutation();

  // ! commented the unused variable ..
  // const toast = useToast();

  // ! commented the un used function
  // const handleActiveDeActive = async (e, info) => {
  //   console.log("event --> ", e.target.checked, info);
  //   let obj = {
  //     id: info.row.original.id,
  //     active: e.target.checked,
  //     endPoint: API.DASHBOARD.INSURANCE_ACTIVE,
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

  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "SR. NO",
    }),
    columnHelper.accessor("insurance_company_name", {
      cell: (info) => info.getValue(),
      header: "company name",
    }),
    columnHelper.accessor("region.region_name", {
      cell: (info) => info.getValue(),
      header: "REGION ",
    }),
    columnHelper.accessor("state.state_name", {
      cell: (info) => info.getValue(),
      header: "STATE ",
    }),
    columnHelper.accessor("insurance_company_address", {
      cell: (info) => info.getValue(),
      header: "ADDRESS",
    }),
    columnHelper.accessor("creation_date", {
      cell: (info) => info.getValue(),
      header: " Creation Date",
    }),
    columnHelper.accessor("last_update_date", {
      cell: (info) => info.getValue(),
      header: " Last Updated Date",
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

  // const params = {
  //   filter: [],
  //   search: "",
  // };

  let paramString = "";
  const addForm = () => {
    navigate(`/manage-insurance/add/insurance-company-master/`);
  };
  const editForm = (info) => {
    console.log("info --> ", info);
    let editedFormId = info.row.original.id;

    navigate(
      `/manage-insurance/edit/insurance-company-master/${editedFormId}`,
      {
        state: { details: info.row.original },
      }
    );
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
    //}

    console.log("paramString ---> ", paramString);

    try {
      let query = filterQuery ? `${paramString}&${filterQuery}` : paramString;
      const response = await getInsuranceCompanyMaster(query).unwrap();
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

  return (
    <div>
      <FunctionalTable
        filter={filter}
        filterFields={filterFields}
        setFilter={setFilter}
        columns={columns}
        data={data}
        loading={getInsuranceCompanyMasterApiIsLoading}
        addForm={() => addForm()}
      />
    </div>
  );
}

export default InsuranceCompanyMaster;
