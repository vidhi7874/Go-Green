import {
  Box,
  FormControl,
  Grid,
  GridItem,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";

const InsurancePolicy = ({
  mainFormsMethod,
  insurance_policy_day_count_schema,
}) => {
  let { register, errors } = mainFormsMethod;
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
  return (
    <Box>
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
          {/* Expire Insurance Policy Day Count*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Expire Insurance Policy Day Count</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                id="insurance_policy_day_count"
                isInvalid={errors.insurance_policy_day_count}
              >
                <Input
                  {...register(
                    insurance_policy_day_count_schema.insurance_policy_day_count
                  )}
                  type="text"
                  border="1px"
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
                  placeholder="Expire Insurance Policy Day Count"
                />
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default InsurancePolicy;
