/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Flex,
  FormControl,
  Grid,
  Heading,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import generateFormField from "../../components/Elements/GenerateFormField";
import { addEditFormFields, qualityParameterSchema, schema } from "./fields";
import {
  useAddCommodityMasterMutation,
  useUpdateCommodityMasterMutation,
  useGetCommodityFreeTypeMasterMutation,
  useGetPrimaryCommodityTypeMutation,
} from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { MotionSlideUp } from "../../utils/animation";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import ReactSelect from "react-select";
import { useGetAllQualityMutation } from "../../features/masters/commodityApi.slice";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import ROUTE_PATH from "../../constants/ROUTE";

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

const commonWidth = {
  mt: 2,
  w: {
    base: "100%",
    sm: "80%",
    md: "60%",
    lg: "55%",
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

function isQualityParameterAlreadyExists(obj, array) {
  console.log(obj, array);
  for (let i = 0; i < array.length; i++) {
    if (
      array
        .filter((item) => item.quality_parameter === obj.quality_parameter)
        .filter((item) => item.quality_grade === obj.quality_grade).length > 0
    ) {
      console.log("quality");
      return true; // quality_parameter already exists
    } else {
      if (obj.permissible_value !== null && obj.permissible_value !== "") {
        console.log(
          "quality2",
          array
            .filter((item) => item.quality_parameter === obj.quality_parameter)
            .filter((item) => item.quality_grade !== obj.quality_grade)
            .find((item) => item.permissible_value === obj.permissible_value)
        );
        return array
          .filter((item) => item.quality_parameter === obj.quality_parameter)
          .filter((item) => item.quality_grade !== obj.quality_grade)
          .find((item) => item.permissible_value === obj.permissible_value) ===
          undefined
          ? false
          : true;
      } else if (
        obj.permissible_range_one !== null &&
        obj.permissible_range_one !== "" &&
        obj.permissible_range_two !== null &&
        obj.permissible_range_two !== ""
      ) {
        console.log("quality5");
        console.log(
          array[i]?.permissible_range?.every(
            (value) => obj.permissible_range_one !== value
          ),
          array[i]?.permissible_range?.every(
            (value) => obj.permissible_range_two !== value
          )
        );
        if (
          array[i]?.permissible_range?.every(
            (value) => obj.permissible_range_one !== value
          ) === undefined &&
          array[i]?.permissible_range?.every(
            (value) => obj.permissible_range_two !== value
          ) === undefined
        ) {
        } else if (
          array[i]?.permissible_range?.every(
            (value) => obj.permissible_range_one !== value
          ) &&
          array[i]?.permissible_range?.every(
            (value) => obj.permissible_range_two !== value
          )
        ) {
          console.log("Permissible Range");
        } else {
          console.log("quality3");
          return true;
        }
      } else {
        console.log("quality4");
        return true;
      }
    }
  }

  return false; // quality_parameter does not exist
}

const toValidateQualityParameterSchema = (formData) => {
  console.log("form data --> ", formData);
  const schema = qualityParameterSchema;

  try {
    schema.validateSync(formData, { abortEarly: false });
  } catch (errors) {
    const validationErrors = {};

    errors.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });

    throw validationErrors;
  }
};

const GradeOption = [
  { label: "Good", value: "Good" },
  { label: "Average", value: "Average" },
  { label: "Poor", value: "Poor" },
  { label: "Rejected", value: "Rejected" },
];

const AddEditFormCommodityMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const details = location.state?.details;

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      is_active: !details?.id, // Set is_active to true only when adding
    },
  });
  const [viewForm, setViewForm] = useState(false);

  const {
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = methods;

  const initialIsActive = details ? details.is_active : true;
  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);
  const [qualityParameterDropdown, setQualityParameterDropdown] = useState([]);

  const [qualityParameterList, setQualityParameterList] = useState([]);
  const [isAddUpdateQualityEditState, setIsAddUpdateQualityEditState] =
    useState({
      isEdit: false,
      index: null,
    });

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    community: [],
  });

  const onEditQualityDetails = (item, i) => {
    setIsAddUpdateQualityEditState({
      isEdit: true,
      index: i,
    });
    console.log(item);
    const details = {
      quality_grade: item?.quality_grade,
      quality_parameter: item?.quality_parameter,
      permissible_value: item?.permissible_value
        ? item?.permissible_value || null
        : null,
      permissible_range_one: item?.permissible_range
        ? parseFloat(item?.permissible_range[0] || null)
        : null,
      permissible_range_two: item?.permissible_range
        ? parseFloat(item?.permissible_range[1] || null)
        : null,
    };
    console.log(details);

    Object.keys(details).forEach((key) => {
      setValue(key, details[key], {
        shouldValidate: true,
      });
    });
  };

  const clearQualityDetailsForm = () => {
    let obj = {
      quality_parameter: "",
      permissible_value: "",
      permissible_range_one: "",
      permissible_range_two: "",
      quality_grade: "",
    };

    Object.keys(obj).forEach((key) => {
      setValue(key, "", {
        shouldValidate: false,
      });
    });
  };

  const addUpdateQualityDetails = () => {
    const data = getValues();

    console.log("all values :", data);

    // quantity: parseFloat(data?.quantity),
    const details = {
      quality_parameter: data?.quality_parameter,
      quality_grade: data?.quality_grade,
      permissible_value: data?.permissible_value
        ? data?.permissible_value || null
        : null,
      permissible_range_one: data?.permissible_range_one
        ? parseFloat(data?.permissible_range_one || null)
        : null,
      permissible_range_two: data?.permissible_range_two
        ? parseFloat(data?.permissible_range_two || null)
        : null,
    };

    const finalDetails = {
      quality_grade: data?.quality_grade,
      quality_parameter: data?.quality_parameter,
      permissible_value: data?.permissible_value
        ? data?.permissible_value || null
        : null,
      permissible_range:
        data?.permissible_range_one && data?.permissible_range_two
          ? [
              data?.permissible_range_one
                ? parseFloat(data?.permissible_range_one || null)
                : null,
              data?.permissible_range_two
                ? parseFloat(data?.permissible_range_two || null)
                : null,
            ]
          : null,
    };

    console.log("all values :", details);

    const { index, isEdit } = isAddUpdateQualityEditState;

    try {
      toValidateQualityParameterSchema(details);
      // qualityParameterList
      const copy_mainArr = [...qualityParameterList];

      const existsInMainArr = isQualityParameterAlreadyExists(
        details,
        qualityParameterList
      );

      const existsInCopyArr = isQualityParameterAlreadyExists(
        details,
        copy_mainArr
      );
      if (
        finalDetails?.quality_grade &&
        finalDetails?.quality_parameter &&
        (finalDetails?.permissible_value || finalDetails?.permissible_range)
      ) {
        if (isEdit && index >= 0 && index < qualityParameterList.length) {
          // In edit mode and the edited index exists
          if (existsInMainArr) {
            if (
              qualityParameterList[index]?.quality_parameter ===
              details?.quality_parameter
            ) {
              // The doc_type remains the same, update the existing entry in the main kyc array
              const updatedArr = [...qualityParameterList];
              updatedArr[index] = finalDetails;

              setQualityParameterList(updatedArr);
            } else {
              // The doc_type has changed, check if it exists in the copy array
              if (existsInCopyArr) {
                alert("Quality Parameter already exists");
              } else {
                // Update the existing entry in the main kyc array with the new doc_type
                const updatedArr = [...qualityParameterList];
                updatedArr[index] = finalDetails;
                //setIsKycFormDirty(false);
                setQualityParameterList(updatedArr);
              }
            }
          } else {
            toasterAlert({
              message: "Quality Parameter not found.",
              status: 440,
            });
            return;
          }
        } else {
          // Not in edit mode or index is out of bounds
          if (existsInCopyArr) {
            toasterAlert({
              message: "Please Enter Valid Quality Parameter .",
              status: 440,
            });
            return;
          } else {
            setQualityParameterList([...qualityParameterList, finalDetails]);
          }
        }
      } else {
        toasterAlert({
          message: "Please Enter Valid Quality Parameter .",
          status: 440,
        });
      }

      // console.log("Data is valid.", details);

      clearQualityDetailsForm();

      setIsAddUpdateQualityEditState({
        isEdit: false,
        index: null,
      });
    } catch (validationErrors) {
      // console.log("validationErrors", validationErrors);
      Object.keys(validationErrors).forEach((key) => {
        setError(key, {
          type: "manual",
          message: validationErrors[key] || "",
        });
      });
      return false;
    }
  };

  const deleteQualityDetails = (index) => {
    let indexToRemove = index;

    if (indexToRemove >= 0 && indexToRemove < qualityParameterList.length) {
      qualityParameterList.splice(indexToRemove, 1);
      setQualityParameterList([...qualityParameterList]);

      clearQualityDetailsForm();
    }
  };

  // ! commented unnecessary code ..
  // useEffect(() => {
  //   // console.log("qualityParameterList ->", qualityParameterList);
  // }, [qualityParameterList]);

  // Form Submit Function Start
  const onSubmit = (data) => {
    if (qualityParameterList?.length === 0) {
      toasterAlert({
        message: "Quality parameter details cannot be empty",
        status: 440,
      });

      return;
    }

    if (details?.id) {
      updateCommodityMasterData({ ...data, id: details.id });
    } else {
      addCommodityMasterData(data);
    }
  };
  // for clear data in form Start

  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      // Check if the field key is not 'is_active' before clearing it
      if (
        key !== "is_active" &&
        key !== "fumigation_required" &&
        key !== "lab_testing_required"
      ) {
        setValue(key, "", {
          shouldValidate: true,
        });
      }
    });
  };
  // for clear data in form End

  const getCommodityType = async () => {
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

  const [
    getPrimaryCommodityType,
    { isLoading: getPrimaryCommodityTypeApiIsLoading },
  ] = useGetPrimaryCommodityTypeMutation();

  const getAllPrimaryCommodity = async () => {
    try {
      const response = await getPrimaryCommodityType().unwrap();

      // console.log("Success:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setSelectBoxOptions((prev) => ({
        ...prev,
        primary_commodity_name: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllPrimaryCommodity();
    // eslint-disable-next-line
  }, []);

  // Add Commodity Api Start
  const [addCommodityMaster, { isLoading: addCommodityMasterApiIsLoading }] =
    useAddCommodityMasterMutation();

  const [getAllQuality, { isLoading: getAllQualityApiIsLoading }] =
    useGetAllQualityMutation();

  const addCommodityMasterData = async (data) => {
    try {
      const response = await addCommodityMaster({
        ...data,
        quality_parameter_details: qualityParameterList,
      }).unwrap();
      // console.log("add commodity master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        "Commodity Master Add Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Add Commodity Api End

  // Update Commodity Api Start
  const [
    updateCommodityMaster,
    { isLoading: updateCommodityMasterApiIsLoading },
  ] = useUpdateCommodityMasterMutation();

  const updateCommodityMasterData = async (data) => {
    try {
      const response = await updateCommodityMaster({
        ...data,
        quality_parameter_details: qualityParameterList,
      }).unwrap();
      if (response.status === 200) {
        // console.log("update commodity master res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        "Commidty Master Update Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Update Commodity Api End

  const fetchAllQuality = async () => {
    try {
      const response = await getAllQuality().unwrap();
      if (response.status === 200) {
        // console.log("fetchAllQuality res", response);

        const arr = response?.results?.map((el) => ({
          label: el.quality_parameter,
          value: el.id,
          to_capture: el.to_capture,
        }));
        setQualityParameterDropdown(arr);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Get Commodity Type Master Api Start
  const [
    getCommodityTypeMaster,
    { isLoading: getCommodityTypeMasterApiIsLoading },
  ] = useGetCommodityFreeTypeMasterMutation();

  const getCommodityMasterList = async () => {
    try {
      const response = await getCommodityTypeMaster().unwrap();
      let onlyActive = response?.data?.filter((item) => item.is_active);

      let arr = onlyActive?.map((type) => ({
        label: type.commodity_type,
        value: type.id,
        primary_commodity_name: type?.primary_commodity_name?.id,
      }));

      // console.log(details, "details235");

      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          community:
            details?.commodity_type?.is_active === false
              ? [
                  ...arr,
                  {
                    label: details?.commodity_type?.commodity_type,
                    value: details?.commodity_type?.id,
                    primary_commodity_name:
                      details?.commodity_type?.primary_commodity_name?.id,
                  },
                ]
              : arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Grt Commodity Type Master Api End
  useEffect(() => {
    getCommodityType();
    getCommodityMasterList();

    if (details?.id) {
      // console.log(details, "details");

      let obj = {
        commodity_name: details.commodity_name,
        commodity_type: details?.commodity_type?.id,
        primary_commodity_name:
          details?.commodity_type?.primary_commodity_name?.id,
        fumigation_required: details.fumigation_required,
        lab_testing_required: details.lab_testing_required,
        is_active: details.is_active,
      };

      let array = details?.quality_parameter?.map((item) => ({
        quality_parameter: item.quality_parameter.id,
        quality_grade: item.quality_grade,
        permissible_range: item.permissible_range,
        permissible_value: item.permissible_value,
      }));

      console.log(selectBoxOptions, "selectBoxOptions");

      setQualityParameterList(array);

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }

    setViewForm(location?.state?.view || false);
    
    const breadcrumbArray = [
      // {
      //   title: "Manage Commodity",
      //   link: "/commodity-master/commodity-master",
      // },
      {
        title: " Commodity master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_MASTER}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];

    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
  }, [details]);

  useEffect(() => {
    fetchAllQuality();
    return () => {
      dispatch(setBreadCrumb([]));
    };
    // eslint-disable-next-line
  }, []);

  return (
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
                >
                  <Text textAlign="right">
                    Primary commodity type{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Text>
                  <ReactCustomSelect
                  selectDisable={viewForm}
                    name="primary_commodity_name"
                    label=""
                    isLoading={getPrimaryCommodityTypeApiIsLoading}
                    options={selectBoxOptions?.primary_commodity_name || []}
                    selectedValue={
                      selectBoxOptions?.primary_commodity_name?.filter(
                        (item) =>
                          item.value === getValues("primary_commodity_name")
                      )[0] || {}
                    }
                    isClearable={false}
                    selectType="label"
                    style={{
                      mb: 1,
                      mt: 1,
                    }}
                    handleOnChange={(val) => {
                      setValue("primary_commodity_name", val.value, {
                        shouldValidate: true,
                      });
                      setValue("commodity_type", null, {
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
                    Commodity Type <span style={{ color: "red" }}>*</span>
                  </Text>
                  <ReactCustomSelect
                  selectDisable={viewForm}
                    name="commodity_type"
                    label=""
                    isLoading={getCommodityTypeMasterApiIsLoading}
                    options={
                      selectBoxOptions?.community?.filter(
                        (item) =>
                          item.primary_commodity_name ===
                          getValues("primary_commodity_name")
                      ) || []
                    }
                    selectedValue={
                      selectBoxOptions?.community?.filter(
                        (item) => item.value === getValues("commodity_type")
                      )[0] || {}
                    }
                    isClearable={false}
                    selectType="label"
                    style={{
                      mb: 1,
                      mt: 1,
                    }}
                    handleOnChange={(val) => {
                      setValue("commodity_type", val.value, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </Grid>
              </MotionSlideUp>
            </Box>
            <Box>
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
                        {item.label === "Active" ? null : (
                          <span style={{ color: "red", marginLeft: "4px" }}>
                            *
                          </span>
                        )}
                      </Text>
                      {generateFormField({
                        ...item,
                        label: "",
                        selectedValue:
                          item.type === "select" &&
                          item?.options?.find(
                            (opt) =>
                              opt.label ===
                              details?.commodity_type?.commodity_type
                          ),
                        selectType: "value",
                        isChecked: details?.is_active,
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
                    <Text textAlign="right">
                      Fumigation Required{" "}
                      {/* <span style={{ color: "red", marginLeft: "4px" }}>*</span> */}
                    </Text>
                    <CustomSwitch
                    isDisabled={viewForm}
                      name="fumigation_required"
                      // type="switch"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      isChecked={details?.fumigation_required}
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
                      Lab Testing Required
                      {/* <span style={{ color: "red", marginLeft: "4px" }}>*</span> */}
                    </Text>
                    <CustomSwitch
                     isDisabled={viewForm}
                      name="lab_testing_required"
                      // type="switch"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      isChecked={details?.lab_testing_required}
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

            {/* Quality parameter details* start    */}
            <Box id="chamber-details">
              <Box>
                <Box
                  mt="10"
                  bgColor={"#DBFFF5"}
                  padding="20px"
                  borderRadius="10px"
                >
                  <Heading as="h5" fontSize="lg" textAlign="left">
                    Quality parameter details*
                  </Heading>

                  <>
                    <Box pt="10px">
                      <Grid
                        alignItems="center"
                        my="3"
                        templateColumns="repeat(3, 1fr)"
                        gap={5}
                      >
                        {/* --------------  Quality parameter -------------- */}
                        <Box>
                          <Text my={1}>Quality parameter</Text>{" "}
                          <Box>
                            <FormControl style={{ w: commonWidth.w }}>
                              <ReactSelect
                                value={
                                  qualityParameterDropdown?.filter(
                                    (item) =>
                                      item.value ===
                                      getValues("quality_parameter")
                                  )[0] || {}
                                }
                                name="quality_parameter"
                                onChange={(val) => {
                                  console.log(val);
                                  setValue("quality_parameter", val.value, {
                                    shouldValidate: true,
                                  });
                                }}
                                isDisabled={viewForm}
                                isLoading={getAllQualityApiIsLoading}
                                options={qualityParameterDropdown || []}
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    backgroundColor: "#fff",
                                    borderRadius: "6px",
                                    borderColor: errors?.quality_parameter
                                      ? "red"
                                      : "#c3c3c3",

                                    padding: "1px",
                                    textAlign: "left",
                                  }),
                                  ...reactSelectStyle,
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Box>

                        {/* --------------  Quality Grade -------------- */}
                        <Box>
                          <Text my={1}>Quality Grade</Text>{" "}
                          <Box>
                            <FormControl style={{ w: commonWidth.w }}>
                              <ReactSelect
                              isDisabled={viewForm}
                                value={
                                  GradeOption?.filter(
                                    (item) =>
                                      item.value === getValues("quality_grade")
                                  )[0] || {}
                                }
                                name="quality_grade"
                                onChange={(val) => {
                                  console.log(val);
                                  setValue("quality_grade", val.value, {
                                    shouldValidate: true,
                                  });
                                }}
                                options={GradeOption || []}
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    backgroundColor: "#fff",
                                    borderRadius: "6px",
                                    borderColor: errors?.quality_grade
                                      ? "red"
                                      : "#c3c3c3",

                                    padding: "1px",
                                    textAlign: "left",
                                  }),
                                  ...reactSelectStyle,
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Box>
                        {/* ------ Permissible value------------- */}
                        <Box>
                          <Text my={1}>Permissible value</Text>{" "}
                          <Box position="relative">
                            <FormControl
                              isInvalid={errors?.permissible_value}
                              style={{ w: commonWidth.w }}
                            >
                              <Input
                                type="text"
                                // step="0.01"
                                value={getValues("permissible_value")}
                                name="permissible_value"
                                onChange={(val) => {
                                  setValue(
                                    "permissible_value",
                                    val.target.value,
                                    {
                                      shouldValidate: true,
                                    }
                                  );
                                }}
                                //  {...register("permissible_value")}
                                border="1px"
                                borderColor="gray.10"
                                backgroundColor={"white"}
                                height={"22px"}
                                borderRadius={"lg"}
                                //value={inputValue}
                                //  onChange={onChange}
                                _placeholder={commonStyle._placeholder}
                                _hover={commonStyle._hover}
                                _focus={commonStyle._focus}
                                isDisabled={
                                  viewForm ? true: qualityParameterDropdown?.filter(
                                    (item) =>
                                      item.value ===
                                      getValues("quality_parameter")
                                  )[0]?.to_capture !== "value"
                                }
                                p={{ base: "4" }}
                                fontWeight={{ base: "normal" }}
                                fontStyle={"normal"}
                                placeholder="Permissible value"
                              />
                            </FormControl>
                            {errors && errors?.permissible_value?.message && (
                              <Text
                                position="absolute"
                                textAlign="left"
                                color="red"
                              >
                                {errors?.permissible_value?.message}
                              </Text>
                            )}
                          </Box>
                        </Box>
                        {/* ------ Permissible range------------- */}
                        <Box>
                          <Text my={1}>Permissible range</Text>{" "}
                          <Box>
                            <Box
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              gap="2"
                            >
                              <FormControl
                                isInvalid={errors?.permissible_range_one}
                                style={{ w: commonWidth.w }}
                                width={20}
                              >
                                <Input
                                  type="number"
                                  value={getValues("permissible_range_one")}
                                  name="permissible_range_one"
                                  onChange={(val) => {
                                    setValue(
                                      "permissible_range_one",
                                      val.target.value,
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                  }}
                                  step="0.01"
                                  // {...register("permissible_range_one")}
                                  border="1px"
                                  borderColor="gray.10"
                                  backgroundColor={"white"}
                                  height={"29px"}
                                  borderRadius={"lg"}
                                  //value={inputValue}
                                  //  onChange={onChange}
                                  _placeholder={commonStyle._placeholder}
                                  _hover={commonStyle._hover}
                                  _focus={commonStyle._focus}
                                  //  isDisabled={true}
                                  isDisabled={
                                    viewForm ? true: qualityParameterDropdown?.filter(
                                      (item) =>
                                        item.value ===
                                        getValues("quality_parameter")
                                    )[0]?.to_capture !== "range"
                                  }
                                  p={{ base: "4" }}
                                  fontWeight={{ base: "normal" }}
                                  fontStyle={"normal"}
                                  placeholder=""
                                />
                              </FormControl>
                              <Box>
                                <Text>-</Text>
                              </Box>

                              {/* ------- two ----- */}

                              <FormControl
                                isInvalid={errors?.permissible_range_two}
                                style={{ w: commonWidth.w }}
                                width={20}
                              >
                                <Input
                                  type="number"
                                  step="0.01"
                                  //  {...register("permissible_range_two")}
                                  border="1px"
                                  value={getValues("permissible_range_two")}
                                  name="permissible_range_two"
                                  onChange={(val) => {
                                    setValue(
                                      "permissible_range_two",
                                      val.target.value,
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                  }}
                                  borderColor="gray.10"
                                  backgroundColor={"white"}
                                  height={"22px"}
                                  borderRadius={"lg"}
                                  //value={inputValue}
                                  //  onChange={onChange}
                                  _placeholder={commonStyle._placeholder}
                                  _hover={commonStyle._hover}
                                  _focus={commonStyle._focus}
                                  isDisabled={
                                    viewForm ? true: qualityParameterDropdown?.filter(
                                      (item) =>
                                        item.value ===
                                        getValues("quality_parameter")
                                    )[0]?.to_capture !== "range"
                                  }
                                  p={{ base: "4" }}
                                  fontWeight={{ base: "normal" }}
                                  fontStyle={"normal"}
                                  placeholder=""
                                />
                              </FormControl>
                            </Box>
                            {/* {errors &&
                              errors?.permissible_range_two?.message && (
                                <Text textAlign="left" color="red">
                                  {errors?.permissible_range_two?.message}
                                </Text>
                              )} */}
                          </Box>
                        </Box>
                      </Grid>
                    </Box>

                    {/* ----------------- save button -----------  */}

                    <Flex gap="10px" justifyContent="end" alignItems="center">
                      <Button
                        bg="#A6CE39"
                        _hover={{}}
                        color="white"
                        padding="0px 20px"
                        borderRadius={"50px"}
                        type="button"
                        onClick={() => {
                          addUpdateQualityDetails();
                        }}
                        isDisabled={viewForm ? true : false}
                      >
                        {isAddUpdateQualityEditState.isEdit ? "Update" : "Add"}
                      </Button>
                    </Flex>
                  </>
                </Box>
              </Box>
              {/* Chamber details end    */}
              {/* show warehouse owner details table start */}
              <TableContainer mt="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Sr no</Th>
                      <Th color="#000">Quality Parameter</Th>
                      <Th color="#000">Quality Grade</Th>
                      <Th color="#000">Permissible Value</Th>
                      <Th color="#000">Permissible Range</Th>

                      <Th color="#000">Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {qualityParameterList && qualityParameterList.length > 0 ? (
                      qualityParameterList?.map((item, i) => (
                        <Tr
                          key={`chamber_${i}`}
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                        >
                          <Td>{i + 1}</Td>
                          <Td>
                            {qualityParameterDropdown?.filter(
                              (item2) => item2.value === item?.quality_parameter
                            )[0]?.label || "-"}{" "}
                          </Td>
                          <Td>
                            {GradeOption?.filter(
                              (item2) => item2.value === item?.quality_grade
                            )[0]?.label || "-"}{" "}
                          </Td>
                          <Td>{item?.permissible_value || "-"} </Td>
                          <Td>
                            {item?.permissible_range
                              ? item?.permissible_range[0] || "-"
                              : "-"}
                            ,
                            {item?.permissible_range
                              ? item?.permissible_range[1] || "-"
                              : "-"}
                          </Td>
                          <Td>
                            <Box display="flex" alignItems="center" gap="3">
                              <Flex gap="20px" justifyContent="center">
                                <Box color={"primary.700"}>
                                  <BiEditAlt
                                    // color="#A6CE39"
                                    fontSize="26px"
                                    cursor="pointer"
                                    onClick={
                                      () =>{if (viewForm === true) { }else {onEditQualityDetails(item, i)}}
                                     
                                    }
                                  />
                                </Box>
                                <Box color="red">
                                  <AiOutlineDelete
                                    cursor="pointer"
                                    fontSize="26px"
                                    onClick={() => {if (viewForm === true){}else
                                      {deleteQualityDetails(i);
                                    }}}
                                  />
                                </Box>
                              </Flex>
                            </Box>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr textAlign="center">
                        <Td colSpan={5} color="#000">
                          No record found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              {/* show client table end */}
            </Box>

            <Box
              display="flex"
              gap={2}
              justifyContent="flex-end"
              mt="10"
              mr={6}
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
                  addCommodityMasterApiIsLoading ||
                  updateCommodityMasterApiIsLoading
                }
                my={"4"}
                px={"10"}
                isDisabled={viewForm ? true : false}
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

export default AddEditFormCommodityMaster;

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
