/* eslint-disable react-hooks/exhaustive-deps */
// / eslint-disable react-hooks/exhaustive-deps /
import React, { useCallback, useEffect, useMemo, useState } from "react";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import { filterFields } from "./fields";
import {
  Flex,
  Text,
  Box,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  useGetBankBranchMasterFreeMutation,
  useGetBankMasterFreeMutation,
  useGetChamberFreeMutation,
  useGetWareHouseMutation,
  useUpdateWareHouseAgreementRenewalByIdMutation,
} from "../../features/master-api-slice";
import { useDispatch, useSelector } from "react-redux";
import { setUpFilterFields } from "../../features/filter.slice";
import { useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { BsEye } from "react-icons/bs";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import { EditIcon } from "@chakra-ui/icons";
import { useGetWarehouseProposalDetailsMutation } from "../../features/warehouse-proposal.slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import ROUTE_PATH from "../../constants/ROUTE";
import ReactSelect from "react-select";
// import { usePostReInspectionCreateMutation } from "../../features/reinspection.slice";

const columnHelper = createColumnHelper();

const INITIAL_GLOBAL_PAGE_PERM_STATE = {
  view: true,
  edit: false,
  add: false,
};

const INITIAL_FILTER_STATE = {
  // filter: [],
  // search: null,
  page: 1,
  totalPage: 1,
  limit: 25,
  totalFilter: 0,
  total: 0,
  add: false,
  modal: "Warehouse",
  excelDownload: "Warehouse",
};

function WareHouseMaster() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRenewalApiCall, setIsRenewalApiCall] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isConfirmationModalIsOpen,
    onOpen: isConfirmationModalOnOpen,
    onClose: isConfirmationModalOnClose,
  } = useDisclosure();

  // extracting the data of the filter ...
  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );
  console.log("filterQuery: >>", filterQuery);

  // ?? memoized the column fields ..
  const columns = useMemo(() => {
    return [
      columnHelper.accessor("id", {
        cell: (info) => info.getValue(),

        header: "SR. NO",
      }),
      columnHelper.accessor("warehouse_number", {
        cell: (info) => info.getValue(),
        header: "Warehouse Number",
      }),
      columnHelper.accessor("warehouse_type.warehouse_type_name", {
        cell: (info) => info.getValue(),
        header: "Warehouse type",
      }),
      columnHelper.accessor("warehouse_sub_type.warehouse_subtype", {
        cell: (info) => info.getValue(),
        header: "Warehosue Sub type ",
      }),
      columnHelper.accessor("warehouse_unit_type.warehouse_unit_type", {
        cell: (info) => info.getValue(),
        header: "Warehouse Unit type ",
      }),
      columnHelper.accessor("warehouse_name", {
        cell: (info) => info.getValue(),
        header: "Warehouse name ",
      }),
      columnHelper.accessor("region.region_name", {
        cell: (info) => info.getValue(),
        header: "Region",
      }),
      columnHelper.accessor("state.state_name", {
        cell: (info) => info.getValue(),
        header: " State",
      }),
      columnHelper.accessor("substate.substate_name", {
        cell: (info) => info.getValue(),
        header: "Sub state ",
      }),
      columnHelper.accessor("district.district_name", {
        cell: (info) => info.getValue(),
        header: " District",
      }),
      columnHelper.accessor("area.area_name", {
        cell: (info) => info.getValue(),
        header: "area ",
      }),
      columnHelper.accessor("warehouse_address", {
        cell: (info) => info.getValue(),
        header: "Address ",
      }),
      columnHelper.accessor("warehouse_pincode", {
        cell: (info) => info.getValue(),
        header: "Pin code ",
      }),
      columnHelper.accessor("is_kyc_completed", {
        cell: (info) => (info.getValue() ? "Yes" : "No"),
        header: " Owners Kyc completed",
      }),
      columnHelper.accessor("last_updated_user.employee_name", {
        cell: (info) => info.getValue() || "-",
        header: "last Updated User",
      }),
      columnHelper.accessor("region_name", {
        cell: (info) => (
          <button
            style={{
              backgroundColor:
                info.row.original.is_agreement_done &&
                info.row.original.is_renewal_started
                  ? "#A6CE39"
                  : "#D8D8D8",
              padding: "6px",
              borderRadius: "10px",

              color: "white",
            }}
            disabled={
              info.row.original.is_agreement_done
                ? !info.row.original.is_renewal_started
                : true
            }
            onClick={() => {
              setIsRenewalApiCall(info.row.original);
              isConfirmationModalOnOpen();
              // UpdateWarehouseAgreementRenewalFunction({
              //   id: info.row.original.id,
              // });
            }}
          >
            Agreement Renewal
          </button>
        ),
        header: "Agreement renewal ",
      }),
      columnHelper.accessor("id", {
        cell: (info) => {
          console.log("info.row.original", info.row.original);
          return (
            <Flex justifyContent="center" color="primary.700" id="update_row">
              {info.row.original.is_kyc_completed ? (
                info.row.original.is_agreement_done ? (
                  <BsEye
                    fontSize="26px"
                    cursor="pointer"
                    onClick={() => {
                      navigate(
                        `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_MASTER_AGREEMENT}`,
                        {
                          state: {
                            id: info.row.original.id,
                            view: true,
                          },
                        }
                      );
                    }}
                  />
                ) : (
                  <EditIcon
                    fontSize="26px"
                    cursor="pointer"
                    onClick={() => {
                      navigate(
                        `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_MASTER_AGREEMENT}`,
                        {
                          state: {
                            view: false,
                            id: info.row.original.id,
                          },
                        }
                      );
                    }}
                  />
                )
              ) : (
                <>-</>
              )}
            </Flex>
          );
        },
        header: " View/Upload agreement",
      }),
      columnHelper.accessor("region_name", {
        cell: (info) => (
          <button
            style={{
              backgroundColor: "#A6CE39",
              padding: "6px",
              borderRadius: "10px",
              color: "white",
            }}
            onClick={() => {
              onOpen();
              setSelectedData((old) => ({
                ...old,
                warehouse: info.row.original.id,
                chamber: "",
              }));
            }}
          >
            Re-Inspection
          </button>
        ),
        header: "Re-Inspection ",
      }),
      columnHelper.accessor("is_active", {
        header: () => (
          <Text as="span" id="active_col" fontWeight="800">
            Active
          </Text>
        ),
        cell: (info) => (
          <Box id="active_row">
            <Switch
              size="md"
              colorScheme="whatsapp"
              isChecked={info.row.original.is_active}
            />
          </Box>
        ),
        id: "active",
        accessorFn: (row) => row.active,
      }),
      columnHelper.accessor("is_block", {
        header: "Block",
        cell: (info) => (
          <Box id="active_row">
            <Switch
              size="md"
              colorScheme="whatsapp"
              isReadOnly
              isChecked={
                info.row.original.is_block || info.row.original.area.is_block
              }
            />
          </Box>
        ),
      }),
    ];
  }, []);

  const callRenewalApi = () => {
    isConfirmationModalOnClose();
    UpdateWarehouseAgreementRenewalFunction({
      id: isRenewalApiCall?.id,
    });
  };

  // useEffect(() => {
  //   if (isConfirmationModalOnOpen) {
  //     alert("api call done");
  //   }
  // }, [isConfirmationModalOnOpen]);

  // const columnHelper = createColumnHelper();
  const [viewColumns, setViewColumns] = useState(columns);
  const [data, setData] = useState([]);

  const tableFilterSet = useCallback(() => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  }, []);

  const [pagePerm, setPagePerm] = useState(INITIAL_GLOBAL_PAGE_PERM_STATE);

  const [filter, setFilter] = useState(INITIAL_FILTER_STATE);

  // Warehouse master api calling
  const [getWarehouse] = useGetWareHouseMutation();

  //onclick of View icon details page open
  const viewForm = (info) => {
    const warehouseId = info.row.original.id;
    console.log("warehouseId: ", warehouseId);
    navigate(
      `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_VIEW}/${warehouseId}`,
      {
        state: {
          warehouseId: info.row.original.id,
          // view: true,
        },
      }
    );
    // navigate(`/warehouse-master/view/warehouse-master-details/${warehouseId}`);
  };

  const getData = async () => {
    let paramString = Object.entries(filter)
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
      let query = filterQuery ? `${paramString}&${filterQuery}` : paramString;
      console.log("query: >>>> ", query);
      const response = await getWarehouse(query).unwrap();
      // console.log("Success:", response);
      setData(response?.results || []);

      if (response?.edit) {
        setViewColumns([...columns]);
      }

      if (response?.view) {
        setViewColumns([
          ...columns,
          columnHelper.accessor("view", {
            header: () => (
              <Text as="span" id="update_col" fontWeight="800">
                View
              </Text>
            ),
            cell: (info) => (
              <Flex justifyContent="center" color="primary.700" id="update_row">
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
    } catch (error) {
      console.error("Error:", error);
      setPagePerm({
        view: false,
        add: false,
        edit: false,
      });
    }
  };

  // Warehouse master api calling end

  // Warehouse Renewal API call start

  const [UpdateWarehouseAgreementRenewal] =
    useUpdateWareHouseAgreementRenewalByIdMutation();

  const UpdateWarehouseAgreementRenewalFunction = async (id) => {
    try {
      const response = await UpdateWarehouseAgreementRenewal(id).unwrap();
      // console.log("Success:", response);
      if (response?.status === 200) {
        // console.log("response?.data --> ", response?.data);
        await fetchWarehouseProposalDetails({
          id: response?.data?.warehouse_hiring_proposal,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Renewal Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const [getWarehouseProposalDetails] =
    useGetWarehouseProposalDetailsMutation();

  const fetchWarehouseProposalDetails = async (id) => {
    console.log(id, "gotenid");
    try {
      console.log(id, "id");

      const response = await getWarehouseProposalDetails(id.id).unwrap();
      console.log("fetchWarehouseProposalDetails:", response);
      if (response?.status === 200) {
        console.log("response?.data --> ", response?.data);
        navigate(`${ROUTE_PATH.PROPOSALS}`, {
          state: {
            details: {
              // view: true,
              id: response?.data?.id || 0,
              warehouse_type: response?.data?.warehouse_type?.id || 0,
              warehouse_subtype: response?.data?.warehouse_subtype?.id || 0,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Renewal Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const toasterAlert = useCallback((obj) => {
    let msg = obj?.message;
    let status = obj?.status;
    console.log("toasterAlert", obj);
    if (status === 400) {
      const errorData = obj?.data || obj?.data?.data;
      let errorMessage = "";

      Object.keys(errorData)?.forEach((key) => {
        const messages = errorData[key];
        console.log("messages --> ", messages);
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
  }, []);

  // Warehouse Renewal API call end

  useEffect(() => {
    tableFilterSet();
    getData();
  }, [filter.limit, filter.page, filterQuery]);

  const finalRef = React.useRef(null);

  const reactSelectStyle = {
    menu: (base) => ({
      ...base,
      // backgroundColor: "#A6CE39",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#A6CE39" : "white",
      color: state.isFocused ? "green" : "black",
      "&:hover": {
        //  backgroundColor: "#C2DE8C",
        color: "black",
      },
    }),
  };

  const [selectBoxOptions, setSelectBoxOptions] = useState([]);

  // api for the bank listing ......
  const [getBankMaster, { isLoading: getBankMasterApiIsLoading }] =
    useGetBankMasterFreeMutation();

  const getBankMasterList = async () => {
    try {
      const response = await getBankMaster().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          banks: response?.results.map(({ bank_name, id }) => ({
            label: bank_name,
            value: id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // api for the branch master api ....
  const [getBankBranchMaster, { isLoading: getBankBranchMasterApiIsLoading }] =
    useGetBankBranchMasterFreeMutation();

  const getBranchMasterList = async () => {
    try {
      const response = await getBankBranchMaster().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          branch: response?.results.map(({ branch_name, bank, id }) => ({
            label: branch_name,
            value: id,
            bank: bank,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [getChamberMaster, { isLoading: getChamberApiIsLoading }] =
    useGetChamberFreeMutation();

  const getChamberMasterList = async () => {
    try {
      const response = await getChamberMaster().unwrap();
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          chamber: response?.data?.map(({ chamber_number, id, warehouse }) => ({
            label: chamber_number,
            value: id,
            warehouse: warehouse?.id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const SELECT_INSPECTION_TYPE = [
    { label: "Chamber Wise Inspection Report", value: "chamber_wise" },
    { label: "Warehouse WiseInspection Report", value: "warehouse_wise" },
  ];

  const [selectedData, setSelectedData] = useState({
    bank: "",
    branch: "",
    inspectionType: "",
    warehouse: "",
    chamber: "",
  });

  // const [creationReInspection] = usePostReInspectionCreateMutation();

  // const createTeInspectionFunction = async (data) => {
  //   try {
  //     const result = await creationReInspection(data).unwrap();

  //     // if (result?.status === 201) {
  //     // console.log(result);
  //     toasterAlert({
  //       message: result.message,
  //       status: 200,
  //     });

  //     onClose();

  //     setTimeout(() => {
  //       navigate(`${ROUTE_PATH.WAREHOUSE_RE_INSPECTION_STANDARD}`, {
  // state: {
  //   details: {
  //     // view: true,
  //     id: result?.data?.id || 0,
  //   },
  // },
  //       });
  //     }, 1500);
  //     // }
  //     console.log(result);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     let errorMessage =
  //       error?.data?.data ||
  //       error?.data?.message ||
  //       error?.data ||
  //       "ReInspection Request Failed.";
  //     console.log("Error:", errorMessage);
  //     toasterAlert({
  //       message: JSON.stringify(errorMessage),
  //       status: 440,
  //     });
  //   }
  // };

  const ReInspectionFunction = () => {
    if (
      selectedData.bank === "" ||
      selectedData.branch === "" ||
      selectedData.inspectionType === "" ||
      selectedData.warehouse === "" ||
      (selectedData.inspectionType === "chamber_wise" &&
        selectedData.chamber === "")
    ) {
      toasterAlert({
        message: "Please Fill all Relative Data",
        status: 440,
      });
      return;
    } else {
      // console.log(selectedData, "selectedData");
      // if (selectedData.inspectionType === "chamber_wise") {
      //   createTeInspectionFunction({
      //     warehouse: selectedData.warehouse,
      //     bank: selectedData.bank,
      //     branch: selectedData.branch,
      //     is_chamberwise: true,
      //     chamber: selectedData.chamber,
      //   });
      // } else {
      //   createTeInspectionFunction({
      //     warehouse: selectedData.warehouse,
      //     bank: selectedData.bank,
      //     branch: selectedData.branch,
      //     is_chamberwise: false,
      //   });
      // }
      // return;
      navigate(`${ROUTE_PATH.WAREHOUSE_RE_INSPECTION_STANDARD}`, {
        state: {
          reInpectionData: selectedData,
        },
      });
    }
  };

  useEffect(() => {
    getBankMasterList();
    getBranchMasterList();
    getChamberMasterList();
  }, []);

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
            // loading={getCommodityTypeMasterApiIsLoading}
            // addForm={() => addForm()}
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
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        size="2xl"
        onClose={() => {
          onClose();
          setSelectedData({
            bank: "",
            branch: "",
            inspectionType: "",
            warehouse: "",
            chamber: "",
          });
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Warehouse Re Inspection Process</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid
              textAlign="left"
              alignItems="start"
              my="3"
              templateColumns="repeat(2, 1fr)"
              gap={5}
            >
              <GridItem>
                <Text textAlign="left">Select bank name* </Text>{" "}
                <ReactSelect
                  name="selectBank"
                  // bydefault select gogreen  and filter the data for the values ..
                  value={
                    selectBoxOptions?.banks?.filter(
                      (item) => item.value === selectedData.bank
                    )?.[0] || {}
                  }
                  // on change call the api to fetch the branches
                  onChange={(val) => {
                    setSelectedData((old) => ({
                      ...old,
                      bank: val.value,
                      branch: "",
                    }));
                  }}
                  isLoading={getBankMasterApiIsLoading}
                  options={selectBoxOptions?.banks || []}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      padding: "1px",
                      textAlign: "left",
                    }),
                    ...reactSelectStyle,
                  }}
                />
              </GridItem>
              <GridItem>
                <Text textAlign="left">Select branch name* </Text>{" "}
                <ReactSelect
                  name="selectBranch"
                  value={
                    selectBoxOptions?.branch?.filter(
                      (item) => item.value === selectedData.branch
                    )?.[0] || {}
                  }
                  onChange={(val) => {
                    setSelectedData((old) => ({
                      ...old,
                      branch: val.value,
                    }));
                  }}
                  options={
                    selectBoxOptions?.branch?.filter(
                      (item) => item?.bank?.id === selectedData.bank
                    ) || []
                  }
                  isLoading={getBankBranchMasterApiIsLoading}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      padding: "1px",
                      textAlign: "left",
                    }),
                    ...reactSelectStyle,
                  }}
                />
              </GridItem>
              <GridItem>
                <Text textAlign="left">Select Inspection type* </Text>{" "}
                <ReactSelect
                  name="selectInspectionType"
                  value={
                    SELECT_INSPECTION_TYPE?.filter(
                      (item) => item.value === selectedData.inspectionType
                    )?.[0] || {}
                  }
                  onChange={(val) => {
                    setSelectedData((old) => ({
                      ...old,
                      inspectionType: val.value,
                      chamber: "",
                    }));
                  }}
                  options={SELECT_INSPECTION_TYPE || []}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      padding: "1px",
                      textAlign: "left",
                    }),
                    ...reactSelectStyle,
                  }}
                />
              </GridItem>

              {selectedData.inspectionType === "chamber_wise" ? (
                <GridItem>
                  <Text textAlign="left">Select Chamber Name* </Text>{" "}
                  <ReactSelect
                    name="selectChamberName"
                    value={
                      selectBoxOptions?.chamber?.filter(
                        (item) => item.value === selectedData.chamber
                      )?.[0] || {}
                    }
                    onChange={(val) => {
                      setSelectedData((old) => ({
                        ...old,
                        chamber: val.value,
                      }));
                    }}
                    isLoading={getChamberApiIsLoading}
                    options={
                      selectBoxOptions?.chamber?.filter(
                        (item) => item?.warehouse === selectedData.warehouse
                      ) || []
                    }
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        // borderColor: clientError.clientType ? "red" : "#c3c3c3",
                        padding: "1px",
                        textAlign: "left",
                      }),
                      ...reactSelectStyle,
                    }}
                  />
                </GridItem>
              ) : (
                <></>
              )}
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              backgroundColor={"primary.700"}
              _hover={{ backgroundColor: "primary.700" }}
              color={"white"}
              borderRadius={"full"}
              type="button"
              onClick={() => {
                // ImageDelete();
                // onClose();
                ReInspectionFunction();
              }}
            >
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmationModal
        isConfirmationModalIsOpen={isConfirmationModalIsOpen}
        isConfirmationModalOnOpen={isConfirmationModalOnOpen}
        isConfirmationModalOnClose={isConfirmationModalOnClose}
        // setIsRenewalApiCall={setIsRenewalApiCall}
        callRenewalApi={callRenewalApi}
      />
    </>
  );
}

export default WareHouseMaster;

function ConfirmationModal({
  isConfirmationModalIsOpen,
  isConfirmationModalOnOpen,
  isConfirmationModalOnClose,
  setIsRenewalApiCall,
  callRenewalApi,
}) {
  const apiCall = () => {
    callRenewalApi();
    // setIsRenewalApiCall(true);
  };

  return (
    <>
      {/* <Button onClick={isConfirmationModalOnOpen}>Open Modal</Button> */}

      <Modal
        isOpen={isConfirmationModalIsOpen}
        onClose={isConfirmationModalOnClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agreement renewal confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box fontSize="lg" fontWeight="bold" as="h3">
              Do you want to renew warehouse agreement ?
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={() => apiCall()}>
              Yes
            </Button>
            <Button
              // colorScheme="primary.700"
              bg="primary.700"
              _hover={{}}
              mr={3}
              color="white"
              onClick={isConfirmationModalOnClose}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
