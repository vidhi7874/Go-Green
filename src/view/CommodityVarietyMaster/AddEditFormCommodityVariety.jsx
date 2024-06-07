/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./fields";
import {
  useAddCommodityVarietyMutation,
  useGetCommodityFreeMasterMutation,
  useGetCommodityFreeTypeMasterMutation,
  useGetHsnFreeMasterMutation,
  useGetPrimaryCommodityTypeMutation,
  useUpdateCommodityVarietyMutation,
} from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { MotionSlideUp } from "../../utils/animation";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomInput from "../../components/Elements/CustomInput";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import ROUTE_PATH from "../../constants/ROUTE";

const AddEditFormCommodityVariety = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const details = location.state?.details;
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: !details?.id, // Set is_active to true only when adding
    },
  });
  const { setValue, getValues } = methods;
  const initialIsActive = details ? details.is_active : true;
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    hsnCode: [],
    commodityType: [],
    commodityName: [],
  });

  // Form submit logic start
  const onSubmit = (data) => {
    // console.log("data==>", data);
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };
  // Form submit Logic End

  // for clear data in form start

  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      setValue(key, "", {
        shouldValidate: true,
      });
    });
  };
  // For clear Data in form end
  const [viewForm, setViewForm] = useState(false);
  // Add Commodity Type Variety Master Api CAlling Start
  const [addCommodityVariety, { isLoading: addCommodityVarietyApiIsLoading }] =
    useAddCommodityVarietyMutation();

  const addData = async (data) => {
    try {
      const response = await addCommodityVariety(data).unwrap();
      // console.log("add commodity variety res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_VARIETY}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };
  // Add Commodity Variety  Master Api Calling End

  // Get Commodity Master Api Calling Start
  const [getCommodityMaster] = useGetCommodityFreeMasterMutation();

  const getAllCommodity = async () => {
    try {
      const response = await getCommodityMaster().unwrap();

      // console.log("Success:", response);
      let onlyActive = response?.data?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.commodity_name,
        value: item.id,
        commodityType: item.commodity_type,
      }));

      setSelectBoxOptions((prev) => ({
        ...prev,
        commodityName:
          details?.commodity_id?.is_active === false
            ? [
                ...arr,
                {
                  label: details?.commodity_id?.commodity_name,
                  value: details?.commodity_id?.id,
                  commodityType: details?.commodity_id?.commodity_type?.id,
                },
              ]
            : arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Get Commodity Master Api Calling End

  // Get HSN Master Api Calling Start
  const [getHsnMaster] = useGetHsnFreeMasterMutation();

  const getHsnMasters = async () => {
    try {
      const response = await getHsnMaster().unwrap();
      // console.log("response ", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);

      let arr = onlyActive?.map((item) => ({
        label: item.hsn_code,
        value: item.id,
      }));

      setSelectBoxOptions((prev) => ({
        ...prev,
        hsnCode: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Get HSN Master Api Calling End

  // Get Commodity Type Master Api Calling Start
  const [getCommodityTypeMaster] = useGetCommodityFreeTypeMasterMutation();

  const getCommodityType = async () => {
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
        commodityType:
          details?.commodity_id?.commodity_type?.is_active === false
            ? [
                ...arr,
                {
                  label: details?.commodity_id?.commodity_type?.commodity_type,
                  value: details?.commodity_id?.commodity_type?.id,
                  primary_commodity_name:
                    details?.commodity_id?.commodity_type
                      ?.primary_commodity_name?.id,
                },
              ]
            : arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Get Commodity Type Master Api Calling End

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

  // Update Commodity Variety Master Api Calling Start
  const [
    updateCommodityVariety,
    { isLoading: updateCommodityVarietyMasterApiIsLoading },
  ] = useUpdateCommodityVarietyMutation();

  const updateData = async (data) => {
    try {
      const response = await updateCommodityVariety(data).unwrap();
      if (response.status === 200) {
        // console.log("update commodity variety res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_VARIETY}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };
  // Update Commodity Variety Master Api Calling End

  // Edit Form Logic Start
  useEffect(() => {
    getCommodityType();
    getHsnMasters();
    getAllCommodity();

    // console.log(details);

    if (details?.id) {
      let obj = {
        commodity_variety: details.commodity_variety,
        description: details.description,
        hsn_code: details?.hsn_code?.id,
        commodity_id: details?.commodity_id?.id,
        commodity_type: details?.commodity_id?.commodity_type?.id,
        primary_commodity_name:
          details?.commodity_id?.commodity_type?.primary_commodity_name?.id,
        fed: details.fed,
        commodity_min_price: Number(details?.commodity_min_price || 0),
        commodity_max_price: Number(details?.commodity_max_price || 0),
        is_block: details.is_block,
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
      //   link: "/commodity-master/commodity-variety",
      // },
      {
        title: " Commodity variety master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_COMMODITY_VARIETY}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
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
                        setValue("commodity_id", null, {
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
                        selectBoxOptions?.commodityType?.filter(
                          (item) =>
                            item.primary_commodity_name ===
                            getValues("primary_commodity_name")
                        ) || []
                      }
                      selectedValue={
                        selectBoxOptions?.commodityType?.filter(
                          (opt) => opt.value === getValues("commodity_type")
                        )[0] || {}
                      }
                      handleOnChange={(val) => {
                        setValue("commodity_type", val.value, {
                          shouldValidate: true,
                        });
                        setValue("commodity_id", null, {
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
                      name="commodity_id"
                      label=""
                      options={
                        selectBoxOptions?.commodityName?.filter(
                          (item) =>
                            item?.commodityType?.id ===
                            getValues("commodity_type")
                        ) || []
                      }
                      selectedValue={
                        selectBoxOptions?.commodityName?.filter(
                          (opt) => opt.value === getValues("commodity_id")
                        )[0] || {}
                      }
                      handleOnChange={(val) => {
                        setValue("commodity_id", val.value, {
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
                      Commodity Variety <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="commodity_variety"
                      placeholder="  Commodity Variety"
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

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Discription <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                    InputDisabled={viewForm}
                      name="description"
                      placeholder=" Discription"
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

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Expiry (in Months)
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                    InputDisabled={viewForm}
                      name="fed"
                      placeholder="Final Expiry Date in Months"
                      type="number"
                      min={0}
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
                    <Text textAlign="right">
                      HSN Code <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                    selectDisable={viewForm}
                      name="hsn_code"
                      label=""
                      options={selectBoxOptions?.hsnCode || []}
                      selectedValue={
                        selectBoxOptions?.hsnCode?.filter(
                          (opt) =>
                            Number(opt.value) === Number(getValues("hsn_code"))
                        )[0] || {}
                      }
                      handleOnChange={(val) => {
                        setValue("hsn_code", val.value, {
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
                      Minimum price <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="commodity_min_price"
                      placeholder=" Minimum price"
                      type="number"
                      label=""
                      showNumberToWord={{
                        isShow: true,
                        showOnly: ["commodity_min_price"],
                      }}
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
                      Maximum price <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                    InputDisabled={viewForm}
                      name="commodity_max_price"
                      placeholder=" Maximum price"
                      type="number"
                      label=""
                      showNumberToWord={{
                        isShow: true,
                        showOnly: ["commodity_max_price"],
                      }}
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
                    <Text textAlign="right">Block</Text>
                    <CustomSwitch
                    isDisabled={viewForm}
                      name="is_block"
                      // type="switch"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      isChecked={details?.is_block}
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
                  addCommodityVarietyApiIsLoading ||
                  updateCommodityVarietyMasterApiIsLoading
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

export default AddEditFormCommodityVariety;

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
