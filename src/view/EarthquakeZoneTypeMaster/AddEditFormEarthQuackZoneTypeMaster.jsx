/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, FormControl, Grid, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import generateFormField from "../../components/Elements/GenerateFormField";
import { addEditFormFields, schema } from "./fields";
import {
  useAddEarthQuakeZoneTypeMasterMutation,
  useUpdateEarthQuakeZoneTypeMasterMutation,
} from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { MotionSlideUp } from "../../utils/animation";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ROUTE_PATH from "../../constants/ROUTE";

const commonStyle = {
  _placeholder: { color: "gray.300" },
  _hover: {
    borderColor: "primary.700",
    backgroundColor: "primary.200",
  },
  _focus: {
    borderColor: "primary.700",
    backgroundColor: "primary.200",
    boxShadow: "none",
  },
};

const templateColumns = {
  base: "repeat(1, 1fr)",
  md: "repeat(3, 2fr)",
  lg: "repeat(3, 1fr)",
};

const commonWidth = {
  mt: 2,
  w: {
    base: "100%",
    sm: "80%",
    md: "60%",
    lg: "55%",
  },
  comm_details_style: {
    w: "90%",
  },
};

const AddEditFormEarthQuackZoneTypeMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const details = location.state?.details;
  // console.log("details ---> ", details);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: true, // Set is_active to true by default
    },
  });

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  const {
    setValue,
    register,
    formState: { errors },
  } = methods;
  const [viewForm, setViewForm] = useState(false);
  const onSubmit = (data) => {
    // console.log("data==>", data);
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };

  // Clear form Logic start
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
  // Clear form logic end

  // Add Earthquack Type Master Api Calling Start
  const [
    addEarthQuakeZoneTypeMaster,
    { isLoading: addEarthQuakeZoneTypeMasterApiIsLoading },
  ] = useAddEarthQuakeZoneTypeMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addEarthQuakeZoneTypeMaster(data).unwrap();
      // console.log("add EarthQuack master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_EARTHQUACK_ZONE}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };
  // Add Earthquack Type Master Api Calling End

  // Update Earthquack Type Master Api Calling Start
  const [
    updateEarthQuakeZoneTypeMaster,
    { isLoading: updateEarthQuakeZoneTypeMasterApiIsLoading },
  ] = useUpdateEarthQuakeZoneTypeMasterMutation();

  const updateData = async (data) => {
    try {
      const response = await updateEarthQuakeZoneTypeMaster(data).unwrap();
      if (response.status === 200) {
        // console.log("update earthQuack master res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_EARTHQUACK_ZONE}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };
  // Update Earthquack Type Master Api Calling End

  // Call Get EarthQuack Zone Api Started
  const getEarthQuakeZone = async () => {
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
    getEarthQuakeZone();
    if (details?.id) {
      let obj = {
        earthquake_zone_type: details.earthquake_zone_type,
        is_active: details.is_active,
        remarks: details?.remarks,
      };

      // console.log(obj);

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
    setViewForm(location?.state?.view || false);
    const breadcrumbArray = [
      // {
      //   title: "Manage Insurance",
      //   link: "/manage-insurance/earthquake-zone-type-master",
      // },
      {
        title: " Earthquake Zone Type Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_EARTHQUACK_ZONE}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];

    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
  }, [details]);
  // Call Get EarthQuackZone Api Calling End

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
                        isClearable: false,
                        style: { mb: 1, mt: 1 },
                        inputDisabled: viewForm,
                      })}
                    </Grid>
                  </MotionSlideUp>
                ))}

              <Grid
                gap={4}
                templateColumns={"repeat(3, 1fr)"}
                alignItems="center"
                mt="4"
              >
                {/* -------------- remarks -------------- */}
                <Text textAlign="right" my={1}>
                  remarks
                </Text>{" "}
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="text"
                    isDisabled={viewForm}
                    name="remarks"
                    {...register("remarks")}
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Remarks"
                  />
                </FormControl>
              </Grid>
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
                  addEarthQuakeZoneTypeMasterApiIsLoading ||
                  updateEarthQuakeZoneTypeMasterApiIsLoading
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

export default AddEditFormEarthQuackZoneTypeMaster;

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
