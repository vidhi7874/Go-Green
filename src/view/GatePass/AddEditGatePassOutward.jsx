import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  CommonToasterAlert,
  createQueryParams,
  toasterAlert,
} from "../../services/common.service";
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
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { MotionSlideUp } from "../../utils/animation";
import CustomInput from "../../components/Elements/CustomInput";
import moment from "moment";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import { LeftIcon, RightIcon } from "../../components/Icons/Icons";
import { ArrowForwardIcon, EditIcon, EmailIcon } from "@chakra-ui/icons";
import ReactSelect from "react-select";
import { BiDownload, BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { setSidebarVisibility } from "../../features/filter.slice";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import {
  useGetGatePassByIdMutation,
  useGetGatePassOutwardByIdMutation,
  usePostGatePassMutation,
  usePutGatePassMutation,
  useGetAllDOMutation,
  useGetOutwardGatepassDoMutation,
  useGetQualityParameterMutation,
  usePostGatePassOutwardMutation,
  usePutGatePassOutWardMutation,
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
import ROUTE_PATH from "../../constants/ROUTE";
import configuration from "../../config/configuration";
import { localStorageService } from "../../services/localStorge.service";
import { FaEye } from "react-icons/fa";
import * as Yup from "yup";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { doDetailsSchema, outWardSchema } from "./fields";
import { xorBy } from "lodash";

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

function isDoAlreadyExists(obj, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]?.select_lot_no?.value === obj?.select_lot_no?.value) {
      return true; // DO already exists
    }
  }
  return false; // DO does not exist
}

