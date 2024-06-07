import { MotionSlideUp } from "../../utils/animation";
import { Box, Button, Grid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import generateFormField from "../../components/Elements/GenerateFormField";
import { addEditFormFields, schema } from "./fields";
import {
  useGetStateMasterMutation,
  useAddHiringProposalMasterMutation,
  useUpdateHiringProposalMasterMutation,
} from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ROUTE_PATH from "../../constants/ROUTE";

function AddEditFormHiringProposalMaster() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  const details = location.state?.details;
  console.log("details ---> ", details);

  const onSubmit = (data) => {
    console.log("data==>", data);
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };
  // for clear data in form
  const clearForm = () => {
    // const defaultValues = methods.getValues();
    // Object.keys(defaultValues).forEach((key) => {
    //   setValue(key, "", {
    //   shouldValidate: true,
    // });
    // });
  };

  const [getStateMaster] = useGetStateMasterMutation();

  const [
    addHiringProposalMaster,
    { isLoading: addHiringProposalMasterApiIsLoading },
  ] = useAddHiringProposalMasterMutation();

  const [
    updateHiringProposalMaster,
    { isLoading: updateHiringProposalMasterApiIsLoading },
  ] = useUpdateHiringProposalMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addHiringProposalMaster(data).unwrap();
      console.log("add Hiring Proposal Master  res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.WAREHOUSE_PROPOSAL}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  const getAllStateMaster = async () => {
    try {
      const response = await getStateMaster().unwrap();
      console.log("response ", response);
      let arr = response?.results.map((item) => ({
        label: item.state_name,
        value: item.id,
      }));

      console.log(arr);

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

  const updateData = async (data) => {
    try {
      const response = await updateHiringProposalMaster(data).unwrap();
      if (response.status === 200) {
        console.log("update Hiring Proposal Master res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.WAREHOUSE_PROPOSAL}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  useEffect(() => {
    if (details?.id) {
      let obj = {
        warehouse_type: details.warehouse_type,
        warehouse_subtype: details.warehouse_subtype,
        warehouse_name: details.warehouse_name,
        region: details.region,
        state: details.state,
        // warehouse_type: details.warehouse_type,
        district: details.district,
        area: details.area,
        warehouse_address: details.warehouse_address,
        warehouse_pincode: details.warehouse_pincode,
        no_of_chambers: details.no_of_chambers,
        standard_capacity: details.standard_capacity,

        currrent_capacity: details.currrent_capacity,
        currrent_utilised_capacity: details.currrent_utilised_capacity,
        no_of_warehouse_in_area: details.no_of_warehouse_in_area,
        lock_in_period: details.lock_in_period,
        lock_in_period_month: details.lock_in_period_month,
        covered_area: details.covered_area,
        supervisor_day_shift: details.supervisor_day_shift,
        supervisor_night_shift: details.supervisor_night_shift,
        security_guard_day_shift: details.security_guard_day_shift,
        security_guard_night_shift: details.security_guard_night_shift,
        expected_commodity: details.expected_commodity,

        commodity_inward_type: details.commodity_inward_type,
        prestack_commodity: details.prestack_commodity,
        prestack_commodity_qty: details.prestack_commodity_qty,

        banker_id: details.banker_id,
        rent: details.rent,
        gg_revenue_ratio: details.gg_revenue_ratio,
        security_deposit_month: details.security_deposit_month,
        advance_rent: details.advance_rent,
        advance_rent_month: details.advance_rent_month,
        notice_period_month: details.notice_period_month,
        remarks: details.remarks,
        l1_user: details.l1_user,
        l2_user: details.l2_user,
        // warehouse_type: details.warehouse_type,
        // warehouse_type: details.warehouse_type,

        active: details.active,
      };

      console.log(obj);

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
    const breadcrumbArray = [
      // {
      //   title: "Manage Warehouse",
      //   link: "/hiring-proposal-master",
      // },
      {
        title: " Hiring Proposal Master",
        link: `${ROUTE_PATH.WAREHOUSE_PROPOSAL}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
  }, [details]);

  useEffect(() => {
    getAllStateMaster();
    // setAddEditFormFieldsList(addEditFormFields);
    // eslint-disable-next-line
  }, []);
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
                        isChecked: details?.active,
                        style: {
                          mb: 2,
                          mt: 2,
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
                  addHiringProposalMasterApiIsLoading ||
                  updateHiringProposalMasterApiIsLoading
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
export default AddEditFormHiringProposalMaster;

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
