/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./fields";
import {
  useUpdateAreaMasterMutation,
  useAddAreaMasterMutation,
  useGetEarthQuakeZoneFreeTypeMasterMutation, 
} from "../../features/master-api-slice";
import { MotionSlideUp } from "../../utils/animation";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

import CustomSwitch from "../../components/Elements/CustomSwitch";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { useDispatch } from "react-redux";
import { useFetchLocationDrillDownFreeMutation } from "../../features/warehouse-proposal.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomInput from "../../components/Elements/CustomInput";
import { ROUTE_PATH } from "../../constants/ROUTE";

const AddEditFormArea = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  let details = location.state?.details;
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: !details?.id, // Set is_active to true only when adding
    },
  });
  const initialIsActive = details ? details.is_active : true;
  const {
    setValue,
    getValues,
    // eslint-disable-next-line
    formState: { errors },
  } = methods;
  const [viewForm, setViewForm] = useState(false);
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    earthquake_zones: [],
    regions: [],
    substate: [],
    districts: [],
    states: [],
  });

  // Form Clear Function Start

  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      // Check if the field key is not 'is_active' before clearing it
      if (key !== "is_active" && key !== "is_block") {
        setValue(key, "", {
          shouldValidate: true,
        });
      }
    });
  };

  // Form Clear Function End

  // Form Submit Function Start

  const onSubmit = (data) => {
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };

  // Form Submit Function End

  // Add Area Api Start

  const [addAreaMaster, { isLoading: addAreaMasterApiIsLoading }] =
    useAddAreaMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addAreaMaster(data).unwrap();
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_AREA}`);
      }
    } catch (error) {
      let errorMessage =
        error?.data?.data || error?.data?.message || "Area Adding is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Add Area Api End

  // Update Area Api Start

  const [updateAreaMaster, { isLoading: updateAreaMasterApiIsLoading }] =
    useUpdateAreaMasterMutation();

  const updateData = async (data) => {
    try {
      const response = await updateAreaMaster(data).unwrap();
      if (response.status === 200) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_AREA}`);
      }
    } catch (error) {
      let errorMessage =
        error?.data?.data || error?.data?.message || "Area Updating is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Update Area Api Start

  // Form Submit Function End

  // Region State  Zone District Area  onChange drill down api start //

  // location drill down api hook
  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownFreeMutation();

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

  // Earthquake Api Start

  const [getEarthQuakeZoneTypeMaster] =
    useGetEarthQuakeZoneFreeTypeMasterMutation();

  const getEarthquackList = async () => {
    try {
      const response = await getEarthQuakeZoneTypeMaster().unwrap();
      // console.log("getEarthquackList:", response);
      let onlyActive = response?.data?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.earthquake_zone_type,
        value: item.id,
      }));

      // console.log(arr);

      if (details?.id && !details?.earthquake_zone_type?.is_active) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          earthquake_zones: [
            ...arr,
            {
              label: details?.earthquake_zone_type?.earthquake_zone_type,
              value: details?.earthquake_zone_type.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          earthquake_zones: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const earthQuakeOnChange = async (val) => {
    setValue("earthquake_zone_type", val?.value, {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    getEarthquackList();
    // eslint-disable-next-line
  }, []);

  // Earthquake Api End

  // Edit Form Fill Logic Start

  useEffect(() => {
    if (details?.id) {
      regionOnChange({ value: details?.district?.substate?.state?.region?.id });
      stateOnChange({ value: details?.district?.substate?.state?.id });
      zoneOnChange({ value: details?.district?.substate?.id });
      districtOnChange({ value: details?.district?.id });

      let obj = {
        earthquake_zone_type: details?.earthquake_zone_type?.id,
        district_name: details?.district?.id,
        substate: details?.district?.substate?.id,
        region: details?.district?.substate?.state?.region.id,
        state: details?.district?.substate?.state.id,
        is_active: details?.is_active,
        is_block: details?.is_block,
        area_name: details.area_name,
      };

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
    setViewForm(location?.state?.view || false);
    // set breadcrumbArray
    const breadcrumbArray = [
      // {
      //   title: "Manage Locations",
      //   // link: "/manage-location/area-master",
      //   link: `/${ROUTE_PATH.ALL_MASTERS.SUB_KEY}/${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION_KEY}/${ROUTE_PATH.ALL_MASTERS.MANAGE_LOCATION.AREA}`,

      // },
      {
        title: "Area Master",
        // link: "/manage-location/area-master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_AREA}`,

      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
  }, [details]);

  // Edit Form Fill Logic End

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
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Region <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="region"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      selectDisable={viewForm}
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
                      name="state"
                      label=""
                      selectDisable={viewForm}
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
                      name="substate"
                      selectDisable={viewForm}
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
                    name="district"
                    label=""
                    selectDisable={viewForm}
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
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Area <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="area_name"
                      placeholder="Enter Area"
                      InputDisabled={viewForm}
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
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Earthquack Zone <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="earthquake_zone_type"
                      selectDisable={viewForm}
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.earthquake_zones || []}
                      selectedValue={
                        selectBoxOptions?.earthquake_zones?.filter(
                          (item) =>
                            item.value === getValues("earthquake_zone_type")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        earthQuakeOnChange(val);
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
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">Block</Text>
                  <CustomSwitch
                  isDisabled={viewForm}
                    name="is_block"
                    // type="switch"
                    label=""
                    isChecked={details?.is_block}
                    style={{
                      mb: 1,
                      mt: 1,
                    }}
                  />
                </Grid>
              </MotionSlideUp>
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
                  addAreaMasterApiIsLoading || updateAreaMasterApiIsLoading
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

export default AddEditFormArea;

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
