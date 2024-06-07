/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ROUTE_PATH from "../../constants/ROUTE";
import { toasterAlert } from "../../services/common.service";
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
import { FormProvider, useForm } from "react-hook-form";
import { MotionSlideUp } from "../../utils/animation";
import CustomInput from "../../components/Elements/CustomInput";
import moment from "moment";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import { LeftIcon, RightIcon } from "../../components/Icons/Icons";
import { EditIcon } from "@chakra-ui/icons";
import ReactSelect from "react-select";
import { BiDownload, BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { setSidebarVisibility } from "../../features/filter.slice";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import {
  useGetGatePassByIdMutation,
  usePostGatePassMutation,
  usePutGatePassMutation,
} from "../../features/gate-pass.slice";
import {
  useGetChamberFreeMutation,
  useGetClientMasterFreeTypeMutation,
  useGetCommodityFreeMasterMutation,
  useGetCommodityVarityFreeMasterMutation,
  useGetStackFreeMasterMutation,
  useGetWareHouseFreeMutation,
} from "../../features/master-api-slice";
import { useGetServiceContractFreeMutation } from "../../features/service-contract-api.slice";
import { yupResolver } from "@hookform/resolvers/yup";
// import { schema } from "./fields";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import configuration from "../../config/configuration";
import { localStorageService } from "../../services/localStorge.service";
import { inWardSchema } from "./fields";
import CustomTextArea from "../../components/Elements/CustomTextArea";

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

function isStackNoAlreadyExists(obj, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]?.select_stack_no === obj?.select_stack_no) {
      return true; // select_stack_no already exists
    }
  }
  return false; // select_stack_no does not exist
}

