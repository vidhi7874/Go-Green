/* eslint-disable react-hooks/exhaustive-deps */
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
import ReactSelect from "react-select";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { schema } from "./field";
import { BsEye } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import {
  useCreateCIRMutation,
  useGetCIRFreeMutation,
  useGetInsurancePolicyNumberMutation,
  useFetchCIRMutation,
  useGetMarketRateMutation,
  useUpdateCIRMutation,
  useCirAssignApproveRejectMutation,
} from "../../features/cir.slice";
import moment from "moment";
import CustomSign from "../../components/Elements/CustomSign";
import {
  CommonToasterAlert,
  capitalizeFirstLetter,
  enterFullScreen,
  numberToWords,
} from "../../services/common.service";
import * as yup from "yup";
import { getValue } from "@testing-library/user-event/dist/utils";
import ROUTE_PATH from "../../constants/ROUTE";
import configuration from "../../config/configuration";
import { localStorageService } from "../../services/localStorge.service";

const AddEditCommodityInwardReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [rejectReason, setRejectReason] = useState("");

  const loginData = localStorageService.get("GG_ADMIN");
  console.log(loginData, "hhiii");
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
    getFieldState,
    clearErrors,
    formState: { isDirty, errors },
  } = methods;

  const details = location?.state?.details;
  console.log("on edit details -->", details);
  // eslint-disable-next-line
  const [updateInsuranceId, setUpdateInsuranceId] = useState(null);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState({
    selected_Policy_Type: {},
    selected_Policy_NO: "",
  });

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
      color: state.isFocused ? "green" : state.isDisabled ? "#d0cdcd" : "black",
      cursor: state.isDisabled ? "not-allowed" : "default",
      textAlign: "left",
      "&:hover": {
        //  backgroundColor: "#C2DE8C",
        color: state.isDisabled ? "#d0cdcd" : "black",
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
  // css Code End

  // GatePass Listing Api Start

  const [userStatus, setUserStatus] = useState(0);

  const [dataState, setDataState] = useState({});
  const [gatePassList, setGatePassList] = useState([]);
  const [policyNoList, setPolicyNoList] = useState({
    fire_policy_list: [],
    burglary_policy_list: [],
  });
  const [disabledField, setDisabledField] = useState(false);
  const [insuranceDetailsList, setInsuranceDetailsList] = useState([]);
  const [insuranceDetailsEditState, setInsuranceDetailsEditState] = useState({
    isEdit: false,
    index: null,
  });
  const [getGatepassCIR] = useGetCIRFreeMutation();
  const [getMarketRate] = useGetMarketRateMutation();

  const [fetchCIR] = useFetchCIRMutation();

  const [getInsurancePolicy] = useGetInsurancePolicyNumberMutation();
  const [cirAssignApproveReject] = useCirAssignApproveRejectMutation();

  console.log("state data ->", dataState);

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

  const approve = async (obj) => {
    const { type, reasons } = obj;

    const data = {
      id: details?.cir__id?.id,
      status: type,
      reasons: reasons || null,
    };
  };

  const assignApproveRejectToMeFunction = async (obj) => {
    const { type, reasons } = obj;

    const data = {
      id: details?.cir__id?.id,
      status: type,
      reasons: reasons || null,
    };

    console.log(obj);

    console.log(data);

    try {
      const response = await cirAssignApproveReject(data).unwrap();
      console.log("response --> ", response);
      if (response?.status === 200) {
        let msg =
          type === "assigned"
            ? "Assigned successfully"
            : type === "approved"
            ? "Approved successfully "
            : "";

        if (type !== "assigned") {
          navigate(`${ROUTE_PATH.COMMODITY_INWARD_REPORT}`);
        }
        if (type === "assigned") {
          console.log("assigned");
          console.log(details?.cir__id?.id);
          // fetchCIRById({ cir_id: details?.cir__id?.id });
          window.location.reload();
        }
        toasterAlert({
          message: msg,
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

    console.log(data, "data");
  };

  const getCirInsurancePolicy = async (policy_type) => {
    try {
      if (!details?.cir__id?.id) {
        return false;
      }

      console.log("cir__id details -->", details?.cir__id?.id);

      let queryParams = {
        cir: details?.cir__id?.id,
        policy_type: policy_type,
      };

      console.log("queryParams", queryParams);

      const response = await getInsurancePolicy(queryParams).unwrap();

      if (response?.status === 200) {
        console.log(response);
        const issued_by = response?.data?.[0]?.policy_by;
        console.log(issued_by);
        setValue("issued_by", issued_by || "", {
          shouldValidate: true,
        });
        let arr = response?.data?.map((el) => ({
          label: el?.current_insurance_status?.[0]?.free_policy_ammount,
          value: el?.id,
          policy_number: el?.policy_number,
          valid_up_to: el?.policy_end_date,
        }));

        console.log(arr);

        if (policy_type === "fire") {
          setPolicyNoList((prev) => ({
            ...prev,
            fire_policy_list: arr,
          }));
        }

        if (policy_type === "burglary") {
          setPolicyNoList((prev) => ({
            ...prev,
            burglary_policy_list: arr,
          }));
        }

        console.log(response?.data[0]?.policy_end_date);

        console.log(arr);
        // setValue("valid_up_to", response?.data[0]?.policy_end_date, {
        //   shouldValidate: true,
        // });
        // setPolicyNoList(arr);
        return arr;
      }

      console.log(queryParams);
    } catch (error) {
      console.log(error);
      CommonToasterAlert(error);
    }
  };

  const addUpdateInsuranceDetails = () => {
    const data = getValues();

    const value_of_commodity = (
      parseFloat(getValues("total_net_weight")) *
      parseFloat(getValues("market_rate"))
    ).toFixed(2);

    // issued_by: details?.service_contract?.insurance_by,
    const obj = {
      issued_by: data?.issued_by,
      policy_type: data?.policy_type,
      policy_no: data?.policy_no,
      valid_up_to: data?.valid_up_to,
      amount: parseFloat(data?.amount).toFixed(2),
    };

    // Initialize totals for Fire and Burglary
    let fireTotal = 0;
    let burglaryTotal = 0;

    // Iterate through the data array
    insuranceDetailsList?.forEach((item) => {
      // Check policy_type.label and accumulate amounts accordingly
      if (item.policy_type.label === "Fire") {
        fireTotal += item.amount;
      } else if (item.policy_type.label === "Burglary") {
        burglaryTotal += item.amount;
      }
    });
    try {
      const form_data = validateInsuranceDetailsSchema(obj);
      const { isEdit, index } = insuranceDetailsEditState;

      let selected_type = obj?.policy_type?.value;
      const listKey = `${selected_type}_policy_list`;
      const updatedList = [...policyNoList[listKey]];

      console.log(policyNoList);

      const indexToUpdate = updatedList.findIndex(
        (item) => item.policy_number === obj.policy_no.policy_number
      );

      console.log(indexToUpdate);

      if (indexToUpdate !== -1) {
        let label = parseInt(updatedList[indexToUpdate].label) - obj.amount;
        console.log(selected_type);
        const updatedObject = {
          ...updatedList[indexToUpdate],
          label: label,
          isDisabled: true,
        };
        // isDisabled:
        //   selected_type === "fire"
        //     ? parseFloat(fireTotal).toFixed(2) === value_of_commodity ||
        //       obj?.amount === value_of_commodity
        //     : parseFloat(burglaryTotal).toFixed(2) === value_of_commodity ||
        //       obj?.amount === value_of_commodity,

        console.log(updatedObject);

        // Update the object in updatedList
        updatedList[indexToUpdate] = updatedObject;

        // Update the policyNoList state based on the selected type
        setPolicyNoList({
          ...policyNoList,
          [listKey]: updatedList,
        });
      }

      setInsuranceDetailsList((prev) => {
        if (isEdit && index !== null && index >= 0 && index < prev.length) {
          return prev.map((item, i) => (i === index ? form_data : item));
        } else {
          return [...prev, form_data];
        }
      });

      // setInsuranceDetailsEditState({
      //   isEdit: false,
      //   index: null,
      // });

      console.log("isValid -->", form_data);
      //"issued_by",
      clearErrors(["policy_type", "policy_no", "valid_up_to", "amount"]);
      setSelectedDropdownValue((prev) => ({
        ...prev,
        selected_Policy_NO: "",
        selected_Policy_Type: "",
      }));
      Object.keys(form_data).forEach((key) => {
        if (key !== "issued_by") {
          setValue(key, "", {
            shouldValidate: false,
          });
        }
      });
    } catch (validationErrors) {
      Object.keys(validationErrors).forEach((key) => {
        setError(key, {
          type: "manual",
          message: validationErrors[key] || "",
        });
      });
      return false;
    }

    console.log(data);
    console.log(obj);
    //  insuranceDetailsSchema();
  };

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

  const onEditInsuranceDetail = (item, index) => {
    // setValue("valid_up_to", "23-11-2023", { shouldValidate: true });
    console.log(item);
    setInsuranceDetailsEditState({
      isEdit: true,
      index: index,
    });

    Object.keys(item).forEach((key) => {
      setValue(key, item[key], {
        shouldValidate: true,
      });

      setSelectedDropdownValue((prev) => ({
        ...prev,
        selected_Policy_NO: item?.policy_no,
        selected_Policy_Type: item?.policy_type,
      }));
    });

    console.log(getValues());
  };

  const onDeleteInsuranceDetail_old = (index) => {
    setInsuranceDetailsList((prev) => {
      if (index !== null && index >= 0 && index < prev.length) {
        return prev.filter((item, i) => i !== index);
      } else {
        return prev;
      }
    });
  };

  const onDeleteInsuranceDetail = (index) => {
    setInsuranceDetailsList((prev) => {
      if (index !== null && index >= 0 && index < prev.length) {
        const deletedItem = prev[index];
        console.log(deletedItem);

        console.log(policyNoList);

        // Add logic to update policyNoList based on deletedItem
        if (deletedItem && deletedItem.policy_no) {
          const { policy_no, amount, policy_type } = deletedItem;
          const listKey = `${policy_type?.value}_policy_list`;
          console.log(listKey);

          const updatedList = [...policyNoList?.[listKey]];

          const indexToUpdate = updatedList.findIndex(
            (item) => item.policy_number === policy_no.policy_number
          );

          if (indexToUpdate !== -1) {
            let label = parseInt(updatedList[indexToUpdate].label) + amount;

            const updatedObject = {
              ...updatedList[indexToUpdate],
              label: label,
              isDisabled: false, // Assuming you want to reset isDisabled during deletion
            };

            updatedList[indexToUpdate] = updatedObject;

            setPolicyNoList((prevPolicyNoList) => ({
              ...prevPolicyNoList,
              [listKey]: updatedList,
            }));
          } else {
            console.log("Object not found in policyNoList");
          }
        }

        return prev.filter((item, i) => i !== index);
      } else {
        return prev;
      }
    });
  };

  const inputDisabled = (obj) => {
    console.log(obj);
    let code = Number(obj?.code?.status_code);
    let user_id = obj?.user_id;
    let current_user_id = loginData?.userDetails?.id;

    let isDisabled =
      (code === 5 && user_id === current_user_id) ||
      (code === 2 && current_user_id && user_id === current_user_id);
  };

  const fetchCIRById = async (param) => {
    try {
      const response = await fetchCIR({ id: param?.cir_id });
      console.log("response?.data", response?.data);
      console.log(response?.data.client_signature);
      console.log(response?.data);
      setUserStatus(response?.data?.status?.status_code);
      inputDisabled({
        code: response?.data?.status,
        user_id: response?.data?.l2_user?.id,
      });
      setGatePassList(response?.data?.gatepasses || []);
      setDataState(response?.data);
      let insurance_by = response?.data?.service_contract_no?.insurance_by;
      console.log(insurance_by);
      setValue("issued_by", insurance_by || "", {
        shouldValidate: true,
      });

      const commodity_max_price =
        response?.data?.commodity_variety?.commodity_max_price;
      const commodity_min_price =
        response?.data?.commodity_variety?.commodity_min_price;
      console.log(response?.data?.commodity_variety);
      console.log(commodity_max_price);
      const modal_price = (commodity_max_price + commodity_min_price) / 2;
      console.log(modal_price);
      // const market_rate_value = response?.commodity_variety?.commodity_max_price || 0;

      // setValue("market_rate", modal_price, {
      //   shouldValidate: true,
      // });

      setValue("market_rate", response?.data?.market_rate, {
        shouldValidate: true,
      });

      const insurance_details_arr = response?.data?.cir_insurance_details;

      const data_obj = {
        cir_no: response?.data?.cir_no,
        cir_creation_date: moment(response?.data?.cir_creation_date)?.format(
          "YYYY-MM-DD"
        ),
        agent_name: response?.data?.agent_name,
        client_representative_name: response?.data?.client_representative_name,
        client_representative_mobile_no:
          response?.data?.client_representative_mobile_no,
        client_signature: response?.data?.client_signature,
        client_id_proof_path: response?.data?.client_id_proof_path,
        authority_letter_path: response?.data?.authority_letter_path,
        spilage_bag_count: response?.data?.spilage_bag_count,
        remarks: response?.data?.remarks,
      };

      let total_no_of_bags_count = getValues("total_no_of_bags");

      if (data_obj?.spilage_bag_count < total_no_of_bags_count) {
        setError(
          "spilage_bag_count",
          { type: "focus" },
          { shouldFocus: true, isDirty: true }
        );
      }

      Object.keys(data_obj).forEach((key) => {
        setValue(key, data_obj[key], {
          shouldValidate: true,
        });
      });

      //  const insurance_details_arr = response?.data?.cir_insurance_details;

      let arr = insurance_details_arr?.map((el) => ({
        id: el?.id,
        policy_type: {
          label: capitalizeFirstLetter(el?.policy_type),
          value: el?.policy_type,
        },
        valid_up_to: el?.policy_end_date,
        amount: parseFloat(el?.insurance_consume_ammount).toFixed(2),
        issued_by: response?.data?.service_contract_no?.insurance_by,

        policy_no: {
          label: el?.insurance_policy?.policy_amount,
          value: el?.insurance_policy?.id,
          policy_number: el?.insurance_policy?.policy_number,
        },
      }));

      let fireTotal = 0;
      let burglaryTotal = 0;

      // Iterate through the data array
      arr?.forEach((item) => {
        // Check policy_type.label and accumulate amounts accordingly
        if (item.policy_type.label === "Fire") {
          fireTotal += parseFloat(item.amount).toFixed(2);
        } else if (item.policy_type.label === "Burglary") {
          burglaryTotal += parseFloat(item.amount).toFixed(2);
        }
      });

      arr?.forEach((item) => {
        const { policy_no, amount, policy_type } = item;
        let selected_type = policy_type?.value;
        const value_of_commodity = (
          parseFloat(getValues("total_net_weight")) *
          parseFloat(getValues("market_rate"))
        ).toFixed(2);

        const listKey = `${selected_type}_policy_list`;

        setPolicyNoList((prevPolicyNoList) => {
          const updatedList = [...prevPolicyNoList[listKey]];

          const indexToUpdate = updatedList.findIndex(
            (listItem) => listItem.policy_number === policy_no.policy_number
          );

          if (indexToUpdate !== -1) {
            let label = parseInt(updatedList[indexToUpdate].label) + amount;

            const updatedObject = {
              ...updatedList[indexToUpdate],
              label: label,
              isDisabled:
                selected_type === "fire"
                  ? parseFloat(fireTotal).toFixed(2) === value_of_commodity ||
                    item?.amount === value_of_commodity
                  : parseFloat(burglaryTotal).toFixed(2) ===
                      value_of_commodity || item?.amount === value_of_commodity, // Assuming you want to reset isDisabled during initialization
            };

            updatedList[indexToUpdate] = updatedObject;

            return {
              ...prevPolicyNoList,
              [listKey]: updatedList,
            };
          } else {
            return prevPolicyNoList;
          }
        });
      });

      setInsuranceDetailsList(arr);

      response?.data?.gatepasses?.forEach((el, index) => {
        GatePassSelectLogic(index);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const gatePassFreeList = async () => {
    console.log(details);
    try {
      const filter = {
        chamber: details?.chamber?.id || null,
        client: details?.client?.id || null,
        commodity_variety: details?.commodity_variety?.id || null,
        gate_pass_date_time_in__date: moment(
          details?.gate_pass_date_time_in__date
        ).format("YYYY-MM-DD"),
        service_contract__storage_rate_on:
          details?.service_contract__storage_rate_on === "bag" ? "bag" : null,
        service_contract__contractcommodity__bag_size__bag_size:
          details?.service_contract__contractcommodity__bag_size__bag_size ||
          null,
        warehouse: details?.warehouse?.id || null,
        commodity: details?.commodity?.id || null,
        gate_pass_status: details?.gate_pass_status,
        expected_bag_weight__bag_size: details?.expected_bag_weight__bag_size,
      };

      if (
        filter?.expected_bag_weight__bag_size === null ||
        filter?.expected_bag_weight__bag_size === ""
      ) {
        delete filter?.expected_bag_weight__bag_size;
      }

      console.log(filter);

      const response = await getGatepassCIR(
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

  // ! commented un used variable ..
  // const warehouseOwnerOnEdit = () => {};

  useEffect(() => {
    console.log(details);
    console.log(location?.state);
    let fire_type_policy = getCirInsurancePolicy("fire");
    let burglary_type_policy = getCirInsurancePolicy("burglary");
    console.log(fire_type_policy);
    console.log(burglary_type_policy);
    if (location?.state?.stage === 1 && !details?.cir__id?.id) {
      gatePassFreeList();
    }

    if (details?.cir__id?.id) {
      fetchCIRById({ cir_id: details?.cir__id?.id });
    }
  }, []);

  // GatePass Listing Api End

  //

  // GatePass Selection Logic Start

  const [selectedGatePass, setSelectedGatePass] = useState([]);

  const GatePassSelectLogic = (index) => {
    console.log("gatePass", index);
    if (selectedGatePass?.filter((item) => item === index)?.length > 0) {
      setSelectedGatePass(selectedGatePass?.filter((item) => item !== index));
    } else {
      setSelectedGatePass((old) => [...old, index]);
    }
  };

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
        Temp2 = Temp2 + tempArray[i]?.total_no_of_bags || 0;
      }
      setValue("total_no_of_bags", Temp2 || 0, {
        shouldValidate: true,
      });
      setValue("value_of_commodity", Temp2 * 10, {
        shouldValidate: true,
      });
      // setValue("market_rate", 10, {
      //   shouldValidate: true,
      // });
    } else {
      setValue("total_net_weight", 0, {
        shouldValidate: true,
      });
      setValue("total_no_of_bags", 0, {
        shouldValidate: true,
      });
      setValue("value_of_commodity", 0, {
        shouldValidate: true,
      });
      // setValue("market_rate", 10, {
      //   shouldValidate: true,
      // });
    }
  }, [selectedGatePass]);

  // GatePass Selection Logic End

  const calculateInsuranceValue = () => {
    console.log("insuranceDetailsList", insuranceDetailsList);

    let total = (
      parseFloat(getValues("total_net_weight")) *
      parseFloat(getValues("market_rate"))
    ).toFixed(2);

    console.log(total);

    const total_fire_type_records = insuranceDetailsList?.filter(
      (el) => el.policy_type?.value?.toLocaleLowerCase() === "fire"
    );
    const total_burglary_type_records = insuranceDetailsList?.filter(
      (el) => el.policy_type?.value?.toLocaleLowerCase() === "burglary"
    );

    console.log(total_fire_type_records.length);
    console.log(total_burglary_type_records.length);

    if (total_fire_type_records?.length === 0) {
      showToastByStatusCode(400, "Please Add Fire Policy Type Record");
      return false;
    }

    if (total_burglary_type_records?.length === 0) {
      showToastByStatusCode(400, "Please Add Burglary Policy Type Record");
      return false;
    }

    // Initialize totals for Fire and Burglary
    let fireTotal = 0;
    let burglaryTotal = 0;

    // Iterate through the data array
    insuranceDetailsList?.forEach((item) => {
      // Check policy_type.label and accumulate amounts accordingly
      if (item.policy_type.label === "Fire") {
        fireTotal += parseFloat(item.amount);
      } else if (item.policy_type.label === "Burglary") {
        burglaryTotal += parseFloat(item.amount);
      }
    });

    console.log(insuranceDetailsList);

    console.log(total);

    console.log(fireTotal);
    console.log(burglaryTotal);

    console.log(parseFloat(total).toFixed(2));
    console.log(parseFloat(fireTotal).toFixed(2));

    if (parseFloat(total).toFixed(2) !== parseFloat(fireTotal).toFixed(2)) {
      showToastByStatusCode(
        400,
        "Fire policy Insurance amount is not equal to Total Value of Commodity"
      );
      return false;
    }

    if (parseFloat(total).toFixed(2) !== parseFloat(burglaryTotal).toFixed(2)) {
      showToastByStatusCode(
        400,
        "Burglary policy Insurance amount is not equal to Total Value of Commodity"
      );
      return false;
    }

    console.log("Total Fire type amount:", fireTotal);
    console.log("Total Burglary type amount:", burglaryTotal);

    let isValid =
      parseFloat(total).toFixed(2) === parseFloat(fireTotal).toFixed(2) &&
      parseFloat(total).toFixed(2) === parseFloat(burglaryTotal).toFixed(2);

    return isValid ? true : false;
  };

  // Form Submit Function Start
  const onSubmit = (data) => {
    console.log(insuranceDetailsList);
    console.log("data==>", data);

    if (details?.cir__id?.id) {
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

      const isValid = calculateInsuranceValue();
      console.log("isValid", isValid);

      if (isValid) {
        console.log("testing ");
        // return false;
        const cir_insurance_detail = insuranceDetailsList?.map((el) => ({
          id: el?.id,
          policy_type: el?.policy_type?.value,
          policy_end_date: moment(el?.valid_up_to).format("YYYY-MM-DD"),
          insurance_consume_ammount: el?.amount,
          insurance_policy: el?.policy_no?.value,
        }));

        let final_data_obj = {};

        console.log(details?.cir__id);

        if (details?.cir__id?.id) {
          final_data_obj = {
            ...data,
            id: details.cir__id?.id,
            client_representative_mobile_no:
              data?.client_representative_mobile_no,
            cir_insurance_detail: cir_insurance_detail,
          };
        } else {
          // id: details.id,
          final_data_obj = {
            ...data,
            client_representative_mobile_no:
              "+91" + data?.client_representative_mobile_no,
          };
        }
        console.log("final_data_obj", final_data_obj);
        updateData(final_data_obj);

        console.log(data);
      }
    } else {
      console.log("test");

      addData({
        ...data,
        cir_creation_date: moment(details?.gate_pass_date_time_in__date).format(
          "YYYY-MM-DD"
        ),
        client_representative_mobile_no:
          "+91" + data?.client_representative_mobile_no,
      });
    }
  };
  // Form Submit Function End

  // Add CIR Api Start

  const [AddCIRAPI, { isLoading: addAddCIRAPIApiIsLoading }] =
    useCreateCIRMutation();

  const [updateCIR, { isLoading: updateCIRApiIsLoading }] =
    useUpdateCIRMutation();

  const addData = async (data) => {
    try {
      if (selectedGatePass.length > 0) {
        const tempArray = gatePassList
          .filter((item, index) => selectedGatePass.includes(index))
          .map((item) => item.id);

        const finalData = { ...data, gatepass: tempArray, is_draft: false };

        const response = await AddCIRAPI(finalData).unwrap();
        console.log("add CIR res", response);
        if (response.status === 201) {
          toasterAlert(response);
          navigate(`${ROUTE_PATH.COMMODITY_INWARD_REPORT}`);
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
        "CIR Creation Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Add CIR Api End

  // Update CIR Api Start

  const updateData = async (data) => {
    try {
      const response = await updateCIR(data).unwrap();
      if (response.status === 200) {
        console.log("update Commodity Inward Report res", response);

        if (
          (Number(dataState?.status?.status_code) === 2 &&
            dataState?.l2_user?.id === loginData?.userDetails?.id) ||
          (Number(dataState?.status?.status_code) === 5 &&
            dataState?.l3_user?.id === loginData?.userDetails?.id)
        ) {
          assignApproveRejectToMeFunction({
            type: "approved",
            reasons: getValues("remarks"),
          });
        } else {
          toasterAlert(response);
          navigate(`${ROUTE_PATH.COMMODITY_INWARD_REPORT}`);
        }
      }
    } catch (error) {
      CommonToasterAlert(error);
      console.error("Error:", error);
      //   toasterAlert(error);
      console.error("Error:", error);
      //  toasterAlert(error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "CIR Creation Failed.";
      console.log("Error:", errorMessage);
      // toasterAlert({
      //   message: JSON.stringify(errorMessage),
      //   status: 440,
      // });
    }
  };

  // Update CIR Api End

  // Draft CIR Api Start

  // ! commented the unused function...
  // const DraftData = async () => {
  //   try {
  //     if (selectedGatePass.length > 0) {
  //       const data = getValues();
  //       const tempArray = gatePassList
  //         .filter((item, index) => selectedGatePass.includes(index))
  //         .map((item) => item.id);

  //       const finalData = { ...data, gatepass: tempArray, is_draft: true };

  //       const response = await AddCIRAPI(finalData).unwrap();
  //       console.log("add CIR res", response);
  //       if (response.status === 201) {
  //         toasterAlert(response);
  //         navigate("/commodity-inward-report");
  //       }
  //     } else {
  //       toasterAlert({
  //         message: "Please Select GatePass",
  //         status: 440,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     toasterAlert(error);
  //     console.error("Error:", error);
  //     toasterAlert(error);
  //     let errorMessage =
  //       error?.data?.data ||
  //       error?.data?.message ||
  //       error?.data ||
  //       "CIR Creation Failed.";
  //     console.log("Error:", errorMessage);
  //     toasterAlert({
  //       message: JSON.stringify(errorMessage),
  //       status: 440,
  //     });
  //   }
  // };

  // Draft CIR Api End

  // Edit Form Fill Logic Start

  const [warehouse, setWarehouse] = useState({});
  const [chamber, setChamber] = useState({});
  const [client, setClient] = useState({});
  const [commodity, setCommodity] = useState({});
  const [commodityVariety, setCommodityVariety] = useState({});
  const [serviceContract, setServiceContract] = useState({});
  const [supervisor, setSupervisor] = useState({});

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
        gatepass_creation_date: moment(
          details?.gate_pass_date_time_in__date
        ).format("YYYY-MM-DD"),
      };

      console.log(details?.id);

      if (details?.id) {
        console.log("dsf");
        //fetchMarketRate(queryParams);
        console.log(details?.cir__id?.market_rate);
        // setValue("market_rate", details?.cir__id?.market_rate, {
        //   shouldValidate: true,
        // });
      } else {
        fetchMarketRate(queryParams);
      }
      // fetchMarketRate(queryParams);

      console.log(obj);
      setValue("whr_no", details?.cir__id?.whr_no, {
        shouldValidate: false,
      });

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
      //   link: "/commodity-inward-report",
      // },
      {
        title: "Commodity Inward Report",
        link: `${ROUTE_PATH.COMMODITY_INWARD_REPORT}`,
      },
      // {
      //   title: details?.cir__id ? "Edit" : "Add",
      // },
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
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  return (
    <>
      <Box bg="white" borderRadius={10} p="10">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">WHR NO </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("whr_no")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={true}
                      readOnly
                      //  value={inputValue}
                      //  onChange={onChange}

                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="WHR NO"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/*CIR No*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    CIR No{" "}
                    <Box as="span" color="red">
                      *
                    </Box>{" "}
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("cir_no")}
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
                      placeholder="CIR No"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* CIR Date*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    CIR Date{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("cir_creation_date")}
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
                      placeholder="CIR Date"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/*Service contract  No*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Service contract No{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                    value={serviceContract?.id}
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
                </GridItem>
              </Grid>
              {/* Depositor / client Name */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Depositor / client Name{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                  <Text textAlign="right">
                    Warehouse Name{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                  <Text textAlign="right">
                    Chamber name{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                  <Text textAlign="right">
                    Region{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                  <Text textAlign="right">
                    State{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                  <Text textAlign="right">
                    Sub-state{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                  <Text textAlign="right">
                    District{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                    placeholder=" Sub State"
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
                  <Text textAlign="right">
                    Area{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                    placeholder=" Sub State"
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
                  <Text textAlign="right">
                    Warehouse Address{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                  <Text textAlign="right">
                    Commodity name{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                  <Text textAlign="right">
                    Commodity Variety{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
              {/* Agent name */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Agent/Supplier name{" "}
                    <Box as="span" color="red">
                      *
                    </Box>{" "}
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.agent_name}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("agent_name")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // isDisabled={disabledField || InputDisableFunction()}
                      isDisabled={InputDisableFunction()}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Agent/Supplier name"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Table Start */}
              <TableContainer mt="4" id="gate_pass">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      {!details?.cir__id?.id && <Th color="#000">Select</Th>}
                      <Th color="#000">Gate pass No</Th>
                      <Th color="#000">Truck no</Th>
                      <Th color="#000">Weighbridge slip no</Th>
                      <Th color="#000">No of bags</Th>
                      <Th color="#000">Gross weight</Th>
                      <Th color="#000">Tare weight</Th>
                      <Th color="#000">Net weight</Th>
                      <Th color="#000">Avg bag weight(kg)</Th>
                      <Th color="#000">Moisture</Th>
                      <Th color="#000">Action</Th>
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
                          {!details?.cir__id?.id && (
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
                          <Td>{item.truck_no}</Td>
                          <Td>{item.weighbridge_slip_no}</Td>
                          <Td>{item.total_no_of_bags}</Td>
                          <Td>{item.gross_weight_kg}</Td>
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
                                      // navigate(`/edit/gate-pass/${item?.id}`, {
                                      //   state: {
                                      //     details: {
                                      //       id: item?.id,
                                      //     },
                                      //   },
                                      // })

                                      const newTab = window.open(
                                        `${ROUTE_PATH.GATE_PASS_INWARD_EDIT}/${item?.id}?readonly=true`,
                                        "_blank"
                                      );

                                      if (newTab) {
                                        // newTab.document.documentElement.requestFullscreen();
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
                  <Text textAlign="right">
                    Total Net Weight(MT){" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("total_net_weight")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px"}
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
                  <Text textAlign="right">
                    Total No. of Bags{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("total_no_of_bags")}
                      type="number"
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
                      placeholder="Total No. of Bags"
                    />
                  </FormControl>
                </GridItem>
              </Grid>{" "}
              {/*Market Rate / MT*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Market Rate / MT{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.market_rate?.message}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("market_rate")}
                      type="number"
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
                      placeholder="Market Rate / MT"
                    />
                    {errors && errors?.market_rate?.message && (
                      <Box width="full" textAlign="left" color="red" as="p">
                        {errors?.market_rate?.message}
                      </Box>
                    )}
                  </FormControl>
                </GridItem>
              </Grid>{" "}
              {/* Value of Total Commodity*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Value of Total Commodity{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem position="relative" colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("value_of_commodity")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={true}
                      value={(
                        parseFloat(getValues("total_net_weight")) *
                        parseFloat(getValues("market_rate"))
                      ).toFixed(2)}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Value of Total Commodity"
                    />
                  </FormControl>
                  <Box
                    as="small"
                    m="2"
                    left={0}
                    position="absolute"
                    w="full"
                    textAlign="left"
                    color="primary.700"
                  >
                    {numberToWords(
                      parseFloat(getValues("total_net_weight")) *
                        parseFloat(getValues("market_rate"))
                    )}
                  </Box>
                </GridItem>
              </Grid>{" "}
              {/* details?.stage >  1 */}
              {details?.cir__id?.id ? (
                <>
                  {/*Insurance details* Form Start */}
                  <Box mt={10}>
                    <Grid
                      textAlign="right"
                      templateColumns={{
                        base: "repeat(1, 1fr)",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                      }}
                      alignItems="start"
                      gap={4}
                      bgColor={"#DBFFF5"}
                      padding="20px"
                      borderRadius="10px"
                    >
                      {/* sr no  */}
                      <GridItem colSpan={{ base: 1, sm: 2, lg: 3 }}>
                        <Text fontWeight="bold" textAlign="left">
                          Insurance details
                          <span
                            style={{
                              color: "red",
                              marginLeft: "4px",
                            }}
                          >
                            *
                          </span>
                        </Text>
                      </GridItem>
                      {/* Issued by */}
                      <GridItem colSpan={1}>
                        <Text fontWeight="bold" textAlign="left">
                          Issued by{" "}
                          <Box as="span" color="red">
                            *
                          </Box>
                        </Text>
                        <Input
                          //placeholder="Autofilled (GGWPL/Client/Owner/Bank)"
                          type="text"
                          border="1px"
                          name="issued_by"
                          // value={dataState?.service_contract_no?.insurance_by}
                          readOnly
                          // borderColor="gray.10"
                          value={getValues("issued_by")}
                          borderColor={errors?.issued_by ? "red" : "gray.10"}
                          backgroundColor={"white"}
                          // value={stackDetail?.lot_no || ""}
                          // onChange={(e) => {
                          //   setStackDetail((old) => ({
                          //     ...old,
                          //     lot_no: e.target.value,
                          //   }));
                          // }}
                        />
                      </GridItem>
                      {/* Policy type */}
                      <GridItem colSpan={1}>
                        <Text fontWeight="bold" textAlign="left">
                          Policy type{" "}
                          <Box as="span" color="red">
                            *
                          </Box>
                        </Text>
                        <ReactSelect
                          // value={
                          //   selectBoxOptions?.stack?.filter(
                          //     (item) => item.value === stackDetail?.select_stack_no
                          //   )[0] || {}
                          // }
                          // isLoading={getStackMasterApiIsLoading}
                          name="policy_type"
                          onChange={(val) => {
                            setValue("amount", "", {
                              shouldValidate: false,
                            });
                            setSelectedDropdownValue((prev) => ({
                              ...prev,
                              selected_Policy_NO: "",
                            }));
                            setValue("policy_no", "", {
                              shouldValidate: true,
                            });
                            console.log(val);
                            setSelectedDropdownValue((prev) => ({
                              ...prev,
                              selected_Policy_Type: val,
                            }));
                            setValue("policy_type", val, {
                              shouldValidate: true,
                            });
                            console.log(policyNoList);
                            // getCirInsurancePolicy(val?.value);
                          }}
                          isDisabled={InputDisableFunction()}
                          value={selectedDropdownValue?.selected_Policy_Type}
                          options={[
                            {
                              label: "Burglary",
                              value: "burglary",
                            },
                            {
                              label: "Fire",
                              value: "fire",
                            },
                          ]}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#fff",
                              borderRadius: "6px",
                              // borderColor: stackError.select_stack_no
                              //   ? "red"
                              //   : "gray.10",
                              borderColor: errors?.policy_type ? "red" : "#fff",
                              padding: "1px",
                              textAlign: "left",
                            }),
                            ...reactSelectStyle,
                          }}
                        />
                      </GridItem>
                      {/* Policy no. */}
                      <GridItem colSpan={1}>
                        <Text fontWeight="bold" textAlign="left">
                          Policy no{" "}
                          <Box as="span" color="red">
                            *
                          </Box>
                        </Text>
                        <ReactSelect
                          // isLoading={getStackMasterApiIsLoading}
                          isDisabled={InputDisableFunction()}
                          onChange={(val) => {
                            setValue("valid_up_to", val?.valid_up_to, {
                              shouldValidate: true,
                            });
                            setSelectedDropdownValue((prev) => ({
                              ...prev,
                              selected_Policy_NO: val,
                            }));
                            setValue("policy_no", val, {
                              shouldValidate: true,
                            });
                            const obj = {
                              value_Of_Total_Commodity: (
                                parseFloat(getValues("total_net_weight")) *
                                parseFloat(getValues("market_rate"))
                              ).toFixed(2),
                              policy_no: parseFloat(val.label),
                            };
                            if (
                              obj?.value_Of_Total_Commodity < obj?.policy_no
                            ) {
                              setValue("amount", obj.value_Of_Total_Commodity, {
                                shouldValidate: true,
                              });
                            }

                            if (
                              obj?.policy_no < obj?.value_Of_Total_Commodity
                            ) {
                              setValue("amount", obj.policy_no, {
                                shouldValidate: true,
                              });
                            }
                          }}
                          name="policy_no"
                          value={selectedDropdownValue?.selected_Policy_NO}
                          isOptionDisabled={(option) =>
                            option.isDisabled === true
                          }
                          options={
                            selectedDropdownValue?.selected_Policy_Type
                              ?.value === "fire"
                              ? policyNoList?.fire_policy_list
                              : policyNoList?.burglary_policy_list
                          }
                          getOptionLabel={(option) =>
                            ` ${option.policy_number} - ${option.label}`
                          }
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#fff",
                              borderRadius: "6px",
                              borderColor: errors?.policy_no ? "red" : "#fff",

                              // borderColor: stackError.select_stack_no
                              //   ? "red"
                              //   : "gray.10",

                              padding: "1px",
                              textAlign: "left",
                            }),
                            ...reactSelectStyle,
                          }}
                        />
                      </GridItem>
                      {/* Valid up to */}
                      <GridItem colSpan={1}>
                        <Text fontWeight="bold" textAlign="left">
                          Valid up to{" "}
                          <Box as="span" color="red">
                            *
                          </Box>
                        </Text>
                        <Input
                          type="date"
                          id="valid_up_to"
                          name="valid_up_to"
                          {...register("valid_up_to")}
                          border="1px"
                          readOnly
                          //  borderColor="gray.10"
                          borderColor={errors?.valid_up_to ? "red" : "#fff"}
                          backgroundColor={"white"}
                        />
                      </GridItem>

                      {/* Amount (rs.) */}
                      <GridItem colSpan={1}>
                        <Text fontWeight="bold" textAlign="left">
                          Amount (rs.){" "}
                          <Box as="span" color="red">
                            *
                          </Box>
                        </Text>
                        <Input
                          placeholder="Enter Amount"
                          type="number"
                          name="amount"
                          {...register("amount")}
                          isDisabled={InputDisableFunction()}
                          border="1px"
                          readOnly
                          borderColor={errors?.amount ? "red" : "#fff"}
                          backgroundColor={"white"}
                          // value={stackDetail?.lot_no || ""}
                          // onChange={(e) => {
                          //   setStackDetail((old) => ({
                          //     ...old,
                          //     lot_no: e.target.value,
                          //   }));
                          // }}
                        />
                      </GridItem>
                      <GridItem
                        colSpan={{ base: 1, sm: 1, lg: 1 }}
                        alignSelf="end"
                      >
                        <Button
                          type="button"
                          backgroundColor={"primary.700"}
                          _hover={{ backgroundColor: "primary.700" }}
                          color={"white"}
                          borderRadius={"full"}
                          isDisabled={InputDisableFunction()}
                          px={"10"}
                          onClick={() => addUpdateInsuranceDetails()}
                        >
                          {insuranceDetailsEditState?.isEdit ? "Edit" : "Add"}
                        </Button>
                      </GridItem>
                    </Grid>
                  </Box>
                  {/*Insurance details* Form end */}
                  {/*Insurance details* Table Start */}
                  <TableContainer mt="4">
                    <Table color="#000">
                      <Thead bg="#dbfff5" border="1px" borderColor="#000">
                        <Tr style={{ color: "#000" }}>
                          <Th color="#000">Sr no</Th>
                          <Th color="#000">Issued by</Th>
                          <Th color="#000">Policy Type </Th>
                          <Th color="#000">Policy no</Th>
                          <Th color="#000">Valid up to</Th>
                          <Th color="#000">Amount (rs.)</Th>
                          <Th color="#000">Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {insuranceDetailsList &&
                          insuranceDetailsList?.map((item, i) => (
                            <Tr
                              key={`insuranceDetail_${i}`}
                              textAlign="center"
                              bg="white"
                              border="1px"
                              borderColor="#000"
                            >
                              <Td>{i + 1}</Td>
                              <Td>{item?.issued_by}</Td>
                              <Td>{item?.policy_type?.label}</Td>
                              <Td>{item?.policy_no?.policy_number}</Td>
                              <Td>
                                {moment(item?.valid_up_to).format("DD/MM/YYYY")}
                              </Td>
                              <Td>{item?.amount}</Td>

                              <Td>
                                <Box display="flex" alignItems="center" gap="3">
                                  <Flex gap="20px" justifyContent="center">
                                    {/* <Box color={"primary.700"}>
                                      <BiEditAlt
                                        // color="#A6CE39"
                                        fontSize="26px"
                                        cursor="pointer"
                                        onClick={() =>
                                          onEditInsuranceDetail(item, i)
                                        }
                                      />
                                    </Box> */}
                                    <Box color="red">
                                      <Button
                                        color="red"
                                        isDisabled={InputDisableFunction()}
                                        backgroundColor=""
                                      >
                                        <AiOutlineDelete
                                          cursor="pointer"
                                          fontSize="26px"
                                          onClick={() => {
                                            onDeleteInsuranceDetail(i);
                                          }}
                                        />
                                      </Button>
                                    </Box>
                                  </Flex>
                                </Box>
                              </Td>
                            </Tr>
                          ))}
                        {insuranceDetailsList?.length === 0 && (
                          <Tr rowSpan={5} style={{ color: "#000" }}>
                            <Td color="#000">No Data Found</Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  {/*Insurance details* Table end */}
                </>
              ) : (
                <></>
              )}
              {/* Client representative name*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Client representative name{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.client_representative_name}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("client_representative_name")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
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
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.client_representative_mobile_no}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("client_representative_mobile_no")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
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
                      {getFieldState("client_representative_mobile_no")
                        .isDirty &&
                        errors &&
                        errors?.client_representative_mobile_no?.message}
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
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    {(dataState?.client_signature || !details?.cir__id?.id) && (
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
                          type: "cir",
                          subtype: "cir",
                        }}
                        InputDisabled={InputDisableFunction()}
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
                    Upload Id Proof of Client Representative
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }} textAlign={"left"}>
                    <CustomFileInput
                      name={"client_id_proof_path"}
                      placeholder="Agreement upload"
                      label=""
                      type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                      defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                      InputDisabled={InputDisableFunction()}
                      fileuplaod_folder_structure={{
                        type: "cir",
                        subtype: "cir",
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
                  <Text textAlign="right">
                    Upload Authority letter{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }} textAlign={"left"}>
                    <CustomFileInput
                      name={"authority_letter_path"}
                      placeholder="Agreement upload"
                      label=""
                      type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                      defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                      InputDisabled={InputDisableFunction()}
                      fileuplaod_folder_structure={{
                        type: "cir",
                        subtype: "cir",
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
                  <Text textAlign="right">
                    Spillage bag count{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.spilage_bag_count?.message}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("spilage_bag_count")}
                      type="number"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
                      //value={inputValue}
                      //  onChange={onChange}
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
                  {errors &&
                    isDirty?.spilage_bag_count &&
                    errors?.spilage_bag_count?.message && (
                      <Box color="red" textAlign="left" as="p">
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
                  <Text textAlign="right">
                    Supervisor name{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
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
                      isDisabled={true}
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
                  <Text textAlign="right">Remarks </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Textarea
                      {...register("remarks")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
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
                {(Number(dataState?.status?.status_code) < 1 ||
                  !details?.cir__id?.id) && (
                  <Button
                    type="submit"
                    //w="full"
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    borderRadius={"full"}
                    isLoading={addAddCIRAPIApiIsLoading}
                    my={"4"}
                    px={"10"}
                  >
                    Submit
                    {/* {details?.id ? "Update" : "Add"} */}
                  </Button>
                )}

                {(Number(dataState?.status?.status_code) === 1 ||
                  Number(dataState?.status?.status_code) === 3) && (
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

                {((Number(dataState?.status?.status_code) === 2 &&
                  dataState?.l2_user?.id === loginData?.userDetails?.id) ||
                  (Number(dataState?.status?.status_code) === 5 &&
                    dataState?.l3_user?.id === loginData?.userDetails?.id)) && (
                  <>
                    {/* <Button 
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
                    </Button> */}

                    <Button
                      // type="button"
                      type="submit"
                      //w="full"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      isLoading={false}
                      // onClick={() => {
                      //   assignApproveRejectToMeFunction({
                      //     type: "approved",
                      //     reasons: getValues("remarks"),
                      //   });
                      // }}
                      my={"4"}
                      px={"10"}
                    >
                      Approve
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </>
  );
};

export default AddEditCommodityInwardReport;

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
    console.log(status, errorMessage);
    showToastByStatusCode(status, errorMessage);
    return false;
  }
  showToastByStatusCode(status, msg);
};

function validateInsuranceDetailsSchema(formData) {
  console.log(formData);
  const validationSchema = yup.object().shape({
    issued_by: yup.string().required(() => null),

    policy_type: yup
      .object()
      .shape({
        label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
        value: yup.string().required(() => null), // Validate as a number and make it required
      })
      .required(() => null),

    policy_no: yup
      .object()
      .shape({
        label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
        value: yup.number().required(() => null), // Validate as a number and make it required
      })
      .required(() => null),

    valid_up_to: yup.date().required(() => null),
    amount: yup.number().required(() => null),
  });

  try {
    return validationSchema.validateSync(formData, { abortEarly: false });
  } catch (errors) {
    console.log(errors);
    const validationErrors = {};

    errors.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });

    console.log(validationErrors);

    throw validationErrors;
  }
}
