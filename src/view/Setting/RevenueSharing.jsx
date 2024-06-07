/* eslint-disable react-hooks/exhaustive-deps */
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";

// import * as Yup from "yup";

// import { showToastByStatusCode } from "../../services/showToastByStatusCode";

// ! commented un used validation schema ..
// const validationSchema = Yup.object().shape({
//   insurance_p_a: Yup.number().required("Insurance is required").typeError(""),
//   // no_of_bags_utilization: Yup.number()
//   //   .required("Leased Utilization is required")
//   //   .typeError(""),
//   no_of_bags_utilization: Yup.number()
//     .required("Revenue Sharing Utilization is required")
//     .typeError(""),
//   allaway_space: Yup.number()
//     .required("Allaway Space is required")
//     .typeError(""),
//   fumigation_Rs_PMT: Yup.number()
//     .required("Fumigation is required")
//     .typeError(""),
//   profit_in_MT: Yup.number().required("Profit is required").typeError(""),
//   supervisor_salary: Yup.number()
//     .required("Supervisor Salary is required")
//     .typeError(""),
//   security_guard_salary: Yup.number()
//     .required("New Security Guard Salary is required")
//     .typeError(""),
// });

const RevenueSharing = ({ mainFormsMethod, revenue_sharing_form_schema }) => {
  let { register, errors } = mainFormsMethod;

  // const [addPbpmConfiguration, { isLoading: addPbpmConfigurationApiLoading }] =
  //   useAddPbpmConfigurationMutation();

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

  // const onSubmit = (data) => {
  //   updateData(data);
  //   console.log("data", data);

  //   // Add your logic to handle the form submission here
  // };

  // // calling Get api start
  // const [getPbpmConfiguration] = useGetPbpmConfigurationMutation();

  // const getPbpmConfigurationData = async () => {
  //   try {
  //     const response = await getPbpmConfiguration("?type=revenue_sharing").unwrap();
  //     console.log("responsePBPM", response);

  //     // Update the form data state with the API response

  //     let obj = {
  //       insurance_p_a: response?.data?.insurance_p_a || 0,
  //       // no_of_bags_utilization: response?.data?.no_of_bags_utilization || 0,
  //       no_of_bags_utilization:
  //         response?.data?.no_of_bags_utilization || 0,
  //       allaway_space: response?.data?.allaway_space || 0,
  //       fumigation_Rs_PMT: response?.data?.fumigation_Rs_PMT || 0,
  //       profit_in_MT: response?.data?.profit_in_MT || 0,
  //       supervisor_salary: response?.data?.supervisor_salary || 0,
  //       security_guard_salary: response?.data?.security_guard_salary || 0,
  //     };

  //     Object.keys(obj).forEach(function (key) {
  //       console.log("key value test : " + key + " : " + obj[key]);
  //       setValue(key, obj[key], { shouldValidate: true });
  //     });
  //   } catch (error) {
  //     console.log("error: " + error);
  //   }
  // };

  // calling Get api End

  //on submit calling patch api start

  // const [updatePbpmConfiguration] = useUpdatePbpmConfigurationMutation();

  // const updateData = async (data) => {
  //   try {
  //     const response = await updatePbpmConfiguration({
  //       ...data,
  //       id: 1,
  //     }).unwrap();

  //     if (response.status === 200) {
  //       toasterAlert(response);
  //     }
  //     console.log("update pbpm res", response);
  //   } catch (error) {
  //     console.log("error: " + error);
  //     toasterAlert(error);
  //   }
  // };
  //on submit calling patch api End

  // useEffect(() => {
  //   getPbpmConfigurationData();
  // }, []);

  return (
    <>
      <Box bgColor={"white"} borderRadius={"10px"}>
        {/* <Text fontSize={"20px"} p={5}>
            PBPM Configuration
          </Text> */}
        <Box p={4}>
          {/* <form onSubmit={handleSubmit(onSubmit)}> */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <FormLabel textAlign={"right"}>
                Insurance (%) <span style={{ color: "red" }}>*</span>
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                id="revenue_insurance_p_a"
                isInvalid={errors.revenue_insurance_p_a}
              >
                <Input
                  type="number"
                  step={"0.1"}
                  {...register(
                    revenue_sharing_form_schema.revenue_insurance_p_a
                  )}
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Insurance"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />

                <FormErrorMessage>
                  {errors.revenue_insurance_p_a &&
                    errors.revenue_insurance_p_a.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          {/* <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <FormLabel textAlign="right">
                    Leased Utilization (%) <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                </GridItem>
                <GridItem colSpan={{ base: 2 }}>
                  <FormControl
                    id="no_of_bags_utilization"
                    isInvalid={errors.no_of_bags_utilization}
                  >
                    <Input
                      type="number"
                      step={"0.1"}
                      {...register("no_of_bags_utilization")}
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Leased Utilization"
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                    />
                    <FormErrorMessage>
                      {errors.no_of_bags_utilization &&
                        errors.no_of_bags_utilization.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
              </Grid> */}

          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <FormLabel textAlign="right">
                Revenue Sharing Utilization (%){" "}
                <span style={{ color: "red" }}>*</span>
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                id="revenue_no_of_bags_utilization"
                isInvalid={errors.revenue_no_of_bags_utilization}
              >
                <Input
                  type="number"
                  step={"0.1"}
                  {...register(
                    revenue_sharing_form_schema.revenue_no_of_bags_utilization
                  )}
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder=" Revenue Sharing Utilization"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
                <FormErrorMessage>
                  {errors.revenue_no_of_bags_utilization &&
                    errors.revenue_no_of_bags_utilization.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <FormLabel textAlign="right">
                Allaway Space (%) <span style={{ color: "red" }}>*</span>
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                id="revenue_allaway_space"
                isInvalid={errors.revenue_allaway_space}
              >
                <Input
                  type="number"
                  step={"0.1"}
                  {...register(
                    revenue_sharing_form_schema.revenue_allaway_space
                  )}
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Allaway Space"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
                <FormErrorMessage>
                  {errors.revenue_allaway_space &&
                    errors.revenue_allaway_space.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <FormLabel textAlign="right">
                Fumigation (Rs/mT) <span style={{ color: "red" }}>*</span>
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                id="revenue_fumigation_Rs_PMT"
                isInvalid={errors.revenue_fumigation_Rs_PMT}
              >
                <Input
                  type="number"
                  step={"0.1"}
                  {...register(
                    revenue_sharing_form_schema.revenue_fumigation_Rs_PMT
                  )}
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Fumigation "
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
                <FormErrorMessage>
                  {errors.revenue_fumigation_Rs_PMT &&
                    errors.revenue_fumigation_Rs_PMT.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <FormLabel textAlign="right">
                Profit (%) <span style={{ color: "red" }}>*</span>
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                id="revenue_profit_in_MT"
                isInvalid={errors.revenue_profit_in_MT}
              >
                <Input
                  type="number"
                  step={"0.1"}
                  {...register(
                    revenue_sharing_form_schema.revenue_profit_in_MT
                  )}
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Profit"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
                <FormErrorMessage>
                  {errors.revenue_profit_in_MT &&
                    errors.revenue_profit_in_MT.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <FormLabel textAlign="right">
                Supervisor Salary (Rs) <span style={{ color: "red" }}>*</span>
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                id="revenue_supervisor_salary"
                isInvalid={errors.revenue_supervisor_salary}
              >
                <Input
                  type="number"
                  step={"0.1"}
                  {...register(
                    revenue_sharing_form_schema.revenue_supervisor_salary
                  )}
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Supervisor Salary"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
                <FormErrorMessage>
                  {errors.revenue_supervisor_salary &&
                    errors.revenue_supervisor_salary.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <FormLabel textAlign="right">
                New Security Guard Salary (Rs){" "}
                <span style={{ color: "red" }}>*</span>
              </FormLabel>
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                id="revenue_security_guard_salary"
                isInvalid={errors.revenue_security_guard_salary}
              >
                <Input
                  type="number"
                  step={"0.1"}
                  {...register(
                    revenue_sharing_form_schema.revenue_security_guard_salary
                  )}
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder=" New Security Guard Salary"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />

                <FormErrorMessage>
                  {errors.revenue_security_guard_salary &&
                    errors.revenue_security_guard_salary.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>
          {/* <Flex justify="flex-end" mt={4} gap={4}>
                <Button
                  mt={4}
                  backgroundColor={"primary.700"}
                  _hover={{ backgroundColor: "primary.700" }}
                  color={"white"}
                  my={"4"}
                  px={"10"}
                  marginRight="0"
                  borderRadius={"full"}
                  type="submit"
                >
                  Submit
                </Button>
              </Flex> */}
          {/* </form> */}
        </Box>
      </Box>
    </>
  );
};
export default RevenueSharing;

// ! commented the un used toastAlert function ..

// const toasterAlert = (obj) => {
//   let msg = obj?.message;
//   let status = obj?.status;
//   if (status === 400) {
//     const errorData = obj.data;
//     let errorMessage = "";

//     Object.keys(errorData).forEach((key) => {
//       const messages = errorData[key];
//       messages.forEach((message) => {
//         errorMessage += `${key} : ${message} \n`;
//       });
//     });
//     showToastByStatusCode(status, errorMessage);
//     return false;
//   }
//   showToastByStatusCode(status, msg);
// };
