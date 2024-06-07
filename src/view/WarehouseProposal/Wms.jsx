/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
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
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MotionSlideUp } from "../../utils/animation";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import CustomInput from "../../components/Elements/CustomInput";
import {
  useGetBankBranchMasterFreeMutation,
  useGetBankMasterFreeMutation,
  useGetCommodityFreeMasterMutation,
  useGetUserFreeMasterMutation,
} from "../../features/master-api-slice";
import CustomTextArea from "../../components/Elements/CustomTextArea";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import {
  useCalculatePBPMMutation,
  useFetchLocationDrillDownFreeMutation,
  useGetDocumentStatusMutation,
  useGetSecurityGuardDayShiftFreeMutation,
  useGetSecurityGuardNightShiftFreeMutation,
  useGetSupervisorDayShiftFreeMutation,
  useGetSupervisorNightShiftFreeMutation,
  useGetWarehouseProposalDetailsMutation,
  useMinMaxAvgMutation,
  usePostAssignToMeMutation,
  usePutApproveRejectMutation,
  useSaveAsDraftMutation,
} from "../../features/warehouse-proposal.slice";
import ReactSelect from "react-select";
import moment from "moment";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { localStorageService } from "../../services/localStorge.service";
import { removeLastUpdatedUser } from "../../services/common.service";

const commonStyle = {
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

const tableStyle = {
  idWidth: "100px",
  generalPadding: "8px 16px",
  actionWidth: "150px",
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
    "&:hover": {
      //  backgroundColor: "#C2DE8C",
      color: "black",
    },
  }),
};

