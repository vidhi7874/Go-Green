import {
  Box,
  Grid,
  Table,
  Text,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Checkbox,
  Input,
} from "@chakra-ui/react";
import * as yup from "yup";

// import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MotionSlideUp } from "../../utils/animation";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomInput from "../../components/Elements/CustomInput";
// import CustomDatepicker from "../../components/Elements/CustomDatepicker";
import { useFetchLocationDrillDownMutation } from "../../features/warehouse-proposal.slice";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetSecurityAgencyMasterMutation,
  useGetSecurityGuardMasterMutation,
  useGetSecurityGuardTransferHistoryFreeMutation,
  useGetSecurityGuardTransferListParamFreeMutation,
  // useGetSecurityGuardTransferListMutation,
  useGetSecurityGuardTransferListParamMutation,
  useGetSecurityGuardTransferMutation,
  useTransferSecurityGuardMutation,
} from "../../features/master-api-slice";
// import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import ROUTE_PATH from "../../constants/ROUTE";

const schema = yup.object().shape({
  region: yup.string().trim().required(" "),
  state: yup.string().trim().required(" "),
  district: yup.string().trim().required(" "),
  substate: yup.string().trim().required(" "),
  area: yup.string().trim().required("").typeError(),
  security_agency_name: yup
    .string()
    .trim()
    .required(() => null)
    .typeError(),
  from_security_guard: yup
    .string()
    .trim()
    .required(() => null)
    .typeError(),
  to_agency: yup
    .string()
    .trim()
    .required(() => null)
    .typeError(""),
  to_security_guard: yup
    .string()
    .trim()
    .required(() => null)
    .typeError(""),
  date_of_transfer: yup
    .date()
    .required(() => null)
    .typeError(),
});

