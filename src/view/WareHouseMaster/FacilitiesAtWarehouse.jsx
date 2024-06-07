import React from "react";
import {
  Box,
  FormControl,
  Grid,
  GridItem,
  Input,
  Text,
} from "@chakra-ui/react";

const FacilitiesAtWarehouse = ({ warehouseDetailsData }) => {
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
    <>
      <Box bg={"White"} p={3}>
        <Box
          w={{
            base: "100%",
            sm: "100%",
            md: "100%",
            lg: "100%",
            xl: "100%",
          }}
        >
          {/*Availability of Weighment facility**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Availability of Weighment facility*</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.warehouse_sub_detail
                  ?.weightment_facility === true
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Name of WEIGHBRIDGE*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Name of Weighbridge</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.weighbridge_name || ""}
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Name of Weighbridge"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Distance of WEIGHBRIDGE(Km)*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Distance of Weighbridge(Km)</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="number"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={
                    warehouseDetailsData?.warehouse_sub_detail
                      ?.weighbridge_distance || ""
                  }
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Distance of Weighbridge(Km)"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*Facility for maintaining required 
temperature & humidity**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Facility for maintaining required temperature & humidity*
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.warehouse_sub_detail
                  ?.temp_humidity_maintainance === true
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Availability of generator for 
stand-by power supply**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Availability of generator for stand-by power supply*
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.warehouse_sub_detail
                  ?.generator_available === true
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Insurance cover to plant & 
machinery in addition to building**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Insurance cover to plant & machinery in addition to building*
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.warehouse_sub_detail
                  ?.insurance_of_plant_machinary === true
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Whether insurance policy covers the losses due to deterioration of stocks on account of breakdown of plant machinery**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Whether insurance policy covers the losses due to deterioration
                of stocks on account of breakdown of plant machinery*
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.warehouse_sub_detail
                  ?.insurance_covers_stk_deter === true
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default FacilitiesAtWarehouse;