export default function AddEditGatePassInward() {
  const dispatch = useDispatch();
  const location = useLocation();
  const urlPrams = useParams();
  const navigate = useNavigate();

  const loginData = localStorageService.get("GG_ADMIN");
  const [formDetails, setFormDetails] = useState({});

  const methods = useForm({
    resolver: yupResolver(inWardSchema),
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

  const { setValue, setError, getValues, formState } = methods;
  console.log("Errors ->", formState?.errors);

  const formUrl = location.state?.from || null;
  const details = { id: urlPrams?.id };

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
        // Filter the data based on is_block=false
        const unblockedData = response?.data?.filter((item) => !item?.is_block);

        // Map the filtered data to the warehouse array
        setSelectBoxOptions((prev) => ({
          ...prev,
          warehouse: unblockedData?.map(
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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getChamberMasterList();
    // eslint-disable-next-line
  }, [getValues("warehouse")]);

  // Warehouse Master end

  // Chamber Master start

  const [getChamberMaster, { isLoading: getChamberApiIsLoading }] =
    useGetChamberFreeMutation();

  const getChamberMasterList = async () => {
    try {
      const response = await getChamberMaster().unwrap();
      // if (response.status === 200) {
      const chamberMasterArray = response?.data || response || [];
      setSelectBoxOptions((prev) => ({
        ...prev,
        chamber: chamberMasterArray?.map(
          ({ chamber_number, id, warehouse }) => ({
            label: chamber_number,
            value: id,
            warehouse: warehouse?.id,
          })
        ),
      }));
      // }
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
    // eslint-disable-next-line
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
    // eslint-disable-next-line
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
    // eslint-disable-next-line
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
          getValues("chamber") +
          "&filter=servicecontract__status__status_code&servicecontract__status__status_code=6"
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
    // eslint-disable-next-line
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

      setSelectBoxOptions((prev) => ({
        ...prev,
        stack:
          response?.data?.map((item) => ({
            label: item?.stack_number,
            value: item?.stack_number,
            id: item?.id,
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
    // eslint-disable-next-line
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
    // eslint-disable-next-line
  }, [getValues("gross_weight_kg"), getValues("tare_weight")]);

  // Net Weight Logic end

  // Stack Details Logic start

  const [weight, setWeight] = useState(0);

  useEffect(() => {
    if (getValues("net_weight") && getValues("total_no_of_bags")) {
      setWeight(
        (
          (Number(getValues("net_weight") || 0) * 1000) /
          Number(getValues("total_no_of_bags") || 0)
        ).toFixed(2)
      );
      setStackDetail((old) => ({
        ...old,
        actual_bag_weight: (
          (Number(getValues("net_weight") || 0) * 1000) /
          Number(getValues("total_no_of_bags") || 0)
        ).toFixed(2),
      }));
      const temp = getValues("gate_pass_stack_details");
      console.log(temp);
      setValue(
        "gate_pass_stack_details",
        temp?.map((item) => ({
          select_stack_no: item.select_stack_no,
          lot_no: item.lot_no,
          id: item?.id || item?.select_stack_no_id,
          no_of_bags: item.no_of_bags,
          actual_bag_weight: (
            (Number(getValues("net_weight") || 0) /
              Number(getValues("total_no_of_bags") || 0)) *
            1000
          ).toFixed(2),
          weight_in_stack: (
            Number(item.no_of_bags) *
            (Number(getValues("net_weight") || 0) /
              Number(getValues("total_no_of_bags") || 0).toFixed(2))
          ).toFixed(2),
          upload_stack_image: item.upload_stack_image,
        })) || [],
        {
          shouldValidate: true,
        }
      );
    }
    // eslint-disable-next-line
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
    console.log("dlkfjkldfj");
    if (stackDetail.no_of_bags > 0 && stackDetail.actual_bag_weight > 0) {
      let temp = (
        (Number(stackDetail.no_of_bags || 0) *
          Number(stackDetail.actual_bag_weight || 0)) /
        1000
      ).toFixed(2);
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
    const temp = getValues("gate_pass_stack_details") || [];

    const isStackAlreadyExists = isStackNoAlreadyExists(stackDetail, temp);

    if (isStackAlreadyExists) {
      showToastByStatusCode(400, "Stack already exists");
      return false;
    }
    if (stackCheckCondition()) {
      let arr = temp || [];
      setValue("gate_pass_stack_details", [...arr, stackDetail], {
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
    console.log(data);
    setStackDetail({
      select_stack_no: data.select_stack_no,
      select_stack_no_id: data?.select_stack_no_id,
      lot_no: data.lot_no,
      no_of_bags: data.no_of_bags,
      actual_bag_weight: data.actual_bag_weight,
      weight_in_stack: data.weight_in_stack,
      upload_stack_image: data.upload_stack_image,
      id: data?.select_stack_no_id || data?.id,
    });
  };

  const updateStackDetails = () => {
    console.log(stackDetail);
    if (stackCheckCondition()) {
      const temp = getValues("gate_pass_stack_details") || [];

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
  // eslint-disable-next-line
  // Form Submit Function Start

  const onSubmit = (data) => {
    if (isReadOnly) {
      return false;
    }
    const moment = require("moment"); // Import Moment.js

    // Parse dates using moment.js
    const weighBridgeDateTime = moment(data.weighbridge_slip_datetime);
    const gatePassDateTimeIn = moment(data.gate_pass_date_time_in);

    // Check if weighbridge date is after gate pass date
    if (weighBridgeDateTime.isAfter(gatePassDateTimeIn)) {
      showToastByStatusCode(
        400,
        "The Weighbridge Date and Time should be less than or equal to the Gate Pass Date and Time"
      );
      return;
    }

    const temp = qualityCommodity.map((item) => ({
      quality_parameter: item?.quality_parameter?.id || 0,
      parameter_value: item.parameter_value,
    }));

    if (emailCheck) {
      if (data?.new_weighbridge_name?.length > 0) {
      } else {
        showToastByStatusCode(400, "Please Add New Weighbridge Name");
        return;
      }
    } else {
      if (data?.weighbridge_name?.length > 0) {
        console.log(data?.weighbridge_name, "hhhhhh");
      } else {
        showToastByStatusCode(
          400,
          "Please Add Weighbridge Name OR New Weighbridge Name"
        );
        return;
      }
    }

    const total_bag = data?.gate_pass_stack_details?.reduce(
      (total, item) => Number(total) + Number(item.no_of_bags),
      0
    );

    if (Number(data.total_no_of_bags || 0) !== Number(total_bag || 0)) {
      showToastByStatusCode(
        400,
        "Total Bag number and Stack bag numbers do not match."
      );

      return;
    }

    console.log(
      "getValues('gate_pass_stack_details)",
      getValues("gate_pass_stack_details")
    );

    const used_stack =
      getValues("gate_pass_stack_details")?.map((item) => {
        return {
          chamber: getValues("chamber"),
          client: getValues("client"),
          commodity: getValues("commodity"),
          commodity_variety: getValues("commodity_variety"),
          stack_number: item.select_stack_no,
          id: item?.select_stack_no_id || item?.id || null,
        };
      }) || [];

    console.log("used_stack", used_stack);

    console.log(used_stack, "used stack", data);

    if (getValues("id")) {
      updateData({
        ...data,
        id: data.id,
        is_draft: false,
        gate_pass_commodity_quality: temp,
        current_used_stack: used_stack,
      });
    } else {
      addData({
        ...data,
        is_draft: false,
        gate_pass_commodity_quality: temp,
        current_used_stack: used_stack,
      });
    }
  };

  // Add Gate Pass Api Start

  const [addGatePassMaster, { isLoading: addGatePassLoading }] =
    usePostGatePassMutation();

  const addData = async (data) => {
    try {
      const response = await addGatePassMaster(data).unwrap();
      if (response.status === 201 || response.status === 200) {
        showToastByStatusCode(200, response.message);
        navigate(`${ROUTE_PATH.GATE_PASS_INWARD}`);
      }
      console.log("update region master res", response);
    } catch (error) {
      const errors = error.data.message.message;
      toasterAlert(error);
    }
  };

  // Add Gate Pass Api End

  // Update Gate pass Api Start

  const [
    getGatePassById,
    // { isLoading: getGatePassByIdApiIsLoading }
  ] = useGetGatePassByIdMutation();

  const [updateGatePassMaster, { isLoading: updateGatePassLoading }] =
    usePutGatePassMutation();

  const updateData = async (data) => {
    try {
      console.log("details", details);
      console.log({
        ...data,
        id: details.id,
      });
      const response = await updateGatePassMaster({
        ...data,
        id: details.id,
      }).unwrap();
      if (response.status === 200 || response.status === 201) {
        showToastByStatusCode(200, response.message);
        navigate(`${ROUTE_PATH.GATE_PASS_INWARD}`);
      }
      // console.log("update region master res", response);
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  // Update Gate Pass Api End

  //Edit Form Fill Logic Start

  // isDarft
  // chamber
  // warehouse
  // commodity
  // client

  const isFormDisabled = () => {
    let isDisabled = false;
    let status = formDetails?.document_status?.description;

    if (location?.search === "?readonly=true") {
      isDisabled = true;
    } else {
      if (status) {
        isDisabled = status === "l1 Draft" ? false : true;
        console.log(isDisabled);
      }
    }
    console.log(isDisabled);
    return isDisabled;
  };

  const [filledForm, setFilledForm] = useState(false);

  const autoFillForm = async () => {
    if (urlPrams?.id) {
      let form_details = {};
      try {
        const response = await getGatePassById(urlPrams?.id).unwrap();
        if (response?.status === 200) {
          form_details = response?.data;
          setFormDetails(response?.data);
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
            // gate_pass_stack_details
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

            gate_pass_commodity_quality:
              form_details?.gate_pass_commodity_quality,
          };

          const gate_pass_stack_details =
            form_details?.gate_pass_stack_details?.map((item) => {
              let stack_id = item.select_stack_no?.id;
              console.log(stack_id);
              return {
                actual_bag_weight: item.actual_bag_weight,
                // id: item.select_stack_no?  .id,
                // id: item.id,
                id: stack_id || null,
                select_stack_no_id: stack_id,
                lot_no: item.lot_no.stack_lot_number || 0,
                no_of_bags: item.no_of_bags,
                // select_stack_no: item.select_stack_no.id || 0,
                select_stack_no: item.select_stack_no.stack_number || 0,
                upload_stack_image: item.upload_stack_image,
                weight_in_stack: item.weight_in_stack,
              };
            }) || [];

          setValue("gate_pass_stack_details", gate_pass_stack_details, {
            shouldValidate: true,
          });

          console.log(gate_pass_stack_details);
          console.log("form_details obj 111", obj);
          // console.log(form_details?.upload_approval_email.length);

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
        title: "Gate Pass Inward Details",
        link: `${ROUTE_PATH.GATE_PASS_INWARD}`,
      },
    ];

    dispatch(setBreadCrumb(breadcrumbArray));
    dispatch(setSidebarVisibility(true));

    if (formUrl === null) {
      setIsReadOnly(true);
    } else {
      setIsReadOnly(false);
    }
    // eslint-disable-next-line
  }, [urlPrams?.id]);

  //Edit Form Fill Logic End

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
    // eslint-disable-next-line
  }, []);

  // Form Submit Function End

  // Draft Logic Start

  const DraftLogicFunction = async () => {
    try {
      console.log("ksljfdlkj");
      if (
        !getValues("chamber") ||
        !getValues("client") ||
        !getValues("commodity") ||
        !getValues("warehouse")
      ) {
        const fields = {
          chamber: "chamber",
          client: "client",
          commodity: "commodity",
          warehouse: "warehouse",
        };

        Object.keys(fields).forEach(function (key) {
          methods.setError(key, {
            type: "random",
            message: "",
          });
        });
        return false;
      }
      const temp = qualityCommodity.map((item) => ({
        quality_parameter: item?.quality_parameter?.id || 0,
        parameter_value: item.parameter_value,
      }));

      const data = getValues();
      const gatePassDateTimeIn = data.gate_pass_date_time_in
        ? data.gate_pass_date_time_in
        : null;
      const gatePassDateTimeOut = data.gate_pass_date_time_out
        ? data.gate_pass_date_time_out
        : null;
      const weighbridgeSlipDateTime = data.weighbridge_slip_datetime
        ? data.weighbridge_slip_datetime
        : null;

      console.log("==========>", getValues("gate_pass_stack_details"));

      const used_stack =
        getValues("gate_pass_stack_details")?.map((item) => {
          return {
            chamber: getValues("chamber"),
            client: getValues("client"),
            commodity: getValues("commodity"),
            commodity_variety: getValues("commodity_variety"),
            // stack_number: selectBoxOptions?.stack?.filter(
            //   (el) => el.value === item.select_stack_no
            // )[0]?.id,
            stack_number: item.select_stack_no,

            id: item?.select_stack_no_id || item?.id || null,
            // stack_number: item.select_stack_no,
            // id: item.id,
          };
        }) || [];

      console.log(data, " checking for id");

      if (getValues("id")) {
        const response = await updateGatePassMaster({
          ...data,
          id: getValues("id"),
          is_draft: true,
          gate_pass_commodity_quality: temp,
          gate_pass_date_time_in: gatePassDateTimeIn, // Use the modified value here
          gate_pass_date_time_out: gatePassDateTimeOut,
          weighbridge_slip_datetime: weighbridgeSlipDateTime,
          current_used_stack: used_stack || [],
        }).unwrap();
        if (response.status === 200) {
          navigate(`${ROUTE_PATH.GATE_PASS_INWARD}`);
          showToastByStatusCode(200, "GatePass Drafted Successfully");

          // toasterAlert({
          //   message: "GatePass Drafted Successfully.",
          //   status: 200,

          // });
          methods.setValue("id", response.data.id, { shouldValidate: true });
        }
      } else {
        console.log("data first time darft ---------> ", data);

        const response = await addGatePassMaster({
          ...data,
          is_draft: true,
          gate_pass_commodity_quality: temp,
          gate_pass_date_time_in: gatePassDateTimeIn, // Use the modified value here
          gate_pass_date_time_out: gatePassDateTimeOut,
          weighbridge_slip_datetime: weighbridgeSlipDateTime,
          current_used_stack: used_stack || [],
        }).unwrap();
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          showToastByStatusCode(201, "GatePass Drafted Successfully");
          console.log(response, "response");
          navigate(`${ROUTE_PATH.GATE_PASS_INWARD}`);

          methods.setValue("id", response.data.id, { shouldValidate: true });
        }
      }
    } catch (error) {
      toasterAlert(error);
    }
  };

  //? changes made by me on 04/12/2023
  return (
    <>
      <Box bg="white" borderRadius={10} maxHeight="calc(100vh - 250px)">
        <Box bg="white" borderRadius={10} p="10">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
                {/* the code for the inward section for the gate pass  */}
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
                        Gate pass Date and In Time{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type={"datetime-local"}
                        name="gate_pass_date_time_in"
                        placeholder={"Enter date & time"}
                        inputValue={getValues("gate_pass_date_time_in")}
                        InputDisabled={isFormDisabled()}
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
                        Gate pass Date and Out Time{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type={"datetime-local"}
                        name="gate_pass_date_time_out"
                        placeholder={"Enter date & time"}
                        min={moment(getValues("gate_pass_date_time_in")).format(
                          "YYYY-MM-DDTHH:mm"
                        )}
                        inputValue={getValues("gate_pass_date_time_out") || ""}
                        InputDisabled={isFormDisabled()}
                        onChange={(e) => {
                          console.log(e, "gate_pass_date_time_out");
                          setValue("gate_pass_date_time_out", e.target.value, {
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
                        Warehouse{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <ReactCustomSelect
                        name="warehouse"
                        options={selectBoxOptions?.warehouse || []}
                        selectedValue={
                          selectBoxOptions?.warehouse?.filter(
                            (item) => item.value === getValues("warehouse")
                          )[0] || {}
                        }
                        selectDisable={isFormDisabled()}
                        isLoading={getWarehouseMasterApiIsLoading}
                        handleOnChange={(val) => {
                          setValue("warehouse", val.value, {
                            shouldValidate: true,
                          });
                          console.log(
                            "weighbridge_name value:",
                            val.weighbridge_name
                          );
                          setValue(
                            "weighbridge_name",
                            val.weighbridge_name || "",
                            {
                              shouldValidate: !!val.weighbridge_name, // Set shouldValidate to false when the value is an empty string
                            }
                          );
                          setValue("chamber", null, {
                            shouldValidate: true,
                          });

                          setValue("commodity_variety", null, {
                            shouldValidate: true,
                          });

                          setValue("commodity", null, {
                            shouldValidate: true,
                          });



                          setValue("client", null, {
                            shouldValidate: true,
                          });

                          setValue(
                            "service_contract",
                            val.service_contract || "",
                            {
                              shouldValidate: !!val.service_contract, // Set shouldValidate to false when the value is an empty string
                            }
                          );

                          setValue("gate_pass_stack_details", [], {
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
                        Chamber{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <ReactCustomSelect
                        name="chamber"
                        options={
                          selectBoxOptions?.chamber?.filter(
                            (item) => item.warehouse === getValues("warehouse")
                          ) || []
                        }
                        selectedValue={
                          selectBoxOptions?.chamber?.filter(
                            (item) => item.value === getValues("chamber")
                          )[0] || {}
                        }
                        selectDisable={isFormDisabled()}
                        isLoading={getChamberApiIsLoading}
                        handleOnChange={(val) => {
                          setValue("chamber", val.value, {
                            shouldValidate: true,
                          });
                          setValue("client", null, {
                            shouldValidate: true,
                          });

                          setValue("commodity_variety", null, {
                            shouldValidate: true,
                          });

                          setValue("commodity", null, {
                            shouldValidate: true,
                          });

                          setValue(
                            "service_contract",
                            val.service_contract || "",
                            {
                              shouldValidate: !!val.service_contract, // Set shouldValidate to false when the value is an empty string
                            }
                          );
                          setValue("gate_pass_stack_details", [], {
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
                        Client name{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <ReactCustomSelect
                        name="client"
                        options={selectBoxOptions?.client || []}
                        selectedValue={
                          selectBoxOptions?.client?.filter(
                            (item) => item.value === getValues("client")
                          )[0] || {}
                        }
                        selectDisable={isFormDisabled()}
                        isLoading={getClientMasterApiIsLoading}
                        handleOnChange={(val) => {
                          setValue("client", val.value, {
                            shouldValidate: true,
                          });
                          setValue("commodity", "", {
                            shouldValidate: true,
                          });

                          setValue("commodity_variety", null, {
                            shouldValidate: true,
                          });

                           setValue(
                            "service_contract",
                            val.service_contract || "",
                            {
                              shouldValidate: !!val.service_contract, // Set shouldValidate to false when the value is an empty string
                            }
                          );
                          setValue("gate_pass_stack_details", [], {
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
                        Client representative name{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type="text"
                        name="client_representative_name"
                        placeholder={"Client representative name"}
                        InputDisabled={isFormDisabled()}
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
                        Commodity name{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <ReactCustomSelect
                        name="commodity"
                        errorMsgHide={false}
                        options={selectBoxOptions?.community || []}
                        selectedValue={
                          selectBoxOptions?.community?.filter(
                            (item) => item.value === getValues("commodity")
                          )[0] || {}
                        }
                        selectDisable={isFormDisabled()}
                        isLoading={getCommodityMasterApiIsLoading}
                        handleOnChange={(val) => {
                          setValue("commodity", val.value, {
                            shouldValidate: true,
                          });
                          setValue("commodity_variety", null, {
                            shouldValidate: true,
                          });
                          setValue(
                            "service_contract",
                            val.service_contract || "",
                            {
                              shouldValidate: !!val.service_contract, // Set shouldValidate to false when the value is an empty string
                            }
                          );

                          setValue("gate_pass_stack_details", [], {
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
                        Commodity Variety{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

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
                        selectDisable={isFormDisabled()}
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
                      <Text textAlign="right">
                        Service Contract{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

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
                      <Text textAlign="right">
                        Truck No.{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type={"text"}
                        name="truck_no"
                        placeholder={"Truck No"}
                        InputDisabled={isFormDisabled()}
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
                      <Text textAlign="right">
                        Truck image
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <Box>
                        {getValues("truck_image")?.length <= 1 ? (
                          <CustomFileInput
                            name=""
                            placeholder="Upload truck Images"
                            label=""
                            type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                            defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                            maxSize={2}
                            InputDisabled={isFormDisabled()}
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
                            <ModalHeader>
                              Warehouse Photos{" "}
                              <Box as="span" color="red">
                                *
                              </Box>{" "}
                            </ModalHeader>
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
                                        (getValues("truck_image")?.length - 1 ||
                                          0)
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
                      <Text textAlign="right">
                        Driver Name{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type={"text"}
                        name="driver_name"
                        placeholder={"Enter driver name"}
                        InputDisabled={isFormDisabled()}
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
                        Upload Driver Photo{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>
                      <Box>
                        <CustomFileInput
                          name="upload_driver_photo"
                          placeholder="Upload Images"
                          value={getValues("upload_driver_photo")}
                          InputDisabled={isFormDisabled()}
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
                      <Text textAlign="right">
                        Weighbridge Name{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>
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
                        <Text textAlign="right">
                          Email Attachment{" "}
                          <Box as="span" color="red">
                            *
                          </Box>{" "}
                        </Text>
                        <Box>
                          <CustomFileInput
                            name="upload_approval_email"
                            placeholder="Upload Images"
                            value={getValues("upload_approval_email")}
                            InputDisabled={isFormDisabled()}
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
                      <Text textAlign="right">
                        New Weighbridge Name{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type={"text"}
                        name="new_weighbridge_name"
                        placeholder={"New Weighbridge Name"}
                        InputDisabled={
                          !getValues("upload_approval_email")?.length > 0 &&
                          !isReadOnly
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
                      <Text textAlign="right">
                        Weighbridge Slip No.{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type="text"
                        name="weighbridge_slip_no"
                        placeholder={"Enter weighbridge slip no  "}
                        InputDisabled={isFormDisabled()}
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
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type="datetime-local"
                        name="weighbridge_slip_datetime"
                        placeholder={"Enter weighbridge slip date & time  "}
                        InputDisabled={isFormDisabled()}
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
                        Upload weighbridge slip{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>
                      <Box>
                        <CustomFileInput
                          name="upload_weighbridge_slip"
                          placeholder="Upload Images"
                          label=""
                          value={getValues("upload_weighbridge_slip")}
                          InputDisabled={isFormDisabled()}
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
                      <Text textAlign="right">
                        Total no of bags{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type="number"
                        name="total_no_of_bags"
                        placeholder={"Enter Total no of bags"}
                        InputDisabled={isFormDisabled()}
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
                      <Text textAlign="right">
                        Gross Weight (in MT){" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type="number"
                        step={0.01}
                        InputDisabled={isFormDisabled()}
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
                      <Text textAlign="right">
                        tare Weight (in MT){" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type="number"
                        step={0.01}
                        InputDisabled={isFormDisabled()}
                        name="tare_weight"
                        placeholder={"Enter Tare weight  "}
                        inputValue={getValues("tare_weight")}
                        onChange={(e) => {
                          let gross_weight_kg = Number(
                            getValues("gross_weight_kg") || 0
                          );

                          let tare_weight = Number(e.target.value || 0);

                          if (gross_weight_kg > tare_weight) {
                            setValue("tare_weight", e.target.value, {
                              shouldValidate: true,
                            });
                          } else {
                            setValue("tare_weight", "", {
                              shouldValidate: false,
                            });
                            setError("tare_weight", {
                              type: "custom",
                              message:
                                "Tare weight should be less than Gross weight ",
                            });
                          }
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
                        Net Weight (in MT){" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

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
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
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
                          console.log(val);
                          setStackDetail((old) => ({
                            ...old,
                            select_stack_no: val?.value,
                            select_stack_no_id: val?.id,
                            id: val?.id,
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
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
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
                        borderColor={stackError.no_of_bags ? "red" : "gray.10"}
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
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomFileInput
                        name=""
                        placeholder="Upload Images"
                        InputDisabled={isFormDisabled()}
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
                      isDisabled={isFormDisabled()}
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
                        <Th color="#000">Average Bag Size In Lot(Kg)</Th>
                        <Th color="#000">Weight in Stack (MT) </Th>
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
                              <Td>
                                {index + 1}{" "}
                                {/* {item?.id || item?.select_stack_no_id} */}
                              </Td>
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
                                <Box display="flex" alignItems="center" gap="3">
                                  <Flex gap="20px" justifyContent="center">
                                    <Box color={"primary.700"}>
                                      <Button
                                        isDisabled={isFormDisabled()}
                                        color="primary.700"
                                        background=""
                                      >
                                        <BiEditAlt
                                          fontSize="26px"
                                          cursor="pointer"
                                          onClick={() => {
                                            updateStackData(item, index);
                                          }}
                                        />
                                      </Button>
                                    </Box>
                                    <Box color="red">
                                      <Button
                                        isDisabled={isFormDisabled()}
                                        background=""
                                        color="red.500"
                                      >
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
                                      </Button>
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
                        Test Result{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
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
                                      type="text"
                                      value={item?.parameter_value || ""}
                                      isDisabled={isFormDisabled()}
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
                                      isDisabled={isFormDisabled()}
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
                      <Text textAlign="right">
                        Sample Seal No{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type="text"
                        name="sample_seal_no"
                        placeholder={"Enter Seal No"}
                        InputDisabled={isFormDisabled()}
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
                        Sampler name{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <CustomInput
                        type={"text"}
                        name="sampler_name"
                        placeholder={"Sampler name"}
                        InputDisabled={isFormDisabled()}
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

                      <CustomTextArea
                        type="text"
                        name="remarks"
                        placeholder={"Remarks"}
                        InputDisable={isFormDisabled()}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {!isFormDisabled() && (
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
                )}
              </Box>
            </form>
          </FormProvider>
        </Box>
      </Box>
    </>
  );
}
