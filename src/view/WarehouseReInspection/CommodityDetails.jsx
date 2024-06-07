/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
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
  Textarea,
} from "@chakra-ui/react";

import ReactSelect from "react-select";
import {
  // useAddInspectionMasterMutation,
  useGetCommodityFreeMasterMutation,
  useGetPrimaryCommodityTypeMutation,
} from "../../features/master-api-slice";
// import { numberToWords } from "../../services/common.service";

// import { showToastByStatusCode } from "../../services/showToastByStatusCode";

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

const InsuranceCommodity = [
  { label: "GGWPL", value: "ggwpl" },
  { label: "Client", value: "client" },
  { label: "Bank", value: "bank" },
  { label: "Client", value: "client" },
];

const CommodityInward = [
  {
    label: "Fresh Stock",
    value: "FS",
  },
  {
    label: "Pre-Stacked",
    value: "PS",
  },
  // {
  //   label: "Take Over",
  //   value: "TO",
  // },
];

const CommodityDetails = React.memo(
  ({ mainFormsMethod, commodity_details_form_schema, saveFunction }) => {
    let { register, setValue, getValues, watch, errors } = mainFormsMethod;

    // state variable ..
    const [selectBoxOptions, setSelectBoxOptions] = useState({});

    // commodity type api start

    const [
      getPrimaryCommodityType,
      // eslint-disable-next-line
      // { isLoading: getPrimaryCommodityTypeApiIsLoading },
    ] = useGetPrimaryCommodityTypeMutation();

    const getAllPrimaryCommodity = useCallback(async () => {
      try {
        const response = await getPrimaryCommodityType().unwrap();

        // console.log("Success:", response);
        let onlyActive = response?.results?.filter((item) => item.is_active);
        let arr = onlyActive?.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        // console.log(arr);

        setSelectBoxOptions((prev) => ({
          ...prev,
          primary_commodity_name: arr,
        }));
      } catch (error) {
        console.error("Error:", error);
      }
    }, []);

    useEffect(() => {
      getAllPrimaryCommodity();
      // eslint-disable-next-line
    }, [getAllPrimaryCommodity]);
    // eslint-disable-next-line
    const [enteredNumber, setEnteredNumber] = useState("");

    // ! commented un used function ..
    // const convertNumberToWords = (number) => {
    //   const words = numberToWords(number);
    //   return words ? words : "Zero";
    // };

    useEffect(() => {
      const subscription = watch((value, { name: fieldName }) => {
        const inputValue = parseFloat(value?.[fieldName]);
        setEnteredNumber(isFinite(inputValue) ? inputValue : "");
      });
      return () => subscription.unsubscribe();
    }, [watch]);

    // commodity type api end

    //commodity master api start

    const [getCommodityMaster, { isLoading: getCommodityMasterApiIsLoading }] =
      useGetCommodityFreeMasterMutation();

    // ? memoized function ...
    const getCommodityMasterList = useCallback(async () => {
      try {
        const response = await getCommodityMaster().unwrap();
        // console.log("getCommodityMasterList:", response);
        if (response.status === 200) {
          setSelectBoxOptions((prev) => ({
            ...prev,
            community: response?.data?.map(({ commodity_name, id }) => ({
              label: commodity_name,
              value: id,
            })),
          }));
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }, []);

    useEffect(() => {
      getCommodityMasterList();
      // eslint-disable-next-line
    }, [getCommodityMasterList]);

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
          {/* -------------- Insurance of commodity taken by ------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  Insurance of commodity taken by  -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                {" "}
                Insurance of commodity taken by{" "}
                <span
                  style={{
                    color: "red",
                    marginLeft: "4px",
                  }}
                >
                  *
                </span>
              </Text>
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <ReactSelect
                  options={InsuranceCommodity || []}
                  value={
                    InsuranceCommodity?.filter(
                      (item) =>
                        item.value ===
                        getValues(
                          commodity_details_form_schema?.commodity_insurance
                        )
                    )[0] || null
                  }
                  isDisabled={getValues("form_edit")}
                  {...register(
                    commodity_details_form_schema?.commodity_insurance
                  )}
                  onChange={(val) => {
                    setValue(
                      commodity_details_form_schema?.commodity_insurance,
                      val?.value,
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
                        commodity_details_form_schema?.commodity_insurance
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

          {/* -------------- Commodity Name ------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* -------------- Commodity Name -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Commodity Name
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
                  errors?.[commodity_details_form_schema.expected_commodity]
                    ?.message
                }
              >
                <ReactSelect
                  options={selectBoxOptions?.community || []}
                  isMulti={true}
                  isLoading={getCommodityMasterApiIsLoading}
                  value={
                    selectBoxOptions?.community?.filter((item) =>
                      getValues(
                        commodity_details_form_schema.expected_commodity
                      )?.some((old) => old.commodity_id === item.value)
                    ) || []
                  }
                  isDisabled={getValues("form_edit")}
                  {...register(
                    commodity_details_form_schema?.expected_commodity
                  )}
                  onChange={(val) => {
                    const tempArr = val.map((item) => ({
                      commodity_id: item.value,
                    }));
                    setValue(
                      commodity_details_form_schema?.expected_commodity,
                      tempArr,
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
                        commodity_details_form_schema?.expected_commodity
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

          {/* -------------- Commodity inward type ------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  Commodity inward type  -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                {" "}
                Commodity inward type{" "}
                <span
                  style={{
                    color: "red",
                    marginLeft: "4px",
                  }}
                >
                  *
                </span>
              </Text>
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <ReactSelect
                  options={CommodityInward || []}
                  value={
                    CommodityInward?.filter(
                      (item) =>
                        item.value ===
                        getValues(
                          commodity_details_form_schema?.commodity_inward_type
                        )
                    )[0] || null
                  }
                  isDisabled={getValues("form_edit")}
                  {...register(
                    commodity_details_form_schema?.commodity_inward_type
                  )}
                  onChange={(val) => {
                    if (val?.value !== "PS") {
                      setValue(commodity_details_form_schema.no_of_bags, null, {
                        shouldValidate: true,
                      });
                      setValue(commodity_details_form_schema.weight, null, {
                        shouldValidate: true,
                      });
                      setValue(
                        commodity_details_form_schema.total_value,
                        null,
                        {
                          shouldValidate: true,
                        }
                      );
                      setValue(
                        commodity_details_form_schema.prestack_commodity,
                        null,
                        {
                          shouldValidate: true,
                        }
                      );
                    }
                    setValue(
                      commodity_details_form_schema?.commodity_inward_type,
                      val?.value,
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
                        commodity_details_form_schema?.commodity_inward_type
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

          {getValues(commodity_details_form_schema?.commodity_inward_type) ===
          "PS" ? (
            <>
              {/* -------------- Commodity Name ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* -------------- Commodity Name -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Pre Stack Commodity Name
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
                      errors?.[commodity_details_form_schema.prestack_commodity]
                        ?.message
                    }
                  >
                    <ReactSelect
                      options={selectBoxOptions?.community || []}
                      isMulti={false}
                      isLoading={getCommodityMasterApiIsLoading}
                      value={
                        selectBoxOptions?.community?.filter(
                          (item) =>
                            item.value ===
                            getValues(
                              commodity_details_form_schema.prestack_commodity
                            )
                        )[0] || {}
                      }
                      isDisabled={getValues("form_edit")}
                      {...register(
                        commodity_details_form_schema?.prestack_commodity
                      )}
                      onChange={(val) => {
                        setValue(
                          commodity_details_form_schema?.prestack_commodity,
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
                            commodity_details_form_schema?.prestack_commodity
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

              {/* -------------- No. of bags (Layer-wise PV details) ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* -------------- No. of bags (Layer-wise PV details) -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    No. of bags (Layer-wise PV details)
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
                      errors?.[commodity_details_form_schema.no_of_bags]
                        ?.message
                    }
                  >
                    <Input
                      type="number"
                      {...register(commodity_details_form_schema.no_of_bags)}
                      border="1px"
                      step={0.01}
                      borderColor="gray.10"
                      isDisabled={getValues("form_edit")}
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
                      placeholder="No. of bags"
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              {/* -------------- Weight (MTs) with wt. records ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* -------------- Weight (MTs) with wt. records -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Weight (MTs) with wt. records
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
                      errors?.[commodity_details_form_schema.weight]?.message
                    }
                  >
                    <Input
                      type="number"
                      {...register(commodity_details_form_schema.weight)}
                      border="1px"
                      step={0.01}
                      borderColor="gray.10"
                      isDisabled={getValues("form_edit")}
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
                      placeholder="Weight"
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              {/* -------------- Total Value (Rs. in lacs) ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* -------------- Total Value (Rs. in lacs) -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Total Value
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
                      errors?.[commodity_details_form_schema.total_value]
                        ?.message
                    }
                  >
                    <Input
                      type="number"
                      {...register(commodity_details_form_schema.total_value)}
                      border="1px"
                      step={0.01}
                      borderColor="gray.10"
                      isDisabled={getValues("form_edit")}
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      // value={enteredNumber}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Total Value"
                    />
                    {/* {enteredNumber !== "" && (
                    <Text textAlign="left" textColor={"primary.700"}>
                      {convertNumberToWords(enteredNumber)}
                    </Text>
                  )} */}
                  </FormControl>
                </GridItem>
              </Grid>

              {/* -------------- Pre-stack Commodity Funded by any other bank ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* --------------  Pre-stack Commodity Funded by any other bank -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Pre-stack Commodity Funded by any other bank
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
                      errors?.[commodity_details_form_schema.pre_funded_flag]
                        ?.message
                    }
                  >
                    <Box>
                      <RadioGroup
                        p="0"
                        isDisabled={getValues("form_edit")}
                        value={
                          getValues(
                            commodity_details_form_schema.pre_funded_flag
                          ) || "false"
                        }
                        name={commodity_details_form_schema.pre_funded_flag}
                        onChange={(e) => {
                          setValue(
                            commodity_details_form_schema.pre_funded_flag,
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

          {getValues(commodity_details_form_schema?.pre_funded_flag) ===
          "true" ? (
            <>
              {/* --------------  Bank name ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* -------------- Bank name -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Bank name
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
                      errors?.[commodity_details_form_schema.pre_funded_bank]
                        ?.message
                    }
                  >
                    <ReactSelect
                      options={selectBoxOptions?.community || []}
                      isMulti={true}
                      isLoading={getCommodityMasterApiIsLoading}
                      value={
                        selectBoxOptions?.community?.filter((item) =>
                          getValues(
                            commodity_details_form_schema.pre_funded_bank
                          )?.some((old) => old.commodity_id === item.value)
                        ) || []
                      }
                      isDisabled={getValues("form_edit")}
                      {...register(
                        commodity_details_form_schema?.pre_funded_bank
                      )}
                      onChange={(val) => {
                        const tempArr = val.map((item) => ({
                          commodity_id: item.value,
                        }));
                        setValue(
                          commodity_details_form_schema?.pre_funded_bank,
                          tempArr,
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
                            commodity_details_form_schema?.pre_funded_bank
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

              {/* -------------- Branch name ------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                {/* -------------- Branch name -------------- */}
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Branch name
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
                      errors?.[commodity_details_form_schema.pre_funded_branch]
                        ?.message
                    }
                  >
                    <ReactSelect
                      options={selectBoxOptions?.community || []}
                      isMulti={true}
                      isLoading={getCommodityMasterApiIsLoading}
                      value={
                        selectBoxOptions?.community?.filter((item) =>
                          getValues(
                            commodity_details_form_schema.pre_funded_branch
                          )?.some((old) => old.commodity_id === item.value)
                        ) || []
                      }
                      isDisabled={getValues("form_edit")}
                      {...register(
                        commodity_details_form_schema?.pre_funded_branch
                      )}
                      onChange={(val) => {
                        const tempArr = val.map((item) => ({
                          commodity_id: item.value,
                        }));
                        setValue(
                          commodity_details_form_schema?.pre_funded_branch,
                          tempArr,
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
                            commodity_details_form_schema?.pre_funded_branch
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

export default CommodityDetails;
