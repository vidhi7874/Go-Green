import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
// import { showToastByStatusCode } from "../../services/showToastByStatusCode";
// import { useAddInspectionMasterMutation } from "../../features/master-api-slice";

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

const FacilitiesAtWarehouse = React.memo(
  ({ mainFormsMethod, facilities_at_warehouse_form_schema, saveFunction }) => {
    let { register, setValue, getValues, errors } = mainFormsMethod;

    // console.log("error sub details", errors);

    // ! commented un used toast Alert function ...
    // const toasterAlert = (obj) => {
    //   let msg = obj?.message;
    //   let status = obj?.status;
    //   console.log("toasterAlert", obj);
    //   if (status === 400) {
    //     const errorData = obj?.data || obj?.data?.data;
    //     let errorMessage = "";

    //     Object.keys(errorData)?.forEach((key) => {
    //       const messages = errorData[key];
    //       console.log("messages --> ", messages);
    //       if (typeof messages === "object") {
    //         messages &&
    //           messages?.forEach((message) => {
    //             errorMessage += `${key} : ${message} \n`;
    //           });
    //       } else {
    //         showToastByStatusCode(status, msg);
    //       }
    //     });
    //     showToastByStatusCode(status, errorMessage);
    //     return false;
    //   } else if (status === 410) {
    //     showToastByStatusCode(status, msg);
    //   }
    //   showToastByStatusCode(status, msg);
    // };

    // ! commented un used rtk hook code ...
    // const [
    //   AddInspectionMaster,
    //   // { isLoading: addInspectionMasterApiIsLoading }
    // ] = useAddInspectionMasterMutation();

    // ! commented un used function saveAsDraft Function ...
    // const saveAsDraftFunction = async () => {
    //   const data = {
    //     id: getValues("id"),
    //     is_draft: true,
    //     [facilities_at_warehouse_form_schema?.weightment_facility]: getValues(
    //       facilities_at_warehouse_form_schema?.weightment_facility
    //     ),
    //     [facilities_at_warehouse_form_schema?.weighbridge_name]: getValues(
    //       facilities_at_warehouse_form_schema?.weighbridge_name
    //     ),
    //     [facilities_at_warehouse_form_schema?.weighbridge_distance]: getValues(
    //       facilities_at_warehouse_form_schema?.weighbridge_distance
    //     ),
    //     [facilities_at_warehouse_form_schema?.temp_humidity_maintainance]:
    //       getValues(
    //         facilities_at_warehouse_form_schema?.temp_humidity_maintainance
    //       ),
    //     [facilities_at_warehouse_form_schema?.generator_available]: getValues(
    //       facilities_at_warehouse_form_schema?.generator_available
    //     ),
    //     [facilities_at_warehouse_form_schema?.insurance_of_plant_machinary]:
    //       getValues(
    //         facilities_at_warehouse_form_schema?.insurance_of_plant_machinary
    //       ),
    //     [facilities_at_warehouse_form_schema?.insurance_covers_stk_deter]:
    //       getValues(
    //         facilities_at_warehouse_form_schema?.insurance_covers_stk_deter
    //       ),
    //   };

    //   try {
    //     const response = await AddInspectionMaster(data).unwrap();
    //     console.log("saveAsDraftData - Success:", response);
    //     if (response.status === 200) {
    //       console.log("response --> ", response);
    //       toasterAlert({
    //         message: "Form Inspection Drafted Successfully.",
    //         status: 200,
    //       });
    //     }
    //   } catch (error) {
    //     let errorMessage =
    //       error?.data?.data || error?.data?.message || "Save As Daft Failed";
    //     console.log("Error:", errorMessage);
    //     toasterAlert({
    //       message: JSON.stringify(errorMessage),
    //       status: 440,
    //     });
    //     console.error("Error:", error);
    //   }

    //   console.log(data, "data");
    // };

    return (
      <Box>
        <Box
          w={{
            base: "100%",
            sm: "100%",
            md: "100%",
            lg: "100%",
            xl: "100%",
          }}
        >
          {/* -------------- Availability of Weighment facility ------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  weightment_facility -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Availability of Weighment facility{" "}
                <span
                  style={{
                    color: "red",
                    marginLeft: "4px",
                  }}
                >
                  *
                </span>
              </Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[
                    facilities_at_warehouse_form_schema.weightment_facility
                  ]?.message
                }
              >
                <Box>
                  <RadioGroup
                    p="0"
                    value={
                      getValues(
                        `${facilities_at_warehouse_form_schema.weightment_facility}`
                      ) || "false"
                    }
                    // isDisabled={getValues("form_edit")}
                    isDisabled={false}
                    name={`${facilities_at_warehouse_form_schema.weightment_facility}`}
                    onChange={(e) => {
                      if (e === "false") {
                        setValue(
                          facilities_at_warehouse_form_schema.weighbridge_name,
                          null,
                          {
                            shouldValidate: true,
                          }
                        );
                        setValue(
                          facilities_at_warehouse_form_schema.weighbridge_distance,
                          null,
                          {
                            shouldValidate: true,
                          }
                        );
                      }
                      setValue(
                        facilities_at_warehouse_form_schema.weightment_facility,
                        e,
                        {
                          shouldValidate: true,
                        }
                      );
                    }}
                  >
                    <Stack spacing={5} direction="row">
                      <Radio colorScheme="radioBoxPrimary" value={"true"}>
                        Yes
                      </Radio>
                      <Radio colorScheme="radioBoxPrimary" value={"false"}>
                        No
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
              </FormControl>
            </GridItem>
          </Grid>

          {getValues(
            facilities_at_warehouse_form_schema.weightment_facility
          ) === "true" ? (
            <>
              {/* -------------- Name of WEIGHBRIDGE------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* --------------  Name of WEIGHBRIDGE -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Name of Weighbridge</Text>{" "}
                </GridItem>

                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    style={{ w: commonWidth.w }}
                    isInvalid={
                      errors?.[
                        facilities_at_warehouse_form_schema.weighbridge_name
                      ]?.message
                    }
                  >
                    <Box>
                      <Input
                        name={`${facilities_at_warehouse_form_schema.weighbridge_name}`}
                        type="text"
                        {...register(
                          `${facilities_at_warehouse_form_schema.weighbridge_name}`
                        )}
                        border="1px"
                        // isDisabled={getValues("form_edit")}
                        isDisabled={false}
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        //value={inputValue}
                        //  onChange={onChange}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        //  isDisabled={true}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Name of Weighbridge"
                      />
                    </Box>
                  </FormControl>
                </GridItem>
              </Grid>

              {/* -------------- Distance of WEIGHBRIDGE(Km)------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* --------------  Distance of WEIGHBRIDGE(Km) -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Distance of Weighbridge(Km)</Text>{" "}
                </GridItem>

                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    style={{ w: commonWidth.w }}
                    isInvalid={
                      errors?.[
                        facilities_at_warehouse_form_schema.weighbridge_distance
                      ]?.message
                    }
                  >
                    <Box>
                      <Input
                        name={`${facilities_at_warehouse_form_schema.weighbridge_distance}`}
                        type="number"
                        {...register(
                          `${facilities_at_warehouse_form_schema.weighbridge_distance}`
                        )}
                        border="1px"
                        // isDisabled={getValues("form_edit")}
                        isDisabled={false}
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        step={0.01}
                        height={"15px "}
                        borderRadius={"lg"}
                        //value={inputValue}
                        //  onChange={onChange}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        //  isDisabled={true}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Distance of Weighbridge(Km)"
                      />
                    </Box>
                  </FormControl>
                </GridItem>
              </Grid>
            </>
          ) : (
            <></>
          )}

          {Number(getValues("warehouse_unit_type") || 0) === 4 ? (
            <>
              {/* -------------- temp_humidity_maintainance ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* --------------  temp_humidity_maintainance -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Facility for maintaining required temperature & humidity{" "}
                    <span
                      style={{
                        color: "red",
                        marginLeft: "4px",
                      }}
                    >
                      *
                    </span>
                  </Text>{" "}
                </GridItem>

                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    style={{ w: commonWidth.w }}
                    isInvalid={
                      errors?.[
                        facilities_at_warehouse_form_schema
                          .temp_humidity_maintainance
                      ]?.message
                    }
                  >
                    <Box>
                      <RadioGroup
                        p="0"
                        value={
                          getValues(
                            facilities_at_warehouse_form_schema.temp_humidity_maintainance
                          ) || "false"
                        }
                        isDisabled={getValues("form_edit")}
                        name={
                          facilities_at_warehouse_form_schema.temp_humidity_maintainance
                        }
                        onChange={(e) => {
                          setValue(
                            facilities_at_warehouse_form_schema.temp_humidity_maintainance,
                            e,
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                      >
                        <Stack spacing={5} direction="row">
                          <Radio colorScheme="radioBoxPrimary" value={"true"}>
                            Yes
                          </Radio>
                          <Radio colorScheme="radioBoxPrimary" value={"false"}>
                            No
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                  </FormControl>
                </GridItem>
              </Grid>

              {/* -------------- generator_available ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* --------------  generator_available -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Availability of generator for stand-by power supply{" "}
                    <span
                      style={{
                        color: "red",
                        marginLeft: "4px",
                      }}
                    >
                      *
                    </span>
                  </Text>{" "}
                </GridItem>

                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    style={{ w: commonWidth.w }}
                    isInvalid={
                      errors?.[
                        facilities_at_warehouse_form_schema.generator_available
                      ]?.message
                    }
                  >
                    <Box>
                      <RadioGroup
                        p="0"
                        isDisabled={getValues("form_edit")}
                        value={
                          getValues(
                            facilities_at_warehouse_form_schema.generator_available
                          ) || "false"
                        }
                        name={
                          facilities_at_warehouse_form_schema.generator_available
                        }
                        onChange={(e) => {
                          setValue(
                            facilities_at_warehouse_form_schema.generator_available,
                            e,
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                      >
                        <Stack spacing={5} direction="row">
                          <Radio colorScheme="radioBoxPrimary" value={"true"}>
                            Yes
                          </Radio>
                          <Radio colorScheme="radioBoxPrimary" value={"false"}>
                            No
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                  </FormControl>
                </GridItem>
              </Grid>

              {/* -------------- insurance_of_plant_machinary ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* --------------  insurance_of_plant_machinary -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Insurance cover to plant & machinery in addition to building{" "}
                    <span
                      style={{
                        color: "red",
                        marginLeft: "4px",
                      }}
                    >
                      *
                    </span>
                  </Text>{" "}
                </GridItem>

                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    style={{ w: commonWidth.w }}
                    isInvalid={
                      errors?.[
                        facilities_at_warehouse_form_schema
                          .insurance_of_plant_machinary
                      ]?.message
                    }
                  >
                    <Box>
                      <RadioGroup
                        p="0"
                        isDisabled={getValues("form_edit")}
                        value={
                          getValues(
                            facilities_at_warehouse_form_schema.insurance_of_plant_machinary
                          ) || "false"
                        }
                        name={
                          facilities_at_warehouse_form_schema.insurance_of_plant_machinary
                        }
                        onChange={(e) => {
                          setValue(
                            facilities_at_warehouse_form_schema.insurance_of_plant_machinary,
                            e,
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                      >
                        <Stack spacing={5} direction="row">
                          <Radio colorScheme="radioBoxPrimary" value={"true"}>
                            Yes
                          </Radio>
                          <Radio colorScheme="radioBoxPrimary" value={"false"}>
                            No
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                  </FormControl>
                </GridItem>
              </Grid>

              {/* -------------- insurance_covers_stk_deter ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* --------------  insurance_covers_stk_deter -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Whether insurance policy covers the losses due to
                    deterioration of stocks on account of breakdown of plant
                    machinery{" "}
                    <span
                      style={{
                        color: "red",
                        marginLeft: "4px",
                      }}
                    >
                      *
                    </span>
                  </Text>{" "}
                </GridItem>

                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    style={{ w: commonWidth.w }}
                    isInvalid={
                      errors?.[
                        facilities_at_warehouse_form_schema
                          .insurance_covers_stk_deter
                      ]?.message
                    }
                  >
                    <Box>
                      <RadioGroup
                        p="0"
                        isDisabled={getValues("form_edit")}
                        value={
                          getValues(
                            facilities_at_warehouse_form_schema.insurance_covers_stk_deter
                          ) || "false"
                        }
                        name={
                          facilities_at_warehouse_form_schema.insurance_covers_stk_deter
                        }
                        onChange={(e) => {
                          setValue(
                            facilities_at_warehouse_form_schema.insurance_covers_stk_deter,
                            e,
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                      >
                        <Stack spacing={5} direction="row">
                          <Radio colorScheme="radioBoxPrimary" value={"true"}>
                            Yes
                          </Radio>
                          <Radio colorScheme="radioBoxPrimary" value={"false"}>
                            No
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                  </FormControl>
                </GridItem>
              </Grid>
            </>
          ) : (
            <></>
          )}

          {getValues("is_draftable") ? (
            <Flex gap="10px" justifyContent="end" alignItems="center">
              <Button
                bg="#A6CE39"
                _hover={{}}
                color="white"
                marginTop={"30px"}
                padding="0px 30px"
                borderRadius={"50px"}
                type="button"
                onClick={() => {
                  saveFunction();
                }}
              >
                Save As Draft
              </Button>
            </Flex>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    );
  }
);

export default FacilitiesAtWarehouse;
