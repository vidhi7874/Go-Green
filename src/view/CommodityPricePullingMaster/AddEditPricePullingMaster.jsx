/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  // useAddCommodityVarietyMutation,
  useGetCommodityFreeMasterMutation,
  // useGetCommodityFreeTypeMasterMutation,
  useGetCommodityVarityFreeMasterMutation,
  // useGetHsnFreeMasterMutation,
  // useGetPrimaryCommodityTypeMutation,
  usePricePullingpostFileUploadMutation,
  useUpdateCommodityVarietyMutation,
} from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { MotionSlideUp } from "../../utils/animation";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomInput from "../../components/Elements/CustomInput";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import { schema } from "./fields";
import { useFetchLocationDrillDownFreeMutation } from "../../features/warehouse-proposal.slice";
import moment from "moment";
import { toasterAlert } from "../../services/common.service";
import ROUTE_PATH from "../../constants/ROUTE";
import {
  useGetCommodityPriceByIdMutation,
  useUpdateCommodityPricePullingMutation,
} from "../../features/commodity-price-pulling-master";

const AddEditPricePullingMaster = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const details = location.state?.details;
  console.log("details", details);
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      recorded_date: moment().format("YYYY-MM-DD"),
      is_active: true, // Set is_active to true by default
    },
  });
  const {
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = methods;

  const initialIsActive = details ? details.is_active : true;
  const [commodityPullingMasterDetails, setCommodityPullingMasterDetails] =
    useState({});
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    commodityType: [],
    commodityName: [],
    communityVariety: [],
  });
  const [viewForm, setViewForm] = useState(false);
  // Form submit logic start
  const onSubmit = (data) => {
    console.log("data==>", data);
    if (details?.id) {
      console.log("-------->", getValues("recorded_date"));
      updateData({
        ...data,
        recorded_date: moment(getValues("recorded_date")).format("YYYY-MM-DD"),
        // recorded_date: moment(
        //   commodityPullingMasterDetails?.recorded_date
        // ).format("YYYY-MM-DD"),
        id: details.id,
      });
    } else {
      addData({
        ...data,
        recorded_date: moment(getValues("recorded_date")).format("YYYY-MM-DD"),

        // recorded_date: moment(
        //   commodityPullingMasterDetails?.recorded_date
        // ).format("YYYY-MM-DD"),
      });
    }
  };
  // Form submit Logic End

  console.log(errors, "error");
  // location drill down api hook
  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownFreeMutation();

  const [getCommodityPriceById] = useGetCommodityPriceByIdMutation();

  const fetchCommodityPriceById = async (id) => {
    try {
      const response = await getCommodityPriceById(id).unwrap();
      if (response?.status === 200) {
        console.log(response?.data);
        setCommodityPullingMasterDetails(response?.data);
      }
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getRegionMasterList = async () => {
    try {
      const response = await fetchLocationDrillDown().unwrap();

      const arr = response?.region
        ?.filter((item) => item.region_name !== "ALL - Region")
        .map(({ region_name, id }) => ({
          label: region_name,
          value: id,
        }));
      if (details?.district?.substate?.state?.region?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          regions: [
            ...arr,
            {
              label: details?.district?.substate?.state?.region?.region_name,
              value: details?.district?.substate?.state?.region?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          regions: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const regionOnChange = async (val) => {
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

    const query = {
      region: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);

      const arr = response?.state
        ?.filter((item) => item.state_name !== "All - State")
        .map(({ state_name, id }) => ({
          label: state_name,
          value: id,
        }));
      if (details?.district?.substate?.state?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          states: [
            ...arr,
            {
              label: details?.district?.substate?.state?.state_name,
              value: details?.district?.substate?.state?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          states: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stateOnChange = async (val) => {
    setValue("state", val?.value, {
      shouldValidate: true,
    });

    setValue("substate", null, {
      shouldValidate: false,
    });

    setValue("district", null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues("region"),
      state: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);

      const arr = response?.substate
        ?.filter((item) => item.substate_name !== "All - Zone")
        .map(({ substate_name, id }) => ({
          label: substate_name,
          value: id,
        }));
      if (details?.district?.substate?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          substate: [
            ...arr,
            {
              label: details?.district?.substate?.substate_name,
              value: details?.district?.substate?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          substate: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const zoneOnChange = async (val) => {
    setValue("substate", val?.value, {
      shouldValidate: true,
    });

    setValue("district", null, {
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

      const arr = response?.district
        ?.filter((item) => item.district_name !== "All - District")
        .map(({ district_name, id }) => ({
          label: district_name,
          value: id,
        }));
      if (details?.district?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          districts: [
            ...arr,
            {
              label: details?.district?.district_name,
              value: details?.district?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          districts: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const districtOnChange = async (val) => {
    setValue("district", val?.value, {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    getRegionMasterList();
    // eslint-disable-next-line
  }, []);

  // Region State  Zone District Area  onChange drill down api end //

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

  // Add Commodity Type Variety Master Api CAlling Start
  const [addPricePulling, { isLoading: addPricePullingApiIsLoading }] =
    usePricePullingpostFileUploadMutation();

  const addData = async (data) => {
    try {
      const response = await addPricePulling(data).unwrap();

      // console.log("add commodity variety res", response);
      if (response.message === "Data added successfully") {
        showToastByStatusCode(200, response?.message);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };
  // Add Commodity Variety  Master Api Calling End

  // // Get Commodity Master Api Calling Start
  // const [getCommodityMaster] = useGetCommodityFreeMasterMutation();

  const getAllCommodity = async () => {
    try {
      const response = await getCommodityMaster().unwrap();

      console.log("Success:", response);
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
  // // Get Commodity Master Api Calling End

  // Get Commodity Master API calling Start
  const [getCommodityMaster] = useGetCommodityFreeMasterMutation();

  const getCommodityMasterList = async () => {
    try {
      const response = await getCommodityMaster().unwrap();
      console.log("Success:", response);
      let onlyActive = response?.data?.filter((item) => item.is_active);
      console.log("onlyActive", onlyActive);
      let arr = onlyActive?.map((item) => ({
        label: item.commodity_name,
        value: item.id,
        commodity_type: item.commodity_type,
      }));

      console.log("Success:", arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        commodityName: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Get Commodity Master API Calling End

  const [
    getCommodityVarity,
    // { isLoading: getCommodityVarityApiIsLoading }
  ] = useGetCommodityVarityFreeMasterMutation();

  const getCommodityVarityList = async () => {
    try {
      const response = await getCommodityVarity().unwrap();
      // console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          communityVariety: response?.data?.map(
            ({ commodity_variety, id, commodity_id }) => ({
              label: commodity_variety,
              value: id,
              commodity_id: commodity_id?.id,
            })
          ),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getCommodityVarityList();
    // eslint-disable-next-line
  }, []);

  //commodity variety master end

  // Update Commodity Variety Master Api Calling Start
  const [
    updateCommodityPricePulling,
    { isLoading: updateCommodityPricePullingApiIsLoading },
  ] = useUpdateCommodityPricePullingMutation();

  const updateData = async (data) => {
    console.log(data);
    try {
      const response = await updateCommodityPricePulling(data).unwrap();
      if (response.status === 200 || response.message) {
        // console.log("update commodity variety res", response);
        showToastByStatusCode(200, response?.message);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };
  // Update Commodity Variety Master Api Calling End

  // Edit Form Logic Start
  useEffect(() => {
    // getCommodityVarityList();
    getCommodityMasterList();

    // console.log(details);

    if (details?.id) {
      fetchCommodityPriceById(details?.id);
    }
    setViewForm(location?.state?.view || false);
    const breadcrumbArray = [
      // {
      //   title: "Manage Commodity",
      //   link: "/commodity-master/price-pulling-master",
      // },
      {
        title: "Commodity Price Pulling Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
  }, [details]);

  useEffect(() => {
    if (details?.id) {
      regionOnChange({
        value: commodityPullingMasterDetails?.region?.id,
      });
      stateOnChange({ value: commodityPullingMasterDetails?.state?.id });
      zoneOnChange({ value: commodityPullingMasterDetails?.substate?.id });
      districtOnChange({ value: commodityPullingMasterDetails?.district?.id });

      let obj = {
        commodity_variety: commodityPullingMasterDetails?.commodity_variety?.id,
        district_name: commodityPullingMasterDetails?.district?.id,
        substate: commodityPullingMasterDetails?.substate?.id,
        region: commodityPullingMasterDetails?.region?.id,
        state: commodityPullingMasterDetails?.state?.id,
        recorded_date: commodityPullingMasterDetails?.recorded_date,
        commodity_id: commodityPullingMasterDetails?.commodity_id?.id,
        commodity_type:
          commodityPullingMasterDetails?.commodity_id?.commodity_type,
        modal_price: commodityPullingMasterDetails?.modal_price,
        max_price: commodityPullingMasterDetails?.max_price,
        min_price: commodityPullingMasterDetails?.min_price,

        is_active: commodityPullingMasterDetails?.is_active,
      };

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
  }, [commodityPullingMasterDetails]);

  // Edit Form Logic End

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const minPrice = parseFloat(methods.getValues("min_price")) || 0;
    const maxPrice = parseFloat(methods.getValues("max_price")) || 0;

    const value = (minPrice + maxPrice) / 2;
    // console.log(value, "yooo");

    if (!isNaN(value)) {
      methods.setValue("modal_price", value, { shouldValidate: true });
    } else {
      // Handle the case where the average is not a number
      // methods.setValue("modal_price", null, { shouldValidate: true });
    }

    if (
      Number(getValues("max_price") || 0) >= Number(getValues("min_price") || 0)
    ) {
      clearErrors("min_price");
    }
    // eslint-disable-next-line
  }, [methods, methods.getValues("min_price"), methods.getValues("max_price")]);

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
                      Recorded date <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      inputValue={getValues("recorded_date")}
                      name="recorded_date"
                      placeholder="date"
                      // min={moment().format("YYYY-MM-DD")}
                      type="date"
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
                      Commodity Name <span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="commodity_id"
                      label=""
                      options={selectBoxOptions?.commodityName || []}
                      selectedValue={
                        selectBoxOptions?.commodityName?.filter(
                          (item) => item.value === getValues("commodity_id")
                        )[0] || {}
                      }
                      handleOnChange={(val) => {
                        setValue("commodity_variety", "", {
                          shouldValidate: true,
                        });
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
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="commodity_variety"
                      label=""
                      options={
                        selectBoxOptions?.communityVariety?.filter(
                          (item) =>
                            item.commodity_id === getValues("commodity_id")
                        ) || []
                      }
                      selectedValue={
                        selectBoxOptions?.communityVariety?.filter(
                          (item) =>
                            item.value === getValues("commodity_variety")
                        )[0] || {}
                      }
                      handleOnChange={(val) => {
                        setValue("commodity_variety", val.value, {
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
                    mt="10px"
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
                    mt="10px"
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
                    mt="10px"
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
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">
                    District <span style={{ color: "red" }}>*</span>
                  </Text>
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
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Min Price <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="min_price"
                      inputValue={methods.getValues("min_price")}
                      placeholder=" Min Price"
                      type="number"
                      label=""
                      onChange={(e) => {
                        methods.setValue("min_price", e.target.value, {
                          shouldValidate: true,
                        });
                      }}
                      showNumberToWord={{
                        isShow: true,
                        showOnly: ["min_price"],
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
                      Max Price
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="max_price"
                      placeholder="Max Price"
                      inputValue={methods.getValues("max_price")}
                      type="number"
                      showNumberToWord={{
                        isShow: true,
                        showOnly: ["max_price"],
                      }}
                      onChange={(e) => {
                        methods.setValue("max_price", e.target.value, {
                          shouldValidate: true,
                        });
                      }}
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
                      modal Price (rs/mt){" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="modal_price"
                      inputValue={methods.getValues("modal_price")}
                      placeholder=" modal Price"
                      type="number"
                      label=""
                      showNumberToWord={{
                        isShow: true,
                        showOnly: ["modal_price"],
                      }}
                      onChange={(e) => {
                        methods.setValue("modal_price", e.target.value, {
                          shouldValidate: true,
                        });
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
                  addPricePullingApiIsLoading ||
                  updateCommodityPricePullingApiIsLoading
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

export default AddEditPricePullingMaster;
// HAHA VAIBHAV HERE
