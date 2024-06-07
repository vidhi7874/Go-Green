import {
  Box,
  FormControl,
  Grid,
  GridItem,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";

const Warehouse = ({ mainFormsMethod, warehouse_block_days_schema }) => {
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
          {/* Warehouse Block Day Count*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Warehouse Block Day Count</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                id="warehouse_block_days"
                isInvalid={errors.warehouse_block_days}
              >
                <Input
                  {...register(
                    warehouse_block_days_schema.warehouse_block_days
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
                  placeholder="Warehouse Block Day Count"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* warehouse expiry day count for service contract*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                warehouse expiry day count for service contract
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                id="warehouse_expiry_day_count_for_service_contract"
                isInvalid={
                  errors.warehouse_expiry_day_count_for_service_contract
                }
              >
                <Input
                  {...register(
                    warehouse_block_days_schema.warehouse_expiry_day_count_for_service_contract
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
                  placeholder="warehouse expiry day count for service contract"
                />
              </FormControl>
            </GridItem>
          </Grid>

             {/* Max stack count for service contract*/}
             <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Max Stack Count
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl
                style={{ w: commonWidth.w }}
                id="max_stack_count"
                isInvalid={
                  errors.max_stack_count
                }
              >
                <Input
                  {...register(
                    warehouse_block_days_schema.max_stack_count
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
                  placeholder="Max Stack Count"
                />
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Warehouse;