const templateColumns = {
  base: "repeat(1, 1fr)",
  md: "repeat(2, 1fr)",
  lg: "repeat(3, 1fr)",
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

const formFieldsName = {
  wms_warehouse_details: {
    warehouse_name: "warehouse_name", // done
    region: "region", //done
    state: "state", //done
    substate: "substate", //done
    district: "district", //done
    area: "area", //done
    warehouse_address: "warehouse_address", //done
    warehouse_pincode: "warehouse_pincode", //done
    no_of_chambers: "no_of_chambers", //done
    is_factory_permise: "is_factory_permise", //done
    standard_capacity: "standard_capacity", // done
    currrent_capacity: "currrent_capacity", // done
    currrent_utilised_capacity: "currrent_utilised_capacity", //done
    lock_in_period: "lock_in_period", //done
    lock_in_period_month: "lock_in_period_month", //done
    covered_area: "covered_area", //done
    supervisor_day_shift: "supervisor_day_shift", //done
    supervisor_night_shift: "supervisor_night_shift", //done
    security_guard_day_shift: "security_guard_day_shift", //done
    security_guard_night_shift: "security_guard_night_shift", //done
    is_new_supervisor_day_shift: "is_new_supervisor_day_shift", //done
    is_new_supervisor_night_shift: "is_new_supervisor_night_shift", //done
    is_new_security_guard_day_shift: "is_new_security_guard_day_shift", //done
    is_new_security_guard_night_shift: "is_new_security_guard_night_shift", //done
  },
  wms_commodity_details: {
    expected_commodity: "expected_commodity", //done
    commodity_inward_type: "commodity_inward_type", //done
    prestack_commodity: "prestack_commodity", //done
    prestack_commodity_qty: "prestack_commodity_qty", //done
    is_funding_required: "is_funding_required", //done
    bank: {
      //done
      bank: "bank", //done
      branch: "branch", //done
    },
  },
  wms_commercial_details: {
    owner: {
      warehouse_owner_name: "warehouse_owner_name", //done
      warehouse_owner_contact_no: "warehouse_owner_contact_no", //done
      warehouse_owner_address: "warehouse_owner_address", //done
      rent_amount: "rent_amount", //done
    },
    lessee: {
      warehouse_owner_name: "warehouse_owner_name", //done
      warehouse_owner_contact_no: "warehouse_owner_contact_no", //done
      warehouse_owner_address: "warehouse_owner_address", //done
      rent_amount: "rent_amount", //done
    },
    // min_rent: "min_rent",
    // max_rent: "max_rent",
    // avg_rent: "avg_rent",
    gg_revenue_ratio: "gg_revenue_ratio", // done
    rent: "rent", //done
    total_rent_per_month: "total_rent_per_month", //done
    security_deposit_month: "security_deposit_month",
    security_deposit_amt: "security_deposit_amt", //done
    advance_rent: "advance_rent", //done
    advance_rent_month: "advance_rent_month", //done
    gst: "gst", //done
    commencement_date: "commencement_date", //done
    agreement_period_month: "agreement_period_month", //done
    expiry_date: "expiry_date", //done
    notice_period_month: "notice_period_month", //done
    wms_charges_according_to_commodity: "wms_charges_according_to_commodity", //not found
    projected_file_url: "projected_file_url", //done
  },
  wms_clients_details: {
    client: {
      //not found
      client_type: "client_type", //not found
      client_name: "client_name", //not found
      client_contact_no: "client_contact_no", //not found
      region: "region", //not found
      state: "state", //not found
      substate: "substate", //not found
      district: "district", //not found
      area: "area", //not found
      client_address: "client_address", //not found
      wms_charges: "wms_charges", //not found
      billing_cycle: "billing_cycle", //not found
      // reservation_qty: "reservation_qty", //not found
      // reservation_period: "reservation_period", //not found
      // reservation_start_date: "reservation_start_date", //not found
      // reservation_end_date: "reservation_end_date", //not found
    },
    intention_letter_url: "intention_letter_url", //done
    remarks: "remarks", //done
  },
};

const schema = yup.object().shape({
  id: yup.string(), // hiring id
  warehouse_type: yup.string(),
  warehouse_subtype: yup.string(),
  warehouse_name: yup
    .string()
    .required(() => null)
    .typeError(""),
  region: yup
    .number()
    .required(() => null)
    .typeError(""),
  state: yup
    .string()
    .required(() => null)
    .typeError(""),
  substate: yup
    .string()
    .required(() => null)
    .typeError(""),
  district: yup
    .string()
    .required(() => null)
    .typeError(""),
  area: yup
    .string()
    .required(() => null)
    .typeError(""),
  warehouse_address: yup
    .string()
    .required(() => null)
    .typeError(""),
  warehouse_pincode: yup
    .number()
    .integer("Pin code must be an integer")
    // .transform((value, originalValue) => {
    //   if (originalValue.trim() === "") {
    //     return NaN; // Treat empty input as NaN
    //   }
    //   return value;
    // })
    .min(100000, "Pin code must be at least 6 digits")
    .max(999999, "Pin code cannot be longer than 6 digits")
    .required(() => null)
    .typeError(),
  no_of_chambers: yup
    .number()
    .min(1)
    .required(() => null)
    .typeError(""),
  is_factory_permise: yup
    .string()
    .required(() => null)
    .typeError(""),
  standard_capacity: yup
    .number()
    .min(0)
    .required(() => null)
    .typeError(""),
  currrent_capacity: yup
    .number()
    .min(0)
    .required(() => null)
    .typeError(""),
  currrent_utilised_capacity: yup
    .number()
    .min(0)
    .required(() => null)
    .typeError(""),
  lock_in_period: yup
    .string()
    .required(() => null)
    .typeError(""),
  lock_in_period_month: yup.number().when("lock_in_period", {
    is: (value) => value === "true",
    then: () =>
      yup
        .number()
        .min(0)
        .required(() => null)
        .typeError(""),
    otherwise: () => yup.number().nullable(),
  }),
  covered_area: yup
    .number()
    .min(0)
    .required(() => null)
    .typeError(""),
  supervisor_day_shift: yup
    .string()
    .nullable()
    .test("", "", function (value) {
      const {
        supervisor_night_shift,
        is_new_supervisor_day_shift,
        is_new_supervisor_night_shift,
      } = this.parent;
      if (
        !(
          supervisor_night_shift ||
          is_new_supervisor_day_shift ||
          is_new_supervisor_night_shift
        ) &&
        !value
      ) {
        return this.createError({
          path: "supervisor_day_shift",
          message: "",
        });
      }

      return true;
    }),
  supervisor_night_shift: yup
    .string()
    .nullable()
    .test("isRequired", "", function (value) {
      const {
        supervisor_day_shift,
        is_new_supervisor_day_shift,
        is_new_supervisor_night_shift,
      } = this.parent;
      if (
        !(
          supervisor_day_shift ||
          is_new_supervisor_day_shift ||
          is_new_supervisor_night_shift
        ) &&
        !value
      ) {
        return this.createError({
          // path: "supervisor_night_shift",
          message: "",
        });
      }

      return true;
    }),
  is_new_supervisor_day_shift: yup.string(),
  is_new_supervisor_night_shift: yup.string(),
  security_guard_day_shift: yup
    .string()
    .nullable()
    .test("isRequired", "", function (value) {
      const {
        security_guard_night_shift,
        is_new_security_guard_day_shift,
        is_new_security_guard_night_shift,
      } = this.parent;
      if (
        !(
          security_guard_night_shift ||
          is_new_security_guard_day_shift ||
          is_new_security_guard_night_shift
        ) &&
        !value
      ) {
        return this.createError({
          // path: "security_guard_day_shift",
          message: "",
        });
      }

      return true;
    }),
  security_guard_night_shift: yup
    .string()
    .nullable()
    .test("isRequired", "", function (value) {
      const {
        security_guard_day_shift,
        is_new_security_guard_day_shift,
        is_new_security_guard_night_shift,
      } = this.parent;
      if (
        !(
          security_guard_day_shift ||
          is_new_security_guard_day_shift ||
          is_new_security_guard_night_shift
        ) &&
        !value
      ) {
        return this.createError({
          // path: "security_guard_night_shift",
          message: "",
        });
      }

      return true;
    }),
  is_new_security_guard_day_shift: yup.string(),
  is_new_security_guard_night_shift: yup.string(),
  expected_commodity: yup.array().required(""),
  commodity_inward_type: yup.string().required(""),
  prestack_commodity: yup.string().when("commodity_inward_type", {
    is: (value) => value === "PS",
    then: () => yup.string().required(""),
    otherwise: () => yup.string().nullable(),
  }),
  prestack_commodity_qty: yup.number().when("commodity_inward_type", {
    is: (value) => value === "PS",
    then: () =>
      yup
        .number()
        .min(0, "Value must be greater than or equal to 0")
        .required(""),
    otherwise: () => yup.number().nullable(),
  }),
  is_funding_required: yup.string().required(""),
  bank: yup.array().when("is_funding_required", {
    is: (value) => value === "true",
    then: () => yup.array().min(1, "Bank is required"),
    otherwise: () => yup.array().nullable(),
  }),
  owner: yup
    .array()
    .min(1, "Owner is required")
    .of(
      yup.object().shape({
        warehouse_owner_name: yup.string().required(""),
        warehouse_owner_contact_no: yup.string().required(""),
        warehouse_owner_address: yup.string().required(""),
        rent_amount: yup.number().nullable(),
        revenue_sharing_ratio: yup.number().nullable(),
      })
    ),
  lessee: yup.array().of(
    yup.object().shape({
      warehouse_owner_name:
        yup.string() /*.required("Owner name is required")*/,
      warehouse_owner_contact_no:
        yup.string() /*.required("Mobile no is required")*/,
      warehouse_owner_address:
        yup.string() /*.required("Address is required")*/,
      // rent_amount: yup.number().min(0) /*.required("Rent is required")*/,
    })
  ),
  gg_revenue_ratio: yup.number(),
  rent: yup
    .number()
    .min(0)
    .required(() => null)
    .typeError(""),
  total_rent_per_month: yup
    .number()
    .min(0)
    .required(() => null)
    .typeError(""),
  security_deposit_month: yup
    .number()
    .min(0)
    .required(() => null)
    .typeError(""),
  security_deposit_amt: yup
    .number()
    .min(0)
    .required(() => null)
    .typeError(""),
  advance_rent: yup
    .string()
    .required(() => null)
    .typeError(""),
  advance_rent_month: yup.number().when("advance_rent", {
    is: (value) => value === "true",
    then: () => yup.number().min(0).required(""),
    otherwise: () => yup.number(),
  }),
  gst: yup.string().required(""),
  commencement_date: yup.string().required(""),
  agreement_period_month: yup.number().when("lock_in_period", {
    is: (value) => value === "true",
    then: () =>
      yup
        .number()
        .min(yup.ref("lock_in_period_month"))
        .required("")
        .typeError(""),
    otherwise: () => yup.number().min(0).required("").typeError(""),
  }),
  expiry_date: yup.string().required(""),
  notice_period_month: yup
    .number()
    .min(0)
    .required(() => null)
    .typeError(""),
  wms_charges_according_to_commodity: yup.array(),
  projected_file_url: yup.string().required(""),
  client: yup
    .array()
    .min(1, "Client is required")
    .of(
      yup.object().shape({
        client_type: yup.string().required(""),
        client_name: yup.string().required(""),
        client_contact_no: yup.string().required(""),
        client_address: yup.string().required(""),
        wms_charges: yup.string().required(""),
        billing_cycle: yup.string().required(""),
      })
    ),
  intention_letter_url: yup.string().required(""),
  remarks: yup.string() /*.required("remarks is required")*/,
});

const toasterAlert = (obj) => {
  let msg = obj?.message;
  let status = obj?.status;
  if (status === 400) {
    const errorData = obj?.data;
    let errorMessage = "";

    Object.keys(errorData)?.forEach((key) => {
      const messages = errorData[key];
      console.log("messages --> ", messages);
      messages &&
        messages?.forEach((message) => {
          errorMessage += `${key} : ${message} \n`;
        });
    });
    showToastByStatusCode(status, errorMessage);
    return false;
  }
  showToastByStatusCode(status, msg);
};

// const subType = "Leased";

const mobileNumberRegex = /^\+91\d{10}$/;
const chargesRegex = /^(?!-)\d*\.?\d+$/;
const Wms = ({ id, view, type, subType }) => {
  const navigate = useNavigate();

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    community: [],
    banks: [],
    branch: [],
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      agreement_period_month: 11,
      advance_rent: "false",
      is_factory_permise: "false",
      is_funding_required: "false",
      lock_in_period: "false",
      bank: [],
      rent: 0,
      total_rent_per_month: 0,
      security_deposit_month: 0,
      security_deposit_amt: 0,
      client: [],
      gg_revenue_ratio: subType.label === "Revenue sharing" ? 100 : 0,
    },
  });

  const { setValue, getValues, formState } = methods;

  // first accordion function start

  // Region State  Zone District Area  onChange drill down api start //

  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownFreeMutation();

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

      setSelectBoxOptions((prev) => ({
        ...prev,
        regions: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const regionOnChange = async (val) => {
    console.log("value --> ", val);
    setValue(formFieldsName.wms_warehouse_details.region, val?.value, {
      shouldValidate: true,
    });

    setValue(formFieldsName.wms_warehouse_details.state, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.wms_warehouse_details.substate, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.wms_warehouse_details.district, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.wms_warehouse_details.area, null, {
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

      setSelectBoxOptions((prev) => ({
        ...prev,
        states: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stateOnChange = async (val) => {
    console.log("value --> ", val);
    setValue(formFieldsName.wms_warehouse_details.state, val?.value, {
      shouldValidate: true,
    });

    setValue(formFieldsName.wms_warehouse_details.substate, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.wms_warehouse_details.district, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.wms_warehouse_details.area, null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues(formFieldsName.wms_warehouse_details.region),
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

      setSelectBoxOptions((prev) => ({
        ...prev,
        substate: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const zoneOnChange = async (val) => {
    console.log("value --> ", val);
    setValue(formFieldsName.wms_warehouse_details.substate, val?.value, {
      shouldValidate: true,
    });

    setValue(formFieldsName.wms_warehouse_details.district, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.wms_warehouse_details.area, null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues(formFieldsName.wms_warehouse_details.region),
      state: getValues(formFieldsName.wms_warehouse_details.state),
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

      setSelectBoxOptions((prev) => ({
        ...prev,
        districts: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const districtOnChange = async (val) => {
    console.log("value --> ", val);
    setValue(formFieldsName.wms_warehouse_details.district, val?.value, {
      shouldValidate: true,
    });

    setValue(formFieldsName.wms_warehouse_details.area, null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues(formFieldsName.wms_warehouse_details.region),
      state: getValues(formFieldsName.wms_warehouse_details.state),
      substate: getValues(formFieldsName.wms_warehouse_details.substate),
      district: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      console.log("fetchLocationDrillDown response :", response);

      const arr = response?.area
        ?.filter((item) => item.area_name !== "All - Area")
        .map(({ area_name, id }) => ({
          label: area_name,
          value: id,
        }));

      setSelectBoxOptions((prev) => ({
        ...prev,
        areas: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const areaOnChange = (val) => {
    setValue(formFieldsName.wms_warehouse_details.area, val?.value, {
      shouldValidate: true,
    });
  };

  // Region State  Zone District Area  onChange drill down api end //

  // hire api start

  const [
    getSupervisorDayShift,
    { isLoading: getSupervisorDayShiftApiIsLoading },
  ] = useGetSupervisorDayShiftFreeMutation();

  const [
    getSupervisorNightShift,
    { isLoading: getSupervisorNightShiftApiIsLoading },
  ] = useGetSupervisorNightShiftFreeMutation();

  const [
    getSecurityGuardDayShift,
    { isLoading: getSecurityGuardDayShiftApiIsLoading },
  ] = useGetSecurityGuardDayShiftFreeMutation();

  const [
    getSecurityGuardNightShift,
    { isLoading: getSecurityGuardNightShiftApiIsLoading },
  ] = useGetSecurityGuardNightShiftFreeMutation();

  const fetchSupervisorDayShift = async () => {
    try {
      const response = await getSupervisorDayShift(getValues("area")).unwrap();
      console.log("Success 123:", response?.data);

      const optionsArray = response?.data?.map(
        ({ employee_name, user_id, count, chamber_count }) => ({
          value: user_id,
          label: employee_name,
          WH: count,
          GD: chamber_count,
        })
      );

      console.log("superVisorDayShiftOpt --> ", optionsArray);

      setSelectBoxOptions((prev) => ({
        ...prev,
        superVisorDayShiftOpt: optionsArray,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // useEffect(() => {
  //   console.log("ddddddddddd", selectBoxOptions?.superVisorDayShiftOpt);
  // }, [selectBoxOptions?.superVisorDayShiftOpt]);

  const fetchSupervisorNightShift = async () => {
    try {
      const response = await getSupervisorNightShift(
        getValues("area")
      ).unwrap();
      console.log("Success:", response);

      const optionsArray = response?.data?.map(
        ({ employee_name, user_id, count, chamber_count }) => ({
          value: user_id,
          label: employee_name,
          WH: count,
          GD: chamber_count,
        })
      );

      setSelectBoxOptions((prev) => ({
        ...prev,
        superVisorNightShiftOpt: optionsArray,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchSecurityGuardDayShift = async () => {
    try {
      const response = await getSecurityGuardDayShift(
        getValues("area")
      ).unwrap();
      console.log("Success:", response);

      const optionsArray = response?.data?.map(
        ({ employee_name, user_id, count, chamber_count }) => ({
          value: user_id,
          label: employee_name,
          WH: count,
          GD: chamber_count,
        })
      );

      setSelectBoxOptions((prev) => ({
        ...prev,
        securityGuardDayShiftOpt: optionsArray,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchSecurityGuardNightShift = async () => {
    try {
      const response = await getSecurityGuardNightShift(
        getValues("area")
      ).unwrap();
      console.log("Success:", response);

      const optionsArray = response?.data?.map(
        ({ employee_name, user_id, count, chamber_count }) => ({
          value: user_id,
          label: employee_name,
          WH: count,
          GD: chamber_count,
        })
      );

      setSelectBoxOptions((prev) => ({
        ...prev,
        securityGuardNightShiftOpt: optionsArray,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (getValues("area")) {
      fetchSupervisorDayShift();
      fetchSupervisorNightShift();
      fetchSecurityGuardDayShift();
      fetchSecurityGuardNightShift();
    }
  }, [getValues("area")]);

  // hire api end

  // first accordion function end

  // second accordion function start

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

  const CommodityInwardType = [
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
  ];

  // bank add logic start

  const {
    fields: bank_details_fields,
    append: add_new_bank_detail,
    remove: remove_bank_detail,
  } = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "bank",
  });

  const [bankDetail, setBankDetail] = useState({
    bank: "",
    branch: "",
  });

  const [bankError, setBankError] = useState({
    bank: "",
    branch: "",
  });

  const BankErrorFunction = () => {
    setBankError({
      bank: bankDetail.bank !== "" ? "" : "Bank can not be empty.",
      branch:
        bankDetail.branch !== ""
          ? getValues(`bank`).filter(
              (item) => item.branch === bankDetail.branch
            ).length === 0
            ? ""
            : "Branch has been already selected."
          : "Branch can not be empty.",
    });
  };

  const append_new_bank_details = () => {
    if (
      bankDetail.bank !== "" &&
      bankDetail.branch !== "" &&
      getValues(`bank`).filter((item) => item.branch === bankDetail.branch)
        .length === 0
    ) {
      add_new_bank_detail({
        bank: bankDetail.bank,
        branch: bankDetail.branch,
      });
      setBankDetail({
        bank: "",
        branch: "",
      });
      setBankError({
        bank: "",
        branch: "",
      });
    } else {
      BankErrorFunction();
    }
  };

  const [updateBankFlag, setUpdateBankFlag] = useState(null);

  const updateBankFlagFunction = (data, id) => {
    setUpdateBankFlag(id);
    setBankDetail({
      bank: data.bank,
      branch: data.branch,
    });
  };

  const UpdateBankDetail = () => {
    if (
      bankDetail.bank !== "" &&
      bankDetail.branch !== "" &&
      getValues(`bank`)
        .filter((item, index) => index !== updateBankFlag)
        .filter((item) => item.branch === bankDetail.branch).length === 0
    ) {
      const tempArr = getValues(`bank`);
      setValue(
        `bank`,
        [
          ...tempArr.slice(0, updateBankFlag),
          {
            bank: bankDetail.bank,
            branch: bankDetail.branch,
          },
          ...tempArr.slice(updateBankFlag + 1),
        ],
        { shouldValidate: true }
      );
      setBankDetail({
        bank: "",
        branch: "",
      });
      setUpdateBankFlag(null);
      setBankError({
        bank: "",
        branch: "",
      });
    } else {
      BankErrorFunction();
    }
  };

  // bank add logic end

  // second accordion function end

  // third accordion function start

  const InternalTypeOptions = [
    {
      label: "Lease",
      value: "Lease",
    },
    {
      label: "Sub Leased",
      value: "Sub Leased",
    },
  ];

  const [internalType, setInternalType] = useState("Lease");

  useEffect(() => {
    if (fillLessee) {
      setFillLessee(false);
    } else {
      setValue(`lessee`, [], { shouldValidate: true });
      if (subType.label === "Revenue sharing") {
        if (internalType === "Sub Leased") {
          setValue(`gg_revenue_ratio`, 100, { shouldValidate: true });
        } else {
          setValue(
            `gg_revenue_ratio`,
            100 -
              getValues("owner")?.reduce(
                (total, item) =>
                  Number(total) + Number(item.revenue_sharing_ratio),
                0
              ) || 0,
            { shouldValidate: true }
          );
        }
      }
    }
  }, [internalType]);

  // Owner Detail Functions start //

  const {
    fields: owner,
    append: add_warehouse_owner_detail,
    remove: remove_warehouse_owner_detail,
  } = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "owner",
  });

  const [ownerDetail, setOwnerDetail] = useState({
    name: "",
    mobile: "",
    address: "",
    ratio: "",
    warehouse_owner_id: null,
    rent: 0,
  });

  useEffect(() => {
    if (internalType === "Sub Leased") {
      setOwnerDetail((old) => ({ ...old, rent: 0, ratio: 0 }));
    }
  }, [internalType]);

  const [ownerError, setOwnerError] = useState({
    name: "",
    mobile: "",
    address: "",
    rent: "",
  });

  const [updateOwnerFlag, setUpdateOwnerFlag] = useState(null);

  const WarehouseDetailClear = () => {
    setOwnerDetail({
      name: "",
      mobile: "",
      address: "",
      warehouse_owner_id: null,
      rent: 0,
      ratio: internalType !== "Sub Leased" ? "" : 0,
    });
  };

  const WarehouseErrorClear = (key) => {
    if (key) {
      setOwnerError((old) => ({ ...old, [key]: "" }));
    } else {
      setOwnerError({
        name: "",
        mobile: "",
        address: "",
        rent: "",
        ratio: "",
      });
    }
  };

  const WarehouseErrorFunction = () => {
    setOwnerError({
      name: ownerDetail.name !== "" ? "" : "Name can not be empty.",
      mobile:
        ownerDetail.mobile !== ""
          ? mobileNumberRegex.test(ownerDetail.mobile)
            ? ""
            : "Please add a valid number"
          : "error",

      address: ownerDetail.address !== "" ? "" : "Address can not be empty.",
      rent:
        subType.label === "Revenue sharing"
          ? ""
          : internalType !== "Sub Leased" && !RentLimiterFunction()
          ? "Rent can not exceed Total Rent Value"
          : ownerDetail.rent !== ""
          ? ""
          : "error",
      ratio:
        subType.label === "Revenue sharing" && !RatioLimiterFunction()
          ? "Ratio can not exceed 100%."
          : "",
    });
  };

  const RentLimiterFunction = () => {
    const result =
      subType.label === "Revenue sharing"
        ? true
        : internalType === "Sub Leased"
        ? true
        : getValues("owner").reduce(
            (total, item) => Number(total) + Number(item.rent_amount),
            0
          ) +
            Number(ownerDetail.rent) <=
          Number(getValues("total_rent_per_month")) +
            Number(
              updateOwnerFlag !== null
                ? getValues(`owner[${updateOwnerFlag}].rent_amount`)
                : 0
            );
    return result;
  };

  const RatioLimiterFunction = () => {
    const result =
      subType.label === "Revenue sharing"
        ? getValues("owner").reduce(
            (total, item) => Number(total) + Number(item.revenue_sharing_ratio),
            0
          ) +
            Number(ownerDetail.ratio) <=
          100 +
            +Number(
              updateOwnerFlag !== null
                ? getValues(`owner[${updateOwnerFlag}].revenue_sharing_ratio`)
                : 0
            )
        : true;

    return result;
  };

  const append_new_warehouse_owner_details = () => {
    if (
      ownerDetail.name !== "" &&
      ownerDetail.mobile !== "" &&
      ownerDetail.address !== "" &&
      ownerDetail.rent !== "" &&
      RatioLimiterFunction() &&
      RentLimiterFunction() &&
      mobileNumberRegex.test(ownerDetail.mobile)
    ) {
      add_warehouse_owner_detail(
        subType.label === "Revenue sharing"
          ? {
              warehouse_owner_name: ownerDetail.name,
              warehouse_owner_contact_no: ownerDetail.mobile,
              warehouse_owner_address: ownerDetail.address,
              revenue_sharing_fix_amount: ownerDetail.rent,
              revenue_sharing_ratio: ownerDetail.ratio,
              warehouse_owner_id: ownerDetail.warehouse_owner_id,
            }
          : {
              warehouse_owner_name: ownerDetail.name,
              warehouse_owner_contact_no: ownerDetail.mobile,
              warehouse_owner_address: ownerDetail.address,
              rent_amount: ownerDetail.rent,
              warehouse_owner_id: ownerDetail.warehouse_owner_id,
            }
      );
      if (internalType !== "Sub Leased") {
        if (subType.label === "Revenue sharing") {
          setValue(
            `gg_revenue_ratio`,
            100 -
              getValues("owner").reduce(
                (total, item) =>
                  Number(total) + Number(item.revenue_sharing_ratio),
                0
              ),
            { shouldValidate: true }
          );
        }
      }
      WarehouseErrorClear();
      WarehouseDetailClear();
    } else {
      WarehouseErrorFunction();
    }
  };

  const updateOwnerFlagFunction = (data, id) => {
    setUpdateOwnerFlag(id);
    setOwnerDetail({
      name: data.warehouse_owner_name,
      mobile: data.warehouse_owner_contact_no,
      address: data.warehouse_owner_address,
      rent:
        subType.label !== "Revenue sharing"
          ? data.rent_amount
          : data.revenue_sharing_fix_amount,
      ratio: data.revenue_sharing_ratio,
      warehouse_owner_id: data.warehouse_owner_id,
    });
  };

  const UpdateOwnerDetail = () => {
    if (
      ownerDetail.name !== "" &&
      ownerDetail.mobile !== "" &&
      ownerDetail.address !== "" &&
      ownerDetail.rent !== "" &&
      RatioLimiterFunction() &&
      RentLimiterFunction() &&
      mobileNumberRegex.test(ownerDetail.mobile)
    ) {
      const tempArr = getValues(`owner`);
      setValue(
        `owner`,
        [
          ...tempArr.slice(0, updateOwnerFlag),
          subType.label === "Revenue sharing"
            ? {
                warehouse_owner_name: ownerDetail.name,
                warehouse_owner_contact_no: ownerDetail.mobile,
                warehouse_owner_address: ownerDetail.address,
                revenue_sharing_fix_amount: ownerDetail.rent,
                revenue_sharing_ratio: ownerDetail.ratio,
                warehouse_owner_id: ownerDetail.warehouse_owner_id,
              }
            : {
                warehouse_owner_name: ownerDetail.name,
                warehouse_owner_contact_no: ownerDetail.mobile,
                warehouse_owner_address: ownerDetail.address,
                rent_amount: ownerDetail.rent,
                warehouse_owner_id: ownerDetail.warehouse_owner_id,
              },
          ...tempArr.slice(updateOwnerFlag + 1),
        ],
        { shouldValidate: true }
      );
      if (internalType !== "Sub Leased") {
        if (subType.label === "Revenue sharing") {
          setValue(
            `gg_revenue_ratio`,
            100 -
              getValues("owner").reduce(
                (total, item) =>
                  Number(total) + Number(item.revenue_sharing_ratio),
                0
              ),
            { shouldValidate: true }
          );
        }
      }
      WarehouseErrorClear();
      setUpdateOwnerFlag(null);
      WarehouseDetailClear();
    } else {
      WarehouseErrorFunction();
    }
  };

  // Owner Detail Functions end //

  // Lessee Detail Functions start //

  const {
    fields: lessee,
    append: add_lessee_detail,
    remove: remove_lessee_detail,
  } = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "lessee",
  });

  const [lesseeDetail, setLesseeDetail] = useState({
    name: "",
    mobile: "",
    address: "",
    ratio: "",
    rent: 0,
    warehouse_owner_id: null,
  });

  const [lesseeError, setLesseeError] = useState({
    name: "",
    mobile: "",
    address: "",
    ratio: "",
    rent: "",
  });

  const [updateLesseeFlag, setUpdateLesseeFlag] = useState(null);

  const LesseeDetailClear = () => {
    setLesseeDetail({
      name: "",
      mobile: "",
      address: "",
      ratio: "",
      rent: 0,
      warehouse_owner_id: null,
    });
  };

  const LesseeErrorClear = (key) => {
    if (key) {
      setLesseeError((old) => ({ ...old, [key]: "" }));
    } else {
      setLesseeError({
        name: "",
        mobile: "",
        address: "",
        ratio: "",
        rent: "",
      });
    }
  };

  const LesseeErrorFunction = () => {
    setLesseeError({
      name: lesseeDetail.name !== "" ? "" : "Name can not be empty.",
      mobile:
        lesseeDetail.mobile !== ""
          ? mobileNumberRegex.test(lesseeDetail.mobile)
            ? ""
            : "Please add a valid number"
          : "error",
      address: lesseeDetail.address !== "" ? "" : "Address can not be empty.",
      rent:
        subType.label === "Revenue sharing"
          ? ""
          : internalType === "Sub Leased" && !RentLesseeLimiterFunction()
          ? "Rent can not exceed Total Rent Value"
          : lesseeDetail.rent !== ""
          ? ""
          : "error",
      ratio:
        subType.label === "Revenue sharing" && !RatioLesseeLimiterFunction()
          ? "Ratio can not exceed 100%."
          : "",
    });
  };

  const RentLesseeLimiterFunction = () => {
    const result =
      subType.label === "Revenue sharing"
        ? true
        : internalType === "Sub Leased"
        ? getValues("lessee").reduce(
            (total, item) => Number(total) + Number(item.rent_amount),
            0
          ) +
            Number(lesseeDetail.rent) <=
          Number(getValues("total_rent_per_month")) +
            Number(
              updateLesseeFlag !== null
                ? getValues(`lessee[${updateLesseeFlag}].rent_amount`)
                : 0
            )
        : true;

    return result;
  };

  const RatioLesseeLimiterFunction = () => {
    const result =
      subType.label === "Revenue sharing"
        ? getValues("lessee").reduce(
            (total, item) => Number(total) + Number(item.revenue_sharing_ratio),
            0
          ) +
            Number(lesseeDetail.ratio) <=
          100 +
            +Number(
              updateOwnerFlag !== null
                ? getValues(`lessee[${updateOwnerFlag}].revenue_sharing_ratio`)
                : 0
            )
        : true;

    return result;
  };

  const append_new_lessee_details = () => {
    if (
      lesseeDetail.name !== "" &&
      lesseeDetail.mobile !== "" &&
      lesseeDetail.address !== "" &&
      lesseeDetail.rent !== "" &&
      RentLesseeLimiterFunction() &&
      RatioLesseeLimiterFunction() &&
      mobileNumberRegex.test(lesseeDetail.mobile)
    ) {
      add_lessee_detail(
        subType.label === "Revenue sharing"
          ? {
              lessee_name: lesseeDetail.name,
              lessee_contact_no: lesseeDetail.mobile,
              lessee_address: lesseeDetail.address,
              revenue_sharing_fix_amount: lesseeDetail.rent,
              revenue_sharing_ratio: lesseeDetail.ratio,
              warehouse_owner_id: lesseeDetail.warehouse_owner_id,
            }
          : {
              lessee_name: lesseeDetail.name,
              lessee_contact_no: lesseeDetail.mobile,
              lessee_address: lesseeDetail.address,
              rent_amount: lesseeDetail.rent,
              warehouse_owner_id: lesseeDetail.warehouse_owner_id,
            }
      );
      if (internalType === "Sub Leased") {
        if (subType.label === "Revenue sharing") {
          setValue(
            `gg_revenue_ratio`,
            100 -
              getValues("lessee").reduce(
                (total, item) =>
                  Number(total) + Number(item.revenue_sharing_ratio),
                0
              ),
            { shouldValidate: true }
          );
        }
      }
      LesseeErrorClear();
      LesseeDetailClear();
    } else {
      LesseeErrorFunction();
    }
  };

  const updateLesseeFlagFunction = (data, id) => {
    setUpdateLesseeFlag(id);
    setLesseeDetail({
      name: data.lessee_name,
      mobile: data.lessee_contact_no,
      address: data.lessee_address,
      rent:
        subType.label !== "Revenue sharing"
          ? data.rent_amount
          : data.revenue_sharing_fix_amount,
      ratio: data.revenue_sharing_ratio,
      warehouse_owner_id: data.warehouse_owner_id,
    });
  };

  const UpdateLesseeDetail = () => {
    if (
      lesseeDetail.name !== "" &&
      lesseeDetail.mobile !== "" &&
      lesseeDetail.address !== "" &&
      lesseeDetail.rent !== "" &&
      RentLesseeLimiterFunction() &&
      RatioLesseeLimiterFunction() &&
      mobileNumberRegex.test(lesseeDetail.mobile)
    ) {
      const tempArr = getValues(`lessee`);
      setValue(
        `lessee`,
        [
          ...tempArr.slice(0, updateLesseeFlag),
          subType.label === "Revenue sharing"
            ? {
                lessee_name: lesseeDetail.name,
                lessee_contact_no: lesseeDetail.mobile,
                lessee_address: lesseeDetail.address,
                revenue_sharing_fix_amount: lesseeDetail.rent,
                revenue_sharing_ratio: lesseeDetail.ratio,
                warehouse_owner_id: lesseeDetail.warehouse_owner_id,
              }
            : {
                lessee_name: lesseeDetail.name,
                lessee_contact_no: lesseeDetail.mobile,
                lessee_address: lesseeDetail.address,
                rent_amount: lesseeDetail.rent,
                warehouse_owner_id: lesseeDetail.warehouse_owner_id,
              },
          ...tempArr.slice(updateLesseeFlag + 1),
        ],
        { shouldValidate: true }
      );
      if (internalType === "Sub Leased") {
        if (subType.label === "Revenue sharing") {
          setValue(
            `gg_revenue_ratio`,
            100 -
              getValues("lessee").reduce(
                (total, item) =>
                  Number(total) + Number(item.revenue_sharing_ratio),
                0
              ),
            { shouldValidate: true }
          );
        }
      }
      LesseeErrorClear();
      setUpdateLesseeFlag(null);
      LesseeDetailClear();
    } else {
      LesseeErrorFunction();
    }
  };

  // Owner Detail Functions end //

  // min max rent logic start

  const [minMaxAvg] = useMinMaxAvgMutation();

  const [minMaxAvgState, setMinMaxAvgState] = useState({});

  const fetchMinMaxAvg = async (areaId) => {
    try {
      if (areaId) {
        const response = await minMaxAvg(areaId).unwrap();
        console.log("Success:", response);
        if (response.status === 200) {
          setMinMaxAvgState(response?.data);
        }
      } else {
        toasterAlert({
          message: "Select area",
          status: 440,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (getValues("area") !== null && getValues("area") !== undefined) {
      fetchMinMaxAvg(getValues("area"));
    }
  }, [getValues("area")]);

  // min max rent logic end

  const gstOptions = [
    {
      label: "Applicable",
      value: "APPLICABLE",
    },
    {
      label: "Not applicable",
      value: "NOT-APPLICABLE",
    },
  ];

  useEffect(() => {
    if (
      getValues(formFieldsName.wms_commercial_details.security_deposit_month) &&
      getValues(formFieldsName.wms_commercial_details.total_rent_per_month)
    ) {
      setValue(
        formFieldsName.wms_commercial_details.security_deposit_amt,
        getValues(
          formFieldsName.wms_commercial_details.security_deposit_month
        ) *
          getValues(formFieldsName.wms_commercial_details.total_rent_per_month),
        { shouldValidate: true }
      );
    } else {
      setValue(0, { shouldValidate: true });
    }
  }, [
    getValues(formFieldsName.wms_commercial_details.security_deposit_month),
    getValues(formFieldsName.wms_commercial_details.total_rent_per_month),
  ]);

  useEffect(() => {
    if (getValues(formFieldsName.wms_commercial_details.commencement_date)) {
      setValue(
        formFieldsName.wms_commercial_details.expiry_date,
        moment(
          getValues(formFieldsName.wms_commercial_details.commencement_date)
        )
          .add(
            getValues(
              formFieldsName.wms_commercial_details.agreement_period_month
            ),
            "months"
          )
          .format("YYYY-MM-DD"),
        { shouldValidate: true }
      );
    }
  }, [
    getValues(formFieldsName.wms_commercial_details.commencement_date),
    getValues(formFieldsName.wms_commercial_details.agreement_period_month),
  ]);

  // check PBPM logic start

  const [calculatePBPM, { isLoading: calculatePBPMApiIsLoading }] =
    useCalculatePBPMMutation();

  const [pbpmList, setPbpmList] = useState([]);

  const calcPBPM = () => {
    let coveredArea = getValues("covered_area");

    let commodity = getValues("expected_commodity")?.map(
      (item) => item.commodity
    );

    let rent = getValues("rent");

    let state = getValues("state");

    let district = getValues("district");

    let guard = [
      getValues("security_guard_day_shift")
        ? getValues("security_guard_day_shift")
        : "",
      getValues("security_guard_night_shift")
        ? getValues("security_guard_night_shift")
        : "",
      getValues("is_new_security_guard_day_shift") === "true" ? null : "",
      getValues("is_new_security_guard_night_shift") === "true" ? null : "",
    ].filter((item) => item !== "");

    let temp1 = getValues("supervisor_day_shift") ? 1 : 0;
    let temp2 = getValues("supervisor_night_shift") ? 1 : 0;
    let temp3 = getValues("is_new_supervisor_day_shift") === "true" ? 1 : 0;
    let temp4 = getValues("is_new_supervisor_night_shift") === "true" ? 1 : 0;

    let supervisor = temp1 + temp2 + temp3 + temp4;

    let percent =
      subType.label === "Revenue sharing" ? getValues("gg_revenue_ratio") : 0;

    let obj = {
      commodity: commodity,
      covered_area: coveredArea,
      per_sq_rate: rent,
      security_guard: guard,
      supervisor: supervisor,
      pbpm_type: subType.label === "Revenue sharing" ? "revenue" : "leased",
      state: state,
      district: district,
      total_wh_rent_const: percent,
    };

    if (obj?.commodity === undefined) {
      toasterAlert({
        message: "Please select commodity ",
        status: 440,
      });
    } else if (obj?.covered_area === undefined) {
      toasterAlert({
        message: "Please select covered area ",
        status: 440,
      });
    } else if (
      obj?.state === "" ||
      obj?.state === null ||
      obj?.state === undefined
    ) {
      toasterAlert({
        message: "Please select State ",
        status: 440,
      });
    } else if (
      obj?.district === "" ||
      obj?.district === null ||
      obj?.district === undefined
    ) {
      toasterAlert({
        message: "Please Select District ",
        status: 440,
      });
    } else if (obj?.per_sq_rate === undefined) {
      toasterAlert({
        message: "Please select rent ",
        status: 440,
      });
    } else if (obj?.total_wh_rent_const === undefined) {
      toasterAlert({
        message: "Please select owners ",
        status: 440,
      });
    } else {
      fetchPBPM(obj);
    }
  };

  const fetchPBPM = async (obj) => {
    try {
      const response = await calculatePBPM(obj).unwrap();
      console.log("submit  - Success:", response);
      if (response.status === 200) {
        setPbpmList(response?.data);
        console.log("response --> ", response);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "PBPM Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // check PBPM logic end

  // third accordion function end

  // fourth accordion function start

  // client list drill down api start

  const {
    fields: client,
    append: add_client_list,
    remove: remove_client_list,
  } = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "client",
  });

  const clientClientType = [
    {
      label: "Corporate",
      value: "Corporate",
    },
    {
      label: "Retail",
      value: "Retail",
    },
  ];

  const clientBillingCycle = [
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

  const [clientList, setClientList] = useState({
    clientType: "",
    name: "",
    mobile: "",
    address: "",
    charges: "",
    pmtCharges: "",
    billing: "",
  });

  const [clientError, setClientError] = useState({
    clientType: "",
    name: "",
    mobile: "",
    address: "",
    charges: "",
    billing: "",
    pmtCharges: "",
  });

  const [updateClientList, setUpdateClientList] = useState(null);

  const ClientOnChange = (val, key) => {
    setClientList((old) => ({ ...old, [key]: val?.target.value }));
  };

  const ClientSelectOnChange = (val, key) => {
    setClientList((old) => ({ ...old, [key]: val?.value }));
  };

  const ClientListClear = () => {
    setClientList({
      clientType: "",
      name: "",
      mobile: "",
      address: "",
      charges: "",
      billing: "",
      pmtCharges: "",
    });
  };

  const ClientErrorClear = (key) => {
    if (key) {
      setClientError((old) => ({ ...old, [key]: "" }));
    } else {
      setClientError({
        clientType: "",
        name: "",
        mobile: "",
        address: "",
        charges: "",
        billing: "",
        pmtCharges: "",
      });
    }
  };

  const ClientErrorStatus = () => {
    const result =
      clientList.clientType !== "" &&
      clientList.name !== "" &&
      clientList.mobile !== "" &&
      clientList.address !== "" &&
      clientList.charges !== "" &&
      clientList.billing !== "" &&
      clientList.pmtCharges !== "" &&
      chargesRegex.test(clientList.charges) &&
      chargesRegex.test(clientList.pmtCharges) &&
      mobileNumberRegex.test(clientList.mobile);

    return result;
  };

  const ClientErrorFunction = () => {
    setClientError({
      clientType: clientList.clientType === "" ? "error" : "",
      name: clientList.name === "" ? "error" : "",
      mobile:
        clientList.mobile === ""
          ? "error"
          : mobileNumberRegex.test(clientList.mobile)
          ? ""
          : "Please add a valid number",
      address: clientList.address === "" ? "error" : "",
      charges:
        clientList.charges === ""
          ? "error"
          : chargesRegex.test(clientList.charges)
          ? ""
          : "Please add only positive number",
      pmtCharges:
        clientList.pmtCharges === ""
          ? "error"
          : chargesRegex.test(clientList.pmtCharges)
          ? ""
          : "Please add only positive number",
      billing: clientList.billing === "" ? "error" : "",
    });
  };

  const append_client_list = () => {
    if (ClientErrorStatus()) {
      add_client_list({
        client_type: clientList.clientType,
        client_name: clientList.name,
        client_contact_no: clientList.mobile,
        client_address: clientList.address,
        wms_charges: clientList.charges,
        pmt_wms_charges: clientList.pmtCharges,
        billing_cycle: clientList.billing,
      });
      ClientListClear();
      ClientErrorClear();
    } else {
      ClientErrorFunction();
    }
  };

  const updateClientFunction = (data, id) => {
    setUpdateClientList(id);
    setClientList({
      clientType: data.client_type,
      name: data.client_name,
      mobile: data.client_contact_no,
      address: data.client_address,
      charges: data.wms_charges,
      pmtCharges: data.pmt_wms_charges,
      billing: data.billing_cycle,
    });
    ClientErrorClear();
  };

  const UpdateClientListFunction = () => {
    if (ClientErrorStatus()) {
      const tempArr = getValues(`client`);
      setValue(
        `client`,
        [
          ...tempArr.slice(0, updateClientList),
          {
            client_type: clientList.clientType,
            client_name: clientList.name,
            client_contact_no: clientList.mobile,
            client_address: clientList.address,
            wms_charges: clientList.charges,
            pmt_wms_charges: clientList.pmtCharges,
            billing_cycle: clientList.billing,
          },
          ...tempArr.slice(updateClientList + 1),
        ],
        { shouldValidate: true }
      );
      setUpdateClientList(null);
      ClientListClear();
      ClientErrorClear();
    } else {
      ClientErrorFunction();
    }
  };

  // fourth accordion function end

  const [getUserMaster] = useGetUserFreeMasterMutation();

  const getUserList = async () => {
    try {
      const response = await getUserMaster().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          users: response?.data?.map(({ employee_name, id, phone }) => ({
            label: employee_name,
            value: id,
            phone: phone,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [getDocumentStatus] = useGetDocumentStatusMutation();

  const getDocumentStatusMasterList = async () => {
    try {
      const response = await getDocumentStatus().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          status: response?.results.map(({ description, status_code, id }) => ({
            label: description,
            value: id,
            code: status_code,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // client list drill down api end

  // save as draft and onSubmit function start

  const [saveAsDraft, { isLoading: saveAsDraftApiIsLoading }] =
    useSaveAsDraftMutation();

  const onSubmit = async (data) => {
    removeLastUpdatedUser(data);
    const { is_draft, ...formData } = data;
    try {
      if (
        formData?.supervisor_day_shift ||
        formData?.supervisor_night_shift ||
        formData?.is_new_supervisor_day_shift === "true" ||
        formData?.is_new_supervisor_night_shift === "true"
      ) {
        if (
          formData?.supervisor_day_shift &&
          formData?.is_new_supervisor_day_shift === "true"
        ) {
          toasterAlert({
            message: "Please select only one Supervisor Day Option.",
            status: 440,
          });

          return;
        } else if (
          formData?.supervisor_night_shift &&
          formData?.is_new_supervisor_night_shift === "true"
        ) {
          toasterAlert({
            message: "Please select only one Supervisor Night Option.",
            status: 440,
          });

          return;
        }

        console.log("");
      } else {
        toasterAlert({
          message: "Please select any one  Shift of Supervisor ",
          status: 440,
        });

        return;
      }

      if (
        formData?.is_new_security_guard_day_shift === "true" ||
        formData?.is_new_security_guard_night_shift === "true" ||
        formData?.security_guard_day_shift ||
        formData?.security_guard_night_shift
      ) {
        console.log("");
        if (
          formData?.security_guard_day_shift &&
          formData?.is_new_security_guard_day_shift === "true"
        ) {
          toasterAlert({
            message: "Please select only one Security Guard Day Option.",
            status: 440,
          });

          return;
        } else if (
          formData?.security_guard_night_shift &&
          formData?.is_new_security_guard_night_shift === "true"
        ) {
          toasterAlert({
            message: "Please select only one Security Guard Night Option.",
            status: 440,
          });

          return;
        }
      } else {
        toasterAlert({
          message: "Please select any one  Shift of Security Guard ",
          status: 440,
        });

        return;
      }

      if (subType.label !== "Revenue sharing") {
        if (internalType === "Sub Leased") {
          if (getValues("lessee").length > 0) {
            if (
              getValues("lessee").reduce(
                (total, item) => Number(total) + Number(item.rent_amount),
                0
              ) < Number(getValues("total_rent_per_month"))
            ) {
              toasterAlert({
                message:
                  "Lessee Total Rent is not equal to Total rent per month",
                status: 440,
              });

              return;
            }
          } else {
            toasterAlert({
              message: "Please add Lessee Details",
              status: 440,
            });

            return;
          }
        } else {
          if (
            getValues("owner").reduce(
              (total, item) => Number(total) + Number(item.rent_amount),
              0
            ) < Number(getValues("total_rent_per_month"))
          ) {
            toasterAlert({
              message: "Owner Total Rent is not equal to Total rent per month",
              status: 440,
            });
            return;
          }
        }
      } else {
        if (internalType === "Sub Leased") {
          if (getValues("lessee")?.length > 0) {
          } else {
            toasterAlert({
              message: "Please add Lessee Details",
              status: 440,
            });

            return;
          }
        }
      }

      const response = await saveAsDraft({
        ...formData,
        is_draft: false,
      }).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        if (Number(filledData?.status?.status_code || 0) < 1) {
          toasterAlert({
            message: "Hiring Form Submitted Successfully.",
            status: 200,
          });
          navigate("/hiring-proposal-master");
        } else {
          ApproveRejectFunction({ status: "approved" });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Hiring Form Submission Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  console.log(getValues("lessee"), "lessee");

  const [assignToMe, { isLoading: assignToMeApiIsLoading }] =
    usePostAssignToMeMutation();

  const AssignToMeFunction = async () => {
    try {
      const response = await assignToMe({ id_list: [id] }).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        toasterAlert({
          message: "Assign Successfully.",
          status: 200,
        });
        // navigate("/hiring-proposal-master");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
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

  const [rejectReason, setRejectReason] = useState(undefined);

  const [rejectError, setRejectError] = useState(false);

  const [approveReject, { isLoading: approveRejectApiIsLoading }] =
    usePutApproveRejectMutation();

  const ApproveRejectFunction = async ({ status }) => {
    try {
      console.log(status, "here");
      console.log(getValues(), "ApproveRejectFunction");
      if (status !== "rejected") {
        const dataObj = getValues();
        removeLastUpdatedUser(dataObj);
        const { is_draft, ...formData } = dataObj;
        await saveAsDraft({
          ...formData,
          is_draft: false,
        }).unwrap();
      }
      const response = await approveReject({
        id: id,
        status: status,
        inspection_assigned_to: undefined,
        reason: status === "rejected" ? rejectReason : undefined,
      }).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);

        toasterAlert({
          message:
            status === "rejected"
              ? "Hiring Proposal rejected successfully"
              : "Hiring Proposal approved successfully",
          status: 200,
        });
        navigate("/hiring-proposal-master");
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        status !== "rejected"
          ? "Approval Request Failed."
          : "Rejection Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const saveAsDraftData = async (type) => {
    try {
      let data = {
        is_draft: true,
        id: getValues("id"),
        warehouse_type: getValues("warehouse_type"),
        warehouse_subtype: getValues("warehouse_subtype"),
        ...getValues(),
      };

      removeLastUpdatedUser(data);

      // if (type === "WMS_WAREHOUSE_DETAILS") {
      //   data = {
      //     is_draft: true,
      //     id: getValues("id"),
      //     warehouse_type: getValues("warehouse_type"),
      //     warehouse_subtype: getValues("warehouse_subtype"),
      //     warehouse_name: getValues("warehouse_name"),
      //     region: getValues("region"),
      //     state: getValues("state"),
      //     substate: getValues("substate"),
      //     district: getValues("district"),
      //     area: getValues("area"),
      //     warehouse_address: getValues("warehouse_address"),
      //     warehouse_pincode: getValues("warehouse_pincode"),
      //     no_of_chambers: getValues("no_of_chambers"),
      //     is_factory_permise: getValues("is_factory_permise"),
      //     standard_capacity: getValues("standard_capacity"),
      //     currrent_capacity: getValues("currrent_capacity"),
      //     currrent_utilised_capacity: getValues("currrent_utilised_capacity"),
      //     lock_in_period: getValues("lock_in_period"),
      //     lock_in_period_month:
      //       getValues("lock_in_period") === "true"
      //         ? getValues("lock_in_period_month")
      //         : null,
      //     covered_area: getValues("covered_area"),
      //     supervisor_day_shift: getValues("supervisor_day_shift"),
      //     is_new_supervisor_day_shift: getValues("is_new_supervisor_day_shift"),
      //     supervisor_night_shift: getValues("supervisor_night_shift"),
      //     is_new_supervisor_night_shift: getValues(
      //       "is_new_supervisor_night_shift"
      //     ),
      //     security_guard_day_shift: getValues("security_guard_day_shift"),
      //     is_new_security_guard_day_shift: getValues(
      //       "is_new_security_guard_day_shift"
      //     ),
      //     security_guard_night_shift: getValues("security_guard_night_shift"),
      //     is_new_security_guard_night_shift: getValues(
      //       "is_new_security_guard_night_shift"
      //     ),
      //   };

      //   console.log("WMS_WAREHOUSE_DETAILS @@ --> ", data);
      // } else if (type === "WMS_COMMODITY_DETAILS") {
      //   data = {
      //     is_draft: true,
      //     id: getValues("id"),
      //     warehouse_type: getValues("warehouse_type"),
      //     warehouse_subtype: getValues("warehouse_subtype"),
      //     expected_commodity: getValues("expected_commodity"),
      //     commodity_inward_type: getValues("commodity_inward_type"),
      //     prestack_commodity:
      //       getValues("commodity_inward_type") === "PS"
      //         ? getValues("prestack_commodity")
      //         : null,
      //     prestack_commodity_qty:
      //       getValues("commodity_inward_type") === "PS"
      //         ? getValues("prestack_commodity_qty")
      //         : null,
      //     is_funding_required: getValues("is_funding_required"),
      //     bank:
      //       getValues("is_funding_required") === "true"
      //         ? getValues("bank")
      //         : [],
      //   };

      //   console.log("WMS_COMMODITY_DETAILS @@ --> ", data);
      // } else if (type === "WMS_COMMERCIAL_DETAILS") {
      //   data = {
      //     is_draft: true,
      //     id: getValues("id"),
      //     warehouse_type: getValues("warehouse_type"),
      //     warehouse_subtype: getValues("warehouse_subtype"),
      //     owner: getValues("owner"), //done
      //     lessee: getValues("lessee"), //done

      //     // min_rent: getValues("min_rent"),
      //     // max_rent: getValues("max_rent"),
      //     // avg_rent: getValues("avg_rent"),
      //     rent: getValues("rent"),
      //     total_rent_per_month: getValues("total_rent_per_month"),
      //     security_deposit_month: getValues("security_deposit_month"),
      //     security_deposit_amt: getValues("security_deposit_amt"),
      //     advance_rent: getValues("advance_rent"),
      //     advance_rent_month:
      //       getValues("advance_rent") === "true"
      //         ? getValues("advance_rent_month")
      //         : null,
      //     gst: getValues("gst"),
      //     commencement_date: getValues("commencement_date"),
      //     agreement_period_month: getValues("agreement_period_month"),
      //     expiry_date: getValues("expiry_date"),
      //     notice_period_month: getValues("notice_period_month"),
      //     wms_charges_according_to_commodity: getValues(
      //       "wms_charges_according_to_commodity"
      //     ), //not found
      //     projected_file_url: getValues("projected_file_url"),
      //   };

      //   console.log("WMS_COMMERCIAL_DETAILS @@ --> ", data);
      // } else if (type === "WMS_CLIENTS_DETAILS") {
      //   data = {
      //     is_draft: true,
      //     id: getValues("id"),
      //     warehouse_type: getValues("warehouse_type"),
      //     warehouse_subtype: getValues("warehouse_subtype"),
      //     client: getValues("client"), //not found
      //     intention_letter_url: getValues("intention_letter_url"), //not found
      //     remarks: getValues("remarks"), //not found
      //   };

      //   console.log("WMS_CLIENTS_DETAILS @@ --> ", data);
      // }

      const response = await saveAsDraft(data).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        setValue("id", response?.data?.id || null, { shouldValidate: true });
        toasterAlert({
          message: "Save As Draft Successfully",
          status: 200,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Save As Daft Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  useEffect(() => {
    getRegionMasterList();
    getCommodityMasterList();
    getBankMasterList();
    getBranchMasterList();
    getUserList();
    getDocumentStatusMasterList();
    setValue("warehouse_type", type, { shouldValidate: true });
    setValue("warehouse_subtype", subType.value, { shouldValidate: true });
  }, []);

  // save as draft and onSubmit function end

  // edit wms functions start

  const [getWarehouseProposalDetails] =
    useGetWarehouseProposalDetailsMutation();

  const [filledData, setFilledData] = useState({});

  const [fillLessee, setFillLessee] = useState(false);

  function FillFormData(data) {
    console.log(data, "here");
    const DataArr = Object.entries(data)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(([key, index]) => ({
        key: key,
        index: index,
      }));
    console.log(DataArr, "here");
    DataArr.map((item) => {
      console.log("item?.index?.id", item?.index?.id);
      if (item.key === "region") {
        regionOnChange({ value: item?.index?.id || null });
      } else if (item.key === "state") {
        stateOnChange({ value: item?.index?.id || null });
      } else if (item.key === "substate") {
        zoneOnChange({ value: item?.index?.id || null });
      } else if (item.key === "district") {
        districtOnChange({ value: item?.index?.id || null });
      } else if (item.key === "area") {
        areaOnChange({ value: item?.index?.id || null });
      } else if (item.key === "security_guard_day_shift") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "security_guard_night_shift") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "supervisor_day_shift") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "supervisor_night_shift") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "warehouse_type") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "warehouse_subtype") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "prestack_commodity") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "l1_user") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "l2_user") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "client") {
        if (item?.index?.length > 0) {
          const tempClient =
            item?.index?.map((old2) => ({
              ...old2,
              region: old2?.region?.id || null,
              state: old2?.state?.id || null,
              substate: old2?.substate?.id || null,
              district: old2?.district?.id || null,
              area: old2?.area?.id || null,
            })) || [];

          setValue(item.key, tempClient, { shouldValidate: true });
        }
      } else if (item.key === "bank") {
        if (item?.index?.length > 0) {
          const tempBank =
            item?.index?.map((old2) => ({
              ...old2,
              bank: old2?.bank?.id || null,
              branch: old2?.branch?.id || null,
            })) || [];

          setValue(item.key, tempBank, { shouldValidate: true });
        }
      } else if (item.key === "expected_commodity") {
        if (item?.index?.length > 0) {
          const tempCom = item.index;
          const temp = [];

          for (let index = 0; index < tempCom.length; index++) {
            const old = tempCom[index];

            temp.push({
              commodity: old?.commodity?.id,
            });
          }

          setValue(item.key, temp, { shouldValidate: true });
        }
      } else if (item.key === "owner") {
        if (item?.index?.length > 0) {
          const tempOwner =
            item?.index?.map((old2) => ({
              ...old2,
              warehouse_owner_id: old2?.warehouse_owner_id?.id || null,
            })) || [];
          setValue(item.key, tempOwner, { shouldValidate: true });
        }
      } else if (item.key === "lessee") {
        if (item?.index?.length > 0) {
          setInternalType("Sub Leased");
          setFillLessee(true);
          const tempLesse =
            item?.index?.map((old2) => ({
              ...old2,
              warehouse_owner_id: old2?.warehouse_owner_id?.id || null,
            })) || [];
          setValue(item.key, tempLesse, { shouldValidate: true });
        }
      } else if (item.key === "is_funding_required") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "advance_rent") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "is_new_security_guard_day_shift") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "is_new_security_guard_night_shift") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "is_new_supervisor_day_shift") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "is_new_supervisor_night_shift") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "is_factory_permise") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "lock_in_period") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "reason") {
        setRejectReason(item.index);
      } else {
        setValue(item.key, item.index, { shouldValidate: true });
      }
    });
  }

  const fetchWarehouseProposalDetails = async () => {
    try {
      const response = await getWarehouseProposalDetails(id).unwrap();
      console.log("Success:", response);
      if (response?.status === 200) {
        console.log("response?.data --> ", response?.data);
        FillFormData(response?.data || {});
        setFilledData(response?.data || {});
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loginData = localStorageService.get("GG_ADMIN");

  const inputDisableFunction = () => {
    const NotUser =
      Number(filledData?.status?.status_code || 0) === 0
        ? false
        : filledData?.l2_user !== null
        ? filledData?.l2_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : filledData?.l1_user !== null
        ? filledData?.l1_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : true;
    return Number(filledData?.status?.status_code || 0) === 1 ||
      Number(filledData?.status?.status_code || 0) === 3 ||
      Number(filledData?.status?.status_code || 0) === 4 ||
      view ||
      NotUser
      ? true
      : false;
  };

  useEffect(() => {
    if (id) {
      fetchWarehouseProposalDetails();
    }
  }, []);

  useEffect(() => {
    console.log(document.getElementsByTagName("input"), "document");
  }, []);

  // edit wms functions end

  return (
    <Box bg="gray.50" p="0">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box mt="10">
            <Accordion allowMultiple>
              {/* ================ WMS WAREHOUSE DETAILS ================= */}
              <MotionSlideUp duration={0.2 * 0.5} delay={0.1 * 0.5}>
                <AccordionItem>
                  {({ isExpanded }) => (
                    <>
                      <Box>
                        <AccordionButton bg="white" p="4" borderRadius={10}>
                          <Box
                            fontWeight="bold"
                            as="span"
                            flex="1"
                            textAlign="left"
                          >
                            WMS WAREHOUSE DETAILS
                          </Box>
                          {isExpanded ? (
                            <MinusIcon fontSize="12px" />
                          ) : (
                            <AddIcon fontSize="12px" />
                          )}
                        </AccordionButton>

                        <AccordionPanel
                          height={"auto"}
                          bg="white"
                          mt="3"
                          pb={4}
                        >
                          <Box>
                            {/* --------------  Warehouse Name -------------- */}
                            <Box>
                              <Grid
                                textAlign="right"
                                alignItems="start"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Warehouse Name
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomTextArea
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .warehouse_name
                                    }
                                    InputDisable={
                                      inputDisableFunction() ||
                                      filledData?.is_renewal
                                    }
                                    placeholder="Warehouse Name"
                                    type="text"
                                    label=""
                                    style={{ w: "100%" }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- Region -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Region{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .region
                                    }
                                    label=""
                                    isLoading={
                                      fetchLocationDrillDownApiIsLoading
                                    }
                                    selectDisable={
                                      inputDisableFunction() ||
                                      filledData?.is_renewal
                                    }
                                    options={selectBoxOptions?.regions || []}
                                    selectedValue={
                                      selectBoxOptions?.regions?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            formFieldsName.wms_warehouse_details
                                              .region
                                          )
                                      ) || {}
                                    }
                                    isClearable={false}
                                    selectType="label"
                                    style={{ w: "100%" }}
                                    handleOnChange={(val) => {
                                      regionOnChange(val);
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- State -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    State{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.wms_warehouse_details.state
                                    }
                                    label=""
                                    selectDisable={
                                      inputDisableFunction() ||
                                      filledData?.is_renewal
                                    }
                                    options={selectBoxOptions?.states || []}
                                    selectedValue={
                                      selectBoxOptions?.states?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            formFieldsName.wms_warehouse_details
                                              .state
                                          )
                                      ) || {}
                                    }
                                    isClearable={false}
                                    selectType="label"
                                    style={{ w: "100%" }}
                                    isLoading={
                                      fetchLocationDrillDownApiIsLoading
                                    }
                                    handleOnChange={(val) => {
                                      stateOnChange(val);
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- Sub State -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Sub State{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .substate
                                    }
                                    label=""
                                    selectDisable={
                                      inputDisableFunction() ||
                                      filledData?.is_renewal
                                    }
                                    options={selectBoxOptions?.substate || []}
                                    selectedValue={
                                      selectBoxOptions?.substate?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            formFieldsName.wms_warehouse_details
                                              .substate
                                          )
                                      ) || {}
                                    }
                                    isClearable={false}
                                    selectType="label"
                                    isLoading={
                                      fetchLocationDrillDownApiIsLoading
                                    }
                                    style={{ w: "100%" }}
                                    handleOnChange={(val) => {
                                      zoneOnChange(val);
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- District -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    District{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .district
                                    }
                                    label=""
                                    selectDisable={
                                      inputDisableFunction() ||
                                      filledData?.is_renewal
                                    }
                                    options={selectBoxOptions?.districts || []}
                                    selectedValue={
                                      selectBoxOptions?.districts?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            formFieldsName.wms_warehouse_details
                                              .district
                                          )
                                      ) || {}
                                    }
                                    isClearable={false}
                                    selectType="label"
                                    isLoading={
                                      fetchLocationDrillDownApiIsLoading
                                    }
                                    style={{ w: "100%" }}
                                    handleOnChange={(val) => {
                                      districtOnChange(val);
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- Area -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Area{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.wms_warehouse_details.area
                                    }
                                    label=""
                                    selectDisable={
                                      inputDisableFunction() ||
                                      filledData?.is_renewal
                                    }
                                    options={selectBoxOptions?.areas || []}
                                    selectedValue={
                                      selectBoxOptions?.areas?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            formFieldsName.wms_warehouse_details
                                              .area
                                          )
                                      ) || {}
                                    }
                                    isClearable={false}
                                    selectType="label"
                                    isLoading={
                                      fetchLocationDrillDownApiIsLoading
                                    }
                                    style={{ w: "100%" }}
                                    handleOnChange={(val) => {
                                      areaOnChange(val);
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- Warehouse address -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="start"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Warehouse Address{" "}
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
                                <GridItem colSpan={2}>
                                  <CustomTextArea
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .warehouse_address
                                    }
                                    InputDisable={
                                      inputDisableFunction() ||
                                      filledData?.is_renewal
                                    }
                                    placeholder="Warehouse Address"
                                    type="textarea"
                                    label=""
                                    style={{ w: "100%" }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* --------------  Pin Code -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Pin Code{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .warehouse_pincode
                                    }
                                    InputDisabled={
                                      inputDisableFunction() ||
                                      filledData?.is_renewal
                                    }
                                    placeholder="Pin Code"
                                    type="number"
                                    label=""
                                    style={{ w: "100%" }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- No of chamber -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    No Of Chambers{" "}
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
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .no_of_chambers
                                    }
                                    InputDisabled={inputDisableFunction()}
                                    placeholder="No Of Chambers"
                                    step={0.01}
                                    type="number"
                                    label=""
                                    style={{ w: "100%" }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* --------------is_factory_permise radio button -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Warehouse In Factory Premises{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <RadioGroup
                                    p="0"
                                    defaultValue={"false"}
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .is_factory_permise
                                    }
                                    value={
                                      getValues(
                                        formFieldsName.wms_warehouse_details
                                          .is_factory_permise
                                      ) || false
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={(e) => {
                                      setValue(
                                        formFieldsName.wms_warehouse_details
                                          .is_factory_permise,
                                        e,
                                        { shouldValidate: true }
                                      );
                                    }}
                                  >
                                    <Stack spacing={5} direction="row">
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value={"true"}
                                      >
                                        Yes
                                      </Radio>
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value={"false"}
                                      >
                                        No
                                      </Radio>
                                    </Stack>
                                  </RadioGroup>
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* --------------  standard_capacity (in MT)-------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Standard Capacity (in MT){" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .standard_capacity
                                    }
                                    InputDisabled={inputDisableFunction()}
                                    placeholder=" Standard Capacity (in MT)"
                                    type="number"
                                    label=""
                                    step={0.01}
                                    style={{ w: "100%" }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* --------------  currrent_capacity (in MT)-------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Current Warehouse Capacity (in MT){" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .currrent_capacity
                                    }
                                    InputDisabled={inputDisableFunction()}
                                    placeholder="Current Warehouse Capacity (in MT)"
                                    type="number"
                                    label=""
                                    step={0.01}
                                    style={{ w: "100%" }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* --------------  current_Utilizes_capacity (in MT)-------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Current Utilizes Capacity (in MT){" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .currrent_utilised_capacity
                                    }
                                    InputDisabled={inputDisableFunction()}
                                    placeholder="Current Utilizes Capacity (in MT)"
                                    type="number"
                                    label=""
                                    step={0.01}
                                    style={{ w: "100%" }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* --------------lock_in_period radio button -------------- */}{" "}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Lock In Period{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <RadioGroup
                                    p="0"
                                    value={getValues(
                                      formFieldsName.wms_warehouse_details
                                        .lock_in_period
                                    )}
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .lock_in_period
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={(e) => {
                                      setValue(
                                        formFieldsName.wms_warehouse_details
                                          .lock_in_period,
                                        e,
                                        { shouldValidate: true }
                                      );
                                      setValue(
                                        formFieldsName.wms_warehouse_details
                                          .lock_in_period_month,
                                        null,
                                        { shouldValidate: true }
                                      );
                                    }}
                                  >
                                    <Stack spacing={5} direction="row">
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value="true"
                                      >
                                        Yes
                                      </Radio>
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value="false"
                                      >
                                        No
                                      </Radio>
                                    </Stack>
                                  </RadioGroup>
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* --------------  lock_in_period_month------------- */}
                            {getValues(
                              formFieldsName.wms_warehouse_details
                                .lock_in_period
                            ) === "true" ? (
                              <Box mt={commonStyle.mt}>
                                <Grid
                                  textAlign="right"
                                  alignItems="center"
                                  templateColumns="repeat(4, 1fr)"
                                  gap={4}
                                >
                                  <GridItem colSpan={1}>
                                    <Text textAlign="right">
                                      Lock In Period (Month)
                                    </Text>
                                  </GridItem>
                                  <GridItem colSpan={2}>
                                    <CustomInput
                                      name={
                                        formFieldsName.wms_warehouse_details
                                          .lock_in_period_month
                                      }
                                      InputDisabled={inputDisableFunction()}
                                      placeholder="Lock In Period Month"
                                      type="number"
                                      step={0.01}
                                      label=""
                                      style={{ w: "100%" }}
                                    />
                                  </GridItem>
                                </Grid>
                              </Box>
                            ) : (
                              <></>
                            )}
                            {/* --------------  covered_area------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Covered Area (In Sq.Ft){" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_warehouse_details
                                        .covered_area
                                    }
                                    InputDisabled={inputDisableFunction()}
                                    placeholder="Covered Area (In Sq.Ft)"
                                    type="number"
                                    step={0.01}
                                    label=""
                                    style={{ w: "100%" }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- supervisor_day_shift -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Supervisor For day Shift
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <Box
                                    display="flex"
                                    gap="4"
                                    alignItems="center"
                                  >
                                    <ReactCustomSelect
                                      name={
                                        formFieldsName.wms_warehouse_details
                                          .supervisor_day_shift
                                      }
                                      label=""
                                      options={
                                        selectBoxOptions?.superVisorDayShiftOpt ||
                                        []
                                      }
                                      selectDisable={inputDisableFunction()}
                                      selectedValue={
                                        selectBoxOptions?.superVisorDayShiftOpt?.filter(
                                          (item) =>
                                            item.value ===
                                            getValues(
                                              formFieldsName
                                                .wms_warehouse_details
                                                .supervisor_day_shift
                                            )
                                        ) || {}
                                      }
                                      isClearable={true}
                                      selectType="label"
                                      isLoading={
                                        getSupervisorDayShiftApiIsLoading
                                      }
                                      style={{ w: "100%" }}
                                      handleOnChange={(val) => {
                                        //   {
                                        //     "value": 296,
                                        //     "label": "13-12-23 north area supervisor",
                                        //     "WH": 1,
                                        //     "GD": 2
                                        // }
                                        console.log(val);
                                        setValue(
                                          formFieldsName.wms_warehouse_details
                                            .supervisor_day_shift,
                                          val?.value,
                                          { shouldValidate: true }
                                        );
                                      }}
                                    />
                                  </Box>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="left">
                                  <Checkbox
                                    border={"1px grey"}
                                    colorScheme="CheckBoxPrimary"
                                    isChecked={
                                      getValues(
                                        formFieldsName.wms_warehouse_details
                                          .is_new_supervisor_day_shift
                                      ) === "true"
                                        ? true
                                        : false
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={() => {
                                      getValues(
                                        formFieldsName.wms_warehouse_details
                                          .is_new_supervisor_day_shift
                                      ) === "true"
                                        ? setValue(
                                            formFieldsName.wms_warehouse_details
                                              .is_new_supervisor_day_shift,
                                            "false",
                                            { shouldValidate: true }
                                          )
                                        : setValue(
                                            formFieldsName.wms_warehouse_details
                                              .is_new_supervisor_day_shift,
                                            "true",
                                            { shouldValidate: true }
                                          );
                                    }}
                                  >
                                    <Text
                                      color="primary.700"
                                      fontWeight="bold"
                                      textAlign="left"
                                      cursor="pointer"
                                    >
                                      Hire new supervisor
                                    </Text>
                                  </Checkbox>
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- supervisor_night_shift -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Supervisor For night Shift
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="4"
                                  >
                                    <ReactCustomSelect
                                      name={
                                        formFieldsName.wms_warehouse_details
                                          .supervisor_night_shift
                                      }
                                      label=""
                                      selectDisable={inputDisableFunction()}
                                      options={
                                        selectBoxOptions?.superVisorNightShiftOpt ||
                                        []
                                      }
                                      selectedValue={
                                        selectBoxOptions?.superVisorNightShiftOpt?.filter(
                                          (item) =>
                                            item.value ===
                                            getValues(
                                              formFieldsName
                                                .wms_warehouse_details
                                                .supervisor_night_shift
                                            )
                                        ) || {}
                                      }
                                      isClearable={true}
                                      selectType="label"
                                      isLoading={
                                        getSupervisorNightShiftApiIsLoading
                                      }
                                      style={{ w: "100%" }}
                                      handleOnChange={(val) => {
                                        setValue(
                                          formFieldsName.wms_warehouse_details
                                            .supervisor_night_shift,
                                          val?.value,
                                          { shouldValidate: true }
                                        );
                                      }}
                                    />
                                  </Box>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="left">
                                  <Checkbox
                                    border={"1px grey"}
                                    colorScheme="CheckBoxPrimary"
                                    isChecked={
                                      getValues(
                                        formFieldsName.wms_warehouse_details
                                          .is_new_supervisor_night_shift
                                      ) === "true"
                                        ? true
                                        : false
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={() => {
                                      getValues(
                                        formFieldsName.wms_warehouse_details
                                          .is_new_supervisor_night_shift
                                      ) === "true"
                                        ? setValue(
                                            formFieldsName.wms_warehouse_details
                                              .is_new_supervisor_night_shift,
                                            "false",
                                            { shouldValidate: true }
                                          )
                                        : setValue(
                                            formFieldsName.wms_warehouse_details
                                              .is_new_supervisor_night_shift,
                                            "true",
                                            { shouldValidate: true }
                                          );
                                    }}
                                  >
                                    <Text
                                      color="primary.700"
                                      fontWeight="bold"
                                      textAlign="left"
                                      cursor="pointer"
                                    >
                                      Hire new supervisor
                                    </Text>
                                  </Checkbox>
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- security_guard_day_shift -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Security Guard For day shift
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="4"
                                  >
                                    <ReactCustomSelect
                                      name={
                                        formFieldsName.wms_warehouse_details
                                          .security_guard_day_shift
                                      }
                                      label=""
                                      options={
                                        selectBoxOptions?.securityGuardDayShiftOpt ||
                                        []
                                      }
                                      selectDisable={inputDisableFunction()}
                                      selectedValue={
                                        selectBoxOptions?.securityGuardDayShiftOpt?.filter(
                                          (item) =>
                                            item.value ===
                                            getValues(
                                              formFieldsName
                                                .wms_warehouse_details
                                                .security_guard_day_shift
                                            )
                                        ) || {}
                                      }
                                      isClearable={true}
                                      selectType="label"
                                      isLoading={
                                        getSecurityGuardDayShiftApiIsLoading
                                      }
                                      style={{ w: "100%" }}
                                      handleOnChange={(val) => {
                                        setValue(
                                          formFieldsName.wms_warehouse_details
                                            .security_guard_day_shift,
                                          val?.value,
                                          { shouldValidate: true }
                                        );
                                      }}
                                    />
                                  </Box>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="left">
                                  <Checkbox
                                    border={"1px grey"}
                                    colorScheme="CheckBoxPrimary"
                                    isChecked={
                                      getValues(
                                        formFieldsName.wms_warehouse_details
                                          .is_new_security_guard_day_shift
                                      ) === "true"
                                        ? true
                                        : false
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={() => {
                                      getValues(
                                        formFieldsName.wms_warehouse_details
                                          .is_new_security_guard_day_shift
                                      ) === "true"
                                        ? setValue(
                                            formFieldsName.wms_warehouse_details
                                              .is_new_security_guard_day_shift,
                                            "false",
                                            { shouldValidate: true }
                                          )
                                        : setValue(
                                            formFieldsName.wms_warehouse_details
                                              .is_new_security_guard_day_shift,
                                            "true",
                                            { shouldValidate: true }
                                          );
                                    }}
                                  >
                                    <Text
                                      color="primary.700"
                                      fontWeight="bold"
                                      textAlign="left"
                                      cursor="pointer"
                                    >
                                      Hire new security guard
                                    </Text>
                                  </Checkbox>
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- security_guard_night_shift -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Security Guard For night shift
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="4"
                                  >
                                    <ReactCustomSelect
                                      name={
                                        formFieldsName.wms_warehouse_details
                                          .security_guard_night_shift
                                      }
                                      label=""
                                      options={
                                        selectBoxOptions?.securityGuardNightShiftOpt ||
                                        []
                                      }
                                      selectDisable={inputDisableFunction()}
                                      selectedValue={
                                        selectBoxOptions?.securityGuardNightShiftOpt?.filter(
                                          (item) =>
                                            item.value ===
                                            getValues(
                                              formFieldsName
                                                .wms_warehouse_details
                                                .security_guard_night_shift
                                            )
                                        ) || {}
                                      }
                                      isClearable={false}
                                      selectType="label"
                                      isLoading={
                                        getSecurityGuardNightShiftApiIsLoading
                                      }
                                      style={{ w: "100%" }}
                                      handleOnChange={(val) => {
                                        console.log(
                                          "selectedOption @@@@@@@@@@@------> ",
                                          val
                                        );
                                        setValue(
                                          formFieldsName.wms_warehouse_details
                                            .security_guard_night_shift,
                                          val.value,
                                          { shouldValidate: true }
                                        );
                                      }}
                                    />
                                  </Box>
                                </GridItem>
                                <GridItem colSpan={1} textAlign="left">
                                  <Checkbox
                                    border={"1px grey"}
                                    colorScheme="CheckBoxPrimary"
                                    isChecked={
                                      getValues(
                                        formFieldsName.wms_warehouse_details
                                          .is_new_security_guard_night_shift
                                      ) === "true"
                                        ? true
                                        : false
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={() => {
                                      getValues(
                                        formFieldsName.wms_warehouse_details
                                          .is_new_security_guard_night_shift
                                      ) === "true"
                                        ? setValue(
                                            formFieldsName.wms_warehouse_details
                                              .is_new_security_guard_night_shift,
                                            "false",
                                            { shouldValidate: true }
                                          )
                                        : setValue(
                                            formFieldsName.wms_warehouse_details
                                              .is_new_security_guard_night_shift,
                                            "true",
                                            { shouldValidate: true }
                                          );
                                    }}
                                  >
                                    <Text
                                      color="primary.700"
                                      fontWeight="bold"
                                      textAlign="left"
                                      cursor="pointer"
                                    >
                                      Hire new security guard
                                    </Text>
                                  </Checkbox>
                                </GridItem>
                              </Grid>
                            </Box>
                          </Box>

                          {Number(filledData?.status?.status_code || 0) >= 1 ? (
                            <></>
                          ) : (
                            <Box
                              display="flex"
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
                                isDisabled={inputDisableFunction()}
                                my={"4"}
                                px={"10"}
                                isLoading={saveAsDraftApiIsLoading}
                                onClick={() => {
                                  saveAsDraftData("WMS_WAREHOUSE_DETAILS");
                                }}
                              >
                                Save as Draft
                              </Button>
                            </Box>
                          )}
                        </AccordionPanel>
                      </Box>
                    </>
                  )}
                </AccordionItem>
              </MotionSlideUp>

              {/* ================ WMS COMMODITY DETAILS ================= */}
              <MotionSlideUp duration={0.2 * 0.7} delay={0.1 * 0.7}>
                <AccordionItem mt="4">
                  {({ isExpanded }) => (
                    <>
                      <Box>
                        <AccordionButton bg="white" p="4" borderRadius={10}>
                          <Box
                            fontWeight="bold"
                            as="span"
                            flex="1"
                            textAlign="left"
                          >
                            WMS COMMODITY DETAILS
                          </Box>
                          {isExpanded ? (
                            <MinusIcon fontSize="12px" />
                          ) : (
                            <AddIcon fontSize="12px" />
                          )}
                        </AccordionButton>

                        <AccordionPanel bg="white" mt="5" pb={4}>
                          <Box>
                            {/* ================ Expected Commodity Name ================= */}
                            <Box>
                              <Grid
                                textAlign="right"
                                templateColumns="repeat(4, 1fr)"
                                alignItems="center"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Expected Commodity Name{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.wms_commodity_details
                                        .expected_commodity
                                    }
                                    label=""
                                    options={selectBoxOptions?.community || []}
                                    selectDisable={inputDisableFunction()}
                                    selectedValue={
                                      selectBoxOptions?.community?.filter(
                                        (item) =>
                                          getValues(
                                            formFieldsName.wms_commodity_details
                                              .expected_commodity
                                          )?.some(
                                            (old) =>
                                              old.commodity === item.value
                                          )
                                      ) || []
                                    }
                                    isClearable={false}
                                    isMultipleSelect={true}
                                    isLoading={getCommodityMasterApiIsLoading}
                                    style={{ w: "100%" }}
                                    handleOnChange={(val) => {
                                      console.log(
                                        "selectedOption @@@@@@@@@@@------> ",
                                        val
                                      );
                                      const tempArr = val.map((item) => ({
                                        commodity: item.value,
                                      }));
                                      setValue(
                                        formFieldsName.wms_commodity_details
                                          .expected_commodity,
                                        tempArr,
                                        { shouldValidate: true }
                                      );
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>

                            {/* ================ Commodity Inward Type ================= */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                templateColumns="repeat(4, 1fr)"
                                alignItems="center"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Commodity Inward Type
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.wms_commodity_details
                                        .commodity_inward_type
                                    }
                                    label=""
                                    selectDisable={inputDisableFunction()}
                                    options={CommodityInwardType || []}
                                    selectedValue={
                                      CommodityInwardType.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            formFieldsName.wms_commodity_details
                                              .commodity_inward_type
                                          )
                                      )[0] || []
                                    }
                                    isClearable={false}
                                    selectType="label"
                                    isLoading={false}
                                    style={{ w: "100%" }}
                                    handleOnChange={(val) => {
                                      setValue(
                                        formFieldsName.wms_commodity_details
                                          .commodity_inward_type,
                                        val.value,
                                        { shouldValidate: true }
                                      );
                                      setValue(
                                        formFieldsName.wms_commodity_details
                                          .prestack_commodity,
                                        null,
                                        { shouldValidate: true }
                                      );
                                      setValue(
                                        formFieldsName.wms_commodity_details
                                          .prestack_commodity_qty,
                                        null,
                                        { shouldValidate: true }
                                      );
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>

                            {getValues(
                              formFieldsName.wms_commodity_details
                                .commodity_inward_type
                            ) === "PS" ? (
                              <>
                                {/* ================ Pre-Stack Commodity ================= */}
                                <Box mt={commonStyle.mt}>
                                  <Grid
                                    textAlign="right"
                                    templateColumns="repeat(4, 1fr)"
                                    alignItems="center"
                                    gap={4}
                                  >
                                    <GridItem colSpan={1}>
                                      <Text textAlign="right">
                                        Pre-Stack Commodity
                                      </Text>{" "}
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                      <ReactCustomSelect
                                        name={
                                          formFieldsName.wms_commodity_details
                                            .prestack_commodity
                                        }
                                        label=""
                                        options={
                                          selectBoxOptions?.community || []
                                        }
                                        selectDisable={inputDisableFunction()}
                                        selectedValue={
                                          selectBoxOptions?.community?.filter(
                                            (item) =>
                                              item.value ===
                                              getValues(
                                                formFieldsName
                                                  .wms_commodity_details
                                                  .prestack_commodity
                                              )
                                          )[0] || {}
                                        }
                                        isClearable={false}
                                        selectType="label"
                                        isLoading={
                                          getCommodityMasterApiIsLoading
                                        }
                                        style={{ w: "100%" }}
                                        handleOnChange={(val) => {
                                          console.log(
                                            "selectedOption @@@@@@@@@@@------> ",
                                            val
                                          );
                                          setValue(
                                            formFieldsName.wms_commodity_details
                                              .prestack_commodity,
                                            val.value,
                                            { shouldValidate: true }
                                          );
                                        }}
                                      />
                                    </GridItem>
                                  </Grid>
                                </Box>
                                {/* ================ Pre-Stack Commodity Quantity(MT) ================= */}
                                <Box mt={commonStyle.mt}>
                                  <Grid
                                    textAlign="right"
                                    templateColumns="repeat(4, 1fr)"
                                    alignItems="center"
                                    gap={4}
                                  >
                                    <GridItem colSpan={1}>
                                      <Text textAlign="right">
                                        Pre-Stack Commodity Quantity(MT)
                                      </Text>{" "}
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                      <CustomInput
                                        name={
                                          formFieldsName.wms_commodity_details
                                            .prestack_commodity_qty
                                        }
                                        InputDisabled={inputDisableFunction()}
                                        placeholder="Pre-Stack Commodity Quantity(MT)"
                                        type="number"
                                        step={0.01}
                                        label=""
                                        style={{ w: "100%" }}
                                      />
                                    </GridItem>
                                  </Grid>
                                </Box>
                              </>
                            ) : (
                              <></>
                            )}

                            {/* ================ Funding required ================= */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                templateColumns="repeat(4, 1fr)"
                                alignItems="center"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Funding Required{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <RadioGroup
                                    p="0"
                                    value={
                                      getValues(
                                        formFieldsName.wms_commodity_details
                                          .is_funding_required
                                      ) || "false"
                                    }
                                    name={
                                      formFieldsName.wms_commodity_details
                                        .is_funding_required
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={(e) => {
                                      setValue(
                                        formFieldsName.wms_commodity_details
                                          .is_funding_required,
                                        e,
                                        { shouldValidate: true }
                                      );
                                      setValue("bank", [], {
                                        shouldValidate: true,
                                      });
                                    }}
                                  >
                                    <Stack spacing={5} direction="row">
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value="true"
                                      >
                                        Yes
                                      </Radio>
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value="false"
                                      >
                                        No
                                      </Radio>
                                    </Stack>
                                  </RadioGroup>
                                </GridItem>
                              </Grid>
                            </Box>
                          </Box>

                          {/* ================ Bank Details ================= */}
                          {getValues(
                            formFieldsName.wms_commodity_details
                              .is_funding_required
                          ) === "true" ? (
                            <>
                              <Box mt={commonStyle.mt}>
                                <Grid
                                  templateColumns="repeat(12, 1fr)"
                                  alignItems="start"
                                  gap={4}
                                  bgColor={"#DBFFF5"}
                                  padding="20px"
                                  borderRadius="10px"
                                >
                                  <GridItem colSpan={12}>
                                    <Heading
                                      as="h5"
                                      fontSize="lg"
                                      textAlign="left"
                                    >
                                      Bank Details
                                    </Heading>
                                  </GridItem>
                                  <GridItem colSpan={4}>
                                    <Text fontWeight="bold" textAlign="left">
                                      Bank
                                    </Text>
                                    <ReactSelect
                                      options={selectBoxOptions?.banks || []}
                                      value={
                                        selectBoxOptions?.banks?.filter(
                                          (item) =>
                                            item.value === bankDetail.bank
                                        )[0] || {}
                                      }
                                      isDisabled={inputDisableFunction()}
                                      isLoading={getBankMasterApiIsLoading}
                                      onChange={(val) => {
                                        setBankDetail((old) => ({
                                          bank: val.value,
                                          branch: "",
                                        }));
                                        setBankError((old) => ({
                                          ...old,
                                          bank: "",
                                        }));
                                      }}
                                      styles={{
                                        control: (base, state) => ({
                                          ...base,
                                          backgroundColor: "#fff",
                                          borderRadius: "6px",
                                          borderColor: bankError.bank
                                            ? "red"
                                            : "#c3c3c3",

                                          padding: "1px",
                                          textAlign: "left",
                                        }),
                                        ...reactSelectStyle,
                                      }}
                                    />
                                    <Text
                                      color="red"
                                      fontSize="14px"
                                      textAlign="left"
                                    >
                                      {bankError.bank}
                                    </Text>
                                  </GridItem>
                                  <GridItem colSpan={4}>
                                    <Text fontWeight="bold" textAlign="left">
                                      Branch
                                    </Text>
                                    <ReactSelect
                                      options={
                                        selectBoxOptions?.branch?.filter(
                                          (item) =>
                                            item?.bank?.id === bankDetail.bank
                                        ) || []
                                      }
                                      isLoading={
                                        getBankBranchMasterApiIsLoading
                                      }
                                      isDisabled={inputDisableFunction()}
                                      value={
                                        selectBoxOptions?.branch?.filter(
                                          (item) =>
                                            item.value === bankDetail.branch
                                        )[0] || {}
                                      }
                                      onChange={(val) => {
                                        setBankDetail((old) => ({
                                          ...old,
                                          branch: val.value,
                                        }));

                                        setBankError((old) => ({
                                          ...old,
                                          branch: "",
                                        }));
                                      }}
                                      styles={{
                                        control: (base, state) => ({
                                          ...base,
                                          backgroundColor: "#fff",
                                          borderRadius: "6px",
                                          borderColor: bankError.branch
                                            ? "red"
                                            : "#c3c3c3",

                                          padding: "1px",
                                          textAlign: "left",
                                        }),
                                        ...reactSelectStyle,
                                      }}
                                    />
                                    <Text
                                      color="red"
                                      fontSize="14px"
                                      textAlign="left"
                                    >
                                      {bankError.branch}
                                    </Text>
                                  </GridItem>
                                  <GridItem
                                    colSpan={4}
                                    alignSelf="end"
                                    textAlign="right"
                                  >
                                    <Button
                                      type="button"
                                      backgroundColor={"primary.700"}
                                      _hover={{
                                        backgroundColor: "primary.700",
                                      }}
                                      color={"white"}
                                      borderRadius={"full"}
                                      isDisabled={inputDisableFunction()}
                                      px={"10"}
                                      onClick={() => {
                                        updateBankFlag !== null
                                          ? UpdateBankDetail()
                                          : append_new_bank_details();
                                        console.log("here in bank");
                                      }}
                                    >
                                      {updateBankFlag !== null ? "Edit" : "Add"}
                                    </Button>
                                  </GridItem>
                                </Grid>
                              </Box>
                              <Box mt={commonStyle.mt} overflow={"auto"}>
                                <table width="100%">
                                  <thead style={{ background: "#DBFFF5" }}>
                                    <tr>
                                      <th
                                        width={tableStyle.idWidth}
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        No.
                                      </th>
                                      <th
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        Bank Name
                                      </th>
                                      <th
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        Branch Name
                                      </th>
                                      <th
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                        width={tableStyle.actionWidth}
                                      >
                                        Action
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {getValues(`bank`)?.length > 0 ? (
                                      bank_details_fields.map((item, index) => (
                                        <tr>
                                          <td
                                            style={{
                                              padding:
                                                tableStyle.generalPadding,
                                              textAlign: "center",
                                            }}
                                          >
                                            {index + 1}
                                          </td>
                                          <td
                                            style={{
                                              padding:
                                                tableStyle.generalPadding,
                                            }}
                                          >
                                            {selectBoxOptions?.banks?.filter(
                                              (old) => old.value === item.bank
                                            )[0]?.label || item.bank}
                                          </td>
                                          <td
                                            style={{
                                              padding:
                                                tableStyle.generalPadding,
                                            }}
                                          >
                                            {selectBoxOptions?.branch?.filter(
                                              (old) => old.value === item.branch
                                            )[0]?.label || item.branch}
                                          </td>
                                          <td
                                            style={{
                                              padding:
                                                tableStyle.generalPadding,
                                            }}
                                          >
                                            <Flex
                                              gap="20px"
                                              justifyContent="center"
                                            >
                                              <Box color={"primary.700"}>
                                                <BiEditAlt
                                                  // color="#A6CE39"
                                                  fontSize="26px"
                                                  cursor="pointer"
                                                  onClick={() => {
                                                    if (
                                                      !inputDisableFunction()
                                                    ) {
                                                      updateBankFlagFunction(
                                                        item,
                                                        index
                                                      );
                                                    }
                                                  }}
                                                />
                                              </Box>
                                              <Box color="red">
                                                <AiOutlineDelete
                                                  cursor="pointer"
                                                  fontSize="26px"
                                                  onClick={() => {
                                                    if (
                                                      updateBankFlag === null &&
                                                      !inputDisableFunction()
                                                    ) {
                                                      remove_bank_detail(index);
                                                    }
                                                  }}
                                                />
                                              </Box>
                                            </Flex>
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td
                                          style={{
                                            padding: tableStyle.generalPadding,
                                            textAlign: "center",
                                          }}
                                          colSpan={4}
                                        >
                                          No Data Added
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </Box>
                              {formState?.errors?.bank ? (
                                <Text color="red">
                                  {formState?.errors?.bank?.message}
                                </Text>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <></>
                          )}

                          {Number(filledData?.status?.status_code || 0) >= 1 ? (
                            <></>
                          ) : (
                            <Box
                              display="flex"
                              justifyContent="flex-end"
                              mt="10"
                              px="0"
                            >
                              <Button
                                type="button"
                                backgroundColor={"primary.700"}
                                _hover={{ backgroundColor: "primary.700" }}
                                color={"white"}
                                borderRadius={"full"}
                                isDisabled={inputDisableFunction()}
                                isLoading={saveAsDraftApiIsLoading}
                                my={"4"}
                                px={"10"}
                                onClick={() => {
                                  saveAsDraftData("WMS_COMMODITY_DETAILS");
                                }}
                              >
                                Save as Draft
                              </Button>
                            </Box>
                          )}
                        </AccordionPanel>
                      </Box>
                    </>
                  )}
                </AccordionItem>
              </MotionSlideUp>

              {/* ================ WMS COMMERCIAL DETAILS ================= */}
              <MotionSlideUp duration={0.2 * 0.9} delay={0.1 * 0.9}>
                <AccordionItem mt="4">
                  {({ isExpanded }) => (
                    <>
                      <Box>
                        <AccordionButton bg="white" p="4" borderRadius={10}>
                          <Box
                            fontWeight="bold"
                            as="span"
                            flex="1"
                            textAlign="left"
                          >
                            WMS COMMERCIAL DETAILS
                          </Box>
                          {isExpanded ? (
                            <MinusIcon fontSize="12px" />
                          ) : (
                            <AddIcon fontSize="12px" />
                          )}
                        </AccordionButton>

                        <AccordionPanel bg="white" mt="5" pb={4} py="4" px="8">
                          {/* -------------- Proposal Type -------------- */}
                          <Box mt={commonStyle.mt}>
                            <Grid
                              textAlign="right"
                              alignItems="center"
                              templateColumns="repeat(4, 1fr)"
                              gap={4}
                            >
                              <GridItem colSpan={1}>
                                <Text textAlign="right">Proposal Type</Text>{" "}
                              </GridItem>
                              <GridItem colSpan={2}>
                                <ReactCustomSelect
                                  name={""}
                                  label=""
                                  options={InternalTypeOptions || []}
                                  selectedValue={InternalTypeOptions.filter(
                                    (item) => item.value === internalType
                                  )}
                                  selectDisable={inputDisableFunction()}
                                  isClearable={false}
                                  selectType="label"
                                  isLoading={false}
                                  style={{ w: "100%" }}
                                  handleOnChange={(val) => {
                                    setInternalType(val.value);
                                  }}
                                />
                              </GridItem>
                            </Grid>
                          </Box>

                          {/* {/ ================ Warehouse Owner details ================= /} */}
                          <Box mt="10px">
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
                              <GridItem colSpan={{ base: 1, sm: 2, lg: 3 }}>
                                <Text fontWeight="bold" textAlign="left">
                                  Warehouse Owner details
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
                              <GridItem colSpan={1}>
                                <Text fontWeight="bold" textAlign="left">
                                  Owner Name
                                </Text>
                                <Input
                                  placeholder="Owner Name"
                                  value={ownerDetail.name}
                                  type="text"
                                  onChange={(e) => {
                                    setOwnerDetail((old) => ({
                                      ...old,
                                      name: e.target.value,
                                    }));
                                    setOwnerError((old) => ({
                                      ...old,
                                      name: "",
                                    }));
                                  }}
                                  isDisabled={inputDisableFunction()}
                                  style={inputStyle}
                                  border="1px"
                                  borderColor={
                                    ownerError.name ? "red" : "gray.10"
                                  }
                                />
                              </GridItem>
                              <GridItem colSpan={1}>
                                <Text fontWeight="bold" textAlign="left">
                                  Mobile No.
                                </Text>
                                <Input
                                  type="number"
                                  placeholder="Mobile No."
                                  value={
                                    ownerDetail?.mobile?.split("+91")[1]
                                      ? Number(
                                          ownerDetail?.mobile?.split(
                                            "+91"
                                          )[1] || ""
                                        )
                                      : ""
                                  }
                                  isDisabled={inputDisableFunction()}
                                  onChange={(e) => {
                                    setOwnerDetail((old) => ({
                                      ...old,
                                      mobile: "+91" + e.target.value,
                                    }));
                                    console.log(e);
                                    setOwnerError((old) => ({
                                      ...old,
                                      mobile: "",
                                    }));
                                  }}
                                  style={inputStyle}
                                  border="1px"
                                  borderColor={
                                    ownerError.mobile ? "red" : "gray.10"
                                  }
                                />
                                <Text
                                  color="red"
                                  fontSize="14px"
                                  textAlign="left"
                                >
                                  {ownerError.mobile === "error"
                                    ? ""
                                    : ownerError.mobile}
                                </Text>
                              </GridItem>
                              <GridItem colSpan={1}>
                                <Text fontWeight="bold" textAlign="left">
                                  Address
                                </Text>
                                <Textarea
                                  value={ownerDetail.address}
                                  onChange={(e) => {
                                    setOwnerDetail((old) => ({
                                      ...old,
                                      address: e.target.value,
                                    }));
                                    console.log(e);
                                    setOwnerError((old) => ({
                                      ...old,
                                      address: "",
                                    }));
                                  }}
                                  style={inputStyle}
                                  isDisabled={inputDisableFunction()}
                                  rows={1}
                                  border="1px"
                                  borderColor={
                                    ownerError.address ? "red" : "gray.10"
                                  }
                                  placeholder={"Address"}
                                />
                              </GridItem>{" "}
                              {subType.label === "Revenue sharing" ? (
                                <GridItem colSpan={1}>
                                  <Text fontWeight="bold" textAlign="left">
                                    Revenue sharing
                                  </Text>
                                  <Input
                                    type="number"
                                    value={ownerDetail.ratio}
                                    disabled={
                                      internalType === "Sub Leased" ||
                                      inputDisableFunction()
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      setOwnerDetail((old) => ({
                                        ...old,
                                        ratio: e.target.value,
                                      }));
                                      console.log(e);
                                      setOwnerError((old) => ({
                                        ...old,
                                        ratio: "",
                                      }));
                                    }}
                                    style={inputStyle}
                                    border="1px"
                                    borderColor={
                                      ownerError.ratio ? "red" : "gray.10"
                                    }
                                    placeholder={"Revenue sharing ratio(%)"}
                                  />
                                  <Text
                                    color="red"
                                    fontSize="14px"
                                    textAlign="left"
                                  >
                                    {ownerError.ratio === "error"
                                      ? ""
                                      : ownerError.ratio}
                                  </Text>
                                </GridItem>
                              ) : (
                                <></>
                              )}
                              <GridItem colSpan={1}>
                                <Text fontWeight="bold" textAlign="left">
                                  {subType.label === "Revenue sharing"
                                    ? "Min Fixed Amount"
                                    : "Rent"}
                                </Text>
                                <Input
                                  type="number"
                                  value={ownerDetail.rent}
                                  isDisabled={
                                    internalType === "Sub Leased" ||
                                    subType?.label !== "Revenue sharing" ||
                                    inputDisableFunction()
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    setOwnerDetail((old) => ({
                                      ...old,
                                      rent: e.target.value,
                                    }));
                                    console.log(e);
                                    setOwnerError((old) => ({
                                      ...old,
                                      rent: "",
                                    }));
                                  }}
                                  style={inputStyle}
                                  border="1px"
                                  borderColor={
                                    ownerError.rent ? "red" : "gray.10"
                                  }
                                  placeholder={
                                    subType.label === "Revenue sharing"
                                      ? "Min Fixed Amount"
                                      : "Rent"
                                  }
                                />
                              </GridItem>
                              <GridItem colSpan={1} alignSelf="end">
                                <Button
                                  type="button"
                                  backgroundColor={"primary.700"}
                                  _hover={{ backgroundColor: "primary.700" }}
                                  color={"white"}
                                  borderRadius={"full"}
                                  isDisabled={inputDisableFunction()}
                                  px={"10"}
                                  onClick={() => {
                                    updateOwnerFlag !== null
                                      ? UpdateOwnerDetail()
                                      : append_new_warehouse_owner_details();
                                  }}
                                >
                                  {updateOwnerFlag !== null ? "Edit" : "Add"}
                                </Button>
                              </GridItem>
                            </Grid>
                          </Box>

                          <Box mt={commonStyle.mt} overflow={"auto"}>
                            <table width="100%">
                              <thead style={{ background: "#DBFFF5" }}>
                                <tr>
                                  <th
                                    width={tableStyle.idWidth}
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    No.
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Owner Name
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Mobile No.
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Address
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    {subType.label === "Revenue sharing"
                                      ? "Min Fixed Amount"
                                      : "Rent"}
                                  </th>
                                  {subType.label === "Revenue sharing" ? (
                                    <th
                                      style={{
                                        padding: tableStyle.generalPadding,
                                      }}
                                    >
                                      Revenue sharing ratio(%)
                                    </th>
                                  ) : (
                                    <></>
                                  )}
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                    width={tableStyle.actionWidth}
                                  >
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {getValues(`owner`)?.length > 0 ? (
                                  owner.map((item, index) => (
                                    <tr>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                          textAlign: "center",
                                        }}
                                      >
                                        {index + 1}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {item.warehouse_owner_name}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {item.warehouse_owner_contact_no}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {item.warehouse_owner_address}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {subType.label === "Revenue sharing"
                                          ? item.revenue_sharing_fix_amount
                                          : item.rent_amount}
                                      </td>
                                      {subType.label === "Revenue sharing" ? (
                                        <td
                                          style={{
                                            padding: tableStyle.generalPadding,
                                          }}
                                        >
                                          {item.revenue_sharing_ratio}
                                        </td>
                                      ) : (
                                        <></>
                                      )}
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        <Flex
                                          gap="20px"
                                          justifyContent="center"
                                        >
                                          <Box color={"primary.700"}>
                                            <BiEditAlt
                                              // color="#A6CE39"
                                              fontSize="26px"
                                              cursor="pointer"
                                              onClick={() => {
                                                if (!inputDisableFunction()) {
                                                  updateOwnerFlagFunction(
                                                    item,
                                                    index
                                                  );
                                                }
                                              }}
                                            />
                                          </Box>
                                          <Box color="red">
                                            <AiOutlineDelete
                                              cursor="pointer"
                                              fontSize="26px"
                                              onClick={() => {
                                                if (
                                                  updateOwnerFlag === null &&
                                                  !inputDisableFunction()
                                                ) {
                                                  remove_warehouse_owner_detail(
                                                    index
                                                  );
                                                }
                                              }}
                                            />
                                          </Box>
                                        </Flex>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      style={{
                                        padding: tableStyle.generalPadding,
                                        textAlign: "center",
                                      }}
                                      colSpan={6}
                                    >
                                      No Data Added
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </Box>

                          {formState?.errors?.owner ? (
                            <Text color="red">
                              {formState?.errors?.owner?.message}
                            </Text>
                          ) : (
                            <></>
                          )}

                          {internalType === "Sub Leased" ? (
                            <>
                              {/* {/ ================ Lessee details ================= /} */}
                              <Box mt={commonStyle.mt}>
                                <Grid
                                  textAlign="right"
                                  templateColumns="repeat(12, 1fr)"
                                  alignItems="start"
                                  gap={4}
                                  bgColor={"#DBFFF5"}
                                  padding="20px"
                                  borderRadius="10px"
                                >
                                  <GridItem colSpan={12}>
                                    <Text fontWeight="bold" textAlign="left">
                                      Lessee details
                                    </Text>
                                  </GridItem>
                                  <GridItem colSpan={{ base: 6, sm: 6, lg: 2 }}>
                                    <Text fontWeight="bold" textAlign="left">
                                      Lessee Name
                                    </Text>
                                    <Input
                                      value={lesseeDetail.name}
                                      placeholder="Lessee Name"
                                      type="text"
                                      onChange={(e) => {
                                        setLesseeDetail((old) => ({
                                          ...old,
                                          name: e.target.value,
                                        }));
                                        setLesseeError((old) => ({
                                          ...old,
                                          name: "",
                                        }));
                                      }}
                                      isDisabled={inputDisableFunction()}
                                      style={inputStyle}
                                      border="1px"
                                      borderColor={
                                        lesseeError.name ? "red" : "gray.10"
                                      }
                                    />
                                  </GridItem>
                                  <GridItem
                                    colSpan={{ base: 12, sm: 12, lg: 4 }}
                                  >
                                    <Text fontWeight="bold" textAlign="left">
                                      Mobile No.
                                    </Text>
                                    <Input
                                      type="number"
                                      placeholder="Mobile No."
                                      isDisabled={inputDisableFunction()}
                                      value={
                                        lesseeDetail?.mobile?.split("+91")[1]
                                          ? Number(
                                              lesseeDetail?.mobile?.split(
                                                "+91"
                                              )[1] || ""
                                            )
                                          : ""
                                      }
                                      onChange={(e) => {
                                        setLesseeDetail((old) => ({
                                          ...old,
                                          mobile: "+91" + e.target.value,
                                        }));
                                        console.log(e);
                                        setLesseeError((old) => ({
                                          ...old,
                                          mobile: "",
                                        }));
                                      }}
                                      style={inputStyle}
                                      border="1px"
                                      borderColor={
                                        lesseeError.mobile ? "red" : "gray.10"
                                      }
                                    />
                                    <Text
                                      color="red"
                                      fontSize="14px"
                                      textAlign="left"
                                    >
                                      {lesseeError.mobile === "error"
                                        ? ""
                                        : lesseeError.mobile}
                                    </Text>
                                  </GridItem>
                                  <GridItem colSpan={{ base: 6, sm: 6, lg: 2 }}>
                                    <Text fontWeight="bold" textAlign="left">
                                      Address
                                    </Text>
                                    <Textarea
                                      value={lesseeDetail.address}
                                      isDisabled={inputDisableFunction()}
                                      onChange={(e) => {
                                        setLesseeDetail((old) => ({
                                          ...old,
                                          address: e.target.value,
                                        }));
                                        console.log(e);
                                        setLesseeError((old) => ({
                                          ...old,
                                          address: "",
                                        }));
                                      }}
                                      style={inputStyle}
                                      rows={1}
                                      border="1px"
                                      borderColor={
                                        lesseeError.address ? "red" : "gray.10"
                                      }
                                      placeholder={"Address"}
                                    />
                                  </GridItem>{" "}
                                  {subType.label === "Revenue sharing" ? (
                                    <GridItem colSpan={1}>
                                      <Text fontWeight="bold" textAlign="left">
                                        Revenue sharing
                                      </Text>
                                      <Input
                                        type="number"
                                        value={lesseeDetail.ratio}
                                        disabled={
                                          inputDisableFunction() ? true : false
                                        }
                                        onChange={(e) => {
                                          setLesseeDetail((old) => ({
                                            ...old,
                                            ratio: e.target.value,
                                          }));
                                          console.log(e);
                                          setLesseeError((old) => ({
                                            ...old,
                                            ratio: "",
                                          }));
                                        }}
                                        style={inputStyle}
                                        border="1px"
                                        borderColor={
                                          lesseeError.ratio ? "red" : "gray.10"
                                        }
                                        placeholder={"Revenue sharing ratio(%)"}
                                      />
                                      <Text
                                        color="red"
                                        fontSize="14px"
                                        textAlign="left"
                                      >
                                        {lesseeError.ratio === "error"
                                          ? ""
                                          : lesseeError.ratio}
                                      </Text>
                                    </GridItem>
                                  ) : (
                                    <></>
                                  )}
                                  <GridItem colSpan={{ base: 6, sm: 6, lg: 2 }}>
                                    <Text fontWeight="bold" textAlign="left">
                                      {subType.label === "Revenue sharing"
                                        ? "Min Fixed Amount"
                                        : "Rent"}
                                    </Text>
                                    <Input
                                      type="number"
                                      disabled={
                                        subType.label !== "Revenue sharing" ||
                                        inputDisableFunction()
                                          ? true
                                          : false
                                      }
                                      value={lesseeDetail.rent}
                                      onChange={(e) => {
                                        setLesseeDetail((old) => ({
                                          ...old,
                                          rent: e.target.value,
                                        }));
                                        console.log(e);
                                        setLesseeError((old) => ({
                                          ...old,
                                          rent: "",
                                        }));
                                      }}
                                      style={inputStyle}
                                      border="1px"
                                      borderColor={
                                        lesseeError.rent ? "red" : "gray.10"
                                      }
                                      placeholder={
                                        subType.label === "Revenue sharing"
                                          ? "Min Fixed Amount"
                                          : "Rent"
                                      }
                                    />
                                  </GridItem>
                                  <GridItem
                                    colSpan={{ base: 12, sm: 12, lg: 2 }}
                                    alignSelf="end"
                                  >
                                    <Button
                                      type="button"
                                      backgroundColor={"primary.700"}
                                      _hover={{
                                        backgroundColor: "primary.700",
                                      }}
                                      color={"white"}
                                      borderRadius={"full"}
                                      isDisabled={inputDisableFunction()}
                                      px={"10"}
                                      onClick={() => {
                                        updateLesseeFlag !== null
                                          ? UpdateLesseeDetail()
                                          : append_new_lessee_details();
                                        console.log("here in lessee");
                                      }}
                                    >
                                      {updateLesseeFlag !== null
                                        ? "Edit"
                                        : "Add"}
                                    </Button>
                                  </GridItem>
                                </Grid>
                              </Box>

                              <Box mt={commonStyle.mt} overflow={"auto"}>
                                <table width="100%">
                                  <thead style={{ background: "#DBFFF5" }}>
                                    <tr>
                                      <th
                                        width={tableStyle.idWidth}
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        No.
                                      </th>
                                      <th
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        Lessee Name
                                      </th>
                                      <th
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        Mobile No.
                                      </th>
                                      <th
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        Address
                                      </th>
                                      <th
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {subType.label === "Revenue sharing"
                                          ? "Min Fixed Amount"
                                          : "Rent"}
                                      </th>
                                      {subType.label === "Revenue sharing" ? (
                                        <th
                                          style={{
                                            padding: tableStyle.generalPadding,
                                          }}
                                        >
                                          Revenue sharing ratio(%)
                                        </th>
                                      ) : (
                                        <></>
                                      )}
                                      <th
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                        width={tableStyle.actionWidth}
                                      >
                                        Action
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {getValues(`lessee`)?.length > 0 ? (
                                      lessee.map((item, index) => (
                                        <tr>
                                          <td
                                            style={{
                                              padding:
                                                tableStyle.generalPadding,
                                              textAlign: "center",
                                            }}
                                          >
                                            {index + 1}
                                          </td>
                                          <td
                                            style={{
                                              padding:
                                                tableStyle.generalPadding,
                                            }}
                                          >
                                            {item.lessee_name}
                                          </td>
                                          <td
                                            style={{
                                              padding:
                                                tableStyle.generalPadding,
                                            }}
                                          >
                                            {item.lessee_contact_no}
                                          </td>
                                          <td
                                            style={{
                                              padding:
                                                tableStyle.generalPadding,
                                            }}
                                          >
                                            {item.lessee_address}
                                          </td>
                                          <td
                                            style={{
                                              padding:
                                                tableStyle.generalPadding,
                                            }}
                                          >
                                            {subType.label === "Revenue sharing"
                                              ? item.revenue_sharing_fix_amount
                                              : item.rent_amount}
                                          </td>
                                          {subType.label ===
                                          "Revenue sharing" ? (
                                            <td
                                              style={{
                                                padding:
                                                  tableStyle.generalPadding,
                                              }}
                                            >
                                              {item.revenue_sharing_ratio}
                                            </td>
                                          ) : (
                                            <></>
                                          )}
                                          <td
                                            style={{
                                              padding:
                                                tableStyle.generalPadding,
                                            }}
                                          >
                                            <Flex
                                              gap="20px"
                                              justifyContent="center"
                                            >
                                              <Box color={"primary.700"}>
                                                <BiEditAlt
                                                  // color="#A6CE39"
                                                  fontSize="26px"
                                                  cursor="pointer"
                                                  onClick={() => {
                                                    if (
                                                      !inputDisableFunction()
                                                    ) {
                                                      updateLesseeFlagFunction(
                                                        item,
                                                        index
                                                      );
                                                    }
                                                  }}
                                                />
                                              </Box>
                                              <Box color="red">
                                                <AiOutlineDelete
                                                  cursor="pointer"
                                                  fontSize="26px"
                                                  onClick={() => {
                                                    if (
                                                      updateLesseeFlag ===
                                                        null &&
                                                      !inputDisableFunction()
                                                    ) {
                                                      remove_lessee_detail(
                                                        index
                                                      );
                                                    }
                                                  }}
                                                />
                                              </Box>
                                            </Flex>
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td
                                          style={{
                                            padding: tableStyle.generalPadding,
                                            textAlign: "center",
                                          }}
                                          colSpan={6}
                                        >
                                          No Data Added
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </Box>
                            </>
                          ) : (
                            <></>
                          )}

                          <Box>
                            {/* -------------- Go Green revenue sharing ratio-------------- */}
                            {subType.label === "Revenue sharing" ? (
                              <Box w="full">
                                <Grid
                                  // textAlign="right"
                                  alignItems="center"
                                  templateColumns="repeat(4, 1fr)"
                                  justifyContent="flex-start"
                                  gap={4}
                                >
                                  <GridItem colSpan={1}>
                                    <Text textAlign="right">
                                      Go Green revenue sharing ratio{" "}
                                      <span
                                        style={{
                                          color: "red",
                                          marginLeft: "4px",
                                        }}
                                      >
                                        *
                                      </span>
                                    </Text>{" "}
                                  </GridItem>
                                  <GridItem colSpan={2}>
                                    <CustomInput
                                      name={
                                        formFieldsName.wms_commercial_details
                                          .gg_revenue_ratio
                                      }
                                      InputDisabled={true}
                                      placeholder="Go Green revenue sharing ratio"
                                      type="number"
                                      step={0.01}
                                      label=""
                                    />
                                  </GridItem>
                                </Grid>
                              </Box>
                            ) : (
                              <></>
                            )}
                          </Box>

                          <Box>
                            {/* -------------- Rent (per/sq ft/month)-------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 2fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Rent (per/sq ft/month)
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_commercial_details.rent
                                    }
                                    InputDisabled={true}
                                    placeholder="Rent (per/sq ft/month)"
                                    type="number"
                                    label=""
                                    style={{
                                      w: "100%",
                                    }}
                                  />
                                </GridItem>
                                <GridItem colSpan={1}>
                                  <Flex gap={"2"}>
                                    <Text textAlign="center" fontSize="14px">
                                      Min:{" "}
                                      <b>{minMaxAvgState?.min_rent || 0}</b>
                                    </Text>
                                    <Text textAlign="center" fontSize="14px">
                                      Avg:{" "}
                                      <b>{minMaxAvgState?.avg_rent || 0}</b>
                                    </Text>
                                    <Text textAlign="center" fontSize="14px">
                                      Max:{" "}
                                      <b>{minMaxAvgState?.max_rent || 0}</b>
                                    </Text>
                                  </Flex>
                                </GridItem>
                              </Grid>
                            </Box>

                            {/* -------------- Total rent payable (per month) -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 2fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Total rent payable (per month)
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_commercial_details
                                        .total_rent_per_month
                                    }
                                    placeholder="Total rent payable (per month)"
                                    type="number"
                                    label=""
                                    InputDisabled={true}
                                    inputValue={getValues(
                                      formFieldsName.wms_commercial_details
                                        .total_rent_per_month
                                    )}
                                    onChange={(e) => {
                                      setValue(
                                        formFieldsName.wms_commercial_details
                                          .total_rent_per_month,
                                        Math.round(e.target.value),
                                        { shouldValidate: true }
                                      );
                                    }}
                                    style={{
                                      w: "100%",
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>

                            {/* -------------- Security deposit (Month) -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                // textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                justifyContent="flex-start"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Security deposit (Month)
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_commercial_details
                                        .security_deposit_month
                                    }
                                    placeholder="Security deposit(Month)"
                                    type="number"
                                    label=""
                                    inputValue={getValues(
                                      formFieldsName.wms_commercial_details
                                        .security_deposit_month
                                    )}
                                    InputDisabled={true}
                                    onChange={(e) => {
                                      setValue(
                                        formFieldsName.wms_commercial_details
                                          .security_deposit_month,
                                        e.target.value,
                                        { shouldValidate: true }
                                      );
                                    }}
                                    style={{
                                      w: "100%",
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>

                            {/* -------------- Security deposit amount -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                // textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                justifyContent="flex-start"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Security deposit amount
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_commercial_details
                                        .security_deposit_amt
                                    }
                                    inputValue={getValues(
                                      formFieldsName.wms_commercial_details
                                        .security_deposit_amt
                                    )}
                                    placeholder="Security deposit amount"
                                    type="number"
                                    label=""
                                    InputDisabled={true}
                                    style={{
                                      w: "100%",
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>

                            {/* -------------- Advance rent -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                // textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                justifyContent="flex-start"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">Advance rent</Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <RadioGroup
                                    p="0"
                                    isDisabled={true}
                                    defaultValue={"false"}
                                    name={
                                      formFieldsName.wms_commercial_details
                                        .advance_rent
                                    }
                                    onChange={(e) => {
                                      setValue(
                                        formFieldsName.wms_commercial_details
                                          .advance_rent,
                                        e,
                                        { shouldValidate: true }
                                      );
                                      setValue(
                                        formFieldsName.wms_commercial_details
                                          .advance_rent_month,
                                        null,
                                        { shouldValidate: true }
                                      );
                                    }}
                                  >
                                    <Stack spacing={5} direction="row">
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value="true"
                                      >
                                        Yes
                                      </Radio>
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value="false"
                                      >
                                        No
                                      </Radio>
                                    </Stack>
                                  </RadioGroup>
                                </GridItem>
                              </Grid>
                            </Box>

                            {/* -------------- Advance rent(month) -------------- */}
                            {getValues(
                              formFieldsName.wms_commercial_details.advance_rent
                            ) === "true" ? (
                              <Box mt={commonStyle.mt}>
                                <Grid
                                  // textAlign="right"
                                  alignItems="center"
                                  templateColumns="repeat(4, 1fr)"
                                  justifyContent="flex-start"
                                  gap={4}
                                >
                                  <GridItem colSpan={1}>
                                    <Text textAlign="right">
                                      Advance rent(month)
                                    </Text>{" "}
                                  </GridItem>
                                  <GridItem colSpan={2} textAlign="left">
                                    <CustomInput
                                      name={
                                        formFieldsName.wms_commercial_details
                                          .advance_rent_month
                                      }
                                      InputDisabled={true}
                                      placeholder="Advance rent(month)"
                                      type="number"
                                      label=""
                                      style={{
                                        w: "100%",
                                      }}
                                    />
                                  </GridItem>
                                </Grid>
                              </Box>
                            ) : (
                              <></>
                            )}

                            {/* -------------- GST-------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    GST
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.wms_commercial_details.gst
                                    }
                                    label=""
                                    selectDisable={inputDisableFunction()}
                                    options={gstOptions || []}
                                    selectedValue={gstOptions.filter(
                                      (item) => item.value === getValues("gst")
                                    )}
                                    isClearable={false}
                                    selectType="label"
                                    isLoading={false}
                                    style={{ w: "100%" }}
                                    handleOnChange={(val) => {
                                      console.log(
                                        "selectedOption @@@@@@@@@@@------> ",
                                        val
                                      );
                                      setValue(
                                        formFieldsName.wms_commercial_details
                                          .gst,
                                        val.value,
                                        { shouldValidate: true }
                                      );
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>

                            {/* -------------- Commencement Date-------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Commencement Date
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_commercial_details
                                        .commencement_date
                                    }
                                    placeholder="Commencement Date"
                                    InputDisabled={inputDisableFunction()}
                                    type="date"
                                    label=""
                                    inputValue={getValues(
                                      formFieldsName.wms_commercial_details
                                        .commencement_date
                                    )}
                                    onChange={(val) => {
                                      setValue(
                                        formFieldsName.wms_commercial_details
                                          .commencement_date,
                                        val.target.value,
                                        { shouldValidate: true }
                                      );
                                    }}
                                    style={{
                                      w: "100%",
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>

                            {/* -------------- Agreement period (Month)-------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Agreement period (Month)
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_commercial_details
                                        .agreement_period_month
                                    }
                                    placeholder=" Agreement period (Month)"
                                    InputDisabled={inputDisableFunction()}
                                    type="number"
                                    step={0.01}
                                    label=""
                                    inputValue={getValues(
                                      formFieldsName.wms_commercial_details
                                        .agreement_period_month
                                    )}
                                    onChange={(val) => {
                                      setValue(
                                        formFieldsName.wms_commercial_details
                                          .agreement_period_month,
                                        val.target.value,
                                        { shouldValidate: true }
                                      );
                                    }}
                                    style={{
                                      w: "100%",
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>

                            {/* -------------- Expiry Date-------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Expiry Date
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_commercial_details
                                        .expiry_date
                                    }
                                    placeholder="Expiry Date"
                                    type="text"
                                    label=""
                                    inputValue={
                                      getValues(
                                        formFieldsName.wms_commercial_details
                                          .expiry_date
                                      )
                                        ? moment(
                                            getValues(
                                              formFieldsName
                                                .wms_commercial_details
                                                .expiry_date
                                            )
                                          ).format("DD/MM/YYYY")
                                        : ""
                                    }
                                    onChange={() => {}}
                                    InputDisabled={true}
                                    style={{
                                      w: "100%",
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>

                            {/* -------------- Notice period (Month)-------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Notice period (Month)
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.wms_commercial_details
                                        .notice_period_month
                                    }
                                    InputDisabled={inputDisableFunction()}
                                    placeholder="Notice period (Month)"
                                    type="number"
                                    step={0.01}
                                    label=""
                                    style={{
                                      w: "100%",
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>

                            {/* -------------- WMS Charges according to commodity -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="start"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    WMS Charges according to commodity
                                  </Text>
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.wms_commercial_details
                                        .wms_charges_according_to_commodity
                                    }
                                    label=""
                                    isMultipleSelect="true"
                                    options={selectBoxOptions?.community || []}
                                    selectedValue={
                                      selectBoxOptions?.community?.filter(
                                        (item) =>
                                          getValues(
                                            formFieldsName.wms_commodity_details
                                              .expected_commodity
                                          )?.some(
                                            (old) =>
                                              old.commodity === item.value
                                          )
                                      ) || []
                                    }
                                    isClearable={false}
                                    selectType="label"
                                    isLoading={false}
                                    style={{ w: "100%" }}
                                    selectDisable={true}
                                  />
                                </GridItem>
                                <GridItem colSpan={1} textAlign="left">
                                  <Button
                                    type="button"
                                    backgroundColor={"primary.700"}
                                    _hover={{ backgroundColor: "primary.700" }}
                                    color={"white"}
                                    borderRadius={"full"}
                                    isDisabled={inputDisableFunction()}
                                    isLoading={calculatePBPMApiIsLoading}
                                    mt="8px"
                                    px={"10"}
                                    onClick={() => {
                                      calcPBPM();
                                    }}
                                  >
                                    Check PBPM
                                  </Button>
                                </GridItem>
                                {pbpmList?.length > 0 ? (
                                  <>
                                    <GridItem colSpan={1}></GridItem>
                                    <GridItem colSpan={2}>
                                      <Box p="1">
                                        <TableContainer>
                                          <Table
                                            bg="primary.100"
                                            variant="simple"
                                          >
                                            <Thead>
                                              <Tr>
                                                <Th color="#000">
                                                  Commodity Name
                                                </Th>
                                                <Th color="#000">Bag Size</Th>
                                                <Th color="#000">
                                                  Storage rate
                                                </Th>
                                              </Tr>
                                            </Thead>
                                            <Tbody>
                                              {pbpmList?.map((item) => (
                                                <Tr>
                                                  <Td>{item.commodity_name}</Td>
                                                  <Td>{item.bag_size}</Td>
                                                  <Td>
                                                    {item.storage_rate.toFixed(
                                                      2
                                                    )}
                                                  </Td>
                                                </Tr>
                                              ))}
                                            </Tbody>
                                          </Table>
                                        </TableContainer>
                                      </Box>
                                    </GridItem>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </Grid>
                            </Box>

                            {/* -------------- Your projected                 -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Your projected
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomFileInput
                                    name={
                                      formFieldsName.wms_commercial_details
                                        .projected_file_url
                                    }
                                    // placeholder="Warehouse Name"
                                    title="Click to download"
                                    fileuplaod_folder_structure={{
                                      type: "Warehouse",
                                      subtype: "Proposal",
                                    }}
                                    type="text"
                                    InputDisabled={inputDisableFunction()}
                                    label=""
                                    placeholder="Excel upload"
                                    value={getValues(
                                      formFieldsName.wms_commercial_details
                                        .projected_file_url
                                    )}
                                    onChange={(e) => {
                                      setValue(
                                        formFieldsName.wms_commercial_details
                                          .projected_file_url,
                                        e,
                                        { shouldValidate: true }
                                      );
                                    }}
                                    showErr={
                                      formState?.errors?.projected_file_url
                                        ? true
                                        : false
                                    }
                                    style={{
                                      w: "100%",
                                    }}
                                  />
                                  {formState?.errors?.projected_file_url ? (
                                    <Text color="red">
                                      {
                                        formState?.errors?.projected_file_url
                                          ?.message
                                      }
                                    </Text>
                                  ) : (
                                    <></>
                                  )}
                                </GridItem>
                              </Grid>
                            </Box>
                          </Box>

                          {Number(filledData?.status?.status_code || 0) >= 1 ? (
                            <></>
                          ) : (
                            <Box
                              display="flex"
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
                                isDisabled={inputDisableFunction()}
                                isLoading={saveAsDraftApiIsLoading}
                                my={"4"}
                                px={"10"}
                                onClick={() => {
                                  saveAsDraftData("WMS_COMMERCIAL_DETAILS");
                                }}
                              >
                                Save as Draft
                              </Button>
                            </Box>
                          )}
                        </AccordionPanel>
                      </Box>
                    </>
                  )}
                </AccordionItem>
              </MotionSlideUp>

              {/* ================ WMS CLIENTS DETAILS ================= */}
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <AccordionItem mt="4">
                  {({ isExpanded }) => (
                    <>
                      <Box>
                        <AccordionButton bg="white" p="4" borderRadius={10}>
                          <Box
                            fontWeight="bold"
                            as="span"
                            flex="1"
                            textAlign="left"
                          >
                            WMS CLIENTS DETAILS
                          </Box>
                          {isExpanded ? (
                            <MinusIcon fontSize="12px" />
                          ) : (
                            <AddIcon fontSize="12px" />
                          )}
                        </AccordionButton>

                        <AccordionPanel bg="white" mt="5" pb={4}>
                          {/* ================ Client List ================= */}
                          <Box>
                            <Grid
                              templateColumns={{
                                base: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                                lg: "repeat(4, 1fr)",
                              }}
                              alignItems="start"
                              gap={4}
                              bgColor={"#DBFFF5"}
                              padding="20px"
                              borderRadius="10px"
                            >
                              <GridItem
                                colSpan={{ base: 1, sm: 2, md: 3, lg: 4 }}
                              >
                                <Heading as="h5" fontSize="lg" textAlign="left">
                                  Client List
                                  <span
                                    style={{
                                      color: "red",
                                      marginLeft: "4px",
                                    }}
                                  >
                                    *
                                  </span>
                                </Heading>
                              </GridItem>
                              <GridItem>
                                <Text textAlign="left">Client Type</Text>{" "}
                                <ReactSelect
                                  options={clientClientType}
                                  placeholder=" Client Type"
                                  value={
                                    clientClientType?.filter(
                                      (item) =>
                                        item.value === clientList.clientType
                                    )[0] || {}
                                  }
                                  isLoading={false}
                                  isDisabled={inputDisableFunction()}
                                  onChange={(val) => {
                                    ClientSelectOnChange(val, "clientType");
                                  }}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: clientError.clientType
                                        ? "red"
                                        : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),
                                    ...reactSelectStyle,
                                  }}
                                />
                              </GridItem>
                              <GridItem>
                                <Text textAlign="left"> Client Name </Text>{" "}
                                <Input
                                  placeholder="client name"
                                  value={clientList.name}
                                  isDisabled={inputDisableFunction()}
                                  onChange={(val) => {
                                    ClientOnChange(val, "name");
                                  }}
                                  type="text"
                                  style={inputStyle}
                                  border="1px"
                                  borderColor={
                                    clientError.name ? "red" : "gray.10"
                                  }
                                />
                              </GridItem>
                              <GridItem>
                                <Text textAlign="left"> Mobile Number </Text>{" "}
                                <Input
                                  placeholder="mobile number"
                                  type="number"
                                  isDisabled={inputDisableFunction()}
                                  value={
                                    clientList?.mobile?.split("+91")[1]
                                      ? Number(
                                          clientList?.mobile?.split("+91")[1] ||
                                            ""
                                        )
                                      : "" || ""
                                  }
                                  onChange={(val) => {
                                    setClientList((old) => ({
                                      ...old,
                                      mobile: "+91" + val?.target.value,
                                    }));
                                  }}
                                  style={inputStyle}
                                  border="1px"
                                  borderColor={
                                    clientError.mobile ? "red" : "gray.10"
                                  }
                                />
                                <Text
                                  color="red"
                                  fontSize="14px"
                                  textAlign="left"
                                >
                                  {clientError.mobile === "error"
                                    ? ""
                                    : clientError.mobile}
                                </Text>
                              </GridItem>
                              <GridItem>
                                <Text textAlign="left">Billing cycle </Text>{" "}
                                <ReactSelect
                                  placeholder="Billing cycle"
                                  name="clientCycle"
                                  label=""
                                  options={clientBillingCycle}
                                  isDisabled={inputDisableFunction()}
                                  value={
                                    clientBillingCycle?.filter(
                                      (item) =>
                                        item.value === clientList.billing
                                    )[0] || {}
                                  }
                                  isLoading={false}
                                  onChange={(val) => {
                                    console.log(
                                      "selectedOption @@@@@@@@@@@------> ",
                                      val
                                    );
                                    ClientSelectOnChange(val, "billing");
                                  }}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: clientError.billing
                                        ? "red"
                                        : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),
                                    ...reactSelectStyle,
                                  }}
                                />
                              </GridItem>
                              <GridItem colSpan={{ base: 1, sm: 2 }}>
                                <Text textAlign="left"> Address </Text>{" "}
                                <Textarea
                                  placeholder="address"
                                  rows={1}
                                  value={clientList.address}
                                  isDisabled={inputDisableFunction()}
                                  onChange={(val) => {
                                    ClientOnChange(val, "address");
                                  }}
                                  style={inputStyle}
                                  border="1px"
                                  borderColor={
                                    clientError.charges ? "red" : "gray.10"
                                  }
                                />
                              </GridItem>
                              <GridItem>
                                <Text textAlign="left">Fixed WMS charges </Text>{" "}
                                <Input
                                  placeholder="Fixed WMS charges"
                                  type="number"
                                  step={0.01}
                                  value={clientList.charges}
                                  isDisabled={inputDisableFunction()}
                                  onChange={(val) => {
                                    ClientOnChange(val, "charges");
                                  }}
                                  border="1px"
                                  style={inputStyle}
                                  borderColor={
                                    clientError.charges ? "red" : "gray.10"
                                  }
                                />
                                <Text
                                  color="red"
                                  fontSize="14px"
                                  textAlign="left"
                                >
                                  {clientError.charges === "error"
                                    ? ""
                                    : clientError.charges}
                                </Text>
                              </GridItem>
                              <GridItem>
                                <Text textAlign="left"> PMT WMS charges </Text>{" "}
                                <Input
                                  placeholder="PMT WMS charges"
                                  type="number"
                                  step={0.01}
                                  value={clientList.pmtCharges}
                                  isDisabled={inputDisableFunction()}
                                  onChange={(val) => {
                                    ClientOnChange(val, "pmtCharges");
                                  }}
                                  border="1px"
                                  style={inputStyle}
                                  borderColor={
                                    clientError.pmtCharges ? "red" : "gray.10"
                                  }
                                />
                                <Text
                                  color="red"
                                  fontSize="14px"
                                  textAlign="left"
                                >
                                  {clientError.pmtCharges === "error"
                                    ? ""
                                    : clientError.pmtCharges}
                                </Text>
                              </GridItem>
                              <GridItem
                                colSpan={{ base: 1, sm: 2, md: 3, lg: 4 }}
                              >
                                <Flex
                                  gap="10px"
                                  justifyContent="end"
                                  alignItems="center"
                                >
                                  <Button
                                    type="button"
                                    //w="full"
                                    backgroundColor={"primary.700"}
                                    _hover={{
                                      backgroundColor: "primary.700",
                                    }}
                                    isDisabled={inputDisableFunction()}
                                    color={"white"}
                                    borderRadius={"full"}
                                    px={"10"}
                                    onClick={() => {
                                      updateClientList !== null
                                        ? UpdateClientListFunction()
                                        : append_client_list();
                                      console.log("here in client");
                                    }}
                                  >
                                    {updateClientList !== null ? "Edit" : "Add"}
                                  </Button>
                                </Flex>
                              </GridItem>
                            </Grid>
                          </Box>

                          <Box mt={commonStyle.mt} overflow={"auto"}>
                            <table width="100%">
                              <thead style={{ background: "#DBFFF5" }}>
                                <tr>
                                  <th
                                    width={tableStyle.idWidth}
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    No.
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Client Type
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Client Name
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Mobile Number
                                  </th>{" "}
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Billing Cycle
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Address
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Fixed WMS Charges
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    PMT WMS charges
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                    width={tableStyle.actionWidth}
                                  >
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {getValues(`client`)?.length > 0 ? (
                                  client.map((item, index) => (
                                    <tr>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                          textAlign: "center",
                                        }}
                                      >
                                        {index + 1}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {clientClientType?.filter(
                                          (old) =>
                                            old.value === item.client_type
                                        )[0]?.label || item.client_type}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {item.client_name}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {item.client_contact_no}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {clientBillingCycle?.filter(
                                          (old) =>
                                            old.value === item.billing_cycle
                                        )[0]?.label || item.billing_cycle}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {item.client_address}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {item.wms_charges}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {item.pmt_wms_charges}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        <Flex
                                          gap="20px"
                                          justifyContent="center"
                                        >
                                          <Box color={"primary.700"}>
                                            <BiEditAlt
                                              // color="#A6CE39"
                                              fontSize="26px"
                                              cursor="pointer"
                                              onClick={() => {
                                                if (!inputDisableFunction()) {
                                                  updateClientFunction(
                                                    item,
                                                    index
                                                  );
                                                }
                                              }}
                                            />
                                          </Box>
                                          <Box color="red">
                                            <AiOutlineDelete
                                              cursor="pointer"
                                              fontSize="26px"
                                              onClick={() => {
                                                if (
                                                  updateClientList === null &&
                                                  !inputDisableFunction()
                                                ) {
                                                  remove_client_list(index);
                                                }
                                              }}
                                            />
                                          </Box>
                                        </Flex>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      style={{
                                        padding: tableStyle.generalPadding,
                                        textAlign: "center",
                                      }}
                                      colSpan={13}
                                    >
                                      No Data Added
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </Box>

                          {formState?.errors?.client ? (
                            <Text color="red">
                              {formState?.errors?.client?.message}
                            </Text>
                          ) : (
                            <></>
                          )}

                          <Box>
                            {/* ================ Intention Letter ================= */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                templateColumns="repeat(4, 1fr)"
                                alignItems="center"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    Intention Letter
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomFileInput
                                    name={
                                      formFieldsName.wms_clients_details
                                        .intention_letter_url
                                    }
                                    value={getValues(
                                      formFieldsName.wms_clients_details
                                        .intention_letter_url
                                    )}
                                    InputDisabled={inputDisableFunction()}
                                    placeholder="Excel upload"
                                    label=""
                                    fileuplaod_folder_structure={{
                                      type: "Warehouse",
                                      subtype: "Proposal",
                                    }}
                                    onChange={(e) => {
                                      setValue(
                                        formFieldsName.wms_clients_details
                                          .intention_letter_url,
                                        e,
                                        { shouldValidate: true }
                                      );
                                    }}
                                    type=""
                                    showErr={
                                      formState?.errors?.intention_letter_url
                                        ? true
                                        : false
                                    }
                                    style={{ w: "100%" }}
                                  />{" "}
                                  {formState?.errors?.intention_letter_url ? (
                                    <Text color="red">
                                      {
                                        formState?.errors?.intention_letter_url
                                          ?.message
                                      }
                                    </Text>
                                  ) : (
                                    <></>
                                  )}
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* ================ Remarks ================= */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                templateColumns="repeat(4, 1fr)"
                                alignItems="start"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">Remarks</Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2} textAlign={"left"}>
                                  <CustomTextArea
                                    name={
                                      formFieldsName.wms_clients_details.remarks
                                    }
                                    InputDisable={inputDisableFunction()}
                                    placeholder="Remarks"
                                    type="textarea"
                                    label=""
                                    style={{ w: "100%" }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                          </Box>

                          {Number(filledData?.status?.status_code || 0) >= 1 ? (
                            <></>
                          ) : (
                            <Box
                              display="flex"
                              justifyContent="flex-end"
                              mt="10"
                              px="0"
                            >
                              <Button
                                type="button"
                                backgroundColor={"primary.700"}
                                _hover={{ backgroundColor: "primary.700" }}
                                color={"white"}
                                isDisabled={inputDisableFunction()}
                                borderRadius={"full"}
                                isLoading={saveAsDraftApiIsLoading}
                                my={"4"}
                                px={"10"}
                                onClick={() => {
                                  saveAsDraftData("WMS_CLIENTS_DETAILS");
                                }}
                              >
                                Save as Draft
                              </Button>
                            </Box>
                          )}
                        </AccordionPanel>
                      </Box>
                    </>
                  )}
                </AccordionItem>
              </MotionSlideUp>
            </Accordion>
          </Box>

          {Number(filledData?.status?.status_code || 0) > 0 ? (
            <Box bg="white" borderRadius="10px" p="20px" mt="20px">
              {Number(filledData?.status?.status_code || 0) > 0 ? (
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
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
                          value={filledData?.l1_user?.employee_name || ""}
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
                          value={filledData?.l1_user?.phone || ""}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
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
              {Number(filledData?.status?.status_code || 0) > 2 ? (
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
                          value={filledData?.l2_user?.employee_name || ""}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
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
                          value={filledData?.l2_user?.phone || ""}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
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
              {Number(filledData?.status?.status_code || 0) >= 2 ? (
                <>
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
                          isDisabled={inputDisableFunction()}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
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
            </Box>
          ) : (
            <></>
          )}

          <Box display="flex" gap="10px" justifyContent="flex-end" mt="20px">
            {Number(filledData?.status?.status_code || 0) === 1 ? (
              <Button
                type="button"
                backgroundColor={"primary.700"}
                _hover={{ backgroundColor: "primary.700" }}
                color={"white"}
                borderRadius={"full"}
                isLoading={assignToMeApiIsLoading}
                isDisabled={view}
                onClick={() => {
                  AssignToMeFunction();
                }}
                px={"10"}
              >
                Assign to me
              </Button>
            ) : (
              <></>
            )}
            {Number(filledData?.status?.status_code || 0) === 2 ? (
              <>
                <Button
                  type="button"
                  backgroundColor={"white"}
                  _hover={{ backgroundColor: "white" }}
                  color={"#F82F2F"}
                  borderRadius={"full"}
                  border="1px solid #F82F2F"
                  onClick={() => {
                    if (rejectReason?.length > 0) {
                      ApproveRejectFunction({ status: "rejected" });
                      setRejectError(false);
                    } else {
                      setRejectError(true);
                    }
                  }}
                  isDisabled={inputDisableFunction()}
                  isLoading={approveRejectApiIsLoading}
                  px={"10"}
                >
                  Reject
                </Button>
                <Button
                  type="submit"
                  // onClick={() => {
                  //   ApproveRejectFunction({ status: "approved" });
                  // }}
                  isDisabled={inputDisableFunction()}
                  backgroundColor={"primary.700"}
                  _hover={{ backgroundColor: "primary.700" }}
                  color={"white"}
                  borderRadius={"full"}
                  isLoading={approveRejectApiIsLoading}
                  px={"10"}
                >
                  Approve
                </Button>
              </>
            ) : (
              <></>
            )}
            {Number(filledData?.status?.status_code || 0) < 1 ? (
              <Button
                type="submit"
                // type="submit"
                //w="full"
                backgroundColor={"primary.700"}
                _hover={{ backgroundColor: "primary.700" }}
                color={"white"}
                isDisabled={inputDisableFunction()}
                borderRadius={"full"}
                // isLoading={saveAsDraftApiIsLoading}
                px={"10"}
                mb="20px"
              >
                Submit
              </Button>
            ) : (
              <></>
            )}
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default Wms;
