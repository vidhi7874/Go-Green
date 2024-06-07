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
  Textarea,
} from "@chakra-ui/react";

import ReactSelect from "react-select";
// import { showToastByStatusCode } from "../../services/showToastByStatusCode";
// import { useAddInspectionMasterMutation } from "../../features/master-api-slice";

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

const typeOfLicensedOptions = [
  { label: "Licensed", value: "licensed" },
  { label: "Unlicensed", value: "unlicensed" },
];

const WarehouseSubDetails = React.memo(
  ({ mainFormsMethod, warehouse_sub_details_form_schema, saveFunction }) => {
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
          {/* -------------- Type of Licensed------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  Type of Licensed -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Type of Licensed{" "}
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
              <FormControl style={{ w: commonWidth.w }}>
                <ReactSelect
                  options={typeOfLicensedOptions || []}
                  value={
                    typeOfLicensedOptions?.filter(
                      (item) =>
                        item.value ===
                        getValues(
                          warehouse_sub_details_form_schema.license_type
                        )
                    )[0] || null
                  }
                  {...register(warehouse_sub_details_form_schema?.license_type)}
                  onChange={(val) => {
                    setValue(
                      warehouse_sub_details_form_schema.license_type,
                      val?.value,
                      {
                        shouldValidate: true,
                      }
                    );
                  }}
                  isDisabled={getValues("form_edit")}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      borderColor: errors?.[
                        warehouse_sub_details_form_schema.license_type
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
          {/* -------------- Licensed Number------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  Licensed Number -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">Licensed Number</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[warehouse_sub_details_form_schema.license_number]
                    ?.message
                }
              >
                <Input
                  type="text"
                  {...register(
                    warehouse_sub_details_form_schema.license_number
                  )}
                  border="1px"
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
                  placeholder="Licensed Number"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* -------------- Licensed Start date------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  Licensed Number -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">Licensed Start date</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[warehouse_sub_details_form_schema.license_start_date]
                    ?.message
                }
              >
                <Input
                  type="date"
                  {...register(
                    warehouse_sub_details_form_schema.license_start_date
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
                  placeholder=""
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* -------------- Licensed start date------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  Licensed Number -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">Licensed End date</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[warehouse_sub_details_form_schema.license_end_date]
                    ?.message
                }
              >
                <Input
                  type="date"
                  {...register(
                    warehouse_sub_details_form_schema.license_end_date
                  )}
                  border="1px"
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
                  placeholder=""
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* -------------- WDRA Licensed Number------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  WDRA Licensed Number -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">WDRA Licensed Number</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[
                    warehouse_sub_details_form_schema.wdra_license_number
                  ]?.message
                }
              >
                <Input
                  type="text"
                  {...register(
                    warehouse_sub_details_form_schema.wdra_license_number
                  )}
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  isDisabled={getValues("form_edit")}
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
                  placeholder=""
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* -------------- WDRA Licensed Start date------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  WDRA Licensed Start date -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">WDRA Licensed Start Date</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[
                    warehouse_sub_details_form_schema.wdra_license_start_date
                  ]?.message
                }
              >
                <Input
                  type="date"
                  {...register(
                    warehouse_sub_details_form_schema.wdra_license_start_date
                  )}
                  border="1px"
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
                  placeholder=""
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* -------------- WDRA Licensed End Date------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  WDRA Licensed End Date -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">WDRA Licensed End Date</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[
                    warehouse_sub_details_form_schema.wdra_license_end_date
                  ]?.message
                }
              >
                <Input
                  type="date"
                  {...register(
                    warehouse_sub_details_form_schema.wdra_license_end_date
                  )}
                  border="1px"
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
                  placeholder=""
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* -------------- FSSAI Licensed Number------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  FSSAI Licensed Number -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">FSSAI Licensed Number</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[
                    warehouse_sub_details_form_schema.fssai_license_number
                  ]?.message
                }
              >
                <Input
                  type="text"
                  {...register(
                    warehouse_sub_details_form_schema.fssai_license_number
                  )}
                  border="1px"
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
                  placeholder=""
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* -------------- fssai_license_start_date------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  fssai_license_start_date -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">FSSAI Licensed Start Date</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[
                    warehouse_sub_details_form_schema.fssai_license_start_date
                  ]?.message
                }
              >
                <Input
                  type="date"
                  {...register(
                    warehouse_sub_details_form_schema.fssai_license_start_date
                  )}
                  border="1px"
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
                  placeholder=""
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* -------------- fssai_license_end_date------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  fssai_license_end_date -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">FSSAI Licensed End Date</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[
                    warehouse_sub_details_form_schema.fssai_license_end_date
                  ]?.message
                }
              >
                <Input
                  type="date"
                  {...register(
                    warehouse_sub_details_form_schema.fssai_license_end_date
                  )}
                  border="1px"
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
                  placeholder=""
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* -------------- Mandi Licensed Number------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  Mandi Licensed Number -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">Mansi Licensed Number</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[
                    warehouse_sub_details_form_schema.fssai_license_number
                  ]?.message
                }
              >
                <Input
                  type="text"
                  {...register(
                    warehouse_sub_details_form_schema.fssai_license_number
                  )}
                  border="1px"
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
                  placeholder=""
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* -------------- fssai_license_start_date------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  fssai_license_start_date -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">FSSAI Licensed Start Date</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[
                    warehouse_sub_details_form_schema.fssai_license_start_date
                  ]?.message
                }
              >
                <Input
                  type="date"
                  {...register(
                    warehouse_sub_details_form_schema.fssai_license_start_date
                  )}
                  border="1px"
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
                  placeholder=""
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* -------------- fssai_license_end_date------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  fssai_license_end_date -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              {" "}
              <Text textAlign="right">FSSAI Licensed End Date</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                isInvalid={
                  errors?.[
                    warehouse_sub_details_form_schema.fssai_license_end_date
                  ]?.message
                }
              >
                <Input
                  type="date"
                  {...register(
                    warehouse_sub_details_form_schema.fssai_license_end_date
                  )}
                  border="1px"
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
                  placeholder=""
                />
              </FormControl>
            </GridItem>
          </Grid>
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

export default WarehouseSubDetails;
