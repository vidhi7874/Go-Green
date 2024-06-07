import React, { useEffect, useState } from "react";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import { useDispatch, useSelector } from "react-redux";
import { columns, filterFields } from "./field";
import { setUpFilterFields } from "../../features/filter.slice";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import { useNavigate } from "react-router-dom";
import ROUTE_PATH from "../../constants/ROUTE";
import { BiEditAlt } from "react-icons/bi";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Text } from "@chakra-ui/react";
import { useGetOwnerBillingMutation } from "../../features/billing.slice";

function OwnerBilling() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigation = useNavigate();

  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );

  const columnHelper = createColumnHelper();

  const [pagePerm, setPagePerm] = useState({
    view: true,
    edit: false,
    add: false,
  });
  console.log("pagePerm: in the state >>", pagePerm);

  const [filter, setFilter] = useState({
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    add: false,
    modal: "WarehouseOwnerBilling",
    excelDownload: "WarehouseOwnerBilling",
  });

  const [viewColumns, setViewColumns] = useState(columns);

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  const [data, setData] = useState([]);
  let paramString = "";
  //Add Form Link Function Start
  const addForm = () => {
    navigate(`${ROUTE_PATH.OWNER_BILLING_ADD}`);
  };
  //Add Form Link Function End

  //Edit Form Link Function End

  //Region Master Get Api Start
  const [
    getOwnerBillingMaster,
    { isLoading: getOwnerBillingMasterApiIsLoading },
  ] = useGetOwnerBillingMutation();

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
      const response = await getOwnerBillingMaster(query).unwrap();
      console.log("Success:", response);
      setData(response?.results || []);

      setPagePerm({
        view: response?.view || false,
        add: false,
        edit: false,
      });

      setFilter((old) => ({
        ...old,
        totalPage: Math.ceil(response?.total / old.limit),
        total: response?.total_data,
        totalFilter: response?.total,
        add: false,
        excelDownload: filterQuery ? `${old.modal}&${filterQuery}` : old.modal,
      }));
    } catch (error) {
      console.error("Error:", error);
      setPagePerm({
        // view: false,
        view: true,
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

  return (
    <div>
      {pagePerm?.view ? (
        <FunctionalTable
          filter={filter}
          filterFields={filterFields}
          setFilter={setFilter}
          columns={viewColumns}
          data={data}
          loading={getOwnerBillingMasterApiIsLoading}
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
}

export default OwnerBilling;
