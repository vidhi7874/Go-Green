/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import generateFormField from "../../components/Elements/GenerateFormField";
import { addEditFormFields, schema } from "./fields";
import {
  useAddSecurityAgencyMasterMutation,
  useGetSecurityGuardTypeMasterMutation,
  useUpdateSecurityAgencyMasterMutation,
} from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { MotionSlideUp } from "../../utils/animation";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { useFetchLocationDrillDownFreeMutation } from "../../features/warehouse-proposal.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomInput from "../../components/Elements/CustomInput";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import ReactSelect from "react-select";
import { BiDownload, BiEditAlt } from "react-icons/bi";
import moment from "moment";
import ROUTE_PATH from "../../constants/ROUTE";
import configuration from "../../config/configuration";

// Function to check if the obj's SG Type and shift already exists in kyc

const AddEditFormSecurityAgencyMaster = () => {
  const today = moment(); // Get the current date using moment
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const details = location.state?.details;
  // console.log("details ---> ", details);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: !details?.id, // Set is_active to true only when adding
    },
  });

  const initialIsActive = details ? details.is_active : true;

  const { setValue, getValues, formState } = methods;

  const [addEditFormFieldsList, setAddEditFormFieldsList] =
    useState(addEditFormFields);

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    // earthQuack: [],
    regions: [],
    substate: [],
    districts: [],
    states: [],
    areas: [],
  });

  const ShiftOption = [
    {
      label: "Day",
      value: "day",
    },
    {
      label: "Night",
      value: "night",
    },
  ];

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

  const [viewForm, setViewForm] = useState(false);

  const onSubmit = (data) => {
    console.log("data==>", data);

    if (details?.id) {
    } else {
      if (tempAgreement.length > 0 && tempService.length > 0) {
      } else {
        toasterAlert({
          message: "Please Add Agreement and Service.",
          status: 440,
        });
        return;
      }
    }

    let data_obj = { ...data, contact_no: `+91${data.contact_no}` };
    if (details?.id) {
      let tempAgreement2 = [
        ...tempAgreement,
        ...getValues("agreement").map((item) => ({
          id: item?.id,
          agreement_start_date: item?.agreement_start_date,
          agreement_end_date: item?.agreement_end_date,
          agreement_upload_path: item?.agreement_upload_path,
        })),
      ];

      let tempService2 = [...tempService].concat(
        ...getValues("agreement").map((item) =>
          item.services.map((service) => ({
            id: service?.id,
            agreement: item?.id,
            shift_details: service?.shift_details,
            service_type_cost: service?.service_type_cost,
            security_agency_service_type: service?.security_agency_service_type,
          }))
        )
      );

      updateData({
        ...data_obj,
        id: details.id,
        agreement: tempAgreement2,
        services: tempService2,
      });
    } else {
      addData({ ...data_obj, agreement: tempAgreement, services: tempService });
    }
  };

  // for clear data in form
  const clearForm = () => {
    setTempAgreement([]);
    setTempService([]);
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      if (key === "services" || key === "agreement") {
      } else {
        setValue(key, "", {
          shouldValidate: true,
        });
      }
    });
  };

  const [
    addSecurityAgencyMaster,
    { isLoading: addSecurityAgencyMasterIsLoading },
  ] = useAddSecurityAgencyMasterMutation();

  const [
    updateSecurityAgencyMaster,
    { isLoading: updateSecurityAgencyMasterApiIsLoading },
  ] = useUpdateSecurityAgencyMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addSecurityAgencyMaster(data).unwrap();
      // console.log("add security agency master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_VENDORS_SECURITY_AGENCY}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data ||
        error?.data?.data ||
        error?.data?.message ||
        "Hiring Form Submission Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const getSecurityAgency = async () => {
    try {
      setAddEditFormFieldsList(
        addEditFormFields.map((field) => {
          return field;
        })
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateData = async (data) => {
    try {
      let finalData = data;
      const response = await updateSecurityAgencyMaster(finalData).unwrap();
      if (response.status === 200) {
        // console.log("update security agency master res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_VENDORS_SECURITY_AGENCY}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data ||
        error?.data?.data ||
        error?.data?.message ||
        "Hiring Form Submission Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Region State  Zone District Area  onChange drill down api start //

  // location drill down api hook
  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownFreeMutation();

  const getRegionMasterList = async () => {
    try {
      const response = await fetchLocationDrillDown().unwrap();
      // console.log("getRegionMasterList:", response);
      setSelectBoxOptions((prev) => ({
        ...prev,
        regions: response?.region?.map(({ region_name, id }) => ({
          label: region_name,
          value: id,
        })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const regionOnChange = async (val) => {
    // console.log("value --> ", val);
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

    setValue("area", null, {
      shouldValidate: false,
    });

    const query = {
      region: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        states: response?.state
          ?.filter((item) => item.state_name !== "All - State")
          .map(({ state_name, id }) => ({
            label: state_name,
            value: id,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stateOnChange = async (val) => {
    // console.log("value --> ", val);
    setValue("state", val?.value, {
      shouldValidate: true,
    });

    setValue("substate", null, {
      shouldValidate: false,
    });

    setValue("district", null, {
      shouldValidate: false,
    });

    setValue("area", null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues("region"),
      state: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        substate: response?.substate
          ?.filter((item) => item.substate_name !== "All - Zone")
          .map(({ substate_name, id }) => ({
            label: substate_name,
            value: id,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const zoneOnChange = async (val) => {
    // console.log("value --> ", val);
    setValue("substate", val?.value, {
      shouldValidate: true,
    });

    setValue("district", null, {
      shouldValidate: false,
    });

    setValue("area", null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues("region"),
      state: getValues("state"),
      substate: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);
      setSelectBoxOptions((prev) => ({
        ...prev,
        districts: response?.district
          ?.filter((item) => item.district_name !== "All - District")
          .map(({ district_name, id }) => ({
            label: district_name,
            value: id,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const districtOnChange = async (val) => {
    // console.log("value --> ", val);
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

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);

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

  const areaOnChange = (val) => {
    setValue("area", val?.value, {
      shouldValidate: true,
    });
  };

  // Region State  Zone District Area  onChange drill down api end //

  // Guard Type Api Start

  const [fetchGuardType, { isLoading: fetchFetchGuardTypeApiIsLoading }] =
    useGetSecurityGuardTypeMasterMutation();

  const getGuardTypeList = async () => {
    try {
      const response = await fetchGuardType().unwrap();
      // console.log("getGuardTypeList:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.service_type_name,
        value: item.id,
      }));

      console.log(arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        guard_type: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Guard Type Api End

  const [serviceList, setServiceList] = useState({
    agreement_id: null,
    agreement_start_date: null,
    agreement_end_date: null,
    agreement_upload_path: null,
    service_id: null,
    shift_details: null,
    service_type_cost: null,
    security_agency_service_type: null,
  });

  const [serviceError, setServiceError] = useState({
    agreement_id: "",
    agreement_start_date: "",
    agreement_end_date: "",
    agreement_upload_path: "",
    service_id: "",
    shift_details: "",
    service_type_cost: "",
    security_agency_service_type: "",
  });

  const [tempAgreement, setTempAgreement] = useState([]);

  const [tempService, setTempService] = useState([]);

  const [updateServiceId, setUpdateServiceId] = useState(null);

  const ServiceCheckingFunction = () => {
    const nullAgreementError =
      serviceList.agreement_id === null
        ? tempService?.filter(
            (item) =>
              item?.security_agency_service_type ===
                serviceList?.security_agency_service_type &&
              item?.shift_details === serviceList?.shift_details
          )?.length > (updateServiceId === null ? 0 : 1)
          ? false
          : true
        : true;

    const IdAgreementError =
      serviceList.agreement_id !== null
        ? getValues("agreement")
            ?.filter((item) => item.id === serviceList.agreement_id)[0]
            ?.services?.filter(
              (item) =>
                item?.security_agency_service_type ===
                  serviceList?.security_agency_service_type &&
                item?.shift_details === serviceList?.shift_details
            )?.length > (updateServiceId === null ? 0 : 1)
          ? false
          : true
        : true;

    const result =
      serviceList.agreement_start_date !== null &&
      serviceList.agreement_end_date !== null &&
      serviceList.agreement_upload_path !== null &&
      serviceList.shift_details !== null &&
      serviceList.service_type_cost !== null &&
      serviceList.service_type_cost > 0 &&
      serviceList.security_agency_service_type !== null &&
      nullAgreementError &&
      IdAgreementError;

    if (!nullAgreementError || !IdAgreementError) {
      toasterAlert({
        message:
          "Service Type and Shift Combination Can not be added repeatedly.",
        status: 440,
      });
    }

    return result;
  };

  const ServiceErrorFunction = () => {
    setServiceError({
      agreement_start_date:
        serviceList.agreement_start_date !== null ? "" : "Error",
      agreement_end_date:
        serviceList.agreement_end_date !== null ? "" : "Error",
      agreement_upload_path:
        serviceList.agreement_upload_path !== null ? "" : "Error",
      shift_details: serviceList.shift_details !== null ? "" : "Error",
      service_type_cost:
        serviceList.service_type_cost !== null &&
        serviceList.service_type_cost > 0
          ? ""
          : "Error",
      security_agency_service_type:
        serviceList.security_agency_service_type !== null ? "" : "Error",
    });
  };

  const ServiceErrorClear = () => {
    setServiceError({
      agreement_id: "",
      agreement_start_date: "",
      agreement_end_date: "",
      agreement_upload_path: "",
      service_id: "",
      shift_details: "",
      service_type_cost: "",
      security_agency_service_type: "",
    });
  };

  const AddServiceFunction = () => {
    if (ServiceCheckingFunction()) {
      if (serviceList?.agreement_id === null) {
        setTempAgreement([
          {
            id: serviceList?.agreement_id,
            agreement_start_date: serviceList?.agreement_start_date,
            agreement_end_date: serviceList?.agreement_end_date,
            agreement_upload_path: serviceList?.agreement_upload_path,
          },
        ]);
        setTempService((old) => [
          ...old,
          {
            id: serviceList?.service_id,
            agreement: serviceList?.agreement_id,
            shift_details: serviceList?.shift_details,
            service_type_cost: serviceList?.service_type_cost,
            security_agency_service_type:
              serviceList?.security_agency_service_type,
          },
        ]);
      } else {
        let temp = null;

        let tempArray = getValues("agreement");

        tempArray?.map((item, index) =>
          item.id === serviceList.agreement_id ? (temp = index) : null
        );

        if (temp !== null) {
          let resultArray = {
            id: serviceList?.agreement_id,
            agreement_start_date: serviceList?.agreement_start_date,
            agreement_end_date: serviceList?.agreement_end_date,
            agreement_upload_path: serviceList?.agreement_upload_path,
            services: [
              ...getValues("agreement")[temp].services,
              {
                id: serviceList?.service_id,
                agreement: serviceList?.agreement_id,
                shift_details: serviceList?.shift_details,
                service_type_cost: serviceList?.service_type_cost,
                security_agency_service_type:
                  serviceList?.security_agency_service_type,
              },
            ],
          };

          setValue(
            "agreement",
            [
              ...getValues("agreement").slice(0, temp),
              resultArray,
              ...getValues("agreement").slice(temp + 1),
            ],
            { shouldValidate: true }
          );
        }
      }
      setServiceList((old) => ({
        ...old,
        service_id: null,
        shift_details: null,
        service_type_cost: null,
        security_agency_service_type: null,
      }));
      ServiceErrorClear();
      setUpdateServiceId(null);
    } else {
      ServiceErrorFunction();
    }
  };

  const UpdateServiceFunction = () => {
    if (ServiceCheckingFunction()) {
      if (serviceList?.agreement_id === null) {
        setTempAgreement([
          {
            id: serviceList?.agreement_id,
            agreement_start_date: serviceList?.agreement_start_date,
            agreement_end_date: serviceList?.agreement_end_date,
            agreement_upload_path: serviceList?.agreement_upload_path,
          },
        ]);
        setTempService((old) => [
          ...old.slice(0, updateServiceId),
          {
            id: serviceList?.service_id,
            agreement: serviceList?.agreement_id,
            shift_details: serviceList?.shift_details,
            service_type_cost: serviceList?.service_type_cost,
            security_agency_service_type:
              serviceList?.security_agency_service_type,
          },
          ...old.slice(updateServiceId + 1),
        ]);
      } else {
        let temp = null;

        let tempArray = getValues("agreement");

        tempArray?.map((item, index) =>
          item.id === serviceList.agreement_id ? (temp = index) : null
        );

        if (temp !== null) {
          let resultArray = {
            id: serviceList?.agreement_id,
            agreement_start_date: serviceList?.agreement_start_date,
            agreement_end_date: serviceList?.agreement_end_date,
            agreement_upload_path: serviceList?.agreement_upload_path,
            services: [
              ...getValues("agreement")[temp].services.slice(
                0,
                updateServiceId
              ),
              {
                id: serviceList?.service_id,
                agreement: serviceList?.agreement_id,
                shift_details: serviceList?.shift_details,
                service_type_cost: serviceList?.service_type_cost,
                security_agency_service_type:
                  serviceList?.security_agency_service_type,
              },
              ...getValues("agreement")[temp].services.slice(
                updateServiceId + 1
              ),
            ],
          };

          setValue(
            "agreement",
            [
              ...getValues("agreement").slice(0, temp),
              resultArray,
              ...getValues("agreement").slice(temp + 1),
            ],
            { shouldValidate: true }
          );
        }
      }

      setServiceList((old) => ({
        ...old,
        service_id: null,
        shift_details: null,
        service_type_cost: null,
        security_agency_service_type: null,
      }));
      setUpdateServiceId(null);
      ServiceErrorClear();
    } else {
      ServiceErrorFunction();
    }
  };

  const UpdateAgreementService = (data, agreementData, id) => {
    console.log(data, agreementData, id);
    if (data?.agreement === null) {
      setServiceList({
        agreement_id: agreementData[0].id,
        agreement_start_date: agreementData[0].agreement_start_date,
        agreement_end_date: agreementData[0].agreement_end_date,
        agreement_upload_path: agreementData[0].agreement_upload_path,
        service_id: data.id,
        shift_details: data.shift_details,
        service_type_cost: data.service_type_cost,
        security_agency_service_type: data.security_agency_service_type,
      });
    } else {
      setServiceList({
        agreement_id: agreementData.id,
        agreement_start_date: agreementData.agreement_start_date,
        agreement_end_date: agreementData.agreement_end_date,
        agreement_upload_path: agreementData.agreement_upload_path,
        service_id: data.id,
        shift_details: data.shift_details,
        service_type_cost: data.service_type_cost,
        security_agency_service_type: data.security_agency_service_type,
      });
    }
    setUpdateServiceId(id);
  };

  const ChangeAgreement = () => {
    ServiceErrorClear();
    setServiceList({
      agreement_id: null,
      agreement_start_date: null,
      agreement_end_date: null,
      agreement_upload_path: null,
      service_id: null,
      shift_details: null,
      service_type_cost: null,
      security_agency_service_type: null,
    });
  };

  useEffect(() => {
    getSecurityAgency();
    getGuardTypeList();

    if (details?.id) {
      // console.log("on edit time ---->", details);
      regionOnChange({ value: details?.region?.id });
      stateOnChange({ value: details?.state?.id });
      zoneOnChange({ value: details?.substate?.id });
      districtOnChange({ value: details.district?.id });
      areaOnChange({ value: details.area?.id });
      // phoneNumber.replace(/^\+91/, '')

      const agreement = details?.agreements?.map((item) => ({
        id: item?.id,
        agreement_start_date: item?.agreement_start_date,
        agreement_end_date: item?.agreement_end_date,
        agreement_upload_path: item?.agreement_upload_path,
        services: item?.services?.map((item2) => ({
          id: item2?.id,
          agreement: item2?.agreement?.id,
          shift_details: item2?.shift_details,
          service_type_cost: item2?.service_type_cost,
          security_agency_service_type: item2?.security_agency_service_type?.id,
        })),
      }));

      let obj = {
        security_agency_name: details.security_agency_name,
        region: details?.region?.id,
        state: details?.state?.id,
        district_name: details?.district?.id,
        substate: details?.substate?.id,
        area: details?.area?.id,
        security_agency_address: details?.security_agency_address,
        pincode: details?.pincode,
        contact_no: details?.contact_no.replace(/^\+91/, ""),
        service_cost: details?.service_cost,
        contact_person_name: details?.contact_person_name,
        remarks: details?.remarks,
        epf_no: details?.epf_no,
        security_agency_gstin: details?.security_agency_gstin,
        esic_no: details?.esic_no,
        is_active: details?.is_active,
        agreement: agreement,
      };

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }

    setViewForm(location?.state?.view || false);

    const breadcrumbArray = [
      // {
      //   title: "Manage Vendors",
      //   link: "/security-agency-master",
      // },
      {
        title: " Security Agency Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_VENDORS_SECURITY_AGENCY}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);

  useEffect(() => {
    getRegionMasterList();
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  return (
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
            <Box>
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Security agency Name{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="security_agency_name"
                      placeholder="Security agency Name"
                      type="text"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* All the state, subState,region,district,area master html code stat from here */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Region <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
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
                  >
                    <Text textAlign="right">
                      State <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="state"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
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
                  >
                    <Text textAlign="right">
                      Sub State <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="substate"
                      label=""
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
                  >
                    <Text textAlign="right">
                      District <span style={{ color: "red" }}>*</span>
                    </Text>{" "}
                    <ReactCustomSelect
                      selectDisable={viewForm}
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
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        districtOnChange(val);
                      }}
                    />
                  </Grid>
                </MotionSlideUp>{" "}
              </Box>
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                >
                  <Text textAlign="right">
                    Area <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                  <ReactCustomSelect
                    selectDisable={viewForm}
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

              {addEditFormFieldsList &&
                addEditFormFieldsList.map((item, i) => (
                  <MotionSlideUp key={i} duration={0.2 * i} delay={0.1 * i}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        {item.label}
                        {item.label === "Remarks" ? null : (
                          <span style={{ color: "red", marginLeft: "4px" }}>
                            *
                          </span>
                        )}
                      </Text>{" "}
                      {generateFormField({
                        ...item,
                        label: "",
                        // options: item.type === "select" && commodityTypeMaster,
                        selectedValue:
                          item.type === "select" &&
                          item?.options?.find(
                            (opt) =>
                              opt.label ===
                              details?.commodity_type?.commodity_type
                          ),
                        selectType: "label",
                        isChecked: details?.active,
                        isClearable: false,
                        style: { mb: 1, mt: 1 },
                        inputDisabled: viewForm,
                      })}
                    </Grid>
                  </MotionSlideUp>
                ))}

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">Active</Text>
                    <CustomSwitch
                      isDisabled={viewForm}
                      name="is_active"
                      // type="switch"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      isChecked={initialIsActive}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>
            </Box>

            <Box>
              <Grid
                gap={4}
                templateColumns={"repeat(3, 1fr)"}
                alignItems="center"
                mt="10px"
              >
                <Text
                  textAlign="right"
                  color={"#212121"}
                  fontWeight={"semibold"}
                >
                  Services*
                </Text>
              </Grid>
            </Box>

            <Box>
              <Box bg="#DBFFF5" borderRadius={"16px"} padding={"20px"}>
                <Grid
                  templateColumns="repeat(3, 1fr)"
                  rowGap={4}
                  columnGap={5}
                  width="100%"
                >
                  <GridItem colSpan={3}>
                    <Text fontWeight={"700"} color="black">
                      Agreement Details*
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text mb="10px">
                      Agreement start date
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Input
                      isDisabled={viewForm}
                      placeholder="Agreement start date"
                      value={serviceList.agreement_start_date || ""}
                      type="date"
                      onChange={(e) => {
                        setServiceList((old) => ({
                          ...old,
                          agreement_start_date: e.target.value,
                          agreement_end_date: null,
                        }));
                      }}
                      style={inputStyle}
                      border="1px"
                      borderColor={
                        serviceError.agreement_start_date ? "red" : "gray.10"
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <Text mb="10px">
                      Agreement end date
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Input
                      isDisabled={viewForm}
                      placeholder="Agreement end date"
                      value={serviceList.agreement_end_date || ""}
                      type="date"
                      min={serviceList.agreement_start_date}
                      onChange={(e) => {
                        setServiceList((old) => ({
                          ...old,
                          agreement_end_date: e.target.value,
                        }));
                      }}
                      style={inputStyle}
                      border="1px"
                      borderColor={
                        serviceError.agreement_end_date ? "red" : "gray.10"
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <Text mb="10px">
                      Upload Agreement
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomFileInput
                      InputDisabled={viewForm}
                      name={"agreement_upload_path"}
                      placeholder="Agreement upload"
                      label=""
                      type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword"
                      fileuplaod_folder_structure={{
                        type: "master",
                        subtype: "Security Agency Master",
                      }}
                      defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                      onChange={(e) => {
                        console.log(e, "file");
                        setServiceList((old) => ({
                          ...old,
                          agreement_upload_path: e,
                        }));
                      }}
                      value={serviceList.agreement_upload_path}
                      showErr={
                        serviceError?.agreement_upload_path ? true : false
                      }
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </GridItem>
                  {details?.id ? (
                    <GridItem colSpan={3} textAlign="right">
                      <Button
                        type="button"
                        //w="full"
                        backgroundColor={"primary.700"}
                        _hover={{ backgroundColor: "primary.700" }}
                        color={"white"}
                        borderRadius={"full"}
                        px={"10"}
                        isDisabled={viewForm ? true : false}
                        onClick={() => {
                          ChangeAgreement();
                        }}
                      >
                        Change agreement
                      </Button>
                    </GridItem>
                  ) : (
                    <></>
                  )}
                  <GridItem colSpan={3}>
                    <Box height="1" bg="#0002" borderRadius="100px" />
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Text fontWeight={"700"} color="black">
                      Services Details*
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text mb="10px">
                      Security guard type
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactSelect
                      isDisabled={viewForm}
                      options={selectBoxOptions?.guard_type || []}
                      value={
                        selectBoxOptions?.guard_type?.filter(
                          (item) =>
                            item.value ===
                            serviceList.security_agency_service_type
                        )[0] || {}
                      }
                      isLoading={fetchFetchGuardTypeApiIsLoading}
                      onChange={(val) => {
                        setServiceList((old) => ({
                          ...old,
                          security_agency_service_type: val.value,
                        }));
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: serviceError.security_agency_service_type
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
                    <Text mb="10px">
                      Shift
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactSelect
                      isDisabled={viewForm}
                      options={ShiftOption || []}
                      value={
                        ShiftOption.filter(
                          (item) => item.value === serviceList.shift_details
                        )[0] || {}
                      }
                      isLoading={false}
                      onChange={(val) => {
                        setServiceList((old) => ({
                          ...old,
                          shift_details: val.value,
                        }));
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: serviceError.shift_details
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
                    <Text mb="10px">
                      Salary
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Input
                      isDisabled={viewForm}
                      placeholder="Salary"
                      value={serviceList.service_type_cost || ""}
                      type="number"
                      onChange={(e) => {
                        console.log(e.target.value);
                        setServiceList((old) => ({
                          ...old,
                          service_type_cost: e.target.value,
                        }));
                      }}
                      style={inputStyle}
                      border="1px"
                      borderColor={
                        serviceError.service_type_cost ? "red" : "gray.10"
                      }
                    />
                  </GridItem>
                  <GridItem colSpan={3} textAlign="right">
                    <Button
                      type="button"
                      //w="full"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      isDisabled={viewForm ? true : false}
                      px={"10"}
                      onClick={() => {
                        updateServiceId === null
                          ? AddServiceFunction()
                          : UpdateServiceFunction();
                      }}
                    >
                      {updateServiceId === null
                        ? "Add services"
                        : "Edit services"}
                    </Button>
                  </GridItem>
                </Grid>
              </Box>
            </Box>
            <Box mt="10px" overflow={"auto"}>
              <table width="100%">
                <thead style={{ background: "#DBFFF5" }}>
                  <tr>
                    <th
                      style={{
                        padding: tableStyle.generalPadding,
                      }}
                    >
                      Agreement Start Date
                    </th>
                    <th
                      style={{
                        padding: tableStyle.generalPadding,
                      }}
                    >
                      Agreement End Date
                    </th>
                    <th
                      style={{
                        padding: tableStyle.generalPadding,
                      }}
                    >
                      Security Guard Type
                    </th>
                    <th
                      style={{
                        padding: tableStyle.generalPadding,
                      }}
                    >
                      Shift
                    </th>
                    <th
                      style={{
                        padding: tableStyle.generalPadding,
                      }}
                    >
                      Salary/Month (RS)
                    </th>
                    <th
                      style={{
                        padding: tableStyle.generalPadding,
                      }}
                    >
                      Agreement Download
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
                  {tempService?.length > 0 ||
                  getValues("agreement")?.length > 0 ? (
                    <>
                      {tempService?.map((item, index) => (
                        <tr>
                          {index === 0 ? (
                            <>
                              <td
                                style={{
                                  padding: tableStyle.generalPadding,
                                }}
                                rowSpan={tempService.length}
                              >
                                {moment(
                                  tempAgreement[0]?.agreement_start_date || ""
                                ).format("LL")}
                              </td>
                              <td
                                style={{
                                  padding: tableStyle.generalPadding,
                                }}
                                rowSpan={tempService.length}
                              >
                                {moment(
                                  tempAgreement[0]?.agreement_end_date || ""
                                ).format("LL")}
                              </td>
                            </>
                          ) : (
                            <></>
                          )}
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            {selectBoxOptions?.guard_type?.filter(
                              (old) =>
                                old.value === item.security_agency_service_type
                            )[0]?.label || "-"}
                          </td>
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            {item.shift_details}
                          </td>
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            {item.service_type_cost}
                          </td>
                          {index === 0 ? (
                            <td
                              style={{
                                padding: tableStyle.generalPadding,
                              }}
                              rowSpan={tempService.length}
                            >
                              <BiDownload
                                fontSize="26px"
                                cursor="pointer"
                                onClick={() => {
                                  window.open(
                                    `${configuration.BASE_URL}${
                                      tempAgreement[0]?.agreement_upload_path ||
                                      ""
                                    }`,
                                    "_blank"
                                  );
                                }}
                              />
                            </td>
                          ) : (
                            <></>
                          )}
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            <Flex gap="20px" justifyContent="center">
                              <Box color={"primary.700"}>
                                <BiEditAlt
                                  // color="#A6CE39"
                                  fontSize="26px"
                                  cursor="pointer"
                                  onClick={() => {
                                    if (viewForm === true) {
                                    } else {
                                      UpdateAgreementService(
                                        item,
                                        tempAgreement,
                                        index
                                      );
                                    }
                                  }}
                                />
                              </Box>
                            </Flex>
                          </td>
                        </tr>
                      ))}
                      {getValues("agreement")?.map((item, index) =>
                        item?.services?.map((item2, index2) => (
                          <tr>
                            {index2 === 0 ? (
                              <>
                                <td
                                  style={{
                                    padding: tableStyle.generalPadding,
                                  }}
                                  rowSpan={item?.services?.length}
                                >
                                  {moment(
                                    item?.agreement_start_date || ""
                                  ).format("DD/MM/YYYY")}
                                </td>
                                <td
                                  style={{
                                    padding: tableStyle.generalPadding,
                                  }}
                                  rowSpan={item?.services?.length}
                                >
                                  {moment(
                                    item?.agreement_end_date || ""
                                  ).format("DD/MM/YYYY")}
                                </td>
                              </>
                            ) : (
                              <></>
                            )}
                            <td
                              style={{
                                padding: tableStyle.generalPadding,
                              }}
                            >
                              {selectBoxOptions?.guard_type?.filter(
                                (old) =>
                                  old.value ===
                                  item2.security_agency_service_type
                              )[0]?.label || "-"}
                            </td>
                            <td
                              style={{
                                padding: tableStyle.generalPadding,
                              }}
                            >
                              {item2.shift_details}
                            </td>
                            <td
                              style={{
                                padding: tableStyle.generalPadding,
                              }}
                            >
                              {item2.service_type_cost}
                            </td>
                            {index2 === 0 ? (
                              <td
                                style={{
                                  padding: tableStyle.generalPadding,
                                }}
                                rowSpan={item?.services?.length}
                              >
                                <BiDownload
                                  fontSize="26px"
                                  cursor="pointer"
                                  onClick={() => {
                                    window.open(
                                      `${configuration.BASE_URL}${
                                        item?.agreement_upload_path || ""
                                      }`,
                                      "_blank"
                                    );
                                  }}
                                />
                              </td>
                            ) : (
                              <></>
                            )}
                            <td
                              style={{
                                padding: tableStyle.generalPadding,
                              }}
                            >
                              {moment(item?.agreement_end_date || "").isAfter(
                                today
                              ) ? (
                                <Flex gap="20px" justifyContent="center">
                                  <Box color={"primary.700"}>
                                    <BiEditAlt
                                      // color="#A6CE39"
                                      fontSize="26px"
                                      cursor="pointer"
                                      onClick={() => {
                                        if (viewForm === true) {
                                        } else {
                                          UpdateAgreementService(
                                            item2,
                                            item,
                                            index2
                                          );
                                        }
                                      }}
                                    />
                                  </Box>
                                </Flex>
                              ) : (
                                <></>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </>
                  ) : (
                    <tr>
                      <td
                        style={{
                          padding: tableStyle.generalPadding,
                          textAlign: "center",
                        }}
                        colSpan={8}
                      >
                        No Data Added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>
            {formState?.errors?.services ? (
              <Text color="red">{formState?.errors?.services?.message}</Text>
            ) : (
              <></>
            )}

            <Box
              display="flex"
              gap={2}
              justifyContent="flex-end"
              mt="10"
              px="0"
            >
              <Button
                type="button"
                backgroundColor={"white"}
                borderWidth={"1px"}
                borderColor={"#F82F2F"}
                _hover={{ backgroundColor: "" }}
                color={"#F82F2F"}
                borderRadius={"full"}
                my={"4"}
                px={"10"}
                onClick={clearForm}
                isDisabled={viewForm ? true : false}
              >
                Clear
              </Button>
              <Button
                type="submit"
                //w="full"
                backgroundColor={"primary.700"}
                _hover={{ backgroundColor: "primary.700" }}
                color={"white"}
                borderRadius={"full"}
                isLoading={
                  addSecurityAgencyMasterIsLoading ||
                  updateSecurityAgencyMasterApiIsLoading
                }
                isDisabled={viewForm ? true : false}
                my={"4"}
                px={"10"}
              >
                {details?.id ? "Update" : "Add"}
              </Button>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AddEditFormSecurityAgencyMaster;

const toasterAlert = (obj) => {
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
};
