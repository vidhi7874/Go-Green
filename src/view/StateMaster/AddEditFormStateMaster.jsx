/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import generateFormField from "../../components/Elements/GenerateFormField";
import { addEditFormFields, schema } from "./fields";
import {
  useAddStateMasterMutation,
  useGetStateByIdMasterMutation,
  useUpdateStateMasterMutation,
} from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { MotionSlideUp } from "../../utils/animation";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { useFetchLocationDrillDownFreeMutation } from "../../features/warehouse-proposal.slice";
import { ROUTE_PATH } from "../../constants/ROUTE";

const AddEditFormStateMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: true, // Set is_active to true by default
    },
  });

  const { setValue, getValues } = methods;

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  const details = location.state?.details;
  const [viewForm, setViewForm] = useState(false);

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    earthQuack: [],
    regions: [],
    zones: [],
    districts: [],
    states: [],
  });

  // Form Submit Function Start
  const onSubmit = (data) => {
    let nav_code = data?.nav_code || null;
    if (details?.id) {
      updateData({ ...data, nav_code: nav_code, id: details.id });
    } else {
      addData({ ...data, nav_code: nav_code });
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

  // Add Area Api Start
  const [addStateMaster, { isLoading: addStateMasterApiIsLoading }] =
    useAddStateMasterMutation();

  const addData = async (data) => {
    try {
      let finaldata = {};
      if (getValues("tin_no") === "") {
        const { tin_no, ...fidata } = data;
        finaldata = { ...fidata };
      } else {
        const { ...fidata } = data;
        finaldata = { ...fidata };
      }
      const response = await addStateMaster(finaldata).unwrap();
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_STATE}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "State Adding is Failed";
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Add Area Api End

  const getAllRegionMaster = async () => {
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

  // Update Area Api Start
  const [updateStateMaster, { isLoading: updateStateMasterApiIsLoading }] =
    useUpdateStateMasterMutation();

  const updateData = async (data) => {
    try {
      let finaldata = {};
      if (getValues("tin_no") === "") {
        const { tin_no, ...fidata } = data;
        finaldata = { ...fidata };
      } else {
        const { ...fidata } = data;
        finaldata = { ...fidata };
      }
      const response = await updateStateMaster(finaldata).unwrap();
      if (response.status === 200) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_STATE}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "State Updating is Failed";
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Update Area Api End

  // Location Drill Down API Start

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

      if (details?.region?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          regions: [
            ...arr,
            {
              label: details?.region?.region_name,
              value: details?.region?.id,
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
  };

  // Location Drill Down API Start

  // State Details By Id Logic Start

  const [getStateByIdMaster] = useGetStateByIdMasterMutation();

  const detailsFill = async () => {
    const result = await getStateByIdMaster({ id: details?.id || 0 }).unwrap();

    let obj = {
      state_name: result?.data?.state_name || "",
      region: result?.data?.region?.id || "",
      state_code: result?.data?.state_code || "",
      tin_no: result?.data?.tin_no || null,
      gstn: result?.data?.gstn || "",
      nav_code: result?.data?.nav_code || null,
      ho_overhead: result?.data?.ho_overhead || "",
      state_overhead: result?.data?.state_overhead || "",
      state_india_office_addr: result?.data?.state_india_office_addr || "",
      is_active: result?.data?.is_active || false,
    };

    Object.keys(obj).forEach(function (key) {
      methods.setValue(key, obj[key], { shouldValidate: true });
    });
  };

  // State Details By Id Logic End

  useEffect(() => {
    if (details?.id) {
      detailsFill();
    }
    setViewForm(location?.state?.view || false);

    const breadcrumbArray = [
      {
        title: "State Master",
        // link: "/manage-location/state-master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_STATE}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);

  useEffect(() => {
    setAddEditFormFieldsList(addEditFormFields);
  }, []);

  useEffect(() => {
    getAllRegionMaster();
    getRegionMasterList();
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
                      selectDisable={viewForm}
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
                        {item.label === "Active" ||
                        // item.label === "Ho Overhead" ||
                        // item.label === "State Overhead" ||
                        item.label === "Nav Code" ||
                        item.label === "TIN No" ? null : (
                          <span style={{ color: "red", marginLeft: "4px" }}>
                            *
                          </span>
                        )}
                        
                      </Text>
                      
                      {generateFormField({
                        ...item,
                        label: "",
                        showNumberToWord: {
                          isShow: true,
                          showOnly: ["ho_overhead", "state_overhead"],
                        },
                        isChecked: getValues("is_active"),
                        style: {
                          mb: 1,
                          mt: 1,
                        },
                        
                        
                       

                        selectedValue:
                          item.type === "select" &&
                          item?.options?.find((opt) => {
                            return opt.label === details?.region.region_name;
                          }),
                        selectType: "value",
                        isClearable: false,
                        inputDisabled: viewForm,
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
                backgroundColor={"primary.700"}
                _hover={{ backgroundColor: "primary.700" }}
                color={"white"}
                borderRadius={"full"}
                isDisabled={viewForm ? true : false}
                isLoading={
                  addStateMasterApiIsLoading || updateStateMasterApiIsLoading
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

export default AddEditFormStateMaster;

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