function SecurityGuardTransfer() {
  const navigation = useNavigate();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: true, // Set is_active to true by default
    },
  });
  const [tableData, setTableData] = useState([]);
  // const [locationDrillDownState, setLocationDrillDownState] = useState({});
  const [transferListsIds, setTransferListsIds] = useState([]);
  const [warehouseIds, setWarehouseIds] = useState([]);
  const location = useLocation();

  const {
    setValue,
    getValues,
    // eslint-disable-next-line
    formState: { errors },
  } = methods;

  // These is for the date function start
  function getTomorrowDate() {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Add 1 day to get tomorrow's date
    const tomorrowDate = today.toISOString().split("T")[0];
    return tomorrowDate;
  }
  // These is for the date function end
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    substate: [],
    districts: [],
    states: [],
    areas: [],
    agencyList: [],
    guardList: [],
    guardTwoList: [],
  });

  // Initialize the toast object
  const onSubmit = async () => {
    const fromSecurityGuardId = getValues("from_security_guard");
    const toSecurityGuardId = getValues("to_security_guard");

    if (fromSecurityGuardId === toSecurityGuardId) {
      // Display an error message indicating the same security guard cannot be assigned for both "From" and "To"
      toast.error(
        "The same security guard cannot be assigned please select different"
      );
    } else if (transferListsIds.length > 0) {
      // Proceed with the submission
      console.log(transferListsIds);
      console.log(warehouseIds);
      let obj = {
        warehouses: warehouseIds,
        date_of_transfer: getValues("date_of_transfer"),
        from_security_guard: fromSecurityGuardId,
        to_security_guard: toSecurityGuardId,
      };

      console.log(obj);

      try {
        const res = await transferSecurityGuard(obj).unwrap();
        if (res?.status === 200) {
          toast.success("Transferred Succesfully");
          setTimeout(() => {
            // window.location.reload();
            navigation(
              `${ROUTE_PATH.ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_TRANSFER_LIST}`
            );
            // navigate("/hiring-proposal-master");
          }, 1500);
        }
        console.log("fetchLocationDrillDown response:", res);
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred during submission.");
      }
    } else {
      // No item is selected, display an error message in a toast
      toast.error("Please select at least one item before submitting.");
    }
  };

  let details = location.state?.details;
  console.log("details ---> ", details);

  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownMutation();

  const [
    getSecurityGuardTypeMaster,
    { isLoading: getSecurityGuardTypeMasterApiIsLoading },
  ] = useGetSecurityGuardTransferMutation();

  // warehouse/security_guard_transfer/

  // ! commented the un used rtk hook data ..
  const [
    // getSecurityAgencyMaster,
    { isLoading: getSecurityAgencyMasterApiIsLoading },
  ] = useGetSecurityAgencyMasterMutation();

  const [getSecurityGuardTranferParamFree] =
    useGetSecurityGuardTransferListParamFreeMutation();

  const [getSecurityGuardTranferParam] =
    useGetSecurityGuardTransferListParamMutation();

  const [getSecurityGuardHistoryParam] =
    useGetSecurityGuardTransferHistoryFreeMutation();

  const [
    // getSecurityGuardMaster,
    { isLoading: getSecurityGuardMasterApiIsLoading },
  ] = useGetSecurityGuardMasterMutation();

  const [
    transferSecurityGuard,
    // { isLoading: transferSecurityGuardIsLoading }
  ] = useTransferSecurityGuardMutation();

  const getRegionMasterList = async () => {
    try {
      const response = await fetchLocationDrillDown().unwrap();
      console.log("getRegionMasterList:", response);

      const arr = response?.region
        ?.filter((item) => item.region_name !== "ALL - Region")
        .map(({ region_name, id }) => ({
          label: region_name,
          value: id,
        }));

      if (details?.region?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          regions: [
            ...arr,
            {
              label: details?.region?.region_name,
              value: details?.region?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          regions: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const regionOnChange = async (val) => {
    console.log("value --> ", val);
    setValue("region", val?.value, {
      shouldValidate: true,
    });
    setValue("state", null, {
      shouldValidate: false,
    });

    setValue("substate", null, {
      shouldValidate: false,
    });

    setValue("district", null, {
      shouldValidate: false,
    });

    const query = {
      region: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      console.log("fetchLocationDrillDown response :", response);

      const arr = response?.state
        ?.filter((item) => item.state_name !== "All - State")
        .map(({ state_name, id }) => ({
          label: state_name,
          value: id,
        }));
      if (details?.district?.substate?.state?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          states: [
            ...arr,
            {
              label: details?.district?.substate?.state?.state_name,
              value: details?.district?.substate?.state?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          states: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stateOnChange = async (val) => {
    console.log("value --> ", val);
    setValue("state", val?.value, {
      shouldValidate: true,
    });

    setValue("substate", null, {
      shouldValidate: false,
    });

    setValue("district", null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues("region"),
      state: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      console.log("fetchLocationDrillDown response :", response);

      const arr = response?.substate
        ?.filter((item) => item.substate_name !== "All - Zone")
        .map(({ substate_name, id }) => ({
          label: substate_name,
          value: id,
        }));
      if (details?.district?.substate?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          substate: [
            ...arr,
            {
              label: details?.district?.substate?.substate_name,
              value: details?.district?.substate?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          substate: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const zoneOnChange = async (val) => {
    console.log("value --> ", val);
    setValue("substate", val?.value, {
      shouldValidate: true,
    });

    setValue("district", null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues("region"),
      state: getValues("state"),
      substate: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      console.log("fetchLocationDrillDown response :", response);

      const arr = response?.district
        ?.filter((item) => item.district_name !== "All - District")
        .map(({ district_name, id }) => ({
          label: district_name,
          value: id,
        }));
      if (details?.district?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          districts: [
            ...arr,
            {
              label: details?.district?.district_name,
              value: details?.district?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          districts: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const districtOnChange = async (val) => {
    console.log("value --> ", val);
    setValue("district", val?.value, {
      shouldValidate: true,
    });

    setValue("area", null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues("region"),
      state: getValues("state"),
      substate: getValues("substate"),
      district: val?.value,
    };

    console.log("query", query);

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      console.log("fetchLocationDrillDown response :", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        areas: response?.area
          ?.filter((item) => item.area_name !== "All - District")
          .map(({ area_name, id }) => ({
            label: area_name,
            value: id,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const areaOnChange = async (val) => {
    setValue("area", val?.value, {
      shouldValidate: true,
    });

    const query = {
      filter: "from_security_agency__area__id",
      from_security_agency__area__id: val?.value,
    };

    try {
      const response = await getSecurityGuardTranferParamFree({
        id: val?.value,
      }).unwrap();
      console.log("responseFrom", response);
      if (response?.status === 200) {
        let list = response?.data?.map((el) => ({
          label: el.security_agency_name,
          value: el.id,
        }));

        setSelectBoxOptions((prev) => ({
          ...prev,
          agencyList: list,
        }));
      }
    } catch (error) {
      console.log("Error: " + error);
    }

    console.log(query);
  };

  const fromAgencyOnChange = async (val) => {
    setValue("security_agency_name", val.value, {
      shouldValidate: true,
    });

    const query = {
      "?security_agency": val?.value,
    };
    try {
      const response = await getSecurityGuardTranferParam({
        id: val?.value,
      }).unwrap();
      console.log(response);
      if (response?.status === 200) {
        let list = response.data.map((el) => ({
          label: el?.security_guard_name,
          value: el?.id,
        }));
        console.log(list);
        setSelectBoxOptions((prev) => ({
          ...prev,
          guardList: list,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toAgencyOnChange = async (val) => {
    setValue("to_agency", val.value, {
      shouldValidate: true,
    });

    const query = {
      "?security_agency": val?.value,
    };
    try {
      const response = await getSecurityGuardTranferParam({
        id: val?.value,
      }).unwrap();
      console.log(response);
      if (response?.status === 200) {
        let list = response.data.map((el) => ({
          label: el.security_guard_name,
          value: el.id,
        }));
        console.log(list);
        setSelectBoxOptions((prev) => ({
          ...prev,
          guardTwoList: list,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [transferedData, setTransferData] = useState([]);

  const fromSecurityGuardOnChange = async (val) => {
    console.log("fromSecurityGuardOnChange called with value:", val);
    setValue("from_security_guard", val.value, {
      shouldValidate: true,
    });

    const query = {
      filter: "from_security_guard__id",
      from_security_guard__id: val?.value,
    };

    try {
      const response = await getSecurityGuardHistoryParam({
        id: val?.value,
      }).unwrap();
      console.log("API Response:", response);
      // if (response?.status === 200) {
      setTableData(response?.data || []);
      setTransferData(response?.excluded_data || []);
      console.log("Table Data updated:", response);
      // excluded_data
      // }
    } catch (error) {
      console.error("API Request Error:", error);
    }
  };

  const getFromSecurityAgency = async () => {
    try {
      const response = await getSecurityGuardTypeMaster().unwrap();
      console.log("responseFrom", response);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const onCheck = (e, id, itemId, warehouseId) => {
    let isChecked = e.target.checked;
    console.log(warehouseId);

    if (isChecked) {
      setTransferListsIds((prevIds) => [...prevIds, itemId]);
      setWarehouseIds((prevIds) => [...prevIds, warehouseId]);

      // You can also set the warehouse ID in a separate state or do whatever you need with it.
    } else {
      setTransferListsIds((prevIds) =>
        prevIds.filter((prevId) => prevId !== itemId)
      );
      setWarehouseIds((prevIds) =>
        prevIds.filter((prevId) => prevId !== warehouseId)
      );

      // setTransferData((old) => [...old, ...tableData[id]]);
      // Handle the removal of the warehouse ID if needed.
    }
  };

  // ! commented the un used function ..
  // const getFromSecurityGuard = async () => {
  //   try {
  //     const response = await getSecurityGuardTypeMaster().unwrap();
  //     console.log("responseFrom", response);
  //   } catch (error) {
  //     console.log("Error: " + error);
  //   }
  // };

  useEffect(() => {
    getRegionMasterList();
    getFromSecurityAgency();
    // eslint-disable-next-line
  }, []);

  return (
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
            <Box>
              {" "}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Region <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="region"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.regions || []}
                      selectedValue={
                        selectBoxOptions?.regions?.filter(
                          (item) => item.value === getValues("region")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        regionOnChange(val);
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      State <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="state"
                      options={selectBoxOptions?.states || []}
                      selectedValue={
                        selectBoxOptions?.states?.filter(
                          (item) => item.value === getValues("state")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        stateOnChange(val);
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Sub State <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="substate"
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.substate || []}
                      selectedValue={
                        selectBoxOptions?.substate?.filter(
                          (item) => item.value === getValues("substate")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        zoneOnChange(val);
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      District <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="district"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.districts || []}
                      selectedValue={
                        selectBoxOptions?.districts?.filter(
                          (item) => item.value === getValues("district")
                        )[0] || {}
                      }
                      isClearable={false}
                      handleOnChange={(val) => {
                        districtOnChange(val);
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Area <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="area"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.areas || []}
                      selectedValue={
                        selectBoxOptions?.areas?.filter(
                          (item) => item.value === getValues("area")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        areaOnChange(val);
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>
              <Box>
                <Grid
                  // gap={4}
                  templateColumns={"repeat(2, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(2, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">
                          From Agency <span style={{ color: "red" }}>*</span>
                        </Text>
                        <ReactCustomSelect
                          name="security_agency_name"
                          label=""
                          isLoading={getSecurityAgencyMasterApiIsLoading}
                          options={selectBoxOptions?.agencyList || []}
                          selectedValue={
                            selectBoxOptions?.agencyList?.filter(
                              (item) =>
                                item.value === getValues("security_agency_name")
                            )[0] || {}
                          }
                          isClearable={false}
                          selectType="label"
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                          handleOnChange={(val) => fromAgencyOnChange(val)}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(2, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">
                          From security guard{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Text>
                        <ReactCustomSelect
                          name="from_security_guard"
                          label=""
                          isLoading={getSecurityGuardMasterApiIsLoading}
                          options={selectBoxOptions?.guardList || []}
                          selectedValue={
                            selectBoxOptions?.guardList?.filter(
                              (item) =>
                                item.value === getValues("from_security_guard")
                            )[0] || {}
                          }
                          isClearable={false}
                          selectType="label"
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                          handleOnChange={(val) =>
                            fromSecurityGuardOnChange(val)
                          }
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>
                </Grid>
              </Box>
              <Box>
                <Grid
                  // gap={4}
                  templateColumns={"repeat(2, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(2, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">
                          To Agency <span style={{ color: "red" }}>*</span>
                        </Text>
                        <ReactCustomSelect
                          name="to_agency"
                          label=""
                          isLoading={getSecurityGuardMasterApiIsLoading}
                          options={selectBoxOptions?.agencyList || []}
                          selectedValue={
                            selectBoxOptions?.agencyList?.filter(
                              (item) => item.value === getValues("to_agency")
                            )[0] || {}
                          }
                          isClearable={false}
                          selectType="label"
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                          handleOnChange={(val) => toAgencyOnChange(val)}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(2, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">
                          To security guard
                          <span style={{ color: "red" }}>*</span>
                        </Text>
                        <ReactCustomSelect
                          name="to_security_guard"
                          label=""
                          isLoading={getSecurityGuardMasterApiIsLoading}
                          options={selectBoxOptions?.guardTwoList || []}
                          selectedValue={
                            selectBoxOptions?.guardTwoList?.filter(
                              (item) =>
                                item.value === getValues("to_security_guard")
                            )[0] || {}
                          }
                          isClearable={false}
                          selectType="label"
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                          handleOnChange={(val) => {
                            setValue("to_security_guard", val.value, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>
                </Grid>
              </Box>
              <Box mt="6">
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">
                    From Security Guard Data{" "}
                    <span style={{ color: "red" }}>*</span> :
                  </Text>
                </Grid>
              </Box>
              <Box mt="6">
                <TableContainer border={"none"}>
                  <Table variant="simple">
                    <Thead backgroundColor={"aqua.100"}>
                      <Tr textAlign={"center"}>
                        <Th textAlign={"center"} border={"none"} color="#000">
                          Sr no
                        </Th>
                        <Th textAlign={"center"} border={"none"} color="#000">
                          Warehouse name
                        </Th>
                        <Th textAlign={"center"} border={"none"} color="#000">
                          Security guard name
                        </Th>
                        <Th textAlign={"center"} border={"none"} color="#000">
                          Start date
                        </Th>
                        <Th textAlign={"center"} border={"none"} color="#000">
                          Status{" "}
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {tableData?.length === 0 && (
                        <Tr textAlign={"center"}>
                          <Td textAlign="center"></Td>
                          <Td textAlign="center"></Td>
                          <Td textAlign="center">No data found</Td>
                          <Td textAlign="center"></Td>
                          <Td textAlign="center"></Td>
                        </Tr>
                      )}

                      {tableData?.length === 0 &&
                        getSecurityGuardTypeMasterApiIsLoading && (
                          <Tr textAlign={"center"}>
                            <Td textAlign="center"></Td>
                            <Td textAlign="center"></Td>
                            <Td textAlign="center">Loading...</Td>
                            <Td textAlign="center"></Td>
                            <Td textAlign="center"></Td>
                          </Tr>
                        )}
                      {tableData?.length > 0 &&
                        tableData?.map((item, ind) => (
                          <Tr key={`table_${ind}`} textAlign={"center"}>
                            <Td>
                              <Checkbox
                                // defaultChecked
                                border={"1px grey"}
                                colorScheme="CheckBoxPrimary"
                                size="lg"
                                onChange={(e) =>
                                  onCheck(e, ind, item.id, item.warehouse?.id)
                                }
                              >
                                {ind + 1}
                              </Checkbox>
                            </Td>
                            {/* <Td textAlign={"center"}>
                                {item.warehouse?.id}
                              </Td> */}
                            <Td textAlign={"center"}>
                              {item.warehouse?.warehouse_name}
                            </Td>
                            <Td textAlign={"center"}>
                              {item?.to_security_guard?.security_guard_name}-
                              {item?.to_security_guard?.shift_availability}
                            </Td>
                            <Td textAlign={"center"}>{item.start_date}</Td>
                            <Td textColor={"primary.700"} textAlign={"center"}>
                              {item.status}
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
              <Box mt="6">
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">
                    From Security Guard Not Transferable Data
                    <span style={{ color: "red" }}>*</span> :
                  </Text>
                </Grid>
              </Box>
              <Box mt="6">
                <TableContainer border={"none"}>
                  <Table variant="simple">
                    <Thead backgroundColor={"aqua.100"}>
                      <Tr textAlign={"center"}>
                        <Th textAlign={"center"} border={"none"} color="#000">
                          Sr no
                        </Th>
                        <Th textAlign={"center"} border={"none"} color="#000">
                          Warehouse name
                        </Th>
                        <Th textAlign={"center"} border={"none"} color="#000">
                          Security guard name
                        </Th>
                        <Th textAlign={"center"} border={"none"} color="#000">
                          Start date
                        </Th>
                        <Th textAlign={"center"} border={"none"} color="#000">
                          Status{" "}
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {transferedData?.length === 0 && (
                        <Tr textAlign={"center"}>
                          <Td textAlign="center"></Td>
                          <Td textAlign="center"></Td>
                          <Td textAlign="center">No data found</Td>
                          <Td textAlign="center"></Td>
                          <Td textAlign="center"></Td>
                        </Tr>
                      )}

                      {transferedData?.length === 0 &&
                        getSecurityGuardTypeMasterApiIsLoading && (
                          <Tr textAlign={"center"}>
                            <Td textAlign="center"></Td>
                            <Td textAlign="center"></Td>
                            <Td textAlign="center">Loading...</Td>
                            <Td textAlign="center"></Td>
                            <Td textAlign="center"></Td>
                          </Tr>
                        )}
                      {transferedData?.length > 0 &&
                        transferedData?.map((item, ind) => (
                          <Tr key={`table_${ind}`} textAlign={"center"}>
                            <Td>{ind + 1}</Td>
                            {/* <Td textAlign={"center"}>
                                {item.warehouse?.id}
                              </Td> */}
                            <Td textAlign={"center"}>
                              {item.warehouse?.warehouse_name}
                            </Td>
                            <Td textAlign={"center"}>
                              {item?.to_security_guard?.security_guard_name}-
                              {item?.to_security_guard?.shift_availability}
                            </Td>
                            <Td textAlign={"center"}>{item.start_date}</Td>
                            <Td textColor={"primary.700"} textAlign={"center"}>
                              Active
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Date of transfer <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      type="date"
                      name="date_of_transfer"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      min={getTomorrowDate()}
                      value="" // Set an empty value to prevent autofilling
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>
            </Box>

            <Box
              display="flex"
              gap={2}
              justifyContent="flex-end"
              mt="10"
              px="0"
            >
              <Button
                type="submit"
                //w="full"
                backgroundColor={"primary.700"}
                _hover={{ backgroundColor: "primary.700" }}
                color={"white"}
                borderRadius={"full"}
                // my={"4"}
                px={"10"}
              >
                Transfer
              </Button>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}

export default SecurityGuardTransfer;

// ! commented un used the toast function ..
// const toasterAlert = (obj) => {
//   let msg = obj?.message;
//   let status = obj?.status;
//   if (status === 400) {
//     const errorData = obj.data;
//     let errorMessage = "";

//     Object.keys(errorData).forEach((key) => {
//       const messages = errorData[key];
//       messages.forEach((message) => {
//         errorMessage += `${key} : ${message} \n`;
//       });
//     });
//     showToastByStatusCode(status, errorMessage);
//     return false;
//   }
//   showToastByStatusCode(status, msg);
// };
