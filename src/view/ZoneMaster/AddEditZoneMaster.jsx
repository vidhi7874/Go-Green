/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import generateFormField from "../../components/Elements/GenerateFormField";
import { addEditFormFields, schema } from "./fields";
import {
  useAddZoneMasterMutation,
  useGetZoneByIdMasterMutation,
  useUpdateZoneMasterMutation,
} from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

import { MotionSlideUp } from "../../utils/animation";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import { useFetchLocationDrillDownFreeMutation } from "../../features/warehouse-proposal.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { useDispatch } from "react-redux";
import { ROUTE_PATH } from "../../constants/ROUTE";

const AddEditZoneMaster = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const details = location?.state?.details;

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: !details?.id, // Set is_active to true only when adding
    },
  });
  const [viewForm, setViewForm] = useState(false);
  const { setValue, getValues } = methods;

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    states: [],
  });

  // Form Submit Function Start
  const onSubmit = (data) => {
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };
  // Form Submit Function End

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

  // Form Clear Function End

  // Add Zone Api Start
  const [addZoneMaster, { isLoading: addZoneMasterApiIsLoading }] =
    useAddZoneMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addZoneMaster(data).unwrap();
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_SUB_STATE}`);
      }
    } catch (error) {
      let errorMessage =
        error?.data?.data || error?.data?.message || "Zone Adding is Failed";
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Add Zone Api End

  // Update Zone Api Start
  const [updateZoneMaster, { isLoading: updateZoneMasterApiIsLoading }] =
    useUpdateZoneMasterMutation();

  const updateData = async (data) => {
    try {
      const response = await updateZoneMaster(data).unwrap();
      if (response.status === 200) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_SUB_STATE}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Zone Updating is Failed";
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Update Zone Api End

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

      if (details?.state?.region?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          regions: [
            ...arr,
            {
              label: details?.state?.region?.region_name,
              value: details?.state?.region?.id,
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

    const query = {
      region: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();

      const arr = response?.state
        ?.filter((item) => item.state_name !== "All - State")
        .map(({ state_name, id }) => ({
          label: state_name,
          value: id,
        }));
      if (details?.state?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          states:
            details?.state?.region?.id === val?.value
              ? [
                  ...arr,
                  {
                    label: details?.state?.state_name,
                    value: details?.state?.id,
                  },
                ]
              : [...arr],
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
  };

  // Region State  Zone District Area  onChange drill down api end //

  // Sub State Details By Id Logic Start

  const [getZoneByIdMaster] = useGetZoneByIdMasterMutation();

  const detailsFill = async () => {
    const result = await getZoneByIdMaster({ id: details?.id || 0 }).unwrap();

    let obj = {
      substate_name: result?.data?.substate_name || "",
      state: result?.data?.state?.id || "",
      region: result?.data?.state?.region?.id || "",
      is_active: result?.data?.is_active || false,
    };

    regionOnChange({ value: result?.data?.state?.region?.id });

    Object.keys(obj).forEach(function (key) {
      methods.setValue(key, obj[key], { shouldValidate: true });
    });
  };

  // Sub State Details By Id Logic End

  // Edit Form Fill Logic Start
  useEffect(() => {
    if (details?.id) {
      detailsFill();
    }
    setViewForm(location?.state?.view || false);
    const breadcrumbArray = [
      {
        title: "Sub State Master",
        // link: "/manage-location/sub-state-master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_SUB_STATE}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);

  useEffect(() => {
    getRegionMasterList();
    // getAllStateMaster();
    setAddEditFormFieldsList(addEditFormFields);
  }, []);

  useEffect(() => {
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
                      Region <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="region"
                      selectDisable={viewForm}
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.regions || []}
                      selectedValue={
                        selectBoxOptions?.regions?.find(
                          (item) => item.value === getValues("region")
                        ) || {}
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
                      name="state"
                      selectDisable={viewForm}
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
                            (opt) => opt.label === details?.state.state_name
                          ),
                        selectType: "value",
                        isClearable: false,
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
                      name="is_active"
                      isDisabled={viewForm}
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      isChecked={getValues("is_active")}
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
                isDisabled={viewForm ? true : false}
                onClick={() => {
                  // Clear the selected substate
                  clearForm(); // Call your clearForm function
                }}
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
                  addZoneMasterApiIsLoading || updateZoneMasterApiIsLoading
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

export default AddEditZoneMaster;

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
