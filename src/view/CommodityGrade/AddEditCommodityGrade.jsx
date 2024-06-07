/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import generateFormField from "../../components/Elements/GenerateFormField";
import { addEditFormFields, schema } from "./fields";
import {
  useAddCommodityGradeMutation,
  useUpdateCommodityGradeMutation,
} from "../../features/master-api-slice";
import { MotionSlideUp } from "../../utils/animation";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";

const AddEditFormCommodityGrade = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: true, // Set is_active to true by default
    },
  });

  const { setValue } = methods;

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);
  const details = location.state?.details;

  // Clear Data from form start
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
  // Clear Data From Form End

  // Form Onsubmit Logic Start
  const onSubmit = (data) => {
    // console.log("data==>", data);
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };
  // Form Onsubmit Logic End

  // Add Commodity Grade Api Calling Start
  const [addCommodityGrade, { isLoading: addCommodityGradeApiIsLoading }] =
    useAddCommodityGradeMutation();

  const addData = async (data) => {
    try {
      const response = await addCommodityGrade(data).unwrap();
      // console.log("add commodity grade res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate("/commodity-master/commodity-grade");
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };
  // Add Commodity Grade Api Calling End

  // Update Commodity Grade Api Calling Start
  const [
    updateCommodityGrade,
    { isLoading: updateCommodityGradeApiIsLoading },
  ] = useUpdateCommodityGradeMutation();

  const updateData = async (data) => {
    try {
      const response = await updateCommodityGrade(data).unwrap();
      if (response.status === 200) {
        // console.log("update commodity grade res", response);
        toasterAlert(response);
        navigate("/commodity-master/commodity-grade");
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };
  // Update Commodity Grade Api Calling End

  // Edit Form Logic Start
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
  useEffect(() => {
    getCommodityType();
    if (details?.id) {
      let obj = {
        commodity_grade_name: details.commodity_grade_name,
        is_active: details.is_active,
      };

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
    const breadcrumbArray = [
      {
        title: "Manage Commodity",
        link: "/commodity-master/commodity-grade",
      },
      {
        title: " Commodity Grade master",
        link: "/commodity-master/commodity-grade",
      },
      {
        title: details?.id ? "Edit" : "Add",
      },
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
                  addCommodityGradeApiIsLoading ||
                  updateCommodityGradeApiIsLoading
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

export default AddEditFormCommodityGrade;

const toasterAlert = (obj) => {
  let msg = obj?.message;
  let status = obj?.status;
  if (status === 400) {
    // ! commented unused variables ...
    // const errorData = obj.data;
    // let errorMessage = "";

    // Object.keys(errorData).forEach((key) => {
    //   const messages = errorData[key];
    //   messages.forEach((message) => {
    //     errorMessage += `${key} : ${message} \n`;
    //   });
    // });
    showToastByStatusCode(status, obj?.data?.message);
    return false;
  }
  showToastByStatusCode(status, msg);
};
