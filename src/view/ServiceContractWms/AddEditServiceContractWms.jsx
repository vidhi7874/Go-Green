/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MotionSlideUp } from "../../utils/animation";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomInput from "../../components/Elements/CustomInput";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import ReactSelect from "react-select";
import { BiDownload, BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import {
  useGetBankMasterFreeMutation,
  useGetChamberFreeMutation,
  useGetClientMasterFreeTypeMutation,
  useGetCommodityBagFreeMasterMutation,
  useGetCommodityFreeMasterMutation,
  useGetWareHouseFreeMutation,
} from "../../features/master-api-slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./fields";
import {
  useAssignServiceContractMutation,
  usePostServiceContractMutation,
  useUpdateServiceContractMutation,
  useGetServiceContractByIdMutation,
} from "../../features/service-contract-api.slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import moment from "moment";
import ROUTE_PATH from "../../constants/ROUTE";
import configuration from "../../config/configuration";
import { localStorageService } from "../../services/localStorge.service";

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

function AddEditServiceContractWms() {
  const clientRentByOptions = [
    { label: "Sq. Ft", value: "Sq.Ft" },
    { label: "MT", value: "MT" },
  ];

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      warehousechamber: [],
      contractcommodity: [],
      upload_signed_service_contract: [],
      client_rent_type: clientRentByOptions[0]?.value,
    },
  });
  const dispatch = useDispatch();
  const location = useLocation();
  const [details, setDetails] = useState(location?.state?.details);

  const pageView = location?.state?.view;

  const navigate = useNavigate();

  const {
    setValue,
    getValues,
    formState: { errors },
    register,
  } = methods;

  const templateColumns = {
    base: "repeat(1, 1fr)",
    md: "repeat(3, 2fr)",
    lg: "repeat(3, 1fr)",
  };

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

  const [selectBoxOptions, setSelectBoxOptions] = useState({});

  // Static Options start

  const fumigationByOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const qcChangesByOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const insuranceByOptions = [
    { label: "Go Green", value: "go green" },
    { label: "Client", value: "client" },
    { label: "Bank", value: "bank" },
    { label: "WH owner", value: "owner" },
  ];

  const storageRateByOptions = [
    { label: "On Bag", value: "Bag" },
    { label: "On MT", value: "MT" },
  ];

  const clientBillTypeOptions = [
    { label: "Merge", value: "merge" },
    { label: "Separate", value: "separate" },
  ];

  const billingCycle = [
    {
      label: "Daily",
      value: "Daily",
    },
    {
      label: "Weekly",
      value: "Weekly",
    },
    {
      label: "Fortnightly",
      value: "Fortnightly",
    },
    {
      label: "Monthly",
      value: "Monthly",
    },
  ];

  // Static Options end

  // Commodity Master start

  const [getCommodityMaster, { isLoading: getCommodityMasterApiIsLoading }] =
    useGetCommodityFreeMasterMutation();

  const getCommodityMasterList = async () => {
    try {
      const response = await getCommodityMaster().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          community: response?.data?.map(({ commodity_name, id }) => ({
            label: commodity_name,
            value: id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getCommodityMasterList();
  }, []);

  // Commodity Master end

  // Commodity Bag Master start

  const [
    getCommodityBagMaster,
    { isLoading: getCommodityBagMasterApiIsLoading },
  ] = useGetCommodityBagFreeMasterMutation();

  const getCommodityBagMasterList = async () => {
    try {
      const response = await getCommodityBagMaster().unwrap();
      console.log(" Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          community_bag: response?.data?.map(({ bag_size, id, commodity }) => ({
            label: bag_size,
            value: id,
            commodity: commodity?.id || 0,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getCommodityBagMasterList();
  }, []);

  // Commodity Bag Master end

  // Bank Master start

  const [getBankMaster, { isLoading: getBankMasterApiIsLoading }] =
    useGetBankMasterFreeMutation();

  const getBankMasterList = async () => {
    try {
      const response = await getBankMaster().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          banks: response?.results?.map(({ bank_name, id }) => ({
            label: bank_name,
            value: id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getBankMasterList();
  }, []);

  // Bank Master end

  // Client Master start

  const [getClientMaster, { isLoading: getClientMasterApiIsLoading }] =
    useGetClientMasterFreeTypeMutation();

  const getClientMasterList = async () => {
    try {
      const response = await getClientMaster().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          client: response?.data?.map(({ name_of_client, id }) => ({
            label: name_of_client,
            value: id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getClientMasterList();
  }, []);

  // Client Master end

  // Warehouse Master start

  const [getWarehouseMaster, { isLoading: getWarehouseMasterApiIsLoading }] =
    useGetWareHouseFreeMutation();

  const getWarehouseMasterList = async () => {
    try {
      const response = await getWarehouseMaster(
        "?filter=warehouse_type&warehouse_type=WMS&filter=is_block&is_block=false&filter=area__is_block&area__is_block=false&filter=is_active&is_active=true"
      ).unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          warehouse: response?.data?.map(
            ({
              warehouse_name,
              id,
              total_rent_payable,
              warehouse_expired_count,
            }) => ({
              label: warehouse_name,
              value: id,
              rent: total_rent_payable,
              warehouse_expired_count: warehouse_expired_count,
            })
          ),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getWarehouseMasterList();
  }, []);

  const [validMessage, setValidMessage] = useState("");

  const getWarehouseEndFunction = async (id) => {
    try {
      const response = await getChamberMaster(
        "?filter=warehouse__id&warehouse__id=" + id
      ).unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setValidMessage(response?.warehouse_agreement_info?.message || "");
      }
    } catch (error) {
      console.error("Error:", error);
      setValidMessage("");
    }
  };

  // Warehouse Master end

  // Chamber Master start

  const [getChamberMaster, { isLoading: getChamberApiIsLoading }] =
    useGetChamberFreeMutation();

  const getChamberMasterList = async () => {
    try {
      const response = await getChamberMaster().unwrap();
      console.log("Success:", response);
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

  useEffect(() => {
    getChamberMasterList();
  }, []);

  // Chamber Master end

  // Multi  Warehouse Logic start

  const [warehouseDetails, setWarehouseDetails] = useState({
    warehouse: "",
    chamber: "",
    owner_rent: "",
    total_mt_or_sqft: "",
    rate_per_mt_or_sqft: "",
    total_client_rent: "",
  });

  const [errorWarehouseDetails, setErrorWarehouseDetails] = useState({
    warehouse: "",
    chamber: "",
    owner_rent: "",
    total_mt_or_sqft: "",
    rate_per_mt_or_sqft: "",
    total_client_rent: "",
  });

  const [updateWarehouse, setUpdateWarehouse] = useState(null);

  const WarehouseCondition = () => {
    const chamberCheck =
      warehouseDetails.chamber !== "" && warehouseDetails.chamber !== null
        ? getValues("warehousechamber")
            ?.filter((item, index) => index !== updateWarehouse)
            ?.filter((item) => item.chamber === warehouseDetails.chamber)
            ?.length > 0
          ? false
          : true
        : false;

    if (chamberCheck === false) {
      if (warehouseDetails.chamber !== "" && warehouseDetails.chamber !== null)
        toasterAlert({
          message:
            "Duplicate Data for Warehouse and/or Chamber is not allowed.",
          status: 440,
        });
    }

    return (
      warehouseDetails.warehouse !== "" &&
      warehouseDetails.warehouse !== null &&
      warehouseDetails.chamber !== "" &&
      warehouseDetails.chamber !== null &&
      warehouseDetails.owner_rent !== "" &&
      warehouseDetails.owner_rent !== null &&
      warehouseDetails.owner_rent >= 0 &&
      (warehouseDetails.owner_rent > 0
        ? warehouseDetails.total_mt_or_sqft !== "" &&
          warehouseDetails.total_mt_or_sqft !== null &&
          warehouseDetails.total_mt_or_sqft > 0 &&
          warehouseDetails.rate_per_mt_or_sqft !== "" &&
          warehouseDetails.rate_per_mt_or_sqft !== null &&
          warehouseDetails.rate_per_mt_or_sqft > 0 &&
          warehouseDetails.total_client_rent !== "" &&
          warehouseDetails.total_client_rent !== null &&
          warehouseDetails.total_client_rent > 0
        : true) &&
      chamberCheck
    );
  };

  const ErrorWarehouse = () => {
    setErrorWarehouseDetails((old) => ({
      warehouse:
        warehouseDetails.warehouse === "" || warehouseDetails.warehouse === null
          ? "Error"
          : "",
      chamber:
        warehouseDetails.chamber === "" || warehouseDetails.chamber === null
          ? "Error"
          : "",
      owner_rent:
        warehouseDetails.owner_rent === "" ||
        warehouseDetails.owner_rent === null ||
        warehouseDetails.owner_rent < 0
          ? "Error"
          : "",
      total_mt_or_sqft:
        (warehouseDetails.total_mt_or_sqft === "" ||
          warehouseDetails.total_mt_or_sqft === null ||
          warehouseDetails.total_mt_or_sqft <= 0) &&
        warehouseDetails.owner_rent > 0
          ? "Error"
          : "",
      rate_per_mt_or_sqft:
        (warehouseDetails.rate_per_mt_or_sqft === "" ||
          warehouseDetails.rate_per_mt_or_sqft === null ||
          warehouseDetails.rate_per_mt_or_sqft <= 0) &&
        warehouseDetails.owner_rent > 0
          ? "Error"
          : "",
      total_client_rent:
        (warehouseDetails.total_client_rent === "" ||
          warehouseDetails.total_client_rent === null ||
          warehouseDetails.total_client_rent <= 0) &&
        warehouseDetails.owner_rent > 0
          ? "Error"
          : "",
    }));
  };

  const AddWarehouseDetail = () => {
    if (
      WarehouseCondition() &&
      getValues(`warehousechamber`)?.filter(
        (item) => item.chamber === warehouseDetails.chamber
      ).length === 0
    ) {
      // const arr = getValues("warehousechamber");

      console.log(getValues("warehousechamber"));
      console.log(warehouseDetails);
      let temp = [
        ...(getValues("warehousechamber") || []),
        { ...warehouseDetails, gst_applicable: isChecked },
      ];
      console.log(temp);

      setValue("warehousechamber", temp, {
        shouldValidate: true,
      });
      setWarehouseDetails({
        warehouse: "",
        chamber: "",
        owner_rent: "",
        total_mt_or_sqft: "",
        rate_per_mt_or_sqft: "",
        total_client_rent: "",
      });
      setErrorWarehouseDetails({
        warehouse: "",
        chamber: "",
        owner_rent: "",
        total_mt_or_sqft: "",
        rate_per_mt_or_sqft: "",
        total_client_rent: "",
      });
      setIsChecked(false);
    } else {
      ErrorWarehouse();
    }
  };

  const EditAbleWarehouse = (data) => {
    console.log(data);
    setWarehouseDetails({
      warehouse: data.warehouse,
      chamber: data.chamber,
      owner_rent: data.owner_rent,
      total_mt_or_sqft: data.total_mt_or_sqft,
      rate_per_mt_or_sqft: data.rate_per_mt_or_sqft,
      total_client_rent: data.total_client_rent,
      gst_applicable: data.gst_applicable,
    });
    setIsChecked(data.gst_applicable);
  };

  const EditWarehouseDetail = () => {
    if (
      WarehouseCondition() &&
      getValues(`warehousechamber`)
        ?.filter((item, index) => index !== updateWarehouse)
        ?.filter((item) => item.chamber === warehouseDetails.chamber).length ===
        0
    ) {
      const tempArr = getValues(`warehousechamber`);
      let temp = [
        ...tempArr?.slice(0, updateWarehouse),
        { ...warehouseDetails, gst_applicable: isChecked },
        ...tempArr?.slice(updateWarehouse + 1),
      ];

      setValue("warehousechamber", temp, {
        shouldValidate: true,
      });

      setUpdateWarehouse(null);
      setWarehouseDetails({
        warehouse: "",
        chamber: "",
        owner_rent: "",
        total_mt_or_sqft: "",
        rate_per_mt_or_sqft: "",
        total_client_rent: "",
      });
      setErrorWarehouseDetails({
        warehouse: "",
        chamber: "",
        owner_rent: "",
        total_mt_or_sqft: "",
        rate_per_mt_or_sqft: "",
        total_client_rent: "",
      });
      setIsChecked(false);
    } else {
      ErrorWarehouse();
    }
  };

  const DeleteWarehouse = (id) => {
    const tempArr = getValues(`warehousechamber`);
    let temp = [...tempArr?.slice(0, id), ...tempArr?.slice(id + 1)];

    setValue("warehousechamber", temp, {
      shouldValidate: true,
    });
  };

  const mergingData = (arr) => {
    return arr?.reduce((accumulator, currentItem) => {
      const existingItemIndex = accumulator.findIndex(
        (item) => item.warehouse === currentItem.warehouse
      );

      if (existingItemIndex !== -1) {
        accumulator[existingItemIndex].gst_applicable =
          accumulator[existingItemIndex].gst_applicable ||
          currentItem.gst_applicable;
      } else {
        accumulator.push(currentItem);
      }
      console.log(accumulator);

      return accumulator;
    }, []);
  };

  useEffect(() => {
    if (
      warehouseDetails.rate_per_mt_or_sqft &&
      warehouseDetails.total_mt_or_sqft
    ) {
      setWarehouseDetails((old) => ({
        ...old,
        total_client_rent: old.rate_per_mt_or_sqft * old.total_mt_or_sqft,
      }));
    }
  }, [warehouseDetails.rate_per_mt_or_sqft, warehouseDetails.total_mt_or_sqft]);

  // Multi  Warehouse Logic end

  // commodity Logic start
  const [isChecked, setIsChecked] = useState(false);
  const [commodityDetails, setCommodityDetails] = useState({
    commodity: "",
    bag_size: "",
    pbpm_rate: "",
    rate: "",
  });

  const [commodityError, setCommodityError] = useState({
    commodity: "",
    bag_size: "",
    pbpm_rate: "",
    rate: "",
  });

  const [updateCommodity, setUpdateCommodity] = useState(null);

  const PBPMLogic = () => {
    if (getValues("storage_rate_on") !== "MT") {
      if (
        commodityDetails.bag_size !== null &&
        commodityDetails.bag_size !== ""
      ) {
        setCommodityDetails((old) => ({ ...old, pbpm_rate: 10, rate: 10 }));
      }
    } else if (
      commodityDetails.commodity !== null &&
      commodityDetails.commodity !== ""
    ) {
      setCommodityDetails((old) => ({ ...old, pbpm_rate: 10, rate: 10 }));
    }
  };

  const CommodityCondition = () => {
    const bagCheck =
      getValues("storage_rate_on") === "Bag"
        ? commodityDetails.bag_size !== null && commodityDetails.bag_size !== ""
          ? getValues("contractcommodity")
              ?.filter((item, index) => index !== updateCommodity)
              ?.filter((item) => item.bag_size === commodityDetails.bag_size)
              ?.length > 0
            ? false
            : true
          : false
        : commodityDetails.commodity !== null &&
          commodityDetails.commodity !== ""
        ? getValues("contractcommodity")
            ?.filter((item, index) => index !== updateCommodity)
            ?.filter((item) => item.commodity === commodityDetails.commodity)
            ?.length > 0
          ? false
          : true
        : false;

    if (bagCheck === false) {
      if (
        commodityDetails.commodity !== null &&
        commodityDetails.commodity !== "" &&
        (getValues("storage_rate_on") === "bag"
          ? commodityDetails.bag_size !== null &&
            commodityDetails.bag_size !== ""
          : true)
      )
        toasterAlert({
          message:
            "Combination of same commodity with same bag size is not allowed multiple times.",
          status: 440,
        });
    }

    return (
      commodityDetails.commodity !== null &&
      commodityDetails.commodity !== "" &&
      commodityDetails.pbpm_rate !== null &&
      commodityDetails.pbpm_rate !== "" &&
      commodityDetails.rate !== null &&
      commodityDetails.rate !== "" &&
      bagCheck
    );
  };

  const ErrorCommodity = () => {
    setCommodityError({
      commodity:
        commodityDetails.commodity !== null && commodityDetails.commodity !== ""
          ? ""
          : "error",
      bag_size:
        getValues("storage_rate_on") === "bag"
          ? commodityDetails.bag_size !== null && commodityDetails.bag !== ""
            ? ""
            : "error"
          : "",
      pbpm_rate:
        commodityDetails.pbpm_rate !== null && commodityDetails.pbpm_rate !== ""
          ? ""
          : "error",
      rate:
        commodityDetails.rate !== null && commodityDetails.rate !== ""
          ? ""
          : "error",
    });
  };

  const AddCommodityDetails = () => {
    if (CommodityCondition()) {
      let temp = [...(getValues("contractcommodity") || []), commodityDetails];
      setValue("contractcommodity", temp, {
        shouldValidate: true,
      });
      setCommodityError({
        commodity: "",
        bag_size: "",
        pbpm_rate: "",
        rate: "",
      });
      setCommodityDetails({
        commodity: "",
        bag_size: "",
        pbpm_rate: "",
        rate: "",
      });
    } else {
      ErrorCommodity();
    }
  };

  const EditAbleCommodity = (data) => {
    setCommodityDetails({
      commodity: data.commodity,
      bag_size: data.bag_size,
      pbpm_rate: data.pbpm_rate,
      rate: data.rate,
    });
  };

  const EditCommodityDetail = () => {
    if (CommodityCondition()) {
      const tempArr = getValues(`contractcommodity`);
      let temp = [
        ...tempArr?.slice(0, updateCommodity),
        commodityDetails,
        ...tempArr?.slice(updateCommodity + 1),
      ];
      setValue("contractcommodity", temp, {
        shouldValidate: true,
      });
      setUpdateCommodity(null);
      setCommodityError({
        commodity: "",
        bag_size: "",
        pbpm_rate: "",
        rate: "",
      });
      setCommodityDetails({
        commodity: "",
        bag_size: "",
        pbpm_rate: "",
        rate: "",
      });
    } else {
      ErrorCommodity();
    }
  };

  const DeleteCommodity = (id) => {
    const tempArr = getValues(`contractcommodity`);
    let temp = [...tempArr?.slice(0, id), ...tempArr?.slice(id + 1)];
    setValue("contractcommodity", temp, {
      shouldValidate: true,
    });
  };

  // commodity Logic end

  const onSubmit = (data) => {
    console.log("data", data);

    let { warehouse, ...finalData } = data;
    console.log(data);
    let selectedStorageRateOn = getValues("storage_rate_on");

    let contractcommodity = data?.contractcommodity.map((el) => ({
      ...el,
      rate: selectedStorageRateOn === "Bag" ? el?.rate : null,
      storage_rate_per_mt: selectedStorageRateOn === "MT" ? el?.rate : null,
    }));

    const tempWarehouse = data?.warehousechamber?.map((item) => ({
      ...item,
      rate_per_mt_or_sqft: item?.rate_per_mt_or_sqft || null,
      total_client_rent: item?.total_client_rent || null,
      total_mt_or_sqft: item?.total_mt_or_sqft || null,
      client_rent_type: data.client_rent_type,
    }));

    if (details?.id) {
      updateServiceFunction({
        ...finalData,
        contractcommodity: contractcommodity,
        warehousechamber: tempWarehouse,
      });
    } else {
      addServiceFunction({
        ...finalData,
        contractcommodity: contractcommodity,
        warehousechamber: tempWarehouse,
      });
    }
  };
  console.log("errors ====>", errors);

  // Add Service Contract start

  const [addServiceContract, { isLoading: addServiceContractApiIsLoading }] =
    usePostServiceContractMutation();

  const addServiceFunction = async (data) => {
    try {
      console.log("add data", data);
      const response = await addServiceContract({
        ...data,
        contract_type: "wms",
      }).unwrap();
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.SERVICE_CONTRACT_WMS}`);
      }
    } catch (error) {
      console.log(error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Service Contract add Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Add Service Contract end

  // Edit Service Contract start

  const [
    updateServiceContract,
    { isLoading: updateServiceContractApiIsLoading },
  ] = useUpdateServiceContractMutation();

  const [getServiceContractById] = useGetServiceContractByIdMutation();

  const updateServiceFunction = async (data) => {
    try {
      const response = await updateServiceContract({
        ...data,
        id: details.id,
        contract_type: "wms",
      }).unwrap();
      if (response.status === 200) {
        if (
          Number(details?.status?.status_code || 0) === 2 ||
          Number(details?.status?.status_code || 0) === 5
        ) {
          approvedToMeFunction();
        } else {
          toasterAlert(response);
          navigate(`${ROUTE_PATH.SERVICE_CONTRACT_WMS}`);
        }
      }
    } catch (error) {
      console.log(error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        " Service Contract Update Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Edit Service Contract end

  const fetchServiceContractById = async () => {
    try {
      const response = await getServiceContractById(details?.id).unwrap();
      if (response.status === 200) {
        return response?.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update Logic Start

  const autoFillForm = async () => {
    console.log(details, "details");

    const form_details = await fetchServiceContractById();
    console.log(form_details, "details");

    setDetails(form_details);

    let obj = {
      client: form_details?.client?.id,
      fumigation_by_gogreen: form_details?.fumigation_by_gogreen,
      insurance_by: form_details?.insurance_by,
      qc_charges_by_gogreen: form_details?.qc_charges_by_gogreen,
      storage_rate_on: form_details?.storage_rate_on,
      client_bill_type: form_details?.client_bill_type,
      minimum_billing_charge: form_details?.minimum_billing_charge,
      service_contract_start_date: form_details?.service_contract_start_date,
      service_contract_end_date: form_details?.service_contract_end_date,
      service_contract_billing_end_date:
        form_details?.service_contract_billing_end_date,
      upload_signed_service_contract:
        form_details?.upload_signed_service_contract,
      billing_cycle: form_details?.billing_cycle,
      expected_no_of_bags: form_details?.expected_no_of_bags,
      expected_quantity: form_details?.expected_quantity,
    };

    console.log("form_details --->", form_details);

    setValue("is_gst_applicable", form_details?.is_gst_applicable, {
      shouldValidate: true,
    });

    Object.keys(obj).forEach(function (key) {
      methods.setValue(key, obj[key], { shouldValidate: true });
    });

    let tempWarehouse = form_details?.warehousechamber?.map((item) => ({
      warehouse: item?.warehouse?.id,
      chamber: item?.chamber.id,
      owner_rent: item?.owner_rent,
      client_rent_type: item.gst_applicable,
      total_mt_or_sqft: item.total_mt_or_sqft,
      rate_per_mt_or_sqft: item.rate_per_mt_or_sqft,
      total_client_rent: item.total_client_rent,
    }));

    methods.setValue("warehousechamber", tempWarehouse, {
      shouldValidate: true,
    });

    methods.setValue(
      "client_rent_type",
      form_details?.warehousechamber?.[0]?.client_rent_type,
      {
        shouldValidate: true,
      }
    );

    console.log(
      "form_details?.contractcommodity",
      form_details?.contractcommodity
    );

    let tempPBPM = form_details?.contractcommodity?.map((item) => ({
      commodity: item?.commodity?.id,
      bag_size: item?.bag_size?.id,
      pbpm_rate: item.pbpm_rate,
      rate: item?.rate || item?.storage_rate_per_mt,
    }));

    methods.setValue("contractcommodity", tempPBPM, {
      shouldValidate: true,
    });

    setRejectReason(form_details?.l3_reasons || form_details?.l2_reasons || "");
  };

  useEffect(() => {
    if (details?.id) {
      autoFillForm();
    }
  }, []);

  // Update Logic End

  // Edit Logic Start

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

  useEffect(() => {
    // set breadcrumbArray
    const breadcrumbArray = [
      {
        title: "Service Contract(WMS)",
        link: `${ROUTE_PATH.SERVICE_CONTRACT_WMS}`,
      },
      // {
      //   title: "Region Master",
      //   link: "/manage-location/region-master",
      // },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  // Edit Logic End

  // Input disable Logic Start

  const loginData = localStorageService.get("GG_ADMIN");

  const InputDisableFunction = () => {
    const NotUser =
      Number(details?.status?.status_code || 0) === 0
        ? false
        : details?.l3_user !== null
        ? details?.l3_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : details?.l2_user !== null
        ? details?.l2_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : details?.l1_user !== null
        ? details?.l1_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : true;

    const result =
      pageView ||
      NotUser ||
      details?.status?.status_code === 1 ||
      details?.status?.status_code === 3 ||
      details?.status?.status_code === 4 ||
      details?.status?.status_code === 6 ||
      details?.status?.status_code === 7
        ? true
        : false;

    return result;
  };

  // Input disable Logic End

  // Reject Logic Start

  const [rejectReason, setRejectReason] = useState("");

  const [
    UpdateAssignServiceMaster,
    { isLoading: updateAssignServiceMasterApiIsLoading },
  ] = useAssignServiceContractMutation();

  const assignToMeFunction = async () => {
    const data = {
      id: details.id,
      status: "assigned",
      reasons: "",
    };

    try {
      const response = await UpdateAssignServiceMaster(data).unwrap();

      if (response.status === 200) {
        autoFillForm();
        toasterAlert({
          message: "Service Contract Assign Successfully.",
          status: 200,
        });
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

  const approvedToMeFunction = async () => {
    const data = {
      id: details.id,
      status: "approved",
      reasons: "",
    };

    try {
      const response = await UpdateAssignServiceMaster(data).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        toasterAlert({
          message: "Service Contract Approved Successfully.",
          status: 200,
        });
        navigate(`${ROUTE_PATH.SERVICE_CONTRACT_WMS}`);
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

    console.log(data, "data");
  };

  const [rejectError, setRejectError] = useState(false);

  const rejectedToMeFunction = async () => {
    const data = {
      id: details.id,
      status: "rejected",
      reasons: rejectReason || "reject",
    };

    try {
      const response = await UpdateAssignServiceMaster(data).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        toasterAlert({
          message: "Service Contract Rejected Successfully.",
          status: 200,
        });
        navigate(`${ROUTE_PATH.SERVICE_CONTRACT_WMS}`);
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

    console.log(data, "data");
  };

  // Reject Logic Start

  return (
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
            <Box>
              {/* CLIENT NAME */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Client Name <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="client"
                      label=""
                      isClearable={false}
                      isLoading={getClientMasterApiIsLoading}
                      selectedValue={
                        selectBoxOptions?.client?.filter(
                          (item) => item.value === getValues("client")
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      options={selectBoxOptions?.client || []}
                      handleOnChange={(e) => {
                        setValue("client", e.value, {
                          shouldValidate: true,
                        });
                      }}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
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
                      Client Rent Type
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </Text>
                    <ReactCustomSelect
                      name="client_rent_type"
                      label=""
                      isClearable={false}
                      // isLoading={true}
                      selectedValue={
                        clientRentByOptions?.filter(
                          (item) => item.value === getValues("client_rent_type")
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      options={clientRentByOptions || []}
                      handleOnChange={(e) => {
                        setValue("client_rent_type", e.value, {
                          shouldValidate: true,
                        });
                        setValue("warehousechamber", [], {
                          shouldValidate: true,
                        });
                      }}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              <Box
                mt="4"
                backgroundColor={"aqua.100"}
                borderRadius={"lg"}
                padding={"4"}
              >
                <Text fontWeight={"700"} mb="10px">
                  Chamber details<span style={{ color: "red" }}>*</span>
                </Text>
                <Grid templateColumns={templateColumns} gap={5}>
                  {/* Warehouse name */}
                  <Box>
                    <Text>Warehouse name</Text>
                    <ReactSelect
                      options={selectBoxOptions?.warehouse || []}
                      onChange={(e) => {
                        setWarehouseDetails((old) => ({
                          ...old,
                          warehouse: e.value,
                          chamber: "",
                          owner_rent: e.rent,
                        }));
                        getWarehouseEndFunction(e.value);
                      }}
                      isDisabled={InputDisableFunction()}
                      value={
                        selectBoxOptions?.warehouse?.filter(
                          (item) => item.value === warehouseDetails.warehouse
                        )[0] || {}
                      }
                      isLoading={getWarehouseMasterApiIsLoading}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errorWarehouseDetails.warehouse
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                    {validMessage !== "" ? (
                      <>
                        <Text color={"red"} fontSize={"12px"}>
                          {validMessage}
                        </Text>
                      </>
                    ) : (
                      <></>
                    )}
                  </Box>

                  {/* Chamber no */}
                  <Box>
                    <Text>Chamber no</Text>
                    <ReactSelect
                      options={
                        selectBoxOptions?.chamber?.filter(
                          (item) =>
                            item.warehouse === warehouseDetails.warehouse
                        ) || []
                      }
                      onChange={(e) => {
                        setWarehouseDetails((old) => ({
                          ...old,
                          chamber: e.value,
                        }));
                      }}
                      isDisabled={InputDisableFunction()}
                      value={
                        selectBoxOptions?.chamber
                          ?.filter(
                            (item) =>
                              item.warehouse === warehouseDetails.warehouse
                          )
                          ?.filter(
                            (item) => item.value === warehouseDetails.chamber
                          )[0] || {}
                      }
                      isLoading={getChamberApiIsLoading}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errorWarehouseDetails.chamber
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </Box>

                  {/* Owner rent */}
                  <Box>
                    <Text>Owner rent</Text>
                    <Input
                      placeholder="Owner rent"
                      name=""
                      value={warehouseDetails.owner_rent}
                      step={0.01}
                      isDisabled={true}
                      onChange={(e) =>
                        setWarehouseDetails((old) => ({
                          ...old,
                          owner_rent: e.target.value,
                        }))
                      }
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: errorWarehouseDetails.owner_rent
                          ? "red"
                          : "#c3c3c3",
                      }}
                    />
                  </Box>

                  {/* Total MT Or Total Sqft */}
                  <Box>
                    <Text>
                      {getValues("client_rent_type") === "MT"
                        ? "Total MT"
                        : "Total Sqft"}
                    </Text>
                    <Input
                      type="number"
                      placeholder={
                        getValues("client_rent_type") === "MT"
                          ? "Total MT"
                          : "Total Sqft"
                      }
                      isDisabled={InputDisableFunction()}
                      value={warehouseDetails.total_mt_or_sqft}
                      onChange={(e) =>
                        setWarehouseDetails((old) => ({
                          ...old,
                          total_mt_or_sqft: e.target.value,
                        }))
                      }
                      step={0.01}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: errorWarehouseDetails.total_mt_or_sqft
                          ? "red"
                          : "#c3c3c3",
                      }}
                    />
                  </Box>

                  {/* Rate/MT or Rate/Sqft */}
                  <Box>
                    <Text>
                      {getValues("client_rent_type") === "MT"
                        ? "Rate/MT"
                        : "Rate/Sqft"}
                    </Text>
                    <Input
                      type="number"
                      placeholder={
                        getValues("client_rent_type") === "MT"
                          ? "Rate/MT"
                          : "Rate/Sqft"
                      }
                      step={0.01}
                      isDisabled={InputDisableFunction()}
                      value={warehouseDetails.rate_per_mt_or_sqft}
                      onChange={(e) =>
                        setWarehouseDetails((old) => ({
                          ...old,
                          rate_per_mt_or_sqft: e.target.value,
                        }))
                      }
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: errorWarehouseDetails.rate_per_mt_or_sqft
                          ? "red"
                          : "#c3c3c3",
                      }}
                    />
                  </Box>

                  {/* Client rent */}
                  <Box>
                    <Text>Client rent</Text>
                    <Input
                      placeholder="Client rent"
                      value={warehouseDetails.total_client_rent}
                      onChange={(e) =>
                        setWarehouseDetails((old) => ({
                          ...old,
                          total_client_rent: e.target.value,
                        }))
                      }
                      step={0.01}
                      isDisabled={true}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: errorWarehouseDetails.total_client_rent
                          ? "red"
                          : "#c3c3c3",
                      }}
                    />
                  </Box>

                  {/* <Flex gap={2}>
                    <Checkbox
                      isChecked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    ></Checkbox>
                    <Text>GST Applicable For Cleint Rent</Text>
                  </Flex> */}
                </Grid>

                <Box
                  alignSelf={"center"}
                  display="flex"
                  gap={2}
                  mt="10px"
                  justifyContent="flex-end"
                  // mt="10"
                  px="0"
                >
                  <Button
                    type="button"
                    //w="full"
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    borderRadius={"full"}
                    isDisabled={InputDisableFunction()}
                    // my={"4"}
                    px={"10"}
                    onClick={() => {
                      if (updateWarehouse === null) {
                        AddWarehouseDetail();
                      } else {
                        EditWarehouseDetail();
                      }
                    }}
                  >
                    {updateWarehouse === null ? "Add" : "Update"}
                  </Button>
                </Box>
              </Box>

              <Box mt="6">
                <TableContainer border={"none"}>
                  <Table variant="simple">
                    <Thead backgroundColor={"aqua.100"}>
                      <Tr>
                        <Th border={"none"} color="#000">
                          Sr no
                        </Th>
                        <Th border={"none"} color="#000">
                          Warehouse name
                        </Th>
                        <Th border={"none"} color="#000">
                          Chamber no
                        </Th>
                        <Th border={"none"} color="#000">
                          Owner rent
                        </Th>
                        <Th border={"none"} color="#000">
                          {getValues("client_rent_type") === "MT"
                            ? "Total MT"
                            : "Total Sqft"}
                        </Th>
                        <Th border={"none"} color="#000">
                          {getValues("client_rent_type") === "MT"
                            ? "Rate/MT"
                            : "Rate/Sqft"}
                        </Th>
                        <Th border={"none"} color="#000">
                          Client Rent
                        </Th>
                        {/* <Th border={"none"} color="#000">
                          GST Applicable For Client Rent
                        </Th> */}
                        <Th border={"none"} color="#000">
                          Action
                        </Th>
                      </Tr>
                    </Thead>
                    {/* <Tbody>
                      {(getValues("warehousechamber")?.length > 0 &&
                        getValues("warehousechamber")?.map((item, ind) => (
                          <Tr key={`table_${ind}`} textAlign={"center"}>
                            <Td>{ind + 1}</Td>
                            <Td textAlign={"center"}>
                              {selectBoxOptions?.warehouse?.filter(
                                (item2) => item2.value === item.warehouse
                              )[0]?.label || "-"}
                            </Td>
                            <Td textAlign={"center"}>
                              {selectBoxOptions?.chamber?.filter(
                                (item2) => item2.value === item.chamber
                              )[0]?.label || "-"}
                            </Td>
                            <Td textAlign={"center"}>
                              {item?.owner_rent || "0"}
                            </Td>
                            <Td textAlign={"center"}>
                              {item?.total_mt_or_sqft || "-"}
                            </Td>
                            <Td textAlign={"center"}>
                              {item?.rate_per_mt_or_sqft || "-"}
                            </Td>
                            <Td textAlign={"center"}>
                              {item?.total_client_rent || "-"}
                            </Td>

                            {(ind === 0 ||
                              item.warehouse !==
                                getValues(`warehousechamber`)[ind - 1]
                                  .warehouse) && (
                              <Td
                                rowSpan={
                                  getValues(`warehousechamber`).filter(
                                    (mergedItem) =>
                                      mergedItem.warehouse === item.warehouse
                                  ).length
                                }
                              >
                                {getValues(`warehousechamber`)
                                  .filter(
                                    (mergedItem) =>
                                      mergedItem.warehouse === item.warehouse
                                  )
                                  .every(
                                    (mergedItem) => mergedItem.gst_applicable
                                  )
                                  ? "Yes"
                                  : "No"}
                              </Td>
                            )}
                            <Td>
                              <Grid
                                templateColumns={"repeat(2, 1fr)"}
                                gap={"4"}
                              >
                                <Box color="primary.700">
                                  <BiEditAlt
                                    fontSize="26px"
                                    onClick={() => {
                                      if (InputDisableFunction()) {
                                      } else {
                                        setUpdateWarehouse(ind);
                                        EditAbleWarehouse(item);
                                      }
                                    }}
                                    cursor="pointer"
                                  />
                                </Box>
                                <Box color={"red"}>
                                  <AiOutlineDelete
                                    fontSize="26px"
                                    cursor="pointer"
                                    onClick={() => {
                                      if (InputDisableFunction()) {
                                      } else {
                                        if (updateWarehouse === null) {
                                          DeleteWarehouse(ind);
                                        }
                                      }
                                    }}
                                  />
                                </Box>
                              </Grid>
                            </Td>
                          </Tr>
                        ))) || (
                        <Tr>
                          <Td colSpan={"9"}>No Data Found</Td>
                        </Tr>
                      )}
                    </Tbody> */}
                    <Tbody>
                      {(getValues("warehousechamber")?.length > 0 &&
                        getValues("warehousechamber")?.map((item, ind) => (
                          <Tr key={`table_${ind}`} textAlign={"center"}>
                            <Td>{ind + 1}</Td>
                            <Td textAlign={"center"}>
                              {selectBoxOptions?.warehouse?.filter(
                                (item2) => item2.value === item.warehouse
                              )[0]?.label || "-"}
                            </Td>
                            <Td textAlign={"center"}>
                              {selectBoxOptions?.chamber?.filter(
                                (item2) => item2.value === item.chamber
                              )[0]?.label || "-"}
                            </Td>
                            <Td textAlign={"center"}>
                              {item?.owner_rent || "0"}
                            </Td>
                            <Td textAlign={"center"}>
                              {item?.total_mt_or_sqft || "-"}
                            </Td>
                            <Td textAlign={"center"}>
                              {item?.rate_per_mt_or_sqft || "-"}
                            </Td>
                            <Td textAlign={"center"}>
                              {item?.total_client_rent || "-"}
                            </Td>
                            {/* <Td>{item?.gst_applicable ? "Yes" : "No"}</Td> */}
                            <Td>
                              <Grid
                                templateColumns={"repeat(2, 1fr)"}
                                gap={"4"}
                              >
                                <Box color="primary.700">
                                  <BiEditAlt
                                    fontSize="26px"
                                    onClick={() => {
                                      if (InputDisableFunction()) {
                                      } else {
                                        setUpdateWarehouse(ind);
                                        EditAbleWarehouse(item);
                                      }
                                    }}
                                    cursor="pointer"
                                  />
                                </Box>
                                <Box color={"red"}>
                                  <AiOutlineDelete
                                    fontSize="26px"
                                    cursor="pointer"
                                    onClick={() => {
                                      if (InputDisableFunction()) {
                                      } else {
                                        if (updateWarehouse === null) {
                                          DeleteWarehouse(ind);
                                        }
                                      }
                                    }}
                                  />
                                </Box>
                              </Grid>
                            </Td>
                          </Tr>
                        ))) || (
                        <Tr>
                          <Td colSpan={"9"}>No Data Found</Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>

              {errors?.warehousechamber ? (
                <Text color="red">{errors?.warehousechamber?.message}</Text>
              ) : (
                <></>
              )}

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Storage Rate on <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="storage_rate_on"
                      selectedValue={
                        storageRateByOptions?.filter(
                          (item) => item.value === getValues("storage_rate_on")
                        )[0] || {}
                      }
                      handleOnChange={(e) => {
                        console.log(e);
                        setValue("storage_rate_on", e.value, {
                          shouldValidate: true,
                        });
                        setValue("contractcommodity", [], {
                          shouldValidate: true,
                        });
                      }}
                      selectDisable={InputDisableFunction()}
                      options={storageRateByOptions || []}
                      label=""
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
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
                      Client Bill Type <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="client_bill_type"
                      selectedValue={
                        clientBillTypeOptions?.filter(
                          (item) => item.value === getValues("client_bill_type")
                        )[0] || {}
                      }
                      handleOnChange={(e) => {
                        console.log(e);
                        setValue("client_bill_type", e.value, {
                          shouldValidate: true,
                        });
                      }}
                      selectDisable={InputDisableFunction()}
                      options={clientBillTypeOptions || []}
                      label=""
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              <Box>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">
                    Gst Applicable <span style={{ color: "red" }}>*</span>
                  </Text>
                  <RadioGroup
                    p="0"
                    // isDisabled={getValues("form_edit")}
                    defaultValue={details?.is_gst_applicable ? "true" : "false"}
                    name="is_gst_applicable"
                    onChange={(e) => {
                      console.log("is_gst_applicable", e);
                      setValue("is_gst_applicable", e, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <Stack spacing={5} direction="row">
                      <Radio colorScheme="radioBoxPrimary" value={"true"}>
                        Yes
                      </Radio>
                      <Radio colorScheme="radioBoxPrimary" value={"false"}>
                        No
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Grid>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Expected quantity(MT)
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="expected_quantity"
                      InputDisabled={InputDisableFunction()}
                      placeholder="Expected quantity(MT)"
                      type="number"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
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
                  >
                    <Text textAlign="right">
                      Expected no of bags
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="expected_no_of_bags"
                      InputDisabled={InputDisableFunction()}
                      placeholder="Expected no of bags"
                      type="number"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              <Box
                mt="4"
                backgroundColor={"aqua.100"}
                borderRadius={"lg"}
                padding={"4"}
              >
                <Text fontWeight={"700"} mb="10px">
                  Commodity Rate Details<span style={{ color: "red" }}>*</span>
                </Text>
                <Grid templateColumns={templateColumns} gap={5}>
                  {/* Commodity name */}
                  <Box>
                    <Text>Commodity Name</Text>
                    <ReactSelect
                      options={selectBoxOptions?.community || []}
                      onChange={(e) => {
                        setCommodityDetails((old) => ({
                          ...old,
                          commodity: e.value,
                          bag_size: "",
                          pbpm_rate: "",
                          rate: "",
                        }));
                      }}
                      isDisabled={InputDisableFunction()}
                      value={
                        selectBoxOptions?.community?.filter(
                          (item) => item.value === commodityDetails.commodity
                        )[0] || {}
                      }
                      isLoading={getCommodityMasterApiIsLoading}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: commodityError.commodity
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </Box>

                  {/* Bag Size */}
                  {getValues("storage_rate_on") !== "MT" ? (
                    <Box>
                      <Text>Bag Size</Text>
                      <ReactSelect
                        options={
                          selectBoxOptions?.community_bag?.filter(
                            (item) =>
                              item.commodity === commodityDetails.commodity
                          ) || []
                        }
                        onChange={(e) => {
                          setCommodityDetails((old) => ({
                            ...old,
                            bag_size: e.value,
                          }));
                        }}
                        isDisabled={InputDisableFunction()}
                        value={
                          selectBoxOptions?.community_bag?.filter(
                            (item) => item.value === commodityDetails.bag_size
                          )[0] || {}
                        }
                        isLoading={getCommodityBagMasterApiIsLoading}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "#fff",
                            borderRadius: "6px",
                            borderColor: commodityError.bag_size
                              ? "red"
                              : "#c3c3c3",

                            padding: "1px",
                            textAlign: "left",
                          }),
                          ...reactSelectStyle,
                        }}
                      />
                    </Box>
                  ) : (
                    <Box></Box>
                  )}

                  <Box
                    alignSelf={"center"}
                    display="flex"
                    gap={2}
                    mt="10px"
                    justifyContent="flex-end"
                    // mt="10"
                    px="0"
                  >
                    <Button
                      type="button"
                      //w="full"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      isDisabled={InputDisableFunction()}
                      // my={"4"}
                      px={"10"}
                      onClick={() => {
                        PBPMLogic();
                      }}
                    >
                      Check PBPM
                    </Button>
                  </Box>
                </Grid>
                <Grid templateColumns={templateColumns} gap={5} mt="5">
                  {/* PBPM Rate */}
                  <Box>
                    <Text>PBPM Rate</Text>
                    <Input
                      placeholder="PBPM Rate"
                      value={commodityDetails.pbpm_rate}
                      onChange={(e) =>
                        setCommodityDetails((old) => ({
                          ...old,
                          pbpm_rate: e.target.value,
                        }))
                      }
                      step={0.01}
                      isDisabled={true}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: commodityError.pbpm_rate
                          ? "red"
                          : "#c3c3c3",
                      }}
                    />
                    {commodityError.pbpm_rate ? (
                      <Text color="red" textAlign={"left"} fontSize={"10px"}>
                        Please Click PBPM Check Button to get PBPM rate.{" "}
                      </Text>
                    ) : (
                      <></>
                    )}
                  </Box>
                  {/* Rate */}
                  <Box>
                    <Text>Rate</Text>
                    <Input
                      placeholder="Rate"
                      value={commodityDetails.rate}
                      onChange={(e) =>
                        setCommodityDetails((old) => ({
                          ...old,
                          rate: e.target.value,
                        }))
                      }
                      step={0.01}
                      isDisabled={InputDisableFunction()}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: commodityError.rate ? "red" : "#c3c3c3",
                      }}
                    />
                  </Box>
                  <Box
                    alignSelf={"center"}
                    display="flex"
                    gap={2}
                    mt="10px"
                    justifyContent="flex-end"
                    // mt="10"
                    px="0"
                  >
                    <Button
                      type="button"
                      //w="full"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      isDisabled={InputDisableFunction()}
                      // my={"4"}
                      px={"10"}
                      onClick={() => {
                        if (updateCommodity === null) {
                          AddCommodityDetails();
                        } else {
                          EditCommodityDetail();
                        }
                      }}
                    >
                      {updateCommodity === null ? "Add" : "Update"}
                    </Button>
                  </Box>
                </Grid>
              </Box>

              <Box mt="6">
                <TableContainer border={"none"}>
                  <Table variant="simple">
                    <Thead backgroundColor={"aqua.100"}>
                      <Tr>
                        <Th border={"none"} color="#000">
                          Sr no
                        </Th>
                        <Th border={"none"} color="#000">
                          Commodity name
                        </Th>
                        <Th border={"none"} color="#000">
                          Bag Size
                        </Th>
                        <Th border={"none"} color="#000">
                          PBPM Rate
                        </Th>
                        <Th border={"none"} color="#000">
                          Rate
                        </Th>
                        <Th border={"none"} color="#000">
                          Action
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {(getValues("contractcommodity")?.length > 0 &&
                        getValues("contractcommodity")?.map((item, ind) => (
                          <Tr key={`table_${ind}`} textAlign={"center"}>
                            <Td>{ind + 1}</Td>
                            <Td textAlign={"center"}>
                              {selectBoxOptions?.community?.filter(
                                (item2) => item2.value === item.commodity
                              )[0]?.label || "-"}
                            </Td>
                            <Td textAlign={"center"}>
                              {selectBoxOptions?.community_bag?.filter(
                                (item2) => item2.value === item.bag_size
                              )[0]?.label || "-"}
                            </Td>
                            <Td textAlign={"center"}>
                              {item?.pbpm_rate || "0"}
                            </Td>
                            <Td textAlign={"center"}>{item?.rate || "-"}</Td>
                            <Td>
                              <Grid
                                templateColumns={"repeat(2, 1fr)"}
                                gap={"4"}
                              >
                                <Box color="primary.700">
                                  <BiEditAlt
                                    fontSize="26px"
                                    onClick={() => {
                                      if (InputDisableFunction()) {
                                      } else {
                                        setUpdateCommodity(ind);
                                        EditAbleCommodity(item);
                                      }
                                    }}
                                    cursor="pointer"
                                  />
                                </Box>
                                <Box color={"red"}>
                                  <AiOutlineDelete
                                    fontSize="26px"
                                    cursor="pointer"
                                    onClick={() => {
                                      if (InputDisableFunction()) {
                                      } else {
                                        if (updateCommodity === null) {
                                          DeleteCommodity(ind);
                                        }
                                      }
                                    }}
                                  />
                                </Box>
                              </Grid>
                            </Td>
                          </Tr>
                        ))) || (
                        <Tr>
                          <Td colSpan={"6"}>No Data Found</Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>

              {errors?.contractcommodity ? (
                <Text color="red">{errors?.contractcommodity?.message}</Text>
              ) : (
                <></>
              )}

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Fumigation by go green{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="fumigation_by_gogreen"
                      label=""
                      selectedValue={
                        fumigationByOptions?.filter(
                          (item) =>
                            item.value === getValues("fumigation_by_gogreen")
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      handleOnChange={(e) => {
                        setValue("fumigation_by_gogreen", e.value, {
                          shouldValidate: true,
                        });
                      }}
                      options={fumigationByOptions || []}
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
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
                      insurance by <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="insurance_by"
                      options={insuranceByOptions || []}
                      label=""
                      selectedValue={
                        insuranceByOptions?.filter(
                          (item) => item.value === getValues("insurance_by")
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      handleOnChange={(e) => {
                        setValue("insurance_by", e.value, {
                          shouldValidate: true,
                        });
                      }}
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {getValues("insurance_by") === "bank" ? (
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">
                        Bank <span style={{ color: "red" }}>*</span>
                      </Text>
                      <ReactCustomSelect
                        name="bank"
                        options={selectBoxOptions?.banks || []}
                        label=""
                        selectedValue={
                          selectBoxOptions?.banks?.filter(
                            (item) => item.value === getValues("bank")
                          )[0] || {}
                        }
                        selectDisable={InputDisableFunction()}
                        handleOnChange={(e) => {
                          setValue("bank", e.value, {
                            shouldValidate: true,
                          });
                        }}
                        isClearable={false}
                        isLoading={getBankMasterApiIsLoading}
                        selectType="label"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>
              ) : (
                <></>
              )}

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      QC charges by go green{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      name="qc_charges_by_gogreen"
                      options={qcChangesByOptions || []}
                      label=""
                      selectedValue={
                        qcChangesByOptions?.filter(
                          (item) =>
                            item.value === getValues("qc_charges_by_gogreen")
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      handleOnChange={(e) => {
                        setValue("qc_charges_by_gogreen", e.value, {
                          shouldValidate: true,
                        });
                      }}
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
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
                  >
                    <Text textAlign="right">
                      Minimum billing charge
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="minimum_billing_charge"
                      InputDisabled={InputDisableFunction()}
                      placeholder=" Minimum billing charge"
                      type="number"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
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
                      Billing Cycle <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="billing_cycle"
                      options={billingCycle || []}
                      label=""
                      selectedValue={
                        billingCycle?.filter(
                          (item) => item.value === getValues("billing_cycle")
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      handleOnChange={(e) => {
                        setValue("billing_cycle", e.value, {
                          shouldValidate: true,
                        });
                      }}
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              <Box>
                <Text fontWeight={"700"} mb="10px">
                  Service contract details :{" "}
                </Text>
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
                      Service Contract Start Date
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Input
                      type="date"
                      border="1px"
                      // borderColor={
                      //   agreementError.agreement_end_date ? "red" : "gray.10"
                      // }
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      disabled={InputDisableFunction()}
                      // min={moment(new Date()).format("YYYY-MM-DD")}
                      value={getValues("service_contract_start_date")}
                      onChange={(e) => {
                        setValue(
                          "service_contract_start_date",
                          e.target.value,
                          {
                            shouldValidate: true,
                          }
                        );

                        setValue(
                          "service_contract_end_date",
                          moment(e.target.value)
                            .add(11, "months")
                            .format("YYYY-MM-DD"),
                          {
                            shouldValidate: true,
                          }
                        );
                        setValue(
                          "service_contract_billing_end_date",
                          e.target.value,
                          {
                            shouldValidate: true,
                          }
                        );
                      }}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Agreement Start Date"
                    />
                    {/* <CustomInput
                      name="service_contract_start_date"
                      placeholder="Start Date"
                      inputValue={getValues("service_contract_start_date")}
                      min={}
                      onChange={(e) => {
                        setValue(
                          "service_contract_start_date",
                          e.target.value,
                          {
                            shouldValidate: true,
                          }
                        );
                        setValue(
                          "service_contract_end_date",
                          moment(e.target.value)
                            .add(11, "months")
                            .format("YYYY-MM-DD"),
                          {
                            shouldValidate: true,
                          }
                        );
                      }}
                      InputDisabled={InputDisableFunction()}
                      type="date"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    /> */}
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
                      Service Contract End Date
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="service_contract_end_date"
                      placeholder="End Date"
                      type="date"
                      InputDisabled={InputDisableFunction()}
                      inputValue={getValues("service_contract_end_date")}
                      onChange={(e) => {
                        setValue("service_contract_end_date", e.target.value, {
                          shouldValidate: true,
                        });
                        setValue(
                          "service_contract_billing_end_date",
                          e.target.value,
                          {
                            shouldValidate: true,
                          }
                        );
                      }}
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
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
                      Service Contract Billing End Date
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Input
                      type="date"
                      name="service_contract_billing_end_date"
                      {...register("service_contract_billing_end_date")}
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      value={getValues("service_contract_end_date")}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={true}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      //onChange={(e) => handleEndDateChange(e)}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Service Contract Billing End Date"
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              <Box>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">
                    Upload signed Service Contract
                    <span style={{ color: "red" }}>*</span>
                  </Text>
                  <CustomFileInput
                    maxSize={2}
                    type="application/pdf, image/jpeg, image/png, image/jpg, application/msword"
                    defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                    placeholder="Agreement upload"
                    name={""}
                    InputDisabled={InputDisableFunction()}
                    value={""}
                    onChange={(e) => {
                      console.log(
                        getValues("upload_signed_service_contract"),
                        "upload"
                      );
                      console.log(e, "upload change");
                      setValue(
                        "upload_signed_service_contract",
                        [...getValues("upload_signed_service_contract"), e],
                        {
                          shouldValidate: true,
                        }
                      );
                      console.log(getValues("upload_signed_service_contract"));
                    }}
                    label=""
                    fileuplaod_folder_structure={{
                      type: "Service Contract",
                      subtype: "Wms",
                    }}
                    showErr={
                      errors?.upload_signed_service_contract ? true : false
                    }
                    style={{
                      mb: 1,
                      mt: 1,
                    }}
                  />
                </Grid>
              </Box>
            </Box>

            <Grid
              textAlign="right"
              alignItems="start"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}></GridItem>
              <GridItem colSpan={{ base: 1 }} textAlign="left">
                {getValues("upload_signed_service_contract")?.length > 0 ? (
                  getValues("upload_signed_service_contract")?.map(
                    (item, index) => (
                      <Flex
                        justifyContent={"space-between"}
                        gap={5}
                        key={index}
                      >
                        <Box>
                          {item?.split("/")[item?.split("/")?.length - 1]}
                        </Box>
                        <Flex gap={2}>
                          <BiDownload
                            fontSize="26px"
                            cursor="pointer"
                            onClick={() => {
                              window.open(
                                `${configuration.BASE_URL}${item || ""}`,
                                "_blank"
                              );
                            }}
                          />
                          <AiOutlineDelete
                            cursor="pointer"
                            fontSize="26px"
                            onClick={() => {
                              if (InputDisableFunction()) {
                                // Handle form edit logic if needed
                              } else {
                                setValue(
                                  "upload_signed_service_contract",
                                  getValues(
                                    "upload_signed_service_contract"
                                  ).filter((item2, index2) => index !== index2),
                                  { shouldValidate: true }
                                );
                              }
                            }}
                          />
                        </Flex>
                      </Flex>
                    )
                  )
                ) : (
                  <></>
                )}
              </GridItem>
            </Grid>

            <Box>
              {Number(details?.status?.status_code || 0) > 0 ? (
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
                          value={details?.l1_user?.employee_name || ""}
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
                          value={details?.l1_user?.phone || ""}
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
              {Number(details?.status?.status_code || 0) > 2 ? (
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
                          value={details?.l2_user?.employee_name || ""}
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
                          value={details?.l2_user?.phone || ""}
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
              {Number(details?.status?.status_code || 0) > 5 ? (
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
                          value={details?.l3_user?.employee_name || ""}
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
                          value={details?.l3_user?.phone || ""}
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
              {Number(details?.status?.status_code || 0) === 2 ||
              Number(details?.status?.status_code || 0) === 4 ||
              Number(details?.status?.status_code || 0) === 2 ||
              Number(details?.status?.status_code || 0) === 7 ? (
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
                          borderColor={rejectError ? "red" : "gray.10"}
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          value={rejectReason}
                          onChange={(e) => {
                            setRejectReason(e.target.value);
                          }}
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
              {Number(details?.status?.status_code || 0) === 1 ||
              Number(details?.status?.status_code || 0) === 3 ? (
                <Button
                  type="button"
                  backgroundColor={"primary.700"}
                  _hover={{ backgroundColor: "primary.700" }}
                  color={"white"}
                  borderRadius={"full"}
                  isDisabled={pageView}
                  // isDisabled={view}
                  isLoading={updateAssignServiceMasterApiIsLoading}
                  onClick={() => {
                    assignToMeFunction();
                  }}
                  px={"10"}
                >
                  Assign to me
                </Button>
              ) : (
                <></>
              )}
              {Number(details?.status?.status_code || 0) === 2 ||
              Number(details?.status?.status_code || 0) === 5 ? (
                <>
                  <Button
                    type="button"
                    // type="submit"
                    //w="full"
                    isDisabled={InputDisableFunction()}
                    backgroundColor={"white"}
                    _hover={{ backgroundColor: "white" }}
                    color={"#F82F2F"}
                    borderRadius={"full"}
                    border="1px solid #F82F2F"
                    onClick={() => {
                      if (rejectReason?.length > 0) {
                        rejectedToMeFunction({ status: "rejected" });
                        setRejectError(false);
                      } else {
                        setRejectError(true);
                      }
                    }}
                    // isDisabled={rejectReason || !view ? false : true}
                    isLoading={updateAssignServiceMasterApiIsLoading}
                    px={"10"}
                  >
                    Reject
                  </Button>
                  <Button
                    type="submit"
                    // onClick={() => {
                    //   ApproveRejectFunction({ status: "approved" });
                    // }}
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    isDisabled={InputDisableFunction()}
                    borderRadius={"full"}
                    // isDisabled={view ? true : false}
                    isLoading={
                      updateAssignServiceMasterApiIsLoading ||
                      updateServiceContractApiIsLoading
                    }
                    px={"10"}
                  >
                    Approve
                  </Button>
                </>
              ) : (
                <></>
              )}
              {Number(details?.status?.status_code || 0) < 1 ? (
                <Button
                  type="submit"
                  //w="full"
                  isLoading={
                    addServiceContractApiIsLoading ||
                    updateServiceContractApiIsLoading
                  }
                  isDisabled={pageView}
                  backgroundColor={"primary.700"}
                  _hover={{ backgroundColor: "primary.700" }}
                  color={"white"}
                  borderRadius={"full"}
                  // my={"4"}
                  px={"10"}
                >
                  Submit
                </Button>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}

export default AddEditServiceContractWms;
