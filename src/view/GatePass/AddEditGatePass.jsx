/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Flex,
  FormControl,
  Grid,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MotionSlideUp } from "../../utils/animation";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./fields";
import {
  useGetChamberFreeMutation,
  useGetClientMasterFreeTypeMutation,
  useGetCommodityFreeMasterMutation,
  useGetCommodityVarityFreeMasterMutation,
  useGetStackFreeMasterMutation,
  useGetWareHouseFreeMutation,
} from "../../features/master-api-slice";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import ReactSelect from "react-select";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import { EditIcon } from "@chakra-ui/icons";
import CustomInput from "../../components/Elements/CustomInput";
import { AiOutlineDelete } from "react-icons/ai";
import { BiDownload, BiEditAlt } from "react-icons/bi";
import { LeftIcon, RightIcon } from "../../components/Icons/Icons";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import {
  usePostGatePassMutation,
  useGetGatePassByIdMutation,
  usePutGatePassMutation,
} from "../../features/gate-pass.slice";
import moment from "moment";
import { useGetServiceContractFreeMutation } from "../../features/service-contract-api.slice";
import { setSidebarVisibility } from "../../features/filter.slice";
import ROUTE_PATH from "../../constants/ROUTE";
import configuration from "../../config/configuration";
import { localStorageService } from "../../services/localStorge.service";

const inputStyle = {
  height: "40px",
  backgroundColor: "white",
  borderRadius: "lg",
  _placeholder: {
    color: "gray.300",
  },
  _hover: {
    borderColor: "primary.700",
    backgroundColor: "primary.200",
  },
  _focus: {
    borderColor: "primary.700",
    backgroundColor: "primary.200",
    boxShadow: "none",
  },
  p: { base: "4" },
  fontWeight: { base: "normal" },
  fontStyle: "normal",
};

const FONT_SIZE_CONFIG_OBJ = {
  md: 14,
  sm: 14,
};

