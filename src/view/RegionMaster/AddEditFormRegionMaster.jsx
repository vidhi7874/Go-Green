/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import generateFormField from "../../components/Elements/GenerateFormField";
import { addEditFormFields, schema } from "./fields";
import { 
  useAddRegionMasterMutation, 
  useGetRegionByIdMasterMutation,
  useUpdateRegionMasterMutation,
} from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { MotionSlideUp } from "../../utils/animation";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { ROUTE_PATH } from "../../constants/ROUTE";

const AddEditFormRegionMaster = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: true, // Set is_active to true by default
    },
  });
  const [viewForm, setViewForm] = useState(false);
  const { setValue, getValues } = methods;

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  const details = location.state?.details;

  // Form Submit Function Start

  const onSubmit = (data) => {
    if (details?.id) {
      updateData(data);
    } else {
      addData(data);
    }
  };
  // Form Clear Function Start

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

  // Add Region Api Start

  const [addRegionMaster, { isLoading: addCommodityGradeLoading }] =
    useAddRegionMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addRegionMaster(data).unwrap();
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_REGION}`);
      }
    } catch (error) {
      console.error("Error:", error);

      let errorMessage =
        error?.data?.data || error?.data?.message || "Region Adding is Failed";
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Add Region Api End

  // Update Region Api Start

  const [updateRegionMaster, { isLoading: updateCommodityGradeLoading }] =
    useUpdateRegionMasterMutation();

  const updateData = async (data) => {
    try {
      const response = await updateRegionMaster({
        ...data,
        id: details.id,
      }).unwrap();
      if (response.status === 200) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_REGION}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        "Region Updating is Failed";
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Update Region Api End

  // Region Details By Id Logic Start

  const [getRegionByIdMaster] = useGetRegionByIdMasterMutation();

  const detailsFill = async () => {
    const result = await getRegionByIdMaster({ id: details?.id || 0 }).unwrap();

    let obj = {
      region_name: result?.data?.region_name || "",
      is_active: result?.data?.is_active || false,
    };

    Object.keys(obj).forEach(function (key) {
      methods.setValue(key, obj[key], { shouldValidate: true });
    });
  };

  // Region Details By Id Logic End

  //Edit Form Fill Logic Start
  useEffect(() => {
    setAddEditFormFieldsList(addEditFormFields);
    if (details?.id) {
      detailsFill();
    }
    setViewForm(location?.state?.view || false);
    // set breadcrumbArray
    const breadcrumbArray = [
      {
        title: "Region Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_REGION}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);

  //Edit Form Fill Logic End

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
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
                          isChecked: getValues("is_active"),
                          isClearable: false,
                          style: { mb: 1, mt: 1 },
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
                  //w="full"
                  backgroundColor={"primary.700"}
                  _hover={{ backgroundColor: "primary.700" }}
                  color={"white"}
                  borderRadius={"full"}
                  isDisabled={viewForm ? true : false}
                  my={"4"}
                  px={"10"}
                  isLoading={
                    updateCommodityGradeLoading || addCommodityGradeLoading
                  }
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

export default AddEditFormRegionMaster;

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
