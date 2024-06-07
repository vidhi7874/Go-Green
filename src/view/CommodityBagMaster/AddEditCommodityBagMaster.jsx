/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addEditFormFields, schema } from "./fields";
import {
  useAddCommodityBagMasterMutation,
  useGetCommodityFreeMasterMutation,
  useGetCommodityFreeTypeMasterMutation,
  useGetPrimaryCommodityTypeMutation,
  useUpdateCommodityBagMasterMutation,
} from "../../features/master-api-slice";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import { MotionSlideUp } from "../../utils/animation";
import generateFormField from "../../components/Elements/GenerateFormField";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import ROUTE_PATH from "../../constants/ROUTE";

const AddEditCommodityBagMaster = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: true, // Set is_active to true by default
    },
  });
  const [viewForm, setViewForm] = useState(false);
  const { setValue, getValues } = methods;

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    types: [],
  });

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  const details = location.state?.details;

  // Onsubmit logic start
  const onSubmit = (data) => {
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };
  // Onsubmit Logic end
  // for clear data in form start
  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      setValue(key, "", {
        shouldValidate: true,
      });
    });
  };
  // For clear dat form end

  // Add Commodity Bag Master Logic Start
  const [
    addCommodityBagMaster,
    { isLoading: addCommodityBagMasterApiIsLoading },
  ] = useAddCommodityBagMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addCommodityBagMaster(data).unwrap();

      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_BAG}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data ||
        error?.data?.message ||
        "Commodity bag add Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Add Commodity Bag Master Logic End

  // Get Commodity type master Api calling start
  const [getCommodityTypeMaster] = useGetCommodityFreeTypeMasterMutation();

  const getCommodityTypeMasterList = async () => {
    try {
      const response = await getCommodityTypeMaster().unwrap();
      // console.log("Success:", response);
      let onlyActive = response?.data?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.commodity_type,
        value: item.id,
        primary_commodity_name: item?.primary_commodity_name?.id,
      }));

      setSelectBoxOptions((prev) => ({
        ...prev,
        types: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Get Commodity type master Api Calling End

  // Get Commodity Master API calling Start
  const [getCommodityMaster] = useGetCommodityFreeMasterMutation();

  const getCommodityMasterList = async () => {
    try {
      const response = await getCommodityMaster().unwrap();
      // console.log("Success:", response);
      let onlyActive = response?.data?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.commodity_name,
        value: item.id,
        commodity_type: item.commodity_type,
      }));

      if (details?.commodity?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          names: [
            ...arr,
            {
              label: details?.commodity?.commodity_name,
              value: details?.commodity?.id,
              commodity_type: details?.commodity?.commodity_type,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          names: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Get Commodity Master API Calling End

  // Get Primary Commodity Type Master Api Calling Start

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

  // Get Primary Commodity Type Master Api Calling End

  // Update Commodity Bag Master Api CAlling Start
  const [
    updateCommodityBagMaster,
    { isLoading: updateCommodityBagMasterApiIsLoading },
  ] = useUpdateCommodityBagMasterMutation();

  const updateData = async (data) => {
    try {
      const response = await updateCommodityBagMaster(data).unwrap();
      if (response.status === 200) {
        // console.log("update commodity bag master res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_BAG}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data ||
        error?.data?.message ||
        "Commodity bag update Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Update Commodity Bag Master Api Calling End

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

  // Edit Form Logic Start
  useEffect(() => {
    getCommodityType();
    getCommodityMasterList();
    getCommodityTypeMasterList();
    // console.log(details, "details");
    if (details?.id) {
      let obj = {
        bag_size: details?.bag_size,
        space_per_bag_sq_ft: details?.space_per_bag_sq_ft,
        stack_height: details?.stack_height,
        commodity_type: details?.commodity?.commodity_type?.id,
        primary_commodity_name:
          details?.commodity?.commodity_type?.primary_commodity_name?.id,
        commodity: details?.commodity?.id,
        is_active: details?.is_active,
      };

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }

    setViewForm(location?.state?.view || false);

    const breadcrumbArray = [
      // {
      //   title: "Manage Commodity",
      //   link: "/commodity-master/commodity-bag-master",
      // },
      {
        title: " Commodity Bag master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_BAG}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];

    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);

  // Edit Form Logic End
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
              {/* This code is for the commodity type master list  */}
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
                        setValue("commodity", null, {
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
                      options={
                        selectBoxOptions?.types?.filter(
                          (item) =>
                            item.primary_commodity_name ===
                            getValues("primary_commodity_name")
                        ) || []
                      }
                      selectedValue={
                        selectBoxOptions?.types?.filter(
                          (opt) => opt.value === getValues("commodity_type")
                        )[0] || {}
                      }
                      handleOnChange={(val) => {
                        setValue("commodity_type", val.value, {
                          shouldValidate: true,
                        });
                        setValue("commodity", null, {
                          shouldValidate: true,
                        });
                      }}
                      isClearable={false}
                      selectType={"value"}
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
                    <Text textAlign="right">
                      Commodity Name <span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="commodity"
                      label=""
                      options={
                        selectBoxOptions?.names?.filter(
                          (item) =>
                            item.commodity_type.id ===
                            getValues("commodity_type")
                        ) || []
                      }
                      selectedValue={
                        selectBoxOptions?.names?.filter(
                          (opt) => opt.value === getValues("commodity")
                        )[0] || {}
                      }
                      handleOnChange={(val) => {
                        setValue("commodity", val.value, {
                          shouldValidate: true,
                        });
                      }}
                      isClearable={false}
                      selectType={"value"}
                      style={{
                        mb: 1,
                        mt: 1,
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
                          item?.options?.find((opt) => {
                            return opt.value === details?.commodity.id;
                          }),
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
                isDisabled={viewForm ? true : false}
                isLoading={
                  addCommodityBagMasterApiIsLoading ||
                  updateCommodityBagMasterApiIsLoading
                }
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

export default AddEditCommodityBagMaster;

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