function AddEditGatePass() {
  const dispatch = useDispatch();
  const location = useLocation();
  const urlPrams = useParams();
  const navigate = useNavigate();

  console.log("urlPrams: ", urlPrams);

  const loginData = localStorageService.get("GG_ADMIN");

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      gate_pass_date_time_in: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      gate_pass_date_time_out: moment(new Date()).format("YYYY-MM-DDTHH:mm"),

      weighbridge_slip_datetime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      gate_pass_type: "inward",
      truck_image: [],
      gate_pass_stack_details: [],
      sampler_name: loginData?.userDetails?.employee_name || "",
    },
  });

  const { setValue, getValues, formState } = methods;

  console.log("Default Values:", methods.getValues(), formState?.errors);
  //const details = location.state?.details;
  const formUrl = location.state?.from || null;

  const details = { id: urlPrams?.id };
  console.log(details);

  let radioBtnCondition = getValues("gate_pass_type");
  console.log("radioBtnCondition: ", radioBtnCondition);

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

  const [selectBoxOptions, setSelectBoxOptions] = useState({});
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Warehouse Master start

  const [getWarehouseMaster, { isLoading: getWarehouseMasterApiIsLoading }] =
    useGetWareHouseFreeMutation();

  const getWarehouseMasterList = async () => {
    try {
      const response = await getWarehouseMaster().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          warehouse: response?.data?.map(
            ({ warehouse_name, id, weighbridge_name }) => ({
              label: warehouse_name,
              value: id,
              weighbridge_name: weighbridge_name,
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

  useEffect(() => {
    getChamberMasterList();
  }, [getValues("warehouse")]);

  // Warehouse Master end

  // Chamber Master start

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

  // Chamber Master end

  // Commodity Master start

  const [getCommodityMaster, { isLoading: getCommodityMasterApiIsLoading }] =
    useGetCommodityFreeMasterMutation();

  const getCommodityMasterList = async () => {
    try {
      const response = await getCommodityMaster(
        "?filter=contractcommodity__service_contract__contractwarehousechamber__warehouse__id&contractcommodity__service_contract__contractwarehousechamber__warehouse__id=" +
          getValues("warehouse") +
          "&filter=contractcommodity__service_contract__contractwarehousechamber__chamber__id&contractcommodity__service_contract__contractwarehousechamber__chamber__id=" +
          getValues("chamber") +
          "&filter=contractcommodity__service_contract__client__id&contractcommodity__service_contract__client__id=" +
          getValues("client")
      ).unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          community: response?.data?.map(
            ({ commodity_name, id, quality_parameter }) => ({
              label: commodity_name,
              value: id,
              quality_parameter: quality_parameter,
            })
          ),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (getValues("warehouse") && getValues("chamber") && getValues("client")) {
      getCommodityMasterList();
    }
  }, [getValues("warehouse"), getValues("chamber"), getValues("client")]);

  // Commodity Master end

  // Commodity Quality Logic start

  const [qualityCommodity, setQualityCommodity] = useState([]);

  useEffect(() => {
    if (filledForm) {
      setFilledForm(false);
    } else {
      let tempQuality2 = selectBoxOptions?.community?.filter(
        (item) => item.value === getValues("commodity")
      )[0]?.quality_parameter;

      const uniqueSet = new Set();
      const uniqueObjects = [];

      // Custom function to determine object uniqueness
      function isUnique(obj) {
        const key = `${JSON.stringify(obj.id)}`;
        if (!uniqueSet.has(key)) {
          uniqueSet.add(key);
          return true;
        }
        return false;
      }

      // Iterate through the question array and add unique objects to uniqueObjects
      tempQuality2?.forEach((item) => {
        console.log(item, "item");
        if (isUnique(item.quality_parameter)) {
          uniqueObjects.push(item);
        }
      });

      console.log(uniqueObjects);

      const tempQuality = uniqueObjects?.map((item) => ({
        quality_parameter: item.quality_parameter,
        parameter_value: "",
      }));

      setQualityCommodity(tempQuality);

      setValue("gate_pass_commodity_quality", tempQuality, {
        shouldValidate: true,
      });
    }
  }, [getValues("commodity")]);

  // Commodity Quality Logic end

  // Commodity Varity start

  const [getCommodityVarity, { isLoading: getCommodityVarityApiIsLoading }] =
    useGetCommodityVarityFreeMasterMutation();

  const getCommodityVarityList = async () => {
    try {
      const response = await getCommodityVarity().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          communityVariety: response?.data?.map(
            ({ commodity_variety, id, commodity_id }) => ({
              label: commodity_variety,
              value: id,
              commodity_id: commodity_id?.id,
            })
          ),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getCommodityVarityList();
  }, []);

  // Commodity Varity end

  // Client Master start

  const [getClientMaster, { isLoading: getClientMasterApiIsLoading }] =
    useGetClientMasterFreeTypeMutation();

  const getClientMasterList = async () => {
    try {
      const response = await getClientMaster(
        "?filter=servicecontract__contractwarehousechamber__warehouse__id&servicecontract__contractwarehousechamber__warehouse__id=" +
          getValues("warehouse") +
          "&filter=servicecontract__contractwarehousechamber__chamber__id&servicecontract__contractwarehousechamber__chamber__id=" +
          getValues("chamber")
      ).unwrap();
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
    if (getValues("warehouse") && getValues("chamber")) {
      getClientMasterList();
    }
  }, [getValues("warehouse"), getValues("chamber")]);

  // Client Master end

  // Service Contract Master start

  const [getServiceContractMaster] = useGetServiceContractFreeMutation();

  const getServiceContractMasterList = async () => {
    try {
      const response = await getServiceContractMaster(
        "?filter=client&client=" +
          getValues("client") +
          "&filter=warehouse&warehouse=" +
          getValues("warehouse") +
          "&filter=chamber&chamber=" +
          getValues("chamber") +
          "&filter=commodity&commodity=" +
          getValues("commodity")
      ).unwrap();
      console.log("getServiceContractMasterList Success:", response);
      if (response.status === 200) {
        setValue("service_contract", response?.data?.id, {
          shouldValidate: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (
      getValues("warehouse") &&
      getValues("chamber") &&
      getValues("client") &&
      getValues("commodity")
    ) {
      getServiceContractMasterList();
    }
  }, [
    getValues("warehouse"),
    getValues("chamber"),
    getValues("client"),
    getValues("commodity"),
  ]);

  // Service Contract Master end

  // Modal Logic start

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const [imageNumber, setImageNumber] = useState(0);

  const ImageDelete = () => {
    setValue(
      "truck_image",
      getValues("truck_image").filter((item2, index) => imageNumber !== index),
      { shouldValidate: true }
    );
  };

  // Modal Logic end

  // Commodity Master start

  const [getStackList, { isLoading: getStackMasterApiIsLoading }] =
    useGetStackFreeMasterMutation();

  const getStackMasterList = async () => {
    try {
      const response = await getStackList(
        "?client=" +
          getValues("client") +
          "&chamber=" +
          getValues("chamber") +
          "&commodity=" +
          getValues("commodity")
      ).unwrap();
      console.log(" getStackMasterList Success:", response);
      setSelectBoxOptions((prev) => ({
        ...prev,
        stack:
          response?.data?.map((item) => ({
            label: item,
            value: item,
          })) || [],
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (getValues("commodity") && getValues("chamber") && getValues("client")) {
      getStackMasterList();
    }
  }, [getValues("commodity"), getValues("chamber"), getValues("client")]);

  // Commodity Master end

  // Net Weight Logic start

  useEffect(() => {
    if (getValues("gross_weight_kg") && getValues("tare_weight")) {
      setValue(
        "net_weight",
        Number(getValues("gross_weight_kg") || 0) -
          Number(getValues("tare_weight") || 0),
        {
          shouldValidate: true,
        }
      );
    } else {
      setValue("net_weight", 0, {
        shouldValidate: true,
      });
    }
  }, [getValues("gross_weight_kg"), getValues("tare_weight")]);

  // Net Weight Logic end

  // Stack Details Logic start

  const [weight, setWeight] = useState(0);

  useEffect(() => {
    if (getValues("net_weight") && getValues("total_no_of_bags")) {
      setWeight(
        Number(getValues("net_weight") || 0) /
          Number(getValues("total_no_of_bags") || 0).toFixed(2)
      );
      setStackDetail((old) => ({
        ...old,
        actual_bag_weight:
          Number(getValues("net_weight") || 0) /
          Number(getValues("total_no_of_bags") || 0).toFixed(2),
      }));
      const temp = getValues("gate_pass_stack_details");
      setValue(
        "gate_pass_stack_details",
        temp.map((item) => ({
          select_stack_no: item.select_stack_no,
          lot_no: item.lot_no,
          no_of_bags: item.no_of_bags,
          actual_bag_weight:
            Number(getValues("net_weight") || 0) /
            Number(getValues("total_no_of_bags") || 0).toFixed(2),
          weight_in_stack:
            Number(item.no_of_bags) *
            (Number(getValues("net_weight") || 0) /
              Number(getValues("total_no_of_bags") || 0).toFixed(2)),
          upload_stack_image: item.upload_stack_image,
        })),
        {
          shouldValidate: true,
        }
      );
    }
  }, [getValues("net_weight"), getValues("total_no_of_bags")]);

  const [stackDetail, setStackDetail] = useState({
    select_stack_no: "",
    lot_no: "",
    no_of_bags: "",
    actual_bag_weight: weight,
    weight_in_stack: "",
    upload_stack_image: "",
  });

  const [stackError, setStackError] = useState({
    select_stack_no: "",
    lot_no: "",
    no_of_bags: "",
    actual_bag_weight: "",
    weight_in_stack: "",
    upload_stack_image: "",
  });

  const stackDetailClean = () => {
    setStackDetail({
      select_stack_no: "",
      lot_no: "",
      no_of_bags: "",
      actual_bag_weight: weight,
      weight_in_stack: "",
      upload_stack_image: "",
    });
  };

  const stackErrorClean = () => {
    setStackError({
      select_stack_no: "",
      lot_no: "",
      no_of_bags: "",
      actual_bag_weight: "",
      weight_in_stack: "",
      upload_stack_image: "",
    });
  };

  const stackCheckCondition = () => {
    return (
      stackDetail.select_stack_no !== "" &&
      stackDetail.select_stack_no > 0 &&
      stackDetail.select_stack_no < 101 &&
      stackDetail.no_of_bags !== "" &&
      stackDetail.no_of_bags > 0 &&
      stackDetail.actual_bag_weight !== "" &&
      // stackDetail.actual_bag_weight > 0 &&
      stackDetail.weight_in_stack !== "" &&
      // stackDetail.weight_in_stack > 0 &&
      stackDetail.upload_stack_image !== ""
    );
  };

  const stackErrorFilling = () => {
    setStackError({
      select_stack_no:
        stackDetail.select_stack_no === ""
          ? "Error"
          : Number(stackDetail.select_stack_no || 0) < 0 ||
            Number(stackDetail.select_stack_no || 0) > 101
          ? "Stack no should be in between 1 to 100"
          : "",
      no_of_bags:
        stackDetail.no_of_bags === ""
          ? "Error"
          : stackDetail.no_of_bags < 0
          ? "No of Bags should be should be greater than 0"
          : "",
      actual_bag_weight:
        stackDetail.actual_bag_weight === ""
          ? "Error"
          : stackDetail.actual_bag_weight < 0
          ? "Bag Weight should be should be greater than 0"
          : "",
      weight_in_stack:
        stackDetail.weight_in_stack === ""
          ? "Error"
          : stackDetail.weight_in_stack < 0
          ? "No of Bags should be should be greater than 0"
          : "",
      upload_stack_image: stackDetail.upload_stack_image === "" ? "Error" : "",
    });
  };

  const [updateStackId, setUpdateStackId] = useState(null);

  useEffect(() => {
    if (stackDetail.no_of_bags > 0 && stackDetail.actual_bag_weight > 0) {
      let temp =
        Number(stackDetail.no_of_bags || 0) *
        Number(stackDetail.actual_bag_weight || 0);
      setStackDetail((old) => ({
        ...old,
        weight_in_stack: temp,
      }));
    } else {
      setStackDetail((old) => ({
        ...old,
        weight_in_stack: 0,
      }));
    }
  }, [stackDetail.no_of_bags, stackDetail.actual_bag_weight]);

  const AddStackDetails = () => {
    if (stackCheckCondition()) {
      const temp = getValues("gate_pass_stack_details");
      setValue("gate_pass_stack_details", [...temp, stackDetail], {
        shouldValidate: true,
      });
      stackErrorClean();
      stackDetailClean();
    } else {
      stackErrorFilling();
    }
  };

  const updateStackData = (data, id) => {
    setUpdateStackId(id);
    setStackDetail({
      select_stack_no: data.select_stack_no,
      lot_no: data.lot_no,
      no_of_bags: data.no_of_bags,
      actual_bag_weight: data.actual_bag_weight,
      weight_in_stack: data.weight_in_stack,
      upload_stack_image: data.upload_stack_image,
    });
  };

  const updateStackDetails = () => {
    if (stackCheckCondition()) {
      const temp = getValues("gate_pass_stack_details");
      setValue(
        "gate_pass_stack_details",
        [
          ...temp.slice(0, updateStackId),
          stackDetail,
          ...temp.slice(updateStackId + 1),
        ],
        {
          shouldValidate: true,
        }
      );
      setUpdateStackId(null);
      stackErrorClean();
      stackDetailClean();
    } else {
      stackErrorFilling();
    }
  };

  // Stack Details Logic end

  // new Weighbridge Logic start

  const [emailCheck, setEmailCheck] = useState(false);

  // new Weighbridge Logic end

  // Form Submit Function Start

  const onSubmit = (data) => {
    if (isReadOnly) {
      return false;
    }

    let arr = getValues("gate_pass_stack_details") || [];
    console.log(arr);
    const total_no_of_bags = parseInt(getValues("total_no_of_bags"));
    console.log(total_no_of_bags);

    const total_stack_no_of_bags = arr.reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue?.no_of_bags);
    }, 0);

    console.log(total_stack_no_of_bags);

    if (total_stack_no_of_bags !== total_no_of_bags) {
      showToastByStatusCode(
        400,
        "Total no of bags is now equal to total stack no of bags"
      );

      return false;
    }

    const temp = qualityCommodity.map((item) => ({
      quality_parameter: item?.quality_parameter?.id || 0,
      parameter_value: item?.parameter_value || null,
    }));

    if (emailCheck) {
      if (data?.new_weighbridge_name?.length > 0) {
      } else {
        toasterAlert({
          message: "Please Add New Weighbridge Name",
          status: 440,
        });
        return;
      }
    } else {
      if (data?.weighbridge_name?.length > 0) {
      } else {
        toasterAlert({
          message: "Please Weighbridge Name OR New Weighbridge Name",
          status: 440,
        });
        return;
      }
    }

    if (data?.id) {
      updateData({
        ...data,
        id: data?.id,
        is_draft: false,

        gate_pass_commodity_quality: temp,
        current_used_stack: {
          chamber: getValues("chamber"),
          client: getValues("client"),
          commodity: getValues("commodity"),
          used_stack: getValues("gate_pass_stack_details").map(
            (item) => item.select_stack_no
          ),
        },
      });
    } else {
      addData({
        ...data,
        is_draft: false,
        gate_pass_commodity_quality: temp,
        current_used_stack: {
          chamber: getValues("chamber"),
          client: getValues("client"),
          commodity: getValues("commodity"),
          used_stack: getValues("gate_pass_stack_details").map(
            (item) => item.select_stack_no
          ),
        },
      });
    }
  };

  // Add Gate Pass Api Start

  const [addGatePassMaster, { isLoading: addGatePassLoading }] =
    usePostGatePassMutation();

  const addData = async (data) => {
    try {
      const response = await addGatePassMaster(data).unwrap();
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.GATE_PASS_INWARD}`);
      }
      console.log("update region master res", response);
    } catch (error) {
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "GatePass Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Add Gate Pass Api End

  // Update Gate pass Api Start

  const [updateGatePassMaster, { isLoading: updateGatePassLoading }] =
    usePutGatePassMutation();

  const updateData = async (data) => {
    try {
      const response = await updateGatePassMaster({
        ...data,
        id: details.id,
      }).unwrap();
      if (response.status === 200) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.GATE_PASS_INWARD}`);
      }
      // console.log("update region master res", response);
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "GatePass Request Failed.";
      // console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Update Gate Pass Api End

  //Edit Form Fill Logic Start

  const [getGatePassById] = useGetGatePassByIdMutation();

  const [filledForm, setFilledForm] = useState(false);

  const autoFillForm = async () => {
    if (urlPrams?.id) {
      let form_details = {};
      try {
        const response = await getGatePassById(urlPrams?.id).unwrap();
        console.log(response);
        if (response?.status === 200) {
          console.log(response?.data?.is_draft);
          setIsReadOnly(!response?.data?.is_draft);
          form_details = response?.data;
          let obj = {
            id: form_details.id,
            gate_pass_type: form_details?.gate_pass_type,
            gate_pass_no: form_details?.gate_pass_no,
            gate_pass_date_time_in: form_details?.gate_pass_date_time_in
              ? moment(form_details?.gate_pass_date_time_in).format(
                  "YYYY-MM-DDTHH:mm:ss"
                )
              : null,
            gate_pass_date_time_out: form_details?.gate_pass_date_time_out
              ? moment(form_details?.gate_pass_date_time_out).format(
                  "YYYY-MM-DDTHH:mm:ss"
                )
              : null,
            warehouse: form_details?.warehouse?.id,
            chamber: form_details?.chamber?.id,
            client: form_details?.client?.id,
            client_representative_name:
              form_details?.client_representative_name,
            commodity: form_details?.commodity?.id,
            commodity_variety: form_details?.commodity_variety?.id,
            truck_no: form_details?.truck_no,
            truck_image: form_details?.truck_image,
            driver_name: form_details?.driver_name,
            upload_driver_photo: form_details?.upload_driver_photo,
            weighbridge_name: form_details?.weighbridge_name,
            upload_approval_email: form_details?.upload_approval_email,
            new_weighbridge_name: form_details?.new_weighbridge_name,
            weighbridge_slip_no: form_details?.weighbridge_slip_no,
            weighbridge_slip_datetime: form_details?.weighbridge_slip_datetime
              ? moment(form_details?.weighbridge_slip_datetime).format(
                  "YYYY-MM-DDTHH:mm:ss"
                )
              : null,
            upload_weighbridge_slip: form_details?.upload_weighbridge_slip,
            total_no_of_bags: form_details?.total_no_of_bags,
            gross_weight_kg: form_details?.gross_weight_kg,
            tare_weight: form_details?.tare_weight,
            net_weight: form_details?.net_weight,
            sample_seal_no: form_details?.sample_seal_no,
            sampler_name: form_details?.sampler_name,
            remarks: form_details?.remarks,

            gate_pass_stack_details: form_details?.gate_pass_stack_details,
            gate_pass_commodity_quality:
              form_details?.gate_pass_commodity_quality,
          };

          console.log("form_details obj ", obj);

          setQualityCommodity(form_details?.gate_pass_commodity_quality || []);

          setFilledForm(true);
          if (form_details?.upload_approval_email?.length > 0) {
            setEmailCheck(true);
          }

          // setHandleSelectBoxVal

          Object.keys(obj).forEach(function (key) {
            methods.setValue(key, obj[key], { shouldValidate: true });
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    console.log("query params -> ", location?.search);
    autoFillForm();

    // set breadcrumbArray
    const breadcrumbArray = [
      {
        title: " Gate Pass",
        link: `${ROUTE_PATH.GATE_PASS_INWARD}`,
      },
      // {
      //   title: "Gate Pass Details",
      //   link: "/gate-pass",
      // },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    console.log(formUrl);

    if (formUrl === null) {
      dispatch(setSidebarVisibility(false));
      setIsReadOnly(true);
    } else {
      dispatch(setBreadCrumb(breadcrumbArray));
      dispatch(setSidebarVisibility(true));
      setIsReadOnly(false);
    }
  }, [urlPrams?.id]);

  //Edit Form Fill Logic End

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  // Form Submit Function End

  // Draft Logic Start

  const DraftLogicFunction = async () => {
    try {
      const temp = qualityCommodity.map((item) => ({
        quality_parameter: item?.quality_parameter?.id || 0,
        parameter_value: item.parameter_value,
      }));

      const data = getValues();

      if (data?.id) {
        const response = await updateGatePassMaster({
          ...data,
          id: data?.id,
          is_draft: true,
          gate_pass_commodity_quality: temp,
          current_used_stack: {
            chamber: getValues("chamber"),
            client: getValues("client"),
            commodity: getValues("commodity"),
            used_stack: getValues("gate_pass_stack_details").map(
              (item) => item.select_stack_no
            ),
          },
        }).unwrap();
        if (response.status === 200) {
          setValue("id", response.data.id, {
            shouldValidate: true,
          });
          toasterAlert({
            message: "GatePass Drafted Successfully.",
            status: 200,
          });
        }
      } else {
        const response = await addGatePassMaster({
          ...data,
          is_draft: true,
          gate_pass_commodity_quality: temp,
          current_used_stack: {
            chamber: getValues("chamber"),
            client: getValues("client"),
            commodity: getValues("commodity"),
            used_stack: getValues("gate_pass_stack_details").map(
              (item) => item.select_stack_no
            ),
          },
        }).unwrap();
        if (response.status === 201) {
          setValue("id", response.data.id, {
            shouldValidate: true,
          });

          toasterAlert({
            message: "GatePass Drafted Successfully.",
            status: 200,
          });
        }
      }
    } catch (error) {
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "GatePass Draft Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Draft Logic End

  return (
    <Box bg="white" borderRadius={10} maxHeight="calc(100vh - 250px)">
      <Box bg="white" borderRadius={10} p="10">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">Gate Pass Type</Text>
                    <RadioGroup
                      isDisabled={details?.id || isReadOnly ? true : false}
                      value={getValues("gate_pass_type") || "inward"}
                      name={"gate_pass_type"}
                      onChange={(e) => {
                        setValue("gate_pass_type", e, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <Stack spacing={5} direction="row">
                        <Radio colorScheme="radioBoxPrimary" value={"inward"}>
                          Inward
                        </Radio>
                        <Radio colorScheme="radioBoxPrimary" value={"outward"}>
                          Outward
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* TODO condition check for render the ui for the inward or outward  */}
              {radioBtnCondition === "inward" ? (
                <>
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Gate Pass No</Text>

                        <CustomInput
                          type="text"
                          name="gate_pass_no"
                          placeholder={"Gate Pass No"}
                          InputDisabled={true}
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
                          Gate pass Date and In Time
                        </Text>

                        <CustomInput
                          type={"datetime-local"}
                          name="gate_pass_date_time_in"
                          placeholder={"Enter date & time"}
                          inputValue={getValues("gate_pass_date_time_in")}
                          InputDisabled={isReadOnly}
                          onChange={(e) => {
                            setValue("gate_pass_date_time_in", e.target.value, {
                              shouldValidate: true,
                            });
                            setValue("gate_pass_date_time_out", "", {
                              shouldValidate: true,
                            });
                          }}
                          // min={moment().format("YYYY-MM-DDTHH:mm")}
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
                          Gate pass Date and Out Time
                        </Text>

                        <CustomInput
                          type={"datetime-local"}
                          name="gate_pass_date_time_out"
                          placeholder={"Enter date & time"}
                          min={moment(
                            getValues("gate_pass_date_time_in")
                          ).format("YYYY-MM-DDTHH:mm")}
                          inputValue={
                            getValues("gate_pass_date_time_out") || ""
                          }
                          InputDisabled={isReadOnly}
                          onChange={(e) => {
                            console.log(e, "gate_pass_date_time_out");
                            setValue(
                              "gate_pass_date_time_out",
                              e.target.value,
                              {
                                shouldValidate: true,
                              }
                            );
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
                        <Text textAlign="right">Warehouse</Text>

                        <ReactCustomSelect
                          name="warehouse"
                          options={selectBoxOptions?.warehouse || []}
                          selectedValue={
                            selectBoxOptions?.warehouse?.filter(
                              (item) => item.value === getValues("warehouse")
                            )[0] || {}
                          }
                          selectDisable={isReadOnly}
                          isLoading={getWarehouseMasterApiIsLoading}
                          handleOnChange={(val) => {
                            setValue("warehouse", val.value, {
                              shouldValidate: true,
                            });
                            setValue("weighbridge_name", val.weighbridge_name, {
                              shouldValidate: true,
                            });
                            setValue("chamber", null, {
                              shouldValidate: true,
                            });
                            setValue("client", null, {
                              shouldValidate: true,
                            });
                            setValue("commodity", null, {
                              shouldValidate: true,
                            });
                            setValue("commodity_variety", null, {
                              shouldValidate: true,
                            });
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
                        <Text textAlign="right">Chamber</Text>

                        <ReactCustomSelect
                          name="chamber"
                          options={
                            selectBoxOptions?.chamber?.filter(
                              (item) =>
                                item.warehouse === getValues("warehouse")
                            ) || []
                          }
                          selectedValue={
                            selectBoxOptions?.chamber?.filter(
                              (item) => item.value === getValues("chamber")
                            )[0] || {}
                          }
                          selectDisable={isReadOnly}
                          isLoading={getChamberApiIsLoading}
                          handleOnChange={(val) => {
                            setValue("chamber", val.value, {
                              shouldValidate: true,
                            });
                            setValue("client", null, {
                              shouldValidate: true,
                            });
                            setValue("commodity", null, {
                              shouldValidate: true,
                            });
                            setValue("commodity_variety", null, {
                              shouldValidate: true,
                            });
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
                        <Text textAlign="right">Client name</Text>

                        <ReactCustomSelect
                          name="client"
                          options={selectBoxOptions?.client || []}
                          selectedValue={
                            selectBoxOptions?.client?.filter(
                              (item) => item.value === getValues("client")
                            )[0] || {}
                          }
                          selectDisable={isReadOnly}
                          isLoading={getClientMasterApiIsLoading}
                          handleOnChange={(val) => {
                            setValue("client", val.value, {
                              shouldValidate: true,
                            });
                            setValue("commodity", null, {
                              shouldValidate: true,
                            });
                            setValue("commodity_variety", null, {
                              shouldValidate: true,
                            });
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
                          Client representative name
                        </Text>

                        <CustomInput
                          type="text"
                          name="client_representative_name"
                          placeholder={"Client representative name"}
                          InputDisabled={isReadOnly}
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
                        <Text textAlign="right">Commodity name</Text>

                        <ReactCustomSelect
                          name="commodity"
                          options={selectBoxOptions?.community || []}
                          selectedValue={
                            selectBoxOptions?.community?.filter(
                              (item) => item.value === getValues("commodity")
                            )[0] || {}
                          }
                          selectDisable={isReadOnly}
                          isLoading={getCommodityMasterApiIsLoading}
                          handleOnChange={(val) => {
                            setValue("commodity", val.value, {
                              shouldValidate: true,
                            });
                            setValue("commodity_variety", null, {
                              shouldValidate: true,
                            });
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
                        <Text textAlign="right">Commodity Variety</Text>

                        <ReactCustomSelect
                          name="commodity_variety"
                          options={
                            selectBoxOptions?.communityVariety?.filter(
                              (item) =>
                                item.commodity_id === getValues("commodity")
                            ) || []
                          }
                          selectedValue={
                            selectBoxOptions?.communityVariety?.filter(
                              (item) =>
                                item.value === getValues("commodity_variety")
                            )[0] || {}
                          }
                          selectDisable={isReadOnly}
                          isLoading={getCommodityVarityApiIsLoading}
                          handleOnChange={(val) => {
                            setValue("commodity_variety", val.value, {
                              shouldValidate: true,
                            });
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
                        <Text textAlign="right">Service Contract</Text>

                        <CustomInput
                          type={"text"}
                          name="service_contract"
                          placeholder={"Service Contract"}
                          InputDisabled={true}
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
                        <Text textAlign="right">Truck No.</Text>

                        <CustomInput
                          type={"text"}
                          name="truck_no"
                          placeholder={"Truck No"}
                          InputDisabled={isReadOnly}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="top"
                        mt="10px"
                      >
                        <Text textAlign="right">Truck image</Text>

                        <Box>
                          {getValues("truck_image")?.length <= 1 ? (
                            <CustomFileInput
                              name=""
                              placeholder="Upload truck Images"
                              label=""
                              type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                              defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                              maxSize={2}
                              InputDisabled={isReadOnly}
                              showErr={
                                formState?.errors?.truck_image ? true : false
                              }
                              onChange={(e) => {
                                const ImageTruck = getValues("truck_image");

                                if (ImageTruck?.length <= 2) {
                                  setValue("truck_image", [...ImageTruck, e], {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                              style={{
                                mb: 1,
                                mt: 1,
                              }}
                            />
                          ) : (
                            <></>
                          )}
                          <Box>
                            {getValues("truck_image") ? (
                              <Box
                                gap={5}
                                overflow={"auto"}
                                display={"flex"}
                                justifyContent={"center"}
                                ref={finalRef}
                                onClick={onOpen}
                                cursor={"pointer"}
                              >
                                {getValues("truck_image").map((item, index) => (
                                  <Box key={index} mt="10px" flex={"none"}>
                                    <img
                                      src={`${configuration.BASE_URL}${item}`}
                                      alt=""
                                      style={{
                                        height: "100px",
                                        width: "100px",
                                      }}
                                    />
                                  </Box>
                                ))}
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Box>
                          {formState?.errors?.truck_image ? (
                            <Text color="red">
                              {formState?.errors?.truck_image?.message}
                            </Text>
                          ) : (
                            <></>
                          )}
                          <Modal
                            finalFocusRef={finalRef}
                            isOpen={isOpen}
                            size="2xl"
                            onClose={onClose}
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>Warehouse Photos</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <Box
                                  display={"flex"}
                                  justifyContent={"center"}
                                  alignItems={"center"}
                                  textAlign={"center"}
                                >
                                  <Box
                                    width={"50px"}
                                    fontSize={"25px"}
                                    cursor={"pointer"}
                                  >
                                    <LeftIcon
                                      onClick={() => {
                                        if (imageNumber !== 0) {
                                          setImageNumber(imageNumber - 1);
                                        }
                                      }}
                                    />
                                  </Box>
                                  {getValues("truck_image")?.map(
                                    (item, index) => (
                                      <Box key={index} flex={"none"}>
                                        {index === imageNumber ? (
                                          <img
                                            src={`${configuration.BASE_URL}${item}`}
                                            alt=""
                                            style={{
                                              height: "500px",
                                              width: "500px",
                                            }}
                                          />
                                        ) : (
                                          <></>
                                        )}
                                      </Box>
                                    )
                                  )}
                                  <Box
                                    width={"50px"}
                                    fontSize={"25px"}
                                    cursor={"pointer"}
                                  >
                                    <RightIcon
                                      onClick={() => {
                                        if (
                                          imageNumber !==
                                          (getValues("truck_image")?.length -
                                            1 || 0)
                                        ) {
                                          setImageNumber(imageNumber + 1);
                                        }
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </ModalBody>

                              <ModalFooter>
                                <Button
                                  colorScheme="blue"
                                  mr={3}
                                  type="button"
                                  onClick={onClose}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="ghost"
                                  colorScheme="red"
                                  type="button"
                                  onClick={() => {
                                    ImageDelete();
                                    // onClose();
                                  }}
                                >
                                  Delete
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Box>
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
                        <Text textAlign="right">Driver Name</Text>

                        <CustomInput
                          type={"text"}
                          name="driver_name"
                          placeholder={"Enter driver name"}
                          InputDisabled={isReadOnly}
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
                        <Text textAlign="right">Upload Driver Photo</Text>
                        <Box>
                          <CustomFileInput
                            name="upload_driver_photo"
                            placeholder="Upload Images"
                            value={getValues("upload_driver_photo")}
                            InputDisabled={isReadOnly}
                            onChange={(e) => {
                              setValue("upload_driver_photo", e, {
                                shouldValidate: true,
                              });
                            }}
                            showErr={
                              formState?.errors?.upload_driver_photo
                                ? true
                                : false
                            }
                            type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                            defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                            maxSize={2}
                            label=""
                            style={{
                              mb: 1,
                              mt: 1,
                            }}
                          />
                        </Box>
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
                        <Text textAlign="right">Weighbridge Name</Text>

                        <CustomInput
                          type="text"
                          name="weighbridge_name"
                          placeholder={"Weighbridge Name"}
                          InputDisabled={true}
                        />
                        <Box
                          border={"1px solid lightgray"}
                          borderRadius={"md"}
                          padding={"1"}
                          w={"8"}
                          h={"8"}
                          as="flex"
                          onClick={() => {
                            setEmailCheck(true);
                          }}
                        >
                          <EditIcon color={"gray"} />
                        </Box>
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {emailCheck ? (
                    <Box>
                      <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                        <Grid
                          gap={4}
                          templateColumns={"repeat(3, 1fr)"}
                          alignItems="center"
                          mt="10px"
                        >
                          <Text textAlign="right">Email Attachment</Text>
                          <Box>
                            <CustomFileInput
                              name="upload_approval_email"
                              placeholder="Upload Images"
                              value={getValues("upload_approval_email")}
                              InputDisabled={isReadOnly}
                              onChange={(e) => {
                                setValue("upload_approval_email", e, {
                                  shouldValidate: true,
                                });
                              }}
                              type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                              defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                              maxSize={2}
                              label=""
                              style={{
                                mb: 1,
                                mt: 1,
                              }}
                            />
                          </Box>
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
                        <Text textAlign="right">New Weighbridge Name</Text>

                        <CustomInput
                          type={"text"}
                          name="new_weighbridge_name"
                          placeholder={"New Weighbridge Name"}
                          InputDisabled={
                            getValues("upload_approval_email")?.length > 0 &&
                            !isReadOnly
                              ? false
                              : true
                          }
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
                        <Text textAlign="right">Weighbridge Slip No.</Text>

                        <CustomInput
                          type="text"
                          name="weighbridge_slip_no"
                          placeholder={"Enter weighbridge slip no  "}
                          InputDisabled={isReadOnly}
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
                          Weighbridge Slip Date & Time
                        </Text>

                        <CustomInput
                          type="datetime-local"
                          name="weighbridge_slip_datetime"
                          placeholder={"Enter weighbridge slip date & time  "}
                          InputDisabled={isReadOnly}
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
                        <Text textAlign="right">Upload weighbridge slip</Text>
                        <Box>
                          <CustomFileInput
                            name="upload_weighbridge_slip"
                            placeholder="Upload Images"
                            label=""
                            value={getValues("upload_weighbridge_slip")}
                            InputDisabled={isReadOnly}
                            onChange={(e) => {
                              setValue("upload_weighbridge_slip", e, {
                                shouldValidate: true,
                              });
                            }}
                            showErr={
                              formState?.errors?.upload_weighbridge_slip
                                ? true
                                : false
                            }
                            type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                            defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                            maxSize={2}
                            style={{
                              mb: 1,
                              mt: 1,
                            }}
                          />
                        </Box>
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
                        <Text textAlign="right">Total no of bags</Text>

                        <CustomInput
                          type="number"
                          name="total_no_of_bags"
                          placeholder={"Enter Total no of bags"}
                          InputDisabled={isReadOnly}
                          inputValue={getValues("total_no_of_bags")}
                          onChange={(e) => {
                            setValue("total_no_of_bags", e.target.value, {
                              shouldValidate: true,
                            });
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
                        <Text textAlign="right">Gross Weight (in KG)</Text>

                        <CustomInput
                          type="number"
                          step={0.01}
                          InputDisabled={isReadOnly}
                          name="gross_weight_kg"
                          placeholder={"Enter Gross weight"}
                          inputValue={getValues("gross_weight_kg")}
                          onChange={(e) => {
                            setValue("gross_weight_kg", e.target.value, {
                              shouldValidate: true,
                            });
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
                        <Text textAlign="right">tare Weight</Text>

                        <CustomInput
                          type="number"
                          step={0.01}
                          InputDisabled={isReadOnly}
                          name="tare_weight"
                          placeholder={"Enter Tare weight  "}
                          inputValue={getValues("tare_weight")}
                          onChange={(e) => {
                            setValue("tare_weight", e.target.value, {
                              shouldValidate: true,
                            });
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
                        <Text textAlign="right">Net Weight</Text>

                        <CustomInput
                          type="number"
                          step={0.01}
                          name="net_weight"
                          placeholder={"Net Weight"}
                          InputDisabled={true}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* Stack details */}
                  <Box
                    bgColor={"#DBFFF5"}
                    padding={"4"}
                    borderRadius={"md"}
                    mt="10px"
                  >
                    <Text fontWeight="bold" textAlign="left">
                      stack details
                      <span
                        style={{
                          color: "red",
                          marginLeft: "4px",
                        }}
                      >
                        *
                      </span>
                    </Text>
                    <Grid
                      templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                      }}
                      spacing="5"
                      gap={5}
                      mt="10px"
                    >
                      {/* Select stack  No  */}
                      <FormControl>
                        <Text fontWeight="bold" textAlign="left">
                          Select stack No{" "}
                        </Text>

                        <ReactSelect
                          value={
                            selectBoxOptions?.stack?.filter(
                              (item) =>
                                item.value === stackDetail?.select_stack_no
                            )[0] || {}
                          }
                          isLoading={getStackMasterApiIsLoading}
                          onChange={(val) => {
                            setStackDetail((old) => ({
                              ...old,
                              select_stack_no: val.value,
                            }));
                          }}
                          options={selectBoxOptions?.stack || []}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#fff",
                              borderRadius: "6px",
                              borderColor: stackError.select_stack_no
                                ? "red"
                                : "gray.10",

                              padding: "1px",
                              textAlign: "left",
                            }),
                            ...reactSelectStyle,
                          }}
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.select_stack_no === "Error"
                            ? ""
                            : stackError.select_stack_no}
                        </Text>
                      </FormControl>
                      <>
                        {/* Lot no  */}
                        {/* <FormControl>
                    <Text fontWeight="bold" textAlign="left">
                      Lot no{" "}
                    </Text>
                    <Input
                      placeholder="Lot no"
                      type="text"
                      isDisabled="true"
                      value={stackDetail?.lot_no || ""}
                      onChange={(e) => {
                        setStackDetail((old) => ({
                          ...old,
                          lot_no: e.target.value,
                        }));
                      }}
                      style={inputStyle}
                      border="1px"
                      borderColor={stackError.lot_no ? "red" : "gray.10"}
                    />
                  </FormControl> */}
                      </>
                      {/* No. Of Bags   */}
                      <FormControl>
                        <Text fontWeight="bold" textAlign="left">
                          No. Of Bags{" "}
                        </Text>

                        <Input
                          placeholder="No. Of Bags"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* Upload stack image  */}
                      <FormControl>
                        <Text fontWeight="bold" textAlign="left">
                          Upload stack image{" "}
                        </Text>

                        <CustomFileInput
                          name=""
                          placeholder="Upload Images"
                          InputDisabled={isReadOnly}
                          label=""
                          type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                          defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                          maxSize={2}
                          value={stackDetail?.upload_stack_image || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              upload_stack_image: e,
                            }));
                          }}
                          showErr={stackError.upload_stack_image ? true : false}
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Box
                      display="flex"
                      gap={2}
                      justifyContent="flex-end"
                      px="0"
                      mt="20px"
                    >
                      <Button
                        type="button"
                        //w="full"
                        isDisabled={isReadOnly}
                        backgroundColor={"primary.700"}
                        _hover={{ backgroundColor: "primary.700" }}
                        color={"white"}
                        borderRadius={"full"}
                        // my={"4"}
                        px={"10"}
                        onClick={() => {
                          updateStackId === null
                            ? AddStackDetails()
                            : updateStackDetails();
                        }}
                      >
                        {updateStackId === null ? "Add" : "Edit"}
                      </Button>
                    </Box>
                  </Box>

                  {/* table */}

                  <TableContainer mt="4" borderRadius={"md"}>
                    <Table color="#000">
                      <Thead bg="#dbfff5" border="1px" borderColor="#000">
                        <Tr style={{ color: "#000" }}>
                          <Th color="#000">Sr no </Th>
                          <Th color="#000"> Select stack No</Th>
                          <Th color="#000"> Lot no</Th>
                          <Th color="#000">No. Of Bags</Th>
                          <Th color="#000">Bag Weight (Kg)</Th>
                          <Th color="#000">Weight in Stack </Th>
                          <Th color="#000">Download stack image</Th>
                          <Th color="#000">Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {getValues("gate_pass_stack_details")?.length > 0 ? (
                          getValues("gate_pass_stack_details")?.map(
                            (item, index) => (
                              <Tr
                                key={`gate_pass_stack_details_${index}`}
                                textAlign="center"
                                bg="white"
                                border="1px"
                                borderColor="#000"
                              >
                                <Td>{index + 1}</Td>
                                <Td>{item?.select_stack_no || "-"}</Td>
                                <Td>{item?.lot_no || "-"}</Td>
                                <Td>{item?.no_of_bags || "-"}</Td>
                                <Td>{item?.actual_bag_weight || "-"}</Td>
                                <Td>{item?.weight_in_stack || "-"}</Td>
                                <Td>
                                  <BiDownload
                                    fontSize="26px"
                                    cursor="pointer"
                                    onClick={() => {
                                      window.open(
                                        `${configuration.BASE_URL}${
                                          item?.upload_stack_image || ""
                                        }`,
                                        "_blank"
                                      );
                                    }}
                                  />
                                </Td>
                                <Td>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="3"
                                  >
                                    <Flex gap="20px" justifyContent="center">
                                      <Box color={"primary.700"}>
                                        <BiEditAlt
                                          fontSize="26px"
                                          cursor="pointer"
                                          onClick={() => {
                                            !isReadOnly &&
                                              updateStackData(item, index);
                                          }}
                                        />
                                      </Box>
                                      <Box color="red">
                                        <AiOutlineDelete
                                          cursor="pointer"
                                          fontSize="26px"
                                          onClick={() => {
                                            if (!isReadOnly) {
                                              const temp = getValues(
                                                "gate_pass_stack_details"
                                              );
                                              setValue(
                                                "gate_pass_stack_details",
                                                [
                                                  ...temp.slice(0, index),
                                                  ...temp.slice(index + 1),
                                                ],
                                                {
                                                  shouldValidate: true,
                                                }
                                              );
                                            }
                                          }}
                                        />
                                      </Box>
                                    </Flex>
                                  </Box>
                                </Td>
                              </Tr>
                            )
                          )
                        ) : (
                          <Tr
                            textAlign="center"
                            bg="white"
                            border="1px"
                            borderColor="#000"
                          >
                            <Td colSpan={8}> No Data Found </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  {/* validation for the above table  */}
                  {/* {formState?.errors?.gate_pass_stack_details ? (
                    <Text color="red" mt="15px">
                      Stack Details Must Have 1 Detail
                    </Text>
                  ) : (
                    <></>
                  )} */}

                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Box></Box>
                        <Text textAlign="left" fontWeight={"bold"}>
                          Test Result :
                        </Text>
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  <Box>
                    <Grid
                      templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(2, 1fr)",
                      }}
                      spacing="5"
                      mt="10px"
                    >
                      <TableContainer>
                        <Table color="#000">
                          <Thead bg="#dbfff5" border="1px" borderColor="#000">
                            <Tr style={{ color: "#000" }}>
                              <Th color="#000">Sr no </Th>
                              <Th color="#000"> Parameter</Th>
                              <Th color="#000"> Result</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {qualityCommodity?.length > 0 ? (
                              qualityCommodity.map((item, index) =>
                                index % 2 === 0 ? (
                                  <Tr
                                    textAlign="center"
                                    bg="white"
                                    border="1px"
                                    borderColor="#000"
                                  >
                                    <Td>{index + 1}</Td>
                                    <Td>
                                      {item?.quality_parameter
                                        ?.quality_parameter || "-"}
                                    </Td>
                                    <Td>
                                      <Input
                                        type="number"
                                        value={item?.parameter_value || ""}
                                        onChange={(e) => {
                                          console.log(e.target.value);
                                          const temp = {
                                            quality_parameter:
                                              qualityCommodity[index]
                                                .quality_parameter,
                                            parameter_value: e.target.value,
                                          };

                                          setQualityCommodity((old) => [
                                            ...old.slice(0, index),
                                            temp,
                                            ...old.slice(index + 1),
                                          ]);
                                        }}
                                      />
                                    </Td>
                                  </Tr>
                                ) : (
                                  <></>
                                )
                              )
                            ) : (
                              <Tr
                                textAlign="center"
                                bg="white"
                                border="1px"
                                borderColor="#000"
                              >
                                <Td colSpan={3} height={"73px"}>
                                  No Data Found
                                </Td>
                              </Tr>
                            )}
                          </Tbody>
                        </Table>
                      </TableContainer>{" "}
                      <TableContainer>
                        <Table color="#000">
                          <Thead bg="#dbfff5" border="1px" borderColor="#000">
                            <Tr style={{ color: "#000" }}>
                              <Th color="#000">Sr no </Th>
                              <Th color="#000"> Parameter</Th>
                              <Th color="#000"> Result</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {qualityCommodity?.length > 1 ? (
                              qualityCommodity.map((item, index) =>
                                index % 2 !== 0 ? (
                                  <Tr
                                    textAlign="center"
                                    bg="white"
                                    border="1px"
                                    borderColor="#000"
                                  >
                                    <Td>{index + 1}</Td>
                                    <Td>
                                      {item?.quality_parameter
                                        ?.quality_parameter || "-"}
                                    </Td>
                                    <Td>
                                      <Input
                                        type="text"
                                        value={item?.parameter_value || ""}
                                        onChange={(e) => {
                                          console.log(e.target.value);
                                          const temp = {
                                            quality_parameter:
                                              qualityCommodity[index]
                                                .quality_parameter,
                                            parameter_value: e.target.value,
                                          };

                                          setQualityCommodity((old) => [
                                            ...old.slice(0, index),
                                            temp,
                                            ...old.slice(index + 1),
                                          ]);
                                        }}
                                      />
                                    </Td>
                                  </Tr>
                                ) : (
                                  <></>
                                )
                              )
                            ) : (
                              <Tr
                                textAlign="center"
                                bg="white"
                                border="1px"
                                borderColor="#000"
                              >
                                <Td colSpan={"3"} height={"73px"}>
                                  No Data Found
                                </Td>
                              </Tr>
                            )}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Box>

                  {formState?.errors?.gate_pass_commodity_quality ? (
                    <Text color="red" mt="15px">
                      Parameter Must Have 1 Detail
                    </Text>
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
                        <Text textAlign="right">Sample Seal No</Text>

                        <CustomInput
                          type="text"
                          name="sample_seal_no"
                          placeholder={"Enter Seal No"}
                          InputDisabled={isReadOnly}
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
                        <Text textAlign="right">Sampler name</Text>

                        <CustomInput
                          type={"text"}
                          name="sampler_name"
                          placeholder={"Sampler name"}
                          InputDisabled={isReadOnly}
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
                        <Text textAlign="right">Remarks</Text>

                        <CustomInput
                          type="text"
                          name="remarks"
                          placeholder={"Remarks"}
                          InputDisabled={isReadOnly}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  <Box
                    display="flex"
                    gap={2}
                    justifyContent="flex-end"
                    mt="10"
                    px="0"
                  >
                    <Button
                      type="button"
                      //w="full"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      isDisabled={isReadOnly}
                      my={"4"}
                      px={"10"}
                      isLoading={updateGatePassLoading || addGatePassLoading}
                      onClick={() => {
                        DraftLogicFunction();
                      }}
                    >
                      Draft
                    </Button>
                    <Button
                      type="submit"
                      //w="full"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      isDisabled={isReadOnly}
                      my={"4"}
                      px={"10"}
                      isLoading={updateGatePassLoading || addGatePassLoading}
                    >
                      Submit
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Gate Pass No</Text>

                        <CustomInput
                          type="text"
                          name="gate_pass_no"
                          placeholder={"Gate Pass No"}
                          InputDisabled={true}
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
                          Gate pass Date and In Time
                        </Text>

                        <CustomInput
                          type={"datetime-local"}
                          name="gate_pass_date_time_in"
                          placeholder={"Enter date & time"}
                          inputValue={getValues("gate_pass_date_time_in")}
                          InputDisabled={isReadOnly}
                          onChange={(e) => {
                            setValue("gate_pass_date_time_in", e.target.value, {
                              shouldValidate: true,
                            });
                            setValue("gate_pass_date_time_out", "", {
                              shouldValidate: true,
                            });
                          }}
                          // min={moment().format("YYYY-MM-DDTHH:mm")}
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
                          Gate pass Date and Out Time
                        </Text>

                        <CustomInput
                          type={"datetime-local"}
                          name="gate_pass_date_time_out"
                          placeholder={"Enter date & time"}
                          min={moment(
                            getValues("gate_pass_date_time_in")
                          ).format("YYYY-MM-DDTHH:mm")}
                          inputValue={
                            getValues("gate_pass_date_time_out") || ""
                          }
                          InputDisabled={isReadOnly}
                          onChange={(e) => {
                            console.log(e, "gate_pass_date_time_out");
                            setValue(
                              "gate_pass_date_time_out",
                              e.target.value,
                              {
                                shouldValidate: true,
                              }
                            );
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
                        <Text textAlign="right">Client name</Text>

                        <ReactCustomSelect
                          name="client"
                          options={selectBoxOptions?.client || []}
                          selectedValue={
                            selectBoxOptions?.client?.filter(
                              (item) => item.value === getValues("client")
                            )[0] || {}
                          }
                          selectDisable={isReadOnly}
                          isLoading={getClientMasterApiIsLoading}
                          handleOnChange={(val) => {
                            setValue("client", val.value, {
                              shouldValidate: true,
                            });
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
                        <Text textAlign="right">Warehouse Name</Text>

                        <ReactCustomSelect
                          name="warehouse"
                          options={selectBoxOptions?.warehouse || []}
                          selectedValue={
                            selectBoxOptions?.warehouse?.filter(
                              (item) => item.value === getValues("warehouse")
                            )[0] || {}
                          }
                          selectDisable={isReadOnly}
                          isLoading={getWarehouseMasterApiIsLoading}
                          handleOnChange={(val) => {
                            setValue("warehouse", val.value, {
                              shouldValidate: true,
                            });
                            setValue("weighbridge_name", val.weighbridge_name, {
                              shouldValidate: true,
                            });
                            setValue("chamber", null, {
                              shouldValidate: true,
                            });
                            setValue("client", null, {
                              shouldValidate: true,
                            });
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
                        <Text textAlign="right">Chamber No</Text>

                        <ReactCustomSelect
                          name="chamber"
                          options={
                            selectBoxOptions?.chamber?.filter(
                              (item) =>
                                item.warehouse === getValues("warehouse")
                            ) || []
                          }
                          selectedValue={
                            selectBoxOptions?.chamber?.filter(
                              (item) => item.value === getValues("chamber")
                            )[0] || {}
                          }
                          selectDisable={isReadOnly}
                          isLoading={getChamberApiIsLoading}
                          handleOnChange={(val) => {
                            setValue("chamber", val.value, {
                              shouldValidate: true,
                            });
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
                        <Text textAlign="right">Commodity name</Text>

                        <ReactCustomSelect
                          name="commodity"
                          options={selectBoxOptions?.community || []}
                          selectedValue={
                            selectBoxOptions?.community?.filter(
                              (item) => item.value === getValues("commodity")
                            )[0] || {}
                          }
                          selectDisable={isReadOnly}
                          isLoading={getCommodityMasterApiIsLoading}
                          handleOnChange={(val) => {
                            setValue("commodity", val.value, {
                              shouldValidate: true,
                            });
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
                        <Text textAlign="right">Commodity Variety</Text>

                        <ReactCustomSelect
                          name="commodity_variety"
                          options={
                            selectBoxOptions?.communityVariety?.filter(
                              (item) =>
                                item.commodity_id === getValues("commodity")
                            ) || []
                          }
                          selectedValue={
                            selectBoxOptions?.communityVariety?.filter(
                              (item) =>
                                item.value === getValues("commodity_variety")
                            )[0] || {}
                          }
                          selectDisable={isReadOnly}
                          isLoading={getCommodityVarityApiIsLoading}
                          handleOnChange={(val) => {
                            setValue("commodity_variety", val.value, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* ........................DO details......... */}
                  <Box
                    bgColor={"#DBFFF5"}
                    padding={"4"}
                    borderRadius={"md"}
                    mt="10px"
                  >
                    <Text fontWeight="bold" textAlign="left">
                      DO details
                      <span
                        style={{
                          color: "red",
                          marginLeft: "4px",
                        }}
                      >
                        *
                      </span>
                    </Text>
                    <Grid
                      templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                      }}
                      spacing="5"
                      gap={5}
                      mt="10px"
                    >
                      {/* Select stack  No  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Select DO No{" "}
                        </Text>

                        <ReactSelect
                          value={
                            selectBoxOptions?.stack?.filter(
                              (item) =>
                                item.value === stackDetail?.select_stack_no
                            )[0] || {}
                          }
                          isLoading={getStackMasterApiIsLoading}
                          onChange={(val) => {
                            setStackDetail((old) => ({
                              ...old,
                              select_stack_no: val.value,
                            }));
                          }}
                          options={selectBoxOptions?.stack || []}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#fff",
                              borderRadius: "6px",
                              borderColor: stackError.select_stack_no
                                ? "red"
                                : "gray.10",

                              padding: "1px",
                              textAlign: "left",
                            }),
                            ...reactSelectStyle,
                          }}
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.select_stack_no === "Error"
                            ? ""
                            : stackError.select_stack_no}
                        </Text>
                      </FormControl>

                      {/* DO Expiry Date  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          DO Expiry Date{" "}
                        </Text>

                        <Input
                          // placeholder="No. Of Bags"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* Balance Bags In DO  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Balance Bags In DO{" "}
                        </Text>

                        <Input
                          // placeholder="No. Of Bags"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* Balance MT In DO  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Balance MT In DO{" "}
                        </Text>

                        <Input
                          // placeholder="No. Of Bags"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* Select Stack  Number  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Select Stack No{" "}
                        </Text>

                        <ReactSelect
                          value={
                            selectBoxOptions?.stack?.filter(
                              (item) =>
                                item.value === stackDetail?.select_stack_no
                            )[0] || {}
                          }
                          isLoading={getStackMasterApiIsLoading}
                          onChange={(val) => {
                            setStackDetail((old) => ({
                              ...old,
                              select_stack_no: val.value,
                            }));
                          }}
                          options={selectBoxOptions?.stack || []}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#fff",
                              borderRadius: "6px",
                              borderColor: stackError.select_stack_no
                                ? "red"
                                : "gray.10",

                              padding: "1px",
                              textAlign: "left",
                            }),
                            ...reactSelectStyle,
                          }}
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.select_stack_no === "Error"
                            ? ""
                            : stackError.select_stack_no}
                        </Text>
                      </FormControl>

                      {/* row 2 ........... */}

                      {/* Lot  Number  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Lot No{" "}
                        </Text>

                        <ReactSelect
                          value={
                            selectBoxOptions?.stack?.filter(
                              (item) =>
                                item.value === stackDetail?.select_stack_no
                            )[0] || {}
                          }
                          isLoading={getStackMasterApiIsLoading}
                          onChange={(val) => {
                            setStackDetail((old) => ({
                              ...old,
                              select_stack_no: val.value,
                            }));
                          }}
                          options={selectBoxOptions?.stack || []}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#fff",
                              borderRadius: "6px",
                              borderColor: stackError.select_stack_no
                                ? "red"
                                : "gray.10",

                              padding: "1px",
                              textAlign: "left",
                            }),
                            ...reactSelectStyle,
                          }}
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.select_stack_no === "Error"
                            ? ""
                            : stackError.select_stack_no}
                        </Text>
                      </FormControl>

                      {/* Deposite Bag Size  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Deposite Bag Size{" "}
                        </Text>

                        <Input
                          placeholder="AutoFilled"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* total bags can be delivered from lot  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Total Bags Can Be Delivered From Lot{" "}
                        </Text>

                        <Input
                          placeholder="AutoFilled"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* total MT can be delivered from lot  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Total MT Can Be Delivered From Lot{" "}
                        </Text>

                        <Input
                          placeholder="AutoFilled"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* currently delivering bags from lot  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Currently Delivering Bags From Lot{" "}
                        </Text>

                        <Input
                          placeholder="Free field"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* row 3 ......................... */}

                      {/* currently delivering MT from lot  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          currently delivering MT from lot{" "}
                        </Text>

                        <Input
                          placeholder="Free field"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* Remaining bag in lot as per DO  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Remaining bag in lot as per DO{" "}
                        </Text>

                        <Input
                          placeholder="Auto Filled"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* Remaining MT in lot As per DO  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Remaining MT in lot As per DO{" "}
                        </Text>

                        <Input
                          placeholder="Auto Filled"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* Remaining Bag in DO  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Remaining Bag in DO{" "}
                        </Text>

                        <Input
                          placeholder="Auto filled"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>

                      {/* Remaining MT in DO  */}
                      <FormControl>
                        <Text
                          fontSize={FONT_SIZE_CONFIG_OBJ}
                          fontWeight="bold"
                          textAlign="left"
                        >
                          Remaining MT in DO{" "}
                        </Text>

                        <Input
                          placeholder="Auto filled"
                          type="number"
                          isDisabled={isReadOnly}
                          value={stackDetail?.no_of_bags || ""}
                          onChange={(e) => {
                            setStackDetail((old) => ({
                              ...old,
                              no_of_bags: e.target.value,
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            stackError.no_of_bags ? "red" : "gray.10"
                          }
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {stackError.no_of_bags === "Error"
                            ? ""
                            : stackError.no_of_bags}
                        </Text>
                      </FormControl>
                    </Grid>
                    <Box
                      display="flex"
                      gap={2}
                      justifyContent="flex-end"
                      px="0"
                      mt="20px"
                    >
                      <Button
                        type="button"
                        //w="full"
                        isDisabled={isReadOnly}
                        backgroundColor={"primary.700"}
                        _hover={{ backgroundColor: "primary.700" }}
                        color={"white"}
                        borderRadius={"full"}
                        // my={"4"}
                        px={"10"}
                        onClick={() => {
                          updateStackId === null
                            ? AddStackDetails()
                            : updateStackDetails();
                        }}
                      >
                        {updateStackId === null ? "Add" : "Edit"}
                      </Button>
                    </Box>
                  </Box>

                  {/* table 1 after DO section ..........................*/}

                  <TableContainer mt="4" borderRadius={"md"}>
                    <Table color="#000">
                      <Thead bg="#dbfff5" border="1px" borderColor="#000">
                        <Tr style={{ color: "#000" }}>
                          <Th color="#000">Sr no </Th>
                          <Th color="#000"> DO No</Th>
                          <Th color="#000"> DO Expiry Date</Th>
                          <Th color="#000">Balance Bags In DO</Th>
                          <Th color="#000">Balance MT In DO</Th>
                          <Th color="#000">Stack No</Th>
                          <Th color="#000">Lot No</Th>
                          <Th color="#000">Deposite Bag Size</Th>
                          <Th color="#000">
                            Total Bags Can Be Delivered From Lot
                          </Th>
                          <Th color="#000">
                            Total MT Can Be Delivered From Lot
                          </Th>
                          <Th color="#000">
                            Currently Delivering Bags From Lot
                          </Th>
                          <Th color="#000">Currently Delivering MT From Lot</Th>
                          <Th color="#000">Remaining Bag In Lot As Per DO</Th>
                          <Th color="#000">Remaining MT In Lot As Per DO</Th>
                          <Th color="#000">Remaining Bag In DO</Th>
                          <Th color="#000">Remaining MT In DO</Th>
                          <Th color="#000">Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {getValues("gate_pass_stack_details")?.length > 0 ? (
                          getValues("gate_pass_stack_details")?.map(
                            (item, index) => (
                              <Tr
                                textAlign="center"
                                bg="white"
                                border="1px"
                                borderColor="#000"
                              >
                                <Td>{index + 1}</Td>
                                <Td>{item?.select_stack_no || "-"}</Td>
                                <Td>{item?.lot_no || "-"}</Td>
                                <Td>{item?.no_of_bags || "-"}</Td>
                                <Td>{item?.actual_bag_weight || "-"}</Td>
                                <Td>{item?.weight_in_stack || "-"}</Td>
                                <Td>{item?.no_of_bags || "-"}</Td>
                                <Td>{item?.actual_bag_weight || "-"}</Td>
                                <Td>{item?.weight_in_stack || "-"}</Td>
                                <Td>{item?.no_of_bags || "-"}</Td>
                                <Td>{item?.actual_bag_weight || "-"}</Td>
                                <Td>{item?.weight_in_stack || "-"}</Td>
                                <Td>{item?.no_of_bags || "-"}</Td>
                                <Td>{item?.actual_bag_weight || "-"}</Td>
                                <Td>{item?.weight_in_stack || "-"}</Td>
                                <Td>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="3"
                                  >
                                    <Flex gap="20px" justifyContent="center">
                                      <Box color={"primary.700"}>
                                        <BiEditAlt
                                          fontSize="26px"
                                          cursor="pointer"
                                          onClick={() => {
                                            updateStackData(item, index);
                                          }}
                                        />
                                      </Box>
                                      <Box color="red">
                                        <AiOutlineDelete
                                          cursor="pointer"
                                          fontSize="26px"
                                          onClick={() => {
                                            const temp = getValues(
                                              "gate_pass_stack_details"
                                            );
                                            setValue(
                                              "gate_pass_stack_details",
                                              [
                                                ...temp.slice(0, index),
                                                ...temp.slice(index + 1),
                                              ],
                                              {
                                                shouldValidate: true,
                                              }
                                            );
                                          }}
                                        />
                                      </Box>
                                    </Flex>
                                  </Box>
                                </Td>
                              </Tr>
                            )
                          )
                        ) : (
                          <Tr
                            textAlign="center"
                            bg="white"
                            border="1px"
                            borderColor="#000"
                          >
                            <Td colSpan={17}> No Data Found </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>

                  {/* TODO validation for the above  table logic  */}
                  {/* {formState?.errors?.gate_pass_stack_details ? (
                    <Text color="red" mt="15px">
                      Stack Details Must Have 1 Detail
                    </Text>
                  ) : (
                    <></>
                  )} */}

                  {/* .......table 2 .......................... */}

                  <TableContainer mt="4" borderRadius={"md"}>
                    <Table color="#000">
                      <Thead bg="#dbfff5" border="1px" borderColor="#000">
                        <Tr style={{ color: "#000" }}>
                          <Th color="#000">Sr no </Th>
                          <Th color="#000"> DO no</Th>
                          <Th color="#000">
                            {" "}
                            Total to be Delivered bags from DO
                          </Th>
                          <Th color="#000">
                            Total to be Delivered bags from DO
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {!getValues("gate_pass_stack_details")?.length > 0 ? (
                          // getValues("gate_pass_stack_details")?.map(
                          //   (item, index) => (
                          //     <Tr
                          //       textAlign="center"
                          //       bg="white"
                          //       border="1px"
                          //       borderColor="#000"
                          //     >
                          //       <Td>{index + 1}</Td>
                          //       <Td>{item?.select_stack_no || "-"}</Td>
                          //       <Td>{item?.lot_no || "-"}</Td>
                          //       <Td>{item?.no_of_bags || "-"}</Td>

                          //     </Tr>
                          //   )
                          // )
                          <Tr
                            textAlign="center"
                            bg="white"
                            border="1px"
                            borderColor="#000"
                          >
                            <Td>1</Td>
                            <Td>DO-204</Td>
                            <Td>20</Td>
                            <Td>1000</Td>
                          </Tr>
                        ) : (
                          <Tr
                            textAlign="center"
                            bg="white"
                            border="1px"
                            borderColor="#000"
                          >
                            <Td colSpan={8}> No Data Found </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>

                  {/* validation of the table 2  */}
                  {/* {formState?.errors?.gate_pass_stack_details ? (
                    <Text color="red" mt="15px">
                      Stack Details Must Have 1 Detail
                    </Text>
                  ) : (
                    <></>
                  )} */}

                  {/* rest of the text fields ....  */}

                  {/* Total No Of Bags To Be Delivered  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">
                          Total No Of Bags To Be Delivered
                        </Text>

                        <CustomInput
                          type={"text"}
                          name="new_weighbridge_name"
                          placeholder={"Freefield"}
                          InputDisabled={
                            getValues("upload_approval_email")?.length > 0 &&
                            !isReadOnly
                              ? false
                              : true
                          }
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* Total  MT to be delivered  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Total MT to be delivered</Text>

                        <CustomInput
                          type={"text"}
                          name="new_weighbridge_name"
                          placeholder={"Freefield"}
                          InputDisabled={
                            getValues("upload_approval_email")?.length > 0 &&
                            !isReadOnly
                              ? false
                              : true
                          }
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* Client Representative Name  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">
                          Client Representative Name
                        </Text>

                        <CustomInput
                          type={"text"}
                          name="truck_no"
                          placeholder={"Free field"}
                          InputDisabled={isReadOnly}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* Truck no.  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Truck No.</Text>

                        <CustomInput
                          type={"text"}
                          name="truck_no"
                          placeholder={"Enter truck no"}
                          InputDisabled={isReadOnly}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* Truck image  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="top"
                        mt="10px"
                      >
                        <Text textAlign="right">Truck image</Text>

                        <Box>
                          {getValues("truck_image")?.length <= 1 ? (
                            <CustomFileInput
                              name=""
                              placeholder="Upload truck Images"
                              label=""
                              type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                              defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                              maxSize={2}
                              InputDisabled={isReadOnly}
                              showErr={
                                formState?.errors?.truck_image ? true : false
                              }
                              onChange={(e) => {
                                const ImageTruck = getValues("truck_image");

                                if (ImageTruck?.length <= 2) {
                                  setValue("truck_image", [...ImageTruck, e], {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                              style={{
                                mb: 1,
                                mt: 1,
                              }}
                            />
                          ) : (
                            <></>
                          )}
                          <Box>
                            {getValues("truck_image") ? (
                              <Box
                                gap={5}
                                overflow={"auto"}
                                display={"flex"}
                                justifyContent={"center"}
                                ref={finalRef}
                                onClick={onOpen}
                                cursor={"pointer"}
                              >
                                {getValues("truck_image").map((item, index) => (
                                  <Box key={index} mt="10px" flex={"none"}>
                                    <img
                                      src={`${configuration.BASE_URL}${item}`}
                                      alt=""
                                      style={{
                                        height: "100px",
                                        width: "100px",
                                      }}
                                    />
                                  </Box>
                                ))}
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Box>
                          {formState?.errors?.truck_image ? (
                            <Text color="red">
                              {formState?.errors?.truck_image?.message}
                            </Text>
                          ) : (
                            <></>
                          )}
                          <Modal
                            finalFocusRef={finalRef}
                            isOpen={isOpen}
                            size="2xl"
                            onClose={onClose}
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>Warehouse Photos</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <Box
                                  display={"flex"}
                                  justifyContent={"center"}
                                  alignItems={"center"}
                                  textAlign={"center"}
                                >
                                  <Box
                                    width={"50px"}
                                    fontSize={"25px"}
                                    cursor={"pointer"}
                                  >
                                    <LeftIcon
                                      onClick={() => {
                                        if (imageNumber !== 0) {
                                          setImageNumber(imageNumber - 1);
                                        }
                                      }}
                                    />
                                  </Box>
                                  {getValues("truck_image")?.map(
                                    (item, index) => (
                                      <Box key={index} flex={"none"}>
                                        {index === imageNumber ? (
                                          <img
                                            src={`${configuration.BASE_URL}${item}`}
                                            alt=""
                                            style={{
                                              height: "500px",
                                              width: "500px",
                                            }}
                                          />
                                        ) : (
                                          <></>
                                        )}
                                      </Box>
                                    )
                                  )}
                                  <Box
                                    width={"50px"}
                                    fontSize={"25px"}
                                    cursor={"pointer"}
                                  >
                                    <RightIcon
                                      onClick={() => {
                                        if (
                                          imageNumber !==
                                          (getValues("truck_image")?.length -
                                            1 || 0)
                                        ) {
                                          setImageNumber(imageNumber + 1);
                                        }
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </ModalBody>

                              <ModalFooter>
                                <Button
                                  colorScheme="blue"
                                  mr={3}
                                  type="button"
                                  onClick={onClose}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="ghost"
                                  colorScheme="red"
                                  type="button"
                                  onClick={() => {
                                    ImageDelete();
                                    // onClose();
                                  }}
                                >
                                  Delete
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Box>
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* driver name  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Driver Name</Text>

                        <CustomInput
                          type={"text"}
                          name="driver_name"
                          placeholder={"Enter driver name"}
                          InputDisabled={isReadOnly}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* upload driver photo  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Upload Driver Photo</Text>
                        <Box>
                          <CustomFileInput
                            name="upload_driver_photo"
                            placeholder="Upload Images"
                            value={getValues("upload_driver_photo")}
                            InputDisabled={isReadOnly}
                            onChange={(e) => {
                              setValue("upload_driver_photo", e, {
                                shouldValidate: true,
                              });
                            }}
                            showErr={
                              formState?.errors?.upload_driver_photo
                                ? true
                                : false
                            }
                            type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                            defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                            maxSize={2}
                            label=""
                            style={{
                              mb: 1,
                              mt: 1,
                            }}
                          />
                        </Box>
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* weighbridge name  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Weighbridge Name</Text>

                        <ReactCustomSelect
                          name="client"
                          options={selectBoxOptions?.client || []}
                          selectedValue={
                            selectBoxOptions?.client?.filter(
                              (item) => item.value === getValues("client")
                            )[0] || {}
                          }
                          selectDisable={isReadOnly}
                          isLoading={getClientMasterApiIsLoading}
                          handleOnChange={(val) => {
                            setValue("client", val.value, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* new weightbridge name  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">New WeightBridge Name</Text>

                        <CustomInput
                          type={"text"}
                          name="new_weighbridge_name"
                          placeholder={"Free field"}
                          InputDisabled={isReadOnly}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* Weighbridge Slip No.  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Weighbridge Slip No.</Text>

                        <CustomInput
                          type="text"
                          name="weighbridge_slip_no"
                          placeholder={"Enter weighbridge slip no  "}
                          InputDisabled={isReadOnly}
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
                          Weighbridge Slip Date & Time
                        </Text>

                        <CustomInput
                          type="datetime-local"
                          name="weighbridge_slip_datetime"
                          placeholder={"Enter weighbridge slip date & time  "}
                          InputDisabled={isReadOnly}
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
                        <Text textAlign="right">Upload weighbridge slip</Text>
                        <Box>
                          <CustomFileInput
                            name="upload_weighbridge_slip"
                            placeholder="Upload Images"
                            label=""
                            value={getValues("upload_weighbridge_slip")}
                            InputDisabled={isReadOnly}
                            onChange={(e) => {
                              setValue("upload_weighbridge_slip", e, {
                                shouldValidate: true,
                              });
                            }}
                            showErr={
                              formState?.errors?.upload_weighbridge_slip
                                ? true
                                : false
                            }
                            type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                            defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                            maxSize={2}
                            style={{
                              mb: 1,
                              mt: 1,
                            }}
                          />
                        </Box>
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* Tare Weight  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Tare Weight</Text>

                        <CustomInput
                          type="number"
                          name="tare_weight"
                          placeholder={"Enter weight "}
                          InputDisabled={isReadOnly}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* Gross Weight (in KG)  */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Gross Weight (in KG)</Text>

                        <CustomInput
                          type="number"
                          name="gross_weight"
                          placeholder={"Enter weight  "}
                          InputDisabled={isReadOnly}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* Net Weight   */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Net Weight</Text>

                        <CustomInput
                          type="number"
                          name="net_weight"
                          placeholder={
                            "Auto calculated (Gross weight – Tare weight) "
                          }
                          InputDisabled={isReadOnly}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* Test Result Table for the outward section ... */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Box></Box>
                        <Text textAlign="left" fontWeight={"bold"}>
                          Test Result :
                        </Text>
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  <Box>
                    <Grid
                      templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(2, 1fr)",
                      }}
                      spacing="5"
                      mt="10px"
                    >
                      <TableContainer>
                        <Table color="#000">
                          <Thead bg="#dbfff5" border="1px" borderColor="#000">
                            <Tr style={{ color: "#000" }}>
                              <Th color="#000">Sr no </Th>
                              <Th color="#000"> Parameter</Th>
                              <Th color="#000"> Result</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {qualityCommodity?.length > 0 ? (
                              qualityCommodity.map((item, index) =>
                                index % 2 === 0 ? (
                                  <Tr
                                    textAlign="center"
                                    bg="white"
                                    border="1px"
                                    borderColor="#000"
                                  >
                                    <Td>{index + 1}</Td>
                                    <Td>
                                      {item?.quality_parameter
                                        ?.quality_parameter || "-"}
                                    </Td>
                                    <Td>
                                      <Input
                                        type="number"
                                        value={item?.parameter_value || ""}
                                        onChange={(e) => {
                                          console.log(e.target.value);
                                          const temp = {
                                            quality_parameter:
                                              qualityCommodity[index]
                                                .quality_parameter,
                                            parameter_value: e.target.value,
                                          };

                                          setQualityCommodity((old) => [
                                            ...old.slice(0, index),
                                            temp,
                                            ...old.slice(index + 1),
                                          ]);
                                        }}
                                      />
                                    </Td>
                                  </Tr>
                                ) : (
                                  <></>
                                )
                              )
                            ) : (
                              <Tr
                                textAlign="center"
                                bg="white"
                                border="1px"
                                borderColor="#000"
                              >
                                <Td colSpan={3} height={"73px"}>
                                  No Data Found
                                </Td>
                              </Tr>
                            )}
                          </Tbody>
                        </Table>
                      </TableContainer>{" "}
                      <TableContainer>
                        <Table color="#000">
                          <Thead bg="#dbfff5" border="1px" borderColor="#000">
                            <Tr style={{ color: "#000" }}>
                              <Th color="#000">Sr no </Th>
                              <Th color="#000"> Parameter</Th>
                              <Th color="#000"> Result</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {qualityCommodity?.length > 1 ? (
                              qualityCommodity.map((item, index) =>
                                index % 2 !== 0 ? (
                                  <Tr
                                    textAlign="center"
                                    bg="white"
                                    border="1px"
                                    borderColor="#000"
                                  >
                                    <Td>{index + 1}</Td>
                                    <Td>
                                      {item?.quality_parameter
                                        ?.quality_parameter || "-"}
                                    </Td>
                                    <Td>
                                      <Input
                                        type="number"
                                        value={item?.parameter_value || ""}
                                        onChange={(e) => {
                                          console.log(e.target.value);
                                          const temp = {
                                            quality_parameter:
                                              qualityCommodity[index]
                                                .quality_parameter,
                                            parameter_value: e.target.value,
                                          };

                                          setQualityCommodity((old) => [
                                            ...old.slice(0, index),
                                            temp,
                                            ...old.slice(index + 1),
                                          ]);
                                        }}
                                      />
                                    </Td>
                                  </Tr>
                                ) : (
                                  <></>
                                )
                              )
                            ) : (
                              <Tr
                                textAlign="center"
                                bg="white"
                                border="1px"
                                borderColor="#000"
                              >
                                <Td colSpan={"3"} height={"73px"}>
                                  No Data Found
                                </Td>
                              </Tr>
                            )}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Box>
                  {/* validation message logic for the table  */}
                  {/* {formState?.errors?.gate_pass_commodity_quality ? (
                    <Text color="red" mt="15px">
                      Parameter Must Have 1 Detail
                    </Text>
                  ) : (
                    <></>
                  )} */}

                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                        mt="10px"
                      >
                        <Text textAlign="right">Remarks</Text>

                        <CustomInput
                          type="text"
                          name="remark"
                          placeholder={"Free field"}
                          InputDisabled={isReadOnly}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>
                </>
                // end of the condition
              )}
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
}

export default AddEditGatePass;

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
