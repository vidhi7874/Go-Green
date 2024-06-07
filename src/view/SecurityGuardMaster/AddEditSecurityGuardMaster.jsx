/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
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
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import generateFormField from "../../components/Elements/GenerateFormField";
import { addEditFormFields, schema } from "./fields";
import {
  useAddSecurityGuardMasterMutation,
  useGetAreaFreeMasterMutation,
  useGetDistrictFreeMasterMutation,
  useGetRegionFreeMasterMutation,
  useGetSecurityAgencyMasterFreeApiMutation,
  useGetSecurityGuardByIdMasterMutation,
  useGetStateFreeMasterMutation,
  useGetWareHouseFreeMutation,
  useGetZoneFreeMasterMutation,
  useUpdateSecurityGuardMasterMutation,
} from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { MotionSlideUp } from "../../utils/animation";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomInput from "../../components/Elements/CustomInput";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import moment from "moment";
import { EditIcon } from "@chakra-ui/icons";
import ReactSelect from "react-select";
import ROUTE_PATH from "../../constants/ROUTE";

const AddEditSecurityGuardMaster = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const details = location.state?.details;

  // For deisgn css
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
    md: "repeat(3, 2fr)",
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

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    // mode : 'onChange',
    // defaultValues: {
    //   is_active: !details?.id, // Set is_active to true only when adding
    // },
  });

  const initialIsActive = details ? details.is_active : true;

  const {
    setValue,
    getValues,
    watch,
    register,
    formState: { errors },
  } = methods;

  // const [addEditFormFieldsList, setAddEditFormFieldsList] =
  //   useState(addEditFormFields);

  const addEditFormFieldsList = addEditFormFields;

  const [showAgeWarning, setShowAgeWarning] = useState({});

  // Startig code for salary and the email attachment hide show

  const [showEmailAttachment, setShowEmailAttachment] = useState(false);

  const handleEditClick = () => {
    setShowEmailAttachment(true);
    // setIsInputDisabled(!getValues("email_attachment"));
  };

  // Ending code for salary and the email attachment hide show

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    substate: [],
    districts: [],
    states: [],
    areas: [],
    securityAgency: [],
    shift: [],
  });

  console.log("details ---> ", details);

  console.log("errors", errors);

  // for clear data in form
  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      setValue(key, "", {
        shouldValidate: true,
      });
    });
  };
  const [viewForm, setViewForm] = useState(false);
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
            ({
              warehouse_number,
              id,
              region,
              state,
              district,
              substate,
              area,
              warehouse_proposal_number,
            }) => ({
              label: warehouse_number,
              value: id,
              region: region?.id || 0,
              state: state?.id || 0,
              district: district?.id || 0,
              substate: substate?.id || 0,
              area: area?.id || 0,
              warehouse_proposal_number: warehouse_proposal_number,
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
    setValue(
      "warehouse_hiring_proposal",
      selectBoxOptions?.warehouse?.filter(
        (item) => item.value === getValues("warehouse_id")
      )[0]?.warehouse_proposal_number || "",
      {
        shouldValidate: true,
      }
    );
    setValue(
      "region",
      selectBoxOptions?.regions?.filter(
        (item) =>
          item.value ===
            selectBoxOptions?.warehouse?.filter(
              (item) => item.value === getValues("warehouse_id")
            )[0]?.region || 0
      )[0]?.value,
      {
        shouldValidate: true,
      }
    );
    setValue(
      "state",
      selectBoxOptions?.states?.filter(
        (item) =>
          item.value ===
            selectBoxOptions?.warehouse?.filter(
              (item) => item.value === getValues("warehouse_id")
            )[0]?.state || 0
      )[0]?.value,
      {
        shouldValidate: true,
      }
    );
    setValue(
      "substate",
      selectBoxOptions?.substate?.filter(
        (item) =>
          item.value ===
            selectBoxOptions?.warehouse?.filter(
              (item) => item.value === getValues("warehouse_id")
            )[0]?.substate || 0
      )[0]?.value,
      {
        shouldValidate: true,
      }
    );
    setValue(
      "district",
      selectBoxOptions?.districts?.filter(
        (item) =>
          item.value ===
            selectBoxOptions?.warehouse?.filter(
              (item) => item.value === getValues("warehouse_id")
            )[0]?.district || 0
      )[0]?.value,
      {
        shouldValidate: true,
      }
    );
    setValue(
      "area",
      selectBoxOptions?.areas?.filter(
        (item) =>
          item.value ===
            selectBoxOptions?.warehouse?.filter(
              (item) => item.value === getValues("warehouse_id")
            )[0]?.area || 0
      )[0]?.value,
      {
        shouldValidate: true,
      }
    );
  }, [getValues("warehouse_id")]);

  // Warehouse Master end

  // Region and all location api calling start

  const [fetchRegionFree] = useGetRegionFreeMasterMutation();

  const [fetchStateFree] = useGetStateFreeMasterMutation();

  const [fetchSubStateFree] = useGetZoneFreeMasterMutation();

  const [fetchDistrictFree] = useGetDistrictFreeMasterMutation();

  const [fetchAreaFree] = useGetAreaFreeMasterMutation();

  const getRegionList = async () => {
    try {
      const response = await fetchRegionFree().unwrap();
      console.log("getRegionList", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        regions: response?.data
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
        states: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ state_name, id }) => ({
            label: state_name,
            value: id,
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
        substate: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ substate_name, id }) => ({
            label: substate_name,
            value: id,
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
        districts: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ district_name, id }) => ({
            label: district_name,
            value: id,
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
        areas: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ area_name, id }) => ({
            label: area_name,
            value: id,
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

  // Region and all location api calling end

  // Guard Add and Update Logic Start

  const onSubmit = (data) => {
    console.log("data==>", data);
    let formObj = {
      ...data,
      deboarding_date:
        data.deboarding_date === "" ? null : data.deboarding_date,
      contact_number: `+91${data.contact_number}`,
      alternate_contact_number: `+91${data.alternate_contact_number}`,
    };
    if (details?.id) {
      updateData({
        ...formObj,
        id: details.id,
      });
    } else {
      addData({
        deboarding_date: "",
        ...formObj,
        security_guard_warehouse_mapping: [{ warehouse: data.warehouse_id }],
      });
    }
  };

  const [
    addSecurityGuardMaster,
    { isLoading: addSecurityGuardMasterApiIsLoading },
  ] = useAddSecurityGuardMasterMutation();

  const [
    updateSecurityGuardMaster,
    { isLoading: updateSecurityGuardMasterApiIsLoading },
  ] = useUpdateSecurityGuardMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addSecurityGuardMaster(data).unwrap();
      console.log("add security guard res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(
          `${ROUTE_PATH.ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_GUARD}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  const updateData = async (data) => {
    try {
      const response = await updateSecurityGuardMaster(data).unwrap();
      if (response.status === 200) {
        console.log(data, "yoooo");
        console.log("update security guard master res", response);
        toasterAlert(response);
        navigate(
          `${ROUTE_PATH.ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_GUARD}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  // Guard Add and Update Logic End

  // Guard History Start

  const [getSecurityGuardByIdMaster] = useGetSecurityGuardByIdMasterMutation();

  const [transferHistory, setTransferHistory] = useState([]);

  const getSecurityGuardMasterById = async (query) => {
    try {
      const response = await getSecurityGuardByIdMaster(query).unwrap();

      let transfer_history = response?.data?.transfer_history?.map((item) => ({
        warehouse_name: item.warehouse.warehouse_name,
        status: item.status,
        start_date: item.start_date,
        end_date: item.end_date,
      }));

      methods.setValue(
        "warehouse_hiring_proposal",
        response?.data?.active_warehouse?.join(","),
        { shouldValidate: true }
      );

      let obj = {
        security_agency_id: response?.data?.security_agency_id?.id,
        security_guard_service_type:
          response?.data?.security_guard_service_type?.id,
        security_guard_name: response?.data?.security_guard_name,
        region: response?.data?.region?.id,
        state: response?.data?.state?.id,
        district: response?.data?.district?.id,
        substate: response?.data?.substate?.id,
        area: response?.data?.area?.id,
        aadhar_of_security_guard: response?.data?.aadhar_of_security_guard,
        onboarding_date: response?.data?.onboarding_date,
        deboarding_date: response?.data?.deboarding_date || "",
        shift_availability: response?.data?.shift_availability,
        salary: response?.data?.salary,
        address_of_security_guard: response?.data?.address_of_security_guard,
        dob_of_security_guard: response?.data?.dob_of_security_guard,
        contact_number: response?.data?.contact_number?.replace("+91", ""),
        alternate_contact_number:
          response?.data?.alternate_contact_number?.replace("+91", ""),
        experience_as_security_guard:
          response?.data?.experience_as_security_guard,
        email_attachment: response?.data?.email_attachment,
        adhaar_upload_path: response?.data?.adhaar_upload_path,
        active: response?.data?.active || false,
      };

      if (response?.data?.email_attachment?.length > 0) {
        setShowEmailAttachment(true);
      }
      const userAge = moment().diff(
        response?.data?.dob_of_security_guard,
        "years"
      );

      if (userAge < 18) {
        setShowAgeWarning((prev) => ({
          ...prev,
          dob_of_security_guard: {
            key: "dob_of_security_guard",
            msg: "User is younger than 18+",
          },
        }));
      } else {
        setShowAgeWarning((prev) => ({
          ...prev,
          dob_of_security_guard: {
            key: "dob_of_security_guard",
            msg: "",
          },
        }));
      }

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });

      //   warehouse_active_list
      setTransferHistory(transfer_history);
    } catch (error) {
      console.log(error);
    }
  };

  // Guard History Start

  // Security agency Logic Start

  const [services, setServices] = useState([]);
  const [gardType, setGardType] = useState([]);

  const [getSecurityAgencyMaster] = useGetSecurityAgencyMasterFreeApiMutation();

  const getSecurityAgencyList = async () => {
    try {
      const response = await getSecurityAgencyMaster().unwrap();
      console.log("getSecurityAgencyList:", response);
      if (response.status === 200) {
        let onlyActive = response?.data?.filter((item) => item.is_active);
        console.log(onlyActive, "yooooooo");
        let arr = onlyActive?.map((item) => ({
          label: item.security_agency_name,
          value: item.id,
          state: item?.state?.id,
          services: item?.current_agreement?.services || [],
        }));

        console.log(arr, "getSecurityAgencyList");

        setSelectBoxOptions((prev) => ({
          ...prev,
          securityAgency: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getSecurityAgencyList();
  }, []);

  useEffect(() => {
    let tempQuality2 = selectBoxOptions?.securityAgency?.filter(
      (item) => item.value === getValues("security_agency_id")
    )[0]?.services;

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
      if (isUnique(item.security_agency_service_type)) {
        uniqueObjects.push(item);
      }
    });

    const tempQuality = uniqueObjects?.map((item) => ({
      label: item.security_agency_service_type.service_type_name,
      value: item.security_agency_service_type.id,
    }));

    setServices(tempQuality);
  }, [getValues("security_agency_id"), selectBoxOptions]);

  useEffect(() => {
    let tempQuality2 = selectBoxOptions?.securityAgency?.filter(
      (item) => item.value === getValues("security_agency_id")
    )[0]?.services;

    setGardType(
      tempQuality2
        ?.filter(
          (item) =>
            item.security_agency_service_type.id ===
            getValues("security_guard_service_type")
        )
        ?.map((item) => ({
          label: item.shift_details,
          value: item.shift_details,
          id: item.id,
        })) || []
    );
  }, [getValues("security_guard_service_type"), selectBoxOptions]);

  useEffect(() => {
    if (fillData) {
      setFillData(false);
    } else {
      let tempQuality2 = selectBoxOptions?.securityAgency?.filter(
        (item) => item.value === getValues("security_agency_id")
      )[0]?.services;

      setValue(
        "salary",
        tempQuality2?.filter(
          (item) =>
            item.id ===
              gardType?.filter(
                (item) => item.value === getValues("shift_availability")
              )[0]?.id || 0
        )[0]?.service_type_cost || 0,
        {
          shouldValidate: true,
        }
      );
    }
  }, [getValues("shift_availability")]);

  // Security agency Logic End

  const [fillData, setFillData] = useState(false);

  useEffect(() => {
    // getSecurityGuard();
    if (details?.id) {
      getSecurityGuardMasterById({ id: details.id });

      setFillData(true);
    }

    setViewForm(location?.state?.view || false);

    const breadcrumbArray = [
      {
        title: "Security Guard Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_SECURITY_GUARD_SECIRITY_GUARD}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "dob_of_security_guard") {
        const userAge = moment().diff(value.dob_of_security_guard, "years");

        if (userAge < 18) {
          setShowAgeWarning((prev) => ({
            ...prev,
            dob_of_security_guard: {
              key: "dob_of_security_guard",
              msg: "User is younger than 18+",
            },
          }));
        } else {
          setShowAgeWarning((prev) => ({
            ...prev,
            dob_of_security_guard: {
              key: "dob_of_security_guard",
              msg: "",
            },
          }));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  methods.customData = {
    ...showAgeWarning,
  };

  return (
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
            <Box>
              {/* This is code for the security agency list code */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  {/* Region called */}
                  {details?.id ? (
                    <Box>
                      <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                        <Grid
                          gap={4}
                          templateColumns={"repeat(3, 1fr)"}
                          alignItems="center"
                        >
                          <Text textAlign="right">Warehouse Numbers</Text>
                          <CustomInput
                            name="warehouse_hiring_proposal"
                            placeholder="Warehouse Numbers"
                            type="text"
                            InputDisabled={true}
                            label=""
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

                  {details?.id ? (
                    <></>
                  ) : (
                    <Box>
                      <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                        <Grid
                          gap={4}
                          templateColumns={"repeat(3, 1fr)"}
                          alignItems="center"
                        >
                          <Text textAlign="right">
                            Warehouse Number
                            <span style={{ color: "red", marginLeft: "4px" }}>
                              *
                            </span>
                          </Text>

                          <ReactCustomSelect
                            selectDisable={viewForm}
                            name="warehouse_id"
                            options={selectBoxOptions?.warehouse || []}
                            selectedValue={
                              selectBoxOptions?.warehouse?.filter(
                                (item) =>
                                  item.value === getValues("warehouse_id")
                              )[0] || {}
                            }
                            isLoading={getWarehouseMasterApiIsLoading}
                            handleOnChange={(val) => {
                              setValue("warehouse_id", val.value, {
                                shouldValidate: true,
                              });
                              setValue("security_guard_service_type", null, {
                                shouldValidate: true,
                              });
                              setValue("salary", null, {
                                shouldValidate: true,
                              });
                              setValue("shift_availability", null, {
                                shouldValidate: true,
                              });
                              setValue("security_agency_id", null, {
                                shouldValidate: true,
                              });
                            }}
                          />
                        </Grid>
                      </MotionSlideUp>
                    </Box>
                  )}
                  {/* All the state, subState,region,district,area master html code stat from here */}

                  {/* Region called */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">Region</Text>
                        <CustomInput
                          name="region"
                          placeholder="Region"
                          type="text"
                          inputValue={
                            selectBoxOptions?.regions?.filter(
                              (item) => item.value === getValues("region")
                            )[0]?.label || ""
                          }
                          onChange={() => {}}
                          InputDisabled={true}
                          label=""
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* State called */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">State</Text>
                        <CustomInput
                          name="state"
                          placeholder="state"
                          type="text"
                          inputValue={
                            selectBoxOptions?.states?.filter(
                              (item) => item.value === getValues("state")
                            )[0]?.label || ""
                          }
                          onChange={() => {}}
                          InputDisabled={true}
                          label=""
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>
                  {/* SubState called */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">Sub State</Text>
                        <CustomInput
                          name="substate"
                          placeholder="Sub State"
                          type="text"
                          inputValue={
                            selectBoxOptions?.substate?.filter(
                              (item) => item.value === getValues("substate")
                            )[0]?.label || ""
                          }
                          onChange={() => {}}
                          InputDisabled={true}
                          label=""
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* District called */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">District</Text>
                        <CustomInput
                          name="district"
                          placeholder="District"
                          type="text"
                          inputValue={
                            selectBoxOptions?.districts?.filter(
                              (item) => item.value === getValues("district")
                            )[0]?.label || ""
                          }
                          onChange={() => {}}
                          InputDisabled={true}
                          label=""
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* Area called */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">Area</Text>
                        <CustomInput
                          name="area"
                          placeholder="Area"
                          type="text"
                          inputValue={
                            selectBoxOptions?.areas?.filter(
                              (item) => item.value === getValues("area")
                            )[0]?.label || ""
                          }
                          onChange={() => {}}
                          InputDisabled={true}
                          label=""
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>
                </MotionSlideUp>
              </Box>

              {/* Security guard name**/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Security guard name{" "}
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors.security_guard_name}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      isDisabled={viewForm}
                      {...register("security_guard_name")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Security guard name"
                    />
                    {errors && errors?.security_guard_name?.message && (
                      <Text textAlign="left" color="red">
                        {errors.security_guard_name.message}
                      </Text>
                    )}
                  </FormControl>
                </GridItem>
              </Grid>

              {/* Security guard residential Address**/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Security guard residential Address{" "}
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors.address_of_security_guard}
                    style={{ w: commonWidth.w }}
                  >
                    <Textarea
                      isDisabled={viewForm}
                      {...register("address_of_security_guard")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Address"
                    />
                  </FormControl>
                  {errors && errors?.address_of_security_guard?.message && (
                    <Text textAlign="left" color="red">
                      {errors?.address_of_security_guard?.messgae}
                    </Text>
                  )}
                </GridItem>
              </Grid>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Security Agency Name{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>{" "}
                    </Text>
                    <ReactSelect
                      isDisabled={viewForm}
                      {...register("security_agency_id")}
                      name="security_agency_id"
                      label=""
                      isLoading={false}
                      options={
                        selectBoxOptions?.securityAgency?.filter(
                          (item) => item.state === getValues("state")
                        ) || []
                      }
                      value={
                        selectBoxOptions?.securityAgency?.filter(
                          (item) =>
                            item.value === getValues("security_agency_id")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          // borderColor: clientError.clientType ? "red" : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                      onChange={(val) => {
                        setValue("security_guard_service_type", null, {
                          shouldValidate: true,
                        });
                        setValue("salary", null, {
                          shouldValidate: true,
                        });
                        setValue("shift_availability", null, {
                          shouldValidate: true,
                        });
                        setValue("security_agency_id", val?.value, {
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
                  >
                    <Text textAlign="right">
                      Security guard Service type{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="security_guard_service_type"
                      label=""
                      isLoading={false}
                      options={services || []}
                      selectedValue={
                        services?.filter(
                          (item) =>
                            item?.value ===
                            getValues("security_guard_service_type")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setValue("security_guard_service_type", val.value, {
                          shouldValidate: true,
                        });
                        setValue("salary", null, {
                          shouldValidate: true,
                        });
                        setValue("shift_availability", null, {
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
                  >
                    <Text textAlign="right">
                      Security guard shift type{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="shift_availability"
                      label=""
                      isLoading={false}
                      options={
                        details?.id
                          ? gardType.filter(
                              (item) =>
                                item.value === details?.shift_availability
                            ) || []
                          : gardType || []
                      }
                      selectedValue={
                        gardType.filter(
                          (item) =>
                            item.value === getValues("shift_availability")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setValue("shift_availability", val.value, {
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
                  >
                    <Text textAlign="right">
                      Salary{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <CustomInput
                      name="salary"
                      placeholder="Salary"
                      type="number"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      InputDisabled={
                        viewForm ? true : !getValues("email_attachment")
                      }
                    />
                    <Box
                      border={"1px solid lightgray"}
                      borderRadius={"md"}
                      padding={"1"}
                      w={"8"}
                      h={"8"}
                      as="flex"
                      onClick={handleEditClick}
                    >
                      <EditIcon color={"gray"} />
                    </Box>
                  </Grid>
                </MotionSlideUp>
              </Box>

              {showEmailAttachment && (
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        Email attachment{" "}
                        {/* <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span> */}
                      </Text>
                      <CustomFileInput
                        InputDisabled={viewForm}
                        name=""
                        value={getValues("email_attachment") || ""}
                        placeholder="Upload"
                        label=""
                        fileuplaod_folder_structure={{
                          type: "master",
                          subtype: "Security Guard Master",
                        }}
                        onChange={(e) => {
                          setValue("email_attachment", e, {
                            shouldValidate: true,
                          });
                        }}
                        type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                        defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                        maxSize={2}
                        showErr={errors?.email_attachment ? true : false}
                        style={{ w: "100%" }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>
              )}

              {/* Aadhar card id*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Aadhar card id{" "}
                    <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors.aadhar_of_security_guard}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      isDisabled={viewForm}
                      {...register("aadhar_of_security_guard")}
                      type="number"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Aadhar card"
                    />
                  </FormControl>
                  {errors && errors?.aadhar_of_security_guard?.message && (
                    <Text textAlign="left" color="red">
                      {errors?.aadhar_of_security_guard?.message}
                    </Text>
                  )}
                </GridItem>
              </Grid>

              {/* Upload aadhar card id  */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Upload Aadhar card
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <CustomFileInput
                      InputDisabled={viewForm}
                      name=""
                      type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                      defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                      label=""
                      value={getValues("adhaar_upload_path") || ""}
                      fileuplaod_folder_structure={{
                        type: "master",
                        subtype: "Security Guard Master",
                      }}
                      placeholder="Upload"
                      onChange={(e) => {
                        setValue("adhaar_upload_path", e, {
                          shouldValidate: true,
                        });
                      }}
                      showErr={errors?.adhaar_upload_path ? true : false}
                      style={{ w: "100%" }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {addEditFormFieldsList &&
                addEditFormFieldsList.map((item, i) => (
                  <MotionSlideUp key={i} duration={0.2 * i} delay={0.1 * i}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      {" "}
                      <Text textAlign="right">
                        {item.label}{" "}
                        {item.label === "Active" ? null : (
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
                    <Text textAlign="right">De Boarding Date</Text>
                    <CustomInput
                      name="deboarding_date"
                      placeholder="De Boarding Date"
                      type="date"
                      InputDisabled={true}
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
            {/* show warehouse owner details table start */}
            {details?.id ? (
              <TableContainer mt="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Sr no</Th>
                      <Th color="#000">Warehouse name</Th>
                      <Th color="#000">Start date</Th>
                      <Th color="#000">End date</Th>
                      <Th color="#000">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {transferHistory &&
                      transferHistory.map((item, i) => (
                        <Tr
                          key={`transferHistory${i}`}
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                        >
                          <Td>{i + 1}</Td>
                          <Td>{item.warehouse_name} </Td>
                          <Td>{item.start_date} </Td>
                          <Td>{item.end_date} </Td>
                          <Td>{item.status} </Td>
                          {/* <Td>
                      Active
                    </Td> */}
                        </Tr>
                      ))}
                    {transferHistory.length === 0 && (
                      <Tr textAlign="center">
                        <Td colSpan="5" color="#000">
                          No record found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <></>
            )}
            {/* show client table end */}
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
                  addSecurityGuardMasterApiIsLoading ||
                  updateSecurityGuardMasterApiIsLoading
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

export default AddEditSecurityGuardMaster;

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
