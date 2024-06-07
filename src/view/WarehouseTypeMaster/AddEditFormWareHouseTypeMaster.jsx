/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import generateFormField from "../../components/Elements/GenerateFormField";

import {
  useAddWarehouseTypeMasterMutation,
  useUpdateWarehouseTypeMasterMutation,
} from "../../features/master-api-slice";
import { addEditFormFields, schema } from "./fields";
import { MotionSlideUp } from "../../utils/animation";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ROUTE_PATH from "../../constants/ROUTE";
import { CommonToasterAlert } from "../../services/common.service";

function AddEditFormWareHouseTypeMaster() {
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

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState();
  const [viewForm, setViewForm] = useState(false);
  // for clear data in form Logic start

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
  // For clear data in form logic end

  // Onsubmit Logic Code Start
  const onSubmit = (data) => {
    console.log("data==>", data);
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };
  const details = location.state?.details;
  // Onsubmit logic Code end

  // Warehouse Type master add api calling start
  const [
    addWarehouseTypeMaster,
    { isLoading: addWarehouseTypeMasterApiIsLoading },
  ] = useAddWarehouseTypeMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addWarehouseTypeMaster(data).unwrap();
      console.log("add warehouse type master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_TYPE}`);
      }
    } catch (error) {
      CommonToasterAlert(error);

      // console.error("Error:", error);
      // let errorMessage =
      //   error?.data?.data ||
      //   error?.data?.message ||
      //   "Warehouse type add Failed";
      // console.log("Error:", errorMessage);
      // toasterAlert({
      //   message: JSON.stringify(errorMessage),
      //   status: 440,
      // });
    }
  };

  // Update Warehouse Type Master Api Calling Start
  const [
    updateWarehouseTypeMaster,
    { isLoading: updateWarehouseTypeMasterApiIsLoading },
  ] = useUpdateWarehouseTypeMasterMutation();

  const updateData = async (data) => {
    try {
      const response = await updateWarehouseTypeMaster(data).unwrap();
      if (response.status === 200) {
        console.log("update warehouse type master res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_TYPE}`);
      }
    } catch (error) {
      CommonToasterAlert(error);
      // console.error("Error:", error);
      // let errorMessage =
      //   error?.data?.data ||
      //   error?.data?.message ||
      //   "Warehouse type update Failed";
      // console.log("Error:", errorMessage);
      // toasterAlert({
      //   message: JSON.stringify(errorMessage),
      //   status: 440,
      // });
    }
  };
  // Update Warehouse Type Master Api CAlling End

  // GetWarehouse Type Api Calling start
  const getWarehouseType = async () => {
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
    getWarehouseType();

    if (details?.id) {
      let obj = {
        warehouse_type_name: details.warehouse_type_name,
        description: details.description,
        is_active: details.is_active,
      };
      console.log("details", details);

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
    setViewForm(location?.state?.view || false);
    const breadcrumbArray = [
      // {
      //   title: "Manage Warehouse",
      //   link: "/warehouse-master/warehouse-type-master",
      // },
      {
        title: " Warehouse Type Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_TYPE}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);
  // Get Warehouse Type Api Calling End
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
                        // options: item.type === "select" && commodityTypeMaster,
                        selectedValue:
                          item.type === "select" &&
                          item?.options?.find(
                            (opt) =>
                              opt.label ===
                              details?.commodity_type?.commodity_type
                          ),
                        selectType: "label",
                        isChecked: methods.watch("is_active"),
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
                isLoading={
                  addWarehouseTypeMasterApiIsLoading ||
                  updateWarehouseTypeMasterApiIsLoading
                }
                isDisabled={viewForm ? true : false}
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
}

export default AddEditFormWareHouseTypeMaster;

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
