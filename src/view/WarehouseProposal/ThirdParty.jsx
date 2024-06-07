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
  Text,
  Textarea,
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
  useGetAreaFreeMasterMutation,
  useGetBankBranchMasterFreeMutation,
  useGetBankMasterFreeMutation,
  useGetCommodityFreeMasterMutation,
  useGetDistrictFreeMasterMutation,
  useGetRegionFreeMasterMutation,
  useGetStateFreeMasterMutation,
  useGetUserFreeMasterMutation,
  useGetZoneFreeMasterMutation,
} from "../../features/master-api-slice";
import CustomTextArea from "../../components/Elements/CustomTextArea";
import ReactSelect from "react-select";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import {
  useFetchLocationDrillDownFreeMutation,
  useGetDocumentStatusMutation,
  useGetSecurityGuardDayShiftFreeMutation,
  useGetSecurityGuardNightShiftFreeMutation,
  useGetSupervisorDayShiftFreeMutation,
  useGetSupervisorNightShiftFreeMutation,
  useGetWarehouseProposalDetailsMutation,
  useSaveAsDraftMutation,
} from "../../features/warehouse-proposal.slice";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { useNavigate } from "react-router-dom";

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

const formFieldsName = {
  tp_warehouse_details: {
    warehouse_name: "warehouse_name",
    region: "region",
    state: "state",
    substate: "substate",
    district: "district",
    area: "area",
    warehouse_address: "warehouse_address",
    warehouse_pincode: "warehouse_pincode",
    no_of_chambers: "no_of_chambers",
    is_factory_permise: "is_factory_permise",
    no_of_warehouse_in_area: "no_of_warehouse_in_area", //not found
    supervisor_day_shift: "supervisor_day_shift",
    supervisor_night_shift: "supervisor_night_shift",
    security_guard_day_shift: "security_guard_day_shift",
    security_guard_night_shift: "security_guard_night_shift",
    is_new_supervisor_day_shift: "is_new_supervisor_day_shift", //done
    is_new_supervisor_night_shift: "is_new_supervisor_night_shift", //done
    is_new_security_guard_day_shift: "is_new_security_guard_day_shift", //done
    is_new_security_guard_night_shift: "is_new_security_guard_night_shift", //done
  },
  tp_commodity_details: {
    expected_commodity: "expected_commodity",
    commodity_inward_type: "commodity_inward_type",
    prestack_commodity: "prestack_commodity",
    prestack_commodity_qty: "prestack_commodity_qty",
    ccbanker_name: "ccbanker_name",
    bank: {
      bank: "bank",
      branch: "branch",
    },
  },
  tp_commercial_details: {
    cm_proposal_file_url: "cm_proposal_file_url",
  },
  tp_clients_details: {
    client: {
      client_type: "client_type",
      client_name: "client_name",
      client_contact_no: "client_contact_no",
      region: "region",
      state: "state",
      substate: "substate",
      district: "district",
      area: "area",
      client_address: "client_address",
      client_known_to_gg: "client_known_to_gg",
      client_sourced_by: "client_sourced_by",
      bank: "bank",
      branch: "branch",
      employee_name: "employee_name", //not found
    },
    intention_letter: "intention_letter", //not found
    remarks: "remarks", //not found
    assign_inspection_to: "assign_inspection_to", //not found
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

const schema = yup.object().shape({
  id: yup.string(), // hiring id
  warehouse_type: yup.string(),
  warehouse_subtype: yup.string(),
  warehouse_name: yup
    .string()
    .required(() => null)
    .typeError(""),
  region: yup
    .string()
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
  no_of_warehouse_in_area: yup.string(),
  /*.required("NO of Warehouse in area is required")*/
  supervisor_day_shift: yup.string().test("", "", function (value) {
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
  supervisor_night_shift: yup.string().test("isRequired", "", function (value) {
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
        message: "",
      });
    }

    return true;
  }),
  is_new_supervisor_day_shift: yup.string(),
  is_new_supervisor_night_shift: yup.string(),
  security_guard_day_shift: yup
    .string()
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
          message: "",
        });
      }

      return true;
    }),
  security_guard_night_shift: yup
    .string()
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
          message: "",
        });
      }

      return true;
    }),
  is_new_security_guard_day_shift: yup.string(),
  is_new_security_guard_night_shift: yup.string(),
  expected_commodity: yup
    .array()
    .required(() => null)
    .typeError(""),
  commodity_inward_type: yup
    .string()
    .required(() => null)
    .typeError(""),
  prestack_commodity: yup.string().when("commodity_inward_type", {
    is: (value) => value === "PS",
    then: () => yup.string().required(""),
    otherwise: () => yup.string(),
  }),
  prestack_commodity_qty: yup.number().when("commodity_inward_type", {
    is: (value) => value === "PS",
    then: () => yup.string().required(""),
    otherwise: () => yup.string(),
  }),
  ccbanker_name: yup.string() /*.required("CC Banker required is required")*/,
  bank: yup
    .array()
    .min(1, "Bank is required")
    .of(
      yup.object().shape({
        bank: yup.string().trim() /*.required("Bank name is required")*/,
        branch: yup.string().trim() /*.required("Branch name is required")*/,
      })
    ),
  cm_proposal_file_url: yup
    .string()
    .required(() => null)
    .typeError(),
  /*.required("CM proposal business form is required")*/
  client: yup
    .array()
    .min(1, "Client is required")
    .of(
      yup.object().shape({
        client_type: yup.string().required(""),
        client_name: yup.string().required(""),
        client_contact_no: yup.string().required(""),
        region: yup.string().required(""),
        state: yup.string().required(""),
        substate: yup.string().required(""),
        district: yup.string().required(""),
        area: yup.string().required(""),
        client_address: yup.string().required(""),
        client_known_to_gg: yup.string().required(""),
        client_sourced_by: yup.string().required(""),
        bank: yup
          .string()
          .trim()
          .nullable() /*.required("Bank name is required")*/,
        branch: yup
          .string()
          .trim()
          .nullable() /*.required("Branch name is required")*/,
        employee_name: yup.string().nullable(),
      })
    ),
  intention_letter: yup
    .string()
    .required(() => null)
    .typeError() /*.required("Intention letter is required")*/,
  remarks: yup.string() /*.required("remarks is required")*/,
  assign_inspection_to:
    yup.string() /*.required("Assign Inspection is required")*/,
});

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

const mobileNumberRegex = /^\+91\d{10}$/;

