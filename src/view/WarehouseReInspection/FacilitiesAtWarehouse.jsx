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
import ReactSelect from "react-select";
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

const reactSelectStyle = {
  menu: (base) => ({
    ...base,
    // backgroundColor: "#A6CE39",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#A6CE39" : "white",
    color: state.isFocused ? "green" : "black",
    textAlign: "left",
    "&:hover": {
      //  backgroundColor: "#C2DE8C",
      color: "black",
    },
  }),
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

const weighType = [
  {
    label: "Manual",
    value: "manual",
  },
  {
    label: "Electronic",
    value: "electronic",
  },
];

const FacilitiesAtWarehouse = React.memo(
  ({ mainFormsMethod, facilities_at_warehouse_form_schema, saveFunction }) => {
    let { register, setValue, getValues, errors } = mainFormsMethod;

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
                        facilities_at_warehouse_form_schema.weightment_facility
                      ) || "false"
                    }
                    isDisabled={getValues("form_edit")}
                    name={
                      facilities_at_warehouse_form_schema.weightment_facility
                    }
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
                        type="text"
                        {...register(
                          facilities_at_warehouse_form_schema.weighbridge_name
                        )}
                        border="1px"
                        isDisabled={getValues("form_edit")}
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
                        type="number"
                        {...register(
                          facilities_at_warehouse_form_schema.weighbridge_distance
                        )}
                        border="1px"
                        isDisabled={getValues("form_edit")}
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

              {/* --------------  Type of Weighbridge ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* -------------- Type of Weighbridge -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Type of Weighbridge
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
                        facilities_at_warehouse_form_schema.weighbridge_type
                      ]?.message
                    }
                  >
                    <ReactSelect
                      options={weighType || []}
                      isMulti={false}
                      isLoading={false}
                      value={
                        weighType?.filter(
                          (item) =>
                            getValues(
                              facilities_at_warehouse_form_schema.weighbridge_type
                            ) === item.value
                        )?.[0] || {}
                      }
                      isDisabled={getValues("form_edit")}
                      {...register(
                        facilities_at_warehouse_form_schema?.weighbridge_type
                      )}
                      onChange={(val) => {
                        setValue(
                          facilities_at_warehouse_form_schema?.weighbridge_type,
                          val.value,
                          {
                            shouldValidate: true,
                          }
                        );
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.[
                            facilities_at_warehouse_form_schema
                              ?.weighbridge_type
                          ]?.message
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
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
