import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// import { useUpdateWareHouseClientMutation } from "../../features/master-api-slice";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { schema } from "./field";
import { BsEye } from "react-icons/bs";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import { useGetMarketRateMutation } from "../../features/cir.slice";

import {
  useGetCORGatepassMutation,
  useCreateCORMutation,
  useFetchCORMutation,
  useUpdateCORMutation,
  useCorAssignApproveRejectMutation,
  // useGetCORGatePassMutation,
} from "../../features/cor.slice";
import CustomSign from "../../components/Elements/CustomSign";
import {
  CommonToasterAlert,
  enterFullScreen,
} from "../../services/common.service";
import ROUTE_PATH from "../../constants/ROUTE";
import configuration from "../../config/configuration";
import { localStorageService } from "../../services/localStorge.service";

export default function AddEditCommodityOutwardReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [rejectReason, setRejectReason] = useState("");

  const loginData = localStorageService.get("GG_ADMIN");

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      spilage_bag_count: 0,
      supervisor_name: loginData?.userDetails?.id || 0,
    },
  });

  const {
    setValue,
    register,
    getValues,
    setError,
    formState: { errors },
  } = methods;

  const details = location?.state?.details;
  console.log("on edit details -->", details.status);
  // eslint-disable-next-line

  console.log("errors", errors);
  // Css code Start
  const reactSelectStyle = {
    menu: (base) => ({
      ...base,
      // backgroundColor: "#A6CE39",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#A6CE39" : "white",
      color: state.isFocused ? "green" : "black",
      textAlign: "left",
      "&:hover": {
        //  backgroundColor: "#C2DE8C",
        color: "black",
      },
    }),
  };

  const commonStyle = {
    _placeholder: { color: "gray.300" },
    _hover: {
      borderColor: "primary.700",
      backgroundColor: "primary.200",
    },
    _focus: {
      borderColor: "primary.700",
      backgroundColor: "primary.200",
      boxShadow: "none",
    },
  };

  const templateColumns = {
    base: "repeat(1, 1fr)",
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
  };

  const commonWidth = {
    mt: 2,
    w: {
      base: "100%",
      sm: "80%",
      md: "60%",
      lg: "55%",
    },
    comm_details_style: {
      w: "90%",
    },
  };

  const [warehouse, setWarehouse] = useState({});
  const [chamber, setChamber] = useState({});
  const [client, setClient] = useState({});
  const [commodity, setCommodity] = useState({});
  const [commodityVariety, setCommodityVariety] = useState({});
  const [serviceContract, setServiceContract] = useState({});
  const [supervisor, setSupervisor] = useState({});
  const [selectedGatePass, setSelectedGatePass] = useState([]);
  const [total_nu_of_bag, setTotal_nu_of_bag] = useState(0);

  const [dataState, setDataState] = useState({});
  const [gatePassList, setGatePassList] = useState([]);
  const [policyNoList, setPolicyNoList] = useState({
    fire_policy_list: [],
    burglary_policy_list: [],
  });
  const [insuranceDetailsList, setInsuranceDetailsList] = useState([]);
  const [insuranceDetailsEditState, setInsuranceDetailsEditState] = useState({
    isEdit: false,
    index: null,
  });
  const [getMarketRate] = useGetMarketRateMutation();
  const [userStatus, setUserStatus] = useState(0);

  const [fetchCOR] = useFetchCORMutation();

  const [cirAssignApproveReject] = useCorAssignApproveRejectMutation();
  const [createCOR, { isLoading: createCORApiIsLoading }] =
    useCreateCORMutation();

  const [getCORGatepass] = useGetCORGatepassMutation();

  const [updateCOR, { isLoading: updateCORApiIsLoading }] =
    useUpdateCORMutation();

  function InputDisableFunction() {
    const isViewOnly = location?.state?.isViewOnly || false;

    const userDetails = localStorageService.get("GG_ADMIN");

    if (isViewOnly) {
      return true;
    } else {
      if (dataState?.l1_user?.id === undefined) {
        return false;
      }

      if (userStatus > -2) {
        if (userStatus === 0) {
          if (dataState?.l1_user?.id === userDetails?.userDetails?.id) {
            return false;
          } else {
            return true;
          }
        } else if (userStatus === 1) {
          return true;
        } else if (userStatus === 2) {
          if (dataState?.l2_user?.id === userDetails?.userDetails?.id) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      } else {
        console.log(userStatus, "tempFlag");
        return true;
      }
    }
  }

  const fetchMarketRate = async (queryParams) => {
    try {
      console.log(queryParams);
      const response = await getMarketRate(queryParams).unwrap();
      console.log(response, "fetchMarketRate");
      if (response?.status === 200) {
        const market_rate_value = response?.data?.[0]?.modal_price || 0;
        setValue("market_rate", market_rate_value, {
          shouldValidate: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const assignApproveRejectToMeFunction = async (obj) => {
    const { type, reasons } = obj;

    const data = {
      id: details?.cor__id?.id,
      status: type,
      reasons: reasons || null,
    };

    try {
      const response = await cirAssignApproveReject(data).unwrap();
      console.log("response --> ", response);
      if (response?.status === 200) {
        // assigned
        toasterAlert({
          message: `cor ${type} Successfully`,
          status: 200,
        });
        // navigate("/commodity-outward-report");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const fetchCORById = async (param) => {
    try {
      console.log(param);
      const response = await fetchCOR({ cor_id: param?.cor_id });
      console.log(response.data);
      console.log(response?.data?.cor_data?.client_mobile_no);
      setUserStatus(response?.data?.status?.status_code);
      setDataState(response?.data?.cor_data);

      const data_obj = {
        client_rep_name: response?.data?.cor_data?.client_rep_name,
        client_mobile_no: response?.data?.cor_data?.client_mobile_no,
        client_signature: response?.data?.cor_data?.client_signature,
        client_id_proof_path: response?.data?.cor_data?.client_id_proof_path,
        authority_letter_path: response?.data?.cor_data?.authority_letter_path,
        spilage_bag_count: response?.data?.cor_data?.spilage_bag_count,
        remarks: response?.data?.cor_data?.remarks,
      };

      Object.keys(data_obj).forEach((key) => {
        setValue(key, data_obj[key], {
          shouldValidate: true,
        });
      });
      console.log(response?.data?.cor_data?.total_bags);
      let bag_count = Number(data_obj?.spilage_bag_count);
      let total_bags = Number(response?.data?.cor_data?.total_bags);
      if (bag_count > total_bags) {
        // console.log("skdfl");
        setError("spilage_bag_count", {
          type: "focus",
          message: "Spillage bag count must be less than total bags",
        });
      }

      setGatePassList(response?.data?.cor_data?.outward_gatepass || []);
      response?.data?.cor_data?.outward_gatepass?.forEach((el, index) => {
        GatePassSelectLogic(index);
      });
    } catch (error) {
      console.log(error);
      CommonToasterAlert(error);
    }
  };

  const gatePassFreeList = async () => {
    console.log(details);
    console.log("dddddddddddddd", details?.cor__id?.id);
    try {
      const filter = {
        chamber: details?.chamber?.id || null,
        client: details?.client?.id || null,
        cor__id: details?.cor__id?.id || null,
        commodity_variety: details?.commodity_variety?.id || null,
        service_contract__storage_rate_on:
          details?.service_contract__storage_rate_on === "bag" ? "bag" : null,
        service_contract__contractcommodity__bag_size__bag_size:
          details?.service_contract__contractcommodity__bag_size__bag_size ||
          null,
        warehouse: details?.warehouse?.id || null,
        commodity: details?.commodity?.id || null,
        cor_status: details?.gate_pass_status,
        // gate_pass_status: details?.gate_pass_status,
      };

      console.log(filter);

      const response = await getCORGatepass(
        Object.fromEntries(
          Object.entries(filter).filter(([key, value]) => value !== null)
        )
      ).unwrap();

      if (response?.status === 200) {
        setGatePassList(response?.data || []);
        console.log("gatePassFreeList", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GatePassSelectLogic = (index) => {
    console.log("gatePass", index);
    if (selectedGatePass?.filter((item) => item === index)?.length > 0) {
      setSelectedGatePass(selectedGatePass?.filter((item) => item !== index));
    } else {
      setSelectedGatePass((old) => [...old, index]);
    }
  };

  const onSubmit = (data) => {
    console.log(insuranceDetailsList);
    console.log("data==>", data);

    let total_bags = Number(data?.total_bags);
    let bag_count = Number(data?.spilage_bag_count);

    if (bag_count > total_bags) {
      setError("spilage_bag_count", {
        type: "manual",
        message: "Spillage bag count must be less than total bags",
      });
      return false;
    }

    console.log(details?.cor__id);

    if (details?.cor__id?.cor_no) {
      console.log("test");

      // let cir_insurance_detail = [
      //   {
      //     id: 3,
      //     policy_type: "fire",
      //     policy_end_date: "2023-11-07",
      //     insurance_consume_ammount: "44.00",
      //     insurance_policy: 127,
      //   },
      // ];

      // const isValid = calculateInsuranceValue();
      // console.log(isValid);

      // if (!isValid) {
      //   return false;
      // }

      // const cir_insurance_detail = insuranceDetailsList?.map((el) => ({
      //   id: el?.id,
      //   policy_type: el?.policy_type?.value,
      //   policy_end_date: moment(el?.valid_up_to).format("YYYY-MM-DD"),
      //   insurance_consume_ammount: el?.amount,
      //   insurance_policy: el?.policy_no?.value,
      // }));

      let final_data_obj = {};

      if (details?.cor__id) {
        console.log(details?.cor__id);
        final_data_obj = {
          ...data,
          id: details.cor__id?.id,
          client_mobile_no: data.client_mobile_no,
        };
      } else {
        console.log(details?.cor__id);

        final_data_obj = {
          ...data,
          id: details.cor__id?.id,
          client_mobile_no: "+91" + data.client_mobile_no,
        };
      }

      // alert("if");

      console.log(final_data_obj);
      updateData(final_data_obj);
    } else {
      // alert("else");

      console.log("test");

      addData({
        ...data,
        client_mobile_no: "+91" + data.client_mobile_no,
      });
    }
  };

  const addData = async (data) => {
    try {
      if (selectedGatePass.length > 0) {
        const tempArray = gatePassList
          .filter((item, index) => selectedGatePass.includes(index))
          .map((item) => item.id);

        const finalData = { ...data, gatepass: tempArray, is_draft: false };

        const response = await createCOR(finalData).unwrap();
        console.log("add cor res", response);
        if (response.status === 201) {
          toasterAlert(response);
          navigate("/commodity-outward-report");
        }
      } else {
        toasterAlert({
          message: "Please Select GatePass",
          status: 440,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "cor Creation Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const updateData = async (data) => {
    try {
      // return false;
      const response = await updateCOR(data).unwrap();
      if (response.status === 200) {
        console.log("update Commodity Inward Report res", response);
        toasterAlert(response);
        navigate("/commodity-outward-report");
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
      console.error("Error:", error);
      toasterAlert(error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "cor Creation Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Edit Form Fill Logic Start

  useEffect(() => {
    console.log(details, "details");
    if (location?.state?.stage === 1) {
      let obj = {
        warehouse: details?.warehouse?.id,
        chamber: details?.chamber?.id,
        commodity: details?.commodity?.id,
        commodity_variety: details?.commodity_variety?.id,
        client: details?.client?.id,
        service_contract_no: details?.service_contract?.id,
      };

      let queryParams = {
        commodity_id: obj?.commodity,
        commodity_variety_id: obj?.commodity_variety,
        district_id: details?.warehouse?.district?.id,
      };
      fetchMarketRate(queryParams);

      console.log(obj);

      console.log("details", details);
      console.log(details?.warehouse);
      setWarehouse(details?.warehouse);
      setChamber(details?.chamber);
      setClient(details?.client);
      setCommodity(details?.commodity);
      setCommodityVariety(details?.commodity_variety);
      setServiceContract(details?.service_contract);
      setSupervisor(loginData?.userDetails);

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
    const breadcrumbArray = [
      // {
      //   title: "Commodity Inward Report",
      //   link: "/commodity-outward-report",
      // },
      {
        title: "Commodity Outward Report",
        link: `${ROUTE_PATH.COMMODITY_OUTWARD_REPORT}`,
      },
      {
        title: details?.cor__id ? "Edit" : "Add",
      },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);
  // Edit Form Fill Logic End

  useEffect(() => {
    if (getValues("total_net_weight") && getValues("market_rate")) {
      let total = (
        parseFloat(getValues("total_net_weight")) *
        parseFloat(getValues("market_rate"))
      ).toFixed(2);
      console.log(total);
      setValue("value_of_commodity", total, {
        shouldValidate: true,
      });
    }
  }, [getValues("total_net_weight"), getValues("market_rate")]);

  useEffect(() => {
    const tempArray = gatePassList.filter((item, index) =>
      selectedGatePass.includes(index)
    );

    if (tempArray.length > 0) {
      let Temp = 0;
      for (let i = 0; i < tempArray.length; i++) {
        Temp = Temp + tempArray[i]?.net_weight || 0;
      }
      console.log("Temp", Temp);
      setValue("total_net_weight", Temp || 0, {
        shouldValidate: true,
      });

      let Temp2 = 0;
      for (let i = 0; i < tempArray.length; i++) {
        Temp2 = Temp2 + tempArray[i]?.total_bags || 0;
      }

      setTotal_nu_of_bag(Temp2);
      setValue("total_bags", Temp2 || 0, {
        shouldValidate: true,
      });
      setValue("value_of_commodity", Temp2 * 10, {
        shouldValidate: true,
      });
    } else {
      setValue("total_net_weight", 0, {
        shouldValidate: true,
      });
      setValue("total_bags", 0, {
        shouldValidate: true,
      });
      setValue("value_of_commodity", 0, {
        shouldValidate: true,
      });
    }
  }, [selectedGatePass]);

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  useEffect(() => {
    console.log(location?.state?.stage);
    console.log(details?.cor__id);
    if (
      location?.state?.stage === 1 &&
      (details?.cor__id?.cor_no === null ||
        details?.cor__id?.cor_no === undefined ||
        details?.cor__id?.cor_no === "")
    ) {
      // gatePassFreeList();
    }

    gatePassFreeList();

    if (details?.cor__id?.cor_no) {
      console.log(details?.cor__id?.id);
      fetchCORById({ cor_id: details?.cor__id?.id });
    }
  }, []);

  return (
    <>
      <Box bg="white" borderRadius={10} p="10">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
              {/*COR No*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">COR No</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("COR No")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={true}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="COR No"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* CoR Date*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">COR Date</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("COR Date")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={true}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="COR Date"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Depositor / client Name</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={client?.name_of_client}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="client Name"
                  />
                </GridItem>
              </Grid>
              {/*Warehouse Name*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Warehouse Name</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Textarea
                    isInvalid={errors?.warehouse}
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={warehouse?.warehouse_name}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Warehouse Name"
                  />
                </GridItem>
              </Grid>
              {/*Chamber name*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Chamber name</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={chamber?.chamber_number}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Chamber name"
                  />
                </GridItem>
              </Grid>
              {/*  Region */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Region</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={warehouse?.region?.region_name}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Region"
                  />
                </GridItem>
              </Grid>
              {/*  State */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">State</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={warehouse?.state?.state_name}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="State"
                  />
                </GridItem>
              </Grid>
              {/*  Sub-state */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Sub-state</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={warehouse?.substate?.substate_name}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder=" Sub State"
                  />
                </GridItem>
              </Grid>
              {/* District*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">District</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={warehouse?.district?.district_name}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder=" District "
                  />
                </GridItem>
              </Grid>
              {/*  Area*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Area</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={warehouse?.area?.area_name}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder=" Area "
                  />
                </GridItem>
              </Grid>
              {/* Warehouse Address*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Warehouse Address</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Textarea
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={warehouse?.warehouse_address}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="open field"
                  />
                </GridItem>
              </Grid>
              {/* Commodity name*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Commodity name</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={commodity?.commodity_name}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Commodity name"
                  />
                </GridItem>
              </Grid>
              {/* Commodity Variety*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Commodity Variety</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={commodityVariety?.commodity_variety}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Commodity Variety"
                  />
                </GridItem>
              </Grid>
              {/* Table Start */}
              <TableContainer mt="4" id="gate_pass">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      {!details?.cor__id?.cor_no && (
                        <Th color="#000">Select</Th>
                      )}
                      <Th color="#000">Gate pass No</Th>
                      <Th color="#000">Truck no</Th>
                      <Th color="#000">Weighbridge slip no</Th>
                      <Th color="#000">Total no of bags</Th>
                      <Th color="#000">Total MT</Th>
                      <Th color="#000">Tare weight</Th>
                      <Th color="#000">Net weight</Th>
                      <Th color="#000">Moisture</Th>
                      <Th color="#000">View Gatepass</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {gatePassList?.length > 0 ? (
                      gatePassList.map((item, index) => (
                        <Tr
                          key={index}
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                        >
                          {!details?.cor__id?.cor_no && (
                            <Td>
                              <Checkbox
                                border={"1px grey"}
                                colorScheme="CheckBoxPrimary"
                                onChange={() => {
                                  console.log(index);
                                  GatePassSelectLogic(index);
                                }}
                              ></Checkbox>
                            </Td>
                          )}

                          <Td>{item.gate_pass_no}</Td>
                          <Td>{item.truck_number}</Td>
                          <Td>{item.weight_bridge_slip_no}</Td>
                          <Td>{item.total_bags}</Td>
                          {/* <Td>{item.gross_weight_kg}</Td> */}
                          <Td>{item.tare_weight}</Td>
                          <Td>{item.net_weight}</Td>
                          <Td>
                            {item?.gate_pass_stack_details?.[0]
                              ?.actual_bag_weight || 0}
                          </Td>
                          <Td>
                            {item?.gate_pass_commodity_quality?.filter(
                              (item) =>
                                item?.quality_parameter?.quality_parameter ===
                                "moisture"
                            )?.[0]?.parameter_value || "N/A"}
                          </Td>

                          <Td>
                            <Box display="flex" alignItems="center" gap="3">
                              <Flex gap="20px" justifyContent="center">
                                <Box color={"primary.700"}>
                                  <BsEye
                                    // color="#A6CE39"
                                    fontSize="26px"
                                    cursor="pointer"
                                    // edit/gate-pass/33
                                    onClick={() => {
                                      const newTab = window.open(
                                        `${ROUTE_PATH.GATE_PASS_OUTWARD_EDIT}/${item?.id}?readonly=true`,
                                        "_blank"
                                      );

                                      if (newTab) {
                                        enterFullScreen(newTab);
                                      }
                                    }}
                                  />
                                </Box>
                              </Flex>
                            </Box>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr textAlign="center">
                        <Td colSpan="5" color="#000">
                          No record found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              {/* Table End */}
              {/* Total Net Weight(MT) */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Total Net Weight(MT)</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("total_net_weight")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={true}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Total Net Weight(MT)"
                    />
                  </FormControl>
                </GridItem>
              </Grid>{" "}
              {/* Total No. of Bags*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Total No. of Bags</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("total_bags")}
                      type="number"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={true}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Total No. of Bags"
                    />
                  </FormControl>
                </GridItem>
              </Grid>{" "}
              {/* Client representative name*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Client representative name</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.client_rep_name}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("client_rep_name")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={InputDisableFunction()}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Client representative name"
                    />
                  </FormControl>
                </GridItem>
              </Grid>{" "}
              {/*Mobile No of client representative */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Mobile No of client representative{" "}
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.client_mobile_no}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("client_mobile_no")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
                      //   isDisabled={true}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Enter Mobile"
                    />
                  </FormControl>
                  <Box width="w-full">
                    <Text
                      //width="w-full  "
                      display="block"
                      as="small"
                      textAlign="left"
                      color="red"
                      mx="1"
                    >
                      {errors && errors?.client_mobile_no?.message}
                    </Text>
                  </Box>
                </GridItem>
              </Grid>
              {/*Signature of client representative*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Signature of client representative{" "}
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    {(dataState?.client_signature ||
                      !details?.cor__id?.cor_no) && (
                      <CustomSign
                        onChange={(e) => {
                          setValue("client_signature", e, {
                            shouldValidate: true,
                          });
                        }}
                        url={
                          dataState?.client_signature
                            ? `${configuration.IMAGE_BASE_URL}/${dataState?.client_signature}`
                            : null
                        }
                        fileuplaod_folder_structure={{
                          type: "cor",
                          subtype: "cor",
                        }}
                        showErr={errors?.client_signature ? true : false}
                      />
                    )}
                  </FormControl>
                </GridItem>
              </Grid>
              {/*Upload Id Proof of Client Representative */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Upload Id Proof of Client Representative{" "}
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }} textAlign={"left"}>
                    <CustomFileInput
                      InputDisabled={InputDisableFunction()}
                      name={"client_id_proof_path"}
                      placeholder="Agreement upload"
                      label=""
                      type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                      defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                      fileuplaod_folder_structure={{
                        type: "cor",
                        subtype: "cor",
                      }}
                      onChange={(e) => {
                        setValue("client_id_proof_path", e, {
                          shouldValidate: true,
                        });
                      }}
                      value={getValues("client_id_proof_path")}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      showErr={errors?.client_id_proof_path ? true : false}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/*Upload Authority letter */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Upload Authority letter</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }} textAlign={"left"}>
                    <CustomFileInput
                      InputDisabled={InputDisableFunction()}
                      name={"authority_letter_path"}
                      placeholder="Agreement upload"
                      label=""
                      type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                      defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                      fileuplaod_folder_structure={{
                        type: "cor",
                        subtype: "cor",
                      }}
                      onChange={(e) => {
                        setValue("authority_letter_path", e, {
                          shouldValidate: true,
                        });
                      }}
                      value={getValues("authority_letter_path")}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      showErr={errors?.authority_letter_path ? true : false}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Spillage bag count */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Spillage bag count</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.spilage_bag_count}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("spilage_bag_count")}
                      isDisabled={InputDisableFunction()}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      //value={inputValue}
                      onChange={(e) => {
                        let total_bags = Number(getValues("total_bags"));
                        let bag_count = Number(e.target.value) || 0;

                        if (bag_count < total_bags) {
                          setValue("spilage_bag_count", bag_count || null, {
                            shouldValidate: true,
                          });
                        } else {
                          // setValue("spilage_bag_count", "", {
                          //   shouldValidate: true,
                          // });
                          setError("spilage_bag_count", {
                            type: "manual",
                            message:
                              "Spillage bag count must be less than total bags",
                          });
                        }
                      }}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Spillage bag count"
                    />
                  </FormControl>

                  {errors?.spilage_bag_count && (
                    <Box color="red" textAlign="left">
                      {errors?.spilage_bag_count?.message}
                    </Box>
                  )}
                </GridItem>
              </Grid>{" "}
              {/* Supervisor name*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Supervisor name</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
                      value={supervisor?.employee_name}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Service contract No"
                    />
                  </FormControl>
                </GridItem>
              </Grid>{" "}
              {/*Remarks*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Remarks</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("remarks")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
                      //   isDisabled={true}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Enter remarks"
                    />
                  </FormControl>
                </GridItem>
              </Grid>{" "}
              <Box>
                {Number(dataState?.status?.status_code || 0) > 0 ? (
                  <>
                    <Grid
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Maker name</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={dataState?.l1_user?.employee_name || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                    <Grid
                      textAlign="right"
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Maker mobile no</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={dataState?.l1_user?.phone || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {Number(dataState?.status?.status_code || 0) > 2 ? (
                  <>
                    <Grid
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Checker name</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={dataState?.l2_user?.employee_name || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                    <Grid
                      textAlign="right"
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Checker mobile no</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={dataState?.l2_user?.phone || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {Number(dataState?.status?.status_code || 0) > 5 ? (
                  <>
                    <Grid
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Reviewer name</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={dataState?.l3_user?.employee_name || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                    <Grid
                      textAlign="right"
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Reviewer mobile no</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={dataState?.l3_user?.phone || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {Number(dataState?.status?.status_code || 0) === 2 ||
                Number(dataState?.status?.status_code || 0) === 5 ? (
                  <Box>
                    <Grid
                      textAlign="right"
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Reason for rejection</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            type="text"
                            border="1px"
                            name="rejectReason_text"
                            {...register("rejectReason_text")}
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            onChange={(e) => {
                              setRejectReason(e.target.value);
                            }}
                            value={rejectReason}
                            isDisabled={InputDisableFunction()}
                            // _placeholder={commonStyle._placeholder}
                            // _hover={commonStyle._hover}
                            // _focus={commonStyle._focus}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
              <Box
                display="flex"
                gap={2}
                justifyContent="flex-end"
                mt="10"
                px="0"
              >
                {/* {(Number(dataState?.status?.status_code || 0) === 1 ||
                  !details?.cor__id?.cor_no) && (
                  <Button
                    type="submit"
                    //w="full"
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    borderRadius={"full"}
                    isLoading={createCORApiIsLoading || updateCORApiIsLoading}
                    my={"4"}
                    px={"10"}
                  >
                    Submit
                  </Button>
                )} */}
                {/* <Box>{dataState?.status?.status_code}</Box>
                <Box>{!details?.cir__id?.cor_no ? "yes" : "no"}</Box>
                <Box>
                  {Number(dataState?.status?.status_code) < 1
                    ? "Aa True"
                    : "Bb false"}
                </Box> */}

                {(Number(dataState?.status?.status_code || 0) === 1 ||
                  Number(dataState?.status?.status_code || 0) === 3) && (
                  <Button
                    type="button"
                    //w="full"
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    borderRadius={"full"}
                    isLoading={false}
                    my={"4"}
                    px={"10"}
                    onClick={() => {
                      assignApproveRejectToMeFunction({
                        type: "assigned",
                        reasons: "",
                      });
                    }}
                  >
                    Assign to me
                  </Button>
                )}

                {/* Number(dataState?.status?.status_code || 0) === 2 ||
                  (Number(dataState?.status?.status_code || 0) === 5 */}

                {(Number(dataState?.status?.status_code) === 2 &&
                  dataState?.l2_user?.id === loginData?.userDetails?.id) ||
                (Number(dataState?.status?.status_code) === 5 &&
                  dataState?.l3_user?.id === loginData?.userDetails?.id) ? (
                  <>
                    <Button
                      type="button"
                      //w="full"
                      //backgroundColor={"primary.700"}
                      border="1px"
                      borderColor="red"
                      _hover={{ backgroundColor: "red.50", color: "white" }}
                      color={"red"}
                      borderRadius={"full"}
                      isLoading={false}
                      my={"4"}
                      px={"10"}
                      onClick={() => {
                        assignApproveRejectToMeFunction({
                          type: "rejected",
                          reasons: getValues("remarks"),
                        });
                      }}
                    >
                      Reject
                    </Button>

                    <Button
                      type="button"
                      //w="full"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      isLoading={false}
                      onClick={() => {
                        assignApproveRejectToMeFunction({
                          type: "approved",
                          reasons: getValues("remarks"),
                        });
                      }}
                      my={"4"}
                      px={"10"}
                    >
                      Approve
                    </Button>
                  </>
                ) : (
                  ""
                )}
                {(Number(dataState?.status?.status_code || 0) < 1 ||
                  !details?.cor__id?.cor_no) && (
                  <Button
                    type="submit"
                    //w="full"
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    borderRadius={"full"}
                    isLoading={createCORApiIsLoading || updateCORApiIsLoading}
                    my={"4"}
                    px={"10"}
                  >
                    Submit
                    {/* {details?.id ? "Update" : "Add"} */}
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </>
  );
}

const toasterAlert = (obj) => {
  let msg = obj?.message;
  let status = obj?.status;
  if (status === 400) {
    const errorData = obj.data;
    let errorMessage = "";

    Object.keys(errorData).forEach((key) => {
      const messages = errorData[key];
      messages.forEach((message) => {
        errorMessage += `${key} : ${message} \n`;
      });
    });
    showToastByStatusCode(status, errorMessage);
    return false;
  }
  showToastByStatusCode(status, msg);
};
