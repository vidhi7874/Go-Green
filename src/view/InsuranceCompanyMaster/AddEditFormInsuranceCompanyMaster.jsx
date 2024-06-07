import { Box, Button, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
// import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import generateFormField from "../../components/Elements/GenerateFormField";
import { addEditFormFields, schema } from "./fields";
import {
  useAddInsuranceCompanyMasterMutation,
  useGetInsuranceCompanyMasterMutation,
  useUpdateInsuranceCompanyMasterMutation,
} from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
// import { motion } from "framer-motion";
import { MotionSlideUp } from "../../utils/animation";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import { useFetchLocationDrillDownMutation } from "../../features/warehouse-proposal.slice";
import CustomTextArea from "../../components/Elements/CustomTextArea";
import CustomSwitch from "../../components/Elements/CustomSwitch";

const AddEditFormInsuranceCompanyMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const { setValue, getValues } = methods;
  // eslint-disable-next-line
  const [isClear, setIsClear] = useState(false);

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    states: [],
  });

  // eslint-disable-next-line
  const [locationDrillDownState, setLocationDrillDownState] = useState({});

  const details = location.state?.details;
  // console.log("details ---> ", details);

  const onSubmit = (data) => {
    // console.log("data==>", data);

    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };
  // for clear data in form

  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      setValue(key, "", {
        shouldValidate: true,
      });
    });
    setIsClear(true); // Update isClear state to true
  };

  const [
    getInsuranceCompanyMaster,
    { isLoading: getInsuranceCompanyMasterApiIsLoading },
  ] = useGetInsuranceCompanyMasterMutation();

  const [
    addInsuranceCompanyMaster,
    { isLoading: addInsuranceCompanyMasterApiIsLoading },
  ] = useAddInsuranceCompanyMasterMutation();

  const [
    updateInsuranceCompanyMaster,
    { isLoading: updateInsuranceCompanyMasterApiIsLoading },
  ] = useUpdateInsuranceCompanyMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addInsuranceCompanyMaster(data).unwrap();
      console.log("add insurance master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate("/manage-insurance/insurance-company-master");
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Insurance Updating is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const getInsuranceCompany = async () => {
    try {
      const response = await getInsuranceCompanyMaster().unwrap();

      console.log("Success:", response);

      let arr = response?.results.map((type) => ({
        label: type.commodity_type,
        value: type.id,
      }));

      setAddEditFormFieldsList(
        addEditFormFields.map((field) => {
          if (field.type === "select") {
            return {
              ...field,
              options: arr,
            };
          } else {
            return field;
          }
        })
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownMutation();

  // ! commented the unused function ..
  // const getRegionMasterList = async () => {
  //   try {
  //     const response = await fetchLocationDrillDown().unwrap();
  //     console.log("getRegionMasterList:", response);

  //     const arr = response?.region
  //       ?.filter((item) => item.region_name !== "ALL - Region")
  //       .map(({ region_name, id }) => ({
  //         label: region_name,
  //         value: id,
  //       }));

  //     if (details?.region?.is_active === false) {
  //       setSelectBoxOptions((prev) => ({
  //         ...prev,
  //         regions: [
  //           ...arr,
  //           {
  //             label: details?.region?.region_name,
  //             value: details?.region?.id,
  //           },
  //         ],
  //       }));
  //     } else {
  //       setSelectBoxOptions((prev) => ({
  //         ...prev,
  //         regions: arr,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const regionOnChange = async (val) => {
    // console.log("value --> ", val);
    setValue("region", val?.value, {
      shouldValidate: true,
    });

    setLocationDrillDownState((prev) => ({
      region: val?.value,
    }));

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

      if (details?.state?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          states: [
            ...arr,
            {
              label: details?.state?.state_name,
              value: details?.state?.id,
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
    console.log("value --> ", val);
    setValue("state", val?.value, {
      shouldValidate: true,
    });
  };

  const updateData = async (data) => {
    try {
      const response = await updateInsuranceCompanyMaster(data).unwrap();
      if (response.status === 200) {
        console.log("update insurance master res", response);
        toasterAlert(response);
        navigate("/manage-insurance/insurance-company-master");
      }
    } catch (error) {
      let errorMessage =
      error?.data?.data || error?.data?.message || "Insurance Updating is Failed";
      console.error("Error:", error);
       toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  useEffect(() => {
    getInsuranceCompany();
    if (details?.id) {
      let obj = {
        insurance_company_name: details.insurance_company_name,
        insurance_company_address: details.insurance_company_address,

        is_active: details.is_active,
      };

      // setHandleSelectBoxVal

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
    const breadcrumbArray = [
      {
        title: "Manage Insurance",
        link: "/manage-insurance/insurance-company-master",
      },
      {
        title: " Insurance Company Master",
        link: "/manage-insurance/insurance-company-master",
      },
      {
        title: details?.id ? "Edit" : "Add",
      },
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
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 260px )" overflowY="auto">
            <Box w={{ base: "100%", md: "80%", lg: "90%", xl: "60%" }}>
              {addEditFormFieldsList &&
                addEditFormFieldsList.map((item, i) => (
                  <MotionSlideUp key={i} duration={0.2 * i} delay={0.1 * i}>
                    <Box gap="4" display={{ base: "flex" }} alignItems="center">
                      <Text textAlign="right" w="550px">
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
                        // options: item.type === "select" && commodityTypeMaster,
                        selectedValue:
                          item.type === "select" &&
                          item?.options?.find(
                            (opt) =>
                              opt.label ===
                              details?.commodity_type?.commodity_type
                          ),
                        selectType: "label",
                        isChecked: details?.is_active,
                        isClearable: false,
                        style: { mb: 1, mt: 1 },
                      })}
                    </Box>
                  </MotionSlideUp>
                ))}

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Region <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="region"
                      label=""
                      isLoading={getInsuranceCompanyMasterApiIsLoading}
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
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      State <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="state_name"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.states || []}
                      selectedValue={
                        selectBoxOptions?.states?.filter(
                          (item) => item.value === getValues("state_name")
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
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Address <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomTextArea
                      name="insurance_company_address"
                      placeholder=" Address"
                      type="text"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Active
                    </Text>
                    <CustomSwitch
                      name="is_active"
                      // type="switch"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      isChecked={details?.is_active}
                    />
                  </Box>
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
                  addInsuranceCompanyMasterApiIsLoading ||
                  updateInsuranceCompanyMasterApiIsLoading
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

export default AddEditFormInsuranceCompanyMaster;

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
