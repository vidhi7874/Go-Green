import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useAddClientGstMasterMutation,
  useUpdateClientGstMasterMutation,
} from "../../features/master-api-slice";
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import { MotionSlideUp } from "../../utils/animation";
import { schema } from "./fields";
import generateFormField from "../../components/Elements/GenerateFormField";
import { yupResolver } from "@hookform/resolvers/yup";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

function AddEditClientGstMaster() {
  const navigate = useNavigate();
  // ! commented unused variable ..
  // const dispatch = useDispatch();
  const location = useLocation();

  const toasterAlert = (obj) => {
    let msg = obj?.message;
    let status = obj?.status;
    if (status === 400) {
      const errorData = obj?.data;
      let errorMessage = "";
      // console.log(obj, "here");
      if (
        obj?.data?.message === "" &&
        obj?.data !== undefined &&
        obj?.data !== null
      ) {
        Object.keys(errorData).forEach((key) => {
          const messages = errorData[key];

          messages.forEach((message) => {
            errorMessage += `${key} : ${message} \n`;
          });
        });
      } else {
        errorMessage = obj?.data?.message;
      }
      showToastByStatusCode(status, errorMessage);
      return false;
    }
    showToastByStatusCode(status, msg);
  };

  const details = location.state?.details;
  // console.log("details-->", details);

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  // eslint-disable-next-line
  const { setValue, getValues } = methods;
  // eslint-disable-next-line
  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  // Form Submit Function Start
  const onSubmit = (data) => {
    // console.log("data==>", data);

    // console.log("details", details);
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
      setValue(key, "", {
        shouldValidate: true,
      });
    });
  };
  // Form Clear Function End

  // Add BankBranch Api Start
  const [addClientGstMaster] = useAddClientGstMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addClientGstMaster(data).unwrap();
      // console.log("add Client gst master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate("/client-gst-master/");
      }
    } catch (error) {
      console.log("Error: " + error);
      toasterAlert(error);
    }
  };
  // Add BankBranch Api End

  // Update BankBranch Api Start
  const [updateClientGstMaster] = useUpdateClientGstMasterMutation();

  const updateData = async (data) => {
    try {
      const response = await updateClientGstMaster(data).unwrap();
      if (response.status === 200) {
        // console.log("update Client gst master res", response);
        toasterAlert(response);
        navigate("/client-gst-master/");
      }
    } catch (error) {
      console.log("Error:", error);
      toasterAlert(error);
    }
  };
  // Update BankBranch Api End

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
                        {item.label} <span style={{ color: "red" }}>*</span>
                      </Text>
                      {generateFormField({
                        ...item,
                        label: "",
                        // options: item.type === "select" && commodityTypeMaster,
                        isChecked: details?.is_active,
                        style: { mb: 1, mt: 1 },
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
                // isLoading={
                //   addBankBranchMasterApiIsLoading ||
                //   updateBankBranchMasterApiIsLoading
                // }
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

export default AddEditClientGstMaster;
