import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addEditFormFields, schema } from "./fields";
// import {
//   useAddQualityParameterMasterMutation,
//   useUpdateQualityParameterMasterMutation,
// } from "../../features/master-api-slice";
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { MotionSlideUp } from "../../utils/animation";
import generateFormField from "../../components/Elements/GenerateFormField";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import {
  useAddAllQualityMutation,
  useUpdateAllQualityMutation,
  // useUpdateQualityMutation,
} from "../../features/masters/commodityApi.slice";
import ROUTE_PATH from "../../constants/ROUTE";

const AddEditQualityMaster = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const details = location.state?.details;
  // console.log("details ---> ", details);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: !details?.id, // Set is_active to true only when adding
    },
  });
  const [viewForm, setViewForm] = useState(false);
  const initialIsActive = details ? details.is_active : true;
  // eslint-disable-next-line
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    capture: [
      {
        label: "Value",
        value: "value",
      },
      {
        label: "Range",
        value: "range",
      },
    ],
    grade: [
      {
        label: "Yes",
        value: "yes",
      },
      {
        label: "No",
        value: "no",
      },
    ],
  });

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  const { setValue, getValues } = methods;

  const [
    updateQualityParameterMaster,
    { isLoading: updateQualityParameterMasterApiLoading },
  ] = useUpdateAllQualityMutation();

  const updateData = async (data) => {
    try {
      const response = await updateQualityParameterMaster({
        ...data,
        id: details.id,
      }).unwrap();
      if (response.status === 200) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_QUALTY_PARAMETER}`);
      }
      console.log("update quality parameter master res", response);
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  const [
    addQualityParameterMaster,
    { isLoading: addQualityParameterMasterApiLoading },
  ] = useAddAllQualityMutation();

  const addData = async (data) => {
    try {
      const response = await addQualityParameterMaster(data).unwrap();
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_QUALTY_PARAMETER}`);
      }
      console.log("add quality parameter master res", response);
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };
  const onSubmit = (data) => {
    console.log("data==>", data);
    if (details?.id) {
      updateData(data);
    } else {
      addData(data);
    }
  };
  // for clear data in form

  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      // Check if the field key is not 'is_active' before clearing it
      if (key !== "is_active") {
        setValue(key, "", {
          shouldValidate: true,
        });
      }
    });
  };

  useEffect(() => {
    setAddEditFormFieldsList(addEditFormFields);
    if (details?.id) {
      console.log(details);
      let obj = {
        quality_parameter: details.quality_parameter,
        to_capture: details.to_capture,
        decides_grade: details.decides_grade,
        is_active: details.is_active,
      };

      // setHandleSelectBoxVal

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
    setViewForm(location?.state?.view || false);
    // set breadcrumbArray
    const breadcrumbArray = [
      // {
      //   title: "Commodity Master",
      //   link: "/commodity-master/quality-parameter-master",
      // },
      {
        title: "Quality Parameter Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_QUALTY_PARAMETER}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
  }, [details]);

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Box bg="white" borderRadius={10} maxHeight="calc(100vh - 250px)">
      <Box bg="white" borderRadius={10} p="10">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
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
                          isChecked: methods.watch("is_active"),
                          // isChecked: details?.is_active,
                          isClearable: false,
                          style: { mb: 1, mt: 1 },
                          inputDisabled: viewForm,
                        })}
                      </Grid>
                    </MotionSlideUp>
                  ))}
              </Box>
              {/* This is for the To capture code */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      To capture{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="to_capture"
                      label=""
                      isLoading={false}
                      options={selectBoxOptions?.capture || []}
                      selectedValue={
                        selectBoxOptions?.capture?.filter(
                          (item) => item.value === getValues("to_capture")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setValue("to_capture", val.value, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* This is for the grade code  */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Decides grade{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="decides_grade"
                      label=""
                      isLoading={false}
                      options={selectBoxOptions?.grade || []}
                      selectedValue={
                        selectBoxOptions?.grade?.filter(
                          (item) => item.value === getValues("decides_grade")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setValue("decides_grade", val.value, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* This is for the active code  */}
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
                    label=""
                    style={{
                      mb: 1,
                      mt: 1,
                    }}
                    isChecked={initialIsActive}
                  />
                </Grid>
              </MotionSlideUp>
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
                  my={"4"}
                  px={"10"}
                  isLoading={
                    updateQualityParameterMasterApiLoading ||
                    addQualityParameterMasterApiLoading
                  }
                  isDisabled={viewForm ? true : false}
                >
                  {details?.id ? " Update" : "Add"}
                </Button>
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
};

export default AddEditQualityMaster;

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