export default function AddEditGatePassOutward() {
  const dispatch = useDispatch();
  const location = useLocation();
  const urlPrams = useParams();
  const navigate = useNavigate();

  const [gatePassDetails, setGatePassDetails] = useState({});

  console.log("urlPrams: ", urlPrams);

  const loginData = localStorageService.get("GG_ADMIN");

  const methods = useForm({
    resolver: yupResolver(outWardSchema),
    defaultValues: {
      gate_pass_in_date_time: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      gate_pass_out_date_time: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      weight_bridge_slip_date_time: moment(new Date()).format(
        "YYYY-MM-DDTHH:mm"
      ),
      gate_pass_type: "outward",
      truck_image_path: [],
      //  gate_pass_stack_details: [],
      sampler_name: loginData?.userDetails?.employee_name || "",
    },
  });

  const {
    setValue,
    getValues,
    trigger,
    formState,
    watch,
    control,
    setError,
    setFocus,
    register,
    clearErrors,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "outward_gate_pass_commodity_quality_details",
    //focusAppend: false, // auto focus by default.
  });
  console.log("Default Values:", methods.getValues(), formState?.errors);
  //const details = location.state?.details;
  const formUrl = location.state?.from || null;
  console.log("formUrl: ", formUrl);
  const details = { id: urlPrams?.id };
  console.log("testing details", details);

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

  const [doDetailsSubTable, setDoDetailsSubTable] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [selectBoxOptions, setSelectBoxOptions] = useState({});
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [stack_wise_do_data, setStack_wise_do_data] = useState([]);
  const [lotDetails, setLotDetails] = useState([]);
  const [isLotDetailsEditState, setIsLotDetailsEditState] = useState({
    index: null,
    isEdit: false,
  });

  // Warehouse Master start

  const [getWarehouseMaster, { isLoading: getWarehouseMasterApiIsLoading }] =
    useGetWareHouseFreeMutation();

  const InputDisableFunction = () => {
    const isViewOnly = location?.state?.isViewOnly || false;
    console.log("isViewOnly", isViewOnly);

    const NotUser =
      Number(gatePassDetails?.status?.status_code || 0) === 0
        ? false
        : gatePassDetails?.l3_user !== null
        ? gatePassDetails?.l3_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : gatePassDetails?.l2_user !== null
        ? gatePassDetails?.l2_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : gatePassDetails?.l1_user !== null
        ? gatePassDetails?.l1_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : true;

    const result =
      // pageView ||
      isViewOnly ||
      NotUser ||
      gatePassDetails?.status?.status_code === 1 ||
      gatePassDetails?.status?.status_code === 3 ||
      gatePassDetails?.status?.status_code === 4 ||
      gatePassDetails?.status?.status_code === 6 ||
      gatePassDetails?.status?.status_code === 7
        ? true
        : false;

    // console.log(result);

    return result;
  };

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
              weight_bridge_name: weighbridge_name,
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
          getValues("warehouse")?.value +
          "&filter=contractcommodity__service_contract__contractwarehousechamber__chamber__id&contractcommodity__service_contract__contractwarehousechamber__chamber__id=" +
          getValues("chamber").value +
          "&filter=contractcommodity__service_contract__client__id&contractcommodity__service_contract__client__id=" +
          getValues("client")?.value
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
    console.log("lotDetails", lotDetails);
    const subTable = doSubTableCalculate(lotDetails);
    // current_do_mt
    // deposit_cir_bags
    console.log(subTable);

    // {
    //   select_do_no: { label: 'GGDR/1/GUJ', value: 43 },
    //   do_expiry_date: '2024-01-31',
    //   balance_bags_in_do: 1400,
    //   balance_mt_in_do: 65,
    //   deposit_cir_bags: 500,
    //   select_stack_no: { label: 100, value: 323 },
    //   select_lot_no: { label: 'GP2401291/1', value: 194 },
    //   total_bags_can_delivered: 200,
    //   total_mt_can_delivered: 5,
    //   current_do_bags: '1',
    //   current_do_mt: '3',
    //   remaining_bag_lot_as_do: 199,
    //   remaining_mt_lot_as_do: 2,
    //   remaining_for_do_bags: 1399,
    //   remaining_for_do_mt: 62
    // }

    const totalCurrentBagsDelivered = subTable.reduce(
      (total, item) => total + item.current_do_bags,
      0
    );

    const totalCurrentMtDelivered = subTable.reduce(
      (total, item) => total + item.current_do_mt,
      0
    );

    setValue("total_bags", totalCurrentBagsDelivered, {
      shouldValidate: true,
    });

    setValue("total_mt", totalCurrentMtDelivered, {
      shouldValidate: true,
    });

    // console.log("Total Bags Delivered:", totalBagsDelivered);
    // console.log("Total MT Delivered:", totalMtDelivered);
    console.log(subTable);

    setDoDetailsSubTable(subTable);

    console.log(subTable);
  }, [lotDetails]);

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
        (item) => item.value === getValues("commodity")?.value
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
          getValues("warehouse")?.value +
          "&filter=servicecontract__contractwarehousechamber__chamber__id&servicecontract__contractwarehousechamber__chamber__id=" +
          getValues("chamber")?.value
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
    if (getValues("warehouse")?.value && getValues("chamber")?.value) {
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
          getValues("client")?.value +
          "&filter=warehouse&warehouse=" +
          getValues("warehouse")?.value +
          "&filter=chamber&chamber=" +
          getValues("chamber")?.value +
          "&filter=commodity&commodity=" +
          getValues("commodity")?.value
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
    // eslint-disable-next-line
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
      "truck_image_path",
      getValues("truck_image_path").filter(
        (item2, index) => imageNumber !== index
      ),
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
          getValues("client")?.value +
          "&chamber=" +
          getValues("chamber")?.value +
          "&commodity=" +
          getValues("commodity")?.value
      ).unwrap();
      console.log(" getStackMasterList Success:", response);
      // setSelectBoxOptions((prev) => ({
      //   ...prev,
      //   stack:
      //     response?.data?.map((item) => ({
      //       label: item,
      //       value: item,
      //     })) || [],
      // }));
    } catch (error) {
      console.error("Error:", error);
      CommonToasterAlert(error);
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
    if (getValues("gross_weight") && getValues("tare_weight")) {
      setValue(
        "net_weight",
        Number(getValues("gross_weight") || 0) -
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
    // if (getValues("net_weight") && getValues("total_no_of_bags")) {
    //   setWeight(
    //     Number(getValues("net_weight") || 0) /
    //       Number(getValues("total_no_of_bags") || 0).toFixed(2)
    //   );
    //   setStackDetail((old) => ({
    //     ...old,
    //     bag_weight_kg:
    //       Number(getValues("net_weight") || 0) /
    //       Number(getValues("total_no_of_bags") || 0).toFixed(2),
    //   }));
    //   const temp = getValues("gate_pass_stack_details");
    //   setValue(
    //     "gate_pass_stack_details",
    //     temp?.map((item) => ({
    //       select_stack_no: item.select_stack_no,
    //       lot_no: item.lot_no,
    //       no_of_bags: item.no_of_bags,
    //       bag_weight_kg:
    //         Number(getValues("net_weight") || 0) /
    //         Number(getValues("total_no_of_bags") || 0).toFixed(2),
    //       weight_in_stack:
    //         Number(item.no_of_bags) *
    //         (Number(getValues("net_weight") || 0) /
    //           Number(getValues("total_no_of_bags") || 0).toFixed(2)),
    //       upload_stack_image: item.upload_stack_image,
    //     })),
    //     {
    //       shouldValidate: true,
    //     }
    //   );
    // }
    // eslint-disable-next-line
    // getValues("total_no_of_bags")
  }, [getValues("net_weight")]);

  const [stackDetail, setStackDetail] = useState({
    select_stack_no: "",
    lot_no: "",
    no_of_bags: "",
    bag_weight_kg: weight,
    weight_in_stack: "",
    upload_stack_image: "",
  });

  const [stackError, setStackError] = useState({
    select_stack_no: "",
    lot_no: "",
    no_of_bags: "",
    bag_weight_kg: "",
    weight_in_stack: "",
    upload_stack_image: "",
  });

  const stackDetailClean = () => {
    setStackDetail({
      select_stack_no: "",
      lot_no: "",
      no_of_bags: "",
      bag_weight_kg: weight,
      weight_in_stack: "",
      upload_stack_image: "",
    });
  };

  const stackErrorClean = () => {
    setStackError({
      select_stack_no: "",
      lot_no: "",
      no_of_bags: "",
      bag_weight_kg: "",
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
      stackDetail.bag_weight_kg !== "" &&
      // stackDetail.bag_weight_kg > 0 &&
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
      bag_weight_kg:
        stackDetail.bag_weight_kg === ""
          ? "Error"
          : stackDetail.bag_weight_kg < 0
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
    if (stackDetail.no_of_bags > 0 && stackDetail.bag_weight_kg > 0) {
      let temp =
        Number(stackDetail.no_of_bags || 0) *
        Number(stackDetail.bag_weight_kg || 0);
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
  }, [stackDetail.no_of_bags, stackDetail.bag_weight_kg]);

  const AddUpdateLotDetails = () => {
    try {
      const selectedKeys = [
        "select_do_no", // d
        "do_expiry_date", // d
        "balance_bags_in_do", // d
        "balance_mt_in_do", // d
        "deposit_cir_bags",
        "select_stack_no", // d
        "select_lot_no", // d
        "total_bags_can_delivered", // d
        "total_mt_can_delivered", // d
        "current_do_bags", // d
        "current_do_mt", // d
        "remaining_bag_lot_as_do", // d
        "remaining_mt_lot_as_do", // d
        "remaining_for_do_bags", // d
        "remaining_for_do_mt", // d
      ];

      const data = getValues(selectedKeys);

      console.log(data);

      let formDataObj = {};

      selectedKeys.forEach((key, index) => {
        formDataObj[key] = data[index];
      });
      formDataObj = {
        ...formDataObj,
        select_do_no: {
          label: formDataObj?.select_do_no?.label,
          value: formDataObj?.select_do_no?.value,
        },
      };

      const currentDate = moment();
      const expiryDate = moment(formDataObj?.do_expiry_date);

      const isValid = validateLotDetailsFormData(formDataObj);

      if (
        currentDate.format("MM/DD/YYYY") === expiryDate.format("MM/DD/YYYY") ||
        !expiryDate.isSameOrBefore(currentDate)
      ) {
        // return expiryDate < currentDate;

        // select_lot_no

        console.log(formDataObj);

        const { index, isEdit } = isLotDetailsEditState;

        console.log(selectBoxOptions?.stack);

        const lotDetailsArray = lotDetails?.length ? [...lotDetails] : [];
        const copy_mainArr = [...lotDetailsArray];

        console.log(lotDetailsArray);
        console.log(copy_mainArr);

        // let isAlreadyExists = isDoAlreadyExists(formDataObj, lotDetailsArray);

        const stateExistsInMainArr = isDoAlreadyExists(
          formDataObj,
          lotDetailsArray
        );

        const stateExistsInCopyArr = isDoAlreadyExists(
          formDataObj,
          copy_mainArr
        );

        if (isEdit && index >= 0 && index < lotDetailsArray.length) {
          // edit code
          // lotDetailsArray.splice(index, 1);
          // setLotDetails([...lotDetailsArray, formDataObj]);

          // In edit mode and the edited index exists
          if (stateExistsInMainArr) {
            if (
              lotDetailsArray[index]?.select_lot_no?.label ===
              formDataObj?.select_lot_no?.label
            ) {
              // The doc_type remains the same, update the existing entry in the main kyc array
              const updatedArr = [...lotDetailsArray];
              updatedArr[index] = formDataObj;
              // setReservationBagSizeList((prev) => [...prev, formDataObj?.select_lot_no]);

              setLotDetails(updatedArr);
              //  clearErrors(["bag_size", "pbpm_rate", "rate"]);
            } else {
              // The doc_type has changed, check if it exists in the copy array
              if (stateExistsInCopyArr) {
                showToastByStatusCode(
                  400,
                  "Lot number is already added. please update the same"
                );
              } else {
                // Update the existing entry in the main kyc array with the new doc_type
                const updatedArr = [...lotDetailsArray];
                updatedArr[index] = formDataObj;
                //setIsKycFormDirty(false);
                // setReservationBagSizeList((prev) => [...prev, obj?.bag_size]);

                setLotDetails(updatedArr);
                //  clearErrors(["bag_size", "pbpm_rate", "rate"]);
              }
            }
          } else {
            showToastByStatusCode(400, "DO not found ##.");
          }
        } else {
          // add code

          // Not in edit mode or index is out of bounds
          if (stateExistsInCopyArr) {
            showToastByStatusCode(
              400,
              "Lot number is already added. please update the same"
            );
          } else {
            //setReservationBagSizeList((prev) => [...prev, obj?.bag_size]);

            setLotDetails([...lotDetails, formDataObj]);

            // lotDetails?.length > 0
            // ? setLotDetails((prev) => [...prev, formDataObj])
            // : setLotDetails([formDataObj]);
            // clearErrors(["bag_size", "pbpm_rate", "rate"]);
          }

          // setIsLotDetailsEditState({
          //   isEdit: false,
          //   index: null,
          // });
        }

        selectedKeys.forEach((key) => {
          setValue(key, "", {
            shouldValidate: false,
          });
        });

        setStackDetail((prev) => ({
          ...prev,
          select_do_no: {},
          select_stack_no: {},
          select_lot_no: {},
        }));

        selectedKeys.forEach((key) => {
          clearErrors(key);
        });
        setIsLotDetailsEditState({
          isEdit: false,
          index: null,
        });

        console.log(isValid);
      } else {
        setError("do_expiry_date", {
          type: "focus",
          message: "DO is Expired.",
        });
        return false;
      }
    } catch (validationErrors) {
      console.log("validationErrors", validationErrors);
      Object.keys(validationErrors).forEach((key) => {
        setError(key, {
          type: "manual",
          message: validationErrors[key] || "",
        });
      });
      return false;
    }
  };

  const updateStackData = (data, index) => {
    console.log(data);
    // let dataObj = {
    //   ...data,
    //   do_expiry_date: data?.new_expiry_date,
    // };

    //console.log(dataObj);
    setIsLotDetailsEditState({
      isEdit: true,
      index: index,
    });

    setStackDetail({
      select_do_no: data?.select_do_no?.value,
      select_stack_no: data?.select_stack_no?.value,
      select_lot_no: data?.select_lot_no?.value,
      do_expiry_date: data?.do_expiry_date,

      // select_stack_no: data.select_stack_no,
      // lot_no: data.lot_no,
      no_of_bags: data.no_of_bags,
      bag_weight_kg: data.bag_weight_kg,
      weight_in_stack: data.weight_in_stack,
      upload_stack_image: data.upload_stack_image,
    });

    Object.keys(data).forEach((key) => {
      setValue(key, data[key], {
        shouldValidate: true,
      });
    });
    // setUpdateStackId(id);
  };

  const deleteLotDetails = (index) => {
    const lotDetailsDetailsArray = [...lotDetails];

    // Use splice to remove the item at the specified index
    lotDetailsDetailsArray.splice(index, 1);

    // Set the state with the updated array
    setLotDetails(lotDetailsDetailsArray);
  };

  // const updateStackDetails = () => {
  //   if (stackCheckCondition()) {
  //     const temp = getValues("gate_pass_stack_details");
  //     setValue(
  //       "gate_pass_stack_details",
  //       [
  //         ...temp.slice(0, updateStackId),
  //         stackDetail,
  //         ...temp.slice(updateStackId + 1),
  //       ],
  //       {
  //         shouldValidate: true,
  //       }
  //     );
  //     setUpdateStackId(null);
  //     stackErrorClean();
  //     stackDetailClean();
  //   } else {
  //     stackErrorFilling();
  //   }
  // };

  // Stack Details Logic end

  // new Weighbridge Logic start

  const [emailCheck, setEmailCheck] = useState(false);

  // new Weighbridge Logic end
  // eslint-disable-next-line
  // Form Submit Function Start

  console.log("form error --->", formState?.errors);
  const onSubmit = (formData) => {
    // driver_photo_path
    // weight_bridge_deviation_path
    // upload_approval_email
    // total_mt

    console.log("formData --->", formData);
    const finalPayload = {
      gate_pass_type: "outward",
      gate_pass_in_date_time: formData.gate_pass_in_date_time,
      gate_pass_out_date_time: formData.gate_pass_out_date_time,
      warehouse: formData.warehouse.value,
      chamber: formData.chamber.value,
      client: formData.client.value,
      client_representative_name: formData.client_representative_name,
      commodity: formData.commodity.value,
      commodity_variety: formData.commodity_variety.value,
      total_bags: formData.total_bags,
      total_mt: formData.total_mt,
      truck_number: formData.truck_number,
      truck_image_path: formData.truck_image_path,
      driver_name: formData.driver_name,
      driver_photo_path: [formData.driver_photo_path],
      weight_bridge_name: formData.weight_bridge_name.value,
      weight_bridge_slip_no: formData.weight_bridge_slip_no,
      weight_bridge_slip_date_time: formData.weight_bridge_slip_date_time,
      weight_bridge_slip_upload_path: [formData.weight_bridge_slip_upload_path],
      new_weight_bridge_name: formData.new_weight_bridge_name,
      tare_weight: formData.tare_weight,
      gross_weight: formData.gross_weight,
      net_weight: formData.net_weight,
      remarks: formData.remarks,
      is_draft: false, // Assuming is_draft is always true based on your provided data
      outward_gate_pass_do_details: lotDetails?.map((el) => ({
        do: el.select_do_no.value,
        stack_no: el.select_stack_no.value,
        lot_no: el.select_lot_no.value,
        current_bag_for_gatepass: el.current_do_bags || null,
        current_mt_for_gatepass: el.current_do_mt || null,

        balance_bags_do: el?.balance_bags_in_do,
        balance_mt_do: el?.balance_mt_in_do,
        deposite_bag_size: el?.deposit_cir_bags,
        deliverable_bag_from_lot: el?.total_bags_can_delivered,
        deliverable_mt_from_lot: el?.total_mt_can_delivered,
        lot_remaining_bag: el?.remaining_bag_lot_as_do,
        lot_remaining_mt: el?.remaining_mt_lot_as_do,
        do_remaining_bag: el?.remaining_for_do_bags,
        mt_remaining_bag: el?.remaining_for_do_mt,
      })),

      outward_gate_pass_commodity_quality_details:
        formData?.outward_gate_pass_commodity_quality_details?.map((el) => ({
          quality_parameter: el?.quality_parameter_id,
          parameter_value: el?.parameter_value,
        })),
    };

    if (Number(finalPayload?.total_mt) !== Number(finalPayload?.net_weight)) {
      showToastByStatusCode(
        400,
        "Net Weight(In MT) should be equal to Total MT To Be Delivered"
      );
      return false;
    }

    const weighBridgeDateTime = moment(
      finalPayload.weight_bridge_slip_date_time,
      "your_date_format"
    );
    const gatePassDateTimeIn = moment(
      finalPayload.gate_pass_in_date_time,
      "your_date_format"
    );

    // Check if either of the moments is not valid
    if (!weighBridgeDateTime.isValid() || !gatePassDateTimeIn.isValid()) {
      showToastByStatusCode(400, "Invalid date format");
      return;
    }

    // Check if weighbridge date is after gate pass date
    if (weighBridgeDateTime.isAfter(gatePassDateTimeIn)) {
      showToastByStatusCode(
        400,
        "The Weighbridge Date and Time should be less than or equal to the Gate Pass Date and Time"
      );
      return;
    }

    // id: el.quality_parameter.id,
    // // Additional Fields
    // balance_bags_in_do: formData.balance_bags_in_do,
    // balance_mt_in_do: formData.balance_mt_in_do,
    // deposit_cir_bags: formData.deposit_cir_bags,
    // total_bags_can_delivered: formData.total_bags_can_delivered,
    // total_mt_can_delivered: formData.total_mt_can_delivered,
    // remaining_bag_lot_as_do: formData.remaining_bag_lot_as_do,
    // remaining_mt_lot_as_do: formData.remaining_mt_lot_as_do,
    // remaining_for_do_bags: formData.remaining_for_do_bags,
    // remaining_for_do_mt: formData.remaining_for_do_mt,
    // weight_bridge_name: formData.weight_bridge_name,
    // do_expiry_date: formData.do_expiry_date,
    // select_do_no: formData.select_do_no,
    // select_stack_no: formData.select_stack_no,
    // select_lot_no: formData.select_lot_no,
    console.log("postManPayload ---> ", finalPayload);
    console.log("onSubmit data ---->", finalPayload);
    if (isReadOnly) {
      return false;
    }
    const temp = qualityCommodity.map((item) => ({
      quality_parameter: item?.quality_parameter?.id || 0,
      parameter_value: item.parameter_value,
    }));

    // if (emailCheck) {
    //   if (formData?.new_weight_bridge_name?.length > 0) {
    //   } else {
    //     toasterAlert({
    //       message: "Please Add New Weighbridge Name",
    //       status: 440,
    //     });
    //     return;
    //   }
    // } else {
    //   if (formData?.weight_bridge_name?.length > 0) {
    //   } else {
    //     toasterAlert({
    //       message: "Please Weighbridge Name OR New Weighbridge Name",
    //       status: 440,
    //     });
    //     return;
    //   }
    // }

    // Rest of your code...

    if (emailCheck) {
      if (finalPayload?.new_weight_bridge_name?.length > 0) {
      } else {
        showToastByStatusCode(400, "Please Add New Weighbridge Name");
        return;
      }
    } else {
      if (finalPayload?.weight_bridge_name?.length > 0) {
        // console.log(data?.finalPayload, "hhhhhh");
      } else {
        showToastByStatusCode(
          400,
          "Please Weighbridge Name OR New Weighbridge Name"
        );
        return;
      }
    }

    const qualityDetails =
      formData?.outward_gate_pass_commodity_quality_details;

    // if (qualityDetails && qualityDetails.length > 0) {
    //   const moistureDetail = qualityDetails.find(
    //     (detail) => detail.quality_parameter === "moisture"
    //   );

    //   if (moistureDetail && !moistureDetail.parameter_value) {
    //     // showToastByStatusCode(400, "Please fill in the Result field for Moisture");
    //     // setError("")
    //     return;
    //   }
    // }

    if (details?.id) {
      const final_data = JSON.parse(JSON.stringify(finalPayload));
      console.log(final_data);
      updateData({
        ...final_data,
        id: details?.id,
        is_draft: false,
      });
    } else {
      addData(finalPayload);
    }
  };

  // Add Gate Pass Api Start

  // const [postGatePassOutward, { isLoading: addGatePassLoading }] =
  //   usePostGatePassMutation();

  const [postGatePassOutward, { isLoading: postGatePassOutwardApiLoading }] =
    usePostGatePassOutwardMutation();

  const addData = async (data) => {
    try {
      const response = await postGatePassOutward(data).unwrap();
      if (response.status === 201) {
        showToastByStatusCode(201, response?.message);
        navigate(`${ROUTE_PATH.GATE_PASS_OUTWARD}`);
      }
      console.log("update region master res", response);
    } catch (error) {
      CommonToasterAlert(error);
      // let errorMessage =
      //   error?.data?.data ||
      //   error?.data?.message ||
      //   error?.data ||
      //   "GatePass Request Failed.";
      // console.log("Error:", errorMessage);
      // toasterAlert({
      //   message: JSON.stringify(errorMessage),
      //   status: 440,
      // });
    }
  };

  // Add Gate Pass Api End

  // Update Gate pass Api Start

  const [
    getGatePassOutwardById,
    // { isLoading: getGatePassByIdApiIsLoading }
  ] = useGetGatePassOutwardByIdMutation();

  const [getAllDO, { isLoading: getAllDOLoading }] = useGetAllDOMutation();

  const [getOutwardGatepassDo, { isLoading: getOutwardGatepassDoLoading }] =
    useGetOutwardGatepassDoMutation();

  const [getQualityParameter, { isLoading: getQualityParameterApiLoading }] =
    useGetQualityParameterMutation();

  const [updateGatePassMaster, { isLoading: updateGatePassLoading }] =
    usePutGatePassOutWardMutation();

  const updateData = async (data) => {
    try {
      const response = await updateGatePassMaster({
        ...data,
        id: details.id,
      }).unwrap();
      if (response.status === 200 || response.status === 201) {
        showToastByStatusCode(200, response.message);
        navigate(`${ROUTE_PATH.GATE_PASS_OUTWARD}`);
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

  const fetchStackNo = () => {
    try {
      // getOutwardGatepassDo
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOutwardGatepassDo = async () => {
    console.log(stackDetail?.select_do_no);
    let isEmpty = JSON.stringify(stackDetail?.select_do_no);
    console.log(isEmpty);
    if (stackDetail?.select_do_no) {
      try {
        console.log("dd", stackDetail);
        let query = {
          do: stackDetail?.select_do_no,
        };

        console.log(query);

        const response = await getOutwardGatepassDo(query).unwrap();
        console.log(response);
        let obj = {
          balance_bags_in_do: response?.balance_bags_in_do,
          balance_mt_in_do: response?.balance_mt_in_do,
        };

        setStack_wise_do_data(response?.stack_wise_do_data || []);
        console.log(response?.stack_wise_do_data);

        const weighbridge = response?.selected_weighbridge?.[0]?.map((el) => ({
          label: el,
          value: el,
        }));

        let stack =
          response?.stack_wise_do_data?.map((item) => ({
            label: item?.stack_no?.stack_number,
            value: item?.stack_no?.id,
            lot_no: item?.lot_no,
            // lot_no : item?.lot_no?.stack_lot_number
          })) || [];

        let array = stack?.filter(
          (el) =>
            getValues("select_stack_no")?.value ===
            el?.lot_no?.warehouse_chamber_stack_details
        );

        setSelectBoxOptions((prev) => ({
          ...prev,
          stack: stack,
          weighbridge: weighbridge,
          lot_no:
            array?.map((item) => ({
              label: item?.lot_no?.stack_lot_number,
              value: item?.lot_no?.id,
            })) || [],
        }));

        console.log(obj);

        Object.keys(obj).forEach(function (key) {
          setValue(key, obj[key], { shouldValidate: true });
        });
      } catch (error) {
        // CommonToasterAlert(error);
      }
    }
  };

  // Update Gate Pass Api End

  // const fetchGetPass = async () => {
  //   console.log("kdjfkd");
  //   let params = "";
  //   try {
  //     const response = await getCORGatePass(params).unwrap();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //Edit Form Fill Logic Start

  const [filledForm, setFilledForm] = useState(false);

  const autoFillForm = async () => {
    if (urlPrams?.id) {
      let form_details = {};
      try {
        const response = await getGatePassOutwardById(urlPrams?.id).unwrap();
        console.log("response  -->", response);
        if (response?.status === 200) {
          // alert();
          setGatePassDetails(response.data);

          form_details = response?.data;
          console.log("form_details", form_details);

          let obj = {
            id: form_details.id,
            gate_pass_type: "outward",
            gate_pass_no: form_details?.gate_pass_no,
            gate_pass_in_date_time: form_details?.gate_pass_in_date_time
              ? moment(form_details?.gate_pass_in_date_time).format(
                  "YYYY-MM-DDTHH:mm:ss"
                )
              : null,
            gate_pass_out_date_time: form_details?.gate_pass_out_date_time
              ? moment(form_details?.gate_pass_out_date_time).format(
                  "YYYY-MM-DDTHH:mm:ss"
                )
              : null,
            warehouse: {
              label: form_details?.warehouse?.warehouse_name,
              value: form_details?.warehouse?.id,
              weight_bridge_name: form_details?.weight_bridge_name,
            },
            chamber: {
              value: form_details?.chamber?.id,
              label: form_details?.chamber?.chamber_number,
            },
            client: {
              value: form_details?.client?.id,
              label: form_details?.client?.name_of_client,
            },
            commodity: {
              value: form_details?.commodity?.id,
              label: form_details?.commodity?.commodity_name,
            },
            commodity_variety: {
              value: form_details?.commodity_variety?.id,
              label: form_details?.commodity_variety?.commodity_variety,
            },
            // truck_image_path
            truck_number: form_details?.truck_number,
            // truck_image: form_details?.truck_image_path,
            // client_representative_name
            client_representative_name:
              form_details?.client_representative_name,
            truck_image_path: form_details?.truck_image_path,
            driver_name: form_details?.driver_name,
            driver_photo_path: form_details?.driver_photo_path?.length
              ? form_details?.driver_photo_path[0]
              : "",
            weight_bridge_name: {
              label: form_details?.weight_bridge_name,
              value: form_details?.weight_bridge_name,
            },
            upload_approval_email: form_details?.upload_approval_email,
            new_weight_bridge_name: form_details?.new_weight_bridge_name,
            weight_bridge_slip_no: form_details?.weight_bridge_slip_no,
            weight_bridge_slip_date_time:
              form_details?.weight_bridge_slip_date_time
                ? moment(form_details?.weight_bridge_slip_date_time).format(
                    "YYYY-MM-DDTHH:mm:ss"
                  )
                : null,
            // weight_bridge_slip_upload_path
            weight_bridge_slip_upload_path: form_details
              ?.weight_bridge_slip_upload_path?.length
              ? form_details?.weight_bridge_slip_upload_path[0]
              : "",
            gross_weight: form_details?.gross_weight,
            tare_weight: form_details?.tare_weight,
            net_weight: form_details?.net_weight,
            sampler_name: form_details?.remarks?.sampler_name,
            remarks: form_details?.remarks?.remarks,
            gate_pass_commodity_quality:
              form_details?.gate_pass_commodity_quality_details?.map(
                (detail) => ({
                  parameter_value: detail.parameter_value,
                  // Include other properties from the details as needed
                })
              ),
          };

          // alert("2");

          console.log(obj);
          console.log(form_details?.outward_gate_pass_do_details);

          const lot_details = form_details?.outward_gate_pass_do_details?.map(
            (el) => ({
              select_do_no: {
                label: el?.do?.delivery_order_number,
                value: el?.do?.id,
              }, // d
              do_expiry_date: el?.new_expiry_date, // d
              balance_bags_in_do: el?.balance_bags_do, // d
              balance_mt_in_do: el?.balance_mt_do, // d
              deposit_cir_bags: el?.deposite_bag_size,
              select_stack_no: {
                label: el?.stack_no?.stack_number,
                value: el?.stack_no?.id,
                // lot_no: item?.lot_no,
              }, // d
              select_lot_no: {
                label: el?.lot_no?.stack_lot_number,
                value: el?.lot_no?.id,
              }, // d
              total_bags_can_delivered: el?.deliverable_bag_from_lot, // auto field
              total_mt_can_delivered: el?.deliverable_mt_from_lot, // auto field
              current_do_bags: el?.current_bag_for_gatepass, // %% free field
              current_do_mt: el?.current_mt_for_gatepass, //  %%  free field
              remaining_bag_lot_as_do: el?.lot_remaining_bag, // calculate
              remaining_mt_lot_as_do: el?.lot_remaining_mt, // calculate
              remaining_for_do_bags: el?.do_remaining_bag, // calculate
              remaining_for_do_mt: el?.mt_remaining_bag, // calculate
            })
          );

          console.log(
            response.data.outward_gate_pass_commodity_quality_details
          );

          // {
          //   id: 217,
          //   parameter_value: 'rererererer',
          //   outward_gate_pass: 60,
          //   quality_parameter: 39,
          //   last_updated_user: 2
          // },

          let test_result_data =
            response.data.outward_gate_pass_commodity_quality_details?.map(
              (el) => ({
                quality_parameter_id: el.quality_parameter?.id,
                quality_parameter: el.quality_parameter?.quality_parameter,
                parameter_value: el?.parameter_value,
              })
            );
          console.log("test_result_data", test_result_data);

          append(test_result_data, {
            shouldFocus: false,
          });

          // append(uniqueArr, {
          //   shouldFocus: false,
          // });

          console.log("lot_details", lot_details);

          setLotDetails(lot_details);

          // stackDetail?.select_do_no

          // gate_pass_commodity_quality
          // gate_pass_stack_details
          // truck_image

          console.log("form_details obj ", obj);

          setQualityCommodity(form_details?.gate_pass_commodity_quality || []);

          // outward_gate_pass_commodity_quality_details

          console.log(form_details?.upload_approval_email);

          setFilledForm(true);
          if (form_details?.upload_approval_email?.length > 0) {
            setEmailCheck(true);
          }

          // setHandleSelectBoxVal

          console.log("object keys", selectBoxOptions);

          Object.keys(obj).forEach(function (key) {
            console.log("key", key, "value", obj[key]);
            methods.setValue(key, obj[key], { shouldValidate: true });

            // key === "gate_pass_stack_details" ||
            // if (key === "truck_image_path" || key === "truck_image_path") {
            //   console.log("");
            // } else {
            //   console.log("key", key, "value", obj[key]);
            //   methods.setValue(key, obj[key], { shouldValidate: true });
            // }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    // getWarehouseMasterList();
    // autoFillForm();

    // console.log("query params -> ", location?.search);

    // setTimeout(() => autoFillForm(), 10000);
    console.log("selectBoxOptions test  =====> ", selectBoxOptions);
    if (selectBoxOptions?.warehouse?.length > 0 && urlPrams?.id) {
      console.log("in side of if", selectBoxOptions?.warehouse);
      // setValue(
      //   "chamber",
      //   { id: 133, chamber_number: "oilt tank number 1" },
      //   { shouldValidate: true }
      // );
      autoFillForm();
    }

    console.log("my fomrm value --->", getValues());

    // set breadcrumbArray
    const breadcrumbArray = [
      //   {
      //     title: " Gate Pass",
      //     link: "/gate-pass/outward",
      //   },
      {
        title: "Gate Pass Outward Details",
        link: `${ROUTE_PATH.GATE_PASS_OUTWARD}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];

    if (formUrl === null) {
      dispatch(setSidebarVisibility(false));
      setIsReadOnly(true);
    } else {
      dispatch(setBreadCrumb(breadcrumbArray));
      dispatch(setSidebarVisibility(true));
      setIsReadOnly(false);
    }
    // eslint-disable-next-line
  }, [selectBoxOptions?.warehouse, urlPrams?.id]);

  //Edit Form Fill Logic End

  // Memoized getValues functions
  const getValuesClient = useCallback(() => getValues("client"), []);
  const getValuesVariety = useCallback(
    () => getValues("commodity_variety"),
    []
  );
  const getValuesChamber = useCallback(() => getValues("chamber"), []);

  const fetchAllDo_No = async (queryString) => {
    try {
      const response = await getAllDO(queryString).unwrap();
      console.log(response);
      if (response?.status === 200) {
        return response?.data;
      }
      return [];
    } catch (error) {
      CommonToasterAlert(error);
    }
  };

  const fetchWarehouse = async () => {
    // const client = selectBoxOptions?.client?.filter(
    //   (item) => item.value === getValuesClient()
    // )[0]?.label;
    // const variety = getValuesVariety();
    // const chamber = selectBoxOptions?.chamber?.filter(
    //   (item) => item.value === getValuesChamber()
    // )[0]?.label;

    // if (value.warehouse && value.chamber) {
    //   getClientMasterList();
    // }

    // if (value?.commodity && value?.chamber && value?.client) {
    //   getStackMasterList();
    // }

    // console.log(selectBoxOptions);

    const client = getValues("client")?.label; //value?.client?.label;
    const chamber = getValues("chamber")?.label; //  value?.chamber?.label;

    const variety = getValues("commodity_variety")?.label; // value?.commodity_variety?.label;

    // console.log("value", value);
    // console.log("name", name);

    console.log("client", client);
    console.log("variety", variety);
    console.log("chamber", chamber);
    let isValid = !client && !variety && !chamber;
    console.log(isValid);
    const obj = {
      client,
      variety,
      chamber,
    };
    console.log(obj);
    function hasUndefinedOrNullValues(obj) {
      for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
          return false;
        }
      }
      return true;
    }
    console.log(hasUndefinedOrNullValues(obj));
    if (hasUndefinedOrNullValues(obj)) {
      const filters = [
        { filter: "client", value: client },
        { filter: "commodity_variety", value: variety },
        { filter: "chamber__chamber_number", value: chamber },
      ];

      console.log("filters", filters);

      const queryString = await createQueryParams(filters);

      // console.log("test ----------------->", value, name, type);
      console.log("queryString", queryString);
      console.log(queryString);
      // alert();
      // Your logic here
      // const query = `filter=client&client=${client}&`;
      // getAllDO(queryString);

      // await fetchD0NoList(queryString);
      try {
        const result = await fetchAllDo_No(queryString);
        console.log("result", result);
        if (result?.length) {
          setSelectBoxOptions((prev) => ({
            ...prev,
            do_list:
              result?.map((item) => ({
                label: item?.delivery_order_number,
                do_expiry_date: item?.do_expiry_date,
                value: item?.id,
              })) || [],
          }));
          console.log("done", result);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchTestResultTableData = async () => {
    const commodity_id = getValues("commodity")?.value;
    console.log(commodity_id);
    if (commodity_id) {
      const response = await getQualityParameter(commodity_id).unwrap();
      try {
        const array = response?.data?.quality_parameter;

        console.log("$$$$$$", response?.data);

        setTestResults(array);

        console.log(array);

        const arr = array?.map((el) => ({
          quality_parameter_id: el.quality_parameter.id,
          quality_parameter: el.quality_parameter.quality_parameter,
          // parameter_value: el?.quality_parameter?.quality_parameter,
        }));
        console.log(arr);

        // setFocus("commodity_variety");
        const uniqueArr = arr.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.quality_parameter_id === item.quality_parameter_id &&
                t.quality_parameter === item.quality_parameter
            )
        );

        console.log(uniqueArr);
        if (!gatePassDetails?.id) {
          remove();
          append(uniqueArr, {
            shouldFocus: false,
          });
        }
        // setFocus("gate_pass_in_date_time", { shouldSelect: true });

        // window.scrollTo(0, 0);

        console.log("test array", array);
      } catch (error) {
        console.log(error);
      }

      console.log("test result table");
    }
  };

  // React.useEffect(() => {
  //   const subscription = watch((value, { name, type }) => {
  //     console.log("  =====================>  ", value, name, type);
  //     if (name === "current_do_bags") {
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  useMemo(() => {
    fetchWarehouse();
    // return () => subscription.unsubscribe();
    // getValuesClient, getValuesVariety, getValuesChamber , watch
  }, [
    getValues("client"),
    getValues("chamber"),
    getValues("commodity_variety"),
  ]);

  useMemo(() => {
    fetchTestResultTableData();
  }, [getValues("commodity")]);

  // useEffect(async () => {
  //   const client = selectBoxOptions?.client?.filter(
  //     (item) => item.value === getValues("client")
  //   )[0]?.label;

  //   const variety = getValues("commodity_variety");
  //   const chamber = selectBoxOptions?.chamber?.filter(
  //     (item) => item.value === getValues("chamber")
  //   )[0]?.label;

  //   // console.log("value", value);
  //   // console.log("name", name);

  //   console.log("client", client);
  //   console.log("variety", variety);
  //   console.log("chamber", chamber);

  //   const obj = {
  //     client,
  //     variety,
  //     chamber,
  //   };
  //   function hasUndefinedOrNullValues(obj) {
  //     for (const key in obj) {
  //       if (obj[key] === undefined || obj[key] === null) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   }
  //   console.log(hasUndefinedOrNullValues(obj));
  //   if (hasUndefinedOrNullValues(obj)) {
  //     const filters = [
  //       { filter: "client", value: client },
  //       // { filter: "commodity_variety", value: variety },
  //       { filter: "chamber__chamber_number", value: chamber },
  //     ];

  //     // const queryString = await createQueryParams(filters);

  //     const queryString =
  //       "filter=client&client=kunal%20sharma%20client%20of%20commodity&filter=chamber__chamber_number&chamber__chamber_number=oilt%20tank%20number%201";

  //     console.log("test ----------------->", value, name, type);
  //     console.log("queryString", queryString);
  //     console.log(queryString);
  //     // alert();
  //     // Your logic here
  //     // const query = `filter=client&client=${client}&`;
  //     // getAllDO(queryString);

  //     // await fetchD0NoList(queryString);
  //     try {
  //       const result = await fetchAllDo_No(queryString);
  //       console.log("result", result);
  //       if (result?.length) {
  //         setSelectBoxOptions((prev) => ({
  //           ...prev,
  //           do_list:
  //             result?.map((item) => ({
  //               label: item?.delivery_order_number,
  //               do_expiry_date: item?.do_expiry_date,
  //               value: item?.id,
  //             })) || [],
  //         }));
  //         console.log("done", result);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }, [getValues("commodity_variety")]);

  // Rest of your component...

  useEffect(() => {
    fetchOutwardGatepassDo();
  }, [stackDetail?.select_do_no]);

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
    // eslint-disable-next-line
  }, []);

  // Form Submit Function End

  // Draft Logic Start

  const DraftLogicFunction = async () => {
    //   try {
    //     const temp = qualityCommodity.map((item) => ({
    //       quality_parameter: item?.quality_parameter?.id || 0,
    //       parameter_value: item.parameter_value,
    //     }));

    //     const data = getValues();

    //     if (details?.id) {
    //       const response = await updateGatePassMaster({
    //         ...data,
    //         id: details?.id,
    //         is_draft: true,
    //         // gate_pass_commodity_quality: temp,
    //         warehouse: data.warehouse.value,
    //         chamber: data.chamber.value,
    //         client: data.client.value,
    //         client_representative_name: data.client_representative_name,
    //         commodity: data.commodity.value,
    //         driver_photo_path: [data.driver_photo_path],
    //         commodity_variety: data.commodity_variety.value,
    //         weight_bridge_slip_upload_path: [data.weight_bridge_slip_upload_path],

    //         weight_bridge_slip_date_time: data?.weight_bridge_slip_date_time,
    //         outward_gate_pass_do_details: lotDetails?.map((el) => ({
    //           do: el.select_do_no.value,
    //           stack_no: el.select_stack_no.value,
    //           lot_no: el.select_lot_no.value,
    //           current_bag_for_gatepass: el.current_do_bags || null,
    //           current_mt_for_gatepass: el.current_do_mt || null,
    //         })),

    //         outward_gate_pass_commodity_quality_details:
    //           data?.outward_gate_pass_commodity_quality_details?.map((el) => ({
    //             parameter_value: el?.parameter_value,
    //             quality_parameter: el.quality_parameter.id,
    //           })),
    //       }).unwrap();
    //       if (response.status === 200) {
    //         toasterAlert({
    //           message: "GatePass Drafted Successfully.",
    //           status: 200,
    //         });
    //       }
    //     } else {
    //       const response = await postGatePassOutward({
    //         ...data,
    //         is_draft: true,
    //         warehouse: data.warehouse.value,
    //         chamber: data.chamber.value,
    //         client: data.client.value,
    //         client_representative_name: data.client_representative_name,
    //         commodity: data.commodity.value,
    //         commodity_variety: data.commodity_variety.value,
    //         weight_bridge_slip_date_time: data?.weight_bridge_slip_date_time,
    //         outward_gate_pass_do_details: lotDetails?.map((el) => ({
    //           do: el.select_do_no.value,
    //           stack_no: el.select_stack_no.value,
    //           lot_no: el.select_lot_no.value,
    //           current_bag_for_gatepass: el.current_do_bags,
    //           current_mt_for_gatepass: el.current_do_mt,
    //         })),

    //         outward_gate_pass_commodity_quality_details:
    //           data?.outward_gate_pass_commodity_quality_details?.map((el) => ({
    //             parameter_value: el?.parameter_value,
    //             quality_parameter: el.quality_parameter.id,
    //           })),
    //       }).unwrap();
    //       if (response.status === 201) {
    //         toasterAlert({
    //           message: "GatePass Drafted Successfully.",
    //           status: 200,
    //         });
    //       }
    //     }
    //   } catch (error) {
    //     let errorMessage =
    //       error?.data?.data ||
    //       error?.data?.message ||
    //       error?.data ||
    //       "GatePass Draft Request Failed.";
    //     console.log("Error:", errorMessage);
    //     toasterAlert({
    //       message: JSON.stringify(errorMessage),
    //       status: 440,
    //     });
    //   }
    // };
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
      console.log("qualityCommodity", qualityCommodity);
      console.log(getValues("outward_gate_pass_commodity_quality_details"));

      const temp =
        getValues("outward_gate_pass_commodity_quality_details")?.map(
          (item) => ({
            // quality_parameter: item?.quality_parameter,
            quality_parameter: item?.quality_parameter_id,
            parameter_value: item.parameter_value,
          })
        ) || [];

      console.log(temp);

      // const tt = getValues("outward_gate_pass_commodity_quality_details")?.map(
      //   (item) => ({
      //     quality_parameter: item?.quality_parameter?.id || 0,
      //     parameter_value: item.parameter_value,

      //     {
      //       "parameter_value": 12.0,
      //       "quality_parameter": 13
      //   },
      //   })
      // );

      // {
      //   quality_parameter_id: 40,
      //   quality_parameter: 'Fungus',
      //   parameter_value: 'f 123'
      // },

      //console.log(tt);

      let data = getValues();
      console.log({ ...data });
      data = {
        ...data,
        chamber: data.chamber.value,
        client: data.client.value,
        commodity: data.commodity.value,
        commodity_variety: data.commodity_variety.value,
        warehouse: data.warehouse.value,
        outward_gate_pass_commodity_quality_details: data?.quality_parameter_id,
      };
      console.log(data);
      const gatePassDateTimeIn = data.gate_pass_in_date_time
        ? data.gate_pass_in_date_time
        : null;
      const gatePassDateTimeOut = data.gate_pass_out_date_time
        ? data.gate_pass_out_date_time
        : null;
      const weighbridgeSlipDateTime = data.weight_bridge_slip_date_time
        ? data.weight_bridge_slip_date_time
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

      // gate_pass_commodity_quality
      let outward_gate_pass_do_details = lotDetails?.map((el) => ({
        do: el.select_do_no.value,
        stack_no: el.select_stack_no.value,
        lot_no: el.select_lot_no.value,
        current_bag_for_gatepass: el.current_do_bags || null,
        current_mt_for_gatepass: el.current_do_mt || null,

        balance_bags_do: el?.balance_bags_in_do,
        balance_mt_do: el?.balance_mt_in_do,
        deposite_bag_size: el?.deposit_cir_bags,
        deliverable_bag_from_lot: el?.total_bags_can_delivered,
        deliverable_mt_from_lot: el?.total_mt_can_delivered,
        lot_remaining_bag: el?.remaining_bag_lot_as_do,
        lot_remaining_mt: el?.remaining_mt_lot_as_do,
        do_remaining_bag: el?.remaining_for_do_bags,
        mt_remaining_bag: el?.remaining_for_do_mt,
      }));
      if (getValues("id")) {
        console.log(outward_gate_pass_do_details);

        const response = await updateGatePassMaster({
          ...data,
          id: getValues("id"),
          is_draft: true,
          weight_bridge_name: data?.weight_bridge_name?.value,
          driver_photo_path: [data.driver_photo_path],
          weight_bridge_slip_upload_path: [data.weight_bridge_slip_upload_path],
          outward_gate_pass_commodity_quality_details: temp,
          gate_pass_date_time_in: gatePassDateTimeIn, // Use the modified value here
          gate_pass_date_time_out: gatePassDateTimeOut,
          weighbridge_slip_datetime: weighbridgeSlipDateTime,
          outward_gate_pass_do_details: outward_gate_pass_do_details,
          current_used_stack: used_stack || [],
        }).unwrap();
        if (response.status === 200) {
          navigate(`${ROUTE_PATH.GATE_PASS_OUTWARD}`);
          showToastByStatusCode(200, "GatePass Drafted Successfully");

          // toasterAlert({
          //   message: "GatePass Drafted Successfully.",
          //   status: 200,

          // });
          methods.setValue("id", response.data.id, { shouldValidate: true });
        }
      } else {
        console.log("data first time darft ---------> ", data);

        const response = await postGatePassOutward({
          ...data,
          is_draft: true,
          outward_gate_pass_commodity_quality_details: temp,
          gate_pass_date_time_in: gatePassDateTimeIn, // Use the modified value here
          gate_pass_date_time_out: gatePassDateTimeOut,
          weighbridge_slip_datetime: weighbridgeSlipDateTime,
          weight_bridge_name: data?.weight_bridge_name?.value,
          driver_photo_path: [data.driver_photo_path],
          weight_bridge_slip_upload_path: [data.weight_bridge_slip_upload_path],
          outward_gate_pass_do_details: outward_gate_pass_do_details,
          // current_used_stack: used_stack || [],
        }).unwrap();
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          showToastByStatusCode(201, "GatePass Drafted Successfully");
          console.log(response, "response");
          navigate(`${ROUTE_PATH.GATE_PASS_OUTWARD}`);

          methods.setValue("id", response.data.id, { shouldValidate: true });
        }
      }
    } catch (error) {
      console.log(error);
      toasterAlert(error);
    }
  };

  const lotNoOnChange = (val) => {
    // Example usage
    // select_lot_no
    const selected_lot =
      stack_wise_do_data?.filter((el) => el.lot_no?.id === val?.value)[0] || [];
    console.log(selected_lot);
    const calculatedValues = calculateLotValues(selected_lot);
    delete calculatedValues?.current_do_bags;
    delete calculatedValues?.current_do_mt;

    console.log(calculatedValues);

    Object.keys(calculatedValues).forEach((key) => {
      setValue(key, calculatedValues[key], {
        shouldValidate: true,
      });
    });
    setValue("select_lot_no", val, {
      shouldValidate: true,
    });

    setStackDetail((old) => ({
      ...old,
      select_lot_no: val?.value,
    }));

    console.log(selected_lot);
  };

  function calculateLotValues(selectedLot) {
    const totalRemainingBagLotAsDo =
      selectedLot?.total_delivered_commodity_from_lot
        ?.total_bags_can_delivered - selectedLot?.do_number?.current_do_bags;

    const totalRemainingMtLotAsDo =
      Number(getValues("total_mt_can_delivered")) -
      Number(getValues("current_do_mt"));

    const totalRemainingBagInDo =
      Number(getValues("balance_bags_in_do")) -
      selectedLot?.do_number?.current_do_bags;

    const totalRemainingMtInDo =
      Number(getValues("balance_mt_in_do")) -
      Number(getValues("current_do_mt"));

    return {
      deposit_cir_bags: selectedLot?.deposit_cir_bags,
      total_bags_can_delivered:
        selectedLot?.total_delivered_commodity_from_lot
          ?.total_bags_can_delivered,
      total_mt_can_delivered:
        selectedLot?.total_delivered_commodity_from_lot?.total_mt_can_delivered,
      current_do_bags: selectedLot?.do_number?.current_do_bags,
      current_do_mt: selectedLot?.do_number?.current_do_mt,
      remaining_bag_lot_as_do: 0,
      remaining_mt_lot_as_do: 0,
      remaining_for_do_bags: 0,
      remaining_for_do_mt: 0,
      // remaining_bag_lot_as_do: totalRemainingBagLotAsDo,
      // remaining_mt_lot_as_do: totalRemainingMtLotAsDo,
      // remaining_for_do_bags: totalRemainingBagInDo,
      // remaining_for_do_mt: totalRemainingMtInDo.toFixed(2),
    };

    // let schema = {
    //   select_do_no : {label : '', value : ""},
    //   do_expiry_date : "",
    //   balance_bags_in_do : "",
    //   balance_mt_in_do : ""

    //   deposit_cir_bags: selectedLot?.deposit_cir_bags,
    //   select_stack_no : {label : '', value : ""},
    //   select_lot_no : {label : '', value : ""},

    //   total_bags_can_delivered:
    //     selectedLot?.total_delivered_commodity_from_lot
    //       ?.total_bags_can_delivered,
    //   total_mt_can_delivered:
    //     selectedLot?.total_delivered_commodity_from_lot?.total_mt_can_delivered,
    //   current_do_bags: selectedLot?.do_number?.current_do_bags,
    //   current_do_mt: selectedLot?.do_number?.current_do_mt,
    //   remaining_bag_lot_as_do: 12,
    //   remaining_mt_lot_as_do: 34,
    //   remaining_for_do_bags: 44,
    //   remaining_for_do_mt: 44,
    // };
  }

  const openReadOnlyFullscreenTab = () => {
    const doId = stackDetail?.select_do_no; // Assuming do_id is part of select_do_no

    if (doId) {
      const newTab = window.open(
        `${ROUTE_PATH.DELIVERY_ORDER_EDIT}/${doId}?readonly=true`,
        "_blank"
      );

      if (newTab) {
        // Function to enter fullscreen mode
        const enterFullScreen = (element) => {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        };

        // Enter fullscreen mode in the new tab
        enterFullScreen(newTab);
      }
    }
  };

  useEffect(() => {
    // console.log(selectBoxOptions);
    // let arr = selectBoxOptions?.stack?.filter(
    //   (el) => val?.value === el?.lot_no?.warehouse_chamber_stack_details
    // );
    // setSelectBoxOptions((prev) => ({
    //   ...prev,
    //   lot_no:
    //     arr?.map((item) => ({
    //       label: item?.lot_no?.stack_lot_number,
    //       value: item?.lot_no?.id,
    //     })) || [],
    // }));
    // console.log(arr);
  }, [getValues("select_stack_no")]);

  return (
    <>
      <Box bg="white" borderRadius={10} maxHeight="calc(100vh - 250px)">
        <Box bg="white" borderRadius={10} p="10">
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormProvider {...methods}>
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
                      <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type={"datetime-local"}
                      name="gate_pass_in_date_time"
                      placeholder={"Enter date & time"}
                      inputValue={getValues("gate_pass_in_date_time")}
                      InputDisabled={InputDisableFunction()}
                      onChange={(e) => {
                        setValue("gate_pass_in_date_time", e.target.value, {
                          shouldValidate: true,
                        });
                        setValue("gate_pass_out_date_time", "", {
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
                      <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type={"datetime-local"}
                      name="gate_pass_out_date_time"
                      placeholder={"Enter date & time"}
                      min={moment(getValues("gate_pass_in_date_time")).format(
                        "YYYY-MM-DDTHH:mm"
                      )}
                      inputValue={getValues("gate_pass_out_date_time") || ""}
                      InputDisabled={InputDisableFunction()}
                      onChange={(e) => {
                        console.log(e, "gate_pass_out_date_time");
                        setValue("gate_pass_out_date_time", e.target.value, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* Warehouse Name */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Warehouse Name <span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      name="warehouse"
                      options={selectBoxOptions?.warehouse || []}
                      selectedValue={
                        selectBoxOptions?.warehouse?.filter(
                          (item) => item.value === getValues("warehouse")?.value
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      isLoading={getWarehouseMasterApiIsLoading}
                      handleOnChange={(val) => {
                        setValue("warehouse", val, {
                          shouldValidate: true,
                        });

                        setSelectBoxOptions((prev) => ({
                          ...prev,
                          do_list: [],
                        }));

                        setValue(
                          "weight_bridge_name",
                          val.weight_bridge_name || "",
                          {
                            shouldValidate: !!val.weight_bridge_name, // Set shouldValidate to false when the value is an empty string
                          }
                        );

                        setValue("chamber", null, {
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
                        setValue("lotDetails", null, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* Chamber No */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Chamber No <span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      name="chamber"
                      options={
                        selectBoxOptions?.chamber?.filter(
                          (item) =>
                            item.warehouse === getValues("warehouse")?.value
                        ) || []
                      }
                      selectedValue={
                        selectBoxOptions?.chamber?.filter(
                          (item) => item.value === getValues("chamber")?.value
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      isLoading={getChamberApiIsLoading}
                      handleOnChange={(val) => {
                        setValue("commodity_variety", "", {
                          shouldValidate: false,
                        });
                        setSelectBoxOptions((prev) => ({
                          ...prev,
                          do_list: [],
                        }));
                        setValue("client", null, {
                          shouldValidate: true,
                        });
                        setValue("chamber", val, {
                          shouldValidate: true,
                        });
                        setValue("commodity_variety", null, {
                          shouldValidate: true,
                        });
                        setValue("commodity", null, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* client name */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Client name <span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      name="client"
                      options={selectBoxOptions?.client || []}
                      selectedValue={
                        selectBoxOptions?.client?.filter(
                          (item) => item.value === getValues("client")?.value
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      isLoading={getClientMasterApiIsLoading}
                      handleOnChange={(val) => {
                        setValue("client", val, {
                          shouldValidate: true,
                        });
                        setSelectBoxOptions((prev) => ({
                          ...prev,
                          do_list: [],
                        }));
                        setValue("commodity_variety", null, {
                          shouldValidate: true,
                        });
                        setValue("commodity", null, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* Commodity Name */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Commodity name <span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      name="commodity"
                      options={selectBoxOptions?.community || []}
                      selectedValue={
                        selectBoxOptions?.community?.filter(
                          (item) => item.value === getValues("commodity")?.value
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      isLoading={getCommodityMasterApiIsLoading}
                      handleOnChange={(val) => {
                        console.log(val);
                        setValue("commodity", val, {
                          shouldValidate: true,
                        });
                        setSelectBoxOptions((prev) => ({
                          ...prev,
                          do_list: [],
                        }));
                        setValue("commodity_variety", null, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* Commodity Variety */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Commodity Variety <span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      name="commodity_variety"
                      options={
                        selectBoxOptions?.communityVariety?.filter(
                          (item) =>
                            item.commodity_id === getValues("commodity")?.value
                        ) || []
                      }
                      selectedValue={
                        selectBoxOptions?.communityVariety?.filter(
                          (item) =>
                            item.value === getValues("commodity_variety")?.value
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      isLoading={getCommodityVarityApiIsLoading}
                      handleOnChange={(val) => {
                        setValue("commodity_variety", val, {
                          shouldValidate: true,
                        });

                        setSelectBoxOptions((prev) => ({
                          ...prev,
                          do_list: [],
                        }));
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

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="full"
                      gap="4"
                    >
                      <Box width="full">
                        <ReactSelect
                          value={
                            selectBoxOptions?.do_list?.filter(
                              (item) => item.value === stackDetail?.select_do_no
                            )[0] || {}
                          }
                          name="select_do_no"
                          isLoading={getStackMasterApiIsLoading}
                          isDisabled={InputDisableFunction()}
                          onChange={(val) => {
                            console.log(val, "dfdf");
                            setValue("do_expiry_date", val?.do_expiry_date, {
                              shouldValidate: true,
                            });
                            setValue("select_do_no", val, {
                              shouldValidate: true,
                            });
                            setStackDetail((old) => ({
                              ...old,
                              select_do_no: val?.value,
                            }));
                            fetchOutwardGatepassDo({ do_id: val?.value });
                          }}
                          options={selectBoxOptions?.do_list || []}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#fff",
                              borderRadius: "6px",
                              borderColor: formState?.errors?.select_do_no
                                ? "red"
                                : "gray.10",

                              padding: "1px",
                              textAlign: "left",
                            }),
                            ...reactSelectStyle,
                          }}
                        />
                      </Box>
                      <Box>
                        <Button
                          colorScheme="gray.50"
                          variant="outline"
                          isDisabled={!stackDetail?.select_do_no}
                          onClick={openReadOnlyFullscreenTab}
                        >
                          <FaEye />
                        </Button>
                      </Box>
                    </Box>

                    <Text color="red" fontSize="14px" textAlign="left">
                      {stackError.select_stack_no === "Error"
                        ? ""
                        : stackError.select_stack_no}
                    </Text>
                  </FormControl>

                  {/* DO Expiry Date  */}
                  <FormControl isInvalid={formState?.errors?.do_expiry_date}>
                    <Text
                      fontSize={FONT_SIZE_CONFIG_OBJ}
                      fontWeight="bold"
                      textAlign="left"
                    >
                      DO Expiry Date{" "}
                    </Text>

                    <Input
                      // placeholder="No. Of Bags"
                      readOnly
                      type="date"
                      name="do_expiry_date"
                      isDisabled={true}
                      value={getValues("do_expiry_date")}
                      onChange={(e) =>
                        setValue("do_expiry_date", e.target.value)
                      }
                      // value={stackDetail?.no_of_bags || ""}
                      // onChange={(e) => {
                      //   setStackDetail((old) => ({
                      //     ...old,
                      //     no_of_bags: e.target.value,
                      //   }));
                      // }}
                      style={inputStyle}
                      border="1px"
                      borderColor={stackError.no_of_bags ? "red" : "gray.10"}
                    />
                    <Text color="red" fontSize="14px" textAlign="left">
                      {stackError.no_of_bags === "Error"
                        ? ""
                        : formState?.errors?.do_expiry_date?.message ||
                          stackError.no_of_bags}
                    </Text>
                  </FormControl>

                  {/* Balance Bags In DO  */}
                  <FormControl
                    isInvalid={formState?.errors?.balance_bags_in_do}
                  >
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
                      isDisabled={true}
                      name="balance_bags_in_do"
                      {...register("balance_bags_in_do")}
                      //value={stackDetail?.no_of_bags || ""}
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

                  {/* Balance MT In DO  */}
                  <FormControl isInvalid={formState?.errors?.balance_mt_in_do}>
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
                      isDisabled={true}
                      name="balance_mt_in_do"
                      {...register("balance_mt_in_do")}
                      //  value={stackDetail?.no_of_bags || ""}
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

                  {/* Select Stack  Number  */}
                  <FormControl isInvalid={formState?.errors?.deposit_cir_bags}>
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
                          (item) => item.value === stackDetail?.select_stack_no
                        )[0] || {}
                      }
                      name="select_stack_no"
                      isDisabled={InputDisableFunction()}
                      isLoading={getStackMasterApiIsLoading}
                      onChange={(val) => {
                        console.log(val);
                        setValue("select_stack_no", val, {
                          shouldValidate: true,
                        });

                        console.log(selectBoxOptions);
                        let arr = selectBoxOptions?.stack?.filter(
                          (el) =>
                            val?.value ===
                            el?.lot_no?.warehouse_chamber_stack_details
                        );

                        setSelectBoxOptions((prev) => ({
                          ...prev,
                          lot_no:
                            arr?.map((item) => ({
                              label: item?.lot_no?.stack_lot_number,
                              value: item?.lot_no?.id,
                            })) || [],
                        }));
                        console.log(arr);

                        setStackDetail((old) => ({
                          ...old,
                          select_stack_no: val?.value,
                        }));
                      }}
                      options={selectBoxOptions?.stack || []}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: formState?.errors?.deposit_cir_bags
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
                        selectBoxOptions?.lot_no?.filter(
                          (item) => item.value === stackDetail?.select_lot_no
                        )[0] || {}
                      }
                      name="select_lot_no"
                      isLoading={getStackMasterApiIsLoading}
                      isDisabled={InputDisableFunction()}
                      onChange={(val) => {
                        lotNoOnChange(val);
                      }}
                      options={selectBoxOptions?.lot_no || []}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: formState?.errors?.select_lot_no
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
                  <FormControl isInvalid={formState?.errors?.deposit_cir_bags}>
                    <Text
                      fontSize={FONT_SIZE_CONFIG_OBJ}
                      fontWeight="bold"
                      textAlign="left"
                    >
                      Deposite Bag Size(KG){" "}
                    </Text>

                    <Input
                      placeholder="AutoFilled"
                      type="number"
                      {...register("deposit_cir_bags")}
                      isDisabled={true}
                      // value={stackDetail?.no_of_bags || ""}
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

                  {/* total bags can be delivered from lot  */}
                  <FormControl
                    isInvalid={formState?.errors?.total_bags_can_delivered}
                  >
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
                      {...register("total_bags_can_delivered")}
                      isDisabled={true}
                      // value={stackDetail?.no_of_bags || ""}
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

                  {/* total MT can be delivered from lot  */}
                  <FormControl
                    isInvalid={formState?.errors?.total_mt_can_delivered}
                  >
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
                      {...register("total_mt_can_delivered")}
                      isDisabled={true}
                      // value={stackDetail?.no_of_bags || ""}
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

                  {/* currently delivering bags from lot  */}
                  <FormControl isInvalid={formState?.errors?.current_do_bags}>
                    <Text
                      fontSize={FONT_SIZE_CONFIG_OBJ}
                      fontWeight="bold"
                      textAlign="left"
                    >
                      Currently Delivering Bags From Lot{" "}
                    </Text>

                    <Input
                      placeholder="Currently Delivering Bags From Lot"
                      type="number"
                      isDisabled={InputDisableFunction()}
                      {...register("current_do_bags")}
                      // isDisabled={isReadOnly}
                      ///value={stackDetail?.no_of_bags || ""}
                      onChange={(e) => {
                        let val = Number(e.target.value);

                        let total_bags_can_delivered = Number(
                          getValues("total_bags_can_delivered")
                        );

                        let remaining_for_do_bags =
                          Number(getValues("balance_bags_in_do")) - val;
                        // balance_bags_in_do
                        // current_do_bags
                        // remaining_for_do_bags

                        let Remaining_Bag_In_Lot_As_Per_DO =
                          total_bags_can_delivered - val;
                        console.log(Remaining_Bag_In_Lot_As_Per_DO);

                        if (val <= total_bags_can_delivered) {
                          setStackDetail((old) => ({
                            ...old,
                            no_of_bags: val,
                          }));

                          setValue(
                            "remaining_bag_lot_as_do",
                            val ? Remaining_Bag_In_Lot_As_Per_DO : 0,
                            {
                              shouldValidate: true,
                            }
                          );

                          setValue(
                            "remaining_for_do_bags",
                            val ? remaining_for_do_bags : 0,
                            {
                              shouldValidate: true,
                            }
                          );

                          setStackError((prev) => ({
                            ...prev,
                            current_do_bags: "",
                          }));
                        } else {
                          setValue("current_do_bags", null, {
                            shouldValidate: true,
                          });

                          setValue("remaining_bag_lot_as_do", null, {
                            shouldValidate: true,
                          });

                          setStackDetail((old) => ({
                            ...old,
                            no_of_bags: "",
                          }));

                          setStackError((prev) => ({
                            ...prev,
                            current_do_bags:
                              "Should always be less than or equal to the total number of bags that can be delivered from the lot.",
                          }));
                        }
                      }}
                      style={inputStyle}
                      border="1px"
                      borderColor={
                        stackError.current_do_bags ? "red" : "gray.10"
                      }
                    />
                    {}
                    <Text color="red" fontSize="14px" textAlign="left">
                      {stackError.current_do_bags === "Error"
                        ? ""
                        : stackError.current_do_bags?.message}
                    </Text>
                  </FormControl>

                  {/* row 3 ......................... */}

                  {/* currently delivering MT from lot  */}
                  <FormControl isInvalid={formState?.errors?.current_do_mt}>
                    <Text
                      fontSize={FONT_SIZE_CONFIG_OBJ}
                      fontWeight="bold"
                      textAlign="left"
                    >
                      currently delivering MT from lot{" "}
                    </Text>

                    <Input
                      placeholder="currently delivering MT from lot"
                      type="number"
                      {...register("current_do_mt")}
                      isDisabled={InputDisableFunction()}
                      //  isDisabled={isReadOnly}
                      //  value={stackDetail?.no_of_bags || ""}
                      onChange={(e) => {
                        // setStackDetail((old) => ({
                        //   ...old,
                        //   no_of_bags: e.target.value,
                        // }));

                        let val = Number(e.target.value);
                        let total_mt_can_delivered = Number(
                          getValues("total_mt_can_delivered")
                        );

                        let remaining_for_do_mt =
                          Number(getValues("balance_mt_in_do")) - val;

                        let Remaining_MT_In_Lot_As_Per_DO =
                          total_mt_can_delivered - val;
                        console.log(Remaining_MT_In_Lot_As_Per_DO);

                        // let remaining_for_do_mt =
                        // Number(getValues("balance_bags_in_do")) - val;

                        if (val <= total_mt_can_delivered) {
                          setStackDetail((old) => ({
                            ...old,
                            total_mt_can_delivered: val,
                          }));

                          setValue(
                            "remaining_mt_lot_as_do",
                            val ? Remaining_MT_In_Lot_As_Per_DO : 0,
                            {
                              shouldValidate: true,
                            }
                          );

                          setValue(
                            "remaining_for_do_mt",
                            val ? remaining_for_do_mt : 0,
                            {
                              shouldValidate: true,
                            }
                          );

                          setStackError((prev) => ({
                            ...prev,
                            current_do_mt: "",
                          }));
                        } else {
                          setValue("current_do_mt", null, {
                            shouldValidate: true,
                          });

                          setValue("remaining_mt_lot_as_do", null, {
                            shouldValidate: true,
                          });

                          setStackDetail((old) => ({
                            ...old,
                            total_mt_can_delivered: "",
                          }));

                          setStackError((prev) => ({
                            ...prev,
                            current_do_mt:
                              "Should always be less than or equal to the total number of bags that can be delivered from the lot.",
                          }));
                        }
                      }}
                      style={inputStyle}
                      border="1px"
                      borderColor={stackError.current_do_mt ? "red" : "gray.10"}
                    />
                    <Text color="red" fontSize="14px" textAlign="left">
                      {stackError.current_do_mt === "Error"
                        ? ""
                        : stackError.current_do_mt}
                    </Text>
                  </FormControl>

                  {/* Remaining bag in lot as per DO  */}
                  <FormControl
                    isInvalid={formState?.errors?.remaining_bag_lot_as_do}
                  >
                    <Text
                      fontSize={FONT_SIZE_CONFIG_OBJ}
                      fontWeight="bold"
                      textAlign="left"
                    >
                      Remaining bag in lot as per DO
                    </Text>

                    <Input
                      placeholder="Auto Filled"
                      type="number"
                      //isDisabled={InputDisableFunction()}
                      {...register("remaining_bag_lot_as_do")}
                      isDisabled={true}
                      // value={stackDetail?.no_of_bags || ""}
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

                  {/* Remaining MT in lot As per DO  */}
                  <FormControl
                    isInvalid={formState?.errors?.remaining_mt_lot_as_do}
                  >
                    <Text
                      fontSize={FONT_SIZE_CONFIG_OBJ}
                      fontWeight="bold"
                      textAlign="left"
                    >
                      Remaining MT in lot As per DO
                    </Text>

                    <Input
                      placeholder="Auto Filled"
                      type="number"
                      {...register("remaining_mt_lot_as_do")}
                      isDisabled={true}
                      // value={
                      //   Number(getValues("total_mt_can_delivered")) -
                      //   Number(getValues("current_do_mt"))
                      // }
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

                  {/* Remaining Bag in DO  */}
                  <FormControl
                    isInvalid={formState?.errors?.remaining_for_do_bags}
                  >
                    <Text
                      fontSize={FONT_SIZE_CONFIG_OBJ}
                      fontWeight="bold"
                      textAlign="left"
                    >
                      Remaining Bag in DO
                    </Text>

                    <Input
                      placeholder="Auto filled"
                      type="number"
                      {...register("remaining_for_do_bags")}
                      isDisabled={true}
                      //  value={stackDetail?.no_of_bags || ""}
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

                  {/* Remaining MT in DO  */}
                  <FormControl
                    isInvalid={formState?.errors?.remaining_for_do_mt}
                  >
                    <Text
                      fontSize={FONT_SIZE_CONFIG_OBJ}
                      fontWeight="bold"
                      textAlign="left"
                    >
                      Remaining MT in DO
                    </Text>

                    <Input
                      placeholder="Auto filled"
                      type="number"
                      {...register("remaining_for_do_mt")}
                      isDisabled={true}
                      // value={stackDetail?.no_of_bags || ""}
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
                    onClick={() => AddUpdateLotDetails()}
                    // updateStackDetails
                  >
                    {isLotDetailsEditState?.isEdit ? "Update" : "Add"}
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
                      <Th color="#000">Total Bags Can Be Delivered From Lot</Th>
                      <Th color="#000">Total MT Can Be Delivered From Lot</Th>
                      <Th color="#000">Currently Delivering Bags From Lot</Th>
                      <Th color="#000">Currently Delivering MT From Lot</Th>
                      <Th color="#000">Remaining Bag In Lot As Per DO</Th>
                      <Th color="#000">Remaining MT In Lot As Per DO</Th>
                      <Th color="#000">Remaining Bag In DO</Th>
                      <Th color="#000">Remaining MT In DO</Th>
                      <Th color="#000">Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {lotDetails?.length > 0 ? (
                      lotDetails?.map((item, index) => (
                        <Tr
                          key={`lotDetails_${index}`}
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                        >
                          <Td>{index + 1}</Td>
                          <Td>{item?.select_do_no?.label || "-"}</Td>
                          <Td>{item?.do_expiry_date || "-"}</Td>
                          <Td>{item?.balance_bags_in_do || "-"}</Td>
                          <Td>{item?.balance_mt_in_do || "-"}</Td>
                          <Td>{item?.select_stack_no?.label || "-"}</Td>
                          <Td>{item?.select_lot_no?.label || "-"}</Td>
                          <Td>{item?.deposit_cir_bags || "-"}</Td>
                          <Td>{item?.total_bags_can_delivered || "-"}</Td>
                          <Td>{item?.total_mt_can_delivered || "-"}</Td>
                          <Td>{item?.current_do_bags || "-"}</Td>
                          <Td>{item?.current_do_mt || "-"}</Td>

                          <Td>{item?.remaining_bag_lot_as_do || "-"}</Td>
                          <Td>{item?.remaining_mt_lot_as_do || "-"}</Td>
                          <Td>{item?.remaining_for_do_bags || "-"}</Td>
                          <Td>{item?.remaining_for_do_mt || "-"}</Td>

                          <Td>
                            <Box display="flex" alignItems="center" gap="3">
                              <Flex gap="20px" justifyContent="center">
                                <Button
                                  bg={""}
                                  isDisabled={InputDisableFunction()}
                                  color={"primary.700"}
                                >
                                  <BiEditAlt
                                    fontSize="26px"
                                    cursor="pointer"
                                    onClick={() => {
                                      updateStackData(item, index);
                                    }}
                                  />
                                </Button>
                                <Button
                                  bg={""}
                                  isDisabled={InputDisableFunction()}
                                  color="red"
                                >
                                  <AiOutlineDelete
                                    cursor="pointer"
                                    fontSize="26px"
                                    onClick={() => deleteLotDetails(index)}
                                  />
                                </Button>
                              </Flex>
                            </Box>
                          </Td>
                        </Tr>
                      ))
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
                        Total Currently delivering bags from DO
                      </Th>
                      <Th color="#000">
                        Total Currently delivering MT from DO
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {doDetailsSubTable?.length > 0 &&
                      doDetailsSubTable?.map((el, index) => (
                        <Tr
                          textAlign="center"
                          bg="white"
                          border="1px"
                          color="#000"
                          borderColor="#000"
                        >
                          <Th>{index + 1}</Th>
                          <Th>{el?.select_do_no?.label}</Th>
                          <Th>{el?.current_do_bags}</Th>
                          <Th>{el?.current_do_mt}</Th>
                        </Tr>
                      ))}

                    {doDetailsSubTable.length === 0 && (
                      <Tr
                        textAlign="center"
                        bg="white"
                        border="1px"
                        color="#000"
                        borderColor="#000"
                      >
                        <Th>Record not found</Th>
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
                      Total No Of Bags To Be Delivered{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type={"text"}
                      name="total_bags"
                      // placeholder={"Freefield"}
                      // InputDisabled={
                      //   getValues("upload_approval_email")?.length > 0 &&
                      //   !isReadOnly
                      //     ? false
                      //     : true
                      // }
                      InputDisabled={true}
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
                    <Text textAlign="right">
                      Total MT to be delivered{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type={"text"}
                      name="total_mt"
                      placeholder={"Freefield"}
                      // InputDisabled={
                      //   getValues("upload_approval_email")?.length > 0 &&
                      //   !isReadOnly
                      //     ? false
                      //     : true
                      // }
                      InputDisabled={true}
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
                      Client Representative Name{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type={"text"}
                      name="client_representative_name"
                      placeholder={"Free field"}
                      InputDisabled={InputDisableFunction()}
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
                    <Text textAlign="right">
                      Truck No. <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type={"text"}
                      name="truck_number"
                      placeholder={"Enter truck no"}
                      InputDisabled={InputDisableFunction()}
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
                    <Text textAlign="right">
                      Truck image <span style={{ color: "red" }}>*</span>
                    </Text>

                    <Box>
                      {getValues("truck_image_path")?.length <= 1 ? (
                        <CustomFileInput
                          name=""
                          placeholder="Upload truck Images"
                          label=""
                          type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                          defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                          maxSize={2}
                          // InputDisabled={isReadOnly}
                          InputDisabled={InputDisableFunction()}
                          showErr={
                            formState?.errors?.truck_image_path ? true : false
                          }
                          onChange={(e) => {
                            const ImageTruck = getValues("truck_image_path");

                            if (ImageTruck?.length <= 2) {
                              setValue("truck_image_path", [...ImageTruck, e], {
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
                        {getValues("truck_image_path") ? (
                          <Box
                            gap={5}
                            overflow={"auto"}
                            display={"flex"}
                            justifyContent={"center"}
                            ref={finalRef}
                            onClick={onOpen}
                            cursor={"pointer"}
                          >
                            {getValues("truck_image_path").map(
                              (item, index) => (
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
                              )
                            )}
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Box>
                      {formState?.errors?.truck_image_path ? (
                        <Text color="red">
                          {formState?.errors?.truck_image_path?.message}
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
                              {getValues("truck_image_path")?.map(
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
                                      (getValues("truck_image_path")?.length -
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
                    <Text textAlign="right">
                      Driver Name <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type={"text"}
                      name="driver_name"
                      placeholder={"Enter driver name"}
                      // InputDisabled={isReadOnly}
                      InputDisabled={InputDisableFunction()}
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
                    <Text textAlign="right">
                      Upload Driver Photo{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Box>
                      <CustomFileInput
                        name="driver_photo_path"
                        placeholder="Upload Images"
                        value={getValues("driver_photo_path")}
                        InputDisabled={isReadOnly}
                        onChange={(e) => {
                          setValue("driver_photo_path", e, {
                            shouldValidate: true,
                          });
                        }}
                        showErr={
                          formState?.errors?.driver_photo_path ? true : false
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
              {/* <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">Weighbridge Name</Text>

                    <ReactCustomSelect
                      name="weight_bridge_name"
                      options={selectBoxOptions?.client || []}
                      selectedValue={
                        selectBoxOptions?.client?.filter(
                          (item) =>
                            item.value === getValues("weight_bridge_name")
                        )[0] || {}
                      }
                      selectDisable={isReadOnly}
                      isLoading={getClientMasterApiIsLoading}
                      handleOnChange={(val) => {
                        setValue("weight_bridge_name", val.value, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box> */}

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Weighbridge Name <span style={{ color: "red" }}>*</span>
                    </Text>

                    {/* <CustomInput
                      type="text"
                      name="weight_bridge_name"
                      placeholder={"Weighbridge Name"}
                      InputDisabled={true}
                    /> */}

                    <ReactCustomSelect
                      name="weight_bridge_name"
                      options={selectBoxOptions?.weighbridge || []}
                      selectedValue={getValues("weight_bridge_name")}
                      //selectDisable={isReadOnly}
                      // isLoading={getWarehouseMasterApiIsLoading}
                      handleOnChange={(val) => {
                        console.log(val);
                        setValue("weight_bridge_name", val, {
                          shouldValidate: true,
                        });
                      }}
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
                      name="new_weight_bridge_name"
                      placeholder={"Free field"}
                      // InputDisabled={isReadOnly}
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

              {/* Weighbridge Slip No.  */}
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
                      <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type="text"
                      name="weight_bridge_slip_no"
                      placeholder={"Enter weighbridge slip no  "}
                      InputDisabled={InputDisableFunction()}
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
                      Weighbridge Slip Date & Time{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type="datetime-local"
                      name="weight_bridge_slip_date_time"
                      placeholder={"Enter weighbridge slip date & time  "}
                      InputDisabled={InputDisableFunction()}
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
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Box>
                      <CustomFileInput
                        name="weight_bridge_slip_upload_path"
                        placeholder="Upload Images"
                        label=""
                        value={getValues("weight_bridge_slip_upload_path")}
                        InputDisabled={InputDisableFunction()}
                        onChange={(e) => {
                          setValue("weight_bridge_slip_upload_path", e, {
                            shouldValidate: true,
                          });
                        }}
                        showErr={
                          formState?.errors?.weight_bridge_slip_upload_path
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

              {/* Gross Weight (in KG) */}
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
                      <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type="number"
                      name="gross_weight"
                      InputDisabled={InputDisableFunction()}
                      inputValue={getValues("gross_weight")}
                      onChange={(e) => {
                        setValue("gross_weight", e.target.value, {
                          shouldValidate: true,
                        });
                      }}
                      placeholder={"Enter weight  "}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* Tare Weight */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Tare Weight(In MT) <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type="number"
                      name="tare_weight"
                      placeholder={"Enter weight "}
                      // InputDisabled={isReadOnly}
                      InputDisabled={InputDisableFunction()}
                      inputValue={getValues("tare_weight")}
                      onChange={(e) => {
                        let gross_weight = Number(
                          getValues("gross_weight") || 0
                        );
                        let tare_weight = Number(e.target.value || 0);

                        if (tare_weight >= 0 && tare_weight < gross_weight) {
                          setValue("tare_weight", e.target.value, {
                            shouldValidate: true,
                          });

                          // Calculate and set net weight
                          const netWeight = gross_weight - tare_weight;
                          setValue(
                            "net_weight",
                            netWeight >= 0 ? netWeight : 0,
                            {
                              shouldValidate: true,
                            }
                          );

                          // Clear previous tare weight error if any
                          clearErrors("tare_weight");
                        } else {
                          setValue("tare_weight", "", {
                            shouldValidate: false,
                          });

                          // Set error message based on the condition
                          setError("tare_weight", {
                            type: "custom",
                            message:
                              tare_weight < 0
                                ? "Tare weight cannot be negative"
                                : "Tare weight should be less than Gross weight",
                          });

                          // Set net weight to 0 if tare weight is greater than or equal to gross weight
                          setValue("net_weight", 0, {
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* Net Weight */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Net Weight(In MT) <span style={{ color: "red" }}>*</span>
                    </Text>

                    <CustomInput
                      type="number"
                      name="net_weight"
                      placeholder={
                        "Auto calculated (Gross weight – Tare weight) "
                      }
                      InputDisabled={true}
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
                  // templateColumns={{
                  //   base: "repeat(1, 1fr)",
                  //   md: "repeat(2, 1fr)",
                  //   lg: "repeat(2, 1fr)",
                  // }}
                  // mx="auto"
                  // border="2px"
                  // spacing="5"
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
                        {fields.length > 0 &&
                          fields?.map((el, index) => (
                            <Tr
                              key={el?.id}
                              textAlign="center"
                              bg="white"
                              border="1px"
                              borderColor="#000"
                            >
                              <Td>{index + 1}</Td>
                              <Td>
                                <Input
                                  readOnly
                                  type="text"
                                  name={`outward_gate_pass_commodity_quality_details.${index}.quality_parameter`}
                                  value={el?.quality_parameter}
                                />
                                {/* {el?.quality_parameter} */}
                              </Td>
                              <Td>
                                <Controller
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      type="text"
                                      border="1px"
                                      name={`outward_gate_pass_commodity_quality_details.${index}.parameter_value`}
                                      borderColor={`${
                                        formState?.errors
                                          ?.outward_gate_pass_commodity_quality_details?.[
                                          index
                                        ]?.parameter_value
                                          ? "red"
                                          : "gray.10"
                                      }`}
                                      // {...register(
                                      //   `outward_gate_pass_commodity_quality_details.${index}.parameter_value`,
                                      //   {
                                      //     required: true,
                                      //   }
                                      // )}
                                      isDisabled={InputDisableFunction()}
                                      backgroundColor={"white"}
                                      defaultValue=""
                                      height={"15px "}
                                      borderRadius={"lg"}
                                      _placeholder={commonStyle._placeholder}
                                      _hover={commonStyle._hover}
                                      _focus={commonStyle._focus}
                                      p={{ base: "4" }}
                                      fontWeight={{ base: "normal" }}
                                      fontStyle={"normal"}
                                      placeholder="Enter final result"
                                    />
                                  )}
                                  rules={{
                                    required: true,
                                    // required: el?.quality_parameter === "moisture" ? true : false,
                                  }}
                                  name={`outward_gate_pass_commodity_quality_details.${index}.parameter_value`}
                                  control={control}
                                />
                              </Td>
                            </Tr>
                          ))}

                        {fields?.length === 0 && (
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
                      name="remarks"
                      placeholder={"Free field"}
                      InputDisabled={InputDisableFunction()}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>
              {/* <Box>
                <Button
                  bg="#A6CE39"
                  _hover={{}}
                  color="white"
                  padding="0px 20px"
                  isLoading={postGatePassOutwardApiLoading}
                  borderRadius={"50px"}
                  type="submit"
                >
                  Submit
                </Button>
              </Box> */}

              {!InputDisableFunction() && (
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
                    isLoading={postGatePassOutwardApiLoading}
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
                    isLoading={postGatePassOutwardApiLoading}
                  >
                    Submit
                  </Button>
                </Box>
              )}
            </FormProvider>
          </form>
        </Box>
      </Box>
    </>
  );
}

function validateLotDetailsFormData(formData) {
  const validationSchema = doDetailsSchema;

  try {
    return validationSchema.validateSync(formData, { abortEarly: false });
  } catch (errors) {
    const validationErrors = {};

    errors.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });

    throw validationErrors;
  }
}

const doSubTableCalculate = (array) => {
  console.log(array);
  const subTable = [];
  //   current_do_bags: '1',
  //   current_do_mt: '3',

  // {
  //   select_do_no: { label: 'GGDR/1/GUJ', value: 43 },
  //   do_expiry_date: '2024-01-31',
  //   balance_bags_in_do: 1400,
  //   balance_mt_in_do: 65,
  //   deposit_cir_bags: 5000,
  //   select_stack_no: { label: 100, value: 323 },
  //   select_lot_no: { label: 'GP240129176/1', value: 212 },
  //   total_bags_can_delivered: 200,
  //   total_mt_can_delivered: 10,
  //   current_do_bags: '10',
  //   current_do_mt: '2',
  //   remaining_bag_lot_as_do: 190,
  //   remaining_mt_lot_as_do: 8,
  //   remaining_for_do_bags: 1390,
  //   remaining_for_do_mt: 63
  // }

  array?.forEach((item) => {
    const existingItemIndex = subTable.findIndex(
      (subItem) => subItem.select_do_no.value === item.select_do_no.value
    );

    if (existingItemIndex !== -1) {
      // If the item already exists in subTable, update the values
      subTable[existingItemIndex].current_do_bags += Number(
        item.current_do_bags
      );
      subTable[existingItemIndex].current_do_mt += Number(item.current_do_mt);
    } else {
      // If the item does not exist in subTable, add a new item
      subTable.push({
        select_do_no: item.select_do_no,
        current_do_bags: Number(item.current_do_bags),
        current_do_mt: Number(item.current_do_mt),
      });
    }
  });
  return subTable;
};

// {
//   select_do_no: { label: "204", value: 22 },
//   do_expiry_date: "",
//   balance_bags_in_do: 223,
//   balance_mt_in_do: 23,
//   deposit_cir_bags: 55,
//   select_stack_no: { label: 33, value: 2 },
//   select_lot_no: { label: 11, value: 5 },
//   total_bags_can_delivered: 40, // calculate
//   total_mt_can_delivered: 20, // calculate
//   current_do_bags: 43,
//   current_do_mt: 55,
//   remaining_bag_lot_as_do: 77,
//   remaining_mt_lot_as_do: 88,
//   remaining_for_do_bags: 34,
//   remaining_for_do_mt: 55,
// },

// {
//   "gate_pass_in_date_time": "2023-12-25T16:41",
//   "gate_pass_out_date_time": "2023-12-25T16:41",
//   "warehouse": "113",
//   "chamber": "133",
//   "client": "132",
//   "client_representative_name": "Harsh Waghela",
//   "commodity": "10",
//   "commodity_variety": "188",
//   "total_bags": "10",
//   "total_mt": "122",
//   "truck_number": "GJ AK 2356",
//   "truck_image_path": [
//       "media/docs/2023-2024/undefined/undefined/Screenshot from 2023-12-13 18-49-28_16:49:55.png",
//       "media/docs/2023-2024/undefined/undefined/Screenshot from 2023-12-18 13-04-52_16:49:58.png"
//   ],
//   "driver_name": "Kevin",
//   "driver_photo_path": [
//       "media/docs/2023-2024/undefined/undefined/Screenshot from 2023-12-13 18-49-28_16:50:08.png"
//   ],
//   "weight_bridge_name": "132",
//   "weight_bridge_slip_no": "DF3OJ6HJ53GJ",
//   "weight_bridge_slip_date_time": "2023-12-21T19:54",
//   "weight_bridge_slip_upload_path": [
//       "media/docs/2023-2024/undefined/undefined/Screenshot from 2023-12-13 18-49-28_16:50:26.png"
//   ],
//   "new_weight_bridge_name": "Test 123 New WeightBridge Name",
//   "tare_weight": 445,
//   "gross_weight": 3,
//   "net_weight": 0,
//   "is_draft": false,
//   "outward_gate_pass_do_details": [
//       {
//           "do": 23,
//           "stack_no": 258,
//           "lot_no": 33,
//           "current_bag_for_gatepass": 10,
//           "current_mt_for_gatepass": 122.22
//       }
//   ],
//   "outward_gate_pass_commodity_quality_details": [
//       {
//           "id" : 4,
//           "parameter_value": "ewr",
//           "quality_parameter": "Humidity"
//       },
//       {
//         "id" : 13,
//           "parameter_value": "moisture",
//           "quality_parameter": "moisture"
//       }
//   ]
// }

//form_details is my api response objet and obj is my local variable now convert this api response in my local objet data for my form auto field

// const form_details = {
//   id: 10,
//   gate_pass_no: null,
//   gate_pass_in_date_time: "2023-12-26T18:31:00+05:30",
//   gate_pass_out_date_time: "2023-12-26T18:31:00+05:30",
//   client_representative_name: "Harsh Waghela",
//   total_bags: 56,
//   total_mt: 555,
//   truck_number: "GJ AK 235643wer32",
//   truck_image_path: [
//     "media/docs/2023-2024/undefined/undefined/Screenshot from 2023-12-18 13-04-52_18:33:30.png",
//     "media/docs/2023-2024/undefined/undefined/Screenshot from 2023-12-25 18-30-03_18:33:33.png",
//   ],
//   driver_name: "f sfdsd",
//   driver_photo_path: [
//     "media/docs/2023-2024/undefined/undefined/Screenshot from 2023-10-12 10-15-11_18:33:38.png",
//   ],
//   weight_bridge_name: "",
//   weight_bridge_deviation_path: null,
//   new_weight_bridge_name: "Test 123 New WeightBridge Name sdffsdddf df dsf sdf",
//   weight_bridge_slip_no: "DF3OJ6HJ53GJ3434",
//   weight_bridge_slip_date_time: "2023-12-28T22:37:00+05:30",
//   weight_bridge_slip_upload_path: [
//     "media/docs/2023-2024/undefined/undefined/Screenshot from 2023-12-18 13-04-52_18:33:51.png",
//   ],
//   tare_weight: 23,
//   gross_weight: 34,
//   net_weight: 0,
//   remarks: null,
//   is_active: true,
//   is_draft: false,
//   creation_date: "2023-12-26T18:34:49.591287+05:30",
//   cor_status: "pending",
//   last_updated_date: "2023-12-26T18:34:49.591296+05:30",
//   warehouse: {
//     id: 113,
//     warehouse_name: "wms rent fixed rental 28-11-23 warehouse",
//     warehouse_number: "WH2311281",
//     warehouse_address: "Warehouse Address*",
//     warehouse_pincode: 456456,
//     geo_location_of_warehouse: null,
//     total_rent_payable: 444.4,
//     is_dehiring: false,
//     dehiring_start_date: null,
//     dehiring_End_date: null,
//     is_kyc_completed: true,
//     kyc_completion_date: "2023-11-28",
//     is_agreement_done: true,
//     is_renewal_started: true,
//     is_active: true,
//     is_block: true,
//     creation_date: "2023-11-28T12:50:30.223139+05:30",
//     last_update_date: "2023-12-19T11:23:01.690533+05:30",
//     warehouse_related_document: [
//       "media/docs/2023-2024/Warehouse/Inspection/DealsOffersBanner1_12:28:09.jpg",
//       "media/docs/2023-2024/Warehouse/Inspection/refresh_12:28:17.png",
//     ],
//     is_new_supervisor_day_shift: false,
//     is_new_supervisor_night_shift: true,
//     activation_date_time: [],
//     block_date_time: [],
//     warehouse_type: 33,
//     warehouse_sub_type: 50,
//     warehouse_unit_type: 3,
//     region: 3,
//     state: 88,
//     substate: 31,
//     district: 238,
//     area: 78,
//     created_user: 272,
//     supervisor_day_shift: null,
//     supervisor_night_shift: null,
//   },
//   chamber: {
//     id: 133,
//     chamber_number: "oilt tank number 1",
//     chamber_length: null,
//     chamber_breadth: null,
//     diameter: 2.2,
//     height: 2.2,
//     roof_height: null,
//     stackable_height: null,
//     density: 2.2,
//     chamber_sq_ft: null,
//     chamber_total_area: null,
//     capacity: 73.59,
//     warehouse: 113,
//   },
//   client: {
//     id: 132,
//     name_of_client: "kunal sharma client of commodity",
//     client_type: "Retail",
//     name_of_company: "kunal sharma client of commodity",
//     pan_card_type: "individual",
//     upload_pan_card: null,
//     mode_of_operations: "Jointly",
//     client_sourced_by: "warehouse",
//     authorised_person_name: "2222",
//     authorised_person_birth_date: "2023-12-08",
//     authorised_person_so_or_wo: "333",
//     authorised_person_designation: "333",
//     authorised_person_aadhaar_number: "212121212121",
//     authorised_person_upload_aadhaar_card:
//       "media/docs/2023-2024/master/Warehouse Client Master/Screenshot from 2023-11-30 12-19-40_15:07:02.png",
//     authorised_person_pan_card_number: "ABCDE1234Z",
//     l2_reasons: null,
//     l3_reasons: null,
//     is_active: true,
//     creation_date: "2023-12-11T15:07:58.562418+05:30",
//     last_update_date: "2023-12-19T15:38:07.089041+05:30",
//     authorised_person_upload_pan_card:
//       "media/docs/2023-2024/master/Warehouse Client Master/Screenshot from 2023-11-30 12-19-40_15:07:10.png",
//     sales_person: 293,
//     constitution_of_client: 2,
//     l1_user: 2,
//     l2_user: 278,
//     l3_user: 279,
//     status: 46,
//     created_user: 2,
//     last_updated_user: 2,
//   },
//   commodity: {
//     id: 10,
//     commodity_name: "Guar Gum",
//     lab_testing_required: true,
//     is_active: true,
//     created_at: "2023-11-06",
//     last_updated_date: "2023-11-06",
//     fumigation_required: false,
//     commodity_type: 39,
//   },
//   commodity_variety: {
//     id: 188,
//     commodity_variety: "Guar Gum Variety 1",
//     description: "Guar Gum Variety 1",
//     hsn_code: "228",
//     fed: 3,
//     is_block: false,
//     is_active: true,
//     creation_date: "2023-12-08",
//     last_updated_date: "2023-12-08",
//     commodity_min_price: 10,
//     commodity_max_price: 100,
//     commodity_id: 10,
//   },
//   l1_user: null,
//   status: { id: 41, description: "l1 Submitted", status_code: 1 },
//   cor: null,
// };

// let obj = {
//   id: form_details.id,
//   gate_pass_type: form_details?.gate_pass_type,
//   gate_pass_no: form_details?.gate_pass_no,
//   gate_pass_in_date_time: form_details?.gate_pass_in_date_time
//     ? moment(form_details?.gate_pass_in_date_time).format("YYYY-MM-DDTHH:mm:ss")
//     : null,
//   gate_pass_out_date_time: form_details?.gate_pass_out_date_time
//     ? moment(form_details?.gate_pass_out_date_time).format(
//         "YYYY-MM-DDTHH:mm:ss"
//       )
//     : null,
//   warehouse: {
//     label: form_details?.warehouse?.warehouse_name,
//     id: form_details?.warehouse?.id,
//     weight_bridge_name: form_details?.weight_bridge_name,
//   },
//   chamber: form_details?.chamber?.id,
//   client: form_details?.client?.id,
//   client_representative_name: form_details?.client_representative_name,
//   commodity: form_details?.commodity?.id,
//   commodity_variety: form_details?.commodity_variety?.id,
//   truck_number: form_details?.truck_number,
//   truck_image: form_details?.truck_image,
//   driver_name: form_details?.driver_name,
//   upload_driver_photo: form_details?.upload_driver_photo,
//   weight_bridge_name: form_details?.weight_bridge_name,
//   upload_approval_email: form_details?.upload_approval_email,
//   new_weight_bridge_name: form_details?.new_weight_bridge_name,
//   weighbridge_slip_no: form_details?.weighbridge_slip_no,
//   weighbridge_slip_datetime: form_details?.weighbridge_slip_datetime
//     ? moment(form_details?.weighbridge_slip_datetime).format(
//         "YYYY-MM-DDTHH:mm:ss"
//       )
//     : null,
//   upload_weighbridge_slip: form_details?.upload_weighbridge_slip,
//   // total_no_of_bags: form_details?.total_no_of_bags,
//   gross_weight_kg: form_details?.gross_weight_kg,
//   tare_weight: form_details?.tare_weight,
//   net_weight: form_details?.net_weight,
//   //sample_seal_no: form_details?.sample_seal_no,
//   sampler_name: form_details?.sampler_name,
//   remarks: form_details?.remarks,

//   // gate_pass_stack_details: form_details?.gate_pass_stack_details,
//   gate_pass_commodity_quality: form_details?.gate_pass_commodity_quality,
// };

// {
//   id: 221,
//   parameter_value: 'Moisture bbbbbbbbb',
//   outward_gate_pass: {
//     id: 62,
//     gate_pass_no: 'GP240208208',
//     gate_pass_in_date_time: '2024-02-08T12:46:00+05:30',
//     gate_pass_out_date_time: '2024-02-08T12:46:00+05:30',
//     client_representative_name: null,
//     total_bags: 23,
//     total_mt: 4,
//     truck_number: null,
//     truck_image_path: [],
//     driver_name: null,
//     driver_photo_path: [ null ],
//     weight_bridge_name: null,
//     weight_bridge_deviation_path: null,
//     new_weight_bridge_name: null,
//     weight_bridge_slip_no: null,
//     weight_bridge_slip_date_time: '2024-02-08T12:46:00+05:30',
//     weight_bridge_slip_upload_path: [ null ],
//     tare_weight: null,
//     gross_weight: null,
//     net_weight: 0,
//     remarks: 'sdfsdfsf',
//     is_active: true,
//     is_draft: true,
//     creation_date: '2024-02-08T12:47:37.350565+05:30',
//     cor_status: 'pending',
//     last_updated_date: '2024-02-08T12:47:37.350581+05:30',
//     warehouse: 154,
//     chamber: 195,
//     client: 147,
//     commodity: 35,
//     commodity_variety: 202,
//     l1_user: 2,
//     status: 51,
//     cor: null,
//     last_updated_user: 2
//   },
//   quality_parameter: {
//     id: 39,
//     quality_parameter: 'Moisture',
//     to_capture: 'range',
//     decides_grade: 'yes',
//     is_active: true,
//     created_at: '2024-01-29',
//     updated_at: '2024-01-29',
//     last_updated_user: 2
//   },
//   last_updated_user: {
//     id: 2,
//     employee_name: 'Mayur',
//     phone: '+918306776883',
//     address: 'sdfdsfdsf',
//     pin_code: 650012,
//     email: 'admin@gmail.com',
//     password:
//       'pbkdf2_sha256$600000$pkHYeDFffFbitbclxYIScn$bUcH+MPZXqjgbdoVE+dWqOYewzIODOKT09/xRu1kHPU=',
//     employee_id: '2',
//     last_login: '2024-02-08T11:13:51.200893+05:30',
//     is_active: true,
//     created_at: '2023-06-09T11:39:10.712007+05:30',
//     updated_at: '2024-02-07T18:59:09.981451+05:30',
//     is_superuser: true,
//     is_staff: true,
//     fcm_token: 'mikjmoklm o',
//     last_working_date: '2023-11-15',
//     reporting_manager: 2,
//     designation: 1,
//     created_user: null,
//     last_updated_user: 2,
//     user_role: Array(27) [
//       125, 123, 122, 121, 119, 115, 107, 106, 105, 104, 103, 97, 96, 95, 78, 77,
//       76, 72, 71, 70, 67, 66, 59, 58, 32, 31, 4
//     ]
//   }
// },
