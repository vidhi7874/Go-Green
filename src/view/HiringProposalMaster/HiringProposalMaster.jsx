/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useGetHiringProposalMasterMutation } from "../../features/master-api-slice";
import { BiEditAlt } from "react-icons/bi";
// import FunctionalTable from "../../components/Tables/FunctionalTable";
import { createColumnHelper } from "@tanstack/react-table";
import { setUpFilterFields } from "../../features/filter.slice";
import { filterFields } from "./fields";
import { useNavigate } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import MultiFunctionalTable from "../../components/Tables/MultiFunctionalTable";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { usePostAssignToMeMutation } from "../../features/warehouse-proposal.slice";
import ROUTE_PATH from "../../constants/ROUTE";

function HiringProposalMaster() {
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
    modal: "WarehouseHiringProposal",
    excelDownload: "WarehouseHiringProposal",
  });

  const selectBoxOptions = {
    commodityIn: [
      {
        label: "Fresh Stock",
        value: "FS",
      },
      {
        label: "Pre-Stacked",
        value: "PS",
      },
      // {
      //   label: "Take Over",
      //   value: "TO",
      // },
    ],
  };

  // Proposal View Function Start

  const viewForm = (info) => {
    // console.log("info --> ", info);

    navigate(`${ROUTE_PATH.PROPOSALS}`, {
      state: {
        details: {
          view: true,
          id: info?.row?.original?.id || 0,
          warehouse_type: info?.row?.original?.warehouse_type?.id || 0,
          warehouse_subtype: info?.row.original?.warehouse_subtype?.id || 0,
        },
      },
    });
  };

  // Proposal View Function End

  // Proposal Add Function Start

  const addForm = () => {
    navigate(`${ROUTE_PATH.PROPOSALS}`);
  };

  // Proposal Add Function End

  // Proposal Edit Function Start

  const editForm = (info) => {
    // console.log("info --> ", info);

    navigate(`${ROUTE_PATH.PROPOSALS}`, {
      state: {
        details: {
          id: info?.row?.original?.id || 0,
          warehouse_type: info?.row?.original?.warehouse_type?.id || 0,
          warehouse_subtype: info?.row.original?.warehouse_subtype?.id || 0,
        },
      },
    });
  };

  // Proposal Edit Function End

  // Table Column Start

  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "SR. NO",
    }),
    columnHelper.accessor("proposal_number", {
      cell: (info) => info.getValue() || "-",
      header: "Proposal Number",
    }),
    columnHelper.accessor("warehouse_type", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.warehouse_type_name || " - " : " - ",
      header: "Warehouse Type",
    }),
    columnHelper.accessor("warehouse_subtype", {
      cell: (info) =>
        info.getValue() ? info.getValue().warehouse_subtype || " - " : " - ",
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
      header: "Warehouse Address ",
    }),
    columnHelper.accessor("warehouse_pincode", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Warehouse Pincode",
    }),
    columnHelper.accessor("no_of_chambers", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "No Of Chambers",
    }),
    columnHelper.accessor("is_factory_permise", {
      cell: (info) => (info.getValue() ? "Yes" : "No"),
      header: "Is Factory Premise",
    }),
    columnHelper.accessor("standard_capacity", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Standard Capacity",
    }),
    columnHelper.accessor("currrent_capacity", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Current Capacity",
    }),
    columnHelper.accessor("currrent_utilised_capacity", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Current Utilised Capacity",
    }),
    columnHelper.accessor("no_of_warehouse_in_area", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "No Of Warehouse In Area",
    }),
    columnHelper.accessor("lock_in_period", {
      cell: (info) => (info.getValue() ? "Yes" : "No"),
      header: "Lock in Period",
    }),
    columnHelper.accessor("lock_in_period_month", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Lock in Period Month",
    }),
    columnHelper.accessor("covered_area", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Covered Area",
    }),
    columnHelper.accessor("supervisor_day_shift", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
      header: "Supervisor Day Shift",
    }),
    columnHelper.accessor("supervisor_night_shift", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
      header: "Supervisor Night Shift ",
    }),
    columnHelper.accessor("security_guard_day_shift", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.security_guard_name || " - " : " - ",
      header: "Security Guard Day Shift ",
    }),
    columnHelper.accessor("security_guard_night_shift", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.security_guard_name || " - " : " - ",
      header: "Security Guard Night Shift ",
    }),
    columnHelper.accessor("commodity_inward_type", {
      cell: (info) =>
        info.getValue()
          ? selectBoxOptions?.commodityIn?.filter(
              (item) => item.value === info.getValue()
            )[0]?.label || " - "
          : " - ",
      header: "Commodity Inward Type",
    }),
    columnHelper.accessor("prestack_commodity", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.commodity_name : " - ",
      header: "PreStack Commodity ",
    }),
    columnHelper.accessor("prestack_commodity_qty", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "PreStack Commodity Qty",
    }),
    columnHelper.accessor("ccbanker_name", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "CC Banker ",
    }),
    columnHelper.accessor("is_funding_required", {
      cell: (info) => (info.getValue() ? "Yes" : "No"),
      header: "Funding Required ",
    }),
    columnHelper.accessor("rent", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Rent",
    }),
    columnHelper.accessor("gg_revenue_ratio", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "GG Revenue Sharing Ratio",
    }),
    columnHelper.accessor("security_deposit_month", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Security Deposite Month",
    }),
    columnHelper.accessor("advance_rent", {
      cell: (info) => (info.getValue() ? "Yes" : "No"),
      header: "Advance Rent",
    }),
    columnHelper.accessor("advance_rent_month", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Advance Rent Month ",
    }),
    columnHelper.accessor("gst", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "GST",
    }),
    columnHelper.accessor("commencement_date", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Commencement Date",
    }),
    columnHelper.accessor("agreement_period_month", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Agreement Period Month ",
    }),
    columnHelper.accessor("notice_period_month", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Notice Period Month",
    }),
    // columnHelper.accessor("projected_file_url", {
    //   cell: (info) => (info.getValue() ? info.getValue() : " - "),
    //   header: "Projection Plan File Path",
    // }),
    // columnHelper.accessor("intention_letter_url", {
    //   cell: (info) => (info.getValue() ? info.getValue() : " - "),
    //   header: "Owner Intention Letter File Path",
    // }),
    columnHelper.accessor("remarks", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Remarks ",
    }),
    // columnHelper.accessor("cm_proposal_business_form_file_path", {
    //   cell: (info) => (info.getValue() ? info.getValue() : " - "),
    //   header: "CM Proposal Business Form File Path ",
    // }),
    columnHelper.accessor("l1_user", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
      header: "L1 User",
    }),
    columnHelper.accessor("l2_user", {
      cell: (info) =>
        info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
      header: "L2 User",
    }),
    // columnHelper.accessor("inspection_assigned_to", {
    //   cell: (info) =>
    //     info.getValue() ? info.getValue()?.employee_name || " - " : " - ",
    //   header: "Inspection Assigned To",
    // }),
    columnHelper.accessor("status", {
      cell: (info) => info.getValue()?.description || " - ",
      header: "Application Status",
    }),
    columnHelper.accessor("created_at", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Creation Date",
    }),
    columnHelper.accessor("updated_at", {
      cell: (info) => (info.getValue() ? info.getValue() : " - "),
      header: "Last Update Date",
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
      accessorFn: (row) => row.view_col,
    }),
  ];

  // Table Column End

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

  const [assignToMe] = usePostAssignToMeMutation();

  const AssignToMeFunction = async () => {
    try {
      const response = await assignToMe({ id_list: selectedItems }).unwrap();

      console.log("test response -->", response);
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

  const [viewColumns, setViewColumns] = useState(columns);

  // Hiring Proposal List Api Start

  const [
    getHiringProposalMaster,
    { isLoading: getHiringProposalMasterApiIsLoading },
  ] = useGetHiringProposalMasterMutation();

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

    // console.log("paramString ---> ", paramString);

    try {
      const query = filterQuery ? `${paramString}&${filterQuery}` : paramString;
      const response = await getHiringProposalMaster(query).unwrap();
      console.log("Success:", response);

      setData(response?.results || []);
      console.log(selectBoxOptions, "here");

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
    tableFilterSet();
    getHiringProposal();
    // eslint-disable-next-line
  }, [filter.limit, filter.page, filterQuery]);

  // Hiring Proposal List Api Start

  return (
    <div>
      {pagePerm?.view ? (
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

export default HiringProposalMaster;
