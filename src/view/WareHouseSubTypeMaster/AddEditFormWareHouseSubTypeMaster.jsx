/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import generateFormField from "../../components/Elements/GenerateFormField";
import {
  useAddWareHouseSubTypeMutation,
  // eslint-disable-next-line
  useGetWarehouseTypeMasterMutation,
  useUpdateWareHouseSubTypeMutation,
} from "../../features/master-api-slice";
import { addEditFormFields, schema } from "./fields";
import { MotionSlideUp } from "../../utils/animation";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import { useGetWarehouseFreeTypeMutation } from "../../features/warehouse-proposal.slice";
import ROUTE_PATH from "../../constants/ROUTE";

function AddEditFormWareHouseSubTypeMaster() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: true, // Set is_active to true by default
    },
  });
  const { setValue, getValues } = methods;
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    types: [],
  });
  // const { setValue } = methods;
  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  const details = location.state?.details;
  const [viewForm, setViewForm] = useState(false);
  // On submit Logic Start
  const onSubmit = (data) => {
    console.log("data==>", data);
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };
  // On submit Logic End

  // for clear data in form Logic Start

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
  // For Clear Data In Form Logic End

  // Get WareHouse Type Api CAlling Start
  const [getWarehouseTypeMaster] = useGetWarehouseFreeTypeMutation();

  const getWarehouseMasterList = async () => {
    try {
      const response = await getWarehouseTypeMaster().unwrap();
      console.log("Success:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.warehouse_type_name,
        value: item.id,
      }));

      if (details?.warehouse_type?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          names: [
            ...arr,
            {
              label: details?.warehouse_type?.warehouse_type_name,
              value: details?.warehouse_type?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          names: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //  Get Warehouse Type Api Calling End

  // Add Warehouse Sub Type Api Calling Start
  const [addWareHouseSubType, { isLoading: addWareHouseSubTypeApiIsLoading }] =
    useAddWareHouseSubTypeMutation();

  const addData = async (data) => {
    try {
      const response = await addWareHouseSubType(data).unwrap();
      console.log("add warehouse sub type master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(
          `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE}`
        );
      }
    } catch (error) {
      console.error("Error:", error);

      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        "Warehouse sub type add Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Add Warehouse Sub Type Api Calling End

  // Update WareHOuse Sub Type Api Calling Start
  const [
    updateWareHouseSubType,
    { isLoading: updateWareHouseSubTypeApiIsLoading },
  ] = useUpdateWareHouseSubTypeMutation();

  const updateData = async (data) => {
    try {
      const response = await updateWareHouseSubType(data).unwrap();
      if (response.status === 200) {
        console.log("update warehouse sub type master res", response);
        toasterAlert(response);
        navigate(
          `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        "Warehouse sub type update Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Update Warehouse Sub Type Api Calling End

  // Get Warehouse  Sub Api Calling Start
  const getWareHouseSub = async (data) => {
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
    getWarehouseMasterList();
    getWareHouseSub();
    if (details?.id) {
      let obj = {
        warehouse_type: details?.warehouse_type?.id,
        warehouse_subtype: details.warehouse_subtype,
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
      //   link: "/warehouse-master/warehouse-sub-type-master",
      // },
      {
        title: " Warehouse sub type master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_SUB_TYPE}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);
  // Get Warehouse Sub Api CAlling End
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
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                >
                  <Text textAlign="right">
                    Warehouse Type <span style={{ color: "red" }}>*</span>
                  </Text>
                  <ReactCustomSelect
                   selectDisable={viewForm}
                    name="warehouse_type"
                    label=""
                    options={selectBoxOptions?.names || []}
                    selectedValue={
                      selectBoxOptions?.names?.filter(
                        (opt) => opt.value === getValues("warehouse_type")
                      )[0] || {}
                    }
                    handleOnChange={(val) => {
                      setValue("warehouse_type", val.value, {
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
                        isChecked: methods.watch("is_active"),
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
                isLoading={
                  addWareHouseSubTypeApiIsLoading ||
                  updateWareHouseSubTypeApiIsLoading
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
}

export default AddEditFormWareHouseSubTypeMaster;

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