const ThirdParty = ({ id, view, type, subType }) => {
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    districts: [],
    states: [],
    substate: [],
    areas: [],
    community: [],
    banks: [],
    branch: [],
  });

  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
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
    setValue(formFieldsName.tp_warehouse_details.region, val?.value, {
      shouldValidate: true,
    });

    setValue(formFieldsName.tp_warehouse_details.state, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.tp_warehouse_details.substate, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.tp_warehouse_details.district, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.tp_warehouse_details.area, null, {
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
    setValue(formFieldsName.tp_warehouse_details.state, val?.value, {
      shouldValidate: true,
    });

    setValue(formFieldsName.tp_warehouse_details.substate, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.tp_warehouse_details.district, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.tp_warehouse_details.area, null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues(formFieldsName.tp_warehouse_details.region),
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
    setValue(formFieldsName.tp_warehouse_details.substate, val?.value, {
      shouldValidate: true,
    });

    setValue(formFieldsName.tp_warehouse_details.district, null, {
      shouldValidate: false,
    });

    setValue(formFieldsName.tp_warehouse_details.area, null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues(formFieldsName.tp_warehouse_details.region),
      state: getValues(formFieldsName.tp_warehouse_details.state),
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
    setValue(formFieldsName.tp_warehouse_details.district, val?.value, {
      shouldValidate: true,
    });

    setValue(formFieldsName.tp_warehouse_details.area, null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues(formFieldsName.tp_warehouse_details.region),
      state: getValues(formFieldsName.tp_warehouse_details.state),
      substate: getValues(formFieldsName.tp_warehouse_details.substate),
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
    setValue(formFieldsName.tp_warehouse_details.area, val?.value, {
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
      console.log("Success:", response);

      const optionsArray = response?.data?.map(
        ({ employee_name, user_id, count }) => ({
          value: user_id,
          label: employee_name,
          count: count,
        })
      );

      setSelectBoxOptions((prev) => ({
        ...prev,
        superVisorDayShiftOpt: optionsArray,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchSupervisorNightShift = async () => {
    try {
      const response = await getSupervisorNightShift(
        getValues("area")
      ).unwrap();
      console.log("Success:", response);

      const optionsArray = response?.data?.map(
        ({ employee_name, user_id, count }) => ({
          value: user_id,
          label: employee_name,
          count: count,
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
        ({ employee_name, user_id, count }) => ({
          value: user_id,
          label: employee_name,
          count: count,
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
      console.log("fetchSecurityGuardNightShift:", response);

      const optionsArray = response?.data?.map(
        ({ employee_name, user_id, count }) => ({
          value: user_id,
          label: employee_name,
          count: count,
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
    setBankError({
      bank: "",
      branch: "",
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

  // fourth accordion function start

  const [getUserMaster, { isLoading: getUserMasterApiIsLoading }] =
    useGetUserFreeMasterMutation();

  const getUserList = async () => {
    try {
      const response = await getUserMaster().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          users: response?.data?.map(({ employee_name, id }) => ({
            label: employee_name,
            value: id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // client list drill down api start

  const [fetchRegionFree, { isLoading: fetchRegionFreeApiIsLoading }] =
    useGetRegionFreeMasterMutation();

  const [fetchStateFree, { isLoading: fetchStateFreeApiIsLoading }] =
    useGetStateFreeMasterMutation();

  const [fetchSubStateFree, { isLoading: fetchSubStateFreeApiIsLoading }] =
    useGetZoneFreeMasterMutation();

  const [fetchDistrictFree, { isLoading: fetchDistrictFreeApiIsLoading }] =
    useGetDistrictFreeMasterMutation();

  const [fetchAreaFree, { isLoading: fetchAreaFreeApiIsLoading }] =
    useGetAreaFreeMasterMutation();

  const getRegionList = async () => {
    try {
      const response = await fetchRegionFree().unwrap();
      console.log("getRegionList", response);
      setSelectBoxOptions((prev) => ({
        ...prev,
        client_regions: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ region_name, id }) => ({
            label: region_name,
            value: id,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getStateList = async () => {
    try {
      const response = await fetchStateFree().unwrap();
      console.log("getStateList", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        client_states: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ region, state_name, id }) => ({
            label: state_name,
            value: id,
            region_id: region?.id || 0,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getSubStateList = async () => {
    try {
      const response = await fetchSubStateFree().unwrap();
      console.log("getSubStateList", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        client_substate: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ state, substate_name, id }) => ({
            label: substate_name,
            value: id,
            state_id: state?.id || 0,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getDistrictList = async () => {
    try {
      const response = await fetchDistrictFree().unwrap();
      console.log("getDistrictList", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        client_districts: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ substate, district_name, id }) => ({
            label: district_name,
            value: id,
            substate_id: substate?.id || 0,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAreaList = async () => {
    try {
      const response = await fetchAreaFree().unwrap();
      console.log("getAreaList", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        client_areas: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ district, area_name, id }) => ({
            label: area_name,
            value: id,
            district_id: district?.id || 0,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getRegionList();
    getStateList();
    getSubStateList();
    getDistrictList();
    getAreaList();
  }, []);

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
      label: "Processor",
      value: "Processor",
    },
    {
      label: "Trader",
      value: "Trader",
    },
    {
      label: "Cooperative",
      value: "Cooperative",
    },
    {
      label: "Farmer",
      value: "Farmer",
    },
  ];

  const ggOfficial = [
    {
      label: "Yes",
      value: "yes",
    },
    {
      label: "No",
      value: "no",
    },
  ];

  const clientSource = [
    {
      label: "Bank",
      value: "bank",
    },
    {
      label: "Employee",
      value: "employee",
    },
  ];

  const [clientList, setClientList] = useState({
    clientType: null,
    name: null,
    mobile: null,
    region: null,
    state: null,
    substate: null,
    district: null,
    area: null,
    address: null,
    know: null,
    source: null,
    bank: null,
    branch: null,
    employee: null,
  });

  const [clientError, setClientError] = useState({
    clientType: "",
    name: "",
    mobile: "",
    region: "",
    state: "",
    substate: "",
    district: "",
    area: "",
    address: "",
    know: "",
    source: "",
    bank: "",
    branch: "",
    employee: "",
  });

  const [updateClientList, setUpdateClientList] = useState(null);

  const regionOnClientChange = async (val) => {
    setClientList((old) => ({
      ...old,
      region: val?.value,
      state: null,
      substate: null,
      district: null,
      area: null,
    }));
  };

  const stateOnClientChange = async (val) => {
    setClientList((old) => ({
      ...old,
      state: val?.value,
      substate: null,
      district: null,
      area: null,
    }));
  };

  const zoneOnClientChange = async (val) => {
    setClientList((old) => ({
      ...old,
      substate: val?.value,
      district: null,
      area: null,
    }));
  };

  const districtOnClientChange = async (val) => {
    setClientList((old) => ({
      ...old,
      district: val?.value,
      area: null,
    }));
  };

  const areaOnClientChange = (val) => {
    setClientList((old) => ({
      ...old,
      area: val?.value,
    }));
  };

  const ClientOnChange = (val, key) => {
    setClientList((old) => ({ ...old, [key]: val?.target.value }));
  };

  const ClientSelectOnChange = (val, key) => {
    setClientList((old) => ({ ...old, [key]: val?.value }));
  };

  const ClientListClear = () => {
    setClientList({
      clientType: null,
      name: null,
      mobile: null,
      region: null,
      state: null,
      substate: null,
      district: null,
      area: null,
      address: null,
      know: null,
      source: null,
      bank: null,
      branch: null,
      employee: null,
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
        region: "",
        state: "",
        substate: "",
        district: "",
        area: "",
        address: "",
        know: "",
        source: "",
        bank: "",
        branch: "",
        employee: "",
      });
    }
  };

  const ClientErrorStatus = () => {
    const bankError =
      clientList.source === "bank"
        ? clientList.bank !== "" && clientList.branch !== ""
        : true;
    const employeeError =
      clientList.source === "employee" ? clientList.employee !== "" : true;

    const result =
      clientList.clientType !== "" &&
      clientList.name !== "" &&
      clientList.mobile !== "" &&
      clientList.region !== "" &&
      clientList.state !== "" &&
      clientList.substate !== "" &&
      clientList.district !== "" &&
      clientList.area !== "" &&
      clientList.address !== "" &&
      clientList.know !== "" &&
      clientList.source !== "" &&
      bankError &&
      employeeError &&
      mobileNumberRegex.test(clientList.mobile);

    return result;
  };

  const ClientErrorFunction = () => {
    setClientError({
      clientType:
        clientList.clientType === null || clientList.clientType === ""
          ? "error"
          : "",
      name: clientList.name === null || clientList.name === "" ? "error" : "",
      mobile:
        clientList.mobile === null
          ? "error"
          : mobileNumberRegex.test(clientList.mobile)
          ? ""
          : "Please add a valid number",
      region:
        clientList.region === null || clientList.region === "" ? "error" : "",
      state:
        clientList.state === null || clientList.state === "" ? "error" : "",
      substate:
        clientList.substate === null || clientList.substate === ""
          ? "error"
          : "",
      district:
        clientList.district === null || clientList.district === ""
          ? "error"
          : "",
      area: clientList.area === null || clientList.area === "" ? "error" : "",
      address:
        clientList.address === "" || clientList.address === null ? "error" : "",
      know: clientList.know === "" || clientList.know === null ? "error" : "",
      source:
        clientList.source === "" || clientList.source === null ? "error" : "",
      bank:
        clientList.source === "bank"
          ? clientList.bank === "" || clientList.bank === null
            ? "error"
            : ""
          : "",
      branch:
        clientList.source === "bank"
          ? clientList.branch === "" || clientList.branch === null
            ? "error"
            : ""
          : "",
      employee:
        clientList.source === "employee"
          ? clientList.employee === "" || clientList.employee === null
            ? "error"
            : ""
          : "",
    });
  };

  const append_client_list = () => {
    if (ClientErrorStatus()) {
      add_client_list({
        client_type: clientList.clientType,
        client_name: clientList.name,
        client_contact_no: clientList.mobile,
        region: clientList.region,
        state: clientList.state,
        substate: clientList.substate,
        district: clientList.district,
        area: clientList.area,
        client_address: clientList.address,
        client_known_to_gg: clientList.know,
        client_sourced_by: clientList.source,
        bank: clientList.bank,
        branch: clientList.branch,
        employee_name: clientList.employee,
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
      region: data.region,
      state: data.state,
      substate: data.substate,
      district: data.district,
      area: data.area,
      address: data.client_address,
      know: data.client_known_to_gg,
      source: data.client_sourced_by,
      bank: data.bank,
      branch: data.branch,
      employee: data.employee_name,
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
            region: clientList.region,
            state: clientList.state,
            substate: clientList.substate,
            district: clientList.district,
            area: clientList.area,
            client_address: clientList.address,
            client_known_to_gg: clientList.know,
            client_sourced_by: clientList.source,
            bank: clientList.bank,
            branch: clientList.branch,
            employee_name: clientList.employee,
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

  const onSubmit = async (data) => {
    const { is_draft, ...formData } = data;
    try {
      if (
        formData?.supervisor_day_shift ||
        formData?.supervisor_night_shift ||
        // eslint-disable-next-line
        formData?.is_new_supervisor_day_shift == "true" ||
        // eslint-disable-next-line
        formData?.is_new_supervisor_night_shift == "true"
      ) {
        console.log("");
      } else {
        toasterAlert({
          message: "Please select any one  Shift of Supervisor ",
          status: 440,
        });

        return;
      }

      if (
        // eslint-disable-next-line
        formData?.is_new_security_guard_day_shift == "true" ||
        // eslint-disable-next-line
        formData?.is_new_security_guard_night_shift == "true" ||
        formData?.security_guard_day_shift ||
        formData?.security_guard_night_shift
      ) {
        console.log("");
      } else {
        toasterAlert({
          message: "Please select any one  Shift of Security Guard ",
          status: 440,
        });

        return;
      }
      const response = await saveAsDraft({
        ...formData,
        is_draft: false,
      }).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        toasterAlert({
          message: "Hiring Form Submitted Successfully.",
          status: 200,
        });
        navigate("/hiring-proposal-master");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [saveAsDraft, { isLoading: saveAsDraftApiIsLoading }] =
    useSaveAsDraftMutation();

  const saveAsDraftData = async (type) => {
    try {
      let data = {};

      if (type === "TP_WAREHOUSE_DETAILS") {
        data = {
          is_draft: true,
          id: getValues("id"),
          warehouse_type: getValues("warehouse_type"),
          warehouse_subtype: getValues("warehouse_subtype"),
          warehouse_name: getValues("warehouse_name"),
          region: getValues("region"),
          state: getValues("state"),
          zone: getValues("zone"),
          district: getValues("district"),
          area: getValues("area"),
          warehouse_address: getValues("warehouse_address"),
          warehouse_pincode: getValues("warehouse_pincode"),
          no_of_chambers: getValues("no_of_chambers"),
          is_factory_permise: getValues("is_factory_permise"),
          no_of_warehouse_in_area: getValues("no_of_warehouse_in_area"), //not found
          supervisor_day_shift: getValues("supervisor_day_shift"),
          is_new_supervisor_day_shift: getValues("is_new_supervisor_day_shift"),
          supervisor_night_shift: getValues("supervisor_night_shift"),
          is_new_supervisor_night_shift: getValues(
            "is_new_supervisor_night_shift"
          ),
          security_guard_day_shift: getValues("security_guard_day_shift"),
          is_new_security_guard_day_shift: getValues(
            "is_new_security_guard_day_shift"
          ),
          security_guard_night_shift: getValues("security_guard_night_shift"),
          is_new_security_guard_night_shift: getValues(
            "is_new_security_guard_night_shift"
          ),
        };
        console.log("Tp_WAREHOUSE_DETAILS @@ --> ", data);
      } else if (type === "TP_COMMODITY_DETAILS") {
        data = {
          is_draft: true,
          id: getValues("id"),
          warehouse_type: getValues("warehouse_type"),
          warehouse_subtype: getValues("warehouse_subtype"),
          expected_commodity: getValues("expected_commodity"),
          commodity_inward_type: getValues("commodity_inward_type"),
          prestack_commodity: getValues("prestack_commodity"),
          prestack_commodity_qty: getValues("prestack_commodity_qty"),
          ccbanker_name: getValues("ccbanker_name"), //not found
          bank: bank_details_fields, //not found
        };

        console.log("TP_COMMODITY_DETAILS @@ --> ", data);
      } else if (type === "TP_COMMERCIAL_DETAILS") {
        data = {
          is_draft: true,
          id: getValues("id"),
          warehouse_type: getValues("warehouse_type"),
          warehouse_subtype: getValues("warehouse_subtype"),
          cm_proposal_file_url: getValues("cm_proposal_file_url"), //not found
        };

        console.log("TP_COMMERCIAL_DETAILS @@ --> ", data);
      } else if (type === "TP_CLIENTS_DETAILS") {
        data = {
          is_draft: true,
          id: getValues("id"),
          warehouse_type: getValues("warehouse_type"),
          warehouse_subtype: getValues("warehouse_subtype"),
          client: client, //not found
          intention_letter: getValues("intention_letter"), //not found
          remarks: getValues("remarks"), //not found
          assign_inspection_to: getValues("assign_inspection_to"), //not found
        };

        console.log("TP_CLIENTS_DETAILS @@ --> ", data);
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // edit wms functions start

  const [getWarehouseProposalDetails] =
    useGetWarehouseProposalDetailsMutation();

  const [filledData, setFilledData] = useState({});

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
      } else if (item.key === "client") {
        if (item.index !== []) {
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
        if (item.index !== []) {
          const tempBank =
            item?.index?.map((old2) => ({
              ...old2,
              bank: old2?.bank?.id || null,
              branch: old2?.branch?.id || null,
            })) || [];

          setValue(item.key, tempBank, { shouldValidate: true });
        }
      } else if (item.key === "expected_commodity") {
        if (item.index !== []) {
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
        if (item.index !== []) {
          setValue(item.key, item.index, { shouldValidate: true });
        }
      } else if (item.key === "lessee") {
        if (item.index !== []) {
          setValue(item.key, item.index, { shouldValidate: true });
        }
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

  const inputDisableFunction = () => {
    return Number(filledData?.status?.status_code || 0) === 1 ||
      Number(filledData?.status?.status_code || 0) === 3 ||
      Number(filledData?.status?.status_code || 0) === 4 ||
      view
      ? true
      : false;
  };

  useEffect(() => {
    if (id) {
      fetchWarehouseProposalDetails();
    }
  }, []);

  // edit wms functions end

  return (
    <Box bg="gray.50" p="0">
      {/* <Box p="2">
          <BreadcrumbCmp BreadcrumbList={BreadcrumbLinks} />
        </Box> */}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box mt="10">
            <Accordion allowMultiple>
              {/* ================ THIRD PARTY WAREHOUSE DETAILS ================= */}
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
                            THIRD PARTY WAREHOUSE DETAILS
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
                                  {" "}
                                  <Text textAlign="right">
                                    Warehouse Name
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomTextArea
                                    name={
                                      formFieldsName.tp_warehouse_details
                                        .warehouse_name
                                    }
                                    InputDisable={inputDisableFunction()}
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
                                  <Text textAlign="right">Region</Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.tp_warehouse_details.region
                                    }
                                    label=""
                                    isLoading={
                                      fetchLocationDrillDownApiIsLoading
                                    }
                                    selectDisable={inputDisableFunction()}
                                    options={selectBoxOptions?.regions || []}
                                    selectedValue={
                                      selectBoxOptions?.regions?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            formFieldsName.tp_warehouse_details
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
                                  <Text textAlign="right">State</Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.tp_warehouse_details.state
                                    }
                                    label=""
                                    selectDisable={inputDisableFunction()}
                                    options={selectBoxOptions?.states || []}
                                    selectedValue={
                                      selectBoxOptions?.states?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            formFieldsName.tp_warehouse_details
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
                                  <Text textAlign="right">Sub State</Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.tp_warehouse_details
                                        .substate
                                    }
                                    selectDisable={inputDisableFunction()}
                                    label=""
                                    options={selectBoxOptions?.substate || []}
                                    selectedValue={
                                      selectBoxOptions?.substate?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            formFieldsName.tp_warehouse_details
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
                                  <Text textAlign="right">District</Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.tp_warehouse_details
                                        .district
                                    }
                                    selectDisable={inputDisableFunction()}
                                    label=""
                                    options={selectBoxOptions?.districts || []}
                                    selectedValue={
                                      selectBoxOptions?.districts?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            formFieldsName.tp_warehouse_details
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
                                  <Text textAlign="right">Area</Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.tp_warehouse_details.area
                                    }
                                    label=""
                                    selectDisable={inputDisableFunction()}
                                    options={selectBoxOptions?.areas || []}
                                    selectedValue={
                                      selectBoxOptions?.areas?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            formFieldsName.tp_warehouse_details
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
                                    Warehouse Address
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomTextArea
                                    name={
                                      formFieldsName.tp_warehouse_details
                                        .warehouse_address
                                    }
                                    InputDisable={inputDisableFunction()}
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
                                  <Text textAlign="right">Pin Code</Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.tp_warehouse_details
                                        .warehouse_pincode
                                    }
                                    inputValue={inputDisableFunction()}
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
                                  <Text textAlign="right">No Of Chambers</Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.tp_warehouse_details
                                        .no_of_chambers
                                    }
                                    InputDisabled={inputDisableFunction()}
                                    placeholder="No of Chambers"
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
                                    Warehouse In Factory Premises
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <RadioGroup
                                    p="0"
                                    name={
                                      formFieldsName.tp_warehouse_details
                                        .is_factory_permise
                                    }
                                    value={
                                      getValues(
                                        formFieldsName.tp_warehouse_details
                                          .is_factory_permise
                                      ) || false
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={(e) => {
                                      setValue(
                                        formFieldsName.tp_warehouse_details
                                          .is_factory_permise,
                                        e,
                                        { shouldValidate: true }
                                      );
                                    }}
                                  >
                                    <Stack spacing={5} direction="row">
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value="yes"
                                      >
                                        Yes
                                      </Radio>
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value="no"
                                      >
                                        No
                                      </Radio>
                                    </Stack>
                                  </RadioGroup>
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* --------------  No. Of warehouse in Area -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                templateColumns="repeat(4, 1fr)"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">
                                    No. Of warehouse in Area
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.tp_warehouse_details
                                        .no_of_warehouse_in_area
                                    }
                                    placeholder=" No. Of warehouse in Area"
                                    type="number"
                                    InputDisabled={true}
                                    label=""
                                    style={{ w: "100%" }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                            {/* -------------- supervisor_day_shift -------------- */}
                            <Box mt={commonStyle.mt}>
                              <Grid
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
                                        formFieldsName.tp_warehouse_details
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
                                                .tp_warehouse_details
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
                                        setValue(
                                          formFieldsName.tp_warehouse_details
                                            .supervisor_day_shift,
                                          val?.value,
                                          { shouldValidate: true }
                                        );
                                      }}
                                    />
                                  </Box>
                                </GridItem>
                                <GridItem colSpan={1}>
                                  <Checkbox
border={"1px grey"}
colorScheme="CheckBoxPrimary"
                                    isChecked={
                                      getValues(
                                        formFieldsName.tp_warehouse_details
                                          .is_new_supervisor_day_shift
                                      ) === "true"
                                        ? true
                                        : false
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={() => {
                                      getValues(
                                        formFieldsName.tp_warehouse_details
                                          .is_new_supervisor_day_shift
                                      ) === "true"
                                        ? setValue(
                                            formFieldsName.tp_warehouse_details
                                              .is_new_supervisor_day_shift,
                                            "false",
                                            { shouldValidate: true }
                                          )
                                        : setValue(
                                            formFieldsName.tp_warehouse_details
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
                                        formFieldsName.tp_warehouse_details
                                          .supervisor_night_shift
                                      }
                                      label=""
                                      options={
                                        selectBoxOptions?.superVisorNightShiftOpt ||
                                        []
                                      }
                                      selectDisable={inputDisableFunction()}
                                      selectedValue={
                                        selectBoxOptions?.superVisorNightShiftOpt?.filter(
                                          (item) =>
                                            item.value ===
                                            getValues(
                                              formFieldsName
                                                .tp_warehouse_details
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
                                          formFieldsName.tp_warehouse_details
                                            .supervisor_night_shift,
                                          val?.value,
                                          { shouldValidate: true }
                                        );
                                      }}
                                    />
                                  </Box>
                                </GridItem>
                                <GridItem colSpan={1}>
                                  <Checkbox
                                   border={"1px grey"}
                                   colorScheme="CheckBoxPrimary"
                                    isChecked={
                                      getValues(
                                        formFieldsName.tp_warehouse_details
                                          .is_new_supervisor_night_shift
                                      ) === "true"
                                        ? true
                                        : false
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={() => {
                                      getValues(
                                        formFieldsName.tp_warehouse_details
                                          .is_new_supervisor_night_shift
                                      ) === "true"
                                        ? setValue(
                                            formFieldsName.tp_warehouse_details
                                              .is_new_supervisor_night_shift,
                                            "false",
                                            { shouldValidate: true }
                                          )
                                        : setValue(
                                            formFieldsName.tp_warehouse_details
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
                                        formFieldsName.tp_warehouse_details
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
                                                .tp_warehouse_details
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
                                          formFieldsName.tp_warehouse_details
                                            .security_guard_day_shift,
                                          val?.value,
                                          { shouldValidate: true }
                                        );
                                      }}
                                    />
                                  </Box>
                                </GridItem>
                                <GridItem colSpan={1}>
                                  <Checkbox
                                    border={"1px grey"}
                                    colorScheme="CheckBoxPrimary"
                                    isChecked={
                                      getValues(
                                        formFieldsName.tp_warehouse_details
                                          .is_new_security_guard_day_shift
                                      ) === "true"
                                        ? true
                                        : false
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={() => {
                                      getValues(
                                        formFieldsName.tp_warehouse_details
                                          .is_new_security_guard_day_shift
                                      ) === "true"
                                        ? setValue(
                                            formFieldsName.tp_warehouse_details
                                              .is_new_security_guard_day_shift,
                                            "false",
                                            { shouldValidate: true }
                                          )
                                        : setValue(
                                            formFieldsName.tp_warehouse_details
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
                                        formFieldsName.tp_warehouse_details
                                          .security_guard_night_shift
                                      }
                                      selectDisable={inputDisableFunction()}
                                      label=""
                                      options={
                                        selectBoxOptions?.securityGuardNightShiftOpt ||
                                        []
                                      }
                                      selectedValue={
                                        selectBoxOptions?.securityGuardNightShiftOpt?.filter(
                                          (item) =>
                                            item.value ===
                                            getValues(
                                              formFieldsName
                                                .tp_warehouse_details
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
                                          formFieldsName.tp_warehouse_details
                                            .security_guard_night_shift,
                                          val.value,
                                          { shouldValidate: true }
                                        );
                                      }}
                                    />
                                  </Box>
                                </GridItem>
                                <GridItem colSpan={1}>
                                  <Checkbox
                                   border={"1px grey"}
                                   colorScheme="CheckBoxPrimary"
                                    isChecked={
                                      getValues(
                                        formFieldsName.tp_warehouse_details
                                          .is_new_security_guard_night_shift
                                      ) === "true"
                                        ? true
                                        : false
                                    }
                                    isDisabled={inputDisableFunction()}
                                    onChange={() => {
                                      getValues(
                                        formFieldsName.tp_warehouse_details
                                          .is_new_security_guard_night_shift
                                      ) === "true"
                                        ? setValue(
                                            formFieldsName.tp_warehouse_details
                                              .is_new_security_guard_night_shift,
                                            "false",
                                            { shouldValidate: true }
                                          )
                                        : setValue(
                                            formFieldsName.tp_warehouse_details
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

                          {Number(filledData?.status?.status_code || 0) ===
                          2 ? (
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
                                my={"4"}
                                px={"10"}
                                isDisabled={inputDisableFunction()}
                                isLoading={saveAsDraftApiIsLoading}
                                onClick={() => {
                                  saveAsDraftData("TP_WAREHOUSE_DETAILS");
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

              {/* ================ THIRD PARTY COMMODITY DETAILS ================= */}
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
                            THIRD PARTY COMMODITY DETAILS
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
                                    Expected Commodity Name
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.tp_commodity_details
                                        .expected_commodity
                                    }
                                    selectDisable={inputDisableFunction()}
                                    label=""
                                    options={selectBoxOptions?.community || []}
                                    selectedValue={
                                      selectBoxOptions?.community?.filter(
                                        (item) =>
                                          getValues(
                                            formFieldsName.tp_commodity_details
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
                                        formFieldsName.tp_commodity_details
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
                                  </Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <ReactCustomSelect
                                    name={
                                      formFieldsName.tp_commodity_details
                                        .commodity_inward_type
                                    }
                                    label=""
                                    selectDisable={inputDisableFunction()}
                                    options={CommodityInwardType || []}
                                    selectedValue={CommodityInwardType.filter(
                                      (item) =>
                                        item.value ===
                                        getValues(`commodity_inward_type`)
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
                                        formFieldsName.tp_commodity_details
                                          .commodity_inward_type,
                                        val.value,
                                        { shouldValidate: true }
                                      );
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>

                            {getValues(
                              formFieldsName.tp_commodity_details
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
                                          formFieldsName.tp_commodity_details
                                            .prestack_commodity
                                        }
                                        label=""
                                        options={
                                          selectBoxOptions?.community || []
                                        }
                                        selectDisable={inputDisableFunction()}
                                        selectedValue={
                                          selectBoxOptions?.community.filter(
                                            (item) =>
                                              item.value ===
                                              getValues(
                                                formFieldsName
                                                  .tp_commodity_details
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
                                            formFieldsName.tp_commodity_details
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
                                          formFieldsName.tp_commodity_details
                                            .prestack_commodity_qty
                                        }
                                        InputDisabled={inputDisableFunction()}
                                        placeholder="Pre-Stack Commodity Quantity(MT)"
                                        type="number"
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

                            {/* ================ Cc-Banker Commodity ================= */}
                            <Box mt={commonStyle.mt}>
                              <Grid
                                textAlign="right"
                                templateColumns="repeat(4, 1fr)"
                                alignItems="center"
                                gap={4}
                              >
                                <GridItem colSpan={1}>
                                  <Text textAlign="right">CC Banker</Text>{" "}
                                </GridItem>
                                <GridItem colSpan={2}>
                                  <CustomInput
                                    name={
                                      formFieldsName.tp_commodity_details
                                        .ccbanker_name
                                    }
                                    InputDisabled={inputDisableFunction()}
                                    placeholder="CC Banker"
                                    type="text"
                                    label=""
                                    style={{ w: "100%" }}
                                  />
                                </GridItem>
                              </Grid>
                            </Box>
                          </Box>

                          {/* ================ Bank Details ================= */}

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
                                <Heading as="h5" fontSize="lg" textAlign="left">
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
                                      (item) => item.value === bankDetail.bank
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
                                  isDisabled={inputDisableFunction()}
                                  isLoading={getBankBranchMasterApiIsLoading}
                                  value={
                                    selectBoxOptions?.branch?.filter(
                                      (item) => item.value === bankDetail.branch
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
                                        {selectBoxOptions?.banks?.filter(
                                          (old) => old.value === item.bank
                                        )[0]?.label || item.bank}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {selectBoxOptions?.branch?.filter(
                                          (old) => old.value === item.branch
                                        )[0]?.label || item.branch}
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

                          {Number(filledData?.status?.status_code || 0) ===
                          2 ? (
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
                                isDisabled={inputDisableFunction()}
                                _hover={{ backgroundColor: "primary.700" }}
                                color={"white"}
                                borderRadius={"full"}
                                my={"4"}
                                px={"10"}
                                isLoading={saveAsDraftApiIsLoading}
                                onClick={() => {
                                  saveAsDraftData("TP_COMMODITY_DETAILS");
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

              {/* ================ THIRD PARTY COMMERCIAL DETAILS ================= */}
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
                            THIRD PARTY COMMERCIAL DETAILS
                          </Box>
                          {isExpanded ? (
                            <MinusIcon fontSize="12px" />
                          ) : (
                            <AddIcon fontSize="12px" />
                          )}
                        </AccordionButton>

                        <AccordionPanel bg="white" mt="5" pb={4} py="4" px="8">
                          {/* ================ CM proposal business form ================= */}
                          <Box mt={commonStyle.mt}>
                            <Grid
                              textAlign="right"
                              templateColumns="repeat(4, 1fr)"
                              alignItems="center"
                              gap={4}
                            >
                              <GridItem colSpan={1}>
                                <Text textAlign="right">
                                  CM proposal business form
                                </Text>
                              </GridItem>
                              <GridItem colSpan={2}>
                                <CustomFileInput
                                  name={
                                    formFieldsName.tp_commercial_details
                                      .cm_proposal_file_url
                                  }
                                  InputDisabled={inputDisableFunction()}
                                  label=""
                                  placeholder="Excel upload"
                                  value={getValues(
                                    formFieldsName.tp_commercial_details
                                      .cm_proposal_file_url
                                  )}
                                  fileuplaod_folder_structure={{
                                    type: "Warehouse",
                                    subtype: "Proposal",
                                  }}
                                  onChange={(e) => {
                                    setValue(
                                      formFieldsName.tp_commercial_details
                                        .cm_proposal_file_url,
                                      e,
                                      { shouldValidate: true }
                                    );
                                  }}
                                  showErr={
                                    formState?.errors?.cm_proposal_file_url
                                      ? true
                                      : false
                                  }
                                  style={{
                                    w: "100%",
                                  }}
                                />
                              </GridItem>
                            </Grid>
                          </Box>

                          {Number(filledData?.status?.status_code || 0) ===
                          2 ? (
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
                                  saveAsDraftData("TP_COMMERCIAL_DETAILS");
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

              {/* ================ THIRD PARTY CLIENTS DETAILS ================= */}
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
                            THIRD PARTY CLIENTS DETAILS
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
                              textAlign="left"
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
                                </Heading>
                              </GridItem>
                              {/* ================ Client Type ================= */}
                              <GridItem>
                                <Text textAlign="left">Client Type</Text>
                                <ReactSelect
                                  options={clientClientType}
                                  placeholder=" Client Type"
                                  value={
                                    clientClientType?.filter(
                                      (item) =>
                                        item.value === clientList.clientType
                                    )[0] || {}
                                  }
                                  isDisabled={inputDisableFunction()}
                                  isLoading={false}
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
                              {/* ================ Client Name ================= */}
                              <GridItem>
                                <Text textAlign="left">Client Name </Text>
                                <Input
                                  placeholder="client name"
                                  value={clientList?.name || ""}
                                  onChange={(val) => {
                                    ClientOnChange(val, "name");
                                  }}
                                  isDisabled={inputDisableFunction()}
                                  type="text"
                                  style={inputStyle}
                                  border="1px"
                                  borderColor={
                                    clientError.name ? "red" : "gray.10"
                                  }
                                />
                              </GridItem>
                              {/* ================ Mobile Number ================= */}
                              <GridItem>
                                <Text textAlign="left">Mobile Number </Text>
                                <Input
                                  placeholder="mobile number"
                                  type="number"
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
                                  isDisabled={inputDisableFunction()}
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
                              {/* ================ Region ================= */}
                              <GridItem>
                                <Text textAlign="left">Region</Text>{" "}
                                <ReactSelect
                                  options={
                                    selectBoxOptions?.client_regions || []
                                  }
                                  value={
                                    selectBoxOptions?.client_regions?.filter(
                                      (item) => item.value === clientList.region
                                    )[0] || {}
                                  }
                                  isDisabled={inputDisableFunction()}
                                  placeholder="Select Region"
                                  isLoading={fetchRegionFreeApiIsLoading}
                                  onChange={(val) => {
                                    regionOnClientChange(val);
                                  }}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: clientError.region
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
                                <Text textAlign="left">State </Text>{" "}
                                <ReactSelect
                                  options={
                                    clientList.region
                                      ? selectBoxOptions?.client_states?.filter(
                                          (item) =>
                                            item.region_id === clientList.region
                                        ) || []
                                      : []
                                  }
                                  isDisabled={inputDisableFunction()}
                                  placeholder="Select State"
                                  value={
                                    selectBoxOptions?.client_states?.filter(
                                      (item) => item.value === clientList.state
                                    )[0] || {}
                                  }
                                  isLoading={fetchStateFreeApiIsLoading}
                                  onChange={(val) => {
                                    stateOnClientChange(val);
                                  }}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: clientError.state
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
                                <Text textAlign="left">Sub State </Text>{" "}
                                <ReactSelect
                                  options={
                                    clientList.state
                                      ? selectBoxOptions?.client_substate?.filter(
                                          (item) =>
                                            item.state_id === clientList.state
                                        ) || []
                                      : []
                                  }
                                  isDisabled={inputDisableFunction()}
                                  placeholder="Select Sub State"
                                  value={
                                    selectBoxOptions?.client_substate?.filter(
                                      (item) =>
                                        item.value === clientList.substate
                                    )[0] || {}
                                  }
                                  isLoading={fetchSubStateFreeApiIsLoading}
                                  onChange={(val) => {
                                    zoneOnClientChange(val);
                                  }}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: clientError.substate
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
                                <Text textAlign="left">District </Text>
                                <ReactSelect
                                  placeholder="Select District"
                                  options={
                                    clientList.substate
                                      ? selectBoxOptions?.client_districts?.filter(
                                          (item) =>
                                            item.substate_id ===
                                            clientList.substate
                                        ) || []
                                      : []
                                  }
                                  isDisabled={inputDisableFunction()}
                                  value={
                                    selectBoxOptions?.client_districts?.filter(
                                      (item) =>
                                        item.value === clientList.district
                                    )[0] || {}
                                  }
                                  isLoading={fetchDistrictFreeApiIsLoading}
                                  onChange={(val) => {
                                    districtOnClientChange(val);
                                  }}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: clientError.district
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
                                <Text textAlign="left">Area </Text>{" "}
                                <ReactSelect
                                  placeholder="Select Area"
                                  options={
                                    clientList.district
                                      ? selectBoxOptions?.client_areas?.filter(
                                          (item) =>
                                            item.district_id ===
                                            clientList.district
                                        ) || []
                                      : []
                                  }
                                  isDisabled={inputDisableFunction()}
                                  value={
                                    selectBoxOptions?.client_areas?.filter(
                                      (item) => item.value === clientList.area
                                    )[0] || {}
                                  }
                                  isLoading={fetchAreaFreeApiIsLoading}
                                  onChange={(val) => {
                                    areaOnClientChange(val);
                                  }}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: clientError.area
                                        ? "red"
                                        : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),
                                    ...reactSelectStyle,
                                  }}
                                />
                              </GridItem>
                              {/* ================ Address ================= */}
                              <GridItem colSpan={{ base: 1, sm: 2 }}>
                                <Text textAlign="left"> Address </Text>{" "}
                                <Textarea
                                  placeholder="address"
                                  rows={1}
                                  isDisabled={inputDisableFunction()}
                                  value={clientList?.address || ""}
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
                              {/* ================ Client known to GGWPL official ================= */}
                              <GridItem colSpan={{ base: 1, sm: 2 }}>
                                <Text textAlign="left">
                                  Client known to GGWPL official
                                </Text>
                                <ReactSelect
                                  isDisabled={inputDisableFunction()}
                                  options={ggOfficial || []}
                                  value={
                                    ggOfficial?.filter(
                                      (item) => item.value === clientList.know
                                    )[0] || {}
                                  }
                                  placeholder="Select Client known to GGWPL official"
                                  isLoading={false}
                                  onChange={(val) => {
                                    ClientSelectOnChange(val, "know");
                                  }}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: clientError.know
                                        ? "red"
                                        : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),
                                    ...reactSelectStyle,
                                  }}
                                />
                              </GridItem>
                              {/* ================ Client Sourced by ================= */}
                              <GridItem>
                                <Text textAlign="left">Client Sourced by</Text>{" "}
                                <ReactSelect
                                  isDisabled={inputDisableFunction()}
                                  options={clientSource || []}
                                  value={
                                    clientSource?.filter(
                                      (item) => item.value === clientList.source
                                    )[0] || {}
                                  }
                                  placeholder="Client Sourced by"
                                  isLoading={false}
                                  onChange={(val) => {
                                    ClientSelectOnChange(val, "source");
                                  }}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: clientError.source
                                        ? "red"
                                        : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),
                                    ...reactSelectStyle,
                                  }}
                                />
                              </GridItem>
                              {clientList.source === "bank" ? (
                                <>
                                  {/* ================ Bank Name ================= */}
                                  <GridItem>
                                    <Text textAlign="left">Bank Name</Text>{" "}
                                    <ReactSelect
                                      isDisabled={inputDisableFunction()}
                                      options={selectBoxOptions?.banks || []}
                                      value={
                                        selectBoxOptions?.banks?.filter(
                                          (item) =>
                                            item.value === clientList.bank
                                        )[0] || {}
                                      }
                                      placeholder="Bank Name"
                                      isLoading={getBankMasterApiIsLoading}
                                      onChange={(val) => {
                                        ClientSelectOnChange(val, "bank");
                                      }}
                                      styles={{
                                        control: (base, state) => ({
                                          ...base,
                                          backgroundColor: "#fff",
                                          borderRadius: "6px",
                                          borderColor: clientError.bank
                                            ? "red"
                                            : "#c3c3c3",

                                          padding: "1px",
                                          textAlign: "left",
                                        }),
                                        ...reactSelectStyle,
                                      }}
                                    />
                                  </GridItem>
                                  {/* ================ Branch Name ================= */}
                                  <GridItem>
                                    <Text textAlign="left">Branch Name</Text>{" "}
                                    <ReactSelect
                                      isDisabled={inputDisableFunction()}
                                      options={selectBoxOptions?.branch || []}
                                      value={
                                        selectBoxOptions?.branch?.filter(
                                          (item) =>
                                            item.value === clientList.branch
                                        )[0] || {}
                                      }
                                      placeholder="Branch Name"
                                      isLoading={
                                        getBankBranchMasterApiIsLoading
                                      }
                                      onChange={(val) => {
                                        ClientSelectOnChange(val, "branch");
                                      }}
                                      styles={{
                                        control: (base, state) => ({
                                          ...base,
                                          backgroundColor: "#fff",
                                          borderRadius: "6px",
                                          borderColor: clientError.branch
                                            ? "red"
                                            : "#c3c3c3",

                                          padding: "1px",
                                          textAlign: "left",
                                        }),
                                        ...reactSelectStyle,
                                      }}
                                    />
                                  </GridItem>
                                </>
                              ) : (
                                <></>
                              )}
                              {clientList.source === "employee" ? (
                                <>
                                  {/* ================ Employee Name ================= */}
                                  <GridItem>
                                    <Text textAlign="left">Employee Name</Text>{" "}
                                    <ReactSelect
                                      isDisabled={inputDisableFunction()}
                                      options={selectBoxOptions?.users || []}
                                      value={
                                        selectBoxOptions?.users?.filter(
                                          (item) =>
                                            item.value === clientList.employee
                                        )[0] || {}
                                      }
                                      placeholder="Employee Name"
                                      isLoading={getUserMasterApiIsLoading}
                                      onChange={(val) => {
                                        ClientSelectOnChange(val, "employee");
                                      }}
                                      styles={{
                                        control: (base, state) => ({
                                          ...base,
                                          backgroundColor: "#fff",
                                          borderRadius: "6px",
                                          borderColor: clientError.employee
                                            ? "red"
                                            : "#c3c3c3",

                                          padding: "1px",
                                          textAlign: "left",
                                        }),
                                        ...reactSelectStyle,
                                      }}
                                    />
                                  </GridItem>
                                </>
                              ) : (
                                <></>
                              )}
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
                                    Region
                                  </th>{" "}
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    State
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Sub State
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    District
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Area
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
                                      minWidth: "300px",
                                    }}
                                  >
                                    Client known to GGWPL official
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                      minWidth: "200px",
                                    }}
                                  >
                                    Client Sourced by
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Bank name
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Branch name
                                  </th>
                                  <th
                                    style={{
                                      padding: tableStyle.generalPadding,
                                    }}
                                  >
                                    Employee name
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
                                        {selectBoxOptions?.client_regions?.filter(
                                          (old) =>
                                            old.value === Number(item.region)
                                        )[0]?.label || item.region}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {selectBoxOptions?.client_states?.filter(
                                          (old) =>
                                            old.value === Number(item.state)
                                        )[0]?.label || item.state}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {selectBoxOptions?.client_substate?.filter(
                                          (old) =>
                                            old.value === Number(item.substate)
                                        )[0]?.label || item.substate}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {selectBoxOptions?.client_districts?.filter(
                                          (old) =>
                                            old.value === Number(item.district)
                                        )[0]?.label || item.district}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {selectBoxOptions?.client_areas?.filter(
                                          (old) =>
                                            old.value === Number(item.area)
                                        )[0]?.label || item.area}
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
                                        {item.client_known_to_gg}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {item.client_sourced_by}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {selectBoxOptions?.banks?.filter(
                                          (old) => old.value === item.bank
                                        )[0]?.label || "-"}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {selectBoxOptions?.branch?.filter(
                                          (old) => old.value === item.branch
                                        )[0]?.label || "-"}
                                      </td>
                                      <td
                                        style={{
                                          padding: tableStyle.generalPadding,
                                        }}
                                      >
                                        {selectBoxOptions?.users?.filter(
                                          (old) =>
                                            old.value === item.employee_name
                                        )[0]?.label || "-"}
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
                                      colSpan={17}
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

                          {/* ================ Intention Letter ================= */}
                          <Box mt={commonStyle.mt}>
                            <Grid
                              textAlign="right"
                              templateColumns="repeat(4, 1fr)"
                              alignItems="center"
                              gap={4}
                            >
                              <GridItem colSpan={1}>
                                <Text textAlign="right">Intention Letter</Text>{" "}
                              </GridItem>
                              <GridItem colSpan={2}>
                                <CustomFileInput
                                  name={
                                    formFieldsName.tp_clients_details
                                      .intention_letter
                                  }
                                  placeholder="Excel upload"
                                  InputDisabled={inputDisableFunction()}
                                  label=""
                                  type=".pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                  style={{ w: "100%" }}
                                  fileuplaod_folder_structure={{
                                    type: "Warehouse",
                                    subtype: "Proposal",
                                  }}
                                  onChange={(e) => {
                                    setValue(
                                      formFieldsName.tp_clients_details
                                        .intention_letter,
                                      e,
                                      { shouldValidate: true }
                                    );
                                  }}
                                  showErr={
                                    formState?.errors?.intention_letter
                                      ? true
                                      : false
                                  }
                                />
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
                                <Textarea
                                  width={"100%"}
                                  isDisabled={inputDisableFunction()}
                                  name={
                                    formFieldsName.tp_clients_details.remarks
                                  }
                                  borderColor={"primary.700 1px"}
                                  _hover={{
                                    borderColor: "primary.700",
                                    backgroundColor: "primary.200",
                                  }}
                                  _focus={{
                                    borderColor: "primary.700",
                                    backgroundColor: "primary.200",
                                    boxShadow: "none",
                                  }}
                                  placeholder="Remarks"
                                  label=""
                                />
                              </GridItem>
                            </Grid>
                          </Box>

                          {/* ================ Assign Inspection to Commodity ================= */}
                          <Box mt={commonStyle.mt}>
                            <Grid
                              textAlign="right"
                              templateColumns="repeat(4, 1fr)"
                              alignItems="center"
                              gap={4}
                            >
                              <GridItem colSpan={1}>
                                <Text textAlign="right">
                                  Assign Inspection to
                                </Text>{" "}
                              </GridItem>
                              <GridItem colSpan={2}>
                                <ReactCustomSelect
                                  name={
                                    formFieldsName.tp_clients_details
                                      .assign_inspection_to
                                  }
                                  label=""
                                  options={selectBoxOptions?.users || []}
                                  selectedValue={{}}
                                  isClearable={false}
                                  selectType="label"
                                  selectDisable={inputDisableFunction()}
                                  isLoading={getUserMasterApiIsLoading}
                                  style={{ w: "100%" }}
                                  handleOnChange={(val) => {
                                    console.log(
                                      "selectedOption @@@@@@@@@@@------> ",
                                      val
                                    );
                                    setValue(
                                      formFieldsName.tp_clients_details
                                        .assign_inspection_to,
                                      val.value,
                                      { shouldValidate: true }
                                    );
                                  }}
                                />
                              </GridItem>
                            </Grid>
                          </Box>

                          {Number(filledData?.status?.status_code || 0) ===
                          2 ? (
                            <></>
                          ) : (
                            <Box
                              display="flex"
                              justifyContent="flex-end"
                              mt="20"
                              px="0"
                            >
                              <Button
                                type="button"
                                //w="full"
                                backgroundColor={"primary.700"}
                                _hover={{ backgroundColor: "primary.700" }}
                                color={"white"}
                                isDisabled={inputDisableFunction()}
                                borderRadius={"full"}
                                my={"4"}
                                px={"10"}
                                isLoading={saveAsDraftApiIsLoading}
                                onClick={() => {
                                  saveAsDraftData("TP_CLIENTS_DETAILS");
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

          <Box display="flex" gap="10px" justifyContent="flex-end" mt="20px">
            {Number(filledData?.status?.status_code || 0) < 1 ? (
              <Button
                type="submit"
                // type="submit"
                //w="full"
                isDisabled={inputDisableFunction()}
                backgroundColor={"primary.700"}
                _hover={{ backgroundColor: "primary.700" }}
                color={"white"}
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

export default ThirdParty;
