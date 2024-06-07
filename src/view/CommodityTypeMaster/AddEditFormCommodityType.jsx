/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import generateFormField from "../../components/Elements/GenerateFormField";
import { addEditFormFields, schema } from "./fields";
import {
  useAddCommodityTypeMasterMutation,
  useGetPrimaryCommodityTypeMutation,
  useUpdateCommodityTypeMasterMutation,
} from "../../features/master-api-slice";
import { MotionSlideUp } from "../../utils/animation";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import ROUTE_PATH from "../../constants/ROUTE";

const AddEditFormCommodityType = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const details = location.state?.details;

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: true, // Set is_active to true by default
    },
  });

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  const { setValue, getValues } = methods;

  // for clear data in form start
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
  // For Clear data in form end
  const [viewForm, setViewForm] = useState(false);
  // Form Submit Function Start
  const onSubmit = (data) => {
    // console.log("data==>", data);
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };

  // Form Submit Function End

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    primary_commodity_name: [],
  });

  // Get Primary Commodity Type Api Calling Start
  // ! commented the unused rtk hook loading state ..
  const [
    getPrimaryCommodityType,
    // { isLoading: getPrimaryCommodityTypeApiIsLoading },
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

  // Get Primary Commodity type Api Calling End

  // Add Commodity type master api calling start

  const [
    addCommodityTypeMaster,
    { isLoading: addCommodityTypeMasterApiIsLoading },
  ] = useAddCommodityTypeMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addCommodityTypeMaster(data).unwrap();
      // console.log("add commodity Type master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_TYPE}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Commodity type Adding Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Add commodity Type master api calling end

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

  // Update commodity type master api calling start
  const [
    updateCommodityTypeMaster,
    { isLoading: updateCommodityTypeMasterApiIsLoading },
  ] = useUpdateCommodityTypeMasterMutation();
  const updateData = async (data) => {
    try {
      const response = await updateCommodityTypeMaster(data).unwrap();
      if (response.status === 200) {
        // console.log("update commodity type master res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_TYPE}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Commodity type update failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Update Commodity type master Api calling End

  //Edit form Fill Logic start
  useEffect(() => {
    getCommodityType();
    getAllPrimaryCommodity();
    console.log(details);
    if (details?.id) {
      let obj = {
        primary_commodity_name: details.primary_commodity_name.id,
        commodity_type: details.commodity_type,
        description: details.description,
        is_active: details.is_active,
      };

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }

    setViewForm(location?.state?.view || false);
    const breadcrumbArray = [
      // {
      //   title: "Manage Commodity",
      //   link: "/commodity-master/commodity-type",
      // },
      {
        title: " Commodity Type Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_TYPE}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
  }, [details]);

  // Edit Form  Fill Logic End
  useEffect(() => {
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
                      isLoading={false}
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
                      }}
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
                        style: {
                          mb: 1,
                          mt: 1,
                        },
                        inputDisabled: viewForm,

                        selectedValue:
                          item.type === "select" &&
                          item?.options?.find(
                            (opt) =>
                              opt.label === details?.primary_commodity_name
                          ),
                        selectType: "value",
                        isClearable: false,
                      })}
                    </Grid>
                  </MotionSlideUp>
                ))}
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
                  addCommodityTypeMasterApiIsLoading ||
                  updateCommodityTypeMasterApiIsLoading
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

export default AddEditFormCommodityType;

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
